(function() {
  var Sim = Simulator;

  var BucketSize = 180;
  var BucketBase = BucketSize / 2;
  var KernelSize = 1.5;
  var KernelFactor = 240;
  function Kernel(x) {
    x = Math.abs(x);
    if (x < 0.5) {
      return 0.75 - x * x;
    } else if (x < 1.5) {
      return 0.5 * (1.5 - x) * (1.5 - x);
    } else {
      return 0;
    }
  }
  var Buckets = [], HealBuckets = [];
  while (Buckets.length < Math.ceil((2 * KernelFactor * KernelSize - 1) / BucketSize) + 1) {
    Buckets.push(0);
    HealBuckets.push(0);
  }
  var TotalDamage = 0;
  var TotalDamage0 = 0;
  var TotalHealing = 0;
  var SkillCounters = {};
  var Sample = [];
  Sim._sample = Sample;

  Sim.targetHealth = {};
  Sim.targetDeath = {};
  var MaxHealth = undefined;
  var WhiteRatio = 0.2;

  var isDead = {};
  function onDeath(data) {
    if (isDead[Sim.target.index]) return;
    isDead[Sim.target.index] = true;
    Sim.trigger("onkill", {target: Sim.target.index, hit: data.hit});
    if (Sim.random("healthglobe", 0.15 + 0.01 * (Sim.stats.leg_rakoffsglassoflife || 0))) {
      Sim.trigger("onglobe");
    }
    Sim.rotateBuffs();
    var newIndex = Sim.target.index + Sim.target.count - Sim.target.eliteCount;
    if (Sim.target.index in Sim.targetDeath) {
      delete Sim.targetDeath[Sim.target.index];
    } else {
      delete Sim.targetHealth[Sim.target.index];
    }
    ++Sim.target.index;
    if (Sim.params.deathRate > 0) {
      var delay = Math.ceil(3600 / Sim.params.deathRate);
      Sim.targetDeath[newIndex] = Sim.after((Sim.target.count - Sim.target.eliteCount) * delay, onDeath, {index: newIndex});
    } else if (Sim.params.deathRate < 0) {
      Sim.targetHealth[newIndex] = MaxHealth * WhiteRatio;
    }
  }

  function SendReport() {
    Sim.postMessage({type: "chart", time: BucketBase, damage: Buckets.shift(), healing: HealBuckets.shift(), health: Math.max(0, Sim.targetHealth)});
    Buckets.push(0);
    HealBuckets.push(0);
    BucketBase += BucketSize;
  }

  Sim.register("init", function() {
    this.after(BucketBase + KernelFactor * KernelSize, function sendReport() {
      SendReport();
      Sim.after(BucketSize, sendReport);
    });
    var whiteCount = this.target.count - this.target.eliteCount;
    if (this.params.deathRate > 0) {
      var delay = Math.ceil(3600 / this.params.deathRate);
      for (var i = 0; i < whiteCount; ++i) {
        this.targetDeath[this.target.index + i] = this.after((i + 1) * delay, onDeath, {index: this.target.index + i});
      }
    }
    if (this.target.health > 0) {
      MaxHealth = this.target.health;
      for (var i = 0; i < this.target.eliteCount; ++i) {
        this.targetHealth[i] = MaxHealth;
      }
      if (this.params.deathRate < 0) {
        for (var i = 0; i < whiteCount; ++i) {
          this.targetHealth[this.target.index + i] = (i + 1) / whiteCount * MaxHealth * WhiteRatio;
        }
      }
    } else {
      this.after(3600, function() {
        MaxHealth = TotalDamage0 * 10;
        for (var i = 0; i < Sim.target.eliteCount; ++i) {
          Sim.targetHealth[i] = MaxHealth;
        }
        if (Sim.params.deathRate < 0) {
          for (var i = 0; i < whiteCount; ++i) {
            Sim.targetHealth[Sim.target.index + i] = i / whiteCount * MaxHealth * WhiteRatio;
          }
        }
      });
    }
    if (this.params.globeRate) {
      var globeDelay = 3600 / Sim.params.globeRate;
      this.after(Sim.random("globedelay", globeDelay), function globes() {
        Sim.trigger("onglobe");
        Sim.after(Sim.random("globedelay", globeDelay), globes);
      });
    }
    if (this.params.hitRate) {
      var hitDelay = 3600 / Sim.params.hitRate;
      this.after(Sim.random("gethitdelay", hitDelay), function hits() {
        Sim.trigger("ongethit");
        if (Sim.random("block", Sim.stats.block * 0.01)) {
          Sim.trigger("onblock");
        }
        Sim.after(Sim.random("gethitdelay", hitDelay), hits);
      });
    }
  });

  function _counter(id) {
    if (!SkillCounters[id]) {
      SkillCounters[id] = {};
    }
    return SkillCounters[id];
  }
  var CastCounters = {};
  // 0: time
  // 1: skill
  // 2: resource
  // 3: damage
  // 4: damage/source
  // 5: buffs
  // 6: healing
  Sim.register("onhit", function(data) {
    var source = (data.skill || data.triggered || "unknown");
    if (data.pet || (data.castInfo && (data.castInfo.pet || data.castInfo.trigExplicit))) {
      source = (data.triggered || data.skill || "unknown");
    }
    var amount = data.damage * data.targets * data.count;
    var cnt = _counter(source);
    cnt.damage = (cnt.damage || 0) + amount;
    var contrib = 0;
    for (var i = 0; i < Buckets.length; ++i) {
      contrib += Kernel((BucketBase + BucketSize * i - Sim.time) / KernelFactor);
    }
    if (contrib) {
      for (var i = 0; i < Buckets.length; ++i) {
        Buckets[i] += amount * Kernel((BucketBase + BucketSize * i - Sim.time) / KernelFactor) / contrib;
      }
    }
    TotalDamage += amount;
    var tlist = Sim.target.list(data);
    var tamount = data.damage * data.count;
    if (tlist[0] === 0) {
      TotalDamage0 += tamount;
    }
    for (var i = 0; i < tlist.length; ++i) {
      if (tlist[i] in Sim.targetHealth) {
        Sim.targetHealth[tlist[i]] -= tamount;
        if (tlist[i] === Sim.target.index && Sim.targetHealth[tlist[i]] <= 0) {
          onDeath({index: tlist[i], hit: data});
        }
      }
    }
    var castId = data.castId || (data.castInfo && data.castInfo.castId);
    if (castId && CastCounters[castId]) {
      /*var source = (data.skill || data.triggered || "unknown");
      if (data.pet || (data.castInfo && data.castInfo.pet)) {
        source = (data.triggered || data.skill || "unknown");
      }*/
      var evt = CastCounters[castId];
      if ((data.triggered && data.triggered !== evt[1]) || !data.castInfo || data.castInfo.castId !== castId) {
        evt[4][source] = (evt[4][source] || 0) + amount;
      } else {
        evt[3] += amount;
      }
    }
  });
  Sim.register("healing", function(data) {
    var source = (data.castInfo && (data.castInfo.skill || data.castInfo.triggered) || "unknown");
    if (data.castInfo && (data.castInfo.pet || data.castInfo.trigExplicit)) {
      source = (data.castInfo.triggered || data.castInfo.skill || "unknown");
    }
    var cnt = _counter(source);
    cnt.healing = (cnt.healing || 0) + data.amount;
    var contrib = 0;
    for (var i = 0; i < HealBuckets.length; ++i) {
      contrib += Kernel((BucketBase + BucketSize * i - Sim.time) / KernelFactor);
    }
    if (contrib) {
      for (var i = 0; i < HealBuckets.length; ++i) {
        HealBuckets[i] += data.amount * Kernel((BucketBase + BucketSize * i - Sim.time) / KernelFactor) / contrib;
      }
    }
    TotalHealing += data.amount;
    var castId = data.castId || (data.castInfo && data.castInfo.castId);
    if (castId && CastCounters[castId]) {
      var evt = CastCounters[castId];
      evt[6] = (evt[6] || 0) + data.amount;
    }
  });
  Sim.register("oncast", function(data) {
    if (data.triggered) return;
    var cnt = _counter(data.skill);
    cnt.count = (cnt.count || 0) + 1;
    if (Sample /*&& Sample.length < 50*/) {
      var buffs = {};
      for (var id in this.buffs) {
        if (id.indexOf("uniq_") === 0) continue;
        var amount = Math.max(Sim.getBuff(id), Sim.getBuffTargets(id));
        if (amount) buffs[id] = amount;
      }
      var evt = [data.time, data.skill, Sim.resources[Sim.rcTypes[0]], 0, {}, buffs];
      if (data.castId) CastCounters[data.castId] = evt;
      Sample.push(evt);
    }
  });
  Sim.register("resourcegain", function(data) {
    if (!data.castInfo) return;
    var source = (data.castInfo.triggered || data.castInfo.skill || "unknown");
    var cnt = _counter(source);
    if (!cnt.rc) cnt.rc = {};
    cnt.rc[data.type] = (cnt.rc[data.type] || 0) + data.amount;
  });

  Sim.postResults = function() {
    /*var count = Buckets.length;
    while (count > 0 && Buckets[count - 1] === 0 && HealBuckets[count - 1] === 0) {
      --count;
    }
    while (count--) {
      SendReport();
    }*/
    Sim.postMessage({type: "report", time: Sim.time,/* health: Math.max(0, Sim.targetHealth),*/
      counters: SkillCounters,
      damage: TotalDamage,
      healing: TotalHealing,
      uptimes: Sim.uptimes,
      sample: Sample,
    });
  };

  Sim.targetDead = function() {
    if (Sim.target.eliteCount) {
      return (0 in Sim.targetHealth && Sim.targetHealth[0] <= 0);
    } else {
      return Sim.time >= 36000;
    }
  };
  Sim.getTargetHealth = function(index) {
    if (index < Sim.target.eliteCount) {
      if (index in Sim.targetHealth) {
        return Sim.targetHealth[index] / MaxHealth;
      } else {
        return 1.0;
      }
    } else {
      if (index in Sim.targetHealth) {
        return Sim.targetHealth[index] / (MaxHealth * WhiteRatio);
      } else if ((index in Sim.targetDeath) && this.params.deathRate > 0) {
        var delay = Math.ceil(3600 / this.params.deathRate);
        var ratio = (Sim.targetDeath[index].time - Sim.time) / (delay * (Sim.target.count - Sim.target.eliteCount));
        return Math.min(ratio, 1.0);
      } else {
        return 1.0;
      }
    }
  };
  Sim.countTargetsAbove = function(ratio, data) {
    var list = Sim.target.list(data);
    var count = 0;
    for (var i = 0; i < list.length; ++i) {
      if (Sim.getTargetHealth(list[i]) > ratio) {
        ++count;
      }
    }
    return count;
  };
  Sim.countTargetsBelow = function(ratio, data) {
    var list = Sim.target.list(data);
    var count = 0;
    for (var i = 0; i < list.length; ++i) {
      if (Sim.getTargetHealth(list[i]) < ratio) {
        ++count;
      }
    }
    return count;
  };
  Sim.listTargetsAbove = function(ratio, data) {
    var list = Sim.target.list(data);
    var res = [];
    for (var i = 0; i < list.length; ++i) {
      if (Sim.getTargetHealth(list[i]) > ratio) {
        res.push(list[i]);
      }
    }
    return res;
  };
  Sim.listTargetsBelow = function(ratio, data) {
    var list = Sim.target.list(data);
    var res = [];
    for (var i = 0; i < list.length; ++i) {
      if (Sim.getTargetHealth(list[i]) < ratio) {
        res.push(list[i]);
      }
    }
    return res;
  };
})();
(function() {
  var Sim = Simulator;

  var BucketSize = 180;
  var BucketDamage = 0;
  var TotalDamage = 0;
  var SkillCounters = {};
  var Sample = [];
  Sim._sample = Sample;

  Sim.targetHealth = 1;
  var MaxHealth = undefined;

  Sim.register("init", function() {
    this.after(BucketSize, function SendReport() {
      Sim.postMessage({type: "chart", time: Sim.time, damage: BucketDamage, health: Math.max(0, Sim.targetHealth)});
      BucketDamage = 0;
      Sim.after(BucketSize, SendReport);
    });
    this.after(3600, function() {
      MaxHealth = TotalDamage * 10;
      Sim.targetHealth = 0.9;
    });
    if (this.params.globeRate) {
      var delay = Math.ceil(3600 / Sim.params.globeRate);
      this.after(delay, function globes() {
        Sim.trigger("onglobe");
        Sim.after(delay, globes);
      });
    }
  });

  function _counter(id) {
    if (!SkillCounters[id]) {
      SkillCounters[id] = {};
    }
    return SkillCounters[id];
  }
  Sim.register("onhit", function(data) {
    var source = ((!data.pet && data.triggered) || data.skill || "unknown");
    var amount = data.damage * data.targets;
    var cnt = _counter(source);
    cnt.damage = (cnt.damage || 0) + amount;
    BucketDamage += amount;
    TotalDamage += amount;
    if (MaxHealth) {
      Sim.targetHealth = (MaxHealth - TotalDamage) / MaxHealth;
    }
  });
  Sim.register("oncast", function(data) {
    var cnt = _counter(data.skill);
    cnt.count = (cnt.count || 0) + 1;
    if (Sample && Sample.length < 50) {
      Sample.push([data.time, data.skill, Sim.resources[Sim.rcTypes[0]]]);
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
    Sim.postMessage({type: "report", time: Sim.time, health: Math.max(0, Sim.targetHealth),
      counters: SkillCounters,
      damage: TotalDamage,
      uptimes: Sim.uptimes,
      sample: Sample,
    });
  };
})();
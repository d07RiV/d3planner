(function() {
  var Sim = Simulator;

  Sim.getProp = function(obj, name, param) {
    var res = obj[name];
    if (typeof res === "function") {
      return res.call(obj, param);
    } else if (typeof res === "object") {
      return res[param];
    } else {
      return res;
    }
  };

  var rcTypes = {
    wizard: ["ap"],
    demonhunter: ["hatred", "disc"],
    barbarian: ["fury"],
    witchdoctor: ["mana"],
    monk: ["spirit"],
    crusader: ["wrath"],
  };
  var lastResources = 0;
  Sim.resources = {};
  Sim.addResource = function(amount, type) {
    if (!type) type = rcTypes[this.stats.charClass][0];
    this.resources[type] = Math.min(this.stats["max" + type], (this.resources[type] || 0) + amount);
  };
  Sim.hasResource = function(amount, type) {
    if (!amount) return true;
    if (!type) type = rcTypes[this.stats.charClass][0];
    amount *= 1 - 0.01 * (this.stats["rcr_" + type] || 0);
    return (this.resources[type] && this.resources[type] >= amount);
  };
  Sim.spendResource = function(amount, type) {
    if (!amount) return true;
    if (!type) type = rcTypes[this.stats.charClass][0];
    amount *= 1 - 0.01 * (this.stats["rcr_" + type] || 0);
    amount -= (Sim.stats.rcrint || 0);
    if (this.resources[type] && this.resources[type] >= amount) {
      this.resources[type] -= amount;
      return true;
    } else {
      return false;
    }
  };
  Sim.register("update", function(e) {
    var types = rcTypes[this.stats.charClass];
    var elapsed = (e.time - lastResources) / 60;
    lastResources = e.time;
    for (var i = 0; i < types.length; ++i) {
      var type = types[i];
      var maxval = this.stats["max" + type];
      var regen = this.stats[type + "regen"];
      if (this.resources[type] === undefined) {
        this.resources[type] = maxval;
      }
      if (regen) {
        this.resources[type] = Math.min(maxval, this.resources[type] + regen * elapsed);
      }
    }
  });

  Sim.nextBuffs = [];
  Sim.buffNextCast = function(data) {
    this.nextBuffs.push(data);
  };

  Sim.register("init", function(e) {
    for (var id in this.stats.skills) {
      var skill = this.skills[id];
      var rune = this.stats.skills[id];
      if (!skill || !rune) continue;
      this.pushCastInfo({
        skill: id,
        rune: rune,
        buffs: [],
        elem: this.getProp(skill, "elem", rune),
        proc: this.getProp(skill, "proctable", rune),
      });
      this.getProp(skill, "oninit", rune);
      this.popCastInfo();
    }
    for (var id in this.stats.passives) {
      var passive = this.passives[id];
      if (passive) {
        this.pushCastInfo({triggered: id});
        passive.call(id);
        this.popCastInfo();
      }
    }
    for (var id in this.affixes) {
      if (this.stats[id]) {
        this.pushCastInfo({triggered: id});
        this.affixes[id].call(id, this.stats[id]);
        this.popCastInfo();
      }
    }
  });

  Sim.cooldowns = {};
  Sim.getCooldown = function(id) {
    return (Sim.cooldowns[id] && Sim.cooldowns[id] > this.time && Sim.cooldowns[id] - this.time);
  };
  
  Sim.canCast = function(id, rune) {
    var rune = rune || this.stats.skills[id];
    var skill = this.skills[id];
    if (!rune || !skill) return false;
    if (Sim.cooldowns[id] && Sim.cooldowns[id] > this.time) {
      return false;
    }
    if (skill.requires) {
      for (var i = 0; i < skill.requires; ++i) {
        if (!this.stats[skill.requires[i]]) {
          return false;
        }
      }
    }
    var cost = this.getProp(skill, "cost", rune);
    var rctype = this.getProp(skill, "resource", rune);
    if (!this.hasResource(cost, rctype)) return false;
    return true;
  };

  Sim.cast = function(id, rune, triggered) {
    var cost, rctype, cooldown;
    var rune = rune || this.stats.skills[id];
    var skill = this.skills[id];
    var prevInfo = this.castInfo();
    triggered = (triggered || (prevInfo && prevInfo.triggered));
    if (!triggered) {
      if (!this.canCast(id, rune)) return false;
      cost = this.getProp(skill, "cost", rune);
      rctype = this.getProp(skill, "resource", rune);
      if (!this.spendResource(cost, rctype)) return false;
      cooldown = this.getProp(skill, "cooldown", rune);
      if (cooldown) {
        cooldown -= (this.stats["skill_" + this.stats.charClass + "_" + id + "_cooldown"] || 0);
        cooldown -= (this.stats.cdrint || 0);
        cooldown *= 1 - 0.01 * (this.stats.cdr || 0);
        Sim.cooldowns[id] = this.time + Math.max(cooldown * 60, 30);
      }
    }

    var elem = this.getProp(skill, "elem", rune);
    var castInfo = {
      skill: id,
      rune: rune,
      elem: elem,
      pet: skill.pet,
    };
    if (triggered) {
      castInfo.triggered = triggered;
    } else {
      castInfo.buffs = [];
      castInfo.user = {};
      castInfo.generate = this.getProp(skill, "generate", rune);
      if (!castInfo.generate && skill.signature) {
        castInfo.generate = 0;
      }
      castInfo.cost = cost;
      castInfo.cooldown = cooldown;
      castInfo.resource = (rctype ? rctype : rcTypes[this.stats.charClass][0]);
      castInfo.proc = this.getProp(skill, "proctable", rune);
      var remainBuffs = [];
      for (var i = 0; i < this.nextBuffs.length; ++i) {
        var buff = this.nextBuffs[i];
        if (typeof buff === "function") {
          var res = buff(id);
          if (res !== undefined) {
            castInfo.buffs.push(res);
          } else {
            remainBuffs.push(buff);
          }
        } else {
          if (buff.elem === undefined || buff.elem === elem) {
            castInfo.buffs.push(buff);
          } else {
            remainBuffs.push(buff);
          }
        }
      }
      this.nextBuffs = remainBuffs;
      var buffs = Sim.trigger("oncast", castInfo);
      for (var i = 0; i < buffs.length; ++i) {
        if (buffs[i]) {
          castInfo.buffs.push(buffs[i]);
        }
      }
    }

    this.pushCastInfo(castInfo);

    if (castInfo.generate) {
      Sim.addResource(castInfo.generate, rctype);
    }
    var oncast = this.getProp(skill, "oncast", rune);
    if (oncast instanceof Object) {
      this.damage(oncast);
    }

    this.popCastInfo();

    return true;
  };

  Sim.castDelay = function(id, rune) {
    var skill = this.skills[id];
    var rune = rune || this.stats.skills[id] || "x";
    if (!skill || !rune) return;
    var channeling = this.getProp(skill, "channeling", rune);
    var speed = this.getProp(skill, "speed", rune);
    if (channeling) {
      return Math.floor(speed / this.stats.info.aps);
    } else {
      if (this.stats.info.aps === 1) {
        return Math.ceil(speed);
      } else {
        return Math.floor(speed / this.stats.info.aps) + 1;
      }
    }
  };

})();

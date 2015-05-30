(function() {
  var Sim = Simulator;

  function getProp(obj, name, param) {
    var res = obj[name];
    if (typeof res === "function") {
      return res.call(obj, param);
    } else if (typeof res === "object") {
      return res[param];
    } else {
      return res;
    }
  }

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
        elem: getProp(skill, "elem", rune),
        proc: getProp(skill, "proctable", rune),
      });
      getProp(skill, "oninit", rune);
      this.popCastInfo();
    }
  });

  Sim.cooldowns = {};
  
  Sim.canCast = function(id, rune) {
    var rune = rune || this.stats.skills[id] || "x";
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
    var cost = getProp(skill, "cost", rune);
    var rctype = getProp(skill, "resource", rune);
    if (!this.hasResource(cost, rctype)) return false;
    return true;
  };

  Sim.cast = function(id, rune) {
    if (!this.canCast(id, rune)) return false;
    var rune = rune || this.stats.skills[id] || "x";
    var skill = this.skills[id];
    var cost = getProp(skill, "cost", rune);
    var rctype = getProp(skill, "resource", rune);
    if (!this.spendResource(cost, rctype)) return false;
    var cooldown = getProp(skill, "cooldown", rune);
    if (cooldown) {
      cooldown -= (this.stats["skill_" + this.stats.charClass + "_" + id + "_cooldown"] || 0);
      cooldown -= (this.stats.cdrint || 0);
      cooldown *= 1 - 0.01 * (this.stats.cdr || 0);
      Sim.cooldowns[id] = this.time + Math.max(cooldown * 60, 30);
    }

    var elem = getProp(skill, "elem", rune);
    var remainBuffs = [];
    var castInfo = {
      skill: id,
      rune: rune,
      buffs: [],
      user: {},
      elem: elem,
      proc: getProp(skill, "proctable", rune),
    };
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
      castInfo.buffs.push(buffs[i]);
    }

    this.pushCastInfo(castInfo);

    var oncast = getProp(skill, "oncast", rune);
    if (oncast instanceof Object) {
      this.damage(oncast);
    }

    this.popCastInfo();

    return true;
  };

})();

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
    this.resources[type] = (this.resources[type] || 0);
    amount *= 1 + 0.01 * (this.stats.resourcegen || 0);
    var gain = Math.min(this.stats["max" + type] - this.resources[type], amount);
    if (gain) {
      this.resources[type] += gain;
      Sim.trigger("resourcegain", {type: type, amount: gain, castInfo: Sim.castInfo()});
    }
  };
  Sim.hasResource = function(amount, type) {
    if (!amount) return true;
    if (!type) type = rcTypes[this.stats.charClass][0];
    return (this.resources[type] && this.resources[type] >= amount);
  };
  Sim.spendResource = function(amount, type) {
    if (!amount) return true;
    if (!type) type = rcTypes[this.stats.charClass][0];
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
      regen *= 1 + 0.01 * (this.stats.resourcegen || 0);
      if (this.resources[type] === undefined) {
        this.resources[type] = maxval;
      }
      if (regen) {
        this.resources[type] = Math.min(maxval, this.resources[type] + regen * elapsed);
      }
    }
  });

  Sim.register("init", function(e) {
    this.rcTypes = rcTypes[this.stats.charClass];
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
  });

  Sim.trigCost = function(id, rune, dry) {
    var skill = this.skills[id];
    var rune = rune || this.stats.skills[id];
    var cost = this.getProp(skill, "cost", rune);
    var rctype = this.getProp(skill, "resource", rune) || this.rcTypes[0];
    var initial = Sim.getProp(skill, "initialcost", rune);
    if (initial && !Sim.getBuff(id)) {
      cost = initial;
    } else {
      initial = undefined;
    }
    if (cost) {
      if (Sim.stats.leg_cindercoat && Sim.getProp(skill, "elem", rune) === "fir") {
        cost *= 1 - 0.01 * Sim.stats.leg_cindercoat;
      }
      cost *= 1 - 0.01 * (Sim.stats["rcr_" + rctype] || 0);
      cost -= (Sim.stats.rcrint || 0);
      if (!initial) {
        var channeling = Sim.getProp(skill, "channeling", rune);
        if (channeling) {
          cost *= channeling / 60;
        }
      }

      var res = Sim.trigger("clearcast", {skill: id, rune: rune, cost: cost, resource: rctype, dry: dry});
      for (var i = 0; i < res; ++i) {
        if (res[i] === true) {
          cost = 0;
        } else if (typeof res[i] === "number") {
          cost *= res[i];
        }
      }
      if (!cost) return true;

      if (!this.hasResource(cost, rctype)) return false;
      if (!dry) {
        this.spendResource(cost, rctype);
      }
    }
    return cost;
  };

  Sim.cooldowns = {};
  Sim.getCooldown = function(id) {
    var cd = this.cooldowns[id];
    if (!cd || !cd.ends || cd.ends <= this.time) return 0;
    return cd.ends - this.time;
  };
  Sim.getCharges = function(id) {
    var skill = this.skills[id];
    var rune = rune || this.stats.skills[id];
    if (!skill || !rune) return 0;
    var cd = this.cooldowns[id];
    var charges = Sim.getProp(skill, "charges", data.rune);
    return (cd && cd.charges !== undefined ? cd.charges : charges);
  };

  function fixCooldown(id, cooldown) {
    if (cooldown) {
      cooldown -= (Sim.stats["skill_" + Sim.stats.charClass + "_" + id + "_cooldown"] || 0);
      cooldown -= (Sim.stats.cdrint || 0);
      cooldown *= 1 - 0.01 * (Sim.stats.cdr || 0);
      cooldown = Math.ceil(Math.max(cooldown, 0.5) * 60);
    }
    return cooldown;
  }
  function onGrace(data) {
    var skill = Sim.skills[data.id];
    var cooldown = Sim.getProp(skill, "cooldown", data.rune);
    cooldown = fixCooldown(data.id, cooldown);
    var cd = Sim.cooldowns[data.id];
    if (!cd) cd = Sim.cooldowns[data.id] = {};
    cd.ends = Sim.time + cooldown;
    delete cd.grace;
    delete cd.graceEvent;
  }
  function onCharge(data) {
    var skill = Sim.skills[data.id];
    var cooldown = Sim.getProp(skill, "cooldown", data.rune);
    cooldown = fixCooldown(data.id, cooldown);
    var cd = Sim.cooldowns[data.id];
    if (!cd) cd = Sim.cooldowns[data.id] = {};
    var charges = Sim.getProp(skill, "charges", data.rune);
    if (cd.charges < charges) ++cd.charges;
    if (cd.charges < charges) {
      cd.chargeEvent = Sim.after(cooldown, onCharge, data);
    } else {
      delete cd.chargeEvent;
    }
    delete cd.ends;
  }
  var usedGrace = false;
  Sim.trigCooldown = function(id, rune, dry) {
    var skill = this.skills[id];
    var rune = rune || this.stats.skills[id];
    var cooldown = this.getProp(skill, "cooldown", rune);
    var duration = this.getProp(skill, "duration", rune);
    cooldown = fixCooldown(id, cooldown);
    if (cooldown && duration) {
      cooldown += duration;
    }
    var grace = this.getProp(skill, "grace", rune);
    if (typeof grace === "number") {
      grace = [grace, 1];
    }
    var charges = this.getProp(skill, "charges", rune);
    if (dry && !this.cooldowns[id]) return cooldown;
    var cd = this.cooldowns[id];
    if (!cd) cd = this.cooldowns[id] = {};
    if (grace) {
      if (cd.ends && cd.ends > this.time) return false;
      if (!dry) {
        if (cd.graceEvent) {
          if (!--cd.grace) {
            this.removeEvent(cd.graceEvent);
            delete cd.graceEvent;
            cd.ends = this.time + cooldown;
          }
          usedGrace = true;
        } else {
          cd.grace = grace[1];
          cd.graceEvent = this.after(grace[0], onGrace, {id: id, rune: rune});
        }
      }
    } else if (charges) {
      if (cd.charges === undefined) {
        cd.charges = charges;
      }
      if (!cd.charges) return false;
      if (!dry) {
        --cd.charges;
        if (!cd.chargeEvent) {
          cd.chargeEvent = this.after(cooldown, onCharge, {id: id, rune: rune});
        }
        if (!cd.charges) {
          cd.ends = cd.chargeEvent.time;
        }
      }
    } else {
      if (cd.ends && cd.ends > this.time) return false;
      if (!dry && cooldown) {
        cd.ends = this.time + cooldown;
      }
    }
    return cooldown;
  }

  Sim.reduceCooldown = function(id, amount) {
    var rune = rune || this.stats.skills[id];
    var skill = this.skills[id];
    if (!rune || !skill) return false;
    var cd = this.cooldowns[id];
    if (!cd) return false;
    var cooldown = this.getProp(skill, "cooldown", rune);
    cooldown = fixCooldown(id, cooldown);
    var grace = this.getProp(skill, "grace", rune);
    if (typeof grace === "number") {
      grace = [grace, 1];
    }
    var charges = this.getProp(skill, "charges", rune);
    if (charges) {
      if (!cd.chargeEvent) return false;
      var next = cd.chargeEvent.time;
      this.removeEvent(cd.chargeEvent);
      delete cd.chargeEvent;
      if (amount === undefined || next <= this.time + amount) {
        if (cd.charges < charges) ++cd.charges;
        if (cd.charges < charges) {
          cd.chargeEvent = Sim.after(cooldown, onCharge, {id: id, rune: rune});
        }
      } else {
        cd.chargeEvent = Sim.after(next - this.time - amount, onCharge, {id: id, rune: rune});
      }
      return true;
    } else {
      if (!cd.ends || cd.ends <= this.time) return false;
      if (amount === undefined) {
        delete cd.ends;
      } else {
        cd.ends -= amount;
        if (cd.ends <= this.time) delete cd.ends;
      }
      return true;
    }
  };
  
  Sim.canCast = function(id, rune) {
    var rune = rune || this.stats.skills[id];
    var skill = this.skills[id];
    if (!rune || !skill) return false;
    if (skill.precast) {
      return skill.precast.call(skill, rune, true);
    }
    if (skill.requires === "archon") {
      if (!this.stats.archon) return false;
    } else {
      if (this.stats.archon) return false;
    }
    usedGrace = false;
    var res = {};
    res.cooldown = this.trigCooldown(id, rune, true);
    if (res.cooldown === false) return false;
    if (!usedGrace) {
      res.cost = this.trigCost(id, rune, true);
      if (res.cost === false) return false;
    }
    return res;
  };

  Sim.cast = function(id, rune, triggered) {
    var rune = rune || this.stats.skills[id];
    var skill = this.skills[id];
    if (!skill || !rune) return false;
    var prevInfo = this.castInfo();
    triggered = (triggered || (prevInfo && prevInfo.triggered));
    var rc = {};
    if (!triggered) {
      rc = this.canCast(id, rune);
      if (!rc) return false;
    }

    var elem = this.getProp(skill, "elem", rune);
    var castInfo = {
      skill: id,
      rune: rune,
      elem: elem,
      pet: skill.pet,
    };
    castInfo.weapon = this.getProp(skill, "weapon", rune);
    switch (castInfo.weapon) {
    case "mainhand":
    case "offhand":
      if (!this.stats.info[castInfo.weapon]) {
        return false;
      }
      if (!triggered) {
        this.curweapon = castInfo.weapon;
      }
      break;
    case "current":
      castInfo.weapon = this.curweapon;
      break;
    default:
      castInfo.weapon = this.curweapon;
      if (!triggered && this.stats.info.offhand) {
        this.curweapon = (this.curweapon === "mainhand" ? "offhand" : "mainhand");
      }
    }
    if (triggered) {
      castInfo.triggered = triggered;
      var tsk = this.skills[triggered];
      if (tsk) {
        if (tsk.pet) castInfo.weapon = "mainhand";
        var dist = this.getProp(tsk, "distance", this.stats.skills[triggered]);
        if (dist) castInfo.distance = dist;
      }
    } else {
      castInfo.buffs = [];
      castInfo.user = {};
      castInfo.generate = this.getProp(skill, "generate", rune);
      if (!castInfo.generate && skill.signature) {
        castInfo.generate = 0;
      }
      castInfo.cost = rc.cost;
      castInfo.cooldown = rc.cooldown;
      var rctype = this.getProp(skill, "resource", rune);
      castInfo.resource = (rctype || rcTypes[this.stats.charClass][0]);
      castInfo.proc = this.getProp(skill, "proctable", rune);
      castInfo.offensive = this.getProp(skill, "offensive", rune);
      castInfo.melee = this.getProp(skill, "melee", rune);
      var buffs = Sim.trigger("oncast", castInfo);
      for (var i = 0; i < buffs.length; ++i) {
        if (buffs[i]) {
          castInfo.buffs.push(buffs[i]);
        }
      }

      if (skill.precast) {
        skill.precast.call(skill, rune, false);
      } else {
        usedGrace = false;
        this.trigCooldown(id, rune, false);
        if (!usedGrace) this.trigCost(id, rune, false);
      }
    }

    this.pushCastInfo(castInfo);

    if (castInfo.generate) {
      Sim.addResource(castInfo.generate, rctype);
    }
    var oncast = this.getProp(skill, "oncast", rune);
    if (oncast instanceof Object) {
      var channeling = this.getProp(skill, "channeling", rune);
      if (channeling) {
        Sim.channeling(id, channeling, oncast);
      } else {
        this.damage(oncast);
      }
    }

    this.popCastInfo();

    return castInfo;
  };

  Sim.castDelay = function(info) {
    var skill = this.skills[info.skill];
    var rune = info.rune;
    if (!skill || !rune) return;
    var speed = this.getProp(skill, "speed", rune);
    var aps = this.stats.info[info.weapon || "mainhand"].speed;
    if (aps === 1) {
      return Math.ceil(speed);
    } else {
      return Math.floor(speed / aps) + 1;
    }
  };
  Sim.channelDelay = function(info) {
    var skill = this.skills[info.skill];
    var rune = info.rune;
    if (!skill || !rune) return;
    var channeling = this.getProp(skill, "channeling", rune);
    if (channeling) {
      var aps = this.stats.info[info.weapon || "mainhand"].speed;
      return Math.floor(channeling / aps);
    }
  };

  function channeling_ontick(data) {
    if (typeof data.func === "function") {
      data.func(data);
    } else {
      Sim.damage(data.func);
    }
    var info = Sim.castInfo();
    data.buff.params.tickrate = Math.floor(data.speed / Sim.stats.info[info && info.weapon || "mainhand"].speed);
  }
  Sim.channeling = function(name, speed, dmg, data, base) {
    var info = this.castInfo();
    var rate = Math.floor(speed / Sim.stats.info[info && info.weapon || "mainhand"].speed);
    Sim.addBuff(name, undefined, Sim.extend({
      duration: rate + 1,
      tickrate: rate,
      tickinitial: 1,
      ontick: channeling_ontick,
      data: Sim.extend({func: dmg, speed: speed}, data),
    }, base));
  };
  function pet_ontick(data) {
    if (typeof data.ontick === "function") {
      data.ontick(data);
    } else {
      Sim.damage(data.ontick);
    }
    var rate = data.tickrate / (1 + 0.01 * (Sim.stats.petias || 0));
    if (data.ias) rate /= Sim.stats.info.mainhand.speed;
    data.buff.params.tickrate = Math.ceil(Math.floor(rate) / 6) * 6;
  }
  Sim.petattack = function(name, buffs, params) {
    params.data = this.extend({tickrate: params.tickrate, ontick: params.ontick, ias: params.ias}, params.data);
    var rate = params.data.tickrate / (1 + 0.01 * (Sim.stats.petias || 0));
    if (params.data.ias) rate /= Sim.stats.info.mainhand.speed;
    params.tickrate = Math.ceil(Math.floor(rate) / 6) * 6;
    params.ontick = pet_ontick;
    Sim.addBuff(name, buffs, params);
  };
  Sim.petdelay = function(name) {
    var data = Sim.getBuffData(name);
    if (data && data.tickrate) {
      var rate = data.tickrate / (1 + 0.01 * (Sim.stats.petias || 0));
      if (data.ias) rate /= Sim.stats.info.mainhand.speed;
      this.delayBuff(name, Math.ceil(Math.floor(rate) / 6) * 6);
    }
  };

  var fx_id = 0;
  Sim.apply_effect = function(effect, duration, chance) {
    if (effect === "knockback" && Sim.target.boss) return;
    if (chance) {
      var id = "ufx_" + (fx_id++);
      return function() {
        if (Sim.random(ufx, chance)) {
          Sim.addBuff(effect, null, duration);
        }
      };
    } else {
      return function() {
        Sim.addBuff(effect, null, duration);
      };
    }
  };

})();

(function() {
  var Sim = Simulator;

  var compare = {
    eq: function(lhs, rhs) {return lhs == rhs;},
    ne: function(lhs, rhs) {return lhs != rhs;},
    lt: function(lhs, rhs) {return lhs <  rhs;},
    le: function(lhs, rhs) {return lhs <= rhs;},
    gt: function(lhs, rhs) {return lhs >  rhs;},
    ge: function(lhs, rhs) {return lhs >= rhs;},
  };

  function makeNumeric(func, factor) {
    return function(code) {
      var lhs = func.call(Sim, code.lhs);
      return compare[code.op](lhs, code.rhs * (factor || 1));
    };
  }

  var lastCast = {};

  function getResource(type) {
    return Sim.resources[type];
  }
  function getResourcePct(type) {
    return 100 * Sim.resources[type] / Sim.stats["max" + type];
  }
  function getHealth(type) {
    return 100 * Sim.getTargetHealth(0);
  }
  function getCastInterval(type) {
    return (lastCast[type] === undefined ? 1e+10 : Sim.time - lastCast[type]);
  }

  var conditionTypes = {
    buff: makeNumeric(Sim.getBuff),
    buffmin: makeNumeric(Sim.getBuffDurationLast, 60),
    buffmax: makeNumeric(Sim.getBuffDuration, 60),
    bufftgt: makeNumeric(Sim.getBuffTargets, 60),
    resource: makeNumeric(getResource),
    resourcepct: makeNumeric(getResourcePct),
    cooldown: makeNumeric(Sim.getCooldown),
    health: makeNumeric(getHealth),
    charges: makeNumeric(Sim.getCharges),
    ticks: makeNumeric(Sim.getBuffTicks),
    channeled: makeNumeric(Sim.getBuffElapsed, 60),
    interval: makeNumeric(getCastInterval, 60),

    any: function(code) {return countConditions(code.sub) >= 1;},
    all: function(code) {return countConditions(code.sub) >= code.sub.length;},
    count: function(code) {return compare[code.op](countConditions(code.sub), code.rhs);},
  };

  function checkCondition(cond) {
    if (conditionTypes[cond.type]) {
      return conditionTypes[cond.type](cond);
    } else {
      return false;
    }
  }

  function countConditions(list) {
    var count = 0;
    for (var i = 0; i < list.length; ++i) {
      if (checkCondition(list[i])) {
        ++count;
      }
    }
    return count;
  }

  function splitPriority(list) {
    var main = [];
    var result = [main];
    for (var i = 0; i < list.length; ++i) {
      var id = list[i].skill;
      if (!id || !Sim.skills[id]) continue;
      if (Sim.getProp(Sim.skills[id], "secondary", Sim.stats.skills[id] || "x")) {
        result.push([list[i]]);
      } else {
        main.push(list[i]);
      }
    }
    return result;
  }

  function rotationChoosePriority(data, only) {
    for (var i = 0; i < data.priority.length; ++i) {
      var item = data.priority[i];
      if (only && item.skill !== only) continue;
      if (!Sim.canCast(item.skill)) continue;
      if (!item.conditions || countConditions(item.conditions) >= item.conditions.length) {
        return item.skill;
      }
    }
  }

/*
  function* rotGenerator() {
    yield "slowtime";
    while (true) {
      if (Sim.getBuffDuration("slowtime") < 60) yield "slowtime";
      while (Sim.getBuff("arcanedynamo") < 5) yield "electrocute";
      yield "hydra";
      yield "blizzard";
      while (Sim.getBuff("arcanedynamo") < 5) yield "electrocute";
      yield "hydra";
      while (Sim.resources.ap < Sim.stats.maxap * 0.9 || Sim.getBuff("arcanedynamo") < 5) yield "electrocute";
      yield "meteor";
      if (Sim.getBuffDuration("slowtime") < 60) yield "slowtime";
      while (Sim.resources.ap < Sim.stats.maxap * 0.9) yield "electrocute";
      yield "meteor";
      while (Sim.getBuff("tal_6pc") > 35) yield "electrocute";
      yield "meteor";
      while (Sim.getBuff("tal_6pc_arcane")) yield "electrocute";
    }
  }
  var rg = rotGenerator();
  function rotationTest(data) {
    return rg.next().value;
  }
//*/

  function rotationStep(data) {
    //var skill = rotationTest(data);
    if (data.channelingLock && Sim.time < data.channelingLock) {
      var skill = rotationChoosePriority(data, data.channelingId);
      if (skill === data.channelingId) {
        var info = Sim.cast(data.channelingId);
        lastCast[skill] = Sim.time;
        var delay = Sim.channelDelay(info);
        data.channelingNextTick = Sim.time + delay;
        var next = Math.min(data.channelingLock, data.channelingNextTick);
        Sim.after(next - Sim.time, rotationStep, data);
      } else {
        delete data.channelingId;
        Sim.after(data.channelingLock - Sim.time, rotationStep, data);
      }
    } else {
      var skill = rotationChoosePriority(data);
      if (!skill) {
        Sim.after(5, rotationStep, data);
        return;
      }
      if (skill === data.channelingId) {
        if (Sim.time >= data.channelingNextTick) {
          var info = Sim.cast(skill);
          lastCast[skill] = Sim.time;
          var delay = Sim.channelDelay(info);
          data.channelingNextTick = Sim.time + delay;
        }
        Sim.after(Math.min(5, data.channelingNextTick - Sim.time), rotationStep, data);
      } else {
        var info = Sim.cast(skill);
        lastCast[skill] = Sim.time;
        var delay = Sim.castDelay(info);
        var channeling = Sim.channelDelay(info);
        if (channeling) {
          data.channelingLock = Sim.time + delay;
          data.channelingId = skill;
          data.channelingNextTick = Sim.time + channeling;
          Sim.after(Math.min(delay, channeling), rotationStep, data);
        } else {
          delete data.channelingId;
          Sim.after(delay, rotationStep, data);
        }
      }
    }
  }
/*
  function* PrioGen() {
    var runes = {"x":1, "a":1, "b": 1, "c":1, "d":1, "e":1};
    for (var id in Sim.skills) {
      for (var rune in runes) {
        Sim.baseStats.skills[id] = rune;
        Sim.stats.skills[id] = rune;
        Sim.removeBuff(id);
        var skill = Sim.skills[id];
        if (skill.oninit) {
          Sim.pushCastInfo({
            skill: id,
            rune: rune,
            buffs: [],
            elem: Sim.getProp(skill, "elem", rune),
            proc: Sim.getProp(skill, "proctable", rune),
          });
          skill.oninit.call(skill, rune);
          Sim.popCastInfo();
        }
        Sim.reduceCooldown(id);
        Sim.addResource(200);
        console.log(id + " - " + rune);
        yield id;
      }
    }
  }
  function TestPrio(data) {
    if (!data.gen) data.gen = PrioGen();
    var val = data.gen.next();
    if (!val.done) {
      Sim.cast(val.value);
      Sim.after(120, TestPrio, data);
    }
  }
//*/
  Sim.register("init", function() {
    //this.after(0, TestPrio);
    var parts = splitPriority(Sim.priority);
    for (var i = 0; i < parts.length; ++i) {
      this.after(0, rotationStep, {priority: parts[i]});
    }
  });

})();
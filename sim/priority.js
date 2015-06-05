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

  function getResource(type) {
    return Sim.resources[type];
  }
  function getResourcePct(type) {
    return 100 * Sim.resources[type] / Sim.stats["max" + type];
  }

  var conditionTypes = {
    buff: makeNumeric(Sim.getBuff),
    buffmin: makeNumeric(Sim.getBuffDurationLast, 60),
    buffmax: makeNumeric(Sim.getBuffDuration, 60),
    resource: makeNumeric(getResource),
    resourcepct: makeNumeric(getResourcePct),
    cooldown: makeNumeric(Sim.getCooldown),
    //health: makeNumeric(getResource), //TODO: fix
    //charges: makeNumeric(getResource), //TODO: fix

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

  var priority = [
    {skill: "hydra",
    conditions: [
      {type: "buff", lhs: "arcanedynamo", op: "ge", rhs: 5},
      {type: "any",
      sub: [
//        {type: "buffmin", lhs: "hydra", op: "lt", rhs: 1},
        {type: "buff", lhs: "tal_6pc_fire", op: "eq", rhs: 0},
      ]},
    ]},
    {skill: "meteor",
    conditions: [
      {type: "buff", lhs: "arcanedynamo", op: "ge", rhs: 5},
      {type: "buff", lhs: "tal_6pc", op: "ge", rhs: 3},
      {type: "any",
      sub: [
        {type: "buff", lhs: "tal_6pc_arcane", op: "eq", rhs: 0},
        {type: "resourcepct", lhs: "ap", op: "ge", rhs: 95},
        {type: "all",
        sub: [
          {type: "buffmax", lhs: "tal_6pc", op: "lt", rhs: 1.5},
          {type: "buffmax", lhs: "tal_6pc", op: "gt", rhs: 1.25},
          {type: "resourcepct", lhs: "ap", op: "ge", rhs: 50},
        ]},
      ]},
    ]},
    {skill: "slowtime",
    conditions: [
      {type: "buff", lhs: "slowtime", op: "eq", rhs: 0},
    ]},
    {skill: "blizzard",
    conditions: [
      {type: "buff", lhs: "tal_6pc_cold", op: "eq", rhs: 0},
    ]},
    {skill: "electrocute",
    conditions: [
    ]},
  ];

  function splitPriority(list) {
    var main = [];
    var result = [main];
    for (var i = 0; i < list.length; ++i) {
      var id = list[i].skill;
      if (!id || !Sim.skills[id]) continue;
      if (Sim.skills[id].secondary) {
        result.push([list[i]]);
      } else {
        main.push(list[i]);
      }
    }
    return result;
  }

  function rotationChoosePriority(data) {
    for (var i = 0; i < data.priority.length; ++i) {
      var item = data.priority[i];
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
    var skill = rotationChoosePriority(data);
    if (skill) {
      Sim.cast(skill);
      var delay = Sim.castDelay(skill);
      Sim.after(delay, rotationStep, data);
    } else {
      Sim.after(5, rotationStep, data);
    }
  }

  Sim.register("init", function() {
    var parts = splitPriority(priority);
    for (var i = 0; i < parts.length; ++i) {
      this.after(0, rotationStep, {priority: parts[i]});
    }
  });

})();
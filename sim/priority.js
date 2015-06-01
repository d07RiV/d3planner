(function() {
  var Sim = Simulator;

  var priority = [
    {
      skill: "hydra",
      check: function() {
        if (Sim.getBuff("arcanedynamo") < 5) return false;
        if (Sim.getBuffDurationLast("hydra") < 180 || !Sim.getBuff("tal_6pc_fire")) {
          return true;
        }
      },
    },
    {
      skill: "meteor",
      check: function() {
        if (Sim.getBuff("arcanedynamo") < 5) return false;
        if (Sim.getBuff("tal_6pc") < 3) return false;
        //if (Sim.getBuffDuration("restraint") < 80) return false;
        if (Sim.getBuffDuration("tal_6pc") > 150 && Sim.resources.ap < Sim.stats.maxap * 0.95) return false;
        if (Sim.resources.ap < Sim.stats.maxap * 0.8) return false;
        return true;
      },
    },
    {
      skill: "slowtime",
      check: function() {
        if (Sim.getBuff("slowtime")) return false;
        return true;
      },
    },
    {
      skill: "blizzard",
      check: function() {
        if (Sim.getBuff("tal_6pc_cold")) return false;// && Sim.getBuffDuration("restraint") >= 80) return false;
        return true;
      },
    },
    {
      skill: "electrocute",
    },
  ];

  function RotationChoose(data) {
    for (var i = 0; i < priority.length; ++i) {
      if (!Sim.canCast(priority[i].skill)) continue;
      if (!priority[i].check || priority[i].check()) return priority[i].skill;
    }
  }

  function RotationStep(data) {
    var skill = RotationChoose(data);
    if (skill) {
      console.log("[" + Sim.time + "] Casting " + skill);
      Sim.cast(skill);
      var delay = Sim.castDelay(skill);
      Sim.after(delay, RotationStep, data);
    } else {
      Sim.after(5, RotationStep, data);
    }
  }

  Sim.start = function() {
    this.after(0, RotationStep, {});
  };

})();
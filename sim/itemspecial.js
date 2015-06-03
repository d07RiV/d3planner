(function() {
  var Sim = Simulator;
  var affixes = Sim.affixes;
  var gems = Sim.gems;

  gems.powerful = function(level) {
    if (level >= 25) Sim.addBaseStats({edmg: 15});
    if (Sim.params.powerful && Sim.params.powerful[0]) {
      Sim.addBuff("powerful", {damage: 20});
    }
  };
  gems.trapped = function(level) {
    if (level >= 25 && Sim.target.distance - Sim.target.size < 15) {
      Sim.addBuff("slowed");
    }
    Sim.register("statschanged", function(data) {
      if (data.stats.chilled || data.stats.frozen ||
          data.stats.blinded || data.stats.stunned ||
          data.stats.slowed || data.stats.knockback ||
          data.stats.charmed || data.stats.feared) {
        data.stats.add("dmgmul", 15 + 0.3 * level);
      }
    });
  };
  gems.toxin = function(level) {
    var buffs = (level >= 25 ? {dmgtaken: 10} : undefined);
    function onrefresh(data, newdata) {
      data.targets = Math.max(data.targets, newdata.targets);
    }
    function ontick(data) {
      Sim.damage({targets: data.targets, elem: "psn", coeff: (20 + level * 0.5) / 40});
    }
    Sim.register("onhit", function(data) {
      Sim.addBuff("toxin", buffs, {
        duration: 600,
        data: {targets: Math.min(Sim.target.count, data.targets)},
        tickrate: 15,
        ontick: ontick,
        onrefresh: onrefresh,
      });
    });
  };
  gems.gogok = function(level) {
    var buffs = (level >= 25 ? {ias: 1, cdr: 1} : {ias: 1});
    Sim.register("onhit_proc", function(data) {
      var stacks = Sim.random("gogok", data.targets * data.proc * (0.5 + 0.01 * level));
      if (stacks) {
        Sim.addBuff("gogok", buffs, {duration: 240, maxstacks: 15, stacks: stacks});
      }
    });
  };
  gems.mirinae = function(level) {
    var coeff = 20 + 0.4 * level;
    Sim.register("onhit_proc", function(data) {
      Sim.damage({count: data.targets * data.proc * 0.15, elem: "hol", coeff: coeff});
    });
    if (level >= 25) {
      Sim.after(300, function ontick() {
        Sim.damage({elem: "hol", coeff: coeff});
        Sim.after(300, ontick);
      });
    }
  };
  gems.painenhancer = function(level) {
    var coeff = (12 + 0.3 * level) / 12;
    var buffs = undefined;
    if (level >= 25 && Sim.target.distance - Sim.target.size < 20) {
      buffs = {ias: 3};
    }
    function ontick(data) {
      Sim.damage({elem: "phy", coeff: coeff});
    }
    Sim.register("onhit", function(data) {
      var stacks = Sim.random("painenhancer", data.targets * data.chc);
      Sim.addBuff("painenhancer", buffs, {
        duration: 180,
        refresh: false,
        maxstacks: Sim.target.count,
        stacks: stacks,
        tickrate: 15,
        tickkeep: true,
        ontick: ontick,
      });
    });
  };
  gems.simplicity = function(level) {
    var stats = {};
    for (var id in Sim.skills) {
      var skill = Sim.skills[id];
      if (Sim.skills[id].signature) {
        stats["skill_" + Sim.stats.charClass + "_" + id] = 25 + 0.5 * level;
      }
    }
    Sim.addBaseStats(stats);
  };
  gems.taeguk = function(level) {
    var buffs = (level >= 25 ? {damage: 0.5, armor_percent: 0.5} : {damage: 0.5});
    Sim.register("oncast", function(data) {
      if (data.cost) {
        Sim.addBuff("taeguk", buffs, {maxstacks: 20 + level, duration: 180});
      }
    });
  };
  gems.wreath = function(level) {
    var coeff = (6 + 0.1 * level) / 5;
    function ontick(data) {
      Sim.damage({targets: 2, elem: "lit", coeff: coeff});
    }
    Sim.register("onhit_proc", function(data) {
      if (Sim.random("wreath", data.targets * data.proc * 0.15)) {
        Sim.addBuff("wreath", undefined, {
          duration: 180,
          tickrate: 12,
          ontick: ontick,
        });
      }
    });
  };
  gems.iceblink = function(level) {
    Sim.register("onhit", function(data) {
      if (data.elem === "col") {
        Sim.addBuff("chilled", undefined, {duration: 180});
      }
    });
    if (level >= 25) {
      Sim.register("statschanged", function(data) {
        if (data.stats.chilled) {
          data.stats.add("chctaken", 10);
        }
      });
    }
  };

  affixes.wandofwoh = function() {
    function docast(data) {
      Sim.cast("explosiveblast", data.rune);
    }
    Sim.register("oncast", function(data) {
      if (data.skill === "explosiveblast") {
        Sim.after(30, docast, {rune: data.rune});
        Sim.after(60, docast, {rune: data.rune});
        Sim.after(90, docast, {rune: data.rune});
      }
    });
  };

})();

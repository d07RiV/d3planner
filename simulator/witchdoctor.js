(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  function pd_onhit(data) {
    var params = {
      duration: 121,
      tickrate: 30,
      ontick: {coeff: 0.1},
    };
    switch (data.castInfo.rune) {
    case "d": Sim.addResource(50); break;
    case "e": if (Sim.random("poisondart", 0.35)) Sim.addBuff("stunned", 90); break;
    case "c": params.status = "chilled"; break;
    }
    Sim.addBuff(undefined, undefined, params);
  }
  function pd_fd_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 240,
      tickrate: 30,
      tickinitial: 1,
      ontick: {coeff: 5.65 / 8},
    });
  }
  skills.poisondart = {
    signature: true,
    offensive: true,
    speed: 58,
    oncast: function(rune) {
      var pierce = !!Sim.stats.leg_daggerofdarts;
      switch (rune) {
      case "x": return {pierce: pierce, type: "line", speed: 1.5, coeff: 1.85, onhit: pd_onhit};
      case "b": return {pierce: pierce, type: "line", speed: 1.5, coeff: 1.1, count: 3};
      case "c": return {pierce: pierce, type: "line", speed: 1.5, coeff: 1.85, onhit: pd_onhit};
      case "d": return {pierce: pierce, type: "line", speed: 1.5, coeff: 1.85, onhit: pd_onhit};
      case "a": return {pierce: pierce, type: "line", speed: 1.5, coeff: 0, onhit: pd_fd_onhit};
      case "e": return {pierce: pierce, type: "line", speed: 1.5, coeff: 1.85, onhit: pd_onhit};
      }
    },
    proctable: {x: 1, b: 0.333, c: 1, d: 1, a: 1, e: 1},
    elem: {x: "psn", b: "psn", c: "col", d: "phy", a: "fir", e: "psn"},
  };

  function cs_wm_onhit(data) {
    Sim.addResource(3 * data.targets);
    if (Sim.stats.leg_thespiderqueensgrasp) {
      Sim.addBuff("slowed", undefined, 180);
    }
  }
  skills.corpsespiders = {
    signature: true,
    offensive: true,
    speed: 58,
    oncast: function(rune) {
      var params = {duration: 240, tickrate: 60, tickinitial: 70, ontick: {count: 4, coeff: 0.48}};
      switch (rune) {
      case "c": params.ontick.coeff *= 1.12; break;
      case "b":
        Sim.addBuff("spiderqueen", undefined, {
          duration: 901,
          tickrate: 15,
          ontick: {type: "area", range: 10, coeff: 1.75 / 4},
        });
        return;
      case "d": params.ontick.onhit = cs_wm_onhit; break;
      case "e": params.ontick.onhit = Sim.apply_effect("slowed", 90); break;
      case "a": params.ontick.coeff *= 1.215; break;
      }
      if (Sim.stats.leg_thespiderqueensgrasp && rune !== "d") {
        params.ontick.onhit = Sim.apply_effect("slowed", 180);
      }
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.11, c: 0.11, b: 0.15, d: 0.11, e: 0.11, a: 0.11},
    elem: {x: "phy", c: "psn", b: "psn", d: "phy", e: "col", a: "fir"},
  };

  Sim.passives = {};

})();
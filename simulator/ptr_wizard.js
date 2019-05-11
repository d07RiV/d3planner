(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  function SignatureSpeed(rune, aps) {
    return aps * (Sim.stats.leg_theshameofdelsere ? 1.5 : 1);
  }
  function SignatureGen(rune) {
    return Sim.stats.leg_theshameofdelsere;
  }

  var mm_glacial_next = undefined;
  function mm_glacial_onhit(event) {
    if (!mm_glacial_next || event.time >= mm_glacial_next) {
      Sim.addBuff("frozen", null, {duration: 60, targets: event.targets});
      mm_glacial_next = event.time + 300;
    } else {
      Sim.addBuff("chilled", null, {duration: 36, targets: event.targets});
    }
  }
  function mm_conflag_refresh(event) {
    if (event.elem === "fir" && event.skill !== "magicmissile") {
      Sim.refreshBuff("conflagrate", 180);
    }
  }
  function mm_conflag_onhit(event) {
    Sim.addBuff("conflagrate", null, {
      maxstacks: 3,
      duration: 180,
      targets: event.targets,
/*      onapply: function() {
        Sim.register("onhit", mm_conflag_refresh);
      },
      onexpire: function() {
        Sim.unregister("onhit", mm_conflag_refresh);
      },*/ // <- buff cannot be refreshed (bug?)
      ontick: function(data) {
        Sim.damage({coeff: 1.3 * data.stacks / 12});
      },
      tickrate: 15,
    });
  }
  skills.magicmissile = {
    signature: true,
    offensive: true,
    frames: 57.599991,
    speed: SignatureSpeed,
    generate: SignatureGen,
    oncast: function(rune) {
      var count = 1 + (Sim.stats.leg_mirrorball || 0);
      switch (rune) {
      case "x": return {type: "line", coeff: 2.3, speed: 1.25, fan: 20, count: count};
      case "a": return {type: "line", coeff: 3.25, speed: 1.25, fan: 20, count: count};
      case "d": return {type: "line", coeff: 1.75, area: 4.5, onhit: mm_glacial_onhit, speed: 0.95, fan: 20, count: count};
      case "b": return {type: "line", coeff: 0.8, speed: 1.25, fan: 20, count: count + 2};
      case "e": return {type: "line", coeff: 2.85, speed: 1.25, count: count};
      case "c": return {type: "line", coeff: 0, pierce: true, onhit: mm_conflag_onhit, speed: 1.5, count: count};
      }
    },
    proctable: {x: 1, a: 1, d: 0.77, b: 0.333, e: 1, c: 0.5},
    elem: {x: "arc", a: "arc", d: "col", b: "arc", e: "arc", c: "fir"},
  };

  skills.shockpulse = {
    signature: true,
    offensive: true,
    frames: 57.142834,
    speed: SignatureSpeed,
    generate: SignatureGen,
    oncast: {
      x: {type: "line", coeff: 1.94, speed: 0.65, fan: 45, count: 3, range: 40},
      e: {type: "line", coeff: 1.94, speed: 0.65, fan: 45, count: 3, range: 40},
      a: {type: "line", coeff: 2.74, speed: 0.65, fan: 45, count: 3, range: 40},
      c: {type: "line", coeff: 2.14, speed: 0.65, radius: 6},
      d: {type: "line", coeff: 1.94, speed: 0.65, fan: 45, count: 3, range: 40, onhit: function(event) {
        Sim.addResource(event.targets * 2);
      }},
      b: {type: "ball", coeff: 0.33, speed: 0.25, radius: 12, range: 32, rate: 12},
    },
    proctable: {x: 0.931, e: 0.931, a: 0.931, c: 0.77, d: 0.931, b: 0.054},
    elem: {x: "lit", e: "col", a: "fir", c: "lit", d: "arc", b: "lit"},
  };

  skills.spectralblade = {
    signature: true,
    offensive: true,
    frames: 56.249996,
    speed: function(rune, aps) {
      return aps * (Sim.stats.leg_theshameofdelsere ? 1.5 : 1) * (Sim.stats.leg_fragmentofdestiny ? 1.5 : 1);
    },
    generate: SignatureGen,
    oncast: function(rune) {
      switch (rune) {
      case "x": return {type: "cone", coeff: 0.56, count: 3, range: 15};
      case "a": return {type: "cone", coeff: 0.56, count: 3, range: 15, onhit: function(event) {
        Sim.addBuff("flameblades", {dmgfir: 1}, {maxstacks: 30, stacks: Sim.random("flameblades", 1, event.targets, true), duration: 300, refresh: false});
      }};
      case "d": return {type: "cone", coeff: 0.56, count: 3, range: 15, onhit: function(event) {
        Sim.addResource(event.targets * 2);
      }};
      case "b": return {type: "cone", coeff: 0.77, count: 3, range: 20};
      case "e": return {type: "cone", coeff: 0.56, count: 3, range: 15};
      case "c": return {type: "cone", coeff: 0.56, chc: (Sim.stats.frozen ? 5 : 0),
                        count: 3, range: 15, onhit: function(event) {
        if (Sim.stats.chilled && Sim.random("sb_iceblades", 0.05)) {
          Sim.addBuff("frozen", undefined, {duration: 60, targets: event.targets});
        }
        Sim.addBuff("chilled", undefined, {duration: 36, targets: event.targets});
      }};
      }
    },
    proctable: {x: 0.31, a: 0.31, d: 0.31, b: 0.295, e: 0.31, c: 0.31},
    elem: {x: "arc", a: "fir", d: "arc", b: "lit", e: "arc", c: "col"},
  };

  function ec_forked_onhit(event) {
    Sim.damage({type: "line", origin: 0, coeff: 0.44, cmod: -1,
      count: 0.01 * Sim.stats.final.chc * event.targets * 4});
  }
  function ec_surge_onhit(event) {
    Sim.addResource(event.targets);
  }

  skills.electrocute = {
    signature: true,
    channeling: 30,
    offensive: true,
    frames: 58.064510,
    speed: SignatureSpeed,
    generate: function(rune) {
      return (Sim.stats.leg_theshameofdelsere || 0) / 2;
    },
    oncast: function(rune) {
      var dmg;
      switch (rune) {
      case "x": dmg = {coeff: 0.69, targets: 3}; break;
      case "b": dmg = {coeff: 0.69, targets: 10}; break;
      case "e": dmg = {coeff: 0.69, targets: 3, onhit: ec_forked_onhit}; break;
      case "a": dmg = {type: "line", coeff: 1.4, speed: 1.5}; break;
      case "d": dmg = {coeff: 0.69, targets: 3, onhit: ec_surge_onhit}; break;
      case "c": dmg = {type: "cone", coeff: 1.55, range: 15}; break;
      }
      if (Sim.stats.leg_velvetcamaral && dmg.targets) {
        dmg.targets *= 2;
      }
      if (Sim.stats.leg_mykensballofhate && Sim.target.count > 1 && dmg.targets > Sim.target.count) {
        dmg.count = dmg.targets / Sim.target.count;
        dmg.targets = Sim.target.count;
      }
      return dmg;
    },
    proctable: {x: 0.25, b: 0.083, e: 0.1667, a: 0.1667, d: 0.25, c: 0.1},
    elem: {x: "lit", b: "lit", e: "fir", a: "lit", d: "lit", c: "lit"},
  };

  function rof_numb_onhit(event) {
    if (Sim.random("rof_numb", 0.1)) {
      Sim.addBuff("frozen", undefined, {duration: 60, targets: event.targets});
    }
    Sim.addBuff("chilled", undefined, {duration: 180, targets: event.targets});
  }
  function rof_snowblast_onhit(event) {
    Sim.addBuff("snowblast", {dmgtaken: {elems: ["col"], percent: 15}}, {duration: 240, targets: event.targets});
    Sim.addBuff("chilled", undefined, {duration: 180, targets: event.targets});
  }
  function rof_ontick(data) {
    var bonus = Math.floor((Sim.time - data.buff.start) / 60);
    data.dmg.coeff = data.dmg.coeff_base + Math.min(bonus, 2) * data.dmg.coeff_delta;
    if (data.rune === "b") {
      data.dmg.range = 10 + Math.min(bonus, 3) * 4;
    }
    data.dmg.coeff *= Sim.stats.info.aps * data.buff.params.tickrate / 60;
    Sim.damage(data.dmg);
  }
  skills.rayoffrost = {
    channeling: 30,
    offensive: true,
    frames: 58.064510,
    cost: function(rune) {
      return (rune === "d" ? 11 : 16) * (1 - 0.01 * (Sim.stats.leg_hergbrashsbinding || 0));
    },
    oncast: function(rune) {
      var dmg;
      switch (rune) {
      case "x": dmg = {type: "line", coeff_base: 4.3, coeff_delta: 4.05, radius: 2, area: 5, onhit: Sim.apply_effect("chilled", 180)}; break;
      case "d": dmg = {type: "line", coeff_base: 4.3, coeff_delta: 4.05, radius: 2, area: 5, onhit: Sim.apply_effect("chilled", 180)}; break;
      case "c": dmg = {type: "line", coeff_base: 4.3, coeff_delta: 4.05, radius: 2, area: 5, onhit: rof_numb_onhit}; break;
      case "e": dmg = {type: "line", coeff_base: 4.3, coeff_delta: 4.05, radius: 2, area: 5, onhit: Sim.apply_effect("chilled", 180)}; break;
      case "b": dmg = {type: "area", self: true, coeff_base: 3, coeff_delta: 2.2, onhit: Sim.apply_effect("chilled", 180)}; break;
      case "a": dmg = {type: "line", coeff_base: 4.3, coeff_delta: 4.05, radius: 2, area: 5, onhit: rof_snowblast_onhit}; break;
      }
      if (Sim.stats.leg_lightofgrace) {
        dmg.pierce = true;
      }
      Sim.channeling("rayoffrost", this.channeling, rof_ontick, {dmg: dmg, rune: rune});
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (data.hit && data.hit.skill === "rayoffrost") {
            Sim.addBuff(undefined, undefined, {
              duration: 181,
              tickrate: 30,
              ontick: {type: "area", range: 7, coeff: 16.25 / 6},
            });
          }
        });
      }
    },
    proctable: {x: 0.333, d: 0.333, c: 0.333, e: 0.333, b: 0.1875, a: 0.333},
    elem: {x: "col", d: "col", c: "col", e: "col", b: "col", a: "col"},
  };

  function ao_scorch_ontick(event) {
    Sim.damage({type: "line", coeff: 0.1468, radius: 6, range: Math.min(50, event.time - event.buff.start), proc: 0.003});
  }
  skills.arcaneorb = {
    frames: 57.857109,
    offensive: true,
    cost: 30,
    secondary: function(rune) {
      return rune === "c";
    },
    oncast: function(rune) {
      var count = (Sim.stats.leg_unstablescepter || Sim.stats.leg_unstablescepter_p6 ? 2 : 1);
      switch (rune) {
      case "x": return {type: "line", coeff: 4.35, area: 15, speed: 0.5, count: count};
      case "a": return {type: "line", coeff: 7, area: 8, speed: 1.5, count: count};
      case "c":
        Sim.removeBuff("arcaneorbit");
        Sim.addBuff("arcaneorbit", undefined, {
          stacks: 4,
          tickrate: 30,
          ontick: function() {
            if (Sim.getTargets(10, Sim.target.distance)) {
              Sim.removeBuff("arcaneorbit", 1);
              Sim.damage({type: "area", origin: Math.max(0, Sim.target.distance - 10), range: 10, coeff: 2.65, count: count});
            }
          },
        });
        break;
      case "b": return {type: "line", coeff: 1.745, count: 2, range: 45, radius: 15, pierce: true, speed: 0.5, onhit: function(event) {
        var stacks = Math.min(15, Math.ceil(event.targets));
        Sim.addBuff("spark", undefined, {stacks: stacks, maxstacks: 15});
      }};
      case "d":
        Sim.addBuff("scorch", undefined, {duration: 300, tickrate: 6, ontick: ao_scorch_ontick});
        return {type: "line", coeff: 2.21, range: 50, radius: 6, pierce: true, speed: 1, count: count};
      case "e":
        Sim.damage({type: "area", origin: Sim.target.distance - 40, coeff: 9.50, range: 15, delay: 40 / 0.6, count: count});
        Sim.damage({type: "line", coeff: 6.35, pierce: true, range: 40, speed: 0.6, radius: 15});
        Sim.damage({type: "line", coeff: 3.15, pierce: true, range: 40, radius: 15, delay: 40 / 0.6 + 0.6, proc: 0.013});
      }
    },
    oninit: function(rune) {
      if (rune === "b") {
        Sim.register("oncast", function(data) {
          if (data.elem === "lit" && data.offensive) {
            var stacks = Sim.getBuff("spark");
            if (stacks) {
              Sim.removeBuff("spark");
              return {percent: stacks};
            }
          }
        });
      }
    },
    proctable: {x: 0.31, a: 0.655, c: 0.00925, b: 0.1, d: 0.067, e: 0.067},
    elem: {x: "arc", a: "arc", c: "arc", b: "lit", d: "fir", e: "col"},
  };

  function at_ontick(data) {
    var bonus = Math.floor((Sim.time - data.buff.start) / 60);
    data.dmg.coeff = data.dmg.coeff_base + Math.min(bonus, 2) * data.dmg.coeff_delta;
    Sim.damage(data.dmg);
  }
  function at_mines_explode(data) {
    Sim.damage({delay: 30, type: "area", range: 8, coeff: 8.25, onhit: Sim.apply_effect("slow", 180)});
  }
  function at_mines_ontick(data) {
    Sim.addBuff("arcanemines", undefined, {
      maxstacks: 6,
      refresh: false,
      duration: 121,
      tickrate: 120,
      ontick: at_mines_explode,
    });
  }
  function at_static_onhit(event) {
    Sim.damage({type: "line", origin: 0, coeff: 1.5, cmod: -1,
      pierce: true, count: 2, speed: 0.5});
  }
  function at_cascade_onhit(event) {
    if (Sim.target.count > 1) {
      //TODO: if 1 target?
      Sim.damage({delay: 24, coeff: 5.82, count: event.targets * 0.125});
    }
  }
  skills.arcanetorrent = {
    channeling: {x: 20, a: 20, e: 30, c: 40, d: 20, b: 20},
    offensive: true,
    frames: 58.064510,
    cost: function(rune) {
      return 16 * (1 - 0.01 * (Sim.stats.leg_hergbrashsbinding || 0));
    },
    oncast: function(rune) {
      var dmg;
      switch (rune) {
      case "x": dmg = {delay: 24, type: "area", coeff_base: 4, coeff_delta: 3.05, range: 6}; break;
      case "a": dmg = {delay: 24, type: "area", coeff_base: 4, coeff_delta: 3.05, range: 6}; break;
      case "e": dmg = {delay: 24, type: "area", self: true, spread: 35, inner: 7,
        coeff_base: 12.15, coeff_delta: 6.4, range: 6}; break;
      case "c":
        Sim.channeling("arcanetorrent", this.channeling[rune], at_mines_ontick);
        return;
      case "d": dmg = {delay: 24, type: "area", coeff_base: 4, coeff_delta: 3.05, range: 6,
        onhit: at_static_onhit}; break;
      case "b": dmg = {delay: 24, type: "area", coeff_base: 4, coeff_delta: 3.05, range: 6,
        onhit: at_cascade_onhit}; break;
      }
      var factor = this.channeling[rune] / 60;
      dmg.coeff_base *= factor;
      dmg.coeff_delta *= factor;
      Sim.channeling("arcanetorrent", this.channeling[rune], at_ontick, {dmg: dmg, rune: rune});
    },
    proctable: {x: 0.2, a: 0.2, e: 0.6, c: 0.5, d: 0.2, b: 0.16},
    elem: {x: "arc", a: "fir", e: "arc", c: "arc", d: "lit", b: "arc"},
  };

  function dis_intensify_onhit(event) {
    Sim.addBuff("intensify", {dmgtaken: {elems: ["arc"], percent: 15}}, {duration: 240, targets: event.targets});
  }
  function dis_ontick(data) {
    var bonus = Math.floor((Sim.time - data.buff.start) / 60);
    data.dmg.coeff = data.dmg.coeff_base + Math.min(bonus, 2) * data.dmg.coeff_delta;
    data.dmg.coeff *= Sim.stats.info.aps * data.buff.params.tickrate / 60;
    Sim.damage(data.dmg);
    if (data.rune === "d") {
      Sim.damage({coeff: 1.15});
    }
  }
  skills.disintegrate = {
    channeling: true,
    offensive: true,
    channeling: 20,
    frames: 58.064510,
    cost: function(rune) {
      return 18 * (1 - 0.01 * (Sim.stats.leg_hergbrashsbinding || 0));
    },
    oncast: function(rune) {
      var dmg;
      switch (rune) {
      case "x": dmg = {type: "line", pierce: true, coeff_base: 3.9, coeff_delta: 2.5, radius: 2}; break;
      case "b": dmg = {type: "line", pierce: true, coeff_base: 3.9, coeff_delta: 2.5, radius: 3.2}; break;
      case "e": dmg = {type: "line", pierce: true, coeff_base: 3.9, coeff_delta: 2.5, radius: 2}; break;
      case "c": dmg = {type: "cone", coeff_base: 4.35, coeff_delta: 3.4, range: 20}; break;
      case "d": dmg = {type: "line", pierce: true, coeff_base: 3.9, coeff_delta: 2.5, radius: 2}; break;
      case "a": dmg = {type: "line", pierce: true, coeff_base: 3.9, coeff_delta: 2.5, radius: 2,
        onhit: dis_intensify_onhit}; break;
      }
      Sim.channeling("disintegrate", this.channeling, dis_ontick, {dmg: dmg, rune: rune});
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (data.hit && data.hit.skill === "disintegrate" && Sim.random("volatility", 0.35)) {
            Sim.damage({type: "area", range: 8, coeff: 7.5});
          }
        });
      }
    },
    proctable: {x: 0.1667, b: 0.111, e: 0.125, c: 0.1667, d: 0.111, a: 0.1667},
    elem: {x: "arc", b: "fir", e: "arc", c: "arc", d: "arc", a: "arc"},
  };

  function fn_mist_ontick(data) {
    Sim.damage({type: "area", coeff: 9.15 / 27, range: 19, self: true, onhit: Sim.apply_effect("chilled", 30)});
  }
  skills.frostnova = {
    secondary: true,
    offensive: {c: true},
    frames: 57.142834,
    cooldown: {x: 11, b: 11, d: 7.5, c: 11, e: 11, a: 11},
    oncast: function(rune) {
      switch (rune) {
      case "x": return {type: "area", coeff: 0, range: 19, self: true, onhit: Sim.apply_effect("frozen", 120)};
      case "b": return {type: "area", coeff: 0, range: 19, self: true, onhit: Sim.apply_effect("frozen", 120)};
      case "d": return {type: "area", coeff: 0, range: 19, self: true, onhit: Sim.apply_effect("frozen", 180)};
      case "c":
        Sim.addBuff("frozenmist", undefined, {
          duration: 480,
          tickrate: 18,
          tickinitial: 1,
          ontick: fn_mist_ontick,
        });
        return;
      case "e": return {type: "area", coeff: 0, range: 19, self: true, onhit: function(event) {
        Sim.addBuff("frozen", undefined, {duration: 120, targets: event.targets});
        if (event.targets >= 5) {
          Sim.addBuff("deepfreeze", {chc: 10}, {duration: 660});
        }
      }};
      case "a": return {type: "area", coeff: 0, range: 19, self: true, onhit: function(event) {
        Sim.addBuff("bonechill", {dmgtaken: 33}, {duration: 120, status: "frozen", targets: event.targets});
      }};
      }
    },
    oninit: function(rune) {
      if (rune === "b") {
        Sim.register("onkill", function(data) {
          if (Sim.stats.status[data.target] && Sim.stats.status[data.target].frozen) {
            Sim.damage({type: "area", range: 19, coeff: 0, onhit: Sim.apply_effect("frozen", 120)});
          }
        });
      }
    },
    proctable: {x: 0.1667, b: 0.1667, d: 0.1667, c: 0.05, e: 0.1667, a: 0.1667},
    elem: {x: "col", b: "col", d: "col", c: "col", e: "col", a: "col"},
  };

  function ds_shards_onexpire(data) {
    Sim.damage({type: "area", self: true, range: 15, coeff: 8.63});
  }
  skills.diamondskin = {
    secondary: true,
    offensive: {e: true},
    frames: 56.249996,
    cooldown: 15,
    oncast: function(rune) {
      switch (rune) {
      case "x": Sim.addBuff("diamondskin", null, {duration: 180}); break;
      case "c": Sim.addBuff("diamondskin", null, {duration: 180}); break;
      case "d": Sim.addBuff("diamondskin", {rcrint: 9}, {duration: 180}); break;
      case "a": Sim.addBuff("diamondskin", {extrams: 30}, {duration: 180}); break;
      case "b": Sim.addBuff("diamondskin", null, {duration: 360}); break;
      case "e": Sim.addBuff("diamondskin", null, {duration: 180, onexpire: ds_shards_onexpire, onreapply: ds_shards_onexpire}); break;
      }
    },
    proctable: {e: 0.1},
    elem: {x: "arc", c: "arc", d: "arc", a: "arc", b: "arc", e: "arc"},
  };

  var st_self;
  skills.slowtime = {
    frames: 56.249996,
    cooldown: function(rune) {
      var cd = (rune === "c" ? 12 : 15);
      return cd * (1 - 0.01 * (Sim.stats.leg_gestureoforpheus || Sim.stats.leg_gestureoforpheus_p2 || 0));
    },
    oncast: function(rune) {
      var targets = Sim.getTargets(21);

      var params = {duration: 900, status: "slowed", targets: targets};
      var buffs = undefined;
      if (rune === "a" || Sim.stats.leg_crownoftheprimus) buffs = {dmgtaken: 15};
      Sim.addBuff("slowtime", buffs, params);

      if (rune === "b" || Sim.stats.leg_crownoftheprimus) {
        Sim.addBuff("stunned", undefined, {duration: 300, targets: targets});
      }

      var selfbuffs = {};
      if (Sim.stats.set_magnumopus_4pc) selfbuffs.dmgred = 60;
      if (rune === "e" || Sim.stats.leg_crownoftheprimus) selfbuffs.ias = 10;
      if (selfbuffs.dmgred || selfbuffs.ias) {
        st_self = Sim.addBuff(st_self, selfbuffs, {duration: 900});
      }
    },
    elem: "arc",
  };

  skills.teleport = {
    frames: 51.428570,
    speed: 2.5,
    offensive: {a: true},
    cost: function(rune) {
      if (Sim.stats.leg_aetherwalker) return 25;
    },
    cooldown: function(rune) {
      return Sim.stats.leg_aetherwalker ? 0.5 : 11;
    },
    grace: function(rune) {
      if (rune === "e" || Sim.stats.leg_cosmicstrand) {
        return [180, 1];
      }
    },
    oncast: function(rune) {
      switch (rune) {
      case "c": Sim.addBuff("safepassage", {dmgred: 25}, {duration: 300}); break;
      case "a": Sim.damage({type: "area", self: true, range: 20, coeff: 1.75, onhit: Sim.apply_effect("stunned", 60)}); break;
      }
    },
    elem: "arc",
    proctable: {a: 0.1667},
  };

  skills.waveofforce = {
    frames: 58.181816,
    offensive: true,
    cooldown: {a: 5},
    cost: 25,
    oncast: {
      x: {type: "area", self: true, range: 30, coeff: 3.9},
      a: {type: "area", self: true, range: 30, coeff: 3.9, onhit: Sim.apply_effect("slowed", 180)},
      e: {type: "area", self: true, range: 30, coeff: 3.9},
      d: {type: "area", self: true, range: 30, coeff: 3.9, onhit: function(event) {
        var stacks = Math.ceil(event.targets);
        Sim.addBuff("arcaneattunement", undefined, {stacks: stacks, maxstacks: stacks});
      }},
      b: {type: "area", self: true, range: 30, coeff: 3.9, onhit: function(event) {
        Sim.addResource(event.targets);
      }},
      c: {type: "area", self: true, range: 30, coeff: 4.75},
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("oncast", function(data) {
          if (data.elem === "arc" && data.offensive) {
            var stacks = Sim.getBuff("arcaneattunement");
            if (stacks) {
              Sim.removeBuff("arcaneattunement");
              return {percent: stacks * 4};
            }
          }
        });
      }
    },
    proctable: {x: 0.2, a: 0.25, e: 0.2, d: 0.2, b: 0.2, c: 0.2},
    elem: {x: "arc", a: "arc", e: "arc", d: "arc", b: "lit", c: "fir"},
  };

  function et_gale_onhit(event) {
    Sim.addBuff("galeforce", {dmgtaken: {elems: ["fir"], percent: 15}}, {duration: 240, targets: event.targets});
  }
  function et_ontick(data) {
    var dmg = {type: "area", coeff: data.base / 12, range: 8};
    if (data.rune === "a") {
      dmg.onhit = et_gale_onhit;
    }
    if (data.rune !== "e" && !Sim.params.twisterStop) {
      dmg.origin = (Sim.time - data.stack.start) * 0.25;
    }
    Sim.damage(dmg);
  }
  skills.energytwister = {
    frames: 57.599991,
    offensive: true,
    cost: {x: 35, d: 25, a: 35, b: 35, e: 35, c: 35},
    oncast: function(rune) {
      var base = 15.25;
      if (rune === "e") base = 8.35;
      if (rune === "b" && Sim.getBuff("energytwister")) {
        Sim.removeBuff("energytwister", 1);
        Sim.addBuff("ragingstorm", undefined, {maxstacks: 99, duration: 360, tickrate: 30, tickinitial: 1,
          ontick: et_ontick, data: {rune: rune, base: 32}, refresh: false, proc: this.proctable[rune]});
        return;
      }
      Sim.addBuff("energytwister", undefined, {maxstacks: 99, duration: 360, tickrate: 30, tickinitial: 1,
        ontick: et_ontick, data: {rune: rune, base: base}, refresh: false});
      if (rune === "c") {
        Sim.addBuff("stormchaser", undefined, {duration: 900, maxstacks: 3});
      }
    },
    oninit: function(rune) {
      if (rune === "c") {
        Sim.register("oncast", function(event) {
          if (Sim.skills[event.skill].signature) {
            var stacks = Sim.getBuff("stormchaser");
            if (stacks) {
              Sim.removeBuff("stormchaser");
              Sim.damage({type: "line", coeff: 1.96 * stacks, speed: 0.25 + 0.05 * stacks});
            }
          }
        });
      }
    },
    elem: {x: "arc", d: "col", a: "fir", b: "arc", e: "arc", c: "lit"},
    proctable: {x: 0.15625, d: 0.15625, a: 0.15625, b: 0.15625, e: 0.03125, c: 0.15625},
  };

  function hydra_fpa(rune) {
    var base = {x: 76.300583, e: 76.300583, b: 76.300583, c: 76.300583, a: 86, d: 76.595741}[rune];
    return Math.ceil(Math.floor(base / Sim.stats.info.aps / (1 + 0.01 * (Sim.stats.leg_taskerandtheo || 0))) / 6) * 6;
  }
  function hydra_mammoth_ontick(data) {
    var range = Math.min(50, (Sim.time - data.stack.start) * 50 / 108);
    var origin = 5;
    if (Sim.params.hydra) {
      origin = Sim.params.hydra[0][1] || origin;
    }
    Sim.damage({type: "line", origin: origin, pierce: true, range: range, radius: 5, coeff: 0.99});
  }
  function hydra_lit_onhit(data) {
    if (Sim.stats.passives.paralysis && Sim.stats.leg_manaldheal) {
      Sim.pushCastInfo({triggered: "leg_manaldheal"});
      Sim.damage({count: data.targets * data.count * 0.15, coeff: Sim.stats.leg_manaldheal * 0.01 * Sim.stats.info.aps, elem: "lit", manald: true});
      Sim.popCastInfo();
    }
  }
  function hydra_ontick(data) {
    var origin = 5;
    if (Sim.params.hydra) {
      origin = Sim.params.hydra[0][1] || origin;
    }
    switch (data.rune) {
    case "x":
      Sim.damage({type: "line", origin: origin, speed: 0.45, range: 50, coeff: 1.65, count: 3});
      break;
    case "e":
      Sim.damage({type: "line", origin: origin, speed: 1, range: 50, coeff: 2.05, area: 7.5, count: 3});
      break;
    case "b":
      Sim.damage({distance: origin, coeff: 2.55, count: 3, onhit: hydra_lit_onhit});
      break;
    case "c":
      Sim.damage({type: "line", origin: origin, speed: 1, range: 50, coeff: 1.55, area: 8, count: 3});
      break;
    case "a":
      Sim.damage({type: "cone", origin: origin, range: 35, coeff: 2.55, count: 3, width: 30});
      if (Sim.stats.leg_themagistrate) {
        if (Sim.time - (data.nova || data.stack.start) >= 270) {
          Sim.damage({type: "area", coeff: 0.01, range: 19, origin: origin, onhit: Sim.apply_effect("frozen", 120)});
          data.nova = Sim.time;
        }
      }
      break;
    case "d":
      data.buffid = Sim.addBuff(data.buffid, undefined, {
        duration: 288,
        refresh: false,
        maxstacks: 50,
        tickrate: 18,
        tickinitial: 1,
        ontick: hydra_mammoth_ontick,
      });
      break;
    }
    data.buff.params.tickrate = hydra_fpa(data.rune);
  }
  function hydra_onexpire(data) {
    if (data.buffid) {
      data.stack.castInfo.orphan = true;
      //Sim.removeBuff(data.buffid);
    }
  }
  skills.hydra = {
    offensive: true,
    frames: 56.249996,
    cost: 15,
    pet: true,
    oncast: function(rune) {
      Sim.addBuff("hydra", undefined, {
        maxstacks: (Sim.stats.leg_serpentssparker ? 2 : 1),
        refresh: false,
        duration: 900,
        tickrate: hydra_fpa(rune),
        ontick: hydra_ontick,
        onexpire: hydra_onexpire,
        data: {rune: rune},
      });
    },
    elem: {x: "fir", e: "arc", b: "lit", c: "fir", a: "col", d: "fir"},
  };

  function meteor_nilfurs_fix() {
    if (this.targets <= 3) {
      this.factor = 1 + 0.01 * (Sim.stats.leg_nilfursboast_p6 || Sim.stats.leg_nilfursboast_p2 || Sim.stats.leg_nilfursboast || 0);
    } else if (Sim.stats.leg_nilfursboast_p6) {
      this.factor = 7;
    } else if (Sim.stats.leg_nilfursboast_p2) {
      this.factor = 3;
    } else if (Sim.stats.leg_nilfursboast) {
      this.factor = 2;
    }
  }
  function meteor_ontick(data) {
    var dmg = {type: "area", proc: data.proc};
    dmg.range = (data.rune === "a" ? 18 : 12);
    dmg.coeff = (data.rune === "a" ? 6.25/3 : (data.rune === "b" ? 0.7 / 2 : 2.35 / 3));
    if (data.rune === "b") {
      //dmg.count = 7;
      dmg.spread = 25;
    }
    if (Sim.stats.leg_nilfursboast || Sim.stats.leg_nilfursboast_p2 || Sim.stats.leg_nilfursboast_p6) dmg.fix = meteor_nilfurs_fix;
    Sim.damage(dmg);
  }
  function meteor_onhit(data) {
    var rune = data.castInfo.rune;
    Sim.addBuff(undefined, undefined, {
      duration: (rune === "b" ? 120 : 180),
      tickrate: 60,
      tickinitial: 1,
      ontick: meteor_ontick,
      data: {rune: rune, proc: data.proc},
    });
    if (rune === "c") {
      if (Sim.stats.chilled) Sim.addBuff("frozen", undefined, {duration: 60, targets: data.targets});
      Sim.addBuff("chilled", undefined, {duration: 180, targets: data.targets});
    }
  }
  skills.meteor = {
    offensive: true,
    frames: 57.142834,
    cost: function(rune) {
      return 40 * (1 - 0.01 * ((Sim.stats.leg_thegrandvizier_p6 && 50) || Sim.stats.leg_thegrandvizier || 0));
    },
    cooldown: {a: 15},
    oncast: function(rune) {
      var dmg;
      switch (rune) {
      case "x": dmg = {delay: 75, type: "area", range: 12, coeff: 7.4}; break;
      case "e": dmg = {type: "area", range: 12, coeff: 7.4}; break;
      case "d":
        dmg = {delay: 75, type: "area", range: 12, coeff: 7.4};
        if (!Sim.castInfo().triggered) {
          dmg.coeff += 0.2 * Sim.resources.ap;
          Sim.spendResource(Sim.resources.ap);
        }
        break;
      case "c": dmg = {delay: 75, type: "area", range: 12, coeff: 7.4}; break;
      case "b": dmg = {delay: 75, type: "area", range: 12, coeff: 2.77, spread: 25}; break;
      case "a": dmg = {delay: 75, type: "area", range: 18, coeff: 16.48}; break;
      }
      dmg.onhit = meteor_onhit;
      if (Sim.stats.leg_nilfursboast || Sim.stats.leg_nilfursboast_p2 || Sim.stats.leg_nilfursboast_p6) {
        dmg.fix = meteor_nilfurs_fix;
      }
      if (rune === "b") {
        for (var i = 1; i < 7; ++i) {
          Sim.damage(Sim.extend({}, dmg, {delay: 75 + i * 9}));
        }
      }
      return dmg;
    },
    elem: {x: "fir", e: "lit", d: "arc", c: "col", b: "fir", a: "fir"},
    proctable: {x: 0.0625, e: 0.04167, d: 0.0625, c: 0.0625, b: 0.025, a: 0.109375},
  };

  function blizzard_ls_onhit(data) {
    Sim.addBuff("lightningstorm", {dmgtaken: {elems: ["lit"], percent: 15}}, {duration: 16, targets: data.targets});
  }
  function blizzard_ontick(data) {
    var dmg = {type: "area", range: (data.rune === "b" ? 30 : 12), coeff: (data.rune === "a" ? 18.10 / 32 : 10.75 / 24)};
    if (data.rune === "c") {
      dmg.onhit = blizzard_ls_onhit;
    }
    Sim.damage(dmg);
  }
  skills.blizzard = {
    offensive: true,
    frames: 57.692265,
    cost: {x: 40, c: 40, e: 40, d: 10, b: 40, a: 40},
    oncast: function(rune) {
      var data = {duration: (rune === "a" ? 480 : 360), tickrate: 15, tickinitial: 1, ontick: blizzard_ontick, rune: rune};
      Sim.addBuff("blizzard", undefined, data);
      if (rune === "e") {
        Sim.addBuff("frozen", undefined, {duration: 150, targets: Sim.getTargets(12)});
      }
    },
    elem: {x: "col", c: "lit", e: "col", d: "col", b: "fir", a: "col"},
    proctable: {x: 0.0125, c: 0.0125, e: 0.0125, d: 0.0125, b: 0.0125, a: 0.0125},
  };

  function ia_storm_ontick(data) {
    Sim.damage({type: "area", self: true, range: 15, coeff: 0.4});
  }
  skills.icearmor = {
    frames: 56.249996,
    cost: 25,
    oncast: function(rune) {
      var params = {};
      switch (rune) {
      case "b":
        params.status = "chilled";
        break;
      case "c":
        params.tickrate = 30;
        params.ontick = ia_storm_ontick;
        break;
      }
      Sim.addBuff("icearmor", {meleedef: (Sim.stats.leg_haloofarlyse || 12)}, params);
    },
    oninit: function(rune) {
      this.oncast(rune);
      Sim.register("ongethit", function() {
        if (!Sim.getBuff("icearmor")) return;
        if (rune === "d") {
          Sim.addBuff("crystallize", {armor_percent: 20}, {duration: 1800, maxstacks: 3});
        } else if (rune === "a") {
          Sim.damage({coeff: 1.89});
        } else if (rune === "e") {
          if (Sim.random("icereflect", 0.4)) Sim.damage({type: "area", range: 12.5, damage: 0.75, onhit: Sim.apply_effect("frozen", 180)});
        }
      });
    },
    elem: "col",
    proctable: {c: 0.125},
  };

  function sa_ontick(data) {
    Sim.damage({coeff: (data.rune === "a" ? 3.15 : 1.75)});
  }
  function sa_shocking_onhit(data) {
    Sim.damage({coeff: 4.25, count: data.targets * data.proc * 0.01 * Sim.stats.final.chc, proc: 0});
  }
  skills.stormarmor = {
    frames: 56.249996,
    cost: 25,
    oncast: function(rune) {
      var params = {tickrate: Math.round(this.rate), ontick: sa_ontick, rune: rune};
      switch (rune) {
      case "b": params.status = "chilled"; break;
      case "c":
        params.tickrate = 30;
        params.ontick = ia_storm_ontick;
        break;
      case "e":
        params.onapply = function() {Sim.register("onhit_proc", sa_shocking_onhit);};
        params.onexpire = function() {Sim.unregister("onhit_proc", sa_shocking_onhit);};
        break;
      }
      Sim.addBuff("stormarmor", rune === "d" ? {rcrint: 3} : undefined, params);
    },
    oninit: function(rune) {
      var chance = 0.06;
      var sum = 0;
      var product = 1;
      do {
        sum += product;
        product *= 1 - chance;
        chance += 0.06;
      } while (chance < 1);
      this.rate = sum * 12;
      this.oncast(rune);
      Sim.register("ongethit", function() {
        if (!Sim.getBuff("stormarmor")) return;
        if (rune === "c") {
          Sim.damage({coeff: 1.89});
        } else if (rune === "b") {
          Sim.addBuff("scramble", {extrams: 25}, {duration: 180});
        }
      });
    },
    elem: "lit",
    proctable: {x: 0.1, c: 0.1, d: 0.1, a: 0.1, b: 0.1, e: 0.1},
  };

  function mw_electrify_onhit(data) {
    Sim.damage({targets: 3, count: data.count * data.proc, coeff: 0.61});
  }
  function mw_conduit_onhit(data) {
    if (data.castInfo && data.castInfo.user && !data.castInfo.triggered) {
      var user = data.castInfo.user;
      user.conduit = (user.conduit || 0);
      if (data.targets > user.conduit) {
        Sim.addResource((data.targets - user.conduit) * 3);
        user.conduit = data.targets;
      }
    }
  }
  function mw_ignite_onhit(data) {
    Sim.damage({count: data.count * data.proc, coeff: 3});
  }
  skills.magicweapon = {
    frames: 56.249996,
    cost: 25,
    oncast: function(rune) {
      var params;
      switch (rune) {
      case "b":
        params = {
          onapply: function() {Sim.register("onhit_proc", mw_electrify_onhit);},
          onexpire: function() {Sim.unregister("onhit_proc", mw_electrify_onhit);}
        };
        break;
      case "d":
        params = {
          onapply: function() {Sim.register("onhit_proc", mw_conduit_onhit);},
          onexpire: function() {Sim.unregister("onhit_proc", mw_conduit_onhit);}
        };
        break;
      case "a":
        params = {
          onapply: function() {Sim.register("onhit_proc", mw_ignite_onhit);},
          onexpire: function() {Sim.unregister("onhit_proc", mw_ignite_onhit);}
        };
        break;
      }
      Sim.addBuff("magicweapon", {damage: (rune === "c" ? 20 : 10)}, params);
    },
    oninit: function(rune) {
      this.oncast(rune);
    },
    elem: {x: "arc", b: "lit", c: "arc", d: "arc", a: "fir", e: "arc"},
  };

  function familiar_oncast(event) {
    var data = event.data;
    if (data.last === undefined || data.last + data.icd <= event.time) {
      var dmg = {type: "line", speed: 1, coeff: 2.4};
      if (data.rune === "c") dmg.onhit = Sim.apply_effect("frozen", 60, 0.35);
      if (data.rune === "b") dmg.area = 6;
      Sim.damage(dmg);
      data.last = event.time;
    }
  }
  skills.familiar = {
    frames: 56.249996,
    cost: 20,
    oncast: function(rune) {
      var buffs = undefined;
      if (rune === "a") buffs = {damage: 10};
      if (rune === "d") buffs = {apregen: 4.5};
      Sim.addBuff("familiar", buffs, {
        data: {rune: rune},
        onapply: function(data) {
          Sim.register("oncast", familiar_oncast, data);
          data.icd = 54 / Sim.stats.info.aps;
        },
        onrefresh: function(data) {
          data.icd = 54 / Sim.stats.info.aps;
        },
        onexpire: function(data) {
          Sim.unregister("oncast", familiar_oncast);
        },
      });
    },
    oninit: function(rune) {
      this.oncast(rune);
    },
    elem: {x: "arc", a: "fir", c: "col", e: "arc", d: "arc", b: "arc"},
  };

  skills.energyarmor = {
    frames: 56.249996,
    cost: 20,
    oncast: function(rune) {
      var buffs = {armor_percent: 35, maxap: -20};
      switch (rune) {
      case "e": buffs.chc = 5; break;
      case "b": buffs.maxap = 20; break;
      case "a": buffs.resist_percent = 25; break;
      }
      Sim.addBuff("energyarmor", buffs);
    },
    oninit: function(rune) {
      this.oncast(rune);
    },
    elem: "arc",
  };

  skills.explosiveblast = {
    offensive: true,
    secondary: true,
    frames: 56.249996,
    cost: 20,
    cooldown: {x: 6, d: 6, c: 3, a: 6, b: 6, e: 6},
    range: {},
    oncast: function(rune) {
      var dmg = {delay: 90, self: true, type: "area", range: 12, coeff: 9.45};
      switch (rune) {
      case "d": dmg.coeff = 14.85; break;
      case "a": dmg.delay = 6; dmg.coeff = 9.09; break;
      case "b": dmg.range = 18; dmg.coeff = 9.9; break;
      case "e":
        dmg.coeff = 5.2;
        var delay = Math.floor(60 / Sim.stats.info.aps);
        Sim.damage(Sim.extend({}, dmg, {delay: 90 + delay}));
        Sim.damage(Sim.extend({}, dmg, {delay: 90 + 2 * delay}));
      }
      Sim.damage(dmg);
    },
    elem: {x: "arc", d: "arc", c: "lit", a: "fir", b: "col", e: "fir"},
    proctable: {x: 0.04, d: 0.04, c: 0.04, a: 0.04, b: 0.025, e: 0.04 / 3},
  };

  skills.mirrorimage = {
    frames: 57.692265,
    cooldown: 15,
    oncast: function(rune) {
      Sim.addBuff("mirrorimage", undefined, {duration: (rune === "d" ? 10 : 7)});
    },
    elem: "arc",
  };

  function archon_onexpire(data) {
    if (Sim.stats.leg_theswami || Sim.stats.leg_theswami_p3) {
      var stacks = Sim.getBuff("archon_stacks");
      Sim.removeBuff("theswami");
      Sim.addBuff("theswami", undefined, {stacks: stacks, duration: 60 * (Sim.stats.leg_theswami_p3 || Sim.stats.leg_theswami)});
    }
    Sim.removeBuff("archon_stacks");
  }
  skills.archon = {
    frames: 57.391354,
    offensive: true,
    cooldown: function(rune) {
      return (rune === "d" || Sim.stats.set_vyr_2pc ? 100 : 120);
    },
    oncast: function(rune) {
      Sim.removeBuff("archon_stacks");
      if (Sim.stats.leg_fazulasimprobablechain || Sim.stats.leg_fazulasimprobablechain_p2) {
        Sim.addBuff("archon_stacks", undefined, {maxstacks: 9999, stacks:
          Sim.stats.leg_fazulasimprobablechain || Sim.stats.leg_fazulasimprobablechain_p2});
      }
      if (rune === "e" || Sim.stats.set_vyr_2pc) {
        Sim.damage({delay: 1, type: "area", range: 15, coeff: 36.8, elem: this.default_elem[rune]});
      }
      Sim.addBuff("archon", {shift: "archon", dmgmul: 30, armor_percent: 150, resist_percent: 150}, {
        duration: 1200,
        onexpire: archon_onexpire,
      });
    },
    oninit: function(rune) {
      Sim.register("onkill", function(data) {
        if (Sim.getBuff("archon")) {
          Sim.addBuff("archon_stacks", undefined, {maxstacks: 9999});
        }
      });
      var buffname;
      function update() {
        var stats = {dmgmul: 6};
        if (Sim.stats.set_vyr_4pc) {
          stats.ias = 1;
          stats.armor_percent = 1;
          stats.resist_percent = 1;
        }
        if (Sim.stats.set_vyr_6pc) {
          stats.dmgred = 0.15;
          stats.dmgmul = 100;
        }
        buffname = Sim.setBuffStacks(buffname, stats, Sim.getBuff("archon_stacks") + Sim.getBuff("theswami"));
      }
      Sim.watchBuff("archon_stacks", update);
      Sim.watchBuff("theswami", update);
    },
    default_elem: {x: "arc", e: "fir", c: "arc", d: "lit", b: "col", a: "arc"},
    elem: function(rune) {
      if (Sim.stats.set_vyr_2pc) return Sim.stats.info.maxelem;
      return this.default_elem[rune];
    },
  };

  skills.archon_arcanestrike = {
    offensive: true,
    frames: 57.599954,
    shift: "archon",
    oncast: function(rune) {
      var improved = (Sim.stats.skills.archon === "a" || Sim.stats.set_vyr_2pc);
      var res = {type: "area", front: true, range: 9, coeff: 7.9 * (improved ? 1.5 : 1)}
      if (Sim.stats.skills.archon === "b" || Sim.stats.set_vyr_2pc) {
        res.onhit = Sim.apply_effect("frozen", 60);
      }
      return res;
    },
    elem: function(rune) {
      return skills.archon.elem(Sim.stats.skills.archon);
    },
    proctable: 0.5,
  };
  skills.archon_arcaneblast = {
    offensive: true,
    frames: 100,
    secondary: true,
    cooldown: 2,
    shift: "archon",
    oncast: function(rune) {
      var improved = (Sim.stats.skills.archon === "a" || Sim.stats.set_vyr_2pc);
      var res = {type: "area", range: 15, coeff: 6.04 * (improved ? 1.5 : 1)};
      if (Sim.stats.skills.archon === "b" || Sim.stats.set_vyr_2pc) {
        res.onhit = Sim.apply_effect("frozen", 60);
      }
      return res;
    },
    elem: function(rune) {
      return skills.archon.elem(Sim.stats.skills.archon);
    },
    proctable: 0.25,
  };
  function archon_wave_ontick(data) {
    data.dmg.factor = Sim.stats.info.aps * data.buff.params.tickrate / 60;
    Sim.damage(data.dmg);
  }
  skills.archon_disintegrationwave = {
    offensive: true,
    channeling: 20,
    frames: 58.064510,
    shift: "archon",
    oncast: function(rune) {
      var improved = (Sim.stats.skills.archon === "a" || Sim.stats.set_vyr_2pc);
      var dmg = {type: "line", pierce: true, coeff: 7.79 * (improved ? 1.5 : 1), radius: 2};
      Sim.channeling("archon_disintegrationwave", this.channeling, archon_wave_ontick, {dmg: dmg});
    },
    elem: function(rune) {
      return skills.archon.elem(Sim.stats.skills.archon);
    },
    proctable: 0.1,
  };
  skills.archon_slowtime = {
    precast: function(rune) {
      return !!(Sim.stats.skills.archon === "b" || Sim.stats.set_vyr_2pc);
    },
    frames: 57.391296,
    secondary: true,
    shift: "archon",
    oncast: function(rune) {
      var st_rune = (Sim.stats.skills.slowtime || "x");
      var targets = Sim.getTargets(21);

      var params = {duration: 900, status: "slowed", targets: targets};
      var buffs = undefined;
      if (st_rune === "a" || Sim.stats.leg_crownoftheprimus) buffs = {dmgtaken: 15};
      Sim.addBuff("slowtime", buffs, params);

      if (st_rune === "b" || Sim.stats.leg_crownoftheprimus) {
        Sim.addBuff("stunned", undefined, {duration: 300, targets: targets});
      }

      var selfbuffs = {};
      if (Sim.stats.set_magnumopus_4pc) selfbuffs.dmgred = 50;
      if (st_rune === "e" || Sim.stats.leg_crownoftheprimus) selfbuffs.ias = 10;
      if (selfbuffs.dmgred || selfbuffs.ias) {
        st_self = Sim.addBuff(st_self, selfbuffs, {duration: 900});
      }
    },
    elem: function(rune) {
      return skills.archon.elem(Sim.stats.skills.archon);
    },
  };
  skills.archon_teleport = {
    precast: function(rune) {
      return !!(Sim.stats.skills.archon === "c" || Sim.stats.set_vyr_2pc);
    },
    frames: 57.391296,
    speed: function(rune, aps) {
      return aps * 1.5;
    },
    cooldown: function(rune) {
      return Sim.stats.leg_aetherwalker ? 0.5 : 2;
    },
    shift: "archon",
    oncast: function(rune) {
    },
    elem: function(rune) {
      return skills.archon.elem(Sim.stats.skills.archon);
    },
  };

  function bh_zero_onhit(data) {
    Sim.addBuff("absolutezero", {dmgcol: 3}, {duration: 600, stacks: Sim.random("absolutezero", 1, data.targets, true)});
  }
  function bh_spellsteal_onhit(data) {
    Sim.addBuff("spellsteal", {damage: 3}, {duration: 300, stacks: Sim.random("spellsteal", 1, data.targets, true)});
  }
  function bh_ontick(data) {
    var dmg = {type: "area", range: 15, coeff: 7 / 15};
    switch (data.rune) {
    case "a":
      dmg.range = 20;
      dmg.coeff = 12.9 / 15;
      break;
    case "e":
      if (!data.buffed) {
        dmg.onhit = bh_zero_onhit;
        data.buffed = true;
      }
      break;
    case "d":
      if (!data.buffed) {
        dmg.onhit = bh_spellsteal_onhit;
        data.buffed = true;
      }
      break;
    }
    Sim.damage(dmg);
  }
  function bh_blazar_onexpire(data) {
    Sim.damage({type: "area", range: 15, coeff: 7.25, proc: 0});
  }
  skills.blackhole = {
    offensive: true,
    frames: 56.842068,
    cost: 20,
    cooldown: 12,
    oncast: function(rune) {
      Sim.removeBuff("absolutezero");
      Sim.removeBuff("spellsteal");
      var params = {duration: 120, tickrate: 8, tickinitial: 1, ontick: bh_ontick, data: {rune: rune}};
      if (rune === "c") {
        params.onexpire = bh_blazar_onexpire;
      }
      if (!Sim.target.boss) {
        params.status = "knockback";
      }
      Sim.addBuff(undefined, undefined, params);
    },
    elem: {x: "arc", a: "lit", e: "col", b: "arc", c: "fir", d: "arc"},
    proctable: {x: 0.026672, a: 0.0213376, e: 0.026672, b: 0.026672, c: 0.026672, d: 0.026672},
  };

  Sim.passives = {
    powerhungry: function() {
      var tgt = Math.round(Sim.getTargets(30, Sim.target.distance));
      if (tgt < Sim.target.count) {
        Sim.addBuff("powerhungry", {dmgmul: {pet: false, percent: 30}}, {targets: Sim.target.count - tgt, aura: true});
      }
    },
    blur: {dmgred: 17},
    evocation: {cdr: 20},
    glasscannon: {damage: 15, armor_percent: -10, resist_percent: -10},
    prodigy: function() {
      var cache = {};
      Sim.register("oncast", function(data) {
        if (skills[data.skill] && skills[data.skill].signature) {
          var delay = 54 / Sim.stats.info.aps;
          if (cache[data.skill] === undefined || Sim.time >= cache[data.skill] + delay) {
            cache[data.skill] = Sim.time;
            Sim.addResource(5);
          }
        }
      });
    },
    astralpresence: {maxap: 20, apregen: 2.5},
    illusionist: function() {
    },
    coldblooded: function() {
      Sim.register("updatestats", function(data) {
        var count = data.stats.countStatus("chilled", "frozen");
        if (count) data.stats.add("dmgtaken", 10 * count / Sim.target.count);
      });
    },
    conflagration: function() {
      Sim.register("onhit", function(data) {
        if (data.elem === "fir") {
          Sim.addBuff("conflagration", {chctaken: 6}, {duration: 180, targets: data.targets});
        }
      });
    },
    paralysis: function() {
      var func = Sim.apply_effect("stunned", 90, 0.15, true);
      Sim.register("onhit_proc", function(data) {
        if (data.elem === "lit") {
          func(data);
          if (Sim.stats.leg_manaldheal) {
            Sim.pushCastInfo({triggered: "leg_manaldheal"});
            Sim.damage({count: data.targets * data.count * 0.15, coeff: Sim.stats.leg_manaldheal * 0.01, elem: "lit", manald: true});
            Sim.popCastInfo();
          }
        }
      });
    },
    galvanizingward: function() {
    },
    temporalflux: function() {
      Sim.register("onhit", function(data) {
        if (data.elem === "arc") {
          Sim.addBuff("slowed", undefined, {duration: 120, targets: data.targets});
        }
      });
    },
    dominance: function() {
      Sim.register("onkill", function(data) {
        var stacks = Sim.getBuff("dominance");
        Sim.addBuff("dominance", undefined, {
          duration: 180 + 30 * Math.min(stacks + 1, 10),
          maxstacks: 10,
        });
      });
    },
    arcanedynamo: function() {
      var bufflist = ["rayoffrost", "arcaneorb", "arcanetorrent", "disintegrate", "hydra",
                      "waveofforce", "energytwister", "meteor", "blizzard", "explosiveblast"];
      Sim.register("oncast", function(data) {
        if (skills[data.skill] && skills[data.skill].signature) {
          Sim.addBuff("arcanedynamo", undefined, {maxstacks: 5});
        } else if (bufflist.indexOf(data.skill) >= 0) {
          if (Sim.getBuff("arcanedynamo") >= 5) {
            Sim.removeBuff("arcanedynamo");
            var result = {percent: 60};
            if (data.skill === "meteor" && data.rune === "d") {
              // has this been fixed yet?
              result.percent = 156;
            }
            return result;
          }
        }
      });
    },
    unstableanomaly: function() {
    },
    unwaveringwill: function() {
      Sim.addBuff("unwaveringwill", {armor_percent: 20, resist_percent: 20, damage: 10});
    },
    audacity: function() {
      Sim.addBuff("audacity", {dmgmul: {pet: false, percent: 30}}, {targets: Sim.getTargets(15, Sim.target.distance), aura: true});
    },
    elementalexposure: function() {
      var stacks = {"fir": "ee_fire", "col": "ee_cold", "arc": "ee_arcane", "lit": "ee_lightning"};
      function trigger(elem, data) {
        var name = stacks[elem];
        if (!name) return;
        Sim.addBuff(name, {dmgtaken: (Sim.stats.leg_primordialsoul ? 10 : 5)}, {duration: 300, targets: data.targets, firsttarget: data.firsttarget});
      }
      Sim.register("onhit", function(data) {
        if (data.elem) trigger(data.elem, data);
        if (Sim.stats.info.mhelement) trigger(Sim.stats.info.mhelement, data);
      });
      Sim.metaBuff("elementalexposure", ["ee_fire", "ee_cold", "ee_arcane", "ee_lightning"]);
    },
  };

  Sim.register("init", function() {
    if (Sim.stats.apoc) {
      Sim.pushCastInfo({triggered: "apoc"});
      Sim.register("onhit_proc", function(data) {
        Sim.addResource(data.targets * data.proc * data.chc * Sim.stats.apoc);
      });
      Sim.popCastInfo();
    }
  });

})();

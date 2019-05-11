(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  var pd_snake_onhit = Sim.apply_effect("stunned", 90, 0.35);
  function pd_onhit(data) {
    var params = {
      duration: 121,
      tickrate: 30,
      ontick: {coeff: 0.1},
      targets: data.targets,
      firsttarget: data.firsttarget,
    };
    switch (data.castInfo.rune) {
    case "d": Sim.addResource(50); break;
    case "e": pd_snake_onhit(data); break;
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
      targets: data.targets,
      firsttarget: data.firsttarget,
    });
  }
  skills.poisondart = {
    signature: true,
    offensive: true,
    frames: 58,
    oncast: function(rune) {
      var pierce = !!Sim.stats.leg_thedaggerofdarts;
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

  function cs_bs_onhit(data) {
    Sim.addResource(3 * data.targets);
    if (Sim.stats.leg_thespiderqueensgrasp) {
      Sim.addBuff("slowed", undefined, {duration: 180, targets: data.targets, firsttarget: data.firsttarget});
    }
  }
  skills.corpsespiders = {
    signature: true,
    offensive: true,
    frames: 58,
    oncast: function(rune) {
      var params = {duration: 240, tickrate: 60, tickinitial: 70, ontick: {count: 4, coeff: 0.48, pet: true}};
      switch (rune) {
      case "c": params.ontick.coeff *= 1.12; break;
      case "b":
        Sim.addBuff("spiderqueen", undefined, {
          duration: 901,
          tickrate: 15,
          ontick: {type: "area", range: 10, coeff: 1.75 / 4, pet: true},
        });
        return;
      case "d": params.ontick.coeff *= 1.215; break;
      case "e": params.ontick.onhit = Sim.apply_effect("slowed", 90); break;
      case "a": params.ontick.onhit = cs_bs_onhit; break;
      }
      if (Sim.stats.leg_thespiderqueensgrasp && rune !== "d") {
        params.ontick.onhit = Sim.apply_effect("slowed", 180);
      }
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.11, c: 0.11, b: 0.15, d: 0.11, e: 0.11, a: 0.11},
    elem: {x: "phy", c: "psn", b: "psn", d: "phy", e: "col", a: "fir"},
  };

  function pot_ta_onhit(data) {
    Sim.addResource(9 * data.targets);
  }
  skills.plagueoftoads = {
    signature: true,
    offensive: true,
    frames: {x: 57.5, a: 57.5, c: 57.5, b: 55.384609, e: 57.5, d: 57.5},
    speed: function(rune, aps) {
      return aps * (rune === "b" ? 1.4 : 1);
    },
    oncast: function(rune) {
      var fan = (Sim.stats.leg_rhenhoflayer ? undefined : 40);
      var pierce = (Sim.stats.leg_rhenhoflayer ? 1 : undefined);
      switch (rune) {
      case "x": return {pierce: pierce, fan: fan, type: "line", speed: 0.65, count: 3, coeff: 1.9};
      case "a": return {pierce: pierce, fan: fan, type: "line", speed: 0.65, count: 3, coeff: 2.45};
      case "c": return {pierce: true, fan: fan, type: "line", speed: 0.65, count: 3, coeff: 1.3};
      case "b":
        Sim.addBuff(undefined, undefined, {
          duration: 120,
          tickrate: 30,
          tickinitial: 1,
          ontick: {type: "area", range: 8, coeff: 1.3 / 4},
        });
        break;
      case "e": return {pierce: pierce, fan: fan, type: "line", speed: 0.65, count: 3, coeff: 1.9, onhit: Sim.apply_effect("charmed", 240, 0.15)};
      case "d": return {pierce: pierce, fan: fan, type: "line", speed: 0.65, count: 3, coeff: 1.9, onhit: pot_ta_onhit};
      }
    },
    proctable: {x: 0.667, a: 0.667, c: 0.5, b: 0.1667, e: 0.667, d: 0.667},
    elem: {x: "psn", a: "fir", c: "phy", b: "psn", e: "psn", d: "col"},
  };

  function firebomb_pit_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 181,
      tickrate: 30,
      ontick: {type: "area", range: 8, coeff: 0.1, proc: 0.067},
    });
  }
  skills.firebomb = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return Sim.stats.leg_mordulluspromise;
    },
    frames: 58,
    oncast: function(rune) {
      switch (rune) {
      case "x": return {delay: Math.floor(Sim.target.distance), type: "area", range: 8, coeff: 1.55};
      case "e":
        var targets = Math.min(7, Sim.target.count);
        var dmg = (1 - Math.pow(0.85, targets)) / 0.15;
        return {delay: Math.floor(Sim.target.distance), targets: targets, coeff: 1.55 * dmg / targets};
      case "b":
        Sim.damage({delay: Math.floor(Sim.target.distance + 14), type: "area", origin: -14, range: 8, coeff: 1.55});
        Sim.damage({delay: Math.floor(Sim.target.distance + 28), type: "area", origin: -28, range: 8, coeff: 1.55});
        return {delay: Math.floor(Sim.target.distance), type: "area", range: 8, coeff: 1.55};
      case "c": return {delay: Math.floor(Sim.target.distance), type: "area", range: 8, coeff: 1.55, onhit: firebomb_pit_onhit};
      case "d":
        Sim.addBuff("pyrogeist", undefined, {
          maxstacks: 3,
          duration: 361,
          tickrate: 18,
          ontick: {coeff: 0.44},
        });
        return;
      case "a":
        Sim.damage({delay: Math.floor(Sim.target.distance), type: "area", range: 28, coeff: 0.3});
        return {delay: Math.floor(Sim.target.distance), type: "area", range: 8, coeff: 1.55};
      }
    },
    proctable: {x: 0.667, e: 0.2, b: 0.222, c: 0.067, d: 0.1, a: 0.1667},
    elem: {x: "fir", e: "fir", b: "fir", c: "fir", d: "fir", a: "col"},
  };

  var gg_buff;
  function grasp_ontick(data) {
    gg_buff = Sim.addBuff(gg_buff, undefined, {status: "slowed", duration: 31, targets: data.targets, firsttarget: data.firsttarget});
  }
  skills.graspofthedead = {
    offensive: true,
    frames: 57.142853,
    cost: {x: 150, a: 150, e: 150, d: 150, b: 150},
    cooldown: function(rune) {
      if (!Sim.stats.leg_wilkensreach) return (rune === "d" ? 4 : 8);
    },
    oncast: function(rune) {
      if (rune === "b" || Sim.stats.leg_deadlyrebirth) {
        Sim.addBuff(undefined, undefined, {
          duration: 181,
          tickrate: 90,
          ontick: {type: "area", range: 8, radius: 45, coeff: 2.1},
        });
      }
      Sim.addBuff("graspofthedead", undefined, {
        duration: 480,
        tickrate: 30,
        tickinitial: 1,
        ontick: {type: "area", range: 14, coeff: (rune === "a" ? 0.85 : 0.475), onhit: grasp_ontick},
      });
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (gg_buff && Sim.getBuff(gg_buff, data.target) && Sim.random("deathislife", 0.7)) {
            Sim.cast("summonzombiedogs");            
          }
        });
      }
    },
    proctable: {x: 0.07, c: 0.07, a: 0.07, e: 0.07, d: 0.07, b: 0.07},
    elem: {x: "phy", c: "col", a: "phy", e: "psn", d: "psn", b: "phy"},
  };

  skills.firebats = {
    offensive: true,
    channeling: {x: 30, a: 60, d: 30, c: 30, b: 30, e: 30},
    frames: 87.804871,
    speed: function(rune, aps) {
      return aps * (Sim.stats.leg_staffofchiroptera || Sim.stats.leg_staffofchiroptera_p6 ? 2 : 1);
    },
    initialcost: function(rune) {
      if (rune === "d") return 250 * (1 - 0.01 * ((Sim.stats.leg_staffofchiroptera_p6 && 75) || Sim.stats.leg_staffofchiroptera || 0));
    },
    cost: function(rune) {
      if (rune !== "d") return 125 * (1 - 0.01 * ((Sim.stats.leg_staffofchiroptera_p6 && 75) || Sim.stats.leg_staffofchiroptera || 0));
    },
    oncast: function(rune) {
      var dmg = {type: "cone", width: 40, range: 28, coeff: 4.75 / 2};
      switch (rune) {
      case "a": dmg.coeff = 5; break;
      case "c":
        dmg = function(data) {
          var coeff = 4.75 * (1 + 0.103 * Math.min(5, data.buff.ticks)) / 5;
          var rate = Math.floor(60 / Sim.stats.info.aps);
          Sim.addBuff(undefined, undefined, {
            duration: rate * 5 + 1,
            tickrate: rate,
            ontick: {type: "cone", width: 40, range: 28, coeff: coeff},
          });
        };
        break;
      case "b": dmg = {coeff: 7.5 / 2}; break;
      case "e":
        dmg = function(data) {
          var coeff = 4.25 * (1 + 0.2 * Math.min(5, data.buff.ticks)) / 2;
          Sim.damage({type: "area", range: 15, self: true, coeff: coeff});
        };
        break;
      }
      var base;
      if (Sim.stats.leg_coilsofthefirstspider) {
        base = {buffs: {lph: Sim.stats.leg_coilsofthefirstspider, dmgred: 30}};
      }
      Sim.channeling("firebats", this.channeling[rune], dmg, undefined, base);
    },
    proctable: {x: 0.1667, a: 0.333, d: 0.2, c: 0.2, b: 0.5, e: 0.25},
    elem: {x: "fir", a: "fir", d: "phy", c: "psn", b: "fir", e: "fir"},
  };

  function haunt_ontick(data) {
    Sim.damage({coeff: data.coeff});
    if (data.leech) {
      Sim.addResource(data.leech);
    }
  }
  function jade2_onrefresh(data) {
    Sim.damage({coeff: data.coeff * 3500 * 5});
  }
  function haunt_onhit(data) {
    var params = {
      targets: 1,
      duration: 720,
      tickrate: 12,
      tickinitial: 1,
      data: {coeff: 40 / 60},
      ontick: haunt_ontick,
    };
    if (Sim.stats.passives.creepingdeath) {
      params.duration = 19800 * 60;
    }
    if (Sim.stats.leg_quetzalcoatl) {
      params.duration /= 2;
      params.data.coeff *= 2;
    }
    if (Sim.stats.set_jadeharvester_2pc) {
      params.onrefresh = jade2_onrefresh;
    }
    if (data.castInfo.rune === "d") {
      params.data.leech = 2.5;
    }
    for (var i = 0; i < data.count; ++i) {
      params.firsttarget = (Sim.getBuffTargets("haunt") < 5 ? "new" : undefined);
      Sim.addBuff("haunt", data.castInfo.rune === "c" && {dmgtaken: 20}, params);
    }
  }
  skills.haunt = {
    offensive: true,
    frames: 57.499966,
    cost: 50,
    oncast: function(rune) {
      var count = 1;
      if (rune === "e") ++count;
      if (Sim.stats.leg_hauntinggirdle) ++count;
      Sim.damage({delay: Math.floor(Sim.target.distance / 2), count: count, coeff: 0, onhit: haunt_onhit});
    },
    oninit: function(rune) {
      Sim.register("onkill", function(data) {
        if (Sim.getBuff("haunt", data.target)) {
          Sim.damage({delay: 30, coeff: 0, onhit: haunt_onhit});
        }
      });
    },
    proctable: 1,
    elem: {x: "col", a: "fir", e: "col", b: "col", c: "psn", d: "phy"},
  };

  function swarm_ontick(data) {
    Sim.damage({coeff: data.coeff});
    if (data.leech) {
      Sim.addResource(data.leech);
    }
    ++data.spread;
    if (data.spread === 3) {
      var count = 1;
      if (data.rune === "b" || Sim.stats.leg_vilehive) {
        count = 2;
      }
      Sim.damage({coeff: 0, targets: count, onhit: swarm_onhit, proc: data.proc});
    }
  }
  function swarm_onhit(data) {
    var tlist = Sim.target.list();
    data.castInfo.sindex = (data.castInfo.sindex || 0);
    var index = 0;
    while (index < tlist.length && tlist[index] < data.castInfo.sindex) {
      ++index;
    }
    for (var i = 0; i < data.targets && index < tlist.length; ++i, ++index) {
      var params = {
        targets: 1,
        firsttarget: tlist[index],
        duration: 480,
        tickrate: 12,
        tickinitial: 1,
        data: {coeff: 1.3 / 5, rune: data.castInfo.rune, proc: data.proc, spread: 0},
        ontick: swarm_ontick,
      };
      data.castInfo.sindex = tlist[index] + 1;
      if (data.castInfo.rune === "d" && (!data.castInfo.user || !data.castInfo.user.spread)) {
        params.data.leech = 5;
      }
      if (data.castInfo.rune === "a") {
        params.data.coeff = 1.85 / 5;
      }
      if (Sim.stats.passives.creepingdeath) {
        params.duration = 14400 * 60;
      }
      if (Sim.stats.leg_quetzalcoatl) {
        params.duration /= 2;
        params.data.coeff *= 2;
      }
      if (Sim.stats.leg_hwojwrap) {
        params.status = "slowed";
      }
      Sim.addBuff("locustswarm", undefined, params);
    }
  }
  skills.locustswarm = {
    offensive: true,
    frames: 56,
    cost: 300,
    oncast: function(rune) {
      Sim.damage({coeff: 0, onhit: swarm_onhit});
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (Sim.getBuff("locustswarm", data.target)) {
            Sim.addBuff(undefined, undefined, {
              duration: 181,
              tickrate: 30,
              ontick: {type: "area", range: 6, coeff: 1.25},
            });
          }
        });
      }
    },
    proctable: 0.333,
    elem: {x: "psn", b: "psn", d: "col", c: "phy", e: "psn", a: "fir"},
  };

  function dogs_rabid_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 181,
      tickrate: 60,
      ontick: {pet: true, coeff: 0.4 * Sim.stats.info.aps, targets: data.targets, firsttarget: data.firsttarget},
    });
  }
  function dogs_chilled_onhit(data) {
    Sim.addBuff("chilledtothebone", undefined, {duration: 180, status: "chilled",
      targets: data.targets, firsttarget: data.firsttarget});
  }
  function dogs_ontick(data) {
    Sim.damage({pet: true, distance: 5, coeff: Sim.stats.info.aps * data.coeff, onhit: data.onhit});
  }
  skills.summonzombiedogs = {
    offensive: true,
    pet: true,
    frames: 56.249996,
    cooldown: function(rune) {
      return 45 * (Sim.stats.passives.tribalrites ? 0.75 : 1);
    },
    oncast: function(rune) {
      var params = {
        maxstacks: 3,
        tickrate: [52, 58],
        refresh: false,
        data: {coeff: 1.2},
        ontick: dogs_ontick,
      };
      if (Sim.stats.passives.zombiehandler) params.maxstacks += 1;
      if (Sim.stats.passives.fierceloyalty) params.maxstacks += 1;
      if (Sim.stats.passives.midnightfeast) params.maxstacks += 1;
      if (Sim.stats.leg_thetallmansfinger) {
        params.data.coeff *= 1 + 8 * params.maxstacks;
        params.maxstacks = 1;
      }
      switch (rune) {
      case "c": params.data.onhit = dogs_rabid_onhit; break;
      case "d": params.data.onhit = dogs_chilled_onhit; break;
      }
      if (Sim.castInfo().triggered) {
        if (Sim.getBuff("zombiedogs") >= params.maxstacks) return;
      } else {
        params.stacks = params.maxstacks;
      }
      if (Sim.stats.leg_anessaziedge && Sim.getTargets(12, Sim.target.distance)) {
        Sim.addBuff("stunned", undefined, 90);
      }
      Sim.petattack("zombiedogs", undefined, params);
    },
    oninit: function(rune) {
      if (rune === "a") {
        Sim.after(30, function burning() {
          var stacks = Sim.getBuff("zombiedogs");
          if (stacks) {
            Sim.damage({type: "area", range: 8, origin: 5, coeff: 0.2 * Sim.stats.info.aps, pet: true, count: stacks});
          }
          Sim.after(30, burning);
        });
      }
    },
    elem: {x: "phy", c: "psn", d: "col", b: "phy", a: "fir", e: "phy"},
  };

  function horrify_onhit(data) {
    if (data.castInfo.rune === "d") Sim.addResource(data.targets * 55);
    if (Sim.stats.leg_tiklandianvisage) {
      Sim.addBuff("horrify", undefined, {duration: 480, status: "feared", nodr: true,
        targets: data.targets, firsttarget: data.firsttarget});
    } else {
      var duration = 180;
      if (data.castInfo.rune === "c") duration = 300;
      Sim.addBuff("horrify", undefined, {duration: duration, status: "feared",
        targets: data.targets, firsttarget: data.firsttarget});
    }
  }
  skills.horrify = {
    secondary: true,
    frames: 57.692299,
    cooldown: 10,
    oncast: function(rune) {
      var range = 18;
      switch (rune) {
      case "e": Sim.addBuff("stalker", {extrams: 20}, {duration: 240}); break;
      case "b": range = 24; break;
      case "a": Sim.addBuff("frighteningaspect", {armor_percent: 50}, {duration: 480}); break;
      }
      Sim.damage({type: "area", range: range, self: true, coeff: 0, onhit: horrify_onhit});
    },
    proctable: {x: 0.25, c: 0.25, e: 0.25, b: 0.2, a: 0.25, d: 0.25},
    elem: "phy",
  };

  function sw_shock(data) {
    Sim.damage({type: "area", range: 10, self: true, coeff: 7.5});
  }
  skills.spiritwalk = {
    secondary: true,
    frames: 43.902412,
    cooldown: 10,
    duration: {x: 120, b: 180, d: 120, c: 120, a: 120, e: 120},
    oncast: function(rune) {
      var buffs = {extrams: 50};
      var params = {duration: 120};
      switch (rune) {
      case "b": duration = 180; break;
      case "d": Sim.addResource(0.2 * (Sim.stats.maxmana || 0)); break;
      case "c": params.onexpire = sw_shock; break;
      case "a": buffs.extrams += 100; break;
      }
      Sim.addBuff("spiritwalk", buffs, params);
    },
    proctable: {c: 0.333, a: 0.2},
    elem: {x: "phy", b: "phy", d: "phy", c: "fir", a: "phy", e: "phy"},
  };

  skills.hex = {
    secondary: true,
    frames: 56.249996,
    cooldown: function(rune) {
      return 15 * (Sim.stats.passives.tribalrites ? 0.75 : 1);
    },
    oncast: function(rune) {
      if (rune === "a" || Sim.stats.set_arachyr_4pc) {
        var buffs = {dmgtaken: 15};
        Sim.addBuff("toadofhugeness", buffs, {
          duration: 301,
          tickrate: 30,
          ontick: {coeff: 0.75},
          targets: 1,
        });
        if (rune === "a") return;
      }
      if (rune === "b") {
        var mj = (Sim.stats.set_manajuma_2pc ? 1 : 0);
        Sim.addBuff("angrychicken", {shift: "angrychicken", extrams: 50 + mj * 200}, {
          duration: mj ? 900 : 120,
          onexpire: function(data) {
            Sim.damage({type: "area", range: 12, self: true, coeff: 13.5 * (1 + 2 * mj)});
          },
        });
        return;
      }
      Sim.addBuff(undefined, undefined, {
        duration: 720,
        tickrate: 180,
        tickinitial: 1,
        ontick: function() {
          Sim.addBuff("hex", {dmgtaken: (rune === "e" ? 15 : 0)}, {
            duration: 180,
            status: "charmed",
            targets: Sim.getTargets(12),
          });
        },
      });
    },
    oninit: function(rune) {
      if (rune === "c") {
        Sim.register("onkill", function(data) {
          if (Sim.getBuff("hex", data.target)) {
            Sim.damage({type: "area", range: 8, coeff: 5});
          }
        });
      }
    },
    proctable: {c: 0.333, a: 0.2},
    elem: {x: "phy", d: "phy", e: "phy", b: "psn", a: "psn", c: "fir"},
  };
  skills.hex_explode = {
    secondary: true,
    frames: 60,
    shift: "angrychicken",
    oncast: function(rune) {
      Sim.removeBuff("angrychicken");
    },
    proctable: 0.333,
    elem: "fir",
  };

  function jade6_apply(id, targets) {
    var total = 0;
    var tickrate = 12;
    var res = Sim.reduceBuffDuration(id, 10000 * 60, targets);
    for (var i = 0; i < res.length; ++i) {
      var stack = res[i].buff;
      Sim.pushCastInfo(stack.castInfo);
      var event = Sim.calcDamage({coeff: stack.data.coeff,
        elem: stack.castInfo.elem, skill: stack.castInfo.skill, weapon: stack.castInfo.weapon});
      Sim.popCastInfo();
      total += event.damage * res[i].duration / tickrate;
    }
    return total;
  }
  skills.soulharvest = {
    secondary: true,
    frames: 58.536537,
    cooldown: 12,
    oncast: function(rune) {
      //Sim.removeBuff("soulharvest");
      var targets = Math.ceil(Sim.getTargets(18, Sim.target.distance));
      var buffs = {int_percent: 3};
      if (rune === "d" || Sim.stats.set_jadeharvester_4pc) {
        Sim.addResource(0.05 * targets * (Sim.stats.maxmana || 0));
        buffs.maxmana_percent = 5;
      }
      if (rune === "c" || Sim.stats.set_jadeharvester_4pc) {
        buffs.armor_percent = 10;
      }
      var duration = 1800;
      if (rune === "b" || Sim.stats.set_jadeharvester_4pc) {
        buffs.extrams = 5;
      }
      if (Sim.stats.leg_lakumbasornament) {
        buffs.dmgred = 6;
      }
      Sim.addBuff("soulharvest", buffs, {refresh: false, duration: duration, stacks: targets, maxstacks: Sim.stats.leg_sacredharvester ? 10 : 5});
      if (rune === "e" || Sim.stats.set_jadeharvester_4pc) {
        Sim.damage({type: "area", range: 18, self: true, coeff: 6.3});
      }
      if (targets && Sim.stats.set_jadeharvester_6pc) {
        Sim.dealDamage({
          targets: targets,
          count: 1,
          skill: "soulharvest",
          proc: 0,
          damage: (jade6_apply("haunt", targets) + jade6_apply("locustswarm", targets)) / targets,
          castInfo: Sim.castInfo(),
          chc: 0,
          distance: Sim.target.distance,
        });
        Sim.addBuff("jadeharvester_6pc", {dmgred: 50}, {duration: 12 * 60});
      }
    },
    proctable: {e: 0.25},
    elem: "phy",
  };

  skills.sacrifice = {
    offensive: true,
    frames: 57.499966,
    precast: function(rune, dry) {
      if (!Sim.getBuff("zombiedogs")) return false;
    },
    oncast: function(rune) {
      var stacks = Sim.getBuff("zombiedogs");
      if (!stacks) return;
      var count = (rune === "b" ? stacks : 1);
      Sim.removeBuff("zombiedogs", count);
      var dmg = {delay: 12, type: "area", range: 12, coeff: 10.9, count: count};
      switch (rune) {
      case "c": dmg.onhit = Sim.apply_effect("stunned", 180); break;
      case "e":
        for (var i = Sim.random("nextofkin", 0.35, count, true); i > 0; --i) {
          Sim.cast("summonzombiedogs");
        }
        break;
      case "d": Sim.addResource(280 * count); break;
      case "b": dmg.coeff = 13; break;
      case "a": Sim.addBuff("provokethepack", {damage: 20}, {duration: 300, /*refresh: false, */maxstacks: 5, stacks: count}); break;
      }
      if (Sim.stats.leg_thetallmansfinger) {
        dmg.coeff *= 3;
      }
      Sim.damage(dmg);
    },
    proctable: 0.1667,
    elem: "phy",
  };

  skills.massconfusion = {
    frames: 57.142853,
    cooldown: function(rune) {
      return (rune === "d" ? 30 : 60) * (Sim.stats.passives.tribalrites ? 0.75 : 1);
    },
    oncast: function(rune) {
      var targets = Sim.getTargets(30);
      if (rune === "a") {
        Sim.addBuff("paranoia", undefined, {duration: 720, targets: targets});
      }
      if (rune === "c") {
        Sim.addBuff(undefined, undefined, {
          duration: 720,
          tickrate: 15,
          ontick: {type: "area", range: 8, coeff: 1},
        });
      }
      Sim.addBuff("massconfusion", undefined, {duration: 720, status: "charmed", targets: targets});
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (Sim.getBuff("massconfusion", data.target)) {
            Sim.cast("summonzombiedogs");            
          }
        });
      }
    },
    proctable: {c: 0.13},
    elem: "phy",
  };

  function zc_reanimate(data) {
    if (!data.reanimate) return;
    var dmg = {type: "line", speed: 0.4, radius: 6, pierce: true, coeff: 4.8, range: 22, user: {reanimate: false, iter: data.iter + 1}};
    if (data.iter === 0) {
      dmg.origin = Math.abs(Sim.target.distance - 22);
      Sim.after(55, zc_reanimate, dmg.user);
    }
    Sim.damage(dmg);
  }
  skills.zombiecharger = {
    offensive: true,
    frames: 54.999996,
    cost: function(rune) {
      return 150 * (1 - 0.01 * (Sim.stats.leg_scrimshaw || 0));
    },
    oncast: function(rune) {
      switch (rune) {
      case "x": return {type: "line", speed: 0.3, radius: 6, pierce: true, coeff: 5.6, range: 22};
      case "c": return {delay: 60, type: "area", range: 7, coeff: 8.8};
      case "d":
        var dmg = {type: "line", speed: 0.3, radius: 6, pierce: true, coeff: 5.6, range: 22, user: {reanimate: false, iter: 0}};
        Sim.after(74, zc_reanimate, dmg.user);
        return dmg;
        //TODO: reanimate on kills
      case "b":
        for (var i = 0; i < 7; ++i) {
          Sim.damage({type: "line", speed: 0.3, radius: 6, pierce: true, coeff: 2.8, range: 22, angle: (i - 3) * 360 / 7, onhit: Sim.apply_effect("slowed", 120)});
        }
        break;
      case "e": return {type: "line", speed: 1.2, radius: 6, area: 12, coeff: 6.8, range: 57};
      case "a": return {type: "line", speed: 0.5, radius: 6, pierce: true, coeff: 5.2, count: 3, range: 44, origin: Sim.target.distance + 20};
      }
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("onkill", function(data) {
          if (data.hit && data.hit.skill === "zombiecharger" && data.hit.origdata && data.hit.origdata.user) {
            data.hit.origdata.user.reanimate = true;
          }
        });
      }
    },
    proctable: {x: 0.5, c: 0.5, d: 0.5, b: 0.333, e: 0.5, a: 0.111},
    elem: {x: "psn", c: "phy", d: "psn", b: "col", e: "fir", a: "psn"},
  };

  function sb_onhit(data) {
    if (Sim.stats.leg_thebarber) {
      Sim.addBuff("thebarber", undefined, {
        maxstacks: 1000,
        duration: 120,
        targets: data.targets,
          onrefresh: function(data, newdata) {
          data.coeff += newdata.coeff;
        },
        onexpire: function(data) {
          Sim.damage({type: "area", range: 15, coeff: data.coeff * 0.01 * Sim.stats.leg_thebarber});
        },
        data: {coeff: data.count * (data.origdata.  thebarber || 0)},
      });
    }
    if (data.castInfo.rune === "d" || Sim.stats.leg_voosjuicer) {
      Sim.addResource(12 * data.targets);
    }
  }
  function sb_hit(data) {
    if (!data) return;
    if (Sim.stats.leg_thebarber) {
      data.thebarber = (data.coeff || 1);
      data.coeff = 0;
    }
    Sim.damage(data);
  }
  skills.spiritbarrage = {
    offensive: true,
    frames: 57.142834,
    speed: function(rune, aps) {
      return aps * 1.2;
    },
    cost: 100,
    oncast: function(rune) {
      switch (rune) {
      case "x": return sb_hit({delay: 30, count: 4, coeff: 1.5, onhit: sb_onhit});
      case "d": return sb_hit({delay: 30, count: 4, coeff: 1.5, onhit: sb_onhit});
      case "b":
        var targets = Math.min(3, Sim.target.count);
        Sim.damage({delay: 30, targets: targets, count: 3 / targets, coeff: 0.65});
        return sb_hit({delay: 30, count: 4, coeff: 1.5, onhit: sb_onhit});
      case "a": return sb_hit({delay: 30, count: 4, coeff: 1.5, onhit: sb_onhit});
      case "e":
        Sim.addBuff("manitou", undefined, {
          duration: 1201,
          tickrate: 30,
          ontick: function() {sb_hit({coeff: 1.5});},
        });
        break;
      }
      if (rune === "c" || Sim.stats.leg_gazingdemise) {
        var buffs = undefined;
        if (Sim.stats.leg_gazingdemise) {
          buffs = {dmgmul: {skills: ["spiritbarrage"], percent: Sim.stats.leg_gazingdemise}};
        }
        Sim.addBuff("phantasm", buffs, {
          maxstacks: 3,
          duration: 300,
          tickrate: 30,
          tickinitial: 1,
          ontick: function() {sb_hit({type: "area", range: 10, coeff: 1.5 / 2});},
        });
      }
    },
    proctable: {x: 0.25, d: 0.25, b: 0.1667, c: 0.125, a: 0.25, e: 0.03},
    elem: {x: "col", d: "col", b: "fir", c: "col", a: "col", e: "col"},
  };

  skills.acidcloud = {
    offensive: true,
    frames: 55.384609,
    cost: 175,
    oncast: function(rune) {
      var dmg = {delay: 15, type: "area", range: 12, coeff: 3};
      var params = {
        duration: 181,
        tickrate: 15,
        ontick: {type: "area", range: 6, coeff: 0.3},
      };
      var name = "acidcloud";
      switch (rune) {
      case "b":
        dmg.delay = 36;
        dmg.range = 24;
        break;
      case "c":
        name = "acidcloud_blob";
        params.duration = 301;
        params.ontick.pet = true;
        params.maxstacks = 3;
        params.ontick.range = 9;
        break;
      case "d":
        params.duration = 360;
        break;
      case "e":
        dmg.type = "cone";
        dmg.range = 30;
        dmg.width = 55;
        dmg.coeff *= 1.111;
        params.ontick.coeff *= 1.111;
        break;
      case "a":
        return {delay: 30, type: "area", range: 12, coeff: 7};
      }
      if (rune !== "c" && Sim.stats.leg_suwongdiviner) {
        Sim.addBuff("acidcloud_blob", undefined, {duration: 301, tickrate: 15, ontick: {type: "area", range: 6, coeff: 0.3, pet: true}, maxstacks: 3});
      }
      Sim.damage(dmg);
      Sim.addBuff(name, undefined, params);
    },
    proctable: {x: 0.2, b: 0.2, c: 0.2, d: 0.2, e: 0.1667, a: 0.333},
    elem: {x: "psn", b: "psn", c: "psn", d: "col", e: "psn", a: "fir"},
  };

  skills.wallofdeath = {
    offensive: true,
    frames: 56.249996,
    cooldown: 8,
    grace: function(rune) {
      if (Sim.stats.leg_jeramsbracers) {
        return [120, 2];
      }
    },
    oncast: function(rune) {
      var params = {
        duration: 360,
        tickrate: 12,
        tickinitial: 1,
        ontick: {type: "line", origin: 14, range: 28, radius: 5, pierce: true, coeff: 0.4},
      };
      switch (rune) {
      case "b":
        params.duration = 480;
        params.ontick = {type: "area", range: 15, coeff: 0.3};
        break;
      case "d":
        params.origin = 25;
        params.range = 50;
        if (!Sim.target.boss) Sim.addBuff("knockback", undefined, 30);
        break;
      case "a":
        params.duration = 300;
        params.ontick = {type: "area", range: 15, coeff: 0.5};
        break;
      case "e":
        params.duration = 240;
        params.ontick = {type: "line", origin: 20, range: 40, radius: 5, pierce: true, coeff: 0.55};
        break;
      case "c":
        params.ontick = {type: "area", range: 15, coeff: 0.4, onhit: Sim.apply_effect("slowed", 180)};
        break;
      }
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.08, b: 0.07, d: 0.06, a: 0.05, e: 0.03, c: 0.033},
    elem: {x: "phy", b: "psn", d: "phy", a: "phy", e: "fir", c: "col"},
  };

  function piranhas_onhit(data) {
    if (data.castInfo.rune === "c") {
      Sim.addBuff("knockback", undefined, {duration: 30, targets: data.targets, firsttarget: data.firsttarget});
    }
    var duration = 60;
    if (data.castInfo.rune === "d") duration = 480;
    if (Sim.stats.passives.creepingdeath) duration = 14400 * 60;
    Sim.addBuff("piranhas", {dmgtaken: 15}, {duration: duration,
      targets: data.targets, firsttarget: data.firsttarget});
    if (data.castInfo.rune === "e") {
      Sim.addBuff("chilled", undefined, {duration: 25,
        targets: data.targets, firsttarget: data.firsttarget});
    }
  }
  skills.piranhas = {
    offensive: true,
    frames: 58.536537,
    cost: 250,
    cooldown: {x: 8, a: 8, b: 8, c: 16, d: 8, e: 8},
    oncast: function(rune) {
      var params = {
        duration: 480,
        tickrate: 24,
        tickinitial: 1,
        ontick: {type: "area", range: 13, coeff: 0.2, onhit: piranhas_onhit},
      };
      switch (rune) {
      case "a": Sim.damage({delay: 30, coeff: 11}); break;
      case "b":
        params.ontick = function(data) {
          var targets = Math.ceil(Sim.getTargets(13));
          if (targets < Sim.target.count) {
            Sim.damage({coeff: 0.2, count: Math.min(2, Sim.target.count - targets)});
          }
          Sim.damage({type: "area", range: 13, coeff: 0.2, onhit: piranhas_onhit});
        };
        break;
      case "c":
        params.duration = 240;
        params.ontick.coeff *= 2;
        break;
      case "d":
        return {type: "line", pierce: true, range: 20, speed: 0.5, radius: 36, coeff: 4.75, onhit: piranhas_onhit};
      }
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.03, a: 0.03, b: 0.025, c: 0.05, d: 0.04, e: 0.028},
    elem: {x: "psn", a: "phy", b: "psn", c: "psn", d: "psn", e: "col"},
  };

  var nextEnrage = 0;
  function garg_ontick(data) {
    switch (data.stack.castInfo.rune) {
    case "a":
      if (Sim.time >= nextEnrage) {
        Sim.addBuff("restlessgiant", {dmgmul: {skills: ["gargantuan"], percent: 200}}, {duration: 900});
        nextEnrage = Sim.time + 45 * 60;
      }
      data.ias = (Sim.getBuff("restlessgiant" ? 35 : 0));
      break;
    case "b": Sim.damage({pet: true, distance: 5, type: "area", range: 15, coeff: Sim.stats.info.aps * data.coeff, onhit: data.onhit}); break;
    case "d": Sim.damage({pet: true, distance: 5, type: "area", range: 5, coeff: Sim.stats.info.aps * data.coeff, onhit: data.onhit}); break;
    case "e":
      if (Sim.time >= (data.slamNext || 0)) {
        Sim.damage({pet: true, distance: 5, type: "area", range: 5, coeff: 2 * Sim.stats.info.aps * data.coeff, onhit: Sim.apply_effect("stunned", 180)});
        data.slamNext = Sim.time + 600;
        return 114;
      }
    }
    Sim.damage({pet: true, distance: 5, coeff: Sim.stats.info.aps * data.coeff, onhit: data.onhit});
  }
  skills.gargantuan = {
    offensive: true,
    pet: true,
    frames: 56.249996,
    cooldown: function(rune) {
      return 60 * (Sim.stats.passives.tribalrites ? 0.75 : 1);
    },
    oncast: function(rune) {
      var params = {
        tickrate: 84,
        refresh: false,
        data: {coeff: 4.5},
        ontick: garg_ontick,
      };
      switch (rune) {
      case "b": params.data.coeff = 5.85; break;
      case "d": params.data.coeff = 5.75; params.duration = 900; break;
      }
      if (Sim.stats.leg_theshortmansfinger || Sim.stats.leg_theshortmansfinger_p6) {
        params.stacks = 3;
      }
      Sim.petattack("gargantuan", undefined, params);
    },
    oninit: function(rune) {
      if (rune === "c") {
        Sim.after(60, function poison() {
          var stacks = Sim.getBuff("gargantuan");
          if (stacks) {
            Sim.damage({type: "area", range: 12, origin: 5, coeff: 1.35 * Sim.stats.info.aps, pet: true, count: stacks});
          }
          Sim.after(60, poison);
        });
      }
    },
    elem: {x: "phy", b: "col", a: "phy", d: "fir", c: "psn", e: "fir"},
  };

  skills.bigbadvoodoo = {
    frames: 57.499962,
    cooldown: function(rune) {
      return 120 * (Sim.stats.passives.tribalrites ? 0.75 : 1);
    },
    oncast: function(rune) {
      var buffs = {ias: 15, extrams: 15};
      var params = {duration: 1200};
      switch (rune) {
      case "b": params.duration = 1800; break;
      case "c": buffs.dmgred = 20; break;
      case "d": buffs.manaregen = 250; break;
      case "a": buffs.damage = 15; break;
      }
      Sim.addBuff("bigbadvoodoo", buffs, params);
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onkill", function(data) {
          if (Sim.random("boogieman", 0.5)) {
            Sim.cast("summonzombiedogs");
          }
        });
      }
    },
    elem: "phy",
  };

  function fetish_dagger_ontick(data) {
    Sim.damage({pet: true, distance: 5, coeff: 1.8 * Sim.stats.info.aps, skill: "fetisharmy"});
  }
  function fetish_shaman_ontick(data) {
    Sim.damage({pet: true, type: "cone", width: 45, range: 20, origin: 10, coeff: 0.85 * Sim.stats.info.aps});
  }
  function fetish_hunter_ontick(data) {
    Sim.damage({pet: true, type: "line", speed: 1.5, coeff: 1.3 * Sim.stats.info.aps});
  }
  skills.fetisharmy = {
    offensive: true,
    pet: true,
    frames: 60,
    cooldown: function(rune) {
      return (rune === "d" ? 90 : 120) * (Sim.stats.passives.tribalrites ? 0.75 : 1) * (Sim.stats.set_zunimassa_2pc ? 0.2 : 1);
    },
    oncast: function(rune) {
      var daggers = 5;
      var duration = (Sim.stats.set_zunimassa_2pc ? undefined : 1200);
      switch (rune) {
      case "a": Sim.damage({pet: true, type: "area", range: 5, self: true, coeff: 6.8, count: daggers}); break;
      case "b": daggers += 3; break;
      case "c":
        Sim.petattack("fetisharmy_shaman", undefined, {
          duration: duration,
          tickrate: 40,
          refresh: false,
          stacks: 2,
          ontick: fetish_shaman_ontick,
        });
        break;
      case "e":
        Sim.petattack("fetisharmy_hunter", undefined, {
          duration: duration,
          tickrate: 48,
          refresh: false,
          stacks: 2,
          ontick: fetish_hunter_ontick,
        });
        break;
      }
      Sim.petattack("fetisharmy_dagger", undefined, {
        duration: duration,
        tickrate: 48,
        refresh: false,
        stacks: daggers,
        ontick: fetish_dagger_ontick,
      });
    },
    oninit: function(rune) {
      Sim.metaBuff("fetisharmy", ["fetisharmy_dagger", "fetisharmy_shaman", "fetisharmy_hunter"]);
    },
    elem: {x: "phy", a: "col", d: "phy", b: "phy", c: "fir", e: "psn"},
  };

  Sim.summon_sycophant = function() {
    Sim.pushCastInfo({skill: "fetishsycophants", elem: Sim.stats.info.maxelem, pet: true, castId: Sim.getCastId()});
    Sim.petattack("fetishsycophants", undefined, {
      duration: 3600,
      tickrate: 48,
      refresh: false,
      maxstacks: 15,
      ontick: fetish_dagger_ontick,
    });
    Sim.popCastInfo();
  };

  Sim.passives = {
    junglefortitude: {dmgred: 15},
    circleoflife: function() {
      var buff = Sim.addBuff(undefined, undefined, {targets: Sim.getTargets(20 + Sim.stats.pickup, Sim.target.distance), aura: true});
      Sim.register("onkill", function(data) {
        if (Sim.getBuff(buff, data.target) && Sim.random("circleoflife", 0.15)) {
          Sim.cast("summonzombiedogs");
        }
      });
    },
    spiritualattunement: {maxmana_percent: 10, manaregen_percent: 2},
    gruesomefeast: function() {
      Sim.register("onglobe", function() {
        Sim.addResource(0.1 * (Sim.stats.maxmana || 0));
        Sim.addBuff("gruesomefeast", {int_percent: 10}, {duration: 900, refresh: false, maxstacks: 5});
      });
    },
    bloodritual: {rcr_mana: 20, regen_percent: 1},
    badmedicine: function() {
    },
    zombiehandler: {life: 20},
    piercetheveil: {damage: 20, rcr_mana: -30},
    spiritvessel: function() {
    },
    fetishsycophants: function() {
      Sim.register("onhit_proc", function(data) {
        for (var i = Sim.random("fetishsycophants", 0.15 * data.proc, data.targets * data.count, true); i > 0; --i) {
          Sim.summon_sycophant();
        }
      });
    },
    rushofessence: function() {
      var list = ["haunt", "horrify", "massconfusion", "soulharvest", "spiritbarrage", "spiritwalk"];
      Sim.register("oncast", function(data) {
        if (list.indexOf(data.skill) >= 0) {
          Sim.addBuff(undefined, {manaregen: 10}, {duration: 600});
        }
      });
    },
    visionquest: function() {
      Sim.register("onhit", function(data) {
        if (data.skill && skills[data.skill] && skills[data.skill].signature) {
          Sim.addBuff("visionquest", {resourcegen: 40}, {duration: 300});
        }
      });
    },
    fierceloyalty: function() {
    },
    graveinjustice: function() {
      var buff = Sim.addBuff(undefined, undefined, {targets: Sim.getTargets(20 + Sim.stats.pickup, Sim.target.distance), aura: true});
      Sim.register("onkill", function(data) {
        if (Sim.getBuff(buff, data.target)) {
          for (var id in Sim.stats.skills) {
            Sim.reduceCooldown(id, 60);
          }
        }
      });
    },
    tribalrites: function() {
    },
    creepingdeath: function() {
    },
    swamplandattunement: function() {
    },
    midnightfeast: {dmgmul: {skills: ["summonzombiedogs", "gargantuan"], percent: 50}},
    confidenceritual: function() {
      Sim.addBuff("confidenceritual", {dmgmul: 25}, {targets: Sim.getTargets(20, Sim.target.distance), aura: true});
    },
  };

})();
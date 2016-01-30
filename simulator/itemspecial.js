(function() {
  var Sim = Simulator;
  var affixes = Sim.affixes;
  var gems = Sim.gems;

  Sim.register("init", function() {
    var fx = {
      hitfear: {status: "feared", duration: 180},
      hitstun: {status: "stunned", duration: 180},
      hitblind: {status: "blinded", duration: 180},
      hitfreeze: {status: "frozen", duration: 180},
      hitchill: {status: "chilled", duration: 180},
      hitslow: {status: "slowed", duration: 180},
      hitimmobilize: {status: "rooted", duration: 180},
      hitknockback: {status: "knockback", duration: 30},
    };
    for (var id in fx) {
      if (this.stats[id]) {
        Sim.pushCastInfo({triggered: id});
        this.register("onhit_proc", (function(id, fx) {
          return function(data) {
            if (Sim.random(id, 0.01 * Sim.stats[id] * data.proc, data.targets / Sim.target.count)) {
              Sim.addBuff(fx.status, undefined, fx.duration);
            }
          };
        })(id, fx[id]));
        Sim.popCastInfo();
      }
    }
    if (this.stats.bleed) {
      Sim.pushCastInfo({triggered: "bleed"});
      this.register("onhit_proc", function(data) {
        if (Sim.random("bleed", 0.01 * Sim.stats.bleed.chance * data.proc, data.targets / Sim.target.count)) {
          Sim.addBuff("bleed", undefined, {duration: 300, tickrate: 15, data: {amount: Sim.stats.bleed.amount}, ontick: function(data) {
            Sim.damage({elem: "phy", targets: Sim.target.count, coeff: data.amount * 0.01 / 20, orphan: true});
          }});
        }
      });
      Sim.popCastInfo();
    }
  });

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
    Sim.register("updatestats", function(data) {
      if (data.stats.chilled || data.stats.frozen ||
          data.stats.blinded || data.stats.stunned ||
          data.stats.slowed || data.stats.knockback ||
          data.stats.charmed || data.stats.feared || data.stats.rooted) {
        data.stats.add("dmgmul", 15 + 0.3 * level);
      }
    });
  };
  gems.enforcer = function(level) {
    Sim.addBaseStats({petdamage: 15 + 0.3 * level});
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
      var stacks = Sim.random("gogok", data.proc * (0.5 + 0.01 * level), data.targets, true);
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
  gems.pain = function(level) {
    var coeff = (12 + 0.3 * level) / 12;
    var buffs = undefined;
    if (level >= 25 && Sim.target.distance - Sim.target.size < 20) {
      buffs = {ias: 3};
    }
    function ontick(data) {
      Sim.damage({elem: "phy", coeff: coeff});
    }
    Sim.register("onhit", function(data) {
      var stacks = Sim.random("pain", data.chc, data.targets, true);
      Sim.addBuff("pain", buffs, {
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
      if (Sim.random("wreath", data.proc * 0.15, data.targets)) {
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
      Sim.register("updatestats", function(data) {
        if (data.stats.chilled) {
          data.stats.add("chctaken", 10);
        }
      });
    }
  };
  gems.stricken = function(level) {
    var next = 0;
    var counter = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next) {
        if (--counter < 0) {
          Sim.addBuff("stricken", {dmgmul: 0.8 + level * 0.01}, {
            maxstacks: 360,
          });
          counter = Sim.target.count - 1;
        }
        var aps = (data.castInfo && data.castInfo.speed || 1);
        next = Sim.time + Math.floor(54 / aps);
      }
    });
    if (level >= 25) {
      Sim.addBaseStats({bossdmg: 25});
    }
  };
  gems.boyarsky = function(level) {
    Sim.addBaseStats({thorns: 16000 + 800 * level});
  };

  affixes.leg_wandofwoh = function() {
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

  affixes.leg_thefurnace = function(amount) {
    Sim.addBaseStats({edmg: amount});
  };
  affixes.leg_triumvirate = affixes.leg_triumvirate_p2 = function(amount) {
    Sim.register("oncast", function(data) {
      if (Sim.skills[data.skill] && Sim.skills[data.skill].signature) {
        Sim.addBuff("triumvirate", {dmgmul: {skills: ["arcaneorb"], percent: amount}}, {maxstacks: 3, duration: 360});
      }
    });
  };
  affixes.leg_stormcrow = function(amount) {
    var prev;
    Sim.register("onhit_proc", function(data) {
      if ((prev === undefined || Sim.time - prev > 240) && Sim.random("stormcrow", 0.01 * amount, data.targets)) {
        Sim.damage({type: "line", elem: "fir", coeff: 1.15, speed: 0.75, area: 10});
        prev = Sim.time;
      }
    });
  };

  affixes.leg_shimizushaori = function(amount) {
    if (Sim.params.leg_shimizushaori && Sim.params.leg_shimizushaori[0]) {
      Sim.addBaseStats({extrachc: 100});
    }
  };
  affixes.leg_ingeom = function(amount) {
    if (Sim.params.leg_ingeom && Sim.params.leg_ingeom[0]) {
      Sim.addBaseStats({cdrint: amount});
    }
  };
  affixes.leg_eunjangdo = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (Sim.targetHealth < 0.01 * amount) {
        Sim.addBuff("frozen", undefined, 180);
      }
    });
  };
  affixes.leg_frostburn = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.elem === "col" && Sim.random("frostburn", 0.01 * amount * data.proc, data.targets / Sim.target.count)) {
        Sim.addBuff("frozen", undefined, 36);
      }
    });
  };
  affixes.leg_conventionofelements = function(amount) {
    var rot = {
      wizard: ["arc", "col", "fir", "lit"],
      demonhunter: ["col", "fir", "lit", "phy"],
      witchdoctor: ["col", "fir", "phy", "psn"],
      monk: ["col", "fir", "hol", "lit", "phy"],
      barbarian: ["col", "fir", "lit", "phy"],
      crusader: ["fir", "hol", "lit", "phy"],
    }[Sim.stats.charClass];
    var current = 0;
    (function refresh() {
      var elem = rot[current++];
      if (current >= rot.length) current = 0;
      Sim.addBuff("coe_" + elem, {dmgmul: {elems: [elem], percent: amount}}, {duration: 240, onexpire: refresh});
    })();
  };
  affixes.leg_obsidianringofthezodiac = function() {
    var rot = [];
    for (var id in Sim.stats.skills) rot.push(id);
    var current = 0;
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.cost && !data.castInfo.pet &&
          data.castInfo.user && !data.castInfo.user.zodiac) {
        data.castInfo.user.zodiac = true;
        for (var iter = 0; iter < 6; ++iter) {
          var cur = rot[current];
          current = (current + 1) % rot.length;
          if (Sim.getCooldown(cur) >= 60) {
            Sim.reduceCooldown(cur, 60);
            break;
          }
        }
      }
    });
  };
  affixes.leg_wyrdward = affixes.leg_wyrdward_p2 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.elem === "lit" && Sim.random("wyrdward", 0.01 * amount * data.proc, data.targets / Sim.target.count)) {
        Sim.addBuff("stunned", undefined, 90);
      }
    });
  };
  affixes.leg_overwhelmingdesire = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (Sim.random("overwhelmingdesire", 0.05 * data.proc, data.targets / Sim.target.count)) {
        Sim.addBuff("overwhelmingdesire", {dmgtaken: 35}, {duration: 180, status: "charmed"});
      }
    });
  };
  affixes.leg_pridesfall = function(amount) {
    Sim.addBaseStats({rcr: 30});
  };
  affixes.leg_hexingpantsofmryan = function(amount) {
    if (Sim.params.leg_hexingpantsofmryan && Sim.params.leg_hexingpantsofmryan[0]) {
      Sim.addBaseStats({damage: 25, resourcegen: 25});
    } else {
      Sim.addBaseStats({damage: -amount, resourcegen: -amount});
    }
  };
  affixes.leg_bloodbrother = function(amount) {
    Sim.addBaseStats({block: amount});
  };
  affixes.leg_andarielsvisage = affixes.leg_andarielsvisage_p2 = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (next <= data.time) {
        Sim.damage({type: "area", range: 10, self: true, elem: "psn", coeff: 0.01 * amount});
        next = data.time + Math.floor(54 / Sim.stats.info.aps);
      }
    });
  };
  affixes.leg_bandofhollowwhispers = function(amount) {
    Sim.addBuff("bandofhollowwhispers", undefined, {
      tickrate: 90,
      ontick: function(data) {
        Sim.damage({elem: "arc", coeff: 1.5 * Sim.stats.info.aps});
      },
    });
  };
  affixes.leg_bulkathossweddingband = function(amount) {
    Sim.addBuff(undefined, undefined, {
      tickrate: 12,
      ontick: function(data) {
        Sim.damage({type: "area", range: 8, self: true, elem: "phy", coeff: 4});
      },
    });
  };
  affixes.leg_hellfirering = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (next <= Sim.time && Sim.random("hellfirering", 0.5 * data.proc, data.targets)) {
        Sim.addBuff("hellfirering", undefined, {
          duration: 360,
          tickrate: 30,
          ontick: function(data) {
            Sim.damage({type: "area", range: 16, elem: "fir", coeff: 1});
          },
        });
        next = Sim.time + 2700;
      }
    });
  };
  affixes.leg_nagelring = function(amount) {
    Sim.addBuff(undefined, undefined, {
      tickrate: amount * 60,
      ontick: function(data) {
        Sim.damage({type: "area", range: 10, type: "phy", coeff: 100});
      },
    });
  };
  affixes.leg_firewalkers = affixes.leg_firewalkers_p2 = function(amount) {
    amount = Math.max(amount, 100);
    Sim.addBuff(undefined, undefined, {
      tickrate: 18,
      ontick: function(data) {
        Sim.damage({type: "area", range: 5, type: "fir", coeff: amount * 0.003});
      },
    });
  };
  affixes.leg_poxfaulds = affixes.leg_poxfaulds_p2 = function(amount) {
    var delay = (this == "leg_poxfaulds" ? 900 : 300);
    var duration = (this == "leg_poxfaulds" ? 600 : 300);
    (function trigger() {
      if (Sim.getTargets(12, Sim.target.distance) >= 3) {
        Sim.addBuff("poxfaulds", undefined, {
          duration: duration,
          tickdelay: 30,
          ontick: function() {
            Sim.damage({type: "area", range: 15, elem: "psn", coeff: amount * 0.005});
          },
        });
      }
      Sim.after(delay, trigger);
    })();
  };
  affixes.leg_moonlightward = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (Sim.random("moonlightward", data.proc, data.targets)) {
        Sim.addBuff("moonlightward", undefined, {
          duration: 7200,
          maxstacks: 4,
          tickrate: 30,
          ontick: function() {
            if (Sim.getTargets(15, Sim.target.distance) >= 0.5) {
              Sim.damage({type: "area", range: 15, self: true, elem: "arc", coeff: amount * 0.01});
              Sim.removeBuff("moonlightward", 1);
            }
          },
        });
      }
    });
  };
  affixes.leg_scourge = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (Sim.time >= next && data.offensive && Sim.random("scourge", amount * 0.01)) {
        Sim.damage({type: "area", range: 13, self: true, elem: "fir", coeff: 19});
        next = Sim.time + 150;
      }
    });
  };
  affixes.leg_stalgardsdecimator = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (Sim.time >= next && data.melee) {
        Sim.damage({type: "line", pierce: true, speed: 1, elem: "phy", coeff: amount * 0.01});
        next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
      }
    });
  };
  affixes.leg_schaefershammer_p2 = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.elem === "lit") {
        Sim.addBuff("schaefershammer", undefined, {
          duration: 300,
          tickrate: 60,
          ontick: function(data) {
            Sim.damage({type: "area", range: 20, self: true, elem: "lit", coeff: amount * 0.01});
          },
        });
      }
    });
  };
  affixes.leg_cinderswitch = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (Sim.time >= next && Sim.random("cinderswitch", amount * 0.01)) {
        Sim.damage({type: "line", area: 6, speed: 1, elem: "fir", coeff: 2.5});
        next = Sim.time + 60;
      }
    });
  };
  affixes.leg_skysplitter = affixes.leg_skysplitter_p2 = function(amount) {
    var next = 0;
    var coeff = (this == "leg_skysplitter" ? 1.65 : 6.75);
    var cooldown = (this == "leg_skysplitter" ? 210 : 12);
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("skysplitter", amount * 0.01 * data.proc, data.targets)) {
        Sim.damage({elem: "lit", coeff: coeff});
        Sim.addBuff("stunned", undefined, 30);
        next = Sim.time + cooldown;
      }
    });
  };
  affixes.leg_hack = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.user && !data.castInfo.user.hack) {
        data.castInfo.user.hack = true;
        var targets = data.targets;
        if (Sim.stats.set_invoker_2pc) {
          targets = Math.max(targets, Sim.getTargets(15, Sim.target.distance));
        }
        var coeff = amount * 0.01;
        if (Sim.stats.leg_votoyiasspiker && Sim.getBuff("provoke")) {
          coeff *= 2;
        }
        Sim.damage({thorns: "normal", coeff: coeff, count: targets});
      }
    });
  };
  affixes.leg_wizardspike = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (data.offensive && Sim.time >= next && Sim.random("wizardspike", amount * 0.01)) {
        Sim.damage({skill: "arcaneorb", elem: "col", type: "area",
          origin: Sim.target.distance - 30, coeff: 3.93, range: 15, delay: 30 / 0.6});
        Sim.damage({skill: "arcaneorb", elem: "col", type: "line",
          coeff: 2.62, pierce: true, range: 30, speed: 0.6, radius: 15});
        Sim.damage({skill: "arcaneorb", elem: "col", type: "line",
          coeff: 1.28, pierce: true, range: 30, radius: 15, delay: 30 / 0.6 + 0.6, proc: 0.013});
        next = Sim.time + 120;
      }
    });
  };
  affixes.leg_odynson = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("odynson", amount * 0.01 * data.proc, data.targets)) {
        Sim.damage({elem: "lit", coeff: 1.1, count: 3});
        next = Sim.time + 60;
      }
    });
  };
  affixes.leg_fulminator = affixes.leg_fulminator_p3 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      var targets = Sim.random("fulminator", data.proc, data.targets, true);
      if (targets) {
        Sim.addBuff("fulminator", undefined, {
          duration: 360,
          tickrate: 30,
          data: {targets: Math.min(targets, Sim.target.count)},
          onrefresh: function(data, newdata) {
            data.targets = Math.max(data.targets, newdata.targets);
          },
          ontick: function(data) {
            Sim.damage({type: "area", range: 10, cmod: -1, count: data.targets,
              elem: "lit", coeff: amount * 0.005});
          },
        });
      }
    });
  };
  affixes.leg_rimeheart = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.stats.frozen && Sim.random("rimeheart", 0.1 * data.proc, data.targets)) {
        Sim.damage({elem: "col", coeff: 100});
        next = Sim.time + 6;
      }
    });
  };
  affixes.leg_thunderfury = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("thunderfury", 0.6 * data.proc, data.targets)) {
        Sim.damage({elem: "lit", coeff: amount * 0.01, targets: 6});
        Sim.addBuff("slowed", undefined, 180);
        next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
      }
    });
  };
  affixes.leg_azurewrath = affixes.leg_azurewrath_p3 = function(amount) {
    Sim.addBuff(undefined, undefined, {
      tickrate: 30,
      ontick: function(data) {
        if (Sim.target.type === "undead" || (Sim.stats.leg_azurewrath_p3 && Sim.target.type === "demon")) {
          Sim.damage({type: "area", range: 25, self: true, elem: "hol", coeff: amount * 0.005});
        }
      },
    });
  };
  affixes.leg_shardofhate = function(amount) {
    var next = 0;
    var elems = {col: true, psn: true, lit: true};
    function trigger(data) {
      if (data.event === "oncast") {
        if (!data.offensive) return;
      }
      if (Sim.time >= next && elems[data.elem]) {
        switch (data.elem) {
        case "col":
          Sim.damage({type: "line", pierce: true, speed: 1.2, elem: "col", coeff: amount * 0.01});
          break;
        case "lit":
          Sim.damage({type: "line", pierce: true, speed: 0.65, fan: 10, count: 3, elem: "lit", coeff: amount * 0.01});
          break;
        case "psn":
          Sim.damage({type: "area", range: 12, self: true, elem: "psn", coeff: amount * 0.01});
          break;
        }
        next = Sim.time + Math.floor(24 / Sim.stats.info.aps);
      }
    }
    Sim.register("oncast", trigger);
    Sim.register("onhit_proc", trigger);
  };
  affixes.leg_taskerandtheo = function(amount) {
    Sim.addBaseStats({petias: amount});
  };

  affixes.leg_calamity = function(amount) {
    Sim.register("onhit", function(data) {
      if (!data.pet) {
        Sim.addBuff("calamity", {dmgtaken: 20}, {duration: 1800});
      }
    });
  };
  affixes.leg_helltrapper = function(amount) {
    var skills = ["spiketrap", "caltrops", "sentry"];
    var type = 0;
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("helltrapper", 0.01 * amount * data.proc, data.targets)) {
        Sim.cast(skills[type]);
        type = (type + 1) % skills.length;
        next = Sim.time + 6;
      }
    });
  };
  affixes.leg_solanium = function(amount) {
    Sim.register("onhit_proc", function(data) {
      for (var i = Sim.random("solanium", 0.01 * amount * data.proc * data.chc, data.targets, true); i > 0; --i) {
        Sim.trigger("onglobe");
      }
    });
  };
  affixes.leg_razorstrop = function(amount) {
    Sim.register("onglobe", function(data) {
      Sim.damage({type: "area", range: 20, self: true, elem: "fir", coeff: 0.01 * amount});
    });
  };
  affixes.leg_reaperswraps = function(amount) {
    Sim.register("onglobe", function(data) {
      var maxres = Sim.stats["max" + Sim.rcTypes[0]];
      if (maxres) {
        Sim.addResource(0.01 * amount * maxres);
      }
    });
  };
  affixes.leg_cluckeye = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (data.offensive && Sim.time >= next && Sim.random("cluckeye", 0.01 * amount)) {
        Sim.damage({type: "line", speed: 0.5, elem: "phy", coeff: 5, onhit: Sim.apply_effect("blinded", 120)});
        next = Sim.time + 18;
      }
    });
  };
  affixes.leg_demonmachine = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (data.offensive && Sim.time >= next && Sim.random("demonmachine", 0.01 * amount)) {
        Sim.damage({type: "line", speed: 1, elem: "fir", coeff: 1.15});
        next = Sim.time + 18;
      }
    });
  };
  affixes.leg_pusspitter = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (data.offensive && Sim.time >= next && Sim.random("pusspitter", 0.01 * amount)) {
        Sim.addBuff("pusspitter", undefined, {
          duration: 300,
          tickrate: 30,
          tickinitial: 1,
          ontick: {type: "area", range: 6, elem: "psn", coeff: 0.5},
        });
        next = Sim.time + 18;
      }
    });
  };
  affixes.leg_hellrack = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("hellrack", data.proc, data.targets / Sim.target.count)) {
        Sim.addBuff("rooted", undefined, 120);
        next = Sim.time + 6;
      }
    });
  };

  affixes.leg_strongarmbracers = function(amount) {
    var prevKnockback = false;
    Sim.register("updatestats", function(data) {
      if (data.stats.knockback || prevKnockback) {
        Sim.addBuff("strongarmbracers", {dmgtaken: amount}, {duration: 300});
      }
      prevKnockback = !!data.stats.knockback;
    });
  };
  affixes.leg_rechelsringoflarceny = function(amount) {
    Sim.register("updatestats", function(data) {
      if (data.stats.feared) {
        Sim.addBuff("rechelsringoflarceny", {extrams: amount}, {duration: 240});
      }
    });
  };

  affixes.leg_starmetalkukri = function(amount) {
    var sources = ["fetisharmy", "fetishsycophants", "thegidbinn"];
    Sim.register("onhit", function(data) {
      if (sources.indexOf(data.skill) >= 0 || (data.castInfo && data.castInfo.triggered && sources.indexOf(data.triggered) >= 0)) {
        Sim.reduceCooldown("fetisharmy", 60);
        Sim.reduceCooldown("bigbadvoodoo", 60);
      }
    });
  };
  affixes.leg_homunculus = affixes.leg_homunculus_p2 = function(amount) {
    if (this == "leg_homunculus_p2") amount = 2;
    Sim.after(amount * 60, function spawn() {
      Sim.cast("summonzombiedogs");
      Sim.after(amount * 60, spawn);
    });
  };
  affixes.leg_theshortmansfinger = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["gargantuan"], percent: 200}});
  };
  affixes.leg_wormwood = function(amount) {
    Sim.after(30, function apply() {
      if (Sim.getTargets(16, Sim.target.distance)) {
        Sim.cast("locustswarm");
      }
      Sim.after(30, apply);
    });
  };
  affixes.leg_carnevil = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "poisondart") {
        var pierce = (Sim.stats.leg_thedaggerofdarts ? true : undefined);
        var sources = ["fetisharmy", "fetishsycophants", "thegidbinn"];
        var count = 5;
        for (var i = 0; i < sources.length && count; ++i) {
          var curCount = Sim.petdelay(sources[i], count);
          if (curCount) {
            Sim.pushCastInfo({triggered: sources[i], castId: data.castId});
            var pierce = !!Sim.stats.leg_thedaggerofdarts;
            var factor = 1.3 * Sim.stats.info.aps * 3.5;
            if (sources[i] === "fetishsycophants") {
              factor *= 1 + 0.01 * (Sim.stats.skill_witchdoctor_fetisharmy || 0);
            }
            Sim.damage({type: "line", pierce: pierce, speed: 1.5, skill: "poisondart", pet: true, elem: "psn", coeff: factor, count: curCount});
            Sim.popCastInfo();
            count -= curCount;
          }
        }
      }
    });
  };
  affixes.leg_beltoftranscendence = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.cost && Sim.summon_sycophant) {
        Sim.summon_sycophant();
      }
    });
  };
  affixes.leg_thegidbinn = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("thegidbinn", 0.25 * data.proc, data.targets)) {
        Sim.petattack("thegidbinn", undefined, {
          duration: 1200,
          tickrate: 48,
          refresh: false,
          maxstacks: 5,
          ontick: function() {
            Sim.damage({pet: true, distance: 5, coeff: 1.8 * Sim.stats.info.aps});
          },
        });
        next = Sim.time + 300;
      }
    });
  };

  affixes.leg_gyananakashu = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "lashingtailkick") {
        Sim.damage({type: "line", speed: 1, pierce: true, radius: 10, coeff: amount * 0.01});
      }
    });
  };

  affixes.leg_kekegisunbreakablespirit = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("kekegisunbreakablespirit", 0.2 * data.proc, data.targets)) {
        Sim.addBuff("kekegisunbreakablespirit", {rcr_spirit: 100}, {duration: amount * 60});
        next = Sim.time + 1800;
      }
    });
  };

  affixes.leg_thelawsofseph = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "blindingflash") {
        Sim.addResource(amount);
      }
    });
  };

  affixes.leg_flyingdragon = function(amount) {
    if (Sim.stats.charClass !== "monk") return;
    var next = 0;
    Sim.register("oncast", function(data) {
      if (Sim.time >= next && data.offensive && Sim.random("flyingdragon", 0.05)) {
        Sim.addBuff("flyingdragon", {weaponaps_percent: 100}, {duration: 420});
        next = Sim.time + 300;
      }
    });
  };

  affixes.leg_spiritguards = function(amount) {
    if (Sim.stats.charClass !== "monk") return;
    Sim.register("oncast", function(data) {
      if (data.generate) {
        Sim.addBuff("spiritguards", {dmgred: amount}, {duration: 180});
      }
    });
  };

  affixes.leg_hunterswrath = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade"], percent: amount}});
  };

  affixes.leg_bindingofthelost = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "sevensidedstrike") {
        //todo: damage reduction
        Sim.addBuff("bindingofthelost", undefined, {duration: 420, maxstacks: 50, refresh: false});
      }
    });
  };

  affixes.leg_wrapsofclarity = function(amount) {
    if (Sim.stats.charClass !== "demonhunter") return;
    Sim.register("oncast", function(data) {
      if (data.generate) {
        Sim.addBuff("wrapsofclarity", {dmgred: amount}, {duration: 300});
      }
    });
  };

  affixes.leg_jeramsbracers = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["wallofdeath"], percent: amount}});
  };

  affixes.leg_hellskull = function(amount) {
    if (Sim.stats.info.mainhand.slot == "twohand") {
      Sim.addBaseStats({damage: 10});
    }
  };

  affixes.leg_sacredharness = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "fallingsword") {
        Sim.after(54, function() {
          Sim.cast("judgment");
        });
      }
    });
  };

  affixes.leg_blessedofhaull = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "justice") {
        if (data.castInfo.user && !data.castInfo.user.blessedofhaull) {
          Sim.cast_hammer(false);
          data.castInfo.user.blessedofhaull = true;
        }
      }
    });
  };

  affixes.leg_beltofthetrove = function(amount) {
    Sim.after(amount * 60, function impact() {
      Sim.cast("bombardment", undefined, true);
      Sim.after(amount * 60, impact);
    });
  };

  affixes.leg_brokenpromises = function(amount) {
    var cache = new Float32Array(16 * 6);
    cache[15 * 6] = 1;
    var lastFrame = 0;
    var accum = 0;
    var steps = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.getBuff("brokenpromises")) return;
      var p0a = Math.pow(1 - data.chc, data.hits || 1);
      var tmp = new Float32Array(16 * 6);
      var dt = Sim.time - lastFrame;
      for (var t = 0; t < 16; ++t) for (var n = 0; n < 5; ++n) {
        var p = cache[t * 6 + n];
        var p0 = (n === 4 ? 1 - data.chc : p0a);
        if (t + dt >= 15) tmp[n + 1] += p * p0;
        else tmp[(t + dt) * 6 + n] += p * p0;
        tmp[Math.min(t + dt, 15) * 6] += p * (1 - p0);
      }
      ++steps;
      var A0 = 1 - cache[5];
      var A = 1 - (tmp[5] + cache[5]);
      var B = tmp[5];
      tmp[5] += cache[5];
      accum += (A + A0) / 2;
      if (B > 1e-6) {
        if (cache[5] < 1e-6) B /= steps;
        var area = A * A / B;
        if (accum + area < steps) {
          Sim.addBuff("brokenpromises", {chc: 100}, {duration: 180});
          accum = 0;
          tmp = new Float32Array(16 * 6);
          tmp[15 * 6] = 1;
          steps = steps - accum - area;
        }
      }
      cache = tmp;
      lastFrame = Sim.time;
    });
  };

  affixes.leg_bracersofthefirstmen = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["hammeroftheancients"], percent: amount}});
  };
  affixes.leg_maskofjeram = function(amount) {
    Sim.addBaseStats({petdamage: amount});
  };
  affixes.leg_depthdiggers = function(amount) {
    if (Sim.stats.charClass === "witchdoctor") return;
    if (Sim.stats.charClass === "wizard" && !Sim.stats.leg_theshameofdelsere) return;
    var stats = {};
    for (var id in Sim.skills) {
      var skill = Sim.skills[id];
      if (Sim.skills[id].signature) {
        stats["skill_" + Sim.stats.charClass + "_" + id] = amount;
      }
    }
    Sim.addBaseStats(stats);
  };

  affixes.leg_chainofshadows = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "impale") {
        Sim.addBuff("chainofshadows", undefined, {duration: 120});
      }
    });
  };
  affixes.leg_stringofears = function(amount) {
    Sim.addBaseStats({meleedef: amount});
  };
  affixes.leg_zoeyssecret = function(amount) {
    var buffname;
    Sim.watchBuff("companion", function(data) {
      buffname = Sim.setBuffStacks(buffname, {dmgred: amount}, data.stacks);
    });
  };
  affixes.leg_kyoshirossoul = function(amount) {
    Sim.after(120, function check() {
      if (Sim.getBuff("sweepingwind") && !Sim.getTargets(10, Sim.target.distance)) {
        Sim.addBuff("sweepingwind", undefined, {stacks: 2});
      }
      Sim.after(120, check);
    });
  };
  affixes.leg_riveradancers = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["lashingtailkick"], percent: amount}});
  };
  affixes.leg_pintospride = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "waveoflight") {
        Sim.addBuff("slowed", undefined, 180);
        return {percent: amount};
      }
    });
  };
  affixes.leg_cesarsmemento = function(amount) {
    function trigger() {
      Sim.addBuff("cesarsmemento", {dmgmul: {skills: ["tempestrush"], percent: amount}}, {duration: 300});
    }
    Sim.watchStatus("blinded", trigger);
    Sim.watchStatus("frozen", trigger);
    Sim.watchStatus("stunned", trigger);
  };
  affixes.leg_bindingsofthelessergods = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "cyclonestrike") {
        Sim.addBuff("bindingsofthelessergods", {dmgmul: {skills: ["mystically"], percent: amount}}, {duration: 300});
      }
    });
  };
  affixes.leg_lastbreath = function(amount) {
    Sim.addBaseStats({skill_witchdoctor_massconfusion_cooldown: amount});
  };
  affixes.leg_aquilacuirass = function(amount) {
    Sim.after(15, function check() {
      if (Sim.getResource() / Sim.getMaxResource() > amount * 0.01) {
        Sim.addBuff("aquilacuirass", {dmgred: 50});
      } else {
        Sim.removeBuff("aquilacuirass");
      }
      Sim.after(15, check);
    });
  };
  affixes.leg_heartofiron = function(amount) {
    Sim.addBaseStats({vit_to_thorns: amount});
  };
  affixes.leg_liannaswings = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "shadowpower") {
        Sim.cast("smokescreen");
      }
    });
  };
  affixes.leg_warhelmofkassar = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["phalanx"], percent: amount}});
  };
  affixes.leg_bladeofthewarlord = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "bash" && data.cost) {
        return {percent: amount * data.cost / 40};
      }
    });
  };
  affixes.leg_oathkeeper = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["bash", "cleave", "frenzy", "weaponthrow"], percent: amount}});
  };
  affixes.leg_bladeofthetribes = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "warcry" || data.skill === "threateningshout") {
        Sim.cast("avalanche");
        Sim.cast("earthquake");
      }
    });
  };
  affixes.leg_vilehive = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["locustswarm"], percent: amount}});
  };
  affixes.leg_thingofthedeep = function(amount) {
    Sim.addBaseStats({pickup: 20});
  };

  affixes.leg_etchedsigil = function(amount) {
    //TODO: fix mechanics
    var list = [], index = 0;
    for (var id in Sim.stats.skills) {
      if (["arcaneorb", "waveofforce", "energytwister", "hydra", "meteor", "blizzard", "explosiveblast", "blackhole"].indexOf(id) >= 0) list.push(id);
    }
    var cds = {explosiveblast: 360, blackhole: 12 * 60};
    if (Sim.stats.skills.meteor === "a") cds.meteor = 15 * 60;
    if (Sim.stats.skills.explosiveblast === "c") cds.explosiveblast = 180;
    if (Sim.stats.skills.waveofforce === "a") cds.waveofforce = 300;
    var curcd = {};
    if (!list.length) return;

    var buffname;

    function update() {
      if (Sim.getBuff("rayoffrost") || Sim.getBuff("arcanetorrent") || Sim.getBuff("disintegrate")) {
        if (!buffname || !Sim.getBuff(buffname)) {
          buffname = Sim.addBuff(buffname, undefined, {
            tickrate: 60,
            tickinitial: 1,
            ontick: function(data) {
              for (var idx = 0; idx < list.length; ++idx) {
                index = (index + 1) % list.length;
                var id = list[index];
                if (Sim.time >= (curcd[id] || 0)) {
                  // fix to get the latest castId for channeled spells
                  var source = (Sim.buffs.rayoffrost || Sim.buffs.arcanetorrent || Sim.buffs.disintegrate);
                  if (source && source.castInfo) data.buff.castInfo.castId = source.castInfo.castId;

                  Sim.cast(id);

                  // fix for wand of woh
                  if (id === "explosiveblast" && Sim.stats.leg_wandofwoh) {
                    function docast() {Sim.cast("explosiveblast");}
                    Sim.after(30, docast, {rune: data.rune});
                    Sim.after(60, docast, {rune: data.rune});
                    Sim.after(90, docast, {rune: data.rune});
                  }

                  curcd[id] = Sim.time + (cds[id] * (1 - 0.01 * (Sim.stats.cdr || 0)) || 60);
                  break;
                }
              }
            },
          });
        }
      } else if (buffname) {
        Sim.removeBuff(buffname);
      }
    }

    Sim.watchBuff("rayoffrost", update);
    Sim.watchBuff("arcanetorrent", update);
    Sim.watchBuff("disintegrate", update);
  };
  affixes.leg_hammerjammers = function(amount) {
    function trigger() {
      Sim.addBuff("hammerjammers", {dmgmul: {skills: ["blessedhammer"], percent: amount}}, {duration: 600});
    }
    Sim.watchStatus("blinded", trigger);
    Sim.watchStatus("frozen", trigger);
    Sim.watchStatus("stunned", trigger);
  };
  affixes.leg_standoff = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "furiouscharge") {
        return {percent: Sim.stats.ms * amount * 0.01};
      }
    });
  };
  affixes.leg_ringofemptiness = function(amount) {
    var buffname;
    function update() {
      if (Sim.getBuff("haunt") && Sim.getBuff("locustswarm")) {
        buffname = Sim.addBuff(buffname, {dmgmul: amount});
      } else if (buffname) {
        Sim.removeBuff(buffname);
      }
    }
    Sim.watchBuff("haunt", update);
    Sim.watchBuff("locustswarm", update);
  };
  affixes.leg_elusivering = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "shadowpower" || data.skill === "smokescreen" || data.skill === "vault") {
        Sim.addBuff("elusivering", {dmgred: amount}, {duration: 480});
      }
    });
  };
  affixes.leg_justicelantern = function(amount) {
    var buffname;
    Sim.after(15, function update() {
      if (buffname) Sim.removeBuff(buffname);
      buffname = Sim.addBuff(buffname, {dmgred: amount * Sim.stats.block * 0.01});
      Sim.after(15, update);
    });
  };
  affixes.leg_bandofmight = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "furiouscharge" || data.skill === "groundstomp" || data.skill === "leap") {
        Sim.addBuff("bandofmight", {dmgred: amount}, {duration: 480});
      }
    });
  };
  affixes.leg_lefebvressoliloquy = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "cyclonestrike") {
        Sim.addBuff("lefebvressoliloquy", {dmgred: amount}, {duration: 300});
      }
    });
  };
  affixes.leg_mantleofchanneling = function(amount) {
    Sim.register("updatestats", function(data) {
      if (data.stats.channeling) {
        data.stats.add("dmgmul", amount);
        data.stats.add("dmgred", 25);
      }
    });
  };
  affixes.leg_thethreehundredthspear = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["weaponthrow", "ancientspear"], percent: amount}});
  };
  affixes.leg_swordofillwill = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "chakram") {
        return {percent: Sim.getResource("hatred") * amount};
      }
    });
  };
  affixes.leg_akkhansleniency = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "blessedshield") {
        Sim.addBuff("akkhansleniency", {dmgmul: {skills: ["blessedshield"], percent: amount}},
          {maxstacks: 99, stacks: Sim.random("akkhansleniency", 1, data.targets, true), duration: 180, refresh: false});
      }
    });
  };
  affixes.leg_karleispoint = function(amount) {
    var buffname;
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "impale" && data.castInfo.user && !data.castInfo.user.karleispoint) {
        if (buffname && Sim.getBuff(buffname)) {
          Sim.addResource(amount);
        }
        buffname = Sim.addBuff(buffname);
        data.castInfo.user.karleispoint = true;
      }
    });
  };
  affixes.leg_lordgreenstonesfan = function(amount) {
    Sim.after(60, function tick() {
      Sim.addBuff("lordgreenstonesfan", undefined, {maxstacks: 30});
      Sim.after(60, tick);
    });
    Sim.register("oncast", function(data) {
      if (data.skill === "fanofknives") {
        var stacks = Sim.getBuff("lordgreenstonesfan");
        if (stacks) {
          Sim.removeBuff("lordgreenstonesfan");
          return {percent: amount * stacks};
        }
      }
    });
  };
  affixes.leg_shieldoffury = function(amount) {
    var buffname;
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo === "heavensfury" && !data.castInfo.triggered) {
        var stacks = Sim.random("heavensfury", 1 / Sim.target.count, data.targets, true);
        if (!stacks) return;
        buffname = Sim.addBuff(buffname, {dmgmul: {skills: ["heavensfury"], percent: amount}}, {
          maxstacks: 999,
          stacks: stacks,
        });
      }
    });
  };
  affixes.leg_thetwistedsword = function(amount) {
    var buffname;
    function update() {
      var stacks = Sim.getBuff("energytwister") + 2 * Sim.getBuff("ragingstorm");
      buffname = Sim.setBuffStacks(buffname, {dmgmul: {skills: ["energytwister"], percent: amount}}, stacks);
    }
    Sim.watchBuff("energytwister", update);
    Sim.watchBuff("ragingstorm", update);
  };
  affixes.leg_deathwish = function(amount) {
    Sim.register("updatestats", function(data) {
      if (data.stats.channeling) {
        data.stats.add("dmgmul", amount);
      }
    });
  };

  affixes.leg_orbofinfinitedepth = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "explosiveblast") {
        Sim.addBuff("orbofinfinitedepth", {dmgmul: amount, dmgred: 15}, {maxstacks: 4, duration: 360});
      }
    });
  };
  affixes.leg_fragmentofdestiny = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["spectralblade"], percent: amount}});
  };

/*
  affixes.leg_thegrinreaper = function(amount) {
    var skills = {};
    skills.poisondart = function(rune) {
      return true;
    };
    skills.corpsespiders = function(rune) {
      if (rune === "b") {
        Sim.addBuff(undefined, undefined, {
          duration: 901,
          tickrate: 15,
          ontick: {type: "area", range: 10, coeff: 1.75 / 4, pet: true},
        });
      } else {
        return true;
      }
    };
    skills.plagueoftoads = function(rune) {
      return true;
    };
    skills.firebomb = function(rune) {
      if (rune === "d") {
        Sim.addBuff("pyrogeist", undefined, {
          maxstacks: 3,
          duration: 361,
          tickrate: 18,
          ontick: {coeff: 0.44},
        });
      } else {
        return true;
      }
    };
    skills.graspofthedead = function(rune) {
      if (rune === "b" || Sim.stats.leg_deadlyrebirth) {
        Sim.addBuff(undefined, undefined, {
          duration: 481,
          tickrate: 120,
          ontick: {type: "area", range: 8, radius: 45, coeff: 1.05},
        });
      }
      Sim.addBuff(undefined, undefined, {
        status: "slowed",
        duration: 480,
        tickrate: 30,
        tickinitial: 1,
        ontick: {type: "area", range: 14, coeff: (rune === "a" ? 0.85 : 0.475)},
      });
    };
  };
*/
})();

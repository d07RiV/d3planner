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
    Sim.addBaseStats({gem_enforcer: 15 + 0.3 * level});
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
    Sim.register("onhit", function(data) {
      if (Sim.time >= next) {
        Sim.addBuff("baneofthestricken", {dmgmul: 1 + level * 0.1}, {
          maxstacks: 9999,
        });
        next = Sim.time + 15;
      }
    });
    if (level >= 25) {
      Sim.addBaseStats({bossdmg: 25});
    }
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
  affixes.leg_triumvirate = function(amount) {
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
    if (Sim.params.leg_pridesfall && Sim.params.leg_pridesfall[0]) {
      Sim.addBaseStats({rcr: 30});
    }
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
      Sim.damage({thorns: true, coeff: amount * 0.01 * data.proc, count: data.targets});
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
    Sim.addBaseStats({dmgmul: {skills: ["gargantuan"], percent: 50}});
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
        for (var i = 0; i < sources.length; ++i) {
          var count = Sim.getBuff(sources[i]);
          if (count) {
            Sim.pushCastInfo({triggered: sources[i]});
            var pierce = !!Sim.stats.leg_thedaggerofdarts;
            Sim.damage({type: "line", pierce: pierce, speed: 1.5, skill: "poisondart", pet: true, elem: "psn", coeff: 1.3 * Sim.stats.info.aps, count: count});
            Sim.popCastInfo();
            Sim.petdelay(sources[i]);
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
        Sim.addBuff("flyingdragon", {weaponias: 100}, {duration: 420});
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
        Sim.addBuff("bindingsofthelost", undefined, {duration: 420, maxstacks: 50, refresh: false});
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

})();

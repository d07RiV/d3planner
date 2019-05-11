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
      if (Sim.stats[id]) {
        Sim.pushCastInfo({triggered: id});
        Sim.register("onhit_proc", Sim.apply_effect(fx[id].status, fx[id].duration, 0.01 * Sim.stats[id], true));
        Sim.popCastInfo();
      }
    }
    if (Sim.stats.bleed) {
      Sim.pushCastInfo({triggered: "bleed"});
      Sim.register("onhit_proc", function(data) {
        var targets = Sim.target.random("bleed", 0.01 * Sim.stats.bleed.chance * data.proc, data);
        if (targets.length) {
          Sim.addBuff("bleed", undefined, {duration: 300, targets: targets, tickrate: 15, data: {amount: Sim.stats.bleed.amount}, ontick: function(data) {
            Sim.damage({elem: "phy", coeff: data.amount * 0.01 / 20, orphan: true});
          }});
        }
      });
      Sim.popCastInfo();
    }

    Sim.pushCastInfo({triggered: "thorns"});
    Sim.register("ongethit", function() {
      var targets = 1;
      if (Sim.stats.set_invoker_2pc) {
        targets = Math.max(targets, Sim.getTargets(15, Sim.target.distance));
      }
      var coeff = 1;
      if (Sim.stats.leg_votoyiasspiker && Sim.getBuff("provoke")) {
        coeff *= 2;
      }
      Sim.damage({thorns: "normal", coeff: coeff, targets: targets, elem: "phy"});
    });
    Sim.popCastInfo();
  });

  gems.powerful = function(level) {
    if (level >= 25) Sim.addBaseStats({edmg: 15, edef: 15});
    if (Sim.params.powerful && Sim.params.powerful[0]) {
      Sim.addBuff("powerful", {dmgmul: 20});
    }
  };
  gems.trapped = function(level) {
    if (level >= 25) {
      var targets = Sim.getTargets(15, Sim.target.distance);
      if (targets) Sim.addBuff(undefined, undefined, {status: "slowed", targets: targets, aura: true});
    }
    Sim.register("updatestats", function(data) {
      var count = data.stats.countStatus("chilled", "frozen", "blinded", "stunned",
        "slowed", "knockback", "charmed", "feared", "rooted");
      if (count) data.stats.add("dmgmul", (15 + 0.3 * level) * count / Sim.target.count);
    });
  };
  gems.enforcer = function(level) {
    Sim.addBaseStats({dmgmul: {pet: true, percent: 15 + 0.3 * level}});
  };
  gems.toxin = function(level) {
    var buffs = (level >= 25 ? {dmgtaken: 10} : undefined);
    Sim.register("onhit", function(data) {
      Sim.addBuff("toxin", buffs, {
        duration: 600,
        targets: data.targets,
        firsttarget: data.firsttarget,
        tickrate: 15,
        ontick: {elem: "psn", coeff: (20 + level * 0.5) / 40},
      });
    });
  };
  gems.gogok = function(level) {
    var buffs = {ias: 1, dodge: 0.5 + level * 0.01};
    if (level >= 25) buffs.cdr = 1;
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next) {
        Sim.addBuff("gogok", buffs, {duration: 240, maxstacks: 15});
        next = Sim.time + 54;
      }
    });
  };
  gems.mirinae = function(level) {
    var coeff = 30 + 0.6 * level;
    Sim.register("onhit_proc", function(data) {
      var procs = Sim.random("mirinae", data.proc * 0.15, data.targets * data.count, true);
      while (procs--) Sim.damage({elem: "hol", coeff: coeff});
    });
    if (level >= 25) {
      Sim.after(180, function ontick() {
        Sim.damage({elem: "hol", coeff: coeff});
        Sim.after(180, ontick);
      });
    }
  };
  gems.pain = function(level) {
    Sim.register("onhit", function(data) {
      var targets = Sim.target.random("pain", data.chc, data);
      if (targets.length) {
        Sim.addBuff("pain", undefined, {
          duration: 180,
          targets: targets,
          tickrate: 15,
          ontick: {elem: "phy", coeff: (25 + 0.5 * level) / 12},
        });
      }
    });
    if (level >= 25) {
      Sim.watchBuff("pain", function(data) {
        var targets = Math.min(data.targets, Sim.getTargets(20, Sim.target.distance));
        Sim.setBuffStacks("painias", {ias: 3}, Math.round(targets));
      });
    }
  };
  gems.simplicity = function(level) {
    var skills = [];
    for (var id in Sim.skills) {
      if (Sim.skills[id].signature) {
        skills.push(id);
        //stats["skill_" + Sim.stats.charClass + "_" + id] = 25 + 0.5 * level;
      }
    }
    Sim.addBaseStats({dmgmul: {skills: skills, percent: 25 + 0.5 * level}});
  };
  gems.taeguk = function(level) {
    var buffs = {damage: 2 + level * 0.04};
    if (level >= 25) buffs.armor_percent = 2;
    Sim.register("oncast", function(data) {
      if (data.cost && data.channeling) {
        Sim.addBuff("taeguk", buffs, {maxstacks: 10, duration: 90});
      }
    });
  };
  gems.wreath = function(level) {
    var coeff = (12.5 + 0.25 * level) / 5;
    Sim.register("onhit_proc", function(data) {
      if (Sim.random("wreath", data.proc * 0.15, data.targets * data.count)) {
        Sim.addBuff("wreath", undefined, {
          duration: 180,
          tickrate: 12,
          ontick: {targets: 2, elem: "lit", coeff: coeff},
        });
      }
    });
  };
  gems.iceblink = function(level) {
    Sim.register("onhit", function(data) {
      if (data.elem === "col") {
        Sim.addBuff("chilled", undefined, {duration: 180, targets: data.targets, firsttarget: data.firsttarget});
      }
    });
    if (level >= 25) {
      Sim.register("updatestats", function(data) {
        var count = data.stats.countStatus("chilled");
        if (count) data.stats.add("chctaken", 10 * count / Sim.target.count);
      });
    }
  };
  gems.stricken = function(level) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next) {
        Sim.addBuff("stricken", {dmgmul: 0.8 + level * 0.01}, {
          maxstacks: 9999,
          targets: 1,
          firsttarget: data.firsttarget,
        });
        next = Sim.time + Sim.magic_icd();
      }
    });
    if (level >= 25) {
      Sim.addBaseStats({bossdmg: 25});
    }
  };
  gems.boyarsky = function(level) {
    Sim.addBaseStats({thorns: 16000 + 800 * level});
  };
  gems.soulshard = function(level) {
    Sim.after(1500 + 300, function ontick() {
      Sim.damage({type: "line", speed: 0.7, coeff: 125 + 0.5 * level, range: 80, count: 8, fan: 360/8, merged: true, angle: 360/16, elem: "fir"});
      Sim.after(1500 + 300, ontick);
    });
  };

  affixes.leg_wandofwoh = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["explosiveblast"], percent: 100}});
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
  affixes.leg_wandofwoh_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["explosiveblast"], percent: amount}});
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
  affixes.leg_triumvirate = affixes.leg_triumvirate_p2 = affixes.leg_triumvirate_p6 = function(amount) {
    Sim.register("oncast", function(data) {
      if (Sim.skills[data.skill] && Sim.skills[data.skill].signature) {
        Sim.addBuff("triumvirate", {dmgmul: {skills: ["arcaneorb"], percent: amount}}, {maxstacks: 3, duration: 360});
      }
    });
  };
  affixes.leg_stormcrow = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("stormcrow", 0.01 * amount, data.targets * data.count)) {
        Sim.damage({type: "line", elem: "fir", coeff: 1.15, speed: 0.75, area: 10});
        next = Sim.time + 240;
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
      Sim.addBuff("ingeom", {cdrint: amount});
    }
  };
  affixes.leg_eunjangdo = function(amount) {
    Sim.register("onhit_proc", function(data) {
      var list = Sim.listTargetsBelow(0.01 * amount, data);
      if (list.length) {
        Sim.addBuff("frozen", undefined, {duration: 180, targets: list});
      }
    });
  };
  affixes.leg_frostburn = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.elem === "col") {
        var targets = Sim.target.random("frostburn", 0.01 * amount * data.proc, data);
        if (targets.length) Sim.addBuff("frozen", undefined, {duration: 36, targets: targets});
      }
    });
  };
  affixes.leg_magefist = function(amount) {
    Sim.addBaseStats({dmgfir: amount});
  };
  affixes.leg_frostburn_p2 = function(amount) {
    Sim.addBaseStats({dmgcol: amount});
    Sim.register("onhit_proc", function(data) {
      if (data.elem === "col") {
        var targets = Sim.target.random("frostburn", 0.5 * data.proc, data);
        if (targets.length) Sim.addBuff("frozen", undefined, {duration: 36, targets: targets});
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
  affixes.leg_obsidianringofthezodiac = function(amount) {
    var rot = [];
    for (var id in Sim.stats.skills) rot.push(id);
    var current = 0;
    var next = 0;
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.cost && !data.castInfo.pet &&
          data.castInfo.user && !data.castInfo.user.zodiac /* && Sim.time >= next*/) {
        data.castInfo.user.zodiac = true;
        //next = Sim.time + Sim.magic_icd();
        for (var iter = 0; iter < 6; ++iter) {
          var cur = rot[current];
          current = (current + 1) % rot.length;
          if (Sim.getCooldown(cur) >= 10) {
            Sim.reduceCooldown(cur, 60);
            break;
          }
        }
      }
    });
  };
  affixes.leg_wyrdward = affixes.leg_wyrdward_p2 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.elem === "lit") {
        var targets = Sim.target.random("wyrdward", 0.01 * amount * data.proc, data);
        if (targets.length) Sim.addBuff("stunned", undefined, {duration: 90, targets: targets});
      }
    });
  };
  affixes.leg_overwhelmingdesire = function(amount) {
    Sim.register("onhit_proc", function(data) {
      var targets = Sim.target.random("overwhelmingdesire", 0.05 * data.proc, data);
      if (targets.length) Sim.addBuff("overwhelmingdesire", {dmgtaken: 35}, {duration: 180, targets: targets, status: "charmed"});
    });
  };
  affixes.leg_pridesfall = function(amount) {
    Sim.addBuff("pridesfall", {rcr: 30});
    var rem;
    Sim.register("ongethit", function() {
      Sim.removeBuff("pridesfall");
      if (rem) Sim.removeEvent(rem);
      rem = Sim.after(300, function() {
        Sim.addBuff("pridesfall", {rcr: 30});
      });
    });
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
    Sim.register("onblock", function() {
      Sim.addBuff("bloodbrother");
    });
    Sim.register("oncast", function() {
      if (Sim.getBuff("bloodbrother")) {
        Sim.removeBuff("bloodbrother");
        return {percent: 30};
      }
    });
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
      ontick: {elem: "arc", coeff: 1.5 * Sim.stats.info.aps},
    });
  };
  affixes.leg_bulkathossweddingband = function(amount) {
    Sim.addBuff(undefined, undefined, {
      tickrate: 12,
      ontick: {type: "area", range: 8, self: true, elem: "phy", coeff: 4},
    });
  };
  affixes.leg_hellfirering = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (next <= Sim.time && Sim.random("hellfirering", 0.5 * data.proc, data.targets * data.count)) {
        Sim.addBuff("hellfirering", undefined, {
          duration: 360,
          tickrate: 30,
          ontick: {type: "area", range: 16, elem: "fir", coeff: 1},
        });
        next = Sim.time + 2700;
      }
    });
  };
  affixes.leg_nagelring = function(amount) {
    Sim.addBuff(undefined, undefined, {
      tickrate: amount * 60,
      ontick: {type: "area", range: 10, type: "phy", coeff: 100},
    });
  };
  affixes.leg_firewalkers = affixes.leg_firewalkers_p2 = function(amount) {
    amount = Math.max(amount, 100);
    Sim.addBuff(undefined, undefined, {
      tickrate: 18,
      ontick: {type: "area", range: 5, type: "fir", coeff: amount * 0.003},
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
          ontick: {type: "area", range: 15, elem: "psn", coeff: amount * 0.005},
        });
      }
      Sim.after(delay, trigger);
    })();
  };
  affixes.leg_moonlightward = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (Sim.random("moonlightward", data.proc, data.targets * data.count)) {
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
  affixes.leg_sashofknives = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("sashofknives", 0.25 * data.proc, data.targets * data.count)) {
        Sim.damage({type: "line", range: 50, speed: 2, elem: "phy", coeff: 0.01 * amount});
        next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
      }
    });
  };
  affixes.leg_sashofknives_p2 = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next) {
        Sim.damage({type: "line", range: 50, speed: 2, elem: "phy", coeff: 0.01 * amount});
        next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
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
  affixes.leg_schaefershammer = function(amount) {
    Sim.register("ongethit", function(data) {
      Sim.addBuff("schaefershammer", undefined, {
        duration: 300,
        tickrate: 60,
        ontick: function(data) {
          Sim.damage({type: "area", range: 20, self: true, elem: "lit", coeff: amount * 0.01});
        },
      });
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
      if (Sim.time >= next && Sim.random("skysplitter", amount * 0.01 * data.proc, data.targets * data.count)) {
        Sim.damage({elem: "lit", coeff: coeff});
        Sim.addBuff("stunned", undefined, 30);
        next = Sim.time + cooldown;
      }
    });
  };
  affixes.leg_hack = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.globUser && !data.castInfo.globUser.hack) {
        data.castInfo.globUser.hack = true;
        var targets = 1;
        if (Sim.stats.set_invoker_2pc) {
          targets = Math.max(targets, Sim.getTargets(15, Sim.target.distance));
        }
        var coeff = amount * 0.01;
        if (Sim.stats.leg_votoyiasspiker && Sim.getBuff("provoke")) {
          coeff *= 2;
        }
        Sim.damage({thorns: "normal", coeff: coeff, count: targets, elem: "phy"});
      }
    });
  };
  affixes.leg_wizardspike = function(amount) {
    var next = 0;
    Sim.register("oncast", function(data) {
      if (data.offensive && Sim.time >= next && Sim.random("wizardspike", amount * 0.01)) {
        Sim.damage({skill: "arcaneorb", elem: "col", type: "area",
          origin: Sim.target.distance - 30, coeff: 9.50, range: 15, delay: 30 / 0.6});
        Sim.damage({skill: "arcaneorb", elem: "col", type: "line",
          coeff: 6.35, pierce: true, range: 30, speed: 0.6, radius: 15});
        Sim.damage({skill: "arcaneorb", elem: "col", type: "line",
          coeff: 3.15, pierce: true, range: 30, radius: 15, delay: 30 / 0.6 + 0.6, proc: 0.013});
        next = Sim.time + 120;
      }
    });
  };
  affixes.leg_odynson = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("odynson", amount * 0.01 * data.proc, data.targets * data.count)) {
        Sim.damage({elem: "lit", coeff: 1.1, count: 3});
        next = Sim.time + 60;
      }
    });
  };
  affixes.leg_fulminator = affixes.leg_fulminator_p3 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      var targets = Sim.target.random("fulminator", data.proc, data);
      if (targets.length) Sim.addBuff("fulminator", undefined, {
        duration: 360,
        tickrate: 30,
        ontick: {type: "area", range: 10, cmod: -1, elem: "lit", coeff: amount * 0.005},
      });
    });
  };
  affixes.leg_rimeheart = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.stats.frozen && Sim.random("rimeheart", 0.2 * data.proc, data.targets * data.count)) {
        Sim.damage({elem: "col", coeff: 100});
        next = Sim.time + 6;
      }
    });
  };
  affixes.leg_thunderfury = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("thunderfury", 0.6 * data.proc, data.targets * data.count)) {
        Sim.damage({elem: "lit", coeff: amount * 0.01, targets: 6, onhit: Sim.apply_effect("slowed", 180)});
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
        Sim.cast("markedfordeath");
        //Sim.addBuff("calamity", {dmgtaken: 20}, {duration: 1800, targets: data.targets, firsttarget: data.firsttarget});
      }
    });
  };
  affixes.leg_helltrapper = function(amount) {
    var skills = ["spiketrap", "caltrops", "sentry"];
    var type = 0;
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("helltrapper", 0.01 * amount * data.proc, data.targets * data.count)) {
        Sim.cast(skills[type]);
        type = (type + 1) % skills.length;
        next = Sim.time + 6;
      }
    });
  };
  affixes.leg_solanium = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("solanium", 0.01 * amount * data.proc * data.chc, data.targets * data.count)) {
        Sim.trigger("onglobe");
        next = Sim.time + 480;
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
      if (Sim.time >= next) {
        var targets = Sim.target.random("hellrack", data.proc, data);
        if (targets.length) {
          Sim.addBuff("rooted", undefined, {duration: 120, targets: targets});
          next = Sim.time + 6;
        }
      }
    });
  };

  affixes.leg_strongarmbracers = function(amount) {
    Sim.register("updatestats", function(data) {
      var count = data.stats.countStatus("knockback");
      if (count) {
        Sim.addBuff("strongarmbracers", {dmgtaken: amount / Sim.target.count}, {duration: 360});
      }
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
  affixes.leg_homunculus = affixes.leg_homunculus_p2 = affixes.leg_homunculus_p3 = function(amount) {
    if (this == "leg_homunculus_p2" || this == "leg_homunculus_p3") amount = 2;
    Sim.after(amount * 60, function spawn() {
      Sim.cast("summonzombiedogs");
      Sim.after(amount * 60, spawn);
    });
  };
  affixes.leg_theshortmansfinger = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["gargantuan"], percent: 200}});
  };
  affixes.leg_theshortmansfinger_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["gargantuan"], percent: amount}});
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
      if (Sim.time >= next && Sim.random("thegidbinn", 0.25 * data.proc, data.targets * data.count)) {
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

  affixes.leg_kekegisunbreakablespirit = function(amount) {
    var next = 0;
    Sim.register("onhit_proc", function(data) {
      if (Sim.time >= next && Sim.random("kekegisunbreakablespirit", 0.2 * data.proc, data.targets * data.count)) {
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
      if (Sim.time >= next && data.offensive && Sim.random("flyingdragon", 0.04)) {
        Sim.addBuff("flyingdragon", {weaponaps_percent: 100}, {duration: 420});
        next = Sim.time + 300;
      }
    });
  };

  affixes.leg_spiritguards = affixes.leg_spiritguards_p6 = function(amount) {
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

  affixes.leg_bindingofthelost = affixes.leg_bindingofthelost_p6 = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "sevensidedstrike") {
        //todo: damage reduction
        Sim.addBuff("bindingofthelost", undefined, {duration: 420, maxstacks: 50, refresh: false});
      }
    });
  };

  affixes.leg_wrapsofclarity = affixes.leg_wrapsofclarity_p6 = function(amount) {
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
      Sim.cast("bombardment", undefined, "soft");
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
      var p0a = Math.pow(1 - data.chc, data.count || 1);
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

  affixes.leg_bracersofthefirstmen = affixes.leg_bracersofthefirstmen_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["hammeroftheancients"], percent: amount}});
  };
  affixes.leg_maskofjeram = affixes.leg_maskofjeram_p6 = function(amount) {
    Sim.addBaseStats({petdamage: amount});
  };
  affixes.leg_depthdiggers = function(amount) {
    Sim.register("oncast", function(data) {
      if (Sim.skills[data.skill] && Sim.skills[data.skill].signature && data.generate) {
        return {percent: amount};
      }
    });
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
  affixes.leg_cesarsmemento = affixes.leg_cesarsmemento_p6 = function(amount) {
    function trigger(duration, targets) {
      Sim.addBuff("cesarsmemento", {dmgmul: {skills: ["tempestrush"], percent: amount}}, {duration: 300, targets: targets});
    }
    Sim.watchStatus("blinded", trigger);
    Sim.watchStatus("frozen", trigger);
    Sim.watchStatus("stunned", trigger);
  };
  affixes.leg_bindingsofthelessergods = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "cyclonestrike") {
        Sim.addBuff("bindingsofthelessergods", {dmgmul: {skills: ["mystically"], percent: amount}},
          {duration: 300, targets: data.targets, firsttarget: data.firsttarget});
      }
    });
  };
  affixes.leg_lastbreath = function(amount) {
    Sim.addBaseStats({skill_witchdoctor_massconfusion_cooldown: amount});
  };
  affixes.leg_aquilacuirass = function(amount) {
    (function check() {
      if (Sim.getResource() / Sim.getMaxResource() > amount * 0.01) {
        Sim.addBuff("aquilacuirass", {dmgred: 50});
      } else {
        Sim.removeBuff("aquilacuirass");
      }
      Sim.after(15, check);
    })();
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
  affixes.leg_bladeofthetribes = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "warcry" || data.skill === "threateningshout") {
        Sim.cast("avalanche", undefined, "soft");
        Sim.cast("earthquake", undefined, "soft");
      }
    });
  };
  affixes.leg_vilehive = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["locustswarm"], percent: amount}});
  };
  affixes.leg_thingofthedeep = function(amount) {
    Sim.addBaseStats({pickup: 20});
  };

  affixes.leg_etchedsigil = affixes.leg_etchedsigil_p6 = function(amount) {
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
    var maxhydra = (Sim.stats.leg_serpentssparker ? 2 : 1);

    var nextCast = 0;

    Sim.register("oncast", function(data) {
      if (data.skill === "rayoffrost" || data.skill === "arcanetorrent" || data.skill === "disintegrate") {
        if (Sim.time < nextCast) return;
        nextCast = Sim.time + 60;
        for (var idx = 0; idx < list.length; ++idx) {
          index = (index + 1) % list.length;
          var id = list[index];
          if (id === "hydra" && Sim.getBuff("hydra") >= maxhydra) {
            continue;
          }
          if (Sim.time >= (curcd[id] || 0)) {
            // fix to get the latest castId for channeled spells
            //var source = (Sim.getBuffCastInfo("rayoffrost") || Sim.getBuffCastInfo("arcanetorrent") ||
            //              Sim.getBuffCastInfo("disintegrate"));
            //if (source) data.buff.castInfo.castId = source.castId;

            Sim.cast(id);

            // fix for wand of woh
            if (id === "explosiveblast" && (Sim.stats.leg_wandofwoh || Sim.stats.leg_wandofwoh_p6)) {
              function docast() {Sim.cast("explosiveblast");}
              Sim.after(30, docast);
              Sim.after(60, docast);
              Sim.after(90, docast);
            }

            if (cds[id]) {
              curcd[id] = Sim.time + (cds[id] - 60 * (Sim.stats.cdrint || 0)) * (1 - 0.01 * (Sim.stats.cdr || 0));
            }
            break;
          }
        }
      }
    });

    if (Sim.stats.leg_etchedsigil_p6) {
      Sim.register("updatestats", function(data) {
        if (data.stats.channeling) {
          data.stats.add("dmgmul", {skills: list, percent: amount});
        }
      });
    }
  };
  affixes.leg_hammerjammers = function(amount) {
    function trigger(duration, targets) {
      Sim.addBuff("hammerjammers", {dmgmul: {skills: ["blessedhammer"], percent: amount}}, {duration: 600, targets: targets});
    }
    Sim.watchStatus("blinded", trigger);
    Sim.watchStatus("rooted", trigger);
    Sim.watchStatus("frozen", trigger);
    Sim.watchStatus("stunned", trigger);
  };
  affixes.leg_standoff = affixes.leg_standoff_p6 = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "furiouscharge") {
        return {percent: Sim.stats.ms * amount * 0.01};
      }
    });
  };
  affixes.leg_ringofemptiness = affixes.leg_ringofemptiness_p2 = function(amount) {
    var buffname;
    function update() {
      if (Sim.getBuff("haunt") && Sim.getBuff("locustswarm")) {
        buffname = Sim.addBuff(buffname, {dmgmul: {percent: amount, pet: false}});
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
  affixes.leg_bandofmight = affixes.leg_bandofmight_p6 = function(amount) {
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
          {maxstacks: 99, stacks: Sim.random("akkhansleniency", 1, data.targets * data.count, true), duration: 180, refresh: false});
      }
    });
  };
  affixes.leg_karleispoint = function(amount) {
    var buffname;
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "impale" && data.castInfo.user && !data.castInfo.user.karleispoint) {
        for (var i = (data.count || 1); i > 0; --i) {
          if (buffname && Sim.getBuff(buffname)) {
            Sim.addResource(amount);
          }
          buffname = Sim.addBuff(buffname, undefined, {targets: 1, firsttarget: data.firsttarget});
        }
        data.castInfo.user.karleispoint = true;
      }
    });
  };
  affixes.leg_karleispoint_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["impale"], percent: amount}});
    var buffname;
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "impale" && data.castInfo.user && !data.castInfo.user.karleispoint) {
        for (var i = (data.count || 1); i > 0; --i) {
          if (buffname && Sim.getBuff(buffname)) {
            Sim.addResource(15);
          }
          buffname = Sim.addBuff(buffname, undefined, {targets: 1, firsttarget: data.firsttarget});
        }
        data.castInfo.user.karleispoint = true;
      }
    });
  };
  affixes.leg_lordgreenstonesfan = affixes.leg_lordgreenstonesfan_p2 = affixes.leg_lordgreenstonesfan_p6 = function(amount) {
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
  affixes.leg_shieldoffury = affixes.leg_shieldoffury_p6 = function(amount) {
    var buffname;
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "heavensfury" && !data.castInfo.triggered) {
        buffname = Sim.addBuff(buffname, {dmgmul: {skills: ["heavensfury"], percent: amount}}, {
          maxstacks: 999,
          stacks: data.count,
          targets: data.targets,
          firsttarget: data.firsttarget,
        });
      }
    });
  };
  affixes.leg_thetwistedsword = function(amount) {
    var buffname;
    function update() {
      var stacks = Math.min(5, Sim.getBuff("energytwister") + 2 * Sim.getBuff("ragingstorm"));
      buffname = Sim.setBuffStacks(buffname, {dmgmul: {skills: ["energytwister"], percent: amount}}, stacks);
    }
    Sim.watchBuff("energytwister", update);
    Sim.watchBuff("ragingstorm", update);
  };
  affixes.leg_deathwish = affixes.leg_deathwish_p6 = function(amount) {
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
  affixes.leg_orbofinfinitedepth_p6 = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "explosiveblast") {
        Sim.addBuff("orbofinfinitedepth", {dmgmul: amount, dmgred: 20}, {maxstacks: 4, duration: 360});
      }
    });
  };
  affixes.leg_fragmentofdestiny = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["spectralblade"], percent: amount}});
  };

  affixes.leg_remorseless = function(amount) {
    function ancient_ontick(data) {
      if (data.user && (!data.user.ability || data.user.ability <= Sim.time)) {
        Sim.damage({type: "area", range: 8, coeff: 2.7, pet: true, elem: "phy"});
        data.user.ability = Sim.time + 240;
      } else {
        Sim.damage({coeff: 2.7, pet: true, elem: "phy"});
      }
    }
    Sim.register("oncast", function(data) {
      if (data.skill === "hammeroftheancients" && Sim.random("remorseless", 0.01 * amount)) {
        Sim.petattack("remorseless", undefined, {
          maxstacks: 3,
          stacks: 1,
          duration: 1200,
          refresh: false,
          tickrate: 57.142834,
          speed: true,
          ontick: ancient_ontick,
        });
      }
    });
  };

  affixes.leg_haloofarlyse = function(amount) {
    Sim.register("ongethit", function() {
      Sim.cast("frostnova");
    });
  };
  affixes.leg_deathseerscowl = function(amount) {
    if (Sim.target.type === "undead") {
      Sim.register("ongethit", function() {
        if (Sim.random("deathseerscowl", 0.01 * amount / Sim.target.count)) {
          Sim.addBuff("charmed", undefined, {duration: 120});
        }
      });
    }
  };
  affixes.leg_defenderofwestmarch = function(amount) {
    Sim.register("onblock", function() {
      Sim.damage({type: "line", pierce: true, radius: 5, speed: 0.5, range: 40, coeff: amount, elem: Sim.stats.info.mhelement || "phy"});
    });
  };
  affixes.leg_defenderofwestmarch_p2 = function(amount) {
    Sim.register("onblock", function() {
      Sim.damage({type: "line", pierce: true, radius: 5, speed: 0.5, range: 50, coeff: amount, elem: Sim.stats.info.mhelement || "phy"});
    });
  };
  affixes.leg_sanguinaryvambraces = function(amount) {
    Sim.register("ongethit", function() {
      if (Sim.random("sanguinaryvambraces", 0.1)) {
        Sim.damage({type: "area", range: 15, self: true, coeff: 10, thorns: "bad"});
      }
    });
  };
  affixes.leg_freezeofdeflection = function(amount) {
    Sim.register("onblock", function() {
      if (Sim.random("freezeofdeflection", 1 / Sim.target.count)) {
        Sim.addBuff("frozen", undefined, {duration: Math.round(60 * amount)});
      }
    });
  };
  affixes.leg_ivorytower = function(amount) {
    if (Sim.stats.charClass === "crusader") Sim.register("onblock", function() {
      Sim.cast("heavensfury", "e");
    });
  };
  affixes.leg_wallofman = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next && Sim.random("wallofman", 0.01 * amount)) {
        Sim.addBuff("wallofman", {dmgred: 25}, {duration: 480});
        next = Sim.time + 1200;
      }
    });
  };
  affixes.leg_akaratsawakening = function(amount) {
    Sim.register("onblock", function() {
      if (Sim.random("akaratsawakening", 0.01 * amount)) {
        for (var id in Sim.stats.skills) {
          Sim.reduceCooldown(id, 60);
        }
      }
    });
  };
  affixes.leg_sublimeconviction = function(amount) {
    Sim.register("onblock", function() {
      if (Sim.random("sublimeconviction", 0.01 * amount * Sim.getResource("wrath") / (Sim.stats.maxwrath || 1) / Sim.target.count)) {
        Sim.addBuff("stunned", undefined, {duration: 90});
      }
    });
  };
  affixes.leg_theoculus = function(amount) {
    Sim.register("ongethit", function() {
      if (Sim.random("theoculus", 0.01 * amount)) {
        Sim.reduceCooldown("teleport");
      }
    });
  };
  affixes.leg_theburningaxeofsankis = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next && Sim.random("theburningaxeofsankis", 0.15)) {
        Sim.addBuff("theburningaxeofsankis", {dmgred: 35}, {duration: 240});
        next = Sim.time + 240;
      }
    });
  };
  affixes.leg_deathwatchmantle = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next && Sim.random("deathwatchmantle", 0.01 * amount)) {
        Sim.damage({type: "area", range: 10, self: true, coeff: 2, elem: "phy"});
        next = Sim.time + 120;
      }
    });
  };
  affixes.leg_deathwatchmantle_p2 = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next && Sim.random("deathwatchmantle", 0.01 * amount)) {
        Sim.damage({type: "area", range: 10, self: true, coeff: 8.5, elem: "phy"});
        next = Sim.time + 120;
      }
    });
  };
  affixes.leg_thecapeofthedarknight = function(amount) {
    var next = 0;
    if (Sim.stats.charClass === "demonhunter") Sim.register("ongethit", function() {
      if (Sim.time >= next) {
        Sim.cast("caltrops");
        next = Sim.time + 360;
      }
    });
  };
  affixes.leg_vigilance = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next) {
        if (Sim.stats.charClass === "monk") {
          Sim.cast("innersanctuary");
        } else {
          Sim.addBuff(undefined, {dmgred: 55}, {duration: 360});
        }
        next = Sim.time + 600;
      }
    });
  };
  affixes.leg_thundergodsvigor = function(amount) {
    var next = 0;
    Sim.register("ongethit", function() {
      if (Sim.time >= next) {
        Sim.damage({coeff: amount * 0.01});
        next = Sim.time + 30;
      }
    });
  };
  affixes.leg_skullgrasp_p2 = affixes.leg_skullgrasp_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["whirlwind"], percent: amount}});
  };
  affixes.leg_bakulijunglewraps = affixes.leg_bakulijunglewraps_p6 = function(amount) {
    var buff;
    function update() {
      var list = Sim.listUnion(Sim.getBuffTargetList("locustswarm"), Sim.getBuffTargetList("piranhas"));
      buff = Sim.setBuffStacks(buff, {dmgmul: {skills: ["firebats"], percent: amount / Sim.target.count}}, list.length);
    }
    Sim.watchBuff("locustswarm", update);
    Sim.watchBuff("piranhas", update);
  };
  affixes.leg_swamplandwaders = function(amount) {
    var buff;
    function update() {
      var list = Sim.listUnion(Sim.getBuffTargetList("locustswarm"), Sim.getBuffTargetList("graspofthedead"));
      buff = Sim.setBuffStacks(buff, {dmgmul: {skills: ["sacrifice"], percent: amount / Sim.target.count}}, list.length);
    }
    Sim.watchBuff("locustswarm", update);
    Sim.watchBuff("graspofthedead", update);
  };
  affixes.leg_johannasargument = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["blessedhammer"], percent: 100}});
  };
  affixes.leg_theflowofeternity_p2 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["sevensidedstrike"], percent: 100}});
  };
  affixes.leg_fleshrake = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "dashingstrike") {
        Sim.addBuff("fleshrake", undefined, {maxstacks: 5, duration: 60});
        return {percent: Sim.getBuff("fleshrake") * amount};
      }
    });
  };
  affixes.leg_crystalfist = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "dashingstrike") {
        Sim.addBuff("crystalfist", {dmgred: amount}, {duration: 360});
      }
    });
  };
  affixes.leg_haloofkarini = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "stormarmor" && data.distance > 30) {
        Sim.addBuff("haloofkarini", {dmgred: amount}, {duration: 180});
      }
    });
  };
  affixes.leg_haloofkarini_p6 = function(amount) {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "stormarmor" && data.distance > 15) {
        Sim.addBuff("haloofkarini", {dmgred: amount}, {duration: 300});
      }
    });
  };
  affixes.leg_flailoftheascended = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "shieldbash" && data.castInfo.user && !data.castInfo.user.foa && data.origdata) {
        data.castInfo.user.foa = true;
        Sim.addBuff("flailoftheascended", undefined, {maxstacks: 5, refresh: false, data: {factor: (data.origdata.factor || 1)}});
      }
    });
  };
  affixes.leg_bootsofdisregard = function(amount) {
    Sim.after(60, function stack() {
      Sim.addBuff("bootsofdisregard", {regen: 10000}, {maxstacks: 4});
      Sim.after(60, stack);
    });
  };

  affixes.leg_denial = affixes.leg_denial_p6 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "sweepattack" && data.castInfo.user && !data.castInfo.user.denial) {
        data.castInfo.user.denial = true;
        Sim.setBuffStacks("denial", undefined, Math.min(5, Sim.random("denial", 1, data.targets, true)));
      }
    });
    Sim.register("oncast", function(data) {
      if (data.skill === "sweepattack") {
        var stacks = Sim.getBuff("denial");
        if (stacks) {
          Sim.removeBuff("denial");
          return {percent: amount * stacks};
        }
      }
    });
  };
  affixes.leg_goldenflense = affixes.leg_goldenflense_p2 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["sweepattack"], percent: 200}});
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "sweepattack") {
        Sim.addResource(data.targets * data.count * amount);
      }
    });
  };
  affixes.leg_goldenflense_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["sweepattack"], percent: amount}});
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "sweepattack") {
        Sim.addResource(data.targets * data.count * 6);
      }
    });
  };

  affixes.leg_madmonarchsscepter = function(amount) {
    Sim.register("onkill", function(data) {
      if (Sim.getBuff("madmonarchsscepter") === 9) {
        Sim.removeBuff("madmonarchsscepter");
        Sim.damage({type: "area", range: 30, self: true, coeff: amount * 0.01, elem: "psn"});
      } else {
        Sim.addBuff("madmonarchsscepter", undefined, {maxstacks: 10});
      }
    });
  };
  affixes.leg_burstofwrath = function(amount) {
    Sim.register("onkill", function(data) {
      if (Sim.random("burstofwrath", 0.1)) {
        var maxres = Sim.stats["max" + Sim.rcTypes[0]];
        if (maxres) Sim.addResource(0.2 * maxres);
      }
    });
  };
  affixes.leg_pandemoniumloop = function(amount) {
    var next = 0;
    Sim.register("onkill", function(data) {
      if (Sim.time >= next && Sim.stats.status[data.target] && Sim.stats.status[data.target].feared) {
        Sim.damage({type: "area", range: 15, coeff: 2, onhit: Sim.apply_effect("feared", 120)});
        next = Sim.time + 30;
      }
    });
  };
  affixes.leg_soulsmasher = function(amount) {
    Sim.register("onkill", function(data) {
      //Sim.damage({type: "area", range: 20, ???});
    });
  };
  affixes.leg_oculusring = function(amount) {
    var next = 0;
    Sim.register("onkill", function(data) {
      if (Sim.time >= next) {
        Sim.addBuff("oculusring", {damage: amount}, {duration: 420});
        next = Sim.time + 420;
      }
    });
  };
  affixes.leg_oculusring_p2 = function(amount) {
    var next = 0;
    Sim.register("onkill", function(data) {
      if (Sim.time >= next) {
        Sim.addBuff("oculusring", {dmgmul: amount}, {duration: 420});
        next = Sim.time + 420;
      }
    });
  };
  affixes.leg_winterflurry = function(amount) {
    Sim.register("onkill", function(data) {
      if (data.hit && data.hit.elem === "col" && Sim.random("winterflurry", amount * 0.01)) {
        Sim.damage({type: "area", range: 19, coeff: 0, elem: "col", onhit: Sim.apply_effect("frozen", 120)});
      }
    });
  };

  affixes.leg_cordoftherighteous = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["fistoftheheavens"], percent: amount}});
  };
  affixes.leg_girdleofgiants = affixes.leg_girdleofgiants_p6 = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "seismicslam") {
        Sim.addBuff("girdleofgiants", {dmgmul: {skills: ["earthquake"], percent: amount}}, {duration: 180});
      }
    });
  };

  affixes.leg_saffronwrap = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "overpower" && data.castInfo.user && !data.castInfo.user.saffronwrap) {
        data.castInfo.user.saffronwrap = true;
        Sim.setBuffStacks("saffronwrap", undefined, Math.min(20, Sim.random("saffronwrap", 1, data.targets, true)));
      }
    });
    Sim.register("oncast", function(data) {
      if (data.skill === "overpower") {
        var stacks = Sim.getBuff("saffronwrap");
        if (stacks) {
          Sim.removeBuff("saffronwrap");
          return {percent: amount * stacks};
        }
      }
    });
  };

  affixes.leg_faithfulmemory = affixes.leg_faithfulmemory_p6 = function(amount) {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.skill === "fallingsword" && data.castInfo.user && !data.castInfo.user.faithfulmemory) {
        data.castInfo.user.faithfulmemory = true;
        Sim.removeBuff("faithfulmemory");
        Sim.addBuff("faithfulmemory", {dmgmul: {skills: ["blessedhammer"], percent: amount}},
          {duration: 600, stacks: Math.min(10, Sim.random("faithfulmemory", 1, data.targets, true))});
      }
    });
  };

  affixes.leg_hellcatwaistguard = function(amount) {
    var h_cache = {};
    function num_hits(radius, origin, jumps) {
      var data = {};
      data.radius = Sim.target.radius;
      data.size = Sim.target.size + radius;
      data.origin = origin;
      data.jumps = jumps;
      data.targets = Sim.target.count;
      var str = JSON.stringify(data);
      if (!(str in h_cache)) h_cache[str] = do_compute(data);
      return h_cache[str];

      function do_compute(data) {
        var rng = new Math.seedrandom("hellcatwaistguard");
        var a0 = Math.PI * data.radius * data.radius;
        var jd = 10.0;

        var counts = [];
        for (var i = 0; i < data.jumps; ++i) {
          counts.push(0);
        }
        for (var i = 0; i < 1000; ++i) {
          var d = data.origin;
          for (var j = 0; j < data.jumps; ++j) {
            var area = Sim.math.circleIntersection(d, data.size, data.radius);
            counts[j] += 0.001 * Math.min(area, a0) / a0 * data.targets;
            var x, y;
            do {
              x = (rng() * 2 - 1) * jd;
              y = (rng() * 2 - 1) * jd;
            } while (x * x + y * y > jd * jd);
            x += d;
            d = Math.sqrt(x * x + y * y);
          }
        }
        return counts;
      }
    }

    Sim.register("onhit", function(data) {
      if (data.tags && data.tags.indexOf("grenade") >= 0 && data.origdata) {
        var origin = 0;
        if (data.origdata.origin !== undefined) {
          origin = data.origdata.origin;
        } else if (data.origdata.type === "area" && data.origdata.radius !== undefined) {
          origin = 2 / 3 * (data.origdata.radius - (data.origdata.inner || 0));
        } else if (data.origdata.type === "line" && data.origdata.distance !== undefined) {
          origin = Math.min(Sim.target.radius, Math.abs(Sim.target.distance - data.origdata.distance));
        }
        var area = (data.origdata.area || data.origdata.range || 0);
        var counts = num_hits(area, origin, amount);
        Sim.pushCastInfo(data.castInfo);
        for (var i = 1; i <= amount; ++i) {
          Sim.damage({coeff: data.origdata.coeff * (i == amount ? 8 : 0.5 * i), targets: counts[i - 1], count: data.count * 0.5, proc: 0});
        }
        Sim.popCastInfo();
      }
    });
  };

  affixes.leg_rabidstrike = function(amount) {
    var skills = ["waveoflight", "lashingtailkick", "cyclonestrike", "explodingpalm", "sevensidedstrike"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        Sim.after(6, function() {
          Sim.cast(data.skill, data.rune, true, true);
        });
      }
    });
  };

  affixes.leg_omrynschain = function(amount) {
    Sim.register("oncast", function(data) {
      if (data.skill === "vault") {
        Sim.cast("caltrops");
      }
    });
  };

  affixes.leg_balance = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["tempestrush"], percent: 200}});
  };
  affixes.leg_balance_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["tempestrush"], percent: amount}});
  };
  affixes.leg_bladeofprophecy = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["condemn"], percent: 100}});
  };
  affixes.leg_bladeofprophecy_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["condemn"], percent: amount}});
  };
  affixes.leg_deadmanslegacy = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["multishot"], percent: 100}});
  };
  affixes.leg_deadmanslegacy_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["multishot"], percent: amount}});
  };
  affixes.leg_fateofthefell_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["heavensfury"], percent: amount}});
  };
  affixes.leg_frydehrswrath = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["condemn"], percent: 200}});
  };
  affixes.leg_frydehrswrath_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["condemn"], percent: amount}});
  };
  affixes.leg_furyofthevanishedpeak = affixes.leg_furyofthevanishedpeak_p2 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["seismicslam"], percent: 125}});
  };
  affixes.leg_furyofthevanishedpeak_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["seismicslam"], percent: amount}});
  };
  affixes.leg_gavelofjudgment = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["hammeroftheancients"], percent: 100}});
  };
  affixes.leg_gavelofjudgment_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["hammeroftheancients"], percent: amount}});
  };
  affixes.leg_gyrfalconsfoote_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["blessedshield"], percent: amount}});
  };
  affixes.leg_incensetorchofthegrandtemple = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["waveoflight"], percent: 30}});
  };
  affixes.leg_incensetorchofthegrandtemple_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["waveoflight"], percent: amount}});
  };
  affixes.leg_jekangbord = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["blessedshield"], percent: 200}});
  };
  affixes.leg_jekangbord_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["blessedshield"], percent: amount}});
  };
  affixes.leg_manticore = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["clusterarrow"], percent: 80}});
  };
  affixes.leg_manticore_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["clusterarrow"], percent: amount}});
  };
  affixes.leg_ranslorsfolly_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["energytwister"], percent: amount}});
  };
  affixes.leg_staffofchiroptera = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["firebats"], percent: 60}});
  };
  affixes.leg_staffofchiroptera_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["firebats"], percent: amount}});
  };
  affixes.leg_unstablescepter = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["arcaneorb"], percent: 65}});
  };
  affixes.leg_unstablescepter_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["arcaneorb"], percent: amount}});
  };
  affixes.leg_yangsrecurve_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["multishot"], percent: amount}});
  };
  affixes.leg_thegrandvizier = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["meteor"], percent: 30}});
  };
  affixes.leg_thegrandvizier_p6 = function(amount) {
    Sim.addBaseStats({dmgmul: {skills: ["meteor"], percent: amount}});
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

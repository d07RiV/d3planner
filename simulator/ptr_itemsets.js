(function() {
  var Sim = Simulator;
  var affixes = Sim.affixes;

/*
nightmares: todo
asheara's: todo
*/

  affixes.set_bastionsofwill_2pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && !data.castInfo.pet &&
          data.castInfo.user && !data.castInfo.user.bastionsofwill) {
        if (data.castInfo.cost !== undefined) {
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("restraint", {dmgmul: 50}, {duration: 300});
        } else if (data.castInfo.generate !== undefined ||
            ((data.castInfo.skill === "earthquake" || data.castInfo.skill === "avalanche") && this.stats.passives.earthenmight)) { // weird fix
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("focus", {dmgmul: 50}, {duration: 300});
        }
      }
    });
  };

  affixes.set_istvan_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.cost && data.resource !== "disc") {
        Sim.addBuff("istvan", {ias: 6, dmgmul: 6, armor_percent: 6}, {duration: 300, maxstacks: 5});
      }
    });
  };

  affixes.set_talrasha_2pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_2pc_fire", "col": "tal_2pc_cold", "arc": "tal_2pc_arcane", "lit": "tal_2pc_lightning"};
    var runes = {"fir": "a", "col": "c", "arc": "d", "lit": "e"};
    Sim.register("onhit", function(data) {
      if (data.elem && elems[data.elem]/* && data.castInfo && data.castInfo.skill && !data.castInfo.triggered*/) {
        if (!Sim.getBuff(elems[data.elem])) {
          Sim.addBuff(elems[data.elem], undefined, {duration: 480});
          Sim.cast("meteor", runes[data.elem]);
        }
      }
    });
  };

  affixes.set_talrasha_4pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_4pc_fire", "col": "tal_4pc_cold", "arc": "tal_4pc_arcane", "lit": "tal_4pc_lightning"};
    Sim.metaBuff("tal_4pc", ["tal_4pc_fire", "tal_4pc_cold", "tal_4pc_arcane", "tal_4pc_lightning"]);
    Sim.register("oncast", function(data) {
      if (data.offensive && data.elem && elems[data.elem]) {
        Sim.addBuff(elems[data.elem], {resist_percent: 25}, {duration: 480});
      }
    });
  };

  affixes.set_talrasha_6pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_6pc_fire", "col": "tal_6pc_cold", "arc": "tal_6pc_arcane", "lit": "tal_6pc_lightning"};
    var elems2 = {"fir": "tal_6pc_fire2", "col": "tal_6pc_cold2", "arc": "tal_6pc_arcane2", "lit": "tal_6pc_lightning2"};
    Sim.register("oncast", function(data) {
      var elem = data.elem;
      if (data.skill === "archon") elem = "fir";
      if (data.offensive && elem && elems[elem]) {
        if (!Sim.getBuff(elems[elem])) {
          Sim.addBuff(elems[elem], undefined, {duration: 480});
          for (var id in elems) {
            Sim.refreshBuff(elems[id], 480);
          }
          Sim.addBuff("tal_6pc", {dmgmul: 750}, {maxstacks: 4, duration: 480});
        } else if (Sim.getBuff("tal_6pc") === 4 && !Sim.getBuff(elems2[elem])) {
          var dur = Sim.getBuffDuration("tal_6pc") + 120;
          for (var id in elems) {
            Sim.refreshBuff(elems[id], dur);
            Sim.removeBuff(elems2[id]);
          }
          Sim.addBuff(elems2[elem], undefined, {duration: dur});
          Sim.refreshBuff("tal_6pc", dur);
        }
      }
    });
  };

  affixes.set_firebird_4pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    function fb_ontick(data) {
      Sim.damage({elem: "fir", coeff: data.coeff / 4, firsttarget: data.buff.target});
    }
    function fb_onapply(data) {
      data.skills = {};
      data.skills[data.skill] = true;
      data.coeff = 10;
    }
    function fb_onrefresh(data, newdata) {
      if (!data.skills[newdata.skill]) {
        data.skills[newdata.skill] = true;
        if (data.coeff < 30) {
          data.coeff += 10;
          if (data.coeff === 30) {
            Sim.refreshBuff("firebird_4pc", "infinite", data.buff.target);
          }
        }
      }
    }
    Sim.register("onhit", function(data) {
      if (data.elem === "fir" && data.triggered !== "set_firebird_4pc" && data.castInfo && data.castInfo.skill) {
        Sim.addBuff("firebird_4pc", undefined, {data: {skill: data.castInfo.skill}, targets: data.targets, firsttarget: data.firsttarget,
          duration: 180, tickrate: 15, onapply: fb_onapply, onrefresh: fb_onrefresh, ontick: fb_ontick});
      }
    });
  };
  affixes.set_firebird_6pc = function() {
    Sim.watchBuff("firebird_4pc", function(data) {
      var buff = Sim.buffs.firebird_4pc;
      var stacks = 0;
      if (buff && buff.targets) {
        for (var id in buff.targets) {
          if (buff.targets[id].data.coeff && buff.targets[id].data.coeff >= 30) {
            stacks += (id < Sim.target.eliteCount ? 20 : 1);
          }
        }
      }
      Sim.setBuffStacks("firebird_6pc", {dmgmul: 200, dmgred: 3}, Math.min(stacks, 20));
    });
  };

  affixes.set_vyr_6pc = function() {
    Sim.register("onhit", function(data) {
      var skill = (data.castInfo && data.castInfo.skill && Sim.skills[data.castInfo.skill]);
      if (skill && skill.shift === "archon" && data.castInfo.user) {
        var counter = data.castInfo.user.vyr_6pc;
        if (!counter || counter < 1) {
          var hits = Math.min(1 - (counter || 0), Math.ceil(data.targets));
          Sim.addBuff("archon_stacks", undefined, {maxstacks: 9999, stacks: hits});
          data.castInfo.user.vyr_6pc = (counter || 0) + hits;
        }
      }
    });
  };

  affixes.set_magnumopus_2pc = function() {
    var skills = ["arcaneorb", "energytwister", "explosiveblast", "magicmissile", "shockpulse", "spectralblade", "waveofforce"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        Sim.reduceCooldown("slowtime", 180);
      }
    });
  };

  affixes.set_magnumopus_6pc = function() {
    var buffname;
    Sim.watchBuff("slowtime", function(data) {
      if (data.targets) {
        buffname = Sim.addBuff(buffname, {dmgmul: {skills: ["arcaneorb", "energytwister", "explosiveblast", "magicmissile",
          "shockpulse", "spectralblade", "waveofforce"], percent: 3800}}, {targets: data.targets});
      } else if (buffname) {
        Sim.after(300, function() {
          if (!Sim.getBuff("slowtime")) {
            Sim.removeBuff(buffname);
          }
        });
      }
    });
  };

  affixes.set_chantodo_2pc = function() {
    Sim.addBuff("chantodo_2pc", undefined, {maxstacks: 20});
    Sim.register("oncast", function(data) {
      if (data.skill === "archon") {
        var stacks = Sim.getBuff("chantodo_2pc");
        var elem = (data.elem || "arc");
        Sim.removeBuff("chantodo_2pc");
        Sim.addBuff("chantodo_2pc", undefined, {maxstacks: 20});
        var buff = Sim.addBuff(undefined, undefined, {
          duration: 1200,
          tickinitial: 1,
          tickrate: 60,
          ontick: function(data) {
            if (!Sim.getBuff("archon")) {
              Sim.removeBuff(buff);
              return;
            }
            Sim.damage({type: "area", range: 30, self: true, coeff: 10 * stacks, elem: "max", srcelem: elem});
          },
        });
      }
    });
    var next = 0;
    var limit = 0;
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.user) {
        if (Sim.skills[data.castInfo.skill] && Sim.skills[data.castInfo.skill].shift) {
          return;
        }
        var counter = data.castInfo.user.chantodo_2pc;
        if (!counter || counter < 1) {
          var hits = Math.min(1 - (counter || 0), Math.ceil(data.targets * data.count));
          Sim.addBuff("chantodo_2pc", undefined, {maxstacks: 20, stacks: hits});
          data.castInfo.user.chantodo_2pc = (counter || 0) + hits;
        }
        var hits = Math.min(3 - limit, Math.ceil(data.targets * data.count));
        Sim.addBuff("chantodo_2pc", undefined, {maxstacks: 20, stacks: hits});
        limit += hits;
      }
    });
  };

  affixes.set_natalya_2pc = function() {
    //var cache = {};
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.user && (data.castInfo.generate || data.castInfo.cost) && data.castInfo.resource === "hatred") {
        if (!data.castInfo.user.natalya_2pc) {// && cache[data.skill] === undefined || Sim.time >= cache[data.skill]) {
          Sim.reduceCooldown("rainofvengeance", 240);
          //cache[data.skill] = Sim.time + Math.floor(42 / Sim.stats.info.aps);
          data.castInfo.user.natalya_2pc = true;
        }
      }
    });
  };
  affixes.set_natalya_4pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["rainofvengeance"], percent: 100}});
  };
  affixes.set_natalya_6pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "rainofvengeance") {
        Sim.addBuff("natalya_6pc", {dmgmul: 3500, dmgred: 60}, {duration: 600});
      }
    });
  };

  affixes.set_marauder_4pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["sentry"], percent: 400}});
    var list = ["chakram", "clusterarrow", "elementalarrow", "impale", "multishot"];
    Sim.register("oncast", function(data) {
      if (list.indexOf(data.skill) >= 0) {
        var stacks = Sim.getBuff("sentry");
        for (var i = 0; i < stacks; ++i) {
          Sim.cast(data.skill, data.rune, "sentry");
        }
        Sim.petdelay("sentry");
      }
    });
  };

  affixes.set_marauder_6pc = function() {
    var list = ["chakram", "clusterarrow", "elementalarrow", "impale", "multishot"];
    Sim.register("oncast", function(data) {
      if (data.generate || list.indexOf(data.skill) >= 0) {
        var stacks = Sim.getBuff("sentry");
        if (stacks) return {percent: stacks * 3000};
      }
    });
    // We can't put them together or else sentry spenders will get buffed too (we could avoid it by setting
    // pet=false, but then companion would have to be in a separate buff anyway).
    var buffname = undefined;
    Sim.watchBuff("sentry", function(data) {
      buffname = Sim.setBuffStacks(buffname, {dmgmul: {skills: ["companion", "vengeance"], percent: 3000}}, data.stacks);
    });
  };

  affixes.set_unhallowed_2pc = function() {
    Sim.register("oncast", function(data) {
      if (Sim.skills[data.skill] && Sim.skills[data.skill].signature) {
        Sim.addResource(2, "hatred");
        Sim.addResource(1, "disc");
      }
    });
  };

  affixes.set_unhallowed_4pc = function() {
    Sim.after(6, function check() {
      if (Sim.getTargets(10, Sim.target.distance) < 0.1) {
        Sim.addBuff("unhallowed_4pc", {dmgmul: 60, dmgred: 60}, {duration: 480});
      }
      Sim.after(6, check);
    });
  };

  affixes.set_unhallowed_6pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate || data.skill === "multishot") {
        return {percent: 100 * (Sim.resources.disc || 0)};
      }
    });
  };

  affixes.set_zunimassa_6pc = function() {
    if (Sim.stats.charClass !== "witchdoctor") return;
    Sim.register("onhit", function(data) {
      var cost = (data.castInfo && data.castInfo.cost);
      if (!cost && data.castInfo && data.castInfo.skill && Sim.skills[data.castInfo.skill]) {
        cost = Sim.skills[data.castInfo.skill].cost;
        if (cost) cost = cost.x;
      }
      if (data.castInfo && cost) {
        Sim.addBuff("zunimassa_6pc", {dmgmul: {pet: true, percent: 5500}}, {duration: 480, targets: data.targets, firsttarget: data.firsttarget});
      }
    });
  };

  affixes.set_helltooth_2pc = function() {
    var skills = ["poisondart", "firebomb", "corpsespiders", "plagueoftoads", "acidcloud", "firebats", "zombiecharger",
      "summonzombiedogs", "gargantuan", "graspofthedead", "piranhas", "wallofdeath"];
    Sim.register("onhit", function(data) {
      if (data.castInfo && skills.indexOf(data.castInfo.skill) >= 0) {
        Sim.addBuff("helltooth_2pc", undefined, {
          status: "slowed",
          duration: 601,
          tickrate: 30,
          targets: data.targets,
          firsttarget: data.firsttarget,
          ontick: {elem: "max", coeff: 7.5},
        });
      }
    });
  };
  affixes.set_helltooth_4pc = function() {
    var buffname;
    Sim.watchBuff("helltooth_4pc", function(data) {
      if (data.targets) {
        buffname = Sim.addBuff(buffname, {dmgred: 60});
      } else {
        Sim.removeBuff(buffname);
      }
    });
  };
  affixes.set_helltooth_6pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "wallofdeath") {
        Sim.addBuff("helltooth_6pc", {
          dmgmul: {list: [
            {pet: false, skills: ["poisondart", "firebomb", "plagueoftoads", "acidcloud", "firebats", "zombiecharger",
              "graspofthedead", "piranhas", "wallofdeath"], percent: 4400},
            {skills: ["corpsespiders", "summonzombiedogs", "gargantuan"], percent: 4400},
          ]},
        }, {duration: 900});
      }
    });
  };

  affixes.set_arachyr_2pc = function() {
    var buffname;
    Sim.after(48, function drop() {
      buffname = Sim.addBuff(buffname, undefined, {
        status: "slowed",
        duration: 300,
        tickrate: 30,
        tickinitial: 1,
        ontick: {type: "area", range: 15, coeff: 4, elem: "max", skill: "corpsespiders"},
      });
      Sim.after(48, drop);
    });
  };
  affixes.set_arachyr_4pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "hex") {
        Sim.addBuff("arachyr_4pc", {dmgred: 50}, {duration: 900});
      }
    });
  };
  affixes.set_arachyr_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["corpsespiders", "plagueoftoads", "firebats", "hex", "locustswarm", "piranhas"], percent: 4500}});
  };

  affixes.set_shenlong_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate) {
        return {percent: Sim.resources.spirit * 2};
      }
    });
    Sim.register("updatestats", function(data) {
      if (Sim.getBuff("shenlong_2pc")) {
        data.stats.spiritregen = -65;
      }
    });
    Sim.after(12, function check() {
      if (Sim.resources.spirit >= Sim.stats.maxspirit - 1) {
        Sim.addBuff("shenlong_2pc", {dmgmul: 200}, {});
      } else if (Sim.resources.spirit <= 1) {
        Sim.removeBuff("shenlong_2pc");
      }
      Sim.after(12, check);
    });
  };

  affixes.set_inna_4pc = function() {
    var list = ["mantraofsalvation", "mantraofretribution", "mantraofhealing", "mantraofconviction"];
    for (var i = 0; i < list.length; ++i) {
      var id = list[i];
      if (!Sim.stats.skills[id] && Sim.skills[id]) {
        Sim.pushCastInfo({
          skill: id,
          rune: "x",
          elem: Sim.getProp(Sim.skills[id], "elem", "x"),
        });
        Sim.skills[id].oninit("x");
        Sim.popCastInfo();
      }
    }
  };
  affixes.set_inna_6pc = function() {
    if (!Sim.stats.skills.mystically && Sim.skills.mystically) {
      var skill = Sim.skills.mystically;
      Sim.pushCastInfo({
        skill: "mystically",
        rune: "x",
        buffs: [],
        elem: Sim.getProp(skill, "elem", "x"),
        proc: Sim.getProp(skill, "proctable", "x"),
      });
      Sim.getProp(skill, "oninit", "x");
      Sim.popCastInfo();
    }
    var buffname;
    Sim.watchBuff("mystically", function(data) {
      buffname = Sim.setBuffStacks(buffname, {dmgmul: 150}, data.stacks);
    });
  };

  /*affixes.set_inna_6pc = function() {
    var list = ["cyclonestrike", "explodingpalm", "lashingtailkick", "sevensidedstrike", "waveoflight"];
    Sim.register("oncast", function(data) {
      if (list.indexOf(data.skill) >= 0) {
        var stacks = Sim.getBuff("mystically");
        for (var i = 0; i < stacks; ++i) {
          Sim.cast(data.skill, data.rune, "mystically");
        }
        Sim.petdelay("mystically");
      }
    });
  };*/

  affixes.set_sunwuko_2pc = function() {
    Sim.watchBuff("sweepingwind", function(data) {
      if (data.stacks) {
        Sim.addBuff("sunwuko_2pc", {dmgred: 50});
      } else {
        Sim.removeBuff("sunwuko_2pc");
      }
    });
  };
  affixes.set_sunwuko_4pc = function() {
    Sim.after(60, function check() {
      var stacks = Sim.getBuff("sweepingwind");
      if (stacks) Sim.damage({type: "area", range: 15, coeff: 10 * stacks, elem: "max"});
      Sim.after(60, check);
    });
  };
  affixes.set_sunwuko_6pc = function() {
    Sim.register("oncast", function(data) {
      if (["lashingtailkick", "tempestrush", "waveoflight"].indexOf(data.skill) >= 0) {
        return {percent: 1000 * Sim.getBuff("sweepingwind")};
      }
    });
  };

  affixes.set_storms_2pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 100}});
  };
  affixes.set_storms_6pc = function() {
    if (Sim.stats.charClass !== "monk") return;
    Sim.register("oncast", function(data) {
      if (data.generate) {
        Sim.addBuff("storms_6pc_ds", undefined, {duration: 360});
      } else if (data.skill === "dashingstrike") {
        Sim.addBuff("storms_6pc_gen", {dmgmul:
          {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 1300}}, {duration: 360});
      }
    });
  };

  affixes.set_uliana_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate) {
        data.user.sequence = Sim.getBuff(data.skill);
      }
    });
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.user && data.castInfo.user.sequence === 2 && Sim.apply_palm) {
        Sim.apply_palm(data.targets, data.firsttarget);
        delete data.castInfo.user.sequence;
      }
    });
  };
  affixes.set_uliana_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["explodingpalm"], percent: 2100}});
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.user && data.castInfo.skill === "sevensidedstrike" && Sim.getBuff("explodingpalm", data.firsttarget)) {
        Sim.explode_palm(data.firsttarget);
      }
    });
  };

  affixes.set_roland_2pc = function() {
    var list = ["lawsofvalor", "lawsofjustice", "lawsofhope", "shieldglare", "ironskin", "consecration", "judgment"];
    Sim.register("oncast", function(data) {
      if (data.skill === "shieldbash" || data.skill === "sweepattack") {
        for (var i = 0; i < list.length; ++i) {
          Sim.reduceCooldown(list[i], 60);
        }
      }
    });
  };
  affixes.set_roland_4pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["shieldbash", "sweepattack"], percent: 3300}});
  };
  affixes.set_roland_6pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && (data.castInfo.skill === "shieldbash" || data.castInfo.skill === "sweepattack")) {
        if (data.castInfo.user && !data.castInfo.user.roland_6pc) {
          Sim.addBuff("roland_6pc", {ias: 50, dmgred: 15}, {duration: 480, maxstacks: 5});
          data.castInfo.user.roland_6pc = true;
        }
      }
    });
  };

  affixes.set_light_2pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "blessedhammer") {
        if (data.castInfo.user && !data.castInfo.user.light_2pc) {
          Sim.reduceCooldown("fallingsword", 60);
          Sim.reduceCooldown("provoke", 60);
          data.castInfo.user.light_2pc = true;
        }
      }
    });
  };
  affixes.set_light_4pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "fallingsword") {
        Sim.after(54, function() {
          Sim.addBuff("light_4pc", {dmgred: 50}, {duration: 480});
        });
      }
    });
  };
  affixes.set_light_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["blessedhammer"], percent: 2000}});
    Sim.addBaseStats({dmgmul: {skills: ["fallingsword"], percent: 1000}});
  };

  affixes.set_immortalking_4pc = function() {
    Sim.register("resourceloss", function(data) {
      if (data.type === "fury" && data.castInfo && data.castInfo.offensive) {
        var ticks = Sim.random("immortalking_4pc", 1, data.amount / 10, true);
        while (ticks--) {
          Sim.reduceCooldown("wrathoftheberserker", 180);
          Sim.reduceCooldown("calloftheancients", 180);
        }
      }
    });
  };
  affixes.set_immortalking_6pc = function() {
    Sim.after(60, function check() {
      if (Sim.getBuff("wrathoftheberserker") && Sim.getBuff("calloftheancients")) {
        Sim.addBuff("immortalking_6pc", {dmgmul: 1500}, {duration: 72});
      }
      Sim.after(60, check);
    });
  };

  affixes.set_earth_2pc = function() {
    Sim.register("resourceloss", function(data) {
      if (data.type === "fury" && data.castInfo && data.castInfo.offensive) {
        var ticks = Sim.random("earth_2pc", 1, data.amount / 30, true);
        if (ticks) {
          Sim.reduceCooldown("earthquake", ticks * 60);
          Sim.reduceCooldown("avalanche", ticks * 60);
          Sim.reduceCooldown("leap", ticks * 60);
          Sim.reduceCooldown("groundstomp", ticks * 60);
        }
      }
    });
  };
  affixes.set_earth_4pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "leap" && !data.triggered) {
        Sim.cast("earthquake", undefined, "soft");
      }
    });
  };
  affixes.set_earth_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["earthquake", "avalanche", "leap", "groundstomp", "ancientspear", "seismicslam"], percent: 5600}});
  };

  affixes.set_wastes_2pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["rend"], percent: 500}});
  };
  affixes.set_wastes_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["whirlwind"], percent: 3000}});
  };

  affixes.set_jadeharvester_4pc = function() {
    Sim.register("oncast", function(data) {
      if ((data.skill === "haunt" || data.skill === "locustswarm") && !data.triggered) {
        Sim.reduceCooldown("soulharvest", 60);
      }
    });
  };

  affixes.set_raekor_4pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["furiouscharge"], percent: 1000}});
  };
  affixes.set_raekor_6pc = function() {
    Sim.register("oncast", function(data) {
      if (data.skill === "furiouscharge") {
        Sim.addBuff("raekor_6pc", undefined, {maxstacks: 100});
      } else if (data.cost && data.resource === "fury") {
        var stacks = Math.min(5, Sim.getBuff("raekor_6pc"));
        if (stacks) {
          Sim.removeBuff("raekor_6pc", stacks);
          return {percent: 2800 * stacks};
        }
      }
    });
  };

  affixes.set_danetta_2pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["vault"], percent: 800}});
  };

  affixes.set_endlesswalk_2pc = function() {
    // we're standing still
    var bar = 0;
    if (Sim.params.set_endlesswalk_2pc && Sim.params.set_endlesswalk_2pc[0]) {
      bar = (Sim.params.set_endlesswalk_2pc[0][0] || 0);
    }
    Sim.addBaseStats({dmgmul: (5 - bar) * 20, dmgred: bar * 10});
  };

  affixes.set_nightmares_2pc = function() {
    for (var id in Sim.stats) {
      if (Sim.stats[id] && id.indexOf("set_") === 0 && id !== "set_nightmares_2pc") {
        return;
      }
    }
    Sim.addBaseStats({dmgmul: 100 * Sim.stats.info.ancients, dmgred: 4 * Sim.stats.info.ancients});
  };

  affixes.set_shadow_2pc = function() {
    var mh = Sim.stats.info.mainhand.type;
    if (mh && mh !== "bow" && mh !== "crossbow" && mh !== "handcrossbow") {
      Sim.addBaseStats({dmgmul: 1200});
    }
  };

  affixes.set_invoker_2pc = function() {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && (data.castInfo.skill === "punish" || data.castInfo.skill === "slash") && data.castInfo.user && !data.castInfo.user.invoker_2pc) {
        Sim.addBuff("invoker_2pc", {thorns_percent: 140}, {maxstacks: 25, duration: 120, refresh: false});
        data.castInfo.user.invoker_2pc = true;
      }
    });
    Sim.register("onblock", function() {
      Sim.addBuff("invoker_2pc", {thorns_percent: 140}, {maxstacks: 25, duration: 120, refresh: false});
    });
  };
  affixes.set_invoker_4pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "bombardment") {
        Sim.addBuff("invoker_4pc", {dmgred: 50}, {duration: 1200});
      }
    });
  };
  affixes.set_invoker_6pc = function() {
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && (data.castInfo.skill === "punish" || data.castInfo.skill === "slash") && data.castInfo.user && !data.castInfo.user.invoker_6pc) {
        Sim.damage({thorns: "special", coeff: 54, elem: "phy", srcelem: "none"/*, elem: "phy", skill: data.castInfo.skill*/});
        data.castInfo.user.invoker_6pc = true;
      }
    });
  };

})();
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
        if (data.castInfo.cost) {
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("restraint", {dmgmul: 50}, {duration: 300});
        } else if (data.castInfo.generate !== undefined) {
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("focus", {dmgmul: 50}, {duration: 300});
        }
      }
    });
  };

  affixes.set_istvan_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.cost && data.resource !== "disc") {
        Sim.addBuff("istvan", {ias: 6}, {duration: 5, maxstacks: 5});
      }
    });
  };

  affixes.set_talrasha_2pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_2pc_fire", "col": "tal_2pc_cold", "arc": "tal_2pc_arcane", "lit": "tal_2pc_lightning"};
    var runes = {"fir": "a", "col": "c", "arc": "d", "lit": "e"};
    Sim.register("onhit", function(data) {
      if (data.elem && elems[data.elem] && data.castInfo && data.castInfo.skill && !data.castInfo.triggered) {
        if (!Sim.getBuff(elems[data.elem])) {
          Sim.addBuff(elems[data.elem], undefined, {duration: 480});
          Sim.cast("meteor", runes[data.elem]);
        }
      }
    });
  };

  affixes.set_talrasha_6pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_6pc_fire", "col": "tal_6pc_cold", "arc": "tal_6pc_arcane", "lit": "tal_6pc_lightning"};
    Sim.register("oncast", function(data) {
      if (data.offensive && data.elem && elems[data.elem]) {
        if (!Sim.getBuff(elems[data.elem])) {
          Sim.addBuff(elems[data.elem], undefined, {duration: 360});
          for (var id in elems) {
            Sim.refreshBuff(elems[id], 360);
          }
          Sim.addBuff("tal_6pc", {dmgmul: 150}, {maxstacks: 4, duration: 360});
        }
      }
    });
  };

  affixes.set_firebird_4pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    Sim.register("onhit", function(data) {
      if (data.elem === "fir" && data.triggered !== "set_firebird_4pc" && data.castInfo && data.castInfo.user) {
        var counter = data.castInfo.user.firebird_4pc;
        if (!counter || counter < 3) {
          Sim.damage({type: "area", range: 10, elem: "fir", coeff: 4, count: Math.min(3 - (counter || 0), data.targets)});
          data.castInfo.user.firebird_4pc = Math.min(3, (counter || 0) + data.targets);
        }
      }
    });
  };

  affixes.set_firebird_6pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    function fb_ontick(data) {
      Sim.damage({targets: data.targets, elem: "fir", coeff: data.coeff / 4});
    }
    function fb_onapply(data) {
      if (data.coeff >= 30) {
        Sim.refreshBuff("firebird_6pc", "infinite");
      }
    }
    function fb_onrefresh(data, newdata) {
      data.coeff = Math.min(30, data.coeff + newdata.coeff);
      data.targets = Math.max(data.targets, Math.ceil(newdata.targets));
      fb_onapply(data);
    }
    Sim.register("onhit", function(data) {
      if (data.elem === "fir" && data.triggered !== "set_firebird_6pc") {
        var coeff = data.damage / Sim.stats.info.mainhand.wpnphy.max / Sim.stats.info.critfactor /
          (1 + 0.01 * (Sim.stats.dmgfir || 0)) / 3.03;
        Sim.addBuff("firebird_6pc", undefined, {data: {coeff: coeff, targets: data.targets},
          duration: 180, tickrate: 15, onapply: fb_onapply, onrefresh: fb_onrefresh, ontick: fb_ontick});
      }
    });
  };

  affixes.set_vyr_6pc = function() {
    Sim.register("onhit", function(data) {
      var skill = (data.castInfo && data.castInfo.skill && Sim.skills[data.castInfo.skill]);
      if (skill && skill.shift === "archon" && data.castInfo.user) {
        var counter = data.castInfo.user.vyr_6pc;
        if (!counter || counter < 3) {
          var hits = Math.min(3 - (counter || 0), Math.ceil(data.targets));
          var buffs = {damage: 6};
          if (Sim.stats.leg_fazulasimprobablechain) {
            buffs.ias = 1;
            buffs.armor_percent = 1;
            buffs.resist_percent = 1;
          }
          Sim.addBuff("archon_stacks", buffs, {maxstacks: 9999, stacks: hits});
          data.castInfo.user.vyr_6pc = (counter || 0) + hits;
        }
      }
    });
  };

  affixes.set_magnumopus_2pc = function() {
    var skills = ["arcaneorb", "energytwiser", "magicmissile", "shockpulse"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        Sim.reduceCooldown("slowtime", 120);
      }
    });
  };

  affixes.set_magnumopus_6pc = function() {
    var skills = ["arcaneorb", "energytwiser", "magicmissile", "shockpulse"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        if (Sim.getBuff("slowtime")) {
          return {percent: 750};
        }
      }
    });
  };

  affixes.set_chantodo_2pc = function() {
    Sim.after(60, function tick() {
      if (Sim.getBuff("archon")) {
        var stacks = Sim.getBuff("chantodo_2pc");
        Sim.removeBuff("chantodo_2pc");
        Sim.damage({type: "area", range: 30, self: true, coeff: 3.5 + 3.5 * stacks});
      }
      Sim.after(60, tick);
    });
    Sim.register("onhit", function(data) {
      if (!Sim.getBuff("archon") && data.castInfo && data.castInfo.user) {
        var counter = data.castInfo.user.chantodo_2pc;
        if (!counter || counter < 3) {
          var hits = Math.min(3 - (counter || 0), Math.ceil(data.targets));
          Sim.addBuff("chantodo_2pc", undefined, {maxstacks: 20, stacks: hits});
          data.castInfo.user.chantodo_2pc = (counter || 0) + hits;
        }
      }
    });
  };

  affixes.set_natalya_2pc = function() {
    //var cache = {};
    Sim.register("onhit_proc", function(data) {
      if (data.castInfo && data.castInfo.user && (data.castInfo.generate || data.castInfo.cost) && data.castInfo.resource === "hatred") {
        if (!data.castInfo.user.natalya_2pc) {// && cache[data.skill] === undefined || Sim.time >= cache[data.skill]) {
          Sim.reduceCooldown("rainofvengeance", 120);
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
        Sim.addBuff("natalya_6pc", {dmgmul: 400, dmgred: 30}, {duration: 300});
      }
    });
  };

  affixes.set_marauder_4pc = function() {
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
        if (stacks) return {percent: stacks * 100};
      }
    });
  };

  affixes.set_unhallowed_2pc = function() {
    Sim.register("oncast", function(data) {
      if (Sim.skills[data.skill] && Sim.skills[data.skill].signature) {
        Sim.addResource(1, "disc");
      }
    });
  };

  affixes.set_unhallowed_4pc = function() {
    Sim.after(6, function check() {
      if (Sim.getTargets(10, Sim.target.distance) < 0.1) {
        Sim.addBuff("unhallowed_4pc", {damage: 20, dmgred: 20}, {duration: 240});
      }
      Sim.after(6, check);
    });
  };

  affixes.set_unhallowed_6pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate || data.skill === "multishot") {
        return {percent: 15 * (Sim.resources.disc || 0)};
      }
    });
  };

  affixes.set_zunimassa_6pc = function() {
    if (Sim.stats.charClass !== "witchdoctor") return;
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.cost) {
        Sim.addBuff("zunimassa_6pc", {dmgmul: {pet: true, percent: 275}}, {duration: 240});
      }
    });
  };

  affixes.set_helltooth_2pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "wallofzombies") {
        var buffs = {};
        if (Sim.stats.set_helltooth_4pc) {
          buffs.dmgred = 50;
        }
        if (Sim.stats.set_helltooth_6pc) {
          buffs.dmgmul = {
            pet: false,
            skills: ["poisondart", "firebomb", "corpsespiders", "plagueoftoads", "acidcloud", "firebats", "zombiecharger",
              "graspofthedead", "piranhas", "wallofzombies"],
            percent: 800,
          };
        }
        Sim.addBuff("helltooth_2pc", buffs, {
          status: "slowed",
          duration: 601,
          tickrate: 30,
          ontick: {targets: Sim.target.count, elem: "max", coeff: 12.5},
        });
      }
    });
  };

  affixes.set_arachyr_2pc = function() {
    Sim.after(48, function drop() {
      Sim.addBuff(undefined, undefined, {
        status: "slowed",
        duration: 300,
        tickrate: 30,
        tickinitial: 1,
        ontick: {type: "area", range: 15, coeff: 1.5},
      });
      Sim.after(48, drop);
    });
  };
  affixes.set_arachyr_6pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["corpsespiders", "plagueoftoads", "firebats", "hex", "piranhas"], percent: 500}});
  };

  affixes.set_shenlong_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate) {
        return {percent: Sim.resources.spirit};
      }
    });
    Sim.register("updatestats", function(data) {
      if (Sim.getBuff("shenlong_2pc")) {
        data.spiritregen = -65;
      }
    });
    Sim.after(12, function check() {
      if (Sim.resources.spirit >= Sim.stats.maxspirit - 1) {
        Sim.addBuff("shenlong_2pc", {damage: 300}, {});
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
  };

  affixes.set_sunwuko_2pc = function() {
    var list = ["cyclonestrike", "explodingpalm", "lashingtailkick", "tempestrush", "waveoflight"];
    var next = 0;
    Sim.register("oncast", function(data) {
      if (list.indexOf(data.skill) >= 0) {
        if (data.skill === "tempestrush") {
          if (Sim.time < next) return;
          next = Sim.time + Math.floor(100 / Sim.stats.info.aps);
        }
        Sim.after(30, function() {
          Sim.damage({type: "area", range: 15, coeff: 10, elem: "max"});
          if (Sim.stats.set_sunwuko_4pc) {
            Sim.addBuff("sunwuko_4pc", {dmgmul: {
              pet: false,
              skills: ["cyclonestrike", "explodingpalm", "lashingtailkick", "tempestrush", "waveoflight"],
              percent: 500,
            }}, {duration: 180});
          }
        });
      }
    });
  };

  affixes.set_storms_2pc = function() {
    Sim.addBaseStats({dmgmul: {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 300}});
  };
  affixes.set_storms_6pc = function() {
    if (Sim.stats.charClass !== "monk") return;
    Sim.register("oncast", function(data) {
      if (data.generate) {
        Sim.addBuff("storms_6pc", undefined, {duration: 360});
      }
    });
  };

  function ep_explode(data) {
    if (data.castInfo && data.castInfo.rune === "d") {
      Sim.addResource(15 * data.targets);
    }
    if (Sim.stats.leg_gungdogear && Sim.apply_palm) {
      Sim.apply_palm(data.targets);
    }
  }
  affixes.set_uliana_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.generate) {
        data.user.sequence = Sim.getBuff(data.skill);
      }
    });
    Sim.register("onhit", function(data) {
      if (data.user && data.user.sequence === 2 && Sim.apply_palm) {
        Sim.apply_palm(data.targets);
        delete data.user.sequence;
      }
    });
  };
  affixes.set_uliana_6pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && data.castInfo.skill === "sevensidedstrike" && Sim.getBuff("explodingpalm")) {
        var stack = Sim.removeBuff("explodingpalm", 1);
        if (!stack || !stack.castInfo) return;
        var damage = {type: "area", range: 15, coeff: 27.7, onhit: ep_explode};
        switch (stack.castInfo.rune) {
        case "b": damage.coeff = 63.05; break;
        case "e": damage.coeff = 32.6 / 6; damage.count = 6; break;
        }
        if (Sim.stats.leg_thefistofazturrasq) {
          damage.coeff *= 1 + 0.01 * Sim.stats.leg_thefistofazturrasq;
        }
        Sim.pushCastInfo(stack.castInfo);
        Sim.damage(damage);
        Sim.popCastInfo();
      }
    });
  };

})();
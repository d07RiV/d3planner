DiabloCalc.itemaffixes = {
  leg_goldwrap: {
    params: [{min: 0, max: 1000000, val: 0, name: "Gold", inf: true}],
    buffs: function(value, stats) {return {armor: this.params[0].val};},
  },
  leg_madmonarchsscepter: {
    info: {"Damage": {elem: "psn", coeff: "$1/100"}},
  },
  leg_stormcrow: {
    info: {"Damage": {elem: "fir", coeff: "1.15"}},
  },
  leg_sanguinaryvambraces: {
    info: {"Damage": {thorns: "normal", coeff: 10, elem: "phy"}},
  },
  leg_bootsofdisregard: {
    params: [{min: 0, max: 4, name: "Stacks"}],
    buffs: function(value, stats) {return {regen: 10000 * this.params[0].val};},
  },
  leg_overwhelmingdesire: {
    active: false,
    buffs: {dmgtaken: 35},
  },
  leg_pridesfall: {
    active: false,
    buffs: {rcr: 30},
  },
  leg_deathsbargain: {
    info: {"DPS": "regen*$1/100"},
  },
  leg_insatiablebelt: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {return {life: this.params[0].val * 5};},
  },
  leg_soulsmasher: {
    info: {"Damage": "laek*$1/100"},
  },
  leg_firewalkers: {
    info: {"Damage": {elem: "fir", coeff: 1, total: true}},
  },
  leg_firewalkers_p2: {
    info: {"Damage": {elem: "fir", coeff: "$1/100", total: true}},
  },
  leg_hellfirering: {
    info: {"Damage": {elem: "fir", coeff: 12, total: true}},
  },
  leg_bandofhollowwhispers: {
    info: {"DPS": {elem: "arc", aps: true, coeff: 1, total: true}},
  },
  leg_rogarshugestone: {
    params: [{min: 0, max: 100, val: 100, name: "Health", percent: true}],
    buffs: function(value, stats) {
      return {regen_bonus: value[0] * (1 - 0.01 * this.params[0].val)};
    },
  },
  leg_andarielsvisage: {
    info: {"Damage": {elem: "psn", coeff: "$1/100"}},
  },
  leg_andarielsvisage_p2: {
    info: {"Damage": {elem: "psn", coeff: "$1/100"}},
  },
  leg_themindseye: {
    active: false,
    buffs: function(value, stats) {
      return {spiritregen: value[0]};
    },
  },
  leg_poxfaulds: {
    info: {"DPS": {elem: "psn", coeff: "$1/100", total: true}},
  },
  leg_poxfaulds_p2: {
    info: {"DPS": {elem: "psn", coeff: "$1/100", total: true}},
  },
  leg_hexingpantsofmryan: {
    active: false,
    buffs: {damage: 25, resourcegen: 25},
  },
  leg_moonlightward: {
    info: {"Damage": {elem: "arc", coeff: "$1/100"}},
  },
  leg_defenderofwestmarch: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_defenderofwestmarch_p2: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_hack: {
    info: {"Damage": {thorns: "normal", coeff: "$1/100", elem: "phy"}},
  },
  leg_wizardspike: {
    info: {"Explosion Damage": {elem: "col", coeff: 3.93, skill: "arcaneorb"}, "Projectile Damage": {elem: "col", coeff: 2.62, skill: "arcaneorb"}, "Shard Damage": {elem: "col", coeff: 1.28, skill: "arcaneorb"}},
  },
  leg_odynson: {
    info: {"Damage": {elem: "lit", coeff: 1.2}},
  },
  leg_fulminator: {
    info: {"DPS": {elem: "lit", coeff: "$1/100", total: true}},
  },
  leg_rimeheart: {
    info: {"Damage": {elem: "col", coeff: 100}},
  },
  leg_thunderfury: {
    info: {"Damage": {elem: "lit", coeff: "$1/100"}},
  },
  leg_sever: {
    info: {"Damage Modifier": "%(100+info.primary)*(1+0.01*chd)"},
  },
  leg_azurewrath: {
    info: {"DPS": {coeff: "$1/100", total: true}},
  },
  leg_azurewrath_p3: {
    info: {"DPS": {coeff: "$1/100", elem: "hol", total: true}},
  },
  leg_shardofhate: {
    info: {"Freezing Skull Damage": {elem: "col", coeff: "$1/100"},
           "Poison Nova Damage": {elem: "psn", coeff: "$1/100"},
           "Charged Bolt Damage": {elem: "lit", coeff: "$1/100"}},
  },
  leg_demonmachine: {
    info: {"Damage": {elem: "lit", coeff: 1}},
  },
  leg_pusspitter: {
    info: {"DPS": {elem: "psn", aps: true, coeff: 1, total: true}},
  },
  leg_odysseysend: {
    check: true,
    active: true,
    buffs: function(value, stats) {
      if (stats.skills.entanglingshot) {
        return {dmgtaken: value[0]};
      }
    },
  },
  leg_cluckeye: {
    info: {"Damage": {elem: "phy", coeff: 5}},
  },
  leg_balefulremnant: {
    info: {"Avatar Damage": {elem: "phy", pet: true, coeff: 1, skill: "phalanx"}, "Avatar DPS": {sum: true, "Avatar Damage": {pet: 60, speed: 1}}},
  },
  leg_deathwatchmantle_p2: {
    info: {"Min Damage": {elem: "phy", coeff: 7.5},
           "Max Damage": {elem: "phy", coeff: 9.5}},
  },
  leg_blackfeather: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_cinderswitch: {
    info: {"Damage": {elem: "fir", coeff: 2.5}},
  },
  leg_schaefershammer: {
    info: {"DPS": {elem: "lit", coeff: "$1/100", total: true}},
  },
  leg_schaefershammer_p2: {
    info: {"DPS": {elem: "lit", coeff: "$1/100", total: true}},
  },
  leg_wormwood: {
    info: function(value, stats) {
      var rune = (stats.skills.locustswarm || "x");
      var res = DiabloCalc.skills.witchdoctor.locustswarm.info(rune, stats);
      delete res["Cost"];
      if (res["Damage"]) res["Damage"].skill = "locustswarm";
      if (res["Cloud Damage"]) res["Cloud Damage"].skill = "locustswarm";
      return res;
    },
  },
  leg_scourge: {
    info: {"Damage": {coeff: 20}},
  },
  leg_stalgardsdecimator: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_maximus: {
    info: {"Demon Damage": {elem: "fir", pet: true, coeff: 1}, "Demon DPS": {sum: true, "Demon Damage": {pet: 96}},
           "Chain Tick Damage": {elem: "fir", pet: true, aps: true, coeff: 1.3}, "Chain DPS": {sum: true, "Chain Tick Damage": {aps: 5}}},
  },
  leg_flyingdragon: {
    active: false,
    buffs: function(value, stats) {
      return {weaponaps_percent: 100};
    },
  },
  leg_harringtonwaistguard: {
    active: false,
    buffs: function(value, stats) {
      return {damage: value[0]};
    },
  },
  leg_razorstrop: {
    info: {"Damage": {elem: "fir", coeff: "$1/100"}},
  },
  leg_sashofknives: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_sashofknives_p2: {
    info: {"Damage": {elem: "phy", coeff: "$1/100"}},
  },
  leg_seborsnightmare: {
    info: {"Damage": {elem: "col", coeff: 40, skill: "haunt"}},
  },
  leg_seborsnightmare_p2: {
    info: {"Damage": {elem: "col", coeff: 40, skill: "haunt"}},
  },
  leg_thundergodsvigor: {
    info: {"Damage": {elem: "lit", coeff: "$1/100"}},
  },
  leg_strongarmbracers: {
    active: false,
    buffs: function(value, stats) {
      return {dmgtaken: value[0]};
    },
  },
/*  leg_carnevil: {
    info: function(value, stats) {
      if (!stats.skills.fetisharmy && !stats.passives.fetishsycophants && !stats.leg_beltoftranscendence) {
        return {"Tip": "you might want to summon some fetishes."};
      }

      var damage = {elem: "psn", pet: true, aps: true, coeff: 1.3, skill: "poisondart"};
//      if (stats.skill_witchdoctor_poisondart) {
//        damage.percent = {"Skill damage": {"Dart %": stats.skill_witchdoctor_poisondart}};
//      }

      var res = {};
      var total = {sum: true};
      if (stats.skills.fetisharmy) {
        res["Fetish Army Damage"] = $.extend(true, {percent: {"Army %": stats.skill_witchdoctor_fetisharmy}}, damage);
        var count;
        switch (stats.skills.fetisharmy) {
        case "b": count = 8; break;
        case "c": count = 6; break;
        case "e": count = 7; break;
        default: count = 5;
        }
        total["Fetish Army Damage"] = {speed: 1, count: count};
      }
      if (stats.passives.fetishsycophants || stats.leg_beltoftranscendence) {
        res["Sycophants Damage"] = $.extend({}, damage);
        total["Sycophants Damage"] = {speed: 1, count: DiabloCalc.passives.witchdoctor.fetishsycophants.params[0].val};
      }
      res["Total Fetish DPS"] = total;
      return res;
    },
  },*/
  leg_calamity: {
    check: true,
    active: true,
    buffs: function(value, stats) {
      if (!stats.skills.markedfordeath) {
        return {dmgtaken: 15};
      }
    },
  },

  set_istvan_2pc: {
    active: false,
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      var stacks = this.params[0].val;
      return {ias: 6 * stacks, dmgmul: 6 * stacks, armor_percent: 6 * stacks};
    },
  },
  set_talrasha_2pc: {
    active: true,
    activetip: "3 or fewer targets",
    activeshow: function(rune, stats) {
      return !!stats.leg_nilfursboast;
    },
    info: function(value, stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal2");
      var res = {};

      var total = 0;
      var total = {};
      if (elems.fir) {
        res["Fire Damage"] = {elem: "fir", coeff: 16.48, addcoeff: [6.25], total: 0, skill: "meteor"};
        total["Fire Damage"] = {};
      }
      if (elems.col) {
        res["Cold Damage"] = {elem: "col", coeff: 7.4, addcoeff: [2.35], total: 0, skill: "meteor"};
        total["Cold Damage"] = {};
      }
      if (elems.lit) {
        res["Lightning Damage"] = {elem: "lit", coeff: 7.4, addcoeff: [2.35], total: 0, skill: "meteor"};
        total["Lightning Damage"] = {};
      }
      if (elems.arc) {
        res["Arcane Damage"] = {elem: "arc", coeff: 7.4, addcoeff: [2.35], total: 0, skill: "meteor"};
        //res["Maximum Arcane Damage"] = {elem: "arc", coeff: 7.4, addcoeff: [[0.2, stats.maxap], 2.35], total: 1, skill: "meteor"};
        total["Arcane Damage"] = {};
      }
      if (!$.isEmptyObject(total)) {
        for (var e in total) {
          total[e].cd = 8;
          total[e].cdr = false;
        }
        var pct;
        if (stats.leg_nilfursboast_p2) {
          pct = {};
          pct[DiabloCalc.itemById.P41_Unique_Boots_01.name] = (this.active ? stats.leg_nilfursboast_p2 : 200);
        } else if (stats.leg_nilfursboast) {
          pct = {};
          pct[DiabloCalc.itemById.P2_Unique_Boots_01.name] = (this.active ? stats.leg_nilfursboast : 100);
        }
        for (var r in res) {
          res[r].exclude = ["arcanedynamo"];
          res[r].percent = pct;
        }
        total.sum = true;
        res["DPS"] = total;
      }
      return res;
    },
  },
  set_talrasha_4pc: {
    active: true,
    info: function(value, stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal4");
      var list = [];
      for (var e in elems) {
        list.push(DiabloCalc.elements[e]);
      }
      if (list.length) {
        return {"Active Elements": list.join(", ")};
      }
    },
    params: [{min: 0, max: function(stats) {
      return Object.keys(DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal4")).length;
    }, name: "Stacks"}],
    buffs: function(value, stats) {
      return {resist_percent: 25 * this.params[0].val};
    },
  },
  set_talrasha_6pc: {
    active: true,
    info: function(value, stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal6");
      var list = [];
      for (var e in elems) {
        list.push(DiabloCalc.elements[e]);
      }
      if (list.length) {
        return {"Active Elements": list.join(", ")};
      }
    },
    params: [{min: 0, max: function(stats) {
      return Object.keys(DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal6")).length;
    }, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: 750 * this.params[0].val};
    },
  },
  set_firebird_2pc: {
    info: {"Meteor Damage": {elem: "fir", coeff: 16.48, addcoeff: [6.25], total: true, skill: "meteor"}},
  },
  set_firebird_4pc: {
    params: [{min: 0, max: 3, name: "Stacks", buffs: false}],
    info: function(value, stats) {
      if (this.params[0].val) {
        return {"DPS": {elem: "fir", coeff: 10 * this.params[0].val, total: true}};
      }
    },
  },
  set_firebird_6pc: {
    params: [{min: 0, max: 20, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: this.params[0].val * 120, dmgred: 3 * this.params[0].val};
    },
  },
  set_sunwuko_2pc: {
    buffs: function(value, stats) {
      if (!DiabloCalc.skills || !DiabloCalc.skills.monk) return;
      var stacks = DiabloCalc.skills.monk.sweepingwind.params[0].val;
      if (stacks) return {dmgred: 50};
    },
  },
  set_sunwuko_4pc: {
    info: function(value, stats) {
      if (!DiabloCalc.skills || !DiabloCalc.skills.monk) return;
      var stacks = DiabloCalc.skills.monk.sweepingwind.params[0].val;
      return {"Damage": {elem: "max", coeff: 10 * stacks}};
    },
  },
  set_sunwuko_6pc: {
    active: true,
    buffs: {dmgmul: {pet: false, skills: ["lashingtailkick", "tempestrush", "waveoflight"], percent: 3000}},
  },
  set_roland_4pc: {
    buffs: {dmgmul: {skills: ["sweepattack", "shieldbash"], percent: 750}},
  },
  set_roland_6pc: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {return {ias: 50 * this.params[0].val, dmgred: 10 * this.params[0].val};},
  },

  leg_skysplitter: {
    info: {"Damage": {elem: "lit", coeff: 1.8}},
  },
  leg_skysplitter_p2: {
    info: {"Min Damage": {elem: "lit", coeff: 6},
           "Max Damage": {elem: "lit", coeff: 7.5}},
  },

  leg_brokenpromises: {
    info: function(value, stats) {
      var p = 1 - 0.01 * stats.final.chc;
      return {"Average Hits to Proc": DiabloCalc.formatNumber((Math.pow(p, -5) - 1) / (1 - p), 2)};
    },
    active: false,
    buffs: {extrachc: 100},
  },
  leg_enviousblade: {
    active: false,
    buffs: {extrachc: 100},
  },
  leg_arcstone: {
    info: {"Damage": {elem: "lit", coeff: "$1/100"}},
  },
  leg_conventionofelements: {
    active: false,
    info: function(value, stats) {
      var elems = ["arc", "col", "fir", "hol", "lit", "phy", "psn"];
      var rot = [];
      for (var i = 0; i < elems.length; ++i) {
        if (DiabloCalc.stats["dmg" + elems[i]].classes && DiabloCalc.stats["dmg" + elems[i]].classes.indexOf(DiabloCalc.charClass) < 0) continue;
        if (elems[i] == "col" && DiabloCalc.charClass == "crusader") continue;
        rot.push(DiabloCalc.elements[elems[i]]);
      }
      if (rot.length) {
        return {"Rotation": rot.join(", ")};
      }
    },
    buffs: function(value, stats) {
      var elems = ["arc", "col", "fir", "hol", "lit", "phy", "psn"];
      var rot = [];
      for (var i = 0; i < elems.length; ++i) {
        if (DiabloCalc.stats["dmg" + elems[i]].classes && DiabloCalc.stats["dmg" + elems[i]].classes.indexOf(DiabloCalc.charClass) < 0) continue;
        if (elems[i] == "col" && DiabloCalc.charClass == "crusader") continue;
        rot.push(elems[i]);
      }
      if (rot.length) {
        return {dmgmul: {name: DiabloCalc.itemById.P2_Unique_Ring_04.name, elems: rot, percent: value[0]}};
      }
    },
  },
  leg_corruptedashbringer: {
    info: {"Skeleton Explosion Damage": {elem: "phy", coeff: 10}, "Burn Damage": {elem: "hol", coeff: "$1/100", total: true}},
  },
  leg_ivorytower: {
    info: function(value, stats) {
      var res = {"Damage": {elem: "hol", coeff: 9.6, skill: "heavensfury"}};
      if (stats.leg_fateofthefell) {
        res["Total Damage"] = {sum: true, "Damage": {count: 3}};
      }
      return res;
    },
  },
  set_bastionsofwill_2pc: {
    params: [{min: 0, max: 2, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {percent: [0, 50, 125][this.params[0].val]}};
    },
  },
  leg_oculusring: {
    active: false,
    buffs: function(value, stats) {
      return {damage: value[0]};
    },
  },
  leg_oculusring_p2: {
    active: false,
    buffs: function(value, stats) {
      return {dmgmul: value[0]};
    },
  },
  set_immortalking_6pc: {
    active: true,
    buffs: {dmgmul: {percent: 400}},
  },
  leg_spiritguards: {
    active: false,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  leg_wrapsofclarity: {
    active: false,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  set_natalya_4pc: {
    buffs: {dmgmul: {skills: ["rainofvengeance"], percent: 100}},
  },
  set_natalya_6pc: {
    active: true,
    buffs: {dmgmul: {percent: 500, pet: false}, dmgred: 60},
  },
  set_zunimassa_4pc: {
    info: function(value, stats) {
      var count = 0;
      if (stats.skills.fetisharmy) {
        switch (stats.skills.fetisharmy) {
        case "b": count = 8; break;
        case "c": count = 6; break;
        case "e": count = 7; break;
        default: count = 5;
        }
      }
      if (stats.passives.fetishsycophants || stats.leg_beltoftranscendence) {
        count += DiabloCalc.passives.witchdoctor.fetishsycophants.params[0].val;
      }
      if (count) {
        return {"Damage Reduction": (3 * count) + "%"};
      }
    },
    active: true,
    buffs: function(value, stats) {
      var count = 0;
      if (stats.skills.fetisharmy) {
        switch (stats.skills.fetisharmy) {
        case "b": count = 8; break;
        case "c": count = 6; break;
        case "e": count = 7; break;
        default: count = 5;
        }
      }
      if (stats.passives.fetishsycophants || stats.leg_beltoftranscendence) {
        count += DiabloCalc.passives.witchdoctor.fetishsycophants.params[0].val;
      }
      if (count) {
        return {dmgred: 2 * count};
      }
    },
  },
  set_zunimassa_6pc: {
    active: true,
    buffs: {dmgmul: {pet: true, percent: 1500}},
  },
  set_marauder_4pc: {
    buffs: {dmgmul: {skills: ["sentry"], percent: 400}},
  },
  set_marauder_6pc: {
    buffs: function(value, stats) {
      if (stats.skills.sentry || stats.leg_helltrapper) {
        var count = DiabloCalc.skills.demonhunter.sentry.params[0].val;
        return {dmgmul: {list: [
          {pet: false, skills: ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade",
            "chakram", "clusterarrow", "elementalarrow", "impale", "multishot", "vengeance"], percent: 800 * count},
          {skills: ["companion"], percent: 800 * count},
        ]}};
      }
    },
  },
  leg_beltoftranscendence: {
    check: true,
    params: (DiabloCalc.passives&&DiabloCalc.passives.witchdoctor&&DiabloCalc.passives.witchdoctor.fetishsycophants.params||[{min: 0, max: 15, name: "Count", buffs: false,
      show: function(stats) {return !!this.id || !stats.passives.fetishsycophants;}}]),
    info: function(value, stats) {
      if (DiabloCalc.charClass === "witchdoctor" && !stats.passives.fetishsycophants) {
        return DiabloCalc.passives.witchdoctor.fetishsycophants.info.call(this, stats);
      }
    },
  },
  leg_homunculus: {
    check: true,
    info: function(value, stats) {
      if (DiabloCalc.charClass === "witchdoctor" && !stats.skills.summonzombiedogs) {
        return DiabloCalc.skills.witchdoctor.summonzombiedogs.info.call(this, "x", stats);
      }
    },
  },
  leg_homunculus_p2: {
    check: true,
    info: function(value, stats) {
      if (DiabloCalc.charClass === "witchdoctor" && !stats.skills.summonzombiedogs) {
        return DiabloCalc.skills.witchdoctor.summonzombiedogs.info.call(this, "x", stats);
      }
    },
  },
  leg_homunculus_p3: {
    check: true,
    info: function(value, stats) {
      if (DiabloCalc.charClass === "witchdoctor" && !stats.skills.summonzombiedogs) {
        return DiabloCalc.skills.witchdoctor.summonzombiedogs.info.call(this, "x", stats);
      }
    },
  },

  set_magnumopus_6pc: {
    active: true,
    buffs: {dmgmul: {skills: ["arcaneorb", "energytwister", "explosiveblast", "magicmissile", "shockpulse", "spectralblade", "waveofforce"], percent: 2000}},
  },

  set_unhallowed_4pc: {
    active: true,
    buffs: {dmgred: 60, dmgmul: 60},
  },
  set_unhallowed_6pc: {
    params: [{min: 0, max: "maxdisc", name: "Discipline"}],
    buffs: function(value, stats) {
      var skills = ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade", "multishot", "vengeance"];
      if (stats.leg_kridershot) {
        skills.push("elementalarrow");
      }
      if (stats.leg_spinesofseethinghatred) {
        skills.push("chakram");
      }
      return {dmgmul: {skills: skills, percent: this.params[0].val * 40}};
    },
  },

  set_wastes_2pc: {
    buffs: {dmgmul: {skills: ["rend"], percent: 500}},
  },

/*  leg_nilfursboast: {
    active: true,
    activetip: "3 or less targets",
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["meteor"], percent: value[0]}};
    },
    inactive: {dmgmul: {skills: ["meteor"], percent: 100}},
  },
  leg_drakonslesson: {
    active: true,
    activetip: "3 or less targets",
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["shieldbash"], percent: value[0]}};
    },
  },*/
  set_storms_2pc: {
    buffs: {dmgmul: {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 100}},
  },
  set_storms_6pc: {
    active: true,
    buffs: {dmgmul: {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 1250}},
  },
  leg_triumvirate: {
    active: true,
    params: [{min: 0, max: 3, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["arcaneorb"], percent: value[0] * this.params[0].val}};
    },
  },
  leg_triumvirate_p2: {
    active: true,
    params: [{min: 0, max: 3, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["arcaneorb"], percent: value[0] * this.params[0].val}};
    },
  },
  leg_denial: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["sweepattack"], percent: value[0] * this.params[0].val}};
    },
  },
  leg_hellskull: {
    buffs: function(value, stats) {
      if (stats.info.mainhand.slot == "twohand") {
        return {damage: 10};
      }
    },
  },
  leg_taskerandtheo: {
    buffs: function(value, stats) {
      return {petias: value[0]};
    },
  },
  leg_thefurnace: {
    buffs: function(value, stats) {
      return {edmg: value[0]};
    },
  },
  leg_avariceband: {
    params: [{min: 0, max: 30, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      return {pickup: this.params[0].val};
    },
  },
  leg_irontoemudsputters: {
    params: [{min: 0, max: 100, val: 100, name: "Health", percent: true}],
    buffs: function(value, stats) {
      return {extrams: 25 * (1 - 0.01 * this.params[0].val)};
    },
  },
  leg_bloodbrother: {
    active: false,
    activetip: "Include damage bonus",
    buffs: function(value, stats) {
      return {dmgmul: 30, block: value[0]};
    },
    inactive: function(value, stats) {
      return {block: value[0]};
    },
  },
  leg_ancientparthandefenders: {
    params: [{min: 0, max: 20, val: 0, name: "Nearby Enemies"}],
    buffs: function(value, stats) {
      return {dmgred: 100 * (1 - Math.pow(1 - 0.01 * value[0], this.params[0].val))};
    },
  },

  leg_unity: {
    active: false,
    buffs: {dmgred: 50},
  },
  leg_uhkapianserpent: {
    active: true,
    check: true,
    buffs: function(value, stats) {
      if (stats.skills.summonzombiedogs || stats.leg_homunculus || stats.leg_homunculus_p2 || stats.leg_homunculus_p3) {
        return {dmgred: value[0]};
      }
    }
  },
  leg_shimizushaori: {
    active: false,
    buffs: {extrachc: 100},
  },
  leg_warzechianarmguards: {
    active: false,
    buffs: {extrams: 50},
  },

  leg_deathwatchmantle: {
    info: {"Damage": {elem: "phy", coeff: 2}},
  },
  leg_bulkathossweddingband: {
    info: function(value, stats) {
      return {
        "Note": "capped at 0.4% of the enemy current health",
        "Tick Damage": {elem: "phy", coeff: 20, avg: true, total: true},
      };
    },
  },
  leg_beltofthetrove: {
    check: true,
    info: function(value, stats) {
      if (DiabloCalc.charClass !== "crusader") {
        return;
      }
      var rune = (stats.skills.bombardment || "x");
      var res = DiabloCalc.skills.crusader.bombardment.info(rune, stats);
      delete res["Cooldown"];
      res["Damage"].skill = "bombardment";
      if (res["Thorns Damage"]) res["Thorns Damage"].skill = "bombardment";
      if (res["Mine Damage"]) res["Mine Damage"].skill = "bombardment";
      return res;
    },
  },
  leg_visageofgiyua: {
    check: true,
    info: function(value, stats) {
      if (!stats.skills.fetisharmy) {
        return {"Dagger Damage": {elem: "phy", pet: true, aps: true, coeff: 1.8, skill: "fetisharmy"}, "Total DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}}};
      }
    },
  },

  leg_hunterswrath: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade"], percent: value[0]}};
    },
  },
  leg_bracersofthefirstmen: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["hammeroftheancients"], percent: value[0]}};
    },
  },
  leg_theswami: {
    check: true,
    active: true,
    params: [(DiabloCalc.skills&&DiabloCalc.skills.wizard&&DiabloCalc.skills.wizard.archon.params[0]||
      {min: "(leg_fazulasimprobablechain||leg_fazulasimprobablechain_p2)",
       max: "(leg_fazulasimprobablechain||leg_fazulasimprobablechain_p2)+50", val: "min", name: "Stacks", inf: true})],
    //params: [{min: "(leg_fazulasimprobablechain||leg_fazulasimprobablechain_p2)",
    //          max: "(leg_fazulasimprobablechain||leg_fazulasimprobablechain_p2)+50", val: "min", name: "Stacks", inf: true}],
    buffs: function(value, stats) {
      var stacks = this.params[0].val;
      var res = {dmgmul: stacks * 6};
      if (stats.set_vyr_4pc) {
        res.ias = stacks * 1.0;
        res.armor_percent += stacks * 1.0;
        res.resist_percent += stacks * 1.0;
      }
      return res;
    },
  },
  leg_theswami_p3: {
    clone: "leg_theswami",
  },
  set_light_4pc: {
    check: true,
    active: true,
    buffs: function(value, stats) {
      if (stats.skills.fallingsword) {
        return {dmgred: 50};
      }
    },
  },
  set_light_6pc: {
    buffs: {dmgmul: {list: [
      {skills: ["blessedhammer"], percent: 1250},
      {skills: ["fallingsword"], percent: 500},
    ]}},
  },
  set_shenlong_2pc: {
    active: true,
    buffs: {dmgmul: 150},
  },
  set_helltooth_2pc: {
    active: true,
    info: {"Necrosis DPS": {elem: "max", coeff: 15, total: true}},
    buffs: {dmgtaken: 20},
  },
  set_helltooth_4pc: {
    active: true,
    buffs: {dmgred: 60},
  },
  set_helltooth_6pc: {
    buffs: function(value, stats) {
      return {dmgmul: {list: [
        {pet: false, skills: ["poisondart", "plagueoftoads", "firebomb", "acidcloud",
           "firebats", "zombiecharger", "graspofthedead", "piranhas", "wallofdeath"], percent: 1400},
        {skills: ["summonzombiedogs", "gargantuan", "corpsespiders"], percent: 1400},
      ]}};
    },
  },
  set_arachyr_2pc: {
    info: {"DPS": {elem: "max", pet: true, coeff: 8, total: true}},
  },
  set_arachyr_6pc: {
    buffs: {dmgmul: {skills: ["corpsespiders", "plagueoftoads", "firebats", "hex", "locustswarm", "piranhas"], percent: 1500}},
  },
  leg_chilanikschain: {
    check: true,
    active: true,
    buffs: function(value, stats) {
      if (stats.skills.warcry) {
        return {extrams: value[0]};
      }
    },
  },
  leg_jeramsbracers: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["wallofdeath"], percent: value[0]}};
    },
  },
  set_uliana_2pc: {
    check: true,
    info: function(value, stats) {
      if (!stats.skills.explodingpalm) {
        var expl = {};
        if (stats.leg_thefistofazturrasq) {
          expl[DiabloCalc.itemById.Unique_Fist_009_x1.name] = stats.leg_thefistofazturrasq;
        }
        if (stats.leg_thefistofazturrasq_p2) {
          expl[DiabloCalc.itemById.P4_Unique_Fist_009_x1.name] = stats.leg_thefistofazturrasq_p2;
        }
        return {"Palm Damage": {elem: "phy", coeff: 12, total: true, skill: "explodingpalm"},
          "Palm Explosion Damage": {elem: "phy", coeff: 27.7, percent: expl, skill: "explodingpalm"}};
      }
    }
  },
  set_uliana_6pc: {
    buffs: {dmgmul: {skills: ["explodingpalm"], percent: 250}},
  },

  leg_nagelring: {
    info: function(value, stats) {
      return {"Damage": {elem: "max", coeff: 100}, "DPS": {sum: true, "Damage": {divide: value[0]}}};
    },
  },

  set_earth_6pc: {
    buffs: {dmgmul: {skills: ["earthquake", "avalanche", "leap", "groundstomp", "ancientspear", "seismicslam"], percent: 1200}},
  },
  set_raekor_4pc: {
    buffs: {dmgmul: {skills: ["furiouscharge"], percent: 300}},
  },
  set_raekor_6pc: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["hammeroftheancients", "rend", "seismicslam", "whirlwind",
        "ancientspear", "earthquake"], percent: this.params[0].val * 750}};
    },
  },
  set_danetta_2pc: {
    buffs: {dmgmul: {skills: ["vault"], percent: 800}},
  },
  set_inna_6pc: {
    info: function(value, stats) {
      if (!stats.skills.mystically && DiabloCalc.charClass === "monk") {
        var res = DiabloCalc.skills.monk.mystically.info("x", stats);
        for (var id in res) {
          if (res[id].elem) {
            res[id].skill = "mystically";
          }
        }
        return res;
      }
    },
    buffs: function(value, stats) {
      if (DiabloCalc.charClass !== "monk") return;
      var res = {dmgmul: {pet: false, percent: 50 * 5 * (stats.leg_thecrudestboots ? 2 : 1)}};
      if (!stats.skills.mystically) {
        $.extend(res, DiabloCalc.skills.monk.mystically.passive("x", stats));
      }
      return res;
    },
  },
  set_endlesswalk_2pc: {
    params: [{min: 0, max: 5, val: 0, name: "Moving"}],
    buffs: function(value, stats) {
      return {
        dmgred: 10 * this.params[0].val,
        dmgmul: 20 * (5 - this.params[0].val),
      };
    },
  },
  set_nightmares_2pc: {
    buffs: function(value, stats) {
      for (var id in stats.info.sets) {
        if (id === "nightmares" || stats.info.sets[id] <= 1) continue;
        var count = stats.info.sets[id] + (stats.leg_ringofroyalgrandeur ? 1 : 0);
        for (var num in DiabloCalc.itemSets[id].bonuses) {
          if (num <= count) return;
        }
      }
      return {dmgmul: 100 * stats.info.ancients, dmgred: 4 * stats.info.ancients};
    },
  },

  leg_pintospride: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["waveoflight"], percent: value[0]}};
    },
  },

  set_shadow_2pc: {
    buffs: function(value, stats) {
      var mh = stats.info.mainhand.type;
      if (mh && mh !== "bow" && mh !== "crossbow" && mh !== "handcrossbow") {
        return {dmgmul: 1200};
      }
    },
  },

  set_invoker_2pc: {
    params: [{min: 0, max: 25, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      return {thorns_percent: this.params[0].val * 35};
    },
  },
  set_invoker_4pc: {
    active: true,
    buffs: {dmgred: 50},
  },
  set_norvald_2pc: {
    active: false,
    buffs: {dmgmul: 100},
  },

  leg_stringofears: {
    buffs: function(value, stats) {
      return {meleedef: value[0]};
    },
  },

  leg_zoeyssecret: {
    buffs: function(value, stats) {
      if (!stats.skills.companion) return;
      var count = (stats.skills.companion === "e" ? 2 : 1);
      if (stats.set_marauder_2pc) count = 7;
      if ((stats.skills.companion === "c" || stats.set_marauder_2pc) && stats.leg_thecloakofgarwulf) count += 2;
      return {dmgred: count * value[0]};
    },
  },
  leg_riveradancers: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["lashingtailkick"], percent: value[0]}};
    },
  },

  leg_cesarsmemento: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["tempestrush"], percent: value[0]}};
    },
  },
  leg_bindingsofthelessergods: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["mystically"], percent: value[0]}};
    },
  },
  leg_lastbreath: {
    buffs: function(value, stats) {
      return {skill_witchdoctor_massconfusion_cooldown: value[0]};
    },
  },
  leg_aquilacuirass: {
    active: true,
    buffs: {dmgred: 50},
  },
  leg_heartofiron: {
    buffs: function(value, stats) {
      return {vit_to_thorns: value[0]};
    },
  },
  leg_warhelmofkassar: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["phalanx"], percent: value[0]}};
    },
  },
  leg_oathkeeper: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["bash", "cleave", "frenzy", "weaponthrow"], percent: value[0]}};
    },
  },
  leg_vilehive: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["locustswarm"], percent: value[0]}};
    },
  },
  leg_thingofthedeep: {
    buffs: {pickup: 20},
  },
  leg_hammerjammers: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["blessedhammer"], percent: value[0]}};
    },
  },
  leg_ringofemptiness: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: value[0]};
    },
  },
  leg_ringofemptiness_p2: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: value[0]};
    },
  },
  leg_elusivering: {
    active: true,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
//  leg_justicelantern: {
//    buffs: function(value, stats) {
//      return {dmgred: (stats.block || 0) * value[0] * 0.01};
//    },
//  },
  leg_bandofmight: {
    active: true,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  leg_lefebvressoliloquy: {
    active: true,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  leg_mantleofchanneling: {
    active: true,
    buffs: function(value, stats) {
      if (stats.skills.whirlwind || stats.skills.rapidfire || stats.skills.strafe ||
          stats.skills.tempestrush || stats.skills.firebats || stats.skills.arcanetorrent ||
          stats.skills.disintegrate || stats.skills.rayoffrost) {
        return {dmgred: 25, dmgmul: value[0]};
      }
    },
  },
  leg_thethreehundredthspear: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["weaponthrow", "ancientspear"], percent: value[0]}};
    },
  },
  leg_akkhansleniency: {
    params: [{min: 0, max: 50, inf: true, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["blessedshield"], percent: this.params[0].val * value[0]}};
    },
  },
  leg_lordgreenstonesfan: {
    params: [{min: 0, max: 30, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["fanofknives"], percent: this.params[0].val * value[0]}};
    },
  },
  leg_lordgreenstonesfan_p2: {
    params: [{min: 0, max: 30, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["fanofknives"], percent: this.params[0].val * value[0]}};
    },
  },
  leg_shieldoffury: {
    params: [{min: 0, max: 10, inf: true, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["heavensfury"], percent: this.params[0].val * value[0]}};
    },
  },
  leg_thetwistedsword: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["energytwister"], percent: this.params[0].val * value[0]}};
    },
  },
  leg_deathwish: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: value[0]};
    },
  },
  leg_maskofjeram: {
    buffs: function(value, stats) {
      return {petdamage: value};
    },
  },
  leg_depthdiggers: {
    buffs: function(value, stats) {
      if (stats.charClass === "wizard" && !stats.leg_theshameofdelsere) return;
      var list = [];
      if (stats.charClass === "witchdoctor") {
        var skills = DiabloCalc.getStats().skills;
        if (skills.poisondart === "d") list.push("poisondart");
        if (skills.corpsespiders === "a") list.push("corpsespiders");
        if (skills.plagueoftoads === "d") list.push("plagueoftoads");
        if (DiabloCalc.getStats().leg_mordulluspromise) list.push("firebomb");
      } else {
        for (var skill in DiabloCalc.skills[stats.charClass]) {
          if (DiabloCalc.skills[stats.charClass][skill].category === "primary") {
            list.push(skill);
          }
        }
      }
      return {dmgmul: {skills: list, percent: value[0]}};
    },
  },

  leg_orbofinfinitedepth: {
    params: [{min: 0, max: 4, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: this.params[0].val * value[0], dmgred: 15 * this.params[0].val};
    },
  },
  leg_fragmentofdestiny: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["spectralblade"], percent: value[0]}};
    },
  },

  leg_magefist: {
    buffs: function(value, stats) {
      return {dmgfir: value[0]};
    },
  },
  leg_frostburn_p2: {
    buffs: function(value, stats) {
      return {dmgcol: value[0]};
    },
  },
  leg_skullgrasp_p2: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["whirlwind"], percent: value[0]}};
    },
  },
  leg_johannasargument: {
    buffs: {dmgmul: {skills: ["blessedhammer"], percent: 100}},
  },
  leg_bakulijunglewraps: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["firebats"], percent: value[0]}};
    },
  },
  leg_swamplandwaders: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["sacrifice"], percent: value[0]}};
    },
  },
  leg_theflowofeternity_p2: {
    buffs: {dmgmul: {skills: ["sevensidedstrike"], percent: 100}},
  },
  leg_fleshrake: {
    params: [{min: 0, max: 5, name: "Stacks"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["dashingstrike"], percent: value[0] * this.params[0].val}};
    },
  },
  leg_crystalfist: {
    active: false,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  leg_haloofkarini: {
    active: false,
    buffs: function(value, stats) {
      return {dmgred: value[0]};
    },
  },
  leg_ingeom: {
    active: false,
    buffs: function(value, stats) {
      return {cdrint: value[0]};
    },
  },
  leg_cordoftherighteous: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["fistoftheheavens"], percent: value[0]}};
    },
  },
  leg_girdleofgiants: {
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["earthquake"], percent: value[0]}};
    },
  },

  leg_starfire: {
    params: [{min: 0, max: 40, name: "Distance"}],
    buffs: function(value, stats) {
      return {dmgmul: {elems: ["lit"], percent: this.params[0].val * value[0] / 10}};
    },
  },
  leg_rechelsringoflarceny: {
    active: false,
    buffs: function(value, stats) {
      return {extrams: value[0]};
    },
  },

};

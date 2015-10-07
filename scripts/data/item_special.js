DiabloCalc.itemaffixes = {
  leg_goldwrap: {
    params: [{min: 0, max: 1000000, val: 0, name: "Gold", inf: true}],
    buffs: function(value, stats) {return {armor: this.params[0].val};},
  },
  leg_madmonarchsscepter: {
    info: {"Damage": {elem: "psn", coeff: "$1/100"}},
  },
  leg_sanguinaryvambraces: {
    info: {"Damage": "thorns*10"},
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
  leg_gyananakashu: {
    info: {"Damage": {elem: "fir", coeff: "$1/100"}},
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
    info: {"Damage": "info.thorns*$1/100*(1+0.01*dmgtaken)"},
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
    info: {"Avatar Damage": {elem: "phy", pet: true, coeff: 1}, "Avatar DPS": {sum: true, "Avatar Damage": {pet: 60, speed: 1}}},
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
      var res = {"DPS": {elem: "psn", coeff: 10.4, divide: {"Duration": 8}, skill: "locustswarm"}};
      if (stats.leg_quetzalcoatl) {
        var pct = {};
        pct[DiabloCalc.itemById.Unique_VoodooMask_005_x1.name] = 100;
        res["DPS"].percent = pct;
      }
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
      return {weaponaps: 1.15};
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
    active: true,
    buffs: function(value, stats) {
      return {dmgtaken: 20};
    },
  },

  set_istvan_2pc: {
    active: false,
    buffs: {ias: 30},
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
        res["Maximum Arcane Damage"] = {elem: "arc", coeff: 7.4, addcoeff: [[0.2, stats.maxap], 2.35], total: 1, skill: "meteor"};
        total["Maximum Arcane Damage"] = {};
      }
      if (!$.isEmptyObject(total)) {
        for (var e in total) {
          total[e].cd = 8;
          total[e].cdr = false;
        }
        var pct;
        if (stats.leg_nilfursboast) {
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
    buffs: function(value, stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal4");
      var res = {};
      for (var e in elems) {
        res["res" + e + "_percent"] = 100;
      }
      if (!$.isEmptyObject(res)) {
        return res;
      }
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
    buffs: function(value, stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "tal6");
      var count = 0;
      for (var e in elems) {
        count += 1;
      }
      if (count) {
        return {dmgmul: {percent: 150 * count}};
      }
    },
  },
  set_firebird_2pc: {
    info: {"Meteor Damage": {elem: "fir", coeff: 16.48, addcoeff: [6.25], total: true, skill: "meteor"}},
  },
  set_firebird_4pc: {
    info: {"Explosion Damage": {elem: "fir", coeff: 4}},
  },
  set_firebird_6pc: {
    info: function(value, stats) {
      var res = {};
      res["Infinite Threshold"] = {
        value: stats.info.mainhand.wpnphy.max * stats.info.critfactor * (1 + 0.01 * (stats.dmgfir || 0)) * 90.9,
        tip: "Amount of damage needed to reach the infinite DoT effect."
      };
      res["DPS"] = {elem: "fir", coeff: 30, total: true/*, chc: (DiabloCalc.isSkillActive("conflagration") ? -6 : 0)*/};
      return res;
    },
  },
  set_sunwuko_2pc: {
    info: {"Clone Explosion Damage": {elem: "max", coeff: 10}},
  },
  set_sunwuko_4pc: {
    active: true,
    buffs: {dmgmul: {pet: false, skills: ["cyclonestrike", "explodingpalm", "lashingtailkick", "tempestrush", "waveoflight"], percent: 500}},
  },
  set_roland_4pc: {
    buffs: {dmgmul: {skills: ["sweepattack", "shieldbash"], percent: 500}},
  },
  set_roland_6pc: {
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(value, stats) {return {ias: 30 * this.params[0].val};},
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
  set_immortalking_6pc: {
    active: true,
    buffs: {dmgmul: {percent: 250}},
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
    buffs: {dmgmul: {percent: 400, pet: false}, dmgred: 30},
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
        return {"Damage Reduction": (2 * count) + "%"};
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
    buffs: {dmgmul: {pet: true, percent: 275}},
  },
  set_marauder_6pc: {
    buffs: function(value, stats) {
      if (stats.skills.sentry || stats.leg_helltrapper) {
        var count = DiabloCalc.skills.demonhunter.sentry.params[0].val;
        return {dmgmul: {pet: false, skills: ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade",
          "chakram", "clusterarrow", "elementalarrow", "impale", "multishot"], percent: 100 * count}};
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

  set_magnumopus_6pc: {
    active: true,
    buffs: {dmgmul: {skills: ["arcaneorb", "energytwister", "magicmissile", "shockpulse"], percent: 750}},
  },

  set_unhallowed_4pc: {
    active: true,
    buffs: {dmgred: 20, dmgmul: 20},
  },
  set_unhallowed_6pc: {
    params: [{min: 0, max: "maxdisc", name: "Discipline"}],
    buffs: function(value, stats) {
      var skills = ["hungeringarrow", "entanglingshot", "bolas", "evasivefire", "grenade", "multishot"];
      if (stats.leg_kridershot) {
        skills.push("elementalarrow");
      }
      if (stats.leg_spinesofseethinghatred) {
        skills.push("chakram");
      }
      return {dmgmul: {skills: skills, percent: this.params[0].val * 15}};
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
    buffs: {dmgmul: {skills: ["fistsofthunder", "deadlyreach", "cripplingwave", "wayofthehundredfists"], percent: 300}},
  },
  set_storms_6pc: {
    active: true,
    buffs: {},
  },
  leg_triumvirate: {
    active: true,
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["arcaneorb"], percent: value[0] * 3}};
    },
  },
  leg_wojahnniassaulter: {
    params: [{min: 0, max: 4, name: "Channeled for"}],
    buffs: function(value, stats) {
      return {dmgmul: {skills: ["rapidfire"], percent: value[0] * this.params[0].val}};
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
      return {damage: 30, block: value[0]};
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
  leg_ukhapianserpent: {
    active: true,
    check: true,
    buffs: function(value, stats) {
      if (stats.skills.summonzombiedogs || stats.leg_homunculus) {
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
      res["Damage"].skill = "bombardment";
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
      {min: "leg_fazulasimprobablechain", max: "leg_fazulasimprobablechain+50", val: "min", name: "Stacks", inf: true})],
    buffs: function(value, stats) {
      if (stats.skills.archon && !DiabloCalc.skills.wizard.archon.active) {
        var stacks = this.params[0].val;
        var res = {damage: stacks * 6};
        if (stats.set_vyr_4pc) {
          res.ias = stacks;
          res.armor_percent += stacks;
          res.resist_percent += stacks;
        }
        return res;
      }
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
      {skills: ["blessedhammer"], percent: 750},
      {skills: ["fallingsword"], percent: 500},
    ]}},
  },
  set_shenlong_2pc: {
    active: true,
    buffs: {dmgmul: 100},
  },
  set_helltooth_2pc: {
    active: true,
    info: {"Necrosis DPS": {elem: "max", coeff: 15, total: true}},
    buffs: {dmgtaken: 20},
  },
  set_helltooth_4pc: {
    active: true,
    buffs: {dmgred: 50},
  },
  set_helltooth_6pc: {
    buffs: function(value, stats) {
      return {dmgmul: {list: [
        {pet: false, skills: ["poisondart", "plagueoftoads", "firebomb", "acidcloud",
           "firebats", "zombiecharger", "graspofthedead", "piranhas", "wallofzombies"], percent: 900},
        {skills: ["summonzombiedogs", "gargantuan", "corpsespiders"], percent: 900},
      ]}};
    },
  },
  set_arachyr_2pc: {
    info: {"DPS": {elem: "max", pet: true, coeff: 8, total: true}},
  },
  set_arachyr_6pc: {
    buffs: {dmgmul: {skills: ["corpsespiders", "plagueoftoads", "firebats", "hex", "locustswarm", "piranhas"], percent: 800}},
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
      return {dmgmul: {skills: ["wallofzombies"], percent: value[0]}};
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
        return {"Palm Damage": {elem: "phy", coeff: 12, total: true, skill: "explodingpalm"},
          "Palm Explosion Damage": {elem: "phy", coeff: 27.7, percent: expl, skill: "explodingpalm"}};
      }
    }
  },

  leg_nagelring: {
    info: function(value, stats) {
      return {"Damage": {elem: "max", coeff: 100}, "DPS": {sum: true, "Damage": {divide: value[0]}}};
    },
  },
};

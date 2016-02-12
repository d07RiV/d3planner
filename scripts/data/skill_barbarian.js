if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.barbarian = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  might: "Might",
  tactics: "Tactics",
  rage: "Rage",
};
DiabloCalc.barbarian = {
  varSpeed: function(stats) {
    switch (stats.info.weaponClass) {
    case "swing": return 57.142834;
    case "thrust": return 56.842068;
    case "swing2h": return 57.272724;
    case "thrust2h": return 57.272724;
    case "staff": return 57.272724;
    case "dualwield": return 57.142834;
    default: return 56.470570;
    }
  },
};
DiabloCalc.skills.barbarian = {
  bash: {
    id: "bash",
    name: "Bash",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      c: "Frostbite",
      a: "Onslaught",
      b: "Punish",
      d: "Instigation",
      e: "Pulverize",
    },
    active: true,
    params: [{rune: "b", min: 0, max: 3, val: 3, name: "Stacks"},
             {min: 0, max: 40, name: "Fury", buffs: false, show: function(rune, stats) {
               return !!stats.leg_bladeofthewarlord;
             }}],
    info: function(rune, stats) {
      var fpa = DiabloCalc.barbarian.varSpeed(stats);
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 3.2}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 3.2}}; break;
      case "a": res = {"Damage": {elem: "lit", coeff: 3.2}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 3.2}}; break;
      case "d": res = {"Damage": {elem: "fir", coeff: 3.2}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 3.2}, "Shockwave Damage": {elem: "fir", coeff: 1}}; break;
      }
      if (stats.leg_bladeofthewarlord) {
        var pct = {};
        pct[DiabloCalc.itemById.P4_Unique_Mighty_1H_005.name] = stats.leg_bladeofthewarlord * this.params[1].val / 40;
        res["Damage"].percent = pct;
        if (rune === "e") res["Shockwave Damage"].percent = pct;
      }
      return $.extend({"DPS": {sum: true, "Damage": {speed: (stats.leg_oathkeeper ? 1.5 : 1), fpa: fpa, round: "up"}}}, res);
    },
    buffs: function(rune, stats) {
      if (rune === "a") return {chctaken: 10};
      if (rune === "b") return {damage: this.params[0].val * 4};
    },
  },
  cleave: {
    id: "cleave",
    name: "Cleave",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      e: "Rupture",
      d: "Reaping Swing",
      c: "Scattering Blast",
      a: "Broad Sweep",
      b: "Gathering Storm",
    },
    params: [{min: 0, max: "maxfury", name: "Fury", buffs: false, show: function(rune, stats) {
               return !!stats.leg_dishonoredlegacy;
             }}],
    info: function(rune, stats) {
      var fpa;
      switch (stats.info.weaponClass) {
      case "swing": fpa = 57.857117; break;
      case "thrust": fpa = 57.857121; break;
      case "swing2h": fpa = 57.857128; break;
      case "thrust2h": fpa = 57.857128; break;
      case "staff": fpa = 57.931034; break;
      case "dualwield": fpa = 57.857124; break;
      default: fpa = 57.857117;
      }
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 2}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 2}, "Explosion Damage": {elem: "fir", coeff: 1.6}}; break;
      case "d": res = {"Damage": {elem: "fir", coeff: 2}}; break;
      case "c": res = {"Damage": {elem: "phy", coeff: 2}, "Critical Damage": {elem: "phy", coeff: 0.8}}; break;
      case "a": res = {"Damage": {elem: "lit", coeff: 2.35}}; break;
      case "b": res = {"Damage": {elem: "col", coeff: 2}}; break;
      }
      if (stats.leg_dishonoredlegacy) {
        var percent = {};
        percent[DiabloCalc.itemById.Unique_Mighty_1H_103_x1.name] =
          stats.leg_dishonoredlegacy * Math.max(0, (stats.maxfury - this.params[0].val) / stats.maxfury);
        for (var k in res) {
          res[k].percent = percent;
        }
      }
      var dps = {"DPS": {sum: true, "Damage": {speed: (stats.leg_oathkeeper ? 1.5 : 1), fpa: fpa, round: "up"}}};
      if (rune === "c") {
        dps["DPS"]["Critical Damage"] = $.extend({nobp: true, factor: 0.01 * stats.final.chc}, dps["DPS"]["Damage"]);
      }
      return $.extend(dps, res);
    },
    active: true,
    buffs: {
      b: {dmgtaken: 10},
    },
  },
  frenzy: {
    id: "frenzy",
    name: "Frenzy",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      b: "Sidearm",
      e: "Berserk",
      c: "Vanguard",
      d: "Smite",
      a: "Maniac",
    },
    params: [{min: 0, max: "leg_bastionsrevered?10:5", name: "Stacks", buffs: false}],
    info: function(rune, stats) {
      var fpa = DiabloCalc.barbarian.varSpeed(stats);
      var stacks = this.params[0].val;
      var res;
      if (stats.leg_theundisputedchampion) {
        res = {"Damage": {elem: "max", coeff: 2.2}, "Sidearm Damage": {elem: "max", coeff: 3}};
      } else {
        switch (rune) {
        case "x": res = {"Damage": {elem: "phy", coeff: 2.2}}; break;
        case "b": res = {"Damage": {elem: "col", coeff: 2.2}, "Sidearm Damage": {elem: "col", coeff: 3}}; break;
        case "e": res = {"Damage": {elem: "col", coeff: 2.2}}; break;
        case "c": res = {"Damage": {elem: "phy", coeff: 2.2}}; break;
        case "d": res = {"Damage": {elem: "lit", coeff: 2.2}}; break;
        case "a": res = {"Damage": {elem: "fir", coeff: 2.2}}; break;
        }
      }
      var dps = {"DPS": {sum: true, "Damage": {speed: (stats.leg_oathkeeper ? 1.5 : 1), ias: stacks * 15, fpa: fpa, round: "up"}}};
      if (rune === "b" || stats.leg_theundisputedchampion) {
        dps["DPS"]["Sidearm Damage"] = $.extend({nobp: true, count: 0.25}, dps["DPS"]["Damage"]);
      }
      return $.extend(dps, res);
    },
    active: true,
    buffs: function(rune, stats) {
      var res = {};
      if (rune === "a" || stats.leg_theundisputedchampion) {
        res.damage = this.params[0].val * 2.5;
      }
      if (rune === "a" || stats.leg_theundisputedchampion) {
        res.extrams = this.params[0].val * 5;
      }
      return res;
    },
  },
  weaponthrow: {
    id: "weapon-throw",
    name: "Weapon Throw",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      a: "Mighty Throw",
      b: "Ricochet",
      c: "Throwing Hammer",
      e: "Stupefy",
      d: "Balanced Weapon",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {speed: "leg_oathkeeper?1.5:1", fpa: 57.777767, round: "up"}}},
      x: {"Damage": {elem: "phy", coeff: 2.75}},
      a: {"Damage": {elem: "lit", coeff: 4}},
      b: {"Damage": {elem: "fir", coeff: 2.75}},
      c: {"Damage": {elem: "phy", coeff: 2.75}},
      e: {"Damage": {elem: "phy", coeff: 2.75}},
      d: {"Damage": {elem: "fir", coeff: 2.75}},
    },
  },
  hammeroftheancients: {
    id: "hammer-of-the-ancients",
    name: "Hammer of the Ancients",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      b: "Rolling Thunder",
      a: "Smash",
      c: "The Devil's Anvil",
      e: "Thunderstrike",
      d: "Birthright",
    },
    params: [{min: 0, max: "maxfury", name: "Fury", buffs: false}],
    info: {
      "*": {"Cost": {cost: 20}, "DPS": {sum: true, "Damage": {speed: 1, ias: "leg_bracersofthefirstmen?50:0", fpa: 56.666664, round: "up"}}},
      x: {"Damage": {elem: "phy", coeff: 5.35, chc: "$1/5"}},
      b: {"Damage": {elem: "phy", coeff: 5.35, chc: "$1/5"}, "Shockwave Damage": {elem: "phy", coeff: 5.05}},
      a: {"Damage": {elem: "fir", coeff: 6.4, chc: "$1/5"}},
      c: {"Damage": {elem: "col", coeff: 5.35, chc: "$1/5"}},
      e: {"Damage": {elem: "lit", coeff: 5.35, chc: "$1/5"}},
      d: {"Damage": {elem: "phy", coeff: 5.35, chc: "$1/5"}},
    },
  },
  rend: {
    id: "rend",
    name: "Rend",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      b: "Ravage",
      d: "Blood Lust",
      a: "Lacerate",
      c: "Mutilate",
      e: "Bloodbath",
    },
    params: [{min: 1, max: "leg_lamentation?2:1", name: "Stacks", buffs: false}],
    info: {
      "*": {"Cost": {cost: 20}, "DPS": {sum: true, "Damage": {divide: "set_wastes_2pc?15:5", factor: "$1"}}},
      x: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 11, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
      b: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 11, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
      d: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 11, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
      a: {"Damage": {weapon: "mainhand", elem: "lit", coeff: 13.5, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
      c: {"Damage": {weapon: "mainhand", elem: "col", coeff: 11, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
      e: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 11, total: true, factors: {"Extra Duration": "set_wastes_2pc?3:1"}}},
    },
    active: true,
    buffs: {
      c: {dmgtaken: 10},
    },
  },
  seismicslam: {
    id: "seismic-slam",
    name: "Seismic Slam",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      c: "Stagger",
      a: "Shattered Ground",
      b: "Rumble",
      d: "Strength from Earth",
      e: "Permafrost",
    },
    active: true,
    activetip: "First 5 enemies",
    activeshow: function(rune, stats) {
      return !!stats.leg_bracersofdestruction;
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 6.2}}; break;
      case "c": res = {"Cost": {cost: 22}, "Damage": {elem: "lit", coeff: 6.2}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 7.35}}; break;
      case "b": res = {"DPS": {sum: true, "Damage": {speed: 1, fpa: 58.666656, round: "up"}, "Rumble Damage": {speed: 1, fpa: 58.666656, round: "up", nobp: true}},
        "Damage": {elem: "phy", coeff: 6.2}, "Rumble Damage": {elem: "phy", coeff: 2.3}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 6.2}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 7.55}}; break;
      }
      if (this.active && stats.leg_bracersofdestruction) {
        res["Damage"].percent = {};
        res["Damage"].percent[DiabloCalc.itemById.P3_Unique_Bracer_104.name] = stats.leg_bracersofdestruction;
      }
      return $.extend({"Cost": {cost: 30, rcr: "leg_furyofthevanishedpeak||leg_furyofthevanishedpeak_p2"}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58.666656, round: "up"}}}, res);
    },
  },
  whirlwind: {
    id: "whirlwind",
    name: "Whirlwind",
    category: "secondary",
    row: 1,
    col: 3,
    runes: {
      b: "Dust Devils",
      c: "Hurricane",
      e: "Blood Funnel",
      d: "Wind Shear",
      a: "Volcanic Eruption",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Tick Damage": {elem: "phy", coeff: 3.4}}; break;
      case "b": res = {"Tick Damage": {elem: "phy", coeff: 3.4}}; break;
      case "c": res = {"Tick Damage": {elem: "col", coeff: 3.4}}; break;
      case "e": res = {"Tick Damage": {elem: "phy", coeff: 3.4}}; break;
      case "d": res = {"Tick Damage": {elem: "lit", coeff: 3.4}}; break;
      case "a": res = {"Tick Damage": {elem: "fir", coeff: 4}}; break;
      }
      res = $.extend({"Cost": {cost: 7 / stats.info.aps + 3, fpa: 20}}, res);
      res["Tick Damage"].divide = {"Base Speed": 3};
      if (stats.leg_skullgrasp) {
        res["Tick Damage"].addcoeff = [stats.leg_skullgrasp / 100];
      }
      if (rune == "b" || stats.set_wastes_6pc) {
        res["Tornado Damage"] = {elem: res["Tick Damage"].elem, coeff: (stats.set_wastes_6pc ? 25 : 1.2)};
      }
      res["DPS"] = {sum: true, "Tick Damage": {speed: 1, fpa: 20}};
      if (res["Tornado Damage"]) res["DPS"]["Tornado Damage"] = {speed: 1, fpa: 30};
      return res;
    },
    active: true,
    buffs: function(rune, stats) {
      var res = {};
      if (stats.set_bulkathos_2pc) {
        res.extrams = 30;
        res.ias = 30;
      }
      if (stats.set_wastes_4pc) {
        res.dmgred = 40;
      }
      if (!$.isEmptyObject(res)) {
        return res;
      }
    },
  },
  ancientspear: {
    id: "ancient-spear",
    name: "Ancient Spear",
    category: "secondary",
    row: 1,
    col: 4,
    runes: {
      d: "Ranseur",
      a: "Harpoon",
      c: "Jagged Edge",
      b: "Boulder Toss",
      e: "Rage Flip",
    },
    active: true,
    activetip: "3 or fewer targets",
    activeshow: function(rune, stats) {
      return !!(rune === "b" && stats.leg_skularssalvation);
    },
    params: [{rune: "b", min: "25*(1-0.01*rcr_fury)-rcrint", max: "maxfury", name: "Fury", buffs: false}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 5}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 5}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 5}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 6.4}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 5, addcoeff: [[0.2, this.params[0].val - 25 * (1 - 0.01 * (stats.rcr_fury || 0)) + (stats.rcrint || 0)]]}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 5}}; break;
      }
      if (rune === "b" && stats.leg_skularssalvation) {
        res["Damage"].percent = {};
        res["Damage"].percent[DiabloCalc.itemById.P4_Unique_Bracer_101.name] = (this.active ? stats.leg_skularssalvation : 100);
      }
      res = $.extend({"Cost": {cost: 25}}, res);
      return res;
    },
  },
  groundstomp: {
    id: "ground-stomp",
    name: "Ground Stomp",
    category: "defensive",
    row: 2,
    col: 0,
    runes: {
      e: "Deafening Crash",
      b: "Wrenching Smash",
      a: "Trembling Stomp",
      d: "Foot of the Mountain",
      c: "Jarring Slam",
    },
    info: {
      "*": {"Cooldown": {cooldown: 12}},
      a: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 5.75}},
      e: {"Cooldown": {cooldown: 8}},
    },
  },
  leap: {
    id: "leap",
    name: "Leap",
    category: "defensive",
    row: 2,
    col: 1,
    runes: {
      d: "Iron Impact",
      c: "Launch",
      b: "Toppling Impact",
      a: "Call of Arreat",
      e: "Death from Above",
    },
    info: {
      "*": {"Cooldown": {cooldown: 10}, "Damage": {weapon: "mainhand", elem: "phy", coeff: 1.8}},
      b: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 4.5}},
    },
    active: false,
    buffs: function(rune, stats) {
      if (rune === "d" || stats.set_earth_4pc) return {armor_percent: 150 * (stats.set_earth_4pc ? 2.5 : 1)};
    },
  },
  sprint: {
    id: "sprint",
    name: "Sprint",
    category: "defensive",
    row: 2,
    col: 2,
    runes: {
      b: "Rush",
      c: "Run Like the Wind",
      a: "Marathon",
      e: "Gangway",
      d: "Forced March",
    },
    info: {
      "*": {"Cost": {cost: 20}},
      c: {"Tornado Tick Damage": {elem: "phy", coeff: 1.8, divide: {"Base Speed": 3}}, "Tornado DPS": {sum: true, "Tornado Tick Damage": {speed: 1, fpa: 20}}},
      e: {"Knockback Damage": {elem: "phy", coeff: 0.25}},
    },
    active: false,
    buffs: {
      x: {extrams: 30},
      b: {extrams: 30, dodge: 12},
      c: {extrams: 30},
      a: {extrams: 40},
      e: {extrams: 30},
      d: {extrams: 30},
    },
  },
  ignorepain: {
    id: "ignore-pain",
    name: "Ignore Pain",
    category: "defensive",
    row: 2,
    col: 3,
    runes: {
      d: "Bravado",
      b: "Iron Hide",
      e: "Ignorance is Bliss",
      c: "Mob Rule",
      a: "Contempt for Weakness",
    },
    info: {
      "*": {"Uptime": {duration: "5+leg_prideofcassius", cooldown: 30}},
      b: {"Uptime": {duration: "7+leg_prideofcassius", cooldown: 30}},
    },
    active: false,
    buffs: {
      x: {dmgred: 50},
      d: {dmgred: 50, extrams: 40},
      b: {dmgred: 50},
      e: {dmgred: 50, lifefury: 5364},
      c: {dmgred: 50},
      a: {dmgred: 50},
    },
  },
  overpower: {
    id: "overpower",
    name: "Overpower",
    category: "might",
    row: 3,
    col: 0,
    nolmb: true,
    runes: {
      b: "Storm of Steel",
      a: "Killing Spree",
      e: "Crushing Advance",
      d: "Momentum",
      c: "Revel",
    },
    info: {
      "*": {"Cooldown": {cooldown: 12}},
      x: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3.8}},
      b: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3.8}},
      a: {"Damage": {weapon: "mainhand", elem: "lit", coeff: 3.8}},
      e: {"Damage": {weapon: "mainhand", elem: "col", coeff: 3.8}},
      d: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3.8}},
      c: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 7.6}},
    },
    active: false,
    buffs: {
      a: {chc: 8},
    },
  },
  revenge: {
    id: "revenge",
    name: "Revenge",
    category: "might",
    row: 3,
    col: 1,
    nolmb: true,
    runes: {
      d: "Blood Law",
      e: "Best Served Cold",
      a: "Retribution",
      c: "Grudge",
      b: "Provocation",
    },
    info: {
      x: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3}},
      d: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3}},
      e: {"Damage": {weapon: "mainhand", elem: "col", coeff: 3}},
      a: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 7}},
      c: {"Damage": {weapon: "mainhand", elem: "lit", coeff: 3}},
      b: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 3}},
    },
    active: false,
    buffs: {
      e: {chc: 8},
    },
  },
  furiouscharge: {
    id: "furious-charge",
    name: "Furious Charge",
    category: "might",
    row: 3,
    col: 2,
    runes: {
      a: "Battering Ram",
      e: "Merciless Assault",
      d: "Stamina",
      c: "Cold Rush",
      b: "Dreadnought",
    },
    info: function(rune, stats) {
      var elem;
      switch (rune) {
      case "x": elem = "phy"; break;
      case "a": elem = "fir"; break;
      case "e": elem = "phy"; break;
      case "d": elem = "phy"; break;
      case "c": elem = "col"; break;
      case "b": elem = "lit"; break;
      }
      var coeff = (rune == "a" || stats.set_raekor_4pc ? 10.5 : 6);
      var res = {"Cooldown": {cooldown: 10}, "Damage": {elem: elem, weapon: "mainhand", coeff: coeff}};
      if (stats.leg_vileward) {
        res["Extra Damage per Enemy"] = {elem: elem, coeff: coeff, factors: {"Vile Ward": stats.leg_vileward * 0.01}, total: true};
      }
      if (stats.leg_standoff) {
        var pct = {};
        pct[DiabloCalc.itemById.P4_Unique_Polearm_01.name] = (stats.ms || 0) * 0.01 * stats.leg_standoff;
        res["Damage"].percent = pct;
        if (stats.leg_vileward) res["Extra Damage per Enemy"].percent = pct;
      }
      return res;
    },
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    category: "might",
    weapon: "mainhand",
    row: 3,
    col: 3,
    runes: {
      c: "Volcano",
      d: "Lahar",
      b: "Snow-Capped Mountain",
      e: "Tectonic Rift",
      a: "Glacier",
    },
    info: {
      "*": {"Cooldown": {cooldown: 30}},
      x: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 24}},
      c: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 66, total: true}},
      d: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 24}},
      b: {"Damage": {weapon: "mainhand", elem: "col", coeff: 28}},
      e: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 24}},
      a: {"Damage": {weapon: "mainhand", elem: "col", coeff: 24}},
    },
  },
  threateningshout: {
    id: "threatening-shout",
    name: "Threatening Shout",
    category: "tactics",
    row: 4,
    col: 0,
    runes: {
      b: "Intimidate",
      d: "Falter",
      c: "Grim Harvest",
      a: "Demoralize",
      e: "Terrify",
    },
    info: {
      "*": {"Cooldown": {cooldown: 10}},
    },
    active: true,
    buffs: {
      d: {dmgtaken: 25},
    },
  },
  battlerage: {
    id: "battle-rage",
    name: "Battle Rage",
    category: "tactics",
    weapon: "mainhand",
    row: 4,
    col: 1,
    runes: {
      a: "Marauder's Rage",
      b: "Ferocity",
      c: "Swords to Ploughshares",
      d: "Into the Fray",
      e: "Bloodshed",
    },
    active: true,
    params: [
      {rune: "d", val: 0, min: 0, max: 20, name: "Nearby Enemies", inf: true},
    ],
    info: {
      "*": {"Cost": {cost: 20}},
    },
    buffs: function(rune, stats) {
      var res = {damage: 10, chc: 3};
      if (rune === "a") res.damage = 15;
      if (rune === "b") res.extrams = 15;
      if (rune === "d") res.chc += this.params[0].val;
      return res;
    },
  },
  warcry: {
    id: "war-cry",
    name: "War Cry",
    category: "tactics",
    row: 4,
    col: 2,
    runes: {
      a: "Hardened Wrath",
      d: "Charge!",
      e: "Invigorate",
      b: "Veteran's Warning",
      c: "Impunity",
    },
    info: {
      "*": {"Cooldown": {cooldown: 20}},
    },
    active: true,
    buffs: {
      x: {armor_percent: 20},
      a: {armor_percent: 80},
      d: {armor_percent: 20},
      e: {armor_percent: 20, life: 10, regen: 13411},
      b: {armor_percent: 20, dodge: 30},
      c: {armor_percent: 20, resist_percent: 20},
    },
  },
  earthquake: {
    id: "earthquake",
    name: "Earthquake",
    category: "rage",
    row: 5,
    col: 0,
    runes: {
      b: "Giant's Stride",
      c: "Chilling Earth",
      d: "The Mountain's Call",
      a: "Molten Fury",
      e: "Cave-In",
    },
    info: {
      "*": {"Cooldown": {cooldown: 60}},
      x: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 48, total: true}},
      b: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 48, total: true}, "Tremor Damage": {weapon: "mainhand", elem: "fir", coeff: 3}, "Total Damage": {sum: true, "Damage": {}, "Tremor Damage": {count: 30}}},
      c: {"Damage": {weapon: "mainhand", elem: "col", coeff: 48, total: true}},
      d: {"Cooldown": {cooldown: 30}, "Damage": {weapon: "mainhand", elem: "lit", coeff: 48, total: true}},
      a: {"Damage": {weapon: "mainhand", elem: "fir", coeff: 60, total: true}},
      e: {"Damage": {weapon: "mainhand", elem: "phy", coeff: 48, total: true}},
    },
  },
  calloftheancients: {
    id: "call-of-the-ancients",
    name: "Call of the Ancients",
    category: "rage",
    row: 5,
    col: 1,
    runes: {
      b: "The Council Rises",
      d: "Duty to the Clan",
      a: "Ancients' Blessing",
      c: "Ancients' Fury",
      e: "Together as One",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {weapon: "mainhand", elem: "phy", pet: true, coeff: 2.7}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      case "b": res = {"Damage": {weapon: "mainhand", elem: "fir", pet: true, coeff: 5.4}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      case "d": res = {"Damage": {weapon: "mainhand", elem: "col", pet: true, coeff: 2.7}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      case "a": res = {"Damage": {weapon: "mainhand", elem: "phy", pet: true, coeff: 2.7}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      case "c": res = {"Damage": {weapon: "mainhand", elem: "phy", pet: true, coeff: 2.7}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      case "e": res = {"Damage": {weapon: "mainhand", elem: "lit", pet: true, coeff: 2.7}, "DPS": {sum: true, "Damage": {speed: 1, pet: 60, count: 3}}}; break;
      }
      if (!stats.set_immortalking_2pc) {
        res["Uptime"] = {duration: 20, cooldown: 120};
      } else {
        res["Cooldown"] = {cooldown: 120};
      }
//      if (stats.set_immortalking_4pc) {
//        res["Cleave Damage"] = $.extend({}, res["Damage"], {coeff: 6});
//      }
      return res;
    },
    active: false,
    buffs: {
      a: {lifefury: 966},
      d: {chctaken: 10},
      e: {dmgred: 50},
    },
  },
  wrathoftheberserker: {
    id: "wrath-of-the-berserker",
    name: "Wrath of the Berserker",
    category: "rage",
    row: 5,
    col: 2,
    runes: {
      b: "Arreat's Wail",
      a: "Insanity",
      e: "Slaughter",
      c: "Striding Giant",
      d: "Thrive on Chaos",
    },
    info: function(rune, stats) {
      var res = {};
      if (!stats.set_immortalking_4pc) {
        res["Uptime"] = {duration: 20, cooldown: 120};
      } else {
        res["Cooldown"] = {cooldown: 120};
      }
      if (stats.leg_morticksbrace || rune == "b") {
        res["Activation Damage"] = {weapon: "mainhand", elem: "fir", coeff: 34};
      }
      if (stats.leg_morticksbrace || rune == "e") {
        res["Eruption Damage"] = {weapon: "mainhand", elem: "phy", coeff: 3};
      }
      if (!$.isEmptyObject(res)) {
        return res;
      }
    },
    active: false,
    buffs: function(rune, stats) {
      if (stats.leg_morticksbrace) {
        return {damage: 50, dmgred: 50, lifefury: 5364, chc: 10, ias: 25, dodge: 20, extrams: 20};
      } else {
        switch (rune) {
        case "x": return {chc: 10, ias: 25, dodge: 20, extrams: 20};
        case "b": return {chc: 10, ias: 25, dodge: 20, extrams: 20};
        case "a": return {dmgmul: 50, chc: 10, ias: 25, dodge: 20, extrams: 20};
        case "e": return {chc: 10, ias: 25, dodge: 20, extrams: 20};
        case "c": return {dmgred: 50, chc: 10, ias: 25, dodge: 20, extrams: 20};
        case "d": return {lifefury: 5364, chc: 10, ias: 25, dodge: 20, extrams: 20};
        }
      }
    },
  },
};
DiabloCalc.passives.barbarian = {
  poundofflesh: {
    id: "pound-of-flesh",
    name: "Pound of Flesh",
    index: 0,
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(stats) {return {regen_percent: this.params[0].val * 2, extrams: this.params[0].val * 4};},
  },
  ruthless: {
    id: "ruthless",
    name: "Ruthless",
    index: 1,
    active: false,
    buffs: {dmgmul: 40},
  },
  nervesofsteel: {
    id: "nerves-of-steel",
    name: "Nerves of Steel",
    index: 2,
  },
  weaponsmaster: {
    id: "weapons-master",
    name: "Weapons Master",
    index: 3,
    buffs: function(stats) {
      switch (stats.info.mainhand.type) {
      case "sword":
      case "sword2h":
      case "dagger":
        return {damage: 8};
      case "mace":
      case "mace2h":
      case "axe":
      case "axe2h":
        return {chc: 5};
      case "spear":
      case "polearm":
        return {ias: 8};
      }
    },
  },
  inspiringpresence: {
    id: "inspiring-presence",
    name: "Inspiring Presence",
    index: 4,
    buffs: function(stats) {
      if (stats.skills.battlerage || stats.skills.threateningshout || stats.skills.warcry) {
        return {regen_percent: 3};
      }
    },
  },
  berserkerrage: {
    id: "berserker-rage",
    name: "Berserker Rage",
    index: 5,
    active: true,
    buffs: {damage: 25},
  },
  bloodthirst: {
    id: "bloodthirst",
    name: "Bloodthirst",
    index: 6,
    buffs: function(stats) {
      return {lifefury: 966 + 0.01 * (stats.healbonus || 0)};
    },
  },
  animosity: {
    id: "animosity",
    name: "Animosity",
    index: 7,
    buffs: {maxfury: 20, resourcegen: 20},
  },
  superstition: {
    id: "superstition",
    name: "Superstition",
    index: 8,
    buffs: {nonphys: 20},
  },
  toughasnails: {
    id: "tough-as-nails",
    name: "Tough as Nails",
    index: 9,
    buffs: function(stats) {
      return {armor_percent: 25, thorns_percent: 50};
    },
  },
  noescape: {
    id: "no-escape",
    name: "No Escape",
    index: 10,
    active: true,
    buffs: {dmgmul: {skills: ["weaponthrow", "ancientspear", "avalanche", "seismicslam"], percent: 30}},
  },
  relentless: {
    id: "relentless",
    name: "Relentless",
    index: 11,
    active: false,
    buffs: {rcr_fury: 50, lpfs_percent: 100, dmgred: 50},
  },
  brawler: {
    id: "brawler",
    name: "Brawler",
    index: 12,
    active: false,
    buffs: {damage: 20},
  },
  juggernaut: {
    id: "juggernaut",
    name: "Juggernaut",
    index: 13,
    buffs: {ccr: 50},
  },
  unforgiving: {
    id: "unforgiving",
    name: "Unforgiving",
    index: 14,
  },
  boonofbulkathos: {
    id: "boon-of-bulkathos",
    name: "Boon of Bul-Kathos",
    index: 15,
    buffs: {
      skill_barbarian_earthquake_cooldown: 15,
      skill_barbarian_calloftheancients_cooldown: 30,
      skill_barbarian_wrathoftheberserker_cooldown: 30,
    },
  },
  earthenmight: {
    id: "earthen-might",
    name: "Earthen Might",
    index: 16,
  },
  swordandboard: {
    id: "sword-and-board",
    name: "Sword and Board",
    index: 17,
    buffs: function(stats) {
      if (stats.info.ohtype === "shield") {
        return {dmgred: 30, rcr_fury: 20};
      }
    },
  },
  rampage: {
    id: "rampage",
    name: "Rampage",
    index: 18,
    params: [{val: 0, min: 0, max: 25, name: "Stacks"}],
    buffs: function() {return {str_percent: this.params[0].val};},
  },
};
DiabloCalc.partybuffs.barbarian = {
  bash: {
    runelist: "a",
  },
  cleave: {
    runelist: "b",
  },
  rend: {
    runelist: "c",
  },
  ignorepain: {
    runelist: "c",
  },
  warcry: {
    runelist: "*",
  },
  threateningshout: {
    runelist: "d",
  },
  calloftheancients: {
    runelist: "d",
  },
  inspiringpresence: {
    buffs: {regen_percent: 2},
  },
};

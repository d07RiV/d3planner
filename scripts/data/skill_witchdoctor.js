if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.witchdoctor = {
  primary: "primary",
  secondary: "secondary",
  defensive: "defensive",
  terror: "terror",
  decay: "decay",
  voodoo: "voodoo",
};
DiabloCalc.skills.witchdoctor = {
  poisondart: {
    id: "poison-dart",
    name: "Poison Dart",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      b: "Splinters",
      c: "Numbing Dart",
      d: "Spined Dart",
      a: "Flaming Dart",
      e: "Snake to the Face",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "psn", coeff: 1.85}, "Dot Damage": {elem: "psn", coeff: 0.4, total: true}}; break;
      case "b": res = {"Damage": {elem: "psn", coeff: 1.1}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 1.85}, "Dot Damage": {elem: "col", coeff: 0.4, total: true}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 1.85}, "Dot Damage": {elem: "phy", coeff: 0.4, total: true}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 5.65, total: true}}; break;
      case "e": res = {"Damage": {elem: "psn", coeff: 1.85}, "Dot Damage": {elem: "psn", coeff: 0.4, total: true}}; break;
      }
      var dps = {sum: true, "Damage": {speed: 1, fpa: 58, round: "up", count: (rune == "b" ? 1 : 3)}};
      if (res["Dot Damage"]) dps["Dot Damage"] = 1;

      if (stats.leg_carnevil && (stats.skills.fetisharmy || stats.passives.fetishsycophants || stats.leg_beltoftranscendence)) {
        var damage = {elem: "psn", pet: true, aps: true, coeff: 1.3};

        if (stats.skills.fetisharmy) {
          res["Fetish Army Damage"] = $.extend(true, {percent: {"Army %": stats.skill_witchdoctor_fetisharmy}}, damage);
          var count;
          switch (stats.skills.fetisharmy) {
          case "b": count = 8; break;
          case "c": count = 6; break;
          case "e": count = 7; break;
          default: count = 5;
          }
          dps["Fetish Army Damage"] = {speed: 1, fpa: 60, nobp: true, count: count};
        }
        if (stats.passives.fetishsycophants || stats.leg_beltoftranscendence) {
          res["Sycophants Damage"] = $.extend({}, damage);
          dps["Sycophants Damage"] = {speed: 1, fpa: 60, nobp: true, count: DiabloCalc.passives.witchdoctor.fetishsycophants.params[0].val};
        }
        res["Total DPS"] = dps;
      } else {
        res["DPS"] = dps;
      }
      return res;
    },
  },
  corpsespiders: {
    id: "corpse-spiders",
    name: "Corpse Spiders",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      c: "Leaping Spiders",
      b: "Spider Queen",
      d: "Widowmakers",
      e: "Medusa Spiders",
      a: "Blazing Spiders",
    },
    info: {
      x: {"Damage": {elem: "phy", coeff: 5.76, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      c: {"Damage": {elem: "psn", coeff: 6.45, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      b: {"Damage": {elem: "psn", coeff: 26.25, total: true}, "DPS": {sum: true, "Damage": {factor: 1/15}}},
      d: {"Damage": {elem: "phy", coeff: 5.76, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      e: {"Damage": {elem: "phy", coeff: 5.76, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      a: {"Damage": {elem: "fir", coeff: 7, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
    },
  },
  plagueoftoads: {
    id: "plague-of-toads",
    name: "Plague of Toads",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      a: "Explosive Toads",
      c: "Piercing Toads",
      b: "Rain of Toads",
      e: "Addling Toads",
      d: "Toad Affinity",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {speed: 1, count: 4, fpa: 57.5, round: "up"}}},
      x: {"Damage": {elem: "psn", coeff: 1.9}},
      a: {"Damage": {elem: "fir", coeff: 2.45}},
      c: {"Damage": {elem: "psn", coeff: 1.3}},
      b: {"Damage": {elem: "psn", coeff: 1.82, total: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 55.384609, round: "up"}}},
      e: {"Damage": {elem: "psn", coeff: 1.9}},
      d: {"Damage": {elem: "psn", coeff: 1.9}},
    },
  },
  firebomb: {
    id: "firebomb",
    name: "Firebomb",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      e: "Flash Fire",
      b: "Roll the Bones",
      c: "Fire Pit",
      d: "Pyrogeist",
      a: "Ghost Bomb",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      x: {"Damage": {elem: "fir", coeff: 1.55}},
      e: {"Damage": {elem: "fir", coeff: 1.55}},
      b: {"Damage": {elem: "fir", coeff: 1.55}},
      c: {"Damage": {elem: "fir", coeff: 1.55}, "Pool Damage": {elem: "fir", coeff: 0.6, total: true}},
      d: {"Damage": {elem: "fir", coeff: 8.8, total: true}, "DPS": {sum: true, "Damage": {factor: 3, divide: 6}}},
      a: {"Damage": {elem: "fir", coeff: 1.55}, "Blast Damage": {elem: "fir", coeff: 0.3}},
    },
  },
  graspofthedead: {
    id: "grasp-of-the-dead",
    name: "Grasp of the Dead",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      c: "Unbreakable Grasp",
      a: "Groping Eels",
      e: "Death Is Life",
      d: "Desperate Grasp",
      b: "Rain of Corpses",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 5.6, total: true}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 5.6, total: true}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 8.8, total: true}}; break;
      case "e": res = {"Damage": {elem: "psn", coeff: 5.6, total: true}}; break;
      case "d": res = {"Damage": {elem: "psn", coeff: 5.6, total: true}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 5.6, total: true}, "Corpse Damage": {elem: "phy", coeff: 4.2, total: true}}; break;
      }
      if (stats.leg_deadlyrebirth && rune !== "b") {
        res["Corpse Damage"] = {elem: res["Damage"].elem, coeff: 4.2, total: true};
      }
      return $.extend({"Cost": {cost: 150}, "Cooldown": {cooldown: 8}}, res);
    },
  },
  firebats: {
    id: "firebats",
    name: "Firebats",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      a: "Dire Bats",
      d: "Vampire Bats",
      c: "Plague Bats",
      b: "Hungry Bats",
      e: "Cloud of Bats",
    },
    params: [{rune: "e", min: 0, max: 5, val: 5, step: 0.5, name: "Channeled for", buffs: false},
             {rune: "c", min: 0, max: 2, val: 2, step: 0.5, name: "Channeled for", buffs: false}],
    info: {
      "*": {"Cost": {cost: 150}, "Channeling Cost": {cost: 75, fpa: 30}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 30}}},
      x: {"Tick Damage": {elem: "fir", coeff: 4.25, divide: {"Base Speed": 2}}},
      a: {"Channeling Cost": {cost: 75, fpa: 60}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 60}}, "Tick Damage": {elem: "fir", coeff: 4.95}},
      d: {"Tick Damage": {elem: "fir", coeff: 4.25, divide: {"Base Speed": 2}}, "Cost": {cost: 225}, "Channeling Cost": null},
      c: {"Tick Damage": {elem: "psn", coeff: 4.25, divide: {"Base Speed": 2}, percent: {"Channeling": "$2*25"}}},
      b: {"Tick Damage": {elem: "fir", coeff: 6.35, divide: {"Base Speed": 2}}},
      e: {"Tick Damage": {elem: "fir", coeff: 4.25, divide: {"Base Speed": 2}, percent: {"Channeling": "$1*20"}}},
    },
  },
  haunt: {
    id: "haunt",
    name: "Haunt",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      a: "Consuming Spirit",
      e: "Resentful Spirits",
      b: "Lingering Spirit",
      c: "Poisoned Spirit",
      d: "Draining Spirit",
    },
    info: function(rune, stats) {
      var damage = {elem: (rune == "c" ? "psn" : (rune == "a" ? "fir" : "col")), coeff: 40, total: true};
      var res;
      if (stats.passives.creepingdeath) {
        damage.divide = {"Base Duration": (stats.leg_quetzalcoatl ? 6 : 12)};
        res = {"DPS": damage};
      } else {
        res = {"DPS": {sum: true, "Damage": {divide: (stats.leg_quetzalcoatl ? 6 : 12)}}, "Damage": damage};
      }
      if (stats.set_jadeharvester_2pc) {
        res["Reapplication Damage"] = {sum: true, "DPS": {factor: 10}};
        res["Spam DPS"] = {sum: true, "DPS": {}, "Reapplication Damage": {speed: 1, fpa: 57.5, round: "up"}};
      }
      return $.extend({"Cost": {cost: 50}}, res);
    },
    active: true,
    buffs: {
      c: {dmgtaken: 20},
    },
  },
  locustswarm: {
    id: "locust-swarm",
    name: "Locust Swarm",
    category: "secondary",
    row: 1,
    col: 3,
    runes: {
      b: "Pestilence",
      d: "Devouring Swarm",
      c: "Cloud of Insects",
      e: "Diseased Swarm",
      a: "Searing Locusts",
    },
    info: function(rune, stats) {
      var damage;
      switch (rune) {
      case "a": damage = {elem: "fir", coeff: 14.8, total: true}; break;
      case "c": damage = {elem: "psn", coeff: 20.8, total: true}; break;
      default: damage = {elem: "psn", coeff: 10.4, total: true};
      }
      var dur = (stats.leg_quetzalcoatl ? 0.5 : 1) * (rune == "c" ? 16 : 8);
      var res;
      if (stats.passives.creepingdeath) {
        damage.divide = {"Base Duration": dur};
        res = {"DPS": damage};
      } else {
        res = {"DPS": {sum: true, "Damage": {divide: dur}}, "Damage": damage};
      }
      if (rune == "e") {
        res["Cloud Damage"] = {elem: "psn", coeff: 0.75, total: true};
      }
      return $.extend({"Cost": {cost: 300}}, res);
    },
  },
  summonzombiedogs: {
    id: "summon-zombie-dogs",
    name: "Summon Zombie Dogs",
    category: "defensive",
    row: 2,
    col: 0,
    runes: {
      c: "Rabid Dogs",
      d: "Chilled to the Bone",
      b: "Life Link",
      a: "Burning Dogs",
      e: "Leeching Beasts",
    },
    info: function(rune, stats) {
      var count = 3 + (stats.passives.zombiehandler ? 1 : 0) + (stats.passives.fierceloyalty ? 1 : 0) + (stats.passives.midnightfeast ? 1 : 0);
      var base = {pet: true, aps: true};
      var lphm = 1;
      if (stats.leg_thetallmansfinger) {
        base.factors = {"Tall Man's Finger": 4 * count + 1};
        lphm = 4 * count + 1;
        count = 1;
      }
      var res;
      switch (rune) {
      case "x": res = {"Damage": $.extend({elem: "phy", coeff: 0.3}, base)}; break;
      case "c": res = {"Damage": $.extend({elem: "psn", coeff: 0.3}, base), "Poison Damage": $.extend({elem: "psn", coeff: 0.3, total: true}, base)}; break;
      case "d": res = {"Damage": $.extend({elem: "col", coeff: 0.3}, base)}; break;
      case "b": res = {"Damage": $.extend({elem: "phy", coeff: 0.3}, base)}; break;
      case "a": res = {"Damage": $.extend({elem: "fir", coeff: 0.3}, base), "Burn DPS": $.extend({elem: "fir", coeff: 0.1, total: true}, base)}; break;
      case "e": res = {"Damage": $.extend({elem: "phy", coeff: 0.3}, base), "Healing": DiabloCalc.formatNumber(stats.lph * (1 + 0.01 * (stats.petias || 0)) * lphm * count, 0, 1000)}; break;
      }
      res["DPS"] = {sum: true, "Damage": {pet: 60, count: count}};
      if (rune === "c") res["DPS"]["Poison Damage"] = {pet: 60, count: count};
      if (rune === "a") res["DPS"]["Burn DPS"] = {count: count};
      return $.extend({"Cooldown": {cooldown: 45 * (stats.passives.tribalrites ? 0.75 : 1)}}, res);
    },
    active: true,
    buffs: {
      d: {dmgtaken: 15},
      b: {dmgred: 10},
    },
  },
  horrify: {
    id: "horrify",
    name: "Horrify",
    category: "defensive",
    row: 2,
    col: 1,
    nolmb: true,
    runes: {
      c: "Phobia",
      e: "Stalker",
      b: "Face of Death",
      a: "Frightening Aspect",
      d: "Ruthless Terror",
    },
    info: function(rune, stats) {
      var cd = 12 - (stats.passives.spiritvessel ? 2 : 0);
      var res = {};
      if (stats.leg_tiklandianvisage) {
        res["Fear Uptime"] = {cooldown: cd, duration: stats.leg_tiklandianvisage};
      }
      if (rune === "e") {
        res["Speed Uptime"] = {cooldown: cd, duration: 4};
      }
      if (rune === "a") {
        res["Armor Uptime"] = {cooldown: cd, duration: 8};
      }
      if (!$.isEmptyObject(res)) {
        return res;
      }
    },
    active: false,
    buffs: {
      a: {armor_percent: 35},
    },
  },
  spiritwalk: {
    id: "spirit-walk",
    name: "Spirit Walk",
    category: "defensive",
    row: 2,
    col: 2,
    nolmb: true,
    runes: {
      b: "Jaunt",
      d: "Honored Guest",
      c: "Umbral Shock",
      a: "Severance",
      e: "Healing Journey",
    },
    info: {
      "*": {"Uptime": {cooldown: "12-(passives.spiritvessel?2:0)", duration: 2, after: true}},
      b: {"Uptime": {cooldown: "12-(passives.spiritvessel?2:0)", duration: 3, after: true}},
      c: {"Damage": {elem: "fir", coeff: 7.5}},
      a: {"Damage": {elem: "phy", coeff: 2.25, factors: {"Duration": 2}, total: true}},
    },
  },
  hex: {
    id: "hex",
    name: "Hex",
    category: "defensive",
    row: 2,
    col: 3,
    nolmb: true,
    runes: {
      d: "Hedge Magic",
      e: "Jinx",
      b: "Angry Chicken",
      a: "Toad of Hugeness",
      c: "Unstable Form",
    },
    info: {
      "*": {"Uptime": {cooldown: "15*(passives.tribalrites?0.75:1)", duration: 12}},
      b: {"Cooldown": {cooldown: "15*(passives.tribalrites?0.75:1)"}, "Uptime": null, "Explosion Damage": {elem: "phy", coeff: 13.5}},
      a: {"Cooldown": {cooldown: "15*(passives.tribalrites?0.75:1)"}, "Uptime": null, "Damage": {elem: "psn", coeff: 5.8, factors: {"Duration": 5}, total: true}},
      c: {"Explosion Damage": {elem: "fir", coeff: 1.35}},
    },
    active: false,
    buffs: {
      x: {dmgtaken: 10},
      d: {dmgtaken: 10},
      e: {dmgtaken: 20},
      c: {dmgtaken: 10},
    },
  },
  soulharvest: {
    id: "soul-harvest",
    name: "Soul Harvest",
    category: "terror",
    row: 3,
    col: 0,
    nolmb: true,
    runes: {
      d: "Swallow Your Soul",
      a: "Siphon",
      c: "Languish",
      b: "Soul to Waste",
      e: "Vengeful Spirit",
    },
    info: function(rune, stats) {
      var res = {};
      if (rune == "e" || stats.set_jadeharvester_4pc) {
        res["Damage"] = {elem: "phy", coeff: 6.3};
      }
      if (stats.set_jadeharvester_6pc) {
        var haunt_rune = stats.skills.haunt;
        var haunt_dps, haunt_dur;
        if (haunt_rune) {
          var haunt_info = DiabloCalc.skills.witchdoctor.haunt.info(haunt_rune, stats);
          haunt_dur = (stats.passives.creepingdeath ? 40 : haunt_info["DPS"]["Damage"].divide);
          haunt_info = DiabloCalc.skill_processInfo(haunt_info, {skill: ["haunt", haunt_rune]});
          haunt_dps = haunt_info["DPS"].value;
        }

        var swarm_rune = stats.skills.locustswarm;
        if (!swarm_rune && stats.leg_wormwood) {
          swarm_rune = "x";
        }
        var swarm_dps, swarm_dur;
        if (swarm_rune) {
          var swarm_info = DiabloCalc.skills.witchdoctor.locustswarm.info(swarm_rune, stats);
          swarm_dur = (stats.passives.creepingdeath ? 40 : swarm_info["DPS"]["Damage"].divide);
          swarm_info = DiabloCalc.skill_processInfo(swarm_info, {skill: ["locustswarm", swarm_rune]});
          swarm_dps = swarm_info["DPS"].value;
        }

        if (haunt_dps || swarm_dps) {
          var jade = {sum: true};
          if (haunt_dps) {
            jade["Haunt Damage"] = {value: haunt_dps, factor: haunt_dur};
          }
          if (swarm_dps) {
            jade["Locust Swarm Damage"] = {value: swarm_dps, factor: swarm_dur};
          }
          res["Jade Harvester Damage"] = jade;
        }
      }
      return $.extend({"Cooldown": {cooldown: 15 - (stats.passives.spiritvessel ? 2 : 0)}}, res);
    },
    active: false,
    params: [{min: 0, max: "leg_sacredharvester?10:5", name: "Stacks"}],
    buffs: function(rune, stats) {
      var stacks = this.params[0].val;
      if (stats.set_jadeharvester_4pc) {
        return {int_percent: stacks * 3, maxmana_percent: stacks * 5, armor_percent: 30};
      } else if (rune == "d") {
        return {int_percent: stacks * 3, maxmana_percent: stacks * 5};
      } else if (rune == "c") {
        return {int_percent: stacks * 3, armor_percent: 30};
      } else {
        return {int_percent: stacks * 3};
      }
    },
  },
  sacrifice: {
    id: "sacrifice",
    name: "Sacrifice",
    category: "terror",
    row: 3,
    col: 1,
    runes: {
      c: "Black Blood",
      e: "Next of Kin",
      d: "Pride",
      b: "For the Master",
      a: "Provoke the Pack",
    },
    info: {
      x: {"Damage": {elem: "phy", coeff: 10.9, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      c: {"Damage": {elem: "phy", coeff: 10.9, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      e: {"Damage": {elem: "phy", coeff: 10.9, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      d: {"Damage": {elem: "phy", coeff: 10.9, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      b: {"Damage": {elem: "phy", coeff: 13, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      a: {"Damage": {elem: "phy", coeff: 10.9, percent: {"Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
    },
    active: false,
    params: [{rune: "a", min: 0, max: 10, val: 0, name: "Stacks", inf: true}],
    buffs: function(rune, stats) {
      if (rune === "a") return {damage: this.params[0].val * 20};
    },
  },
  massconfusion: {
    id: "mass-confusion",
    name: "Mass Confusion",
    category: "terror",
    row: 3,
    col: 2,
    runes: {
      d: "Unstable Realm",
      e: "Devolution",
      b: "Mass Hysteria",
      a: "Paranoia",
      c: "Mass Hallucination",
    },
    info: {
      x: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      d: {"Uptime": {duration: 12, cooldown: "45*(passives.tribalrites?0.75:1)"}},
      e: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      b: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      a: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      c: {"DPS": {elem: "phy", aps: true, coeff: 1.95, total: true}, "Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
    },
    active: false,
    buffs: {
      a: {dmgtaken: 20},
    },
  },
  zombiecharger: {
    id: "zombie-charger",
    name: "Zombie Charger",
    category: "decay",
    row: 4,
    col: 0,
    runes: {
      c: "Pile On",
      d: "Undeath",
      b: "Lumbering Cold",
      e: "Explosive Beast",
      a: "Zombie Bears",
    },
    info: {
      "*": {"Cost": {cost: 150}},
      x: {"Damage": {elem: "psn", coeff: 5.6}},
      c: {"Damage": {elem: "phy", coeff: 8}},
      d: {"Damage": {elem: "psn", coeff: 5.6}, "Reanimate Damage": {elem: "psn", coeff: 3.6}},
      b: {"Damage": {elem: "col", coeff: 1.96, factors: {"Zombies": 7}}},
      e: {"Damage": {elem: "fir", coeff: 5.32}},
      a: {"Damage": {elem: "psn", coeff: 3.92, factors: {"Bears": 3}}},
    },
  },
  spiritbarrage: {
    id: "spirit-barrage",
    name: "Spirit Barrage",
    category: "decay",
    row: 4,
    col: 1,
    runes: {
      d: "The Spirit Is Willing",
      b: "Well of Souls",
      c: "Phantasm",
      a: "Phlebotomize",
      e: "Manitou",
    },
    info: {
      "*": {"Cost": {cost: 100}, "DPS": {sum: true, "Damage": {speed: 1.2, fpa: 57.142834, round: "up"}}},
      x: {"Damage": {elem: "col", coeff: 4.25, total: true}},
      d: {"Damage": {elem: "col", coeff: 4.25, total: true}},
      b: {"Damage": {elem: "fir", coeff: 4.25, total: true}, "Spirit Damage": {elem: "fir", coeff: 0.65},
        "DPS": {sum: true, "Damage": {speed: 1.2, fpa: 57.142834, round: "up"}, "Spirit Damage": {speed: 1.2, count: 3, fpa: 57.142834, round: "up"}}},
      c: {"Damage": {elem: "col", coeff: 6.75, total: true}, "DPS": {sum: true, "Damage": {count: 3, divide: 5}}},
      a: {"Damage": {elem: "col", coeff: 4.25, total: true}},
      e: {"Damage": {elem: "col", coeff: 29, total: true}, "DPS": {sum: true, "Damage": {divide: 20}}},
    },
  },
  acidcloud: {
    id: "acid-cloud",
    name: "Acid Cloud",
    category: "decay",
    row: 4,
    col: 2,
    runes: {
      b: "Acid Rain",
      c: "Lob Blob Bomb",
      d: "Slow Burn",
      e: "Kiss of Death",
      a: "Corpse Bomb",
    },
    info: {
      "*": {"Cost": {cost: 175}},
      x: {"Damage": {elem: "psn", coeff: 3, addcoeff: [3.6], total: 0}},
      b: {"Damage": {elem: "psn", coeff: 3, addcoeff: [3.6], total: 0}},
      c: {"Damage": {elem: "psn", coeff: 3, addcoeff: [6], total: 0}},
      d: {"Damage": {elem: "col", coeff: 3, addcoeff: [7.2], total: 0}},
      e: {"Damage": {elem: "psn", coeff: 3.3, addcoeff: [3.96], total: 0}},
      a: {"Damage": {elem: "fir", coeff: 5.25}},
    },
  },
  wallofzombies: {
    id: "wall-of-zombies",
    name: "Wall of Zombies",
    category: "decay",
    row: 4,
    col: 3,
    runes: {
      b: "Barricade",
      d: "Unrelenting Grip",
      a: "Creepers",
      e: "Wrecking Crew",
      c: "Offensive Line",
    },
    info: function(rune, stats) {
      var res = {"Cooldown": {cooldown: 8}, "Damage": {elem: (rune == "d" ? "phy" : "col"), coeff: 2, total: true}};
      if (rune == "a") {
        res["Zombie Damage"] = {elem: "phy", coeff: 0.25};
      }
      if (stats.set_helltooth_4pc) {
        res["Helltooth Damage"] = {elem: "psn", coeff: 3, factors: {"Duration": 4}};
      }
      return res;
    },
  },
  piranhas: {
    id: "piranhas",
    name: "Piranhas",
    category: "decay",
    row: 4,
    col: 4,
    runes: {
      a: "Bogadile",
      b: "Zombie Piranhas",
      c: "Piranhado",
      d: "Wave of Mutilation",
      e: "Frozen Piranhas",
    },
    info: {
      "*": {"Cost": {cost: 250}, "Cooldown": {cooldown: 8}},
      x: {"Damage": {elem: "psn", coeff: 4, total: true}},
      a: {"Damage": {elem: "phy", coeff: 4, total: true}, "Bogadile Damage": {elem: "phy", coeff: 11}},
      b: {"Damage": {elem: "psn", coeff: 4, total: true}},
      c: {"Damage": {elem: "psn", coeff: 2, total: true}},
      d: {"Damage": {elem: "psn", coeff: 4.75, total: true}},
      e: {"Damage": {elem: "col", coeff: 4, total: true}},
    },
    active: false,
    buffs: {
      x: {dmgtaken: 15},
      a: {dmgtaken: 15},
      b: {dmgtaken: 15},
      c: {dmgtaken: 15},
      d: {dmgtaken: 15},
      e: {dmgtaken: 15},
    },
  },
  gargantuan: {
    id: "gargantuan",
    name: "Gargantuan",
    category: "voodoo",
    row: 5,
    col: 0,
    runes: {
      b: "Humongoid",
      a: "Restless Giant",
      d: "Wrathful Protector",
      c: "Big Stinker",
      e: "Bruiser",
    },
    info: function(rune, stats) {
      var count = 1;
      var base = {pet: true, aps: true};
      if (stats.leg_theshortmansfinger) {
        count = 3;
        base.percent = {"Short Man's Finger": 50};
      }
      var res;
      switch (rune) {
      case "x": res = {"Damage": $.extend(base, {elem: "phy", coeff: 1})}; break;
      case "b": res = {"Damage": $.extend(base, {elem: "col", coeff: 1.3})}; break;
      case "a": res = {"Damage": $.extend(true, base, {elem: "phy", coeff: 1, percent: {"Enrage": 200}})}; break;
      case "d": res = {"Damage": $.extend(base, {elem: "fir", coeff: 5.75})}; break;
      case "c": res = {"Damage": $.extend(base, {elem: "psn", coeff: 1}), "Poison DPS": $.extend(base, {elem: "psn", coeff: 0.45, total: true})}; break;
      case "e": res = {"Damage": $.extend(base, {elem: "fir", coeff: 1}), "Slam Damage": $.extend(base, {elem: "fir", coeff: 2})}; break;
      }
      res["DPS"] = {sum: true, "Damage": {pet: 84, count: count}};
      if (rune === "a") res["DPS"]["Damage"].ias = 35;
      if (rune === "c") res["DPS"]["Poison DPS"] = {count: count};
      return $.extend({"Cooldown": {cooldown: 60}}, res);
    },
  },
  bigbadvoodoo: {
    id: "big-bad-voodoo",
    name: "Big Bad Voodoo",
    category: "voodoo",
    row: 5,
    col: 1,
    runes: {
      b: "Jungle Drums",
      d: "Rain Dance",
      a: "Slam Dance",
      c: "Ghost Trance",
      e: "Boogie Man",
    },
    info: function(rune, stats) {
      if (!stats.leg_starmetalkukri) {
        return {"Uptime": {duration: (rune == "b" ? 30 : 20), cooldown: 120 * (stats.passives.tribalrites ? 0.75 : 1)}};
      }
    },
    active: false,
    buffs: {
      x: {ias: 20, petias: 20, extrams: 20},
      b: {ias: 20, petias: 20, extrams: 20},
      d: {ias: 20, petias: 20, extrams: 20, manaregen: 250},
      a: {ias: 20, petias: 20, extrams: 20, damage: 30},
      c: {ias: 20, petias: 20, extrams: 20},
      e: {ias: 20, petias: 20, extrams: 20},
    },
  },
  fetisharmy: {
    id: "fetish-army",
    name: "Fetish Army",
    category: "voodoo",
    row: 5,
    col: 2,
    runes: {
      a: "Fetish Ambush",
      d: "Devoted Following",
      b: "Legion of Daggers",
      c: "Tiki Torchers",
      e: "Head Hunters",
    },
    info: {
      "*": {"Cooldown": {cooldown: "120*(passives.tribalrites?0.75:1)"}},
      x: {"Dagger Damage": {elem: "phy", pet: true, aps: true, coeff: 1.8}, "Total DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}}},
      a: {"Dagger Damage": {elem: "col", pet: true, aps: true, coeff: 1.8}, "Total DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}},
          "Explosion Damage": {elem: "col", coeff: 6.8}},
      d: {"Dagger Damage": {elem: "phy", pet: true, aps: true, coeff: 1.8}, "Total DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}}},
      b: {"Dagger Damage": {elem: "phy", pet: true, aps: true, coeff: 1.8}, "Total DPS": {sum: true, "Dagger Damage": {pet: 48, count: 8}}},
      c: {"Dagger Damage": {elem: "fir", pet: true, aps: true, coeff: 1.8}, "Torcher Damage": {elem: "fir", pet: true, aps: true, coeff: 0.85},
          "DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}, "Torcher Damage": {pet: 42, count: 2}}},
      e: {"Dagger Damage": {elem: "psn", pet: true, aps: true, coeff: 1.8}, "Dart Damage": {elem: "psn", pet: true, aps: true, coeff: 1.3},
         "DPS": {sum: true, "Dagger Damage": {pet: 48, count: 5}, "Dart Damage": {pet: 42, count: 2}}},
    },
  },
};
DiabloCalc.passives.witchdoctor = {
  junglefortitude: {
    id: "jungle-fortitude",
    name: "Jungle Fortitude",
    index: 0,
    buffs: {dmgred: 15},
  },
  circleoflife: {
    id: "circle-of-life",
    name: "Circle of Life",
    index: 1,
  },
  spiritualattunement: {
    id: "spiritual-attunement",
    name: "Spiritual Attunement",
    index: 2,
    buffs: {maxmana_percent: 10, manaregen_percent: 1},
  },
  gruesomefeast: {
    id: "gruesome-feast",
    name: "Gruesome Feast",
    index: 3,
    params: [{min: 0, max: 5, val: 0, name: "Stacks"}],
    buffs: function(stats) {return {int_percent: this.params[0].val * 10};},
  },
  bloodritual: {
    id: "blood-ritual",
    name: "Blood Ritual",
    index: 4,
    buffs: {rcr_mana: 10, regen_percent: 1},
  },
  badmedicine: {
    id: "bad-medicine",
    name: "Bad Medicine",
    index: 5,
  },
  zombiehandler: {
    id: "zombie-handler",
    name: "Zombie Handler",
    index: 6,
    buffs: {life: 20},
  },
  piercetheveil: {
    id: "pierce-the-veil",
    name: "Pierce the Veil",
    index: 7,
    buffs: {damage: 20, rcr_mana: -30},
  },
  spiritvessel: {
    id: "spirit-vessel",
    name: "Spirit Vessel",
    index: 8,
  },
  fetishsycophants: {
    id: "fetish-sycophants",
    name: "Fetish Sycophants",
    index: 9,
    params: (DiabloCalc.itemaffixes&&DiabloCalc.itemaffixes.leg_beltoftranscendence.params||[{min: 0, max: 15, name: "Count", buffs: false}]),
    //params: [{min: 0, max: 15, name: "Count", buffs: false}],
    info: function(stats) {
      return {"Fetish Damage": {elem: "max", pet: true, aps: true, coeff: 1.8},
              "Fetish DPS": {sum: true, "Fetish Damage": {pet: 48}},
              "Total DPS": {sum: true, "Fetish Damage": {pet: 48, count: this.params[0].val}},
      };
    },
  },
  rushofessence: {
    id: "rush-of-essence",
    name: "Rush of Essence",
    index: 10,
  },
  visionquest: {
    id: "vision-quest",
    name: "Vision Quest",
    index: 11,
    active: true,
    buffs: {manaregen_percent: 30},
  },
  fierceloyalty: {
    id: "fierce-loyalty",
    name: "Fierce Loyalty",
    index: 12,
  },
  graveinjustice: {
    id: "grave-injustice",
    name: "Grave Injustice",
    index: 13,
  },
  tribalrites: {
    id: "tribal-rites",
    name: "Tribal Rites",
    index: 14,
  },
  creepingdeath: {
    id: "creeping-death",
    name: "Creeping Death",
    index: 15,
  },
  physicalattunement: {
    id: "physical-attunement",
    name: "Physical Attunement",
    index: 16,
    params: [{min: 0, max: 25, val: 0, name: "Nearby Enemies"}],
    buffs: function(stats) {return {resphy: 70 * this.params[0].val};},
  },
  midnightfeast: {
    id: "midnight-feast",
    name: "Midnight Feast",
    index: 17,
    buffs: {dmgmul: {skills: ["summonzombiedogs", "gargantuan"], percent: 50}},
  },
};
DiabloCalc.partybuffs.witchdoctor = {
  haunt: {
    runelist: "c",
  },
  summonzombiedogs: { // ptr
    runelist: "d",
  },
  hex: {
    runelist: "*",
  },
  massconfusion: {
    runelist: "a",
  },
  piranhas: {
    runelist: "x",
  },
  bigbadvoodoo: {
    runelist: "*",
  },
};

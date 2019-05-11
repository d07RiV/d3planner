if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.extraskills) DiabloCalc.extraskills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.witchdoctor = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  terror: "Terror",
  decay: "Decay",
  voodoo: "Voodoo",
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
      var dps = {sum: true, "Damage": {speed: 1, fpa: 58, round: "up", count: (rune == "b" ? 3 : 1)}};
      if (res["Dot Damage"]) dps["Dot Damage"] = 1;

      if (stats.leg_carnevil && (stats.skills.fetisharmy || stats.passives.fetishsycophants || stats.leg_beltoftranscendence)) {
        var damage = {elem: "psn", pet: true, aps: true, coeff: 1.3, percent: {}};
        damage.percent[DiabloCalc.itemById.Unique_VoodooMask_101_x1.name] = 250;

        if (stats.skills.fetisharmy || stats.passives.fetishsycophants || stats.leg_beltoftranscendence) {
          var count = 0;
          if (stats.skills.fetisharmy) count = 5;
          else count = Math.min(5, DiabloCalc.passives.witchdoctor.fetishsycophants.params[0].val);
          res["Fetish Damage"] = $.extend(true, {percent: {"Army %": stats.skill_witchdoctor_fetisharmy}}, damage);
          dps["Fetish Damage"] = {speed: 1, fpa: 58, round: "up", nobp: true, count: count};
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
      x: {"Damage": {elem: "phy", coeff: 5.76, total: true, pet: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      c: {"Damage": {elem: "psn", coeff: 6.45, total: true, pet: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      b: {"Damage": {elem: "psn", coeff: 26.25, total: true, pet: true}, "DPS": {sum: true, "Damage": {factor: 1/15}}},
      d: {"Damage": {elem: "phy", coeff: 7, total: true, pet: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      e: {"Damage": {elem: "phy", coeff: 5.76, total: true, pet: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
      a: {"Damage": {elem: "fir", coeff: 5.76, total: true, pet: true}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58, round: "up"}}},
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
      c: {"Damage": {elem: "phy", coeff: 1.3}},
      b: {"Damage": {elem: "psn", coeff: 1.3, total: true}, "DPS": {sum: true, "Damage": {speed: 1.4, fpa: 55.384609, round: "up"}}},
      e: {"Damage": {elem: "psn", coeff: 1.9}},
      d: {"Damage": {elem: "col", coeff: 1.9}},
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
      a: {"Damage": {elem: "fir", coeff: 1.55}, "Blast Damage": {elem: "col", coeff: 0.3}},
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
      case "x": res = {"Damage": {elem: "phy", coeff: 7.6, total: true}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 5.6, total: true}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 13.6, total: true}}; break;
      case "e": res = {"Damage": {elem: "psn", coeff: 5.6, total: true}}; break;
      case "d": res = {"Damage": {elem: "psn", coeff: 5.6, total: true}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 5.6, total: true}, "Corpse Damage": {elem: "phy", coeff: 4.2, total: true}}; break;
      }
      if (stats.leg_deadlyrebirth && rune !== "b") {
        res["Corpse Damage"] = {elem: res["Damage"].elem, coeff: 4.2, total: true};
      }
      var toex = {};
      if (rune !== "c") toex["Cost"] = {cost: 150};
      if (!stats.leg_wilkensreach) toex["Cooldown"] = {cooldown: (rune === "d" ? 4 : 8)};
      return $.extend(toex, res);
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
    range: {x: 28, a: 28, d: 28, c: 28, b: 60, e: 15},
    params: [{rune: "e", min: 0, max: 5, val: 5, step: 0.5, name: "Channeled for", buffs: false},
             {rune: "c", min: 0, max: 3, val: 3, step: 0.5, name: "Channeled for", buffs: false}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Tick Damage": {elem: "fir", coeff: 4.75, divide: {"Base Speed": 2}}}; break;
      case "a": res = {"Channeling Cost": {cost: 125, fpa: 60}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 60}}, "Tick Damage": {elem: "fir", coeff: 5}}; break;
      case "d": res = {"Cost": {cost: 250}, "Channeling Cost": null, "Tick Damage": {elem: "phy", coeff: 4.75, divide: {"Base Speed": 2}}, "Cost": {cost: 225}, "Channeling Cost": null}; break;
      case "c": res = {"Tick Damage": {elem: "psn", coeff: 4.75, divide: {"Base Speed": 2}, percent: {"Channeling": "$2*51.5/3"}}}; break;
      case "b": res = {"Tick Damage": {elem: "fir", coeff: 7.5, divide: {"Base Speed": 2}}}; break;
      case "e": res = {"Tick Damage": {elem: "fir", coeff: 4.25, divide: {"Base Speed": 2}, percent: {"Channeling": "$1*20"}}}; break;
      }
      res = $.extend({"Cost": null, "Channeling Cost": {cost: 125, fpa: 30}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 30}}}, res);
      if (stats.leg_staffofchiroptera || stats.leg_staffofchiroptera_p6) {
        res["DPS"]["Tick Damage"].speed *= 2;
        var rcr = {};
        if (stats.leg_staffofchiroptera_p6) rcr.leg_staffofchiroptera_p6 = 75;
        else if (stats.leg_staffofchiroptera) rcr.leg_staffofchiroptera = stats.leg_staffofchiroptera;
        if (res["Cost"]) res["Cost"].rcr = rcr;
        if (res["Channeling Cost"]) res["Channeling Cost"].rcr = rcr;
      }
      return res;
    },
    active: true,
    buffs: function(rune, stats) {
      if (stats.leg_coilsofthefirstspider) {
        return {lph: stats.leg_coilsofthefirstspider, dmgred: 30};
      }
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
      var damage = {elem: (rune == "c" ? "psn" : (rune == "a" ? "fir" : (rune === "d" ? "phy" : "col"))), coeff: 40, total: true};
      var res;
      if (stats.passives.creepingdeath) {
        damage.divide = {"Base Duration": (stats.leg_quetzalcoatl ? 6 : 12)};
        res = {"DPS": damage};
      } else {
        res = {"DPS": {sum: true, "Damage": {divide: (stats.leg_quetzalcoatl ? 6 : 12)}}, "Damage": damage};
      }
      if (stats.set_jadeharvester_2pc) {
        res["Reapplication Damage"] = {elem: damage.elem, coeff: 40, divide: {"Base Duration": (stats.leg_quetzalcoatl ? 6 : 12)},
          factors: {"Duration": 3500}};
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
    range: 22,
    info: function(rune, stats) {
      var damage;
      switch (rune) {
      case "a": damage = {elem: "fir", coeff: 14.8, total: true}; break;
      case "c": damage = {elem: "phy", coeff: 10.4, total: true}; break;
      default: damage = {elem: "psn", coeff: 10.4, total: true};
      }
      var dur = (stats.leg_quetzalcoatl ? 0.5 : 1) * 8;
      var res;
      if (stats.passives.creepingdeath) {
        damage.divide = {"Base Duration": dur};
        res = {"DPS": damage};
      } else {
        res = {"DPS": {sum: true, "Damage": {divide: dur}}, "Damage": damage};
      }
      if (rune == "e") {
        res["Cloud Damage"] = {elem: "psn", coeff: 7.5, total: true};
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
        base.percent = {};
        base.percent[DiabloCalc.itemById.Unique_Ring_101_x1.name] = 800 * count;
        lphm = 8 * count + 1;
        count = 1;
      }
      var res;
      switch (rune) {
      case "x": res = {"Damage": $.extend({elem: "phy", coeff: 1.2}, base)}; break;
      case "c": res = {"Damage": $.extend({elem: "psn", coeff: 1.2}, base), "Poison Damage": $.extend({elem: "psn", coeff: 1.2, total: true}, base)}; break;
      case "d": res = {"Damage": $.extend({elem: "col", coeff: 1.2}, base)}; break;
      case "b": res = {"Damage": $.extend({elem: "phy", coeff: 1.2}, base)}; break;
      case "a": res = {"Damage": $.extend({elem: "fir", coeff: 1.2}, base), "Burn DPS": $.extend({elem: "fir", coeff: 0.4, total: true}, base)}; break;
      case "e": res = {"Damage": $.extend({elem: "phy", coeff: 1.2}, base), "Healing": DiabloCalc.formatNumber(stats.lph * (1 + 0.01 * (stats.petias || 0)) * lphm * count, 0, 1000)}; break;
      }
      res["DPS"] = {sum: true, "Damage": {pet: 60, count: count}};
      if (rune === "c") res["DPS"]["Poison Damage"] = {pet: 60, count: count};
      if (rune === "a") res["DPS"]["Burn DPS"] = {count: count};
      return $.extend({"Cooldown": {cooldown: 45 * (stats.passives.tribalrites ? 0.75 : 1)}}, res);
    },
    active: true,
    buffs: {
      b: {dmgred: 10},
    },
  },
  horrify: {
    id: "horrify",
    name: "Horrify",
    category: "defensive",
    row: 2,
    col: 1,
    runes: {
      c: "Phobia",
      e: "Stalker",
      b: "Face of Death",
      a: "Frightening Aspect",
      d: "Ruthless Terror",
    },
    range: {x: 18, c: 18, e: 18, b: 24, a: 18, d: 18},
    info: function(rune, stats) {
      var cd = 10;
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
      a: {armor_percent: 50},
      e: {extrams: 20},
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
    range: {x: 100, b: 188, d: 100, c: 10, a: 100, e: 100},
    info: {
      "*": {"Uptime": {cooldown: 10, duration: 2, after: true}},
      b: {"Uptime": {cooldown: 10, duration: 3, after: true}},
      c: {"Damage": {elem: "fir", coeff: 7.5}},
    },
    active: false,
    buffs: {
      x: {extrams: 50},
      b: {extrams: 50},
      d: {extrams: 50},
      c: {extrams: 50},
      a: {extrams: 150},
      e: {extrams: 50},
    },
  },
  hex: {
    id: "hex",
    name: "Hex",
    category: "defensive",
    row: 2,
    col: 3,
    runes: {
      d: "Hedge Magic",
      e: "Jinx",
      b: "Angry Chicken",
      a: "Toad of Hugeness",
      c: "Unstable Form",
    },
    range: {x: 100, d: 100, e: 100, b: 12, a: 100, c: 100},
    info: function(rune, stats) {
      var res = {"Uptime": {cooldown: 15 * (stats.passives.tribalrites ? 0.75 : 1), duration: 12}};
      switch (rune) {
      case "b":
        res = {"Cooldown": {cooldown: 15 * (stats.passives.tribalrites ? 0.75 : 1)}, "Explosion Damage": {elem: "psn", coeff: 13.5}};
        if (stats.set_manajuma_2pc) {
          res["Explosion Damage"].percent = {};
          res["Explosion Damage"].percent[DiabloCalc.itemSets.manajuma.name] = 400;
        }
        return res;
      case "a":
        return {"Cooldown": {cooldown: 15 * (stats.passives.tribalrites ? 0.75 : 1)}, "Damage": {elem: "psn", coeff: 7.5, total: true}};
      case "c":
        res["Explosion Damage"] = {elem: "fir", coeff: 5};
        break;
      }
      return res;
    },
    active: false,
    buffs: function(rune, stats) {
      var res;
      switch (rune) {
      case "e": res = {dmgtaken: 15}; break;
      case "b": res = {extrams: 50 + (stats.set_manajuma_2pc ? 100 : 0)}; break;
      case "a": res = {dmgtaken: 15}; break;
      }
      if (stats.set_arachyr_4pc) {
        res.dmgtaken = Math.max(res.dmgtaken || 0, 25);
        res.dmgred = 50;
      }
      return res;
    },
  },
  soulharvest: {
    id: "soul-harvest",
    name: "Soul Harvest",
    category: "terror",
    row: 3,
    col: 0,
    runes: {
      d: "Swallow Your Soul",
      a: "Siphon",
      c: "Languish",
      b: "Soul to Waste",
      e: "Vengeful Spirit",
    },
    range: 18,
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
          haunt_dur = (stats.passives.creepingdeath ? 10000 : haunt_info["DPS"]["Damage"].divide);
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
          swarm_dur = (stats.passives.creepingdeath ? 10000 : swarm_info["DPS"]["Damage"].divide);
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
      return $.extend({"Cooldown": {cooldown: 12}}, res);
    },
    active: false,
    params: [{min: 0, max: "leg_sacredharvester?10:5", name: "Stacks"}],
    buffs: function(rune, stats) {
      var stacks = this.params[0].val;
      var res = {int_percent: stacks * 3};
      if (stats.leg_lakumbasornament) res.dmgred = 6 * stacks;
      if (rune === "d" || stats.set_jadeharvester_4pc) res.maxmana = (stacks > 5 ? 5 : stacks) * 750 * 0.05;
      if (rune === "c" || stats.set_jadeharvester_4pc) res.armor_percent = stacks * 10;
      if (rune === "b" || stats.set_jadeharvester_4pc) res.extrams = stacks * 5;
      return res;
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
      x: {"Damage": {elem: "phy", coeff: 10.9, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      c: {"Damage": {elem: "phy", coeff: 10.9, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      e: {"Damage": {elem: "phy", coeff: 10.9, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      d: {"Damage": {elem: "phy", coeff: 10.9, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      b: {"Damage": {elem: "phy", coeff: 13, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
      a: {"Damage": {elem: "phy", coeff: 10.9, percent: {"The Tall Man's Finger": "leg_thetallmansfinger?200:0"}}},
    },
    active: false,
    params: [{rune: "a", min: 0, max: 5, val: 0, name: "Stacks"}],
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
      d: {"Uptime": {duration: 12, cooldown: "30*(passives.tribalrites?0.75:1)"}},
      e: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      b: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      a: {"Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
      c: {"DPS": {elem: "phy", coeff: 4, total: true}, "Uptime": {duration: 12, cooldown: "60*(passives.tribalrites?0.75:1)"}},
    },
    active: false,
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
    range: {x: 28, c: 100, d: 28, b: 28, e: 63, a: 30},
    info: {
      "*": {"Cost": {cost: 150, rcr: {leg_scrimshaw: "leg_scrimshaw"}}},
      x: {"Damage": {elem: "psn", coeff: 5.6}},
      c: {"Damage": {elem: "phy", coeff: 8.8}},
      d: {"Damage": {elem: "psn", coeff: 5.6}, "Reanimate Damage": {elem: "psn", coeff: 4.8}},
      b: {"Damage": {elem: "col", coeff: 2.8, factors: {"Zombies": 7}}},
      e: {"Damage": {elem: "fir", coeff: 6.8}},
      a: {"Damage": {elem: "psn", coeff: 5.2, factors: {"Bears": 3}}},
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
    params: [{min: 0, max: 3, name: "Phantasms", buffs: false, show: function(rune, stats) {
               return stats.leg_gazingdemise;
             }}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "col", coeff: 6, total: true}}; break;
      case "d": res = {"Damage": {elem: "col", coeff: 6, total: true}}; break;
      case "b": res = {"Damage": {elem: "fir", coeff: 6, total: true}, "Spirit Damage": {elem: "fir", coeff: 0.65}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 7.5, total: true}}; break;
      case "a": res = {"Damage": {elem: "col", coeff: 6, total: true}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 60, total: true}}; break;
      }
      if (rune === "c") {
        res["DPS"] = {sum: true, "Damage": {count: 3, divide: 5}};
      } else if (rune === "e") {
        res["DPS"] = {sum: true, "Damage": {divide: 20}};
      } else {
        res["DPS"] = {sum: true, "Damage": {speed: 1.2, fpa: 57.142834, round: "up"}};
        if (res["Spirit Damage"]) {
          res["DPS"]["Spirit Damage"] = {speed: 1.2, count: 3, fpa: 57.142834, round: "up", nobp: true};
        }
      }
      if (stats.leg_gazingdemise && this.params[0].val) {
        var pct = {};
        pct[DiabloCalc.itemById.P42_Unique_Mojo_003_x1.name] = this.params[0].val * stats.leg_gazingdemise;
        res["Damage"].percent = pct;
        if (res["Spirit Damage"]) {
          res["Spirit Damage"].percent = pct;
        }
        if (rune !== "c") {
          res["Phantasm Damage"] = {elem: res["Damage"].elem, coeff: 7.5, total: true, percent: pct};
          res["DPS"]["Phantasm Damage"] = {count: this.params[0].val, divide: 5};
        }
      }
      return $.extend({"Cost": {cost: 100}}, res);
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
    range: {x: 100, b: 100, c: 100, d: 100, e: 30, a: 100},
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "psn", coeff: 3, addcoeff: [3.6], total: 0}}; break;
      case "b": res = {"Damage": {elem: "psn", coeff: 3, addcoeff: [3.6], total: 0}}; break;
      case "c": res = {"Damage": {elem: "psn", coeff: 3, addcoeff: [6], total: 0}}; break;
      case "d": res = {"Damage": {elem: "col", coeff: 3, addcoeff: [7.2], total: 0}}; break;
      case "e": res = {"Damage": {elem: "psn", coeff: 3.33, addcoeff: [4], total: 0}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 7}}; break;
      }
      if (rune !== "c" && stats.leg_suwongdiviner) {
        res["Blob Damage"] = {elem: "psn", coeff: 6, total: true};
      }
      return $.extend({"Cost": {cost: 175}}, res);
    },
  },
  wallofdeath: {
    oldid: "wallofzombies",
    id: "wall-of-death",
    name: "Wall of Death",
    category: "decay",
    row: 4,
    col: 3,
    runes: {
      b: "Ring of Poison",
      d: "Wall of Zombies",
      a: "Surrounded by Death",
      e: "Fire Wall",
      c: "Communicating with Spirits",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 12, total: true}}; break;
      case "b": res = {"Damage": {elem: "psn", coeff: 12, total: true}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 12, total: true}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 12.5, total: true}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 11, total: true}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 12, total: true}}; break;
      }
      return $.extend({"Cooldown": {cooldown: 8}}, res);
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
      if (stats.leg_theshortmansfinger || stats.leg_theshortmansfinger_p6) count = 3;
      var res;
      switch (rune) {
      case "x": res = {"Damage": $.extend(base, {elem: "phy", coeff: 4.5})}; break;
      case "b": res = {"Damage": $.extend(base, {elem: "col", coeff: 5.85})}; break;
      case "a": res = {"Damage": $.extend(true, base, {elem: "phy", coeff: 4.5, percent: {"Enrage": 200}})}; break;
      case "d": res = {"Damage": $.extend(base, {elem: "fir", coeff: 5.75})}; break;
      case "c": res = {"Damage": $.extend(base, {elem: "psn", coeff: 4.5}), "Poison DPS": $.extend(base, {elem: "psn", coeff: 1.35, total: true})}; break;
      case "e": res = {"Damage": $.extend(base, {elem: "fir", coeff: 4.5}), "Slam Damage": $.extend(base, {elem: "fir", coeff: 2})}; break;
      }
      res["DPS"] = {sum: true, "Damage": {pet: 84, count: count}};
      if (rune === "a") res["DPS"]["Damage"].ias = 35;
      if (rune === "c") res["DPS"]["Poison DPS"] = {count: count};
      return $.extend({"Cooldown": {cooldown: 60 * (stats.passives.tribalrites ? 0.75 : 1)}}, res);
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
      x: {ias: 15, extrams: 15},
      b: {ias: 15, extrams: 15},
      d: {ias: 15, extrams: 15, manaregen: 250},
      a: {ias: 15, extrams: 15, damage: 15},
      c: {ias: 15, extrams: 15, dmgred: 20},
      e: {ias: 15, extrams: 15},
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
    info: function(rune, stats) {
      var elem = DiabloCalc.skilltips.witchdoctor.fetisharmy.elements[rune];
      var data = {"Cooldown": {cooldown: (rune === "d" ? 90 : 120)}, "Dagger Damage": {elem: elem, pet: true, aps: true, coeff: 1.8}};
      if (stats.passives.tribalrites) data["Cooldown"].cooldown *= 0.75;
      if (stats.set_zunimassa_2pc) data["Cooldown"].cooldown *= 0.2;
      var count = 5;
      switch (rune) {
      case "a": data["Explosion Damage"] = {elem: "col", coeff: 6.8}; break;
      case "b": count = 8; break;
      case "c": data["Torcher Damage"] = {elem: "fir", pet: true, aps: true, coeff: 0.85}; break;
      case "e": data["Dart Damage"] = {elem: "psn", pet: true, aps: true, coeff: 1.3}; break;
      }
      data["Total DPS"] = {sum: true, "Dagger Damage": {pet: 48, count: count}};
      if (rune === "c") data["Total DPS"]["Torcher Damage"] = {pet: 42, count: 2};
      if (rune === "e") data["Total DPS"]["Dart Damage"] = {pet: 42, count: 2};
      if (stats.leg_carnevil && stats.skills.poisondart) {
        count -= (rune === "c" || rune === "e" ? 3 : 5);
        data["Non-Carnevil DPS"] = {sum: true, tip: "DPS from fetishes not shooting Carnevil darts."};
        if (count) data["Non-Carnevil DPS"]["Dagger Damage"] = {pet: 48, count: count};
      }
      return data;
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
    buffs: {maxmana_percent: 10, manaregen_percent: 2},
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
    buffs: {rcr_mana: 20, regen_percent: 1},
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
    params: (DiabloCalc.itemaffixes&&DiabloCalc.itemaffixes.leg_beltoftranscendence.params||[{min: 0, max: 15, name: "Count", buffs: false,
      show: function(stats) {return !!this.id || !stats.passives.fetishsycophants;}}]),
    //params: [{min: 0, max: 15, name: "Count", buffs: false}],
    info: function(stats) {
      return {"Fetish Damage": {elem: "max", pet: true, aps: true, coeff: 1.8, percent: {"Army %": stats.skill_witchdoctor_fetisharmy}},
              "Fetish DPS": {sum: true, "Fetish Damage": {pet: 48}},
              "Total DPS": {sum: true, "Fetish DPS": {count: this.params[0].val}},
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
    buffs: {resourcegen: 40},
  },
  fierceloyalty: {
    id: "fierce-loyalty",
    name: "Fierce Loyalty",
    index: 12,
    buffs: {extrams: 15},
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
  confidenceritual: {
    id: "confidence-ritual",
    name: "Confidence Ritual",
    index: 18,
    active: true,
    buffs: {dmgmul: 25},
  },
  creepingdeath: {
    id: "creeping-death",
    name: "Creeping Death",
    index: 15,
  },
  swamplandattunement: {
    oldid: "physicalattunement",
    id: "swampland-attunement",
    name: "Swampland Attunement",
    index: 16,
    params: [{min: 0, max: 25, val: 0, name: "Nearby Enemies"}],
    buffs: function(stats) {return {
      resphy: 120 * this.params[0].val,
      respsn: 120 * this.params[0].val,
      resfir: 120 * this.params[0].val,
      rescol: 120 * this.params[0].val,
    };},
  },
  midnightfeast: {
    id: "midnight-feast",
    name: "Midnight Feast",
    index: 17,
    buffs: {dmgmul: {skills: ["summonzombiedogs", "gargantuan"], percent: 50}},
  },
};
DiabloCalc.partybuffs.witchdoctor = {
  summonzombiedogs: { // ptr
    runelist: "d",
  },
  hex: {
    runelist: "ae",
  },
  piranhas: {
    runelist: "x",
    buffs: function(stats) {
      return {dmgtaken: 15};
    },
  },
  bigbadvoodoo: {
    runelist: "*",
  },
};
DiabloCalc.extraskills.witchdoctor = {
  hex_explode: {
    skill: "hex",
    required: function(stats) { return stats.skills.hex === "b"; },
    name: "Hex Explode",
    row: 6,
    col: 0,
    tip: "<div class=\"tooltip-body \"> <span class=\"d3-icon d3-icon-skill d3-icon-skill-64 \" style=\"background-image: url('http://media.blizzard.com/d3/icons/skills/64/witchdoctor_hex_explode.png'); width: 64px; height: 64px;\"> <span class=\"frame\"></span> </span> <div class=\"description\"> <p>Explode for <span class=\"d3-color-green\">1350%</span> weapon damage as Physical to all nearby enemies.</p> </div> </div>",
  },
};

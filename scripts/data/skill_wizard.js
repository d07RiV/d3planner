if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.wizard = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  force: "Force",
  conjuration: "Conjuration",
  mastery: "Mastery",
};
DiabloCalc.skills.wizard = {
  magicmissile: {
    id: "magic-missile",
    name: "Magic Missile",
    category: "primary",
    row: 0,
    col: 0,
    runes: { 
      a: "Charged Blast",
      d: "Glacial Spike",
      b: "Split",
      e: "Seeker",
      c: "Conflagrate",
    },
    info: function(rune, stats) {
      var mm = (stats.leg_mirrorball || 0) + 1;
      switch (rune) {
      case "x": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: mm}}, "Damage": {elem: "arc", coeff: 2.3}};
      case "a": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: mm}}, "Damage": {elem: "arc", coeff: 3.25}};
      case "d": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: mm}}, "Damage": {elem: "col", coeff: 1.75}};
      case "b": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: 2 + mm}}, "Damage": {elem: "arc", coeff: 0.8}};
      case "e": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: mm}}, "Damage": {elem: "arc", coeff: 2.85}};
      case "c": return {"DPS": {sum: true, "Damage": {speed: 1, fpa: 57.6, round: "up", count: mm}, "Burn Damage": {factor: Math.min(1, stats.info.aps * (1 + mm))}}, "Damage": {elem: "fir", coeff: 2.3}, "Burn Damage": {elem: "fir", coeff: 1.3, total: true}};
      }
    },
  },
  shockpulse: {
    id: "shock-pulse",
    name: "Shock Pulse",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      e: "Explosive Bolts",
      a: "Fire Bolts",
      c: "Piercing Orb",
      d: "Power Affinity",
      b: "Living Lightning",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {count: 3, fpa: 57.142834, round: "up", speed: 1}}},
      x: {"Damage": {elem: "lit", coeff: 1.94}},
      e: {"Damage": {elem: "col", coeff: 1.94}},
      a: {"Damage": {elem: "fir", coeff: 2.74}},
      c: {"DPS": {sum: true, "Damage": {fpa: 57.142834, round: "up", speed: 1}}, "Damage": {elem: "lit", coeff: 2.14}},
      d: {"Damage": {elem: "arc", coeff: 1.94}},
      b: {"Damage": {elem: "lit", coeff: 0.33}},
    },
  },
  spectralblade: {
    id: "spectral-blade",
    name: "Spectral Blade",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      a: "Flame Blades",
      d: "Siphoning Blade",
      b: "Thrown Blade",
      e: "Barrier Blades",
      c: "Ice Blades",
    },
    info: {
      "*": {"DPS": {sum: true, fpa: 56.25, round: "up", "Damage": 1}},
      x: {"Damage": {elem: "arc", coeff: 1.68}},
      a: {"Damage": {elem: "fir", coeff: 1.68}},
      d: {"Damage": {elem: "arc", coeff: 1.68}},
      b: {"Damage": {elem: "lit", coeff: 2.31}},
      e: {"Damage": {elem: "arc", coeff: 1.68}},
      c: {"Damage": {elem: "col", coeff: 1.68}},
    },
    active: true,
    params: [{rune: "a", name: "Stacks", min: 0, max: 50, val: 0, inf: true}],
    buffs: function(rune, stats) {
      if (rune === "a") {
        return {dmgfir: this.params[0].val};
      }
    },
  },
  electrocute: {
    id: "electrocute",
    name: "Electrocute",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      b: "Chain Lightning",
      e: "Forked Lightning",
      a: "Lightning Blast",
      d: "Surge of Power",
      c: "Arc Lightning",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {speed: 1, fpa: 30}}},
      x: {"Damage": {elem: "lit", coeff: 1.38, divide: {"Base Speed": 2}}},
      b: {"Damage": {elem: "lit", coeff: 1.38, divide: {"Base Speed": 2}}},
      e: {"Damage": {elem: "fir", coeff: 1.38, divide: {"Base Speed": 2}}, "Spark Damage": {elem: "fir", coeff: 0.44}},
      a: {"Damage": {elem: "lit", coeff: 1.4}},
      d: {"Damage": {elem: "lit", coeff: 1.38, divide: {"Base Speed": 2}}},
      c: {"Damage": {elem: "lit", coeff: 3.10, divide: {"Base Speed": 2}}},
    },
  },
  rayoffrost: {
    id: "ray-of-frost",
    name: "Ray of Frost",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      d: "Cold Blood",
      c: "Numb",
      e: "Black Ice",
      b: "Sleet Storm",
      a: "Snow Blast",
    },
    params: [{min: 0, max: 2, val: 2, name: "Channeled for", buffs: false}],
    info: {
      "*": {"Cost": {cost: 16, fpa: 30}, "DPS": {elem: "col", aps: true, coeff: 4.3, addcoeff: [[4.05, "$1"]], total: true}},
      d: {"Cost": {cost: 11, fpa: 30}},
      e: {"Patch Damage": {elem: "col", coeff: 16.25, total: true}},
      b: {"DPS": {elem: "col", aps: true, coeff: 3, addcoeff: [[2.2, "$1"]], total: true}},
    },
    active: true,
    buffs: {
      a: {dmgtaken: {elems: ["col"], percent: 15}},
    },
  },
  arcaneorb: {
    id: "arcane-orb",
    name: "Arcane Orb",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      a: "Obliteration",
      c: "Arcane Orbit",
      b: "Spark",
      d: "Scorch",
      e: "Frozen Orb",
    },
    info: {
      "*": {"Cost": {cost: 30}},
      x: {"Damage": {elem: "arc", coeff: 4.35}},
      a: {"Damage": {elem: "arc", coeff: 7}},
      c: {"Damage": {elem: "arc", coeff: 2.65}},
      b: {"Damage": {elem: "lit", coeff: 3.49}},
      d: {"Damage": {elem: "fir", coeff: 2.21}, "Burn Damage": {elem: "fir", coeff: 7.34, total: true}},
      e: {"Explosion Damage": {elem: "col", coeff: 3.93}, "Projectile Damage": {elem: "col", coeff: 2.62}, "Shard Damage": {elem: "col", coeff: 1.28}},
    },
    active: false,
    params: [{rune: "b", min: 0, max: 20, val: 0, name: "Enemies Hit", inf: true}],
    buffs: function(rune, stats) {
      if (rune === "b" && this.params[0].val) {
        return {dmgmul: {elems: ["lit"], percent: this.params[0].val * 2}};
      }
    },
  },
  arcanetorrent: {
    id: "arcane-torrent",
    name: "Arcane Torrent",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      a: "Flame Ward",
      e: "Death Blossom",
      c: "Arcane Mines",
      d: "Static Discharge",
      b: "Cascade",
    },
    params: [{min: 0, max: 2, val: 2, name: "Channeled for", buffs: false}],
    info: {
      "*": {"Cost": {cost: 16, fpa: 20}},
      x: {"Tick Damage": {elem: "arc", coeff: 4, addcoeff: [[3.05, "$1"]], divide: {"Base Speed": 3}}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 20}}},
      a: {"Tick Damage": {elem: "fir", coeff: 4, addcoeff: [[3.05, "$1"]], divide: {"Base Speed": 3}}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 20}}},
      e: {"Cost": {cost: 16, fpa: 30}, "Tick Damage": {elem: "arc", coeff: 12.15, addcoeff: [[6.4, "$1"]], divide: {"Base Speed": 2}}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 30}}},
      c: {"Cost": {cost: 16, fpa: 40}, "Damage": {elem: "arc", coeff: 8.25}},
      d: {"Tick Damage": {elem: "lit", coeff: 4, addcoeff: [[3.05, "$1"]], divide: {"Base Speed": 3}}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 20}}, "Bolt Damage": {elem: "lit", coeff: 1.5}},
      b: {"Tick Damage": {elem: "arc", coeff: 4, addcoeff: [[3.05, "$1"]], divide: {"Base Speed": 3}}, "DPS": {sum: true, "Tick Damage": {speed: 1, fpa: 20}}, "Secondary Damage": {elem: "arc", coeff: 5.82}},
    },
    active: true,
    buffs: function(rune, stats) {
      if (rune === "a") {
        return {dmgred: 15 + 5 * this.params[0].val};
      }
    },
  },
  disintegrate: {
    id: "disintegrate",
    name: "Disintegrate",
    category: "secondary",
    row: 1,
    col: 3,
    runes: {
      b: "Convergence",
      e: "Volatility",
      c: "Entropy",
      d: "Chaos Nexus",
      a: "Intensify",
    },
    params: [{min: 0, max: 2, val: 2, name: "Channeled for", buffs: false}],
    info: {
      "*": {"Cost": {cost: 18, fpa: 20}},
      x: {"DPS": {elem: "arc", aps: true, coeff: 3.9, addcoeff: [[2.5, "$1"]], total: true}},
      b: {"DPS": {elem: "fir", aps: true, coeff: 3.9, addcoeff: [[2.5, "$1"]], total: true}},
      e: {"DPS": {elem: "arc", aps: true, coeff: 3.9, addcoeff: [[2.5, "$1"]], total: true}, "Explosion Damage": {elem: "arc", coeff: 7.5}},
      c: {"DPS": {elem: "arc", aps: true, coeff: 4.35, addcoeff: [[3.4, "$1"]], total: true}},
      d: {"DPS": {elem: "arc", aps: true, coeff: 3.9, addcoeff: [[2.5, "$1"]], total: true}, "Secondary Damage": {elem: "arc", coeff: 1.15}},
      a: {"DPS": {elem: "arc", aps: true, coeff: 3.9, addcoeff: [[2.5, "$1"]], total: true}},
    },
    active: true,
    buffs: {
      a: {dmgtaken: {elems: ["arc"], percent: 15}},
    },
  },
  frostnova: {
    id: "frost-nova",
    name: "Frost Nova",
    category: "defensive",
    row: 2,
    col: 0,
    nolmb: true,
    runes: {
      b: "Shatter",
      d: "Cold Snap",
      c: "Frozen Mist",
      e: "Deep Freeze",
      a: "Bone Chill",
    },
    info: {
      "*": {"Cooldown": {cooldown: 11}},
      d: {"Cooldown": {cooldown: 7.5}},
      c: {"Damage": {elem: "col", coeff: 9.15, total: true}},
    },
    active: false,
    buffs: {
      e: {chc: 10},
      a: {dmgtaken: 33},
    },
  },
  diamondskin: {
    id: "diamond-skin",
    name: "Diamond Skin",
    category: "defensive",
    row: 2,
    col: 1,
    nolmb: true,
    runes: {
      c: "Crystal Shell",
      d: "Prism",
      a: "Sleek Shell",
      b: "Enduring Skin",
      e: "Diamond Shards",
    },
    info: {
      "*": {"Cooldown": {cooldown: 15}},
      e: {"Damage": {elem: "arc", coeff: 8.63}},
    },
    active: false,
    buffs: {
      d: {rcrint: 9},
    },
  },
  slowtime: {
    id: "slow-time",
    name: "Slow Time",
    category: "defensive",
    row: 2,
    col: 2,
    runes: {
      c: "Time Shell",
      d: "Exhaustion",
      a: "Time Warp",
      b: "Point of No Return",
      e: "Stretch Time",
    },
    info: function(rune, stats) {
      var res = {"Cooldown": {cooldown: (rune === "c" ? 12 : 15), rcr: (stats.leg_gestureoforpheus || stats.leg_gestureoforpheus_p2 || 0)}};
      if (stats.set_magnumopus_4pc) {
        res["DPS"] = {elem: "max", coeff: 20, total: true};
      }
      return res;
    },
    active: false,
    buffs: function(rune, stats) {
      if (stats.leg_crownoftheprimus) {
        return {dmgtaken: 15, ias: 10};
      } else {
        switch (rune) {
        case "a": return {dmgtaken: 15};
        case "e": return {ias: 10};
        }
      }
    },
  },
  teleport: {
    id: "teleport",
    name: "Teleport",
    category: "defensive",
    row: 2,
    col: 3,
    runes: {
      c: "Safe Passage",
      e: "Wormhole",
      d: "Reversal",
      b: "Fracture",
      a: "Calamity",
    },
    info: function(rune, stats) {
      var obj = (stats.leg_aetherwalker ? {"Cost": {cost: 25}} : {"Cooldown": {cooldown: 11}});
      if (rune === "a") {
        obj["Damage"] = {elem: "arc", coeff: 1.75};
      }
      return obj;
    },
    active: false,
    buffs: {
      c: {dmgred: 25},
    },
  },
  waveofforce: {
    id: "wave-of-force",
    name: "Wave of Force",
    category: "force",
    row: 3,
    col: 0,
    runes: {
      a: "Impactful Wave",
      e: "Debilitating Force",
      d: "Arcane Attunement",
      b: "Static Pulse",
      c: "Heat Wave",
    },
    info: {
      "*": {"Cost": {cost: 25}},
      x: {"Damage": {elem: "arc", coeff: 3.9}},
      a: {"Cooldown": {cooldown: 5}, "Damage": {elem: "arc", coeff: 3.9}},
      e: {"Damage": {elem: "arc", coeff: 3.9}},
      d: {"Damage": {elem: "arc", coeff: 3.9}},
      b: {"Damage": {elem: "lit", coeff: 3.9}},
      c: {"Damage": {elem: "fir", coeff: 4.75}},
    },
    active: false,
    params: [{rune: "d", min: 0, max: 20, val: 0, name: "Enemies Hit", inf: true}],
    buffs: function(rune, stats) {
      if (rune === "d" && this.params[0].val) {
        return {dmgmul: {elems: ["arc"], percent: this.params[0].val * 4}};
      }
    },
  },
  energytwister: {
    id: "energy-twister",
    name: "Energy Twister",
    category: "force",
    row: 3,
    col: 1,
    runes: {
      d: "Mistral Breeze",
      a: "Gale Force",
      b: "Raging Storm",
      e: "Wicked Wind",
      c: "Storm Chaser",
    },
    params: [{rune: "c", min: 1, max: 3, name: "Charges", buffs: false}],
    info: {
      "*": {"Cost": {cost: 35}},
      x: {"Damage": {elem: "arc", coeff: 15.25, total: true}},
      d: {"Damage": {elem: "col", coeff: 15.25, total: true}, "Cost": {cost: 25}},
      a: {"Damage": {elem: "fir", coeff: 15.25, total: true}},
      b: {"Damage": {elem: "arc", coeff: 15.25, total: true}, "Large Tornado Damage": {elem: "arc", coeff: 32, total: true}},
      e: {"Damage": {elem: "arc", coeff: 8.35, total: true}},
      c: {"Damage": {elem: "lit", coeff: 15.25, total: true}, "Bolt Damage": {elem: "lit", addcoeff: [[1.96, "$1"]]}},
    },
    active: true,
    buffs: {
      a: {dmgtaken: {elems: ["fir"], percent: 15}},
    },
  },
  hydra: {
    id: "hydra",
    name: "Hydra",
    category: "force",
    row: 3,
    col: 2,
    runes: {
      e: "Arcane Hydra",
      b: "Lightning Hydra",
      c: "Blazing Hydra",
      a: "Frost Hydra",
      d: "Mammoth Hydra",
    },
    params: [{min: 1, max: "leg_serpentssparker?2:1", name: "Hydras", buffs: false},
             {min: 0, max: 50, val: 30, name: "Distance", buffs: false, show: function(rune, stats) {
               return rune === "d" || stats.gems.zei;
             }}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "fir", pet: true, coeff: 1.65}}; break;
      case "e": res = {"Damage": {elem: "arc", pet: true, coeff: 2.05}}; break;
      case "b": res = {"Damage": {elem: "lit", pet: true, coeff: 2.55}}; break;
      case "c": res = {"Burn Damage": {elem: "fir", pet: true, coeff: 1.55, total: true}}; break;
      case "a": res = {"Damage": {elem: "col", pet: true, coeff: 2.55}}; break;
      case "d": res = {"Tick Damage": {elem: "fir", pet: true, coeff: 0.99, total: true}}; break;
      }
      if (rune !== "d") {
        var key = (rune === "c" ? "Burn Damage" : "Damage");
        if (stats.gems.zei) {
          res[key].exclude = ["zei"];
          res[key].percent = {"Zei's Stone of Vengeance": this.params[1].val * (4 + 0.05 * stats.gems.zei) / 10};
        }
        res["DPS"] = {sum: true};
        res["DPS"][key] = {pet: (rune === "a" ? 86 : 76.300583), area: false, speed: 1, count: 3 * this.params[0].val};
      } else {
        if (stats.gems.zei) {
          res["Tick Damage"].exclude = ["zei"];
          res["Tick Damage"].percent = {"Zei's Stone of Vengeance": this.params[1].val * (4 + 0.05 * stats.gems.zei) / 10};
        }
        var duration = 5 - this.params[1].val * 1.8 / 50;
        res["Layer Damage"] = {sum: true, "Tick Damage": {count: Math.floor(duration / 0.3)}};
        res["DPS"] = {sum: true, "Layer Damage": {pet: 76.595741, area: false, speed: 1, count: this.params[0].val}};
      }
      return $.extend({"Cost": {cost: 15}}, res);
    },
  },
  meteor: {
    id: "meteor",
    name: "Meteor",
    category: "force",
    row: 3,
    col: 3,
    runes: {
      e: "Thunder Crash",
      d: "Star Pact",
      c: "Comet",
      b: "Meteor Shower",
      a: "Molten Impact",
    },
    info: function(rune, stats) {
      var res = {
        x: {"Damage": {elem: "fir", coeff: 7.4, addcoeff: [2.35], total: 0}},
        e: {"Damage": {elem: "lit", coeff: 7.4, addcoeff: [2.35], total: 0}},
        d: {"Damage": {elem: "arc", coeff: 7.4, addcoeff: [2.35], total: 0}, "Max Damage": {elem: "arc", coeff: 7.4, addcoeff: [[0.2, "maxap-40*(1-0.01*rcr)*(1-0.01*leg_thegrandvizier)"], 2.35], total: 1}},
        c: {"Damage": {elem: "col", coeff: 7.4, addcoeff: [2.35], total: 0}},
        b: {"Damage": {elem: "fir", coeff: 2.77, addcoeff: [0.70], total: 0}, "Total Damage": {sum: true, "Damage": {count: 7}}, "Average Damage": {sum: true, tip: "Small target gets hit by 2.5 meteors, on average", "Damage": {count: 2.5}}},
        a: {"Cooldown": {cooldown: 15}, "Damage": {elem: "fir", coeff: 16.48, addcoeff: [6.25], total: 0}},
      }[rune];
      res = $.extend({"Cost": {cost: 40, rcr: "leg_thegrandvizier"}}, res);
      if (rune === "d" && DiabloCalc.isSkillActive("arcanedynamo")) {
        res["Damage"].percent = {"Arcane Dynamo (bug)": 60};
        res["Max Damage"].percent = {"Arcane Dynamo (bug)": 60};
      }
      return res;
    },
  },
  blizzard: {
    id: "blizzard",
    name: "Blizzard",
    category: "force",
    row: 3,
    col: 4,
    runes: {
      c: "Lightning Storm",
      e: "Frozen Solid",
      d: "Snowbound",
      b: "Apocalypse",
      a: "Unrelenting Storm",
    },
    info: {
      "*": {"Cost": {cost: 40}},
      x: {"Damage": {elem: "col", coeff: 10.75, total: true}, "DPS": {sum: true, "Damage": {divide: 6}}},
      c: {"Damage": {elem: "lit", coeff: 10.75, total: true}, "DPS": {sum: true, "Damage": {divide: 6}}},
      e: {"Damage": {elem: "col", coeff: 10.75, total: true}, "DPS": {sum: true, "Damage": {divide: 6}}},
      d: {"Damage": {elem: "col", coeff: 10.75, total: true}, "DPS": {sum: true, "Damage": {divide: 6}}, "Cost": {cost: 10}},
      b: {"Damage": {elem: "fir", coeff: 10.75, total: true}, "DPS": {sum: true, "Damage": {divide: 6}}},
      a: {"Damage": {elem: "col", coeff: 18.10, total: true}, "DPS": {sum: true, "Damage": {divide: 8}}},
    },
    active: true,
    buffs: {
      c: {dmgtaken: {elems: ["lit"], percent: 15}},
    },
  },
  icearmor: {
    id: "ice-armor",
    name: "Ice Armor",
    category: "conjuration",
    row: 4,
    col: 0,
    nolmb: true,
    runes: {
      b: "Chilling Aura",
      d: "Crystallize",
      a: "Jagged Ice",
      e: "Ice Reflect",
      c: "Frozen Storm",
    },
    info: {
      "*": {"Cost": {cost: 25}},
      a: {"Damage": {elem: "col", coeff: 1.89}},
      e: {"Damage": {elem: "col", coeff: 0.75}},
      c: {"DPS": {elem: "col", aps: true, coeff: 0.8, total: true}},
    },
    active: true,
    params: [{rune: "d", min: 0, max: 3, name: "Stacks"}],
    buffs: function(rune, stats) {
      var mdef = (stats.leg_haloofarlyse || 12);
      switch (rune) {
      case "x": return {meleedef: mdef};
      case "b": return {meleedef: mdef};
      case "d": return {meleedef: mdef, armor_percent: this.params[0].val * 20};
      case "a": return {meleedef: mdef};
      case "e": return {meleedef: mdef};
      case "c": return {meleedef: mdef};
      }
    },
  },
  stormarmor: {
    id: "storm-armor",
    name: "Storm Armor",
    category: "conjuration",
    row: 4,
    col: 1,
    nolmb: true,
    runes: {
      c: "Reactive Armor",
      d: "Power of the Storm",
      a: "Thunder Storm",
      b: "Scramble",
      e: "Shocking Aspect",
    },
    info: {
      "*": {"Cost": {cost: 25}},
      x: {"Damage": {elem: "lit", coeff: 1.75}},
      c: {"Damage": {elem: "lit", coeff: 1.75}, "Thorns Damage": {elem: "lit", coeff: 1.89}},
      d: {"Damage": {elem: "lit", coeff: 1.75}},
      a: {"Damage": {elem: "lit", coeff: 3.15}},
      b: {"Damage": {elem: "lit", coeff: 1.75}},
      e: {"Damage": {elem: "lit", coeff: 1.75}, "Electrocute Damage": {elem: "lit", coeff: 4.25}},
    },
    active: true,
    buffs: {
      d: {rcrint: 3},
    },
  },
  magicweapon: {
    id: "magic-weapon",
    name: "Magic Weapon",
    category: "conjuration",
    row: 4,
    col: 2,
    nolmb: true,
    runes: {
      b: "Electrify",
      c: "Force Weapon",
      d: "Conduit",
      a: "Ignite",
      e: "Deflection",
    },
    info: {
      "*": {"Cost": {cost: 25}},
      b: {"Zap Damage": {elem: "lit", coeff: 0.61}},
      a: {"Burn Damage": {elem: "fir", coeff: 3, total: true}},
    },
    active: true,
    buffs: {
      x: {damage: 10},
      b: {damage: 10},
      c: {damage: 20},
      d: {damage: 10},
      a: {damage: 10},
      e: {damage: 10},
    },
  },
  familiar: {
    id: "familiar",
    name: "Familiar",
    category: "conjuration",
    row: 4,
    col: 3,
    nolmb: true,
    runes: {
      a: "Sparkflint",
      c: "Icicle",
      e: "Ancient Guardian",
      d: "Arcanot",
      b: "Cannoneer",
    },
    info: {
      "*": {"Cost": {cost: 20}},
      x: {"Damage": {elem: "arc", coeff: 2.4}},
      a: {"Damage": {elem: "fir", coeff: 2.4}},
      c: {"Damage": {elem: "col", coeff: 2.4}},
      e: {"Damage": {elem: "arc", coeff: 2.4}},
      d: {"Damage": {elem: "arc", coeff: 2.4}},
      b: {"Damage": {elem: "arc", coeff: 2.4}},
    },
    active: true,
    buffs: {
      a: {damage: 10},
      d: {apregen: 4.5},
    },
  },
  energyarmor: {
    id: "energy-armor",
    name: "Energy Armor",
    category: "conjuration",
    row: 4,
    col: 4,
    nolmb: true,
    runes: {
      d: "Absorption",
      e: "Pinpoint Barrier",
      b: "Energy Tap",
      c: "Force Armor",
      a: "Prismatic Armor",
    },
    info: {
      "*": {"Cost": {cost: 25}},
    },
    active: true,
    buffs: {
      x: {armor_percent: 35, maxap: -20},
      d: {armor_percent: 35, maxap: -20},
      e: {armor_percent: 35, maxap: -20, chc: 5},
      b: {armor_percent: 35, maxap: 20},
      c: {armor_percent: 35, maxap: -20},
      a: {armor_percent: 35, maxap: -20, resist_percent: 25},
    },
  },
  explosiveblast: {
    id: "explosive-blast",
    name: "Explosive Blast",
    category: "mastery",
    row: 5,
    col: 0,
    nolmb: true,
    runes: {
      d: "Unleashed",
      c: "Flash",
      a: "Short Fuse",
      b: "Obliterate",
      e: "Chain Reaction",
    },
    info: {
      "*": {"Cost": {cost: 20}},
      x: {"Damage": {elem: "arc", coeff: 9.45}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?4:1", cd: 6}}},
      d: {"Damage": {elem: "arc", coeff: 14.85}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?4:1", cd: 6}}},
      c: {"Damage": {elem: "lit", coeff: 9.45}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?4:1", cd: 3}}},
      a: {"Damage": {elem: "fir", coeff: 9.09}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?4:1", cd: 6}}},
      b: {"Damage": {elem: "col", coeff: 9.9}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?4:1", cd: 6}}},
      e: {"Damage": {elem: "fir", coeff: 5.2}, "DPS": {sum: true, "Damage": {count: "leg_wandofwoh?12:3", cd: 6}}},
    },
  },
  mirrorimage: {
    id: "mirror-image",
    name: "Mirror Image",
    category: "mastery",
    row: 5,
    col: 1,
    runes: {
      c: "Simulacrum",
      b: "Duplicates",
      e: "Mocking Demise",
      d: "Extension of Will",
      a: "Mirror Mimics",
    },
    info: {
      "*": {"Cooldown": {cooldown: 15}},
      e: {"Explosion Damage": {elem: "arc", coeff: 3.09}},
    },
  },
  archon: {
    id: "archon",
    name: "Archon",
    category: "mastery",
    row: 5,
    col: 2,
    runes: {
      e: "Combustion",
      c: "Teleport",
      d: "Pure Power",
      b: "Slow Time",
      a: "Improved Archon",
    },
    info: function(rune, stats) {
      var uptime = {duration: 20, cooldown: (rune == "d" || stats.set_vyr_4pc ? 100 : 120)};
      if (stats.set_vyr_4pc) {
        var elem;
        switch (rune) {
        case "e": elem = "fir"; break;
        case "d": elem = "lit"; break;
        case "b": elem = "col"; break;
        default: elem = "arc";
        }
        return {"Explosion Damage": {elem: elem, coeff: 36.8, bonuses: {"Improved": 22}}, "Arcane Strike Damage": {elem: "max", coeff: 7.9, bonuses: {"Improved": 22}}, "Disintegration Wave DPS": {elem: "fir", aps: true, coeff: 7.79, bonuses: {"Improved": 22}, total: true}, "Arcane Blast Damage": {elem: "max", coeff: 6.04, bonuses: {"Improved": 22}}, "Uptime": uptime};
      } else {
        switch (rune) {
          case "x": return {"Arcane Strike Damage": {elem: "arc", coeff: 7.9}, "Disintegration Wave DPS": {elem: "arc", aps: true, coeff: 7.79, total: true}, "Arcane Blast Damage": {elem: "arc", coeff: 6.04}, "Uptime": uptime};
          case "e": return {"Explosion Damage": {elem: "fir", coeff: 36.8}, "Arcane Strike Damage": {elem: "fir", coeff: 7.9}, "Disintegration Wave DPS": {elem: "fir", aps: true, coeff: 7.79, total: true}, "Arcane Blast Damage":  {elem: "fir", coeff: 6.04}, "Uptime": uptime};
          case "c": return {"Arcane Strike Damage": {elem: "arc", coeff: 7.9}, "Disintegration Wave DPS": {elem: "arc", aps: true, coeff: 7.79, total: true}, "Arcane Blast Damage": {elem: "arc", coeff: 6.04}, "Uptime": uptime};
          case "d": return {"Arcane Strike Damage": {elem: "lit", coeff: 7.9}, "Disintegration Wave DPS": {elem: "lit", aps: true, coeff: 7.79, total: true}, "Arcane Blast Damage": {elem: "lit", coeff: 6.04}, "Uptime": uptime};
          case "b": return {"Arcane Strike Damage": {elem: "col", coeff: 7.9}, "Disintegration Wave DPS": {elem: "col", aps: true, coeff: 7.79, total: true}, "Arcane Blast Damage": {elem: "col", coeff: 6.04}, "Uptime": uptime};
          case "a": return {"Arcane Strike Damage": {elem: "arc", coeff: 7.9, bonuses: {"Improved": 22}}, "Disintegration Wave DPS": {elem: "fir", aps: true, coeff: 7.79, bonuses: {"Improved": 22}, total: true}, "Arcane Blast Damage": {elem: "arc", coeff: 6.04, bonuses: {"Improved": 22}}, "Uptime": uptime};
        }
      }
    },
    active: false,
    params: [{min: 0, max: 50, val: 0, name: "Damage Stacks", inf: true}],
    buffs: function(rune, stats) {
      return {damage: 20 + 6 * this.params[0].val, armor_percent: 20, resist_percent: 20};
    },
  },
  blackhole: {
    id: "black-hole",
    name: "Black Hole",
    category: "mastery",
    row: 5,
    col: 3,
    runes: {
      a: "Supermassive",
      e: "Absolute Zero",
      b: "Event Horizon",
      c: "Blazar",
      d: "Spellsteal",
    },
    info: {
      "*": {"Cost": {cost: 20}, "Cooldown": {cooldown: 12}},
      x: {"Damage": {elem: "arc", coeff: 7, total: true}},
      a: {"Damage": {elem: "lit", coeff: 12.9, total: true}},
      e: {"Damage": {elem: "col", coeff: 7, total: true}},
      b: {"Damage": {elem: "arc", coeff: 7, total: true}},
      c: {"Damage": {elem: "fir", coeff: 7, total: true}, "Explosion Damage": {elem: "fir", coeff: 7.25}},
      d: {"Damage": {elem: "arc", coeff: 7, total: true}},
    },
    active: false,
    params: [{rune: "ed", min: 0, max: 25, val: 0, name: "Enemies Hit", inf: true}],
    buffs: function(rune, stats) {
      if (rune === "e") return {damage: {elems: ["col"], percent: 3 * this.params[0].val}};
      if (rune === "d") return {damage: 3 * this.params[0].val};
    },
  },
};
DiabloCalc.passives.wizard = {
  powerhungry: {
    id: "power-hungry",
    name: "Power Hungry",
    index: 0,
  },
  blur: {
    id: "blur",
    name: "Blur",
    index: 1,
    buffs: {dmgred: 17},
  },
  evocation: {
    id: "evocation",
    name: "Evocation",
    index: 2,
    buffs: {cdr: 20},
  },
  glasscannon: {
    id: "glass-cannon",
    name: "Glass Cannon",
    index: 3,
    buffs: {damage: 15, armor_percent: -10, resist_percent: -10},
  },
  prodigy: {
    id: "prodigy",
    name: "Prodigy",
    index: 4,
  },
  astralpresence: {
    id: "astral-presence",
    name: "Astral Presence",
    index: 5,
    buffs: {maxap: 20, apregen: 2.5},
  },
  illusionist: {
    id: "illusionist",
    name: "Illusionist",
    index: 6,
  },
  coldblooded: {
    id: "cold-blooded",
    name: "Cold Blooded",
    index: 7,
    active: true,
    buffs: {dmgtaken: 10},
  },
  conflagration: {
    id: "conflagration",
    name: "Conflagration",
    index: 8,
    active: true,
    buffs: {chctaken: 6},
  },
  paralysis: {
    id: "paralysis",
    name: "Paralysis",
    index: 9,
  },
  galvanizingward: {
    id: "galvanizing-ward",
    name: "Galvanizing Ward",
    index: 10,
  },
  temporalflux: {
    id: "temporal-flux",
    name: "Temporal Flux",
    index: 11,
  },
  dominance: {
    id: "dominance",
    name: "Dominance",
    index: 12,
  },
  arcanedynamo: {
    id: "arcane-dynamo",
    name: "Arcane Dynamo",
    index: 13,
    active: false,
    buffs: {dmgmul: {skills: ["rayoffrost", "arcaneorb", "arcanetorrent", "disintegrate", "hydra",
                              "waveofforce", "energytwister", "meteor", "blizzard", "explosiveblast"], percent: 60}},
  },
  unstableanomaly: {
    id: "unstable-anomaly",
    name: "Unstable Anomaly",
    index: 14,
  },
  unwaveringwill: {
    id: "unwavering-will",
    name: "Unwavering Will",
    index: 15,
    active: true,
    buffs: {armor_percent: 20, resist_percent: 20, damage: 10},
  },
  audacity: {
    id: "audacity",
    name: "Audacity",
    index: 16,
    active: true,
    buffs: {dmgmul: {pet: false, percent: 15}},
  },
  elementalexposure: {
    id: "elemental-exposure",
    name: "Elemental Exposure",
    index: 17,
    inactive: false,
    getElems: function(stats, type) {
      if (DiabloCalc.charClass !== "wizard") {
        return {};
      }
      var elems = {};
      if (type === "ee" || type === "tal2") {
        var mh = DiabloCalc.getSlot("mainhand");
        if (mh && mh.stats) {
          for (var stat in mh.stats) {
            if (DiabloCalc.stats[stat].damage) {
              switch (DiabloCalc.stats[stat].elemental) {
              case "fire": elems.fir = true; break;
              case "cold": elems.col = true; break;
              case "lightning": elems.lit = true; break;
              case "arcane": elems.arc = true; break;
              }
            }
          }
        }
      }
      if (type === "ee") type = "tal2";
      var elist = ["fir", "col", "lit", "arc"];
      var maxelem = "arc";
      for (var i = 0; i < elist.length; ++i) {
        if ((stats["dmg" + elist[i]] || 0) > (stats["dmg" + maxelem] || 0)) {
          maxelem = elist[i];
        }
      }
      for (var skill in stats.skills) {
        var rune = stats.skills[skill];
        switch (skill) {
        case "frostnova":
          if (type === "tal2" || rune === "c") elems.col = true;
          break;
        case "diamondskin":
          if (rune === "e") elems.arc = true;
          break;
        case "slowtime":
          if (stats.set_magnumopus_4pc) elems[maxelem] = true;
          break;
        case "teleport":
          if (rune === "a") elems.arc = true;
          break;
        case "icearmor":
          if (type === "tal2" && rune === "c") elems.col = true;
          break;
        case "stormarmor":
          if (type === "tal2") elems.lit = true;
          break;
        case "magicweapon":
          if (type === "tal2") {
            if (rune === "b") elems.lit = true;
            if (rune === "a") elems.fir = true;
          }
          break;
        case "energyarmor":
          break;
        case "mirrorimage":
          if (type === "tal2" && rune === "e") elems.arc = true;
          break;
        case "familiar":
          if (type !== "tal2") break;
        case "archon":
          if (stats.set_vyrs_4pc) elems[maxelem] = true;
        default:
          if (DiabloCalc.skilltips.wizard[skill]) {
            var elem = DiabloCalc.skilltips.wizard[skill].elements[rune];
            elems[elem] = true;
          }
        }
      }
      if (stats.gems.wreath && type === "tal2") {
        elems.lit = true;
      }
      return elems;
    },
    active: true,
    buffs: function(stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "ee");
      var sum = 0;
      for (var e in elems) {
        sum += 5;
      }
      return {dmgtaken: sum};
    },
    info: function(stats) {
      var elems = DiabloCalc.passives.wizard.elementalexposure.getElems(stats, "ee");
      var sum = 0;
      for (var e in elems) {
        sum += 5;
      }
      return {"Damage Bonus": sum + "%"};
    },
  },
};
DiabloCalc.partybuffs.wizard = {
  rayoffrost: {
    runelist: "a",
  },
  disintegrate: {
    runelist: "a",
  },
  frostnova: {
    runelist: "a",
  },
  slowtime: {
    runelist: "ae",
    multiple: true,
  },
  energytwister: {
    runelist: "a",
  },
  blizzard: {
    runelist: "c",
  },

  coldblooded: {},
  conflagration: {},
  elementalexposure: {
    params: [{min: 0, max: 4, val: 0, name: "Stacks"}],
    buffs: function(stats) {return {dmgtaken: this.params[0].val * 5};},
  },
};

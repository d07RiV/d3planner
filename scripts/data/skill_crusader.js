if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.crusader = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  utility: "Utility",
  laws: "Laws",
  conviction: "Conviction",
};
DiabloCalc.skills.crusader = {
  punish: {
    id: "punish",
    name: "Punish",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      d: "Roar",
      b: "Celerity",
      c: "Rebirth",
      a: "Retaliate",
      e: "Fury",
    },
    info: function(rune, stats) {
      var elem;
      switch (rune) {
      case "x": elem = "phy"; break;
      case "d": elem = "fir"; break;
      case "b": elem = "phy"; break;
      case "c": elem = "phy"; break;
      case "a": elem = "hol"; break;
      case "e": elem = "lit"; break;
      }
      var res = {"DPS": {sum: true, "Damage": {speed: 1, ias: (stats.passives.fanaticism ? 15 : 0)}}, "Damage": {elem: elem, coeff: 3.35}};
      if (stats.leg_angelhairbraid || rune == "d") {
        res["Roar Damage"] = {elem: elem, coeff: 0.75};
      }
      if (stats.leg_angelhairbraid || rune == "a") {
        res["Retaliate Damage"] = {elem: elem, coeff: 1.4};
      }
      return res;
    },
    active: false,
    buffs: function(rune, stats) {
      if (stats.leg_angelhairbraid) {
        return {extra_block: 15, ias: 15, regen: 12874};
      } else {
        switch (rune) {
        case "x": return {extra_block: 15};
        case "d": return {extra_block: 15};
        case "b": return {extra_block: 15, ias: 15};
        case "c": return {extra_block: 15, regen: 12874};
        case "a": return {extra_block: 15};
        case "e": return {extra_block: 15};
        }
      }
    },
  },
  slash: {
    id: "slash",
    name: "Slash",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      b: "Electrify",
      d: "Carve",
      c: "Crush",
      a: "Zeal",
      e: "Guard",
    },
    info: {
      x: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "fir", coeff: 2.3}},
      b: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "lit", coeff: 2.3}},
      d: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "fir", coeff: 2.3}},
      c: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "fir", coeff: 2.3, chc: 20}},
      a: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 2.3}},
      e: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "fir", coeff: 2.3}},
    },
    active: true,
    params: [{rune: "a", min: 0, max: 10, name: "Stacks"},
             {rune: "e", min: 0, max: 5, name: "Stacks"}],
    buffs: function(rune, stats) {
      if (rune === "a") return {ias: this.params[0].val};
      if (rune === "e") return {armor_percent: this.params[1].val * 5};
    },
  },
  smite: {
    id: "smite",
    name: "Smite",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      c: "Shatter",
      b: "Shackle",
      e: "Surge",
      d: "Reaping",
      a: "Shared Fate",
    },
    info: {
      x: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 1.75}, "Secondary Damage": {elem: "hol", coeff: 1.5}},
      c: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 1.75}, "Secondary Damage": {elem: "hol", coeff: 1.5}},
      b: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 1.75}, "Secondary Damage": {elem: "hol", coeff: 1.5}},
      e: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 1.75}, "Secondary Damage": {elem: "hol", coeff: 1.5}},
      d: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 1.75}, "Secondary Damage": {elem: "hol", coeff: 1.5}},
      a: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "lit", coeff: 1.75}, "Secondary Damage": {elem: "lit", coeff: 1.5}},
    },
    active: true,
    params: [{rune: "d", min: 0, max: 4, name: "Stacks"}],
    buffs: function(rune, stats) {
      if (rune === "d") return {regen: 6437 * this.params[0].val};
    },
  },
  justice: {
    id: "justice",
    name: "Justice",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      d: "Burst",
      b: "Crack",
      c: "Hammer of Pursuit",
      a: "Sword of Justice",
      e: "Holy Bolt",
    },
    info: {
      x: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 2.45}},
      d: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}, "Impact Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "lit", coeff: 2.45}, "Impact Damage": {elem: "lit", coeff: 0.6}},
      b: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 2.45}},
      c: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "phy", coeff: 3.34}},
      a: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "phy", coeff: 2.45}},
      e: {"DPS": {sum: true, "Damage": {speed: 1, ias: "passives.fanaticism?15:0"}}, "Damage": {elem: "hol", coeff: 2.45}},
    },
  },
  shieldbash: {
    id: "shield-bash",
    name: "Shield Bash",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      b: "Shattered Shield",
      e: "One on One",
      c: "Shield Cross",
      a: "Crumble",
      d: "Pound",
    },
    info: {
      x: {"Damage": {elem: "hol", coeff: 7, addcoeff: [[3, "block/100"]]}},
      b: {"Damage": {elem: "hol", coeff: 7.4, addcoeff: [[3.35, "block/100"]]}},
      e: {"Damage": {elem: "lit", coeff: 7, addcoeff: [[3, "block/100"]]}},
      c: {"Damage": {elem: "phy", coeff: 7, addcoeff: [[3, "block/100"]]}, "Additional Damage": {elem: "phy", coeff: 1.55, addcoeff: [[1, "block/100"]]}},
      a: {"Damage": {elem: "fir", coeff: 7, addcoeff: [[3, "block/100"]]}, "Explosion Damage": {elem: "fir", coeff: 6.6}},
      d: {"Damage": {elem: "phy", coeff: 13.2, addcoeff: [[5, "block/100"]]}},
    },
  },
  sweepattack: {
    id: "sweep-attack",
    name: "Sweep Attack",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      b: "Blazing Sweep",
      d: "Trip Attack",
      c: "Holy Shock",
      a: "Gathering Sweep",
      e: "Frozen Sweep",
    },
    info: {
      x: {"Damage": {elem: "phy", coeff: 4.8}},
      b: {"Damage": {elem: "fir", coeff: 6}},
      d: {"Damage": {elem: "lit", coeff: 4.8}},
      c: {"Damage": {elem: "phy", coeff: 4.8}},
      a: {"Damage": {elem: "hol", coeff: 4.8}},
      e: {"Damage": {elem: "col", coeff: 4.8}},
    },
  },
  blessedhammer: {
    id: "blessed-hammer",
    name: "Blessed Hammer",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      a: "Burning Wrath",
      b: "Thunderstruck",
      c: "Limitless",
      d: "Icebound Hammer",
      e: "Dominion",
    },
    info: {
      x: {"Damage": {elem: "hol", coeff: 3.2}},
      a: {"Damage": {elem: "fir", coeff: 3.2}, "Scorch Damage": {elem: "fir", coeff: 3.3, total: true}},
      b: {"Damage": {elem: "lit", coeff: 3.2}, "Arc Damage": {elem: "lit", coeff: 0.6}},
      c: {"Damage": {elem: "hol", coeff: 3.2}},
      d: {"Damage": {elem: "col", coeff: 3.2}, "Explosion Damage": {elem: "col", coeff: 3.8}},
      e: {"Damage": {elem: "hol", coeff: 3.2}},
    },
  },
  blessedshield: {
    id: "blessed-shield",
    name: "Blessed Shield",
    category: "secondary",
    row: 1,
    col: 3,
    runes: {
      a: "Staggering Shield",
      b: "Combust",
      c: "Divine Aegis",
      d: "Shattering Throw",
      e: "Piercing Shield",
    },
    info: {
      x: {"Damage": {elem: "hol", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}},
      a: {"Damage": {elem: "lit", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}},
      b: {"Damage": {elem: "fir", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}, "Explosion Damage": {elem: "fir", coeff: 3.1}},
      c: {"Damage": {elem: "phy", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}},
      d: {"Damage": {elem: "hol", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}, "Fragment Damage": {elem: "hol", coeff: 1.7}},
      e: {"Damage": {elem: "hol", coeff: 4.3, addcoeff: [[2.5, "block/100"]]}},
    },
    active: false,
    params: [{rune: "c", min: 0, max: 20, name: "Enemies Hit", inf: true}],
    buffs: function(rune, stats) {
      if (rune === "c") return {armor_percent: this.params[0].val * 5, regen_bonus: this.params[0].val * 5};
    },
  },
  fistoftheheavens: {
    id: "fist-of-the-heavens",
    name: "Fist of the Heavens",
    category: "secondary",
    row: 1,
    col: 4,
    runes: {
      d: "Divine Well",
      a: "Heaven's Tempest",
      c: "Fissure",
      b: "Reverberation",
      e: "Retribution",
    },
    info: {
      x: {"Damage": {elem: "lit", coeff: 5.45}, "Bolt Damage": {elem: "lit", coeff: 2.25}},
      d: {"Damage": {elem: "hol", coeff: 5.45}, "Bolt Damage": {elem: "hol", coeff: 2.25}, "Zap Damage": {elem: "hol", coeff: 0.4}},
      a: {"Damage": {elem: "fir", coeff: 5.45}, "Bolt Damage": {elem: "fir", coeff: 2.25}, "Storm Damage": {elem: "fir", coeff: 1, total: true}},
      c: {"Damage": {elem: "lit", coeff: 5.45}, "Bolt Damage": {elem: "lit", coeff: 2.25}, "Fisure Dammage": {elem: "lit", coeff: 4.1, total: true}, "Arc Damage": {elem: "lit", coeff: 1.35}},
      b: {"Damage": {elem: "lit", coeff: 5.45}, "Bolt Damage": {elem: "lit", coeff: 2.25}},
      e: {"Fist Damage": {elem: "hol", coeff: 2.7}, "Explosion Damage": {elem: "hol", coeff: 4.35}, "Bolt Damage": {elem: "hol", coeff: 1.85}},
    },
  },
  shieldglare: {
    id: "shield-glare",
    name: "Shield Glare",
    category: "defensive",
    row: 2,
    col: 0,
    runes: {
      a: "Divine Verdict",
      b: "Uncertainty",
      d: "Zealous Glare",
      c: "Emblazoned Shield",
      e: "Subdue",
    },
    info: {
      x: {"Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
      a: {"Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
      b: {"Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
      d: {"Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
      c: {"Explosion Damage": {elem: "phy", coeff: 0.6}, "Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
      e: {"Uptime": {duration: 4, cooldown: "12*(passives.toweringshield?0.7:1)"}},
    },
    active: false,
    buffs: {
      a: {dmgtaken: 20},
    },
  },
  ironskin: {
    id: "iron-skin",
    name: "Iron Skin",
    category: "defensive",
    row: 2,
    col: 1,
    nolmb: true,
    runes: {
      d: "Reflective Skin",
      b: "Steel Skin",
      c: "Explosive Skin",
      a: "Charged Up",
      e: "Flash",
    },
    info: {
      x: {"Uptime": {duration: 4, cooldown: 30}},
      d: {"Damage": "info.thorns*2", "Uptime": {duration: 4, cooldown: 30}},
      b: {"Uptime": {duration: 7, cooldown: 30}},
      c: {"Expiration Damage": {elem: "phy", coeff: 14}, "Uptime": {duration: 4, cooldown: 30}},
      a: {"Uptime": {duration: 4, cooldown: 30}},
      e: {"Uptime": {duration: 4, cooldown: 30}},
    },
    active: false,
    buffs: {
      x: {dmgred: 50},
      d: {dmgred: 50},
      b: {dmgred: 50},
      c: {dmgred: 50},
      a: {dmgred: 50},
      e: {dmgred: 50},
    },
  },
  consecration: {
    id: "consecration",
    name: "Consecration",
    category: "defensive",
    row: 2,
    col: 2,
    nolmb: true,
    runes: {
      c: "Bathed in Light",
      b: "Frozen Ground",
      a: "Aegis Purgatory",
      d: "Shattered Ground",
      e: "Fearful",
    },
    info: {
      d: {"DPS": {elem: "fir", aps: true, coeff: 1.55, total: true}},
    },
  },
  judgment: {
    id: "judgment",
    name: "Judgment",
    category: "defensive",
    row: 2,
    col: 3,
    runes: {
      a: "Penitence",
      b: "Mass Verdict",
      c: "Deliberation",
      d: "Resolved",
      e: "Conversion",
    },
    info: {
      x: {"Uptime": {duration: 6, cooldown: 20}},
      a: {"Uptime": {duration: 6, cooldown: 20}},
      b: {"Uptime": {duration: 6, cooldown: 20}},
      c: {"Uptime": {duration: 10, cooldown: 20}},
      d: {"Uptime": {duration: 6, cooldown: 20}},
      e: {"Uptime": {duration: 6, cooldown: 20}},
    },
    active: false,
    buffs: {
      d: {chctaken: 20},
    },
  },
  provoke: {
    id: "provoke",
    name: "Provoke",
    category: "utility",
    row: 3,
    col: 0,
    runes: {
      a: "Cleanse",
      b: "Flee Fool",
      c: "Too Scared to Run",
      d: "Charged Up",
      e: "Hit Me",
    },
    info: {
      x: {"Uptime": {duration: 4, cooldown: 20}},
      a: {"Uptime": {duration: 4, cooldown: 20}},
      b: {"Uptime": {duration: 8, cooldown: 20}},
      c: {"Uptime": {duration: 4, cooldown: 20}},
      d: {"Extra Damage": {elem: "lit", coeff: 0.5}, "Uptime": {duration: 4, cooldown: 20}},
      e: {"Uptime": {duration: 4, cooldown: 20}},
    },
    active: false,
    buffs: {
      e: {block_percent: 50},
    },
  },
  steedcharge: {
    id: "steed-charge",
    name: "Steed Charge",
    category: "utility",
    row: 3,
    col: 1,
    nolmb: true,
    runes: {
      a: "Ramming Speed",
      d: "Nightmare",
      c: "Rejuvenation",
      b: "Endurance",
      e: "Draw and Quarter",
    },
    info: {
      "*": {"Uptime": {duration: "2*(leg_swiftmount?2:1)", cooldown: "16*(passives.lordcommander?0.75:1)"}},
      a: {"DPS": {elem: "phy", aps: true, coeff: 5.15, total: true}},
      d: {"DPS": {elem: "fir", aps: true, coeff: 5.5, total: true}},
      b: {"Uptime": {duration: "3*(leg_swiftmount?2:1)", cooldown: "16*(passives.lordcommander?0.75:1)"}},
      e: {"DPS": {elem: "hol", aps: true, coeff: 1.85, total: true}},
    },
  },
  condemn: {
    id: "condemn",
    name: "Condemn",
    category: "utility",
    row: 3,
    col: 2,
    nolmb: true,
    runes: {
      b: "Vacuum",
      e: "Unleashed",
      c: "Eternal Retaliation",
      d: "Shattering Explosion",
      a: "Reciprocate",
    },
    info: {
      x: {"Damage": {elem: "hol", coeff: 11.6}},
      b: {"Damage": {elem: "hol", coeff: 11.6}},
      e: {"Damage": {elem: "hol", coeff: 11.6}},
      c: {"Damage": {elem: "hol", coeff: 11.6}},
      d: {"Damage": {elem: "phy", coeff: 11.6}},
      a: {"Damage": {elem: "fir", coeff: 11.6}},
    },
  },
  phalanx: {
    id: "phalanx",
    name: "Phalanx",
    category: "utility",
    row: 3,
    col: 3,
    runes: {
      a: "Bowmen",
      b: "Shield Charge",
      c: "Stampede",
      d: "Shield Bearers",
      e: "Bodyguard",
    },
    info: function(rune, stats) {
      var dbl = {"Unrelenting Phalanx": stats.leg_unrelentingphalanx ? 100 : 0};
      var count = (stats.leg_unrelentingphalanx ? 2 : 1);
      switch (rune) {
      case "x": return {"Damage": {elem: "phy", coeff: 4.9}, "Total Damage": (stats.leg_unrelentingphalanx ? {sum: true, "Damage": {count: 2}} : undefined)};
      case "a": return {"Damage": {elem: "phy", pet: true, coeff: 1.85}, "DPS": {sum: true, "Damage": {pet: 60, speed: 1, count: count * 4}}};
      case "b": return {"Damage": {elem: "phy", coeff: 1.8}, "Total Damage": {sum: true, "Damage": {count: 3 * count}}};
      case "c": return {"Damage": {elem: "phy", coeff: 4.9}, "Total Damage": (stats.leg_unrelentingphalanx ? {sum: true, "Damage": {count: 2}} : undefined)};
      case "d": return {"Damage": {elem: "phy", coeff: 4.9}, "Total Damage": (stats.leg_unrelentingphalanx ? {sum: true, "Damage": {count: 2}} : undefined)};
      case "e": return {"Damage": {elem: "phy", pet: true, coeff: 5.6}, "DPS": {sum: true, "Damage": {pet: 60, speed: 1, count: count * 2}}};
      }
    },
  },
  lawsofvalor: {
    id: "laws-of-valor",
    name: "Laws of Valor",
    category: "laws",
    row: 4,
    col: 0,
    nolmb: true,
    runes: {
      a: "Invincible",
      b: "Frozen in Terror",
      c: "Critical",
      d: "Unstoppable Force",
      e: "Answered Prayer",
    },
    info: {
      x: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      a: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      b: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      c: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      d: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      e: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
    },
    active: false,
    buffs: {
      x: {ias: 7},
      a: {ias: 7, lph: 21457},
      b: {ias: 7},
      c: {ias: 7, chd: 100},
      d: {ias: 7, rcr_wrath: 50},
      e: {ias: 7},
    },
    passive: {
      x: {ias: 8},
      a: {ias: 8},
      b: {ias: 8},
      c: {ias: 8},
      d: {ias: 8},
      e: {ias: 8},
    },
  },
  lawsofjustice: {
    id: "laws-of-justice",
    name: "Laws of Justice",
    category: "laws",
    row: 4,
    col: 1,
    nolmb: true,
    runes: {
      a: "Protect the Innocent",
      b: "Immovable Object",
      c: "Faith's Armor",
      d: "Decaying Strength",
      e: "Bravery",
    },
    info: {
      x: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      a: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      b: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      c: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      d: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      e: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
    },
    active: false,
    buffs: {
      x: {resall: 350},
      a: {resall: 350},
      b: {resall: 350, armor: 7000},
      c: {resall: 350},
      d: {resall: 350},
      e: {resall: 350},
    },
    passive: {
      x: {resall: 140},
      a: {resall: 140},
      b: {resall: 140},
      c: {resall: 140},
      d: {resall: 140},
      e: {resall: 140},
    },
  },
  lawsofhope: {
    id: "laws-of-hope",
    name: "Laws of Hope",
    category: "laws",
    row: 4,
    col: 2,
    nolmb: true,
    runes: {
      a: "Wings of Angels",
      b: "Eternal Hope",
      c: "Hopeful Cry",
      d: "Faith's Reward",
      e: "Promise of Faith",
    },
    info: {
      x: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      a: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      b: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      c: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      d: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
      e: {"Uptime": {duration: "passives.longarmofthelaw?10:5", cooldown: 30}},
    },
    active: false,
    buffs: {
      b: {life: 10},
      d: {lifewrath: 1073},
      e: {nonphys: 25},
    },
    passive: {
      x: {regen: 10728.42},
      a: {regen: 10728.42},
      b: {regen: 10728.42},
      c: {regen: 10728.42},
      d: {regen: 10728.42},
      e: {regen: 10728.42},
    },
  },
  fallingsword: {
    id: "falling-sword",
    name: "Falling Sword",
    category: "conviction",
    row: 5,
    col: 0,
    runes: {
      a: "Superheated",
      b: "Part the Clouds",
      c: "Rise Brothers",
      d: "Rapid Descent",
      e: "Flurry",
    },
    info: {
      x: {"Damage": {elem: "phy", coeff: 17}},
      a: {"Damage": {elem: "fir", coeff: 17}, "Residual DPS": {elem: "fir", aps: true, coeff: 3.1, total: true}},
      b: {"Damage": {elem: "lit", coeff: 17}, "Bolt Damage": {elem: "lit", coeff: 6.05}},
      c: {"Damage": {elem: "phy", coeff: 17}, "Avatar Damage": {elem: "phy", pet: true, coeff: 2.8}},
      d: {"Damage": {elem: "lit", coeff: 17}},
      e: {"Damage": {elem: "hol", coeff: 17}, "Flurry DPS": {elem: "hol", coeff: 2.3, total: true}},
    },
  },
  akaratschampion: {
    id: "akarats-champion",
    name: "Akarat's Champion",
    category: "conviction",
    row: 5,
    col: 1,
    nolmb: true,
    runes: {
      a: "Fire Starter",
      b: "Embodiment of Power",
      c: "Rally",
      d: "Prophet",
      e: "Hasteful",
    },
    info: {
      x: {"Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
      a: {"Damage": {elem: "fir", coeff: 4.6, total: true}, "Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
      b: {"Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
      c: {"Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
      d: {"Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
      e: {"Uptime": {duration: 20, cooldown: "90*(set_akkhan_6pc?0.5:1)"}},
    },
    active: false,
    buffs: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {damage: 35, wrathregen: 5}; break;
      case "a": res = {damage: 35, wrathregen: 5}; break;
      case "b": res = {damage: 35, wrathregen: 10}; break;
      case "c": res = {damage: 35, wrathregen: 5}; break;
      case "d": res = {damage: 35, wrathregen: 5, armor_percent: 150}; break;
      case "e": res = {damage: 35, wrathregen: 5, ias: 15}; break;
      }
      if (stats.set_akkhan_4pc) {
        res.rcr = 50;
      }
      return res;
    },
  },
  heavensfury: {
    id: "heavens-fury",
    name: "Heaven's Fury",
    category: "conviction",
    row: 5,
    col: 2,
    runes: {
      b: "Blessed Ground",
      a: "Ascendancy",
      c: "Split Fury",
      d: "Thou Shalt Not Pass",
      e: "Fires of Heaven",
    },
    info: function(rune, stats) {
      if (rune == "e" && stats.leg_fateofthefell) {
        return {"Damage": {elem: "hol", coeff: 9.6}, "Total Damage": {sum: true, "Damage": {count: 3}}};
      } else {
        switch (rune) {
        case "x": return {"Damage": {elem: "hol", coeff: 17.1, total: true}};
        case "b": return {"Damage": {elem: "hol", coeff: 17.1, total: true}, "Residual Damage": {elem: "hol", coeff: 15.5, total: true}};
        case "a": return {"Damage": {elem: "hol", coeff: 27.66, total: true}};
        case "c": return {"Damage": {elem: "hol", coeff: 19.8, total: true}};
        case "d": return {"Damage": {elem: "lit", coeff: 17.1, total: true}};
        case "e": return {"Damage": {elem: "hol", coeff: 9.6}};
        }
      }
    },
  },
  bombardment: {
    id: "bombardment",
    name: "Bombardment",
    category: "conviction",
    row: 5,
    col: 3,
    runes: {
      a: "Barrels of Tar",
      b: "Annihilate",
      c: "Mine Field",
      d: "Impactful Bombardment",
      e: "Targeted",
    },
    info: function(rune, stats) {
      if (rune == "d" && stats.leg_themortaldrama) {
        return {"Damage": {elem: "phy", coeff: 33.2}, "Total Damage": {sum: true, "Damage": {count: 2}}};
      } else {
        switch (rune) {
        case "x": return {"Damage": {elem: "phy", coeff: 5.7}, "Total Damage": {sum: true, "Damage": {count: (stats.leg_themortaldrama ? 10 : 5)}}};
        case "a": return {"Damage": {elem: "phy", coeff: 5.7}, "Total Damage": {sum: true, "Damage": {count: (stats.leg_themortaldrama ? 10 : 5)}}};
        case "b": return {"Damage": {elem: "fir", coeff: 5.7, chc: 100}, "Total Damage": {sum: true, "Damage": {count: (stats.leg_themortaldrama ? 10 : 5)}}};
        case "c": return {"Damage": {elem: "fir", coeff: 5.7}, "Mine Damage": {elem: "fir", coeff: 1.6}, "Total Damage": {sum: true, "Damage": {count: (stats.leg_themortaldrama ? 10 : 5)}, "Mine Damage": {count: (stats.leg_themortaldrama ? 20 : 10)}}};
        case "d": return {"Damage": {elem: "phy", coeff: 33.2}};
        case "e": return {"Damage": {elem: "hol", coeff: 5.7}, "Total Damage": {sum: true, "Damage": {count: (stats.leg_themortaldrama ? 10 : 5)}}};
        }
      }
    },
  },
};
DiabloCalc.passives.crusader = {
  heavenlystrength: {
    id: "heavenly-strength",
    name: "Heavenly Strength",
    index: 0,
    buffs: {damage: -20},
  },
  fervor: {
    id: "fervor",
    name: "Fervor",
    index: 1,
    buffs: function(stats) {
      if (stats.info.mainhand.slot == "onehand") {
        return {ias: 15, cdr: 15};
      }
    },
  },
  vigilant: {
    id: "vigilant",
    name: "Vigilant",
    index: 2,
    buffs: {regen: 2682, nonphys: 20},
  },
  righteousness: {
    id: "righteousness",
    name: "Righteousness",
    index: 3,
    buffs: {maxwrath: 30},
  },
  insurmountable: {
    id: "insurmountable",
    name: "Insurmountable",
    index: 4,
  },
  fanaticism: {
    id: "fanaticism",
    name: "Fanaticism",
    index: 5,
  },
  indestructible: {
    id: "indestructible",
    name: "Indestructible",
    index: 6,
    active: false,
    buffs: {damage: 35},
  },
  holycause: {
    id: "holy-cause",
    name: "Holy Cause",
    index: 7,
    buffs: {damage: 10},
  },
  wrathful: {
    id: "wrathful",
    name: "Wrathful",
    index: 8,
    buffs: function(stats) {
      return {lifewrath: 1341 + stats.healbonus * 0.01};
    },
  },
  divinefortress: {
    id: "divine-fortress",
    name: "Divine Fortress",
    index: 9,
    buffs: function(stats) {
      return {armor_percent: stats.baseblock};
    },
  },
  lordcommander: {
    id: "lord-commander",
    name: "Lord Commander",
    buffs: {
      skill_crusader_phalanx: 20,
    },
    index: 10,
  },
  holdyourground: {
    id: "hold-your-ground",
    name: "Hold Your Ground",
    index: 11,
    buffs: {extra_block: 15},
  },
  longarmofthelaw: {
    id: "long-arm-of-the-law",
    name: "Long Arm of the Law",
    index: 12,
  },
  ironmaiden: {
    id: "iron-maiden",
    name: "Iron Maiden",
    index: 13,
    buffs: function(stats) {
      return {thorns: stats.thorns * 0.5};
    },
  },
  renewal: {
    id: "renewal",
    name: "Renewal",
    index: 14,
  },
  finery: {
    id: "finery",
    name: "Finery",
    index: 15,
    buffs: function(stats) {
      return {str_percent: stats.info.gems * 1.5};
    },
  },
  blunt: {
    id: "blunt",
    name: "Blunt",
    buffs: {
      skill_crusader_justice: 20,
      skill_crusader_blessedhammer: 20,
    },
    index: 16,
  },
  toweringshield: {
    id: "towering-shield",
    name: "Towering Shield",
    buffs: {
      skill_crusader_punish: 20,
      skill_crusader_shieldbash: 20,
      skill_crusader_blessedshield: 20,
    },
    index: 17,
  },
};
DiabloCalc.partybuffs.crusader = {
  shieldglare: {
    runelist: "a",
  },
  judgment: {
    runelist: "d",
  },
  lawsofvalor: {
    runelist: "*",
    addpassive: true,
    buffs: {
      x: {ias: 7},
      a: {ias: 7, lph: 21457},
      b: {ias: 7},
      c: {ias: 7, chd: 100},
      d: {ias: 7}, // <- difference
      e: {ias: 7},
    },
  },
  lawsofjustice: {
    runelist: "*",
    addpassive: true,
  },
  lawsofhope: {
    runelist: "*",
    addpassive: true,
  },
};

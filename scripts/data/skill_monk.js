if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.monk = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  techniques: "Techniques",
  focus: "Focus",
  mantras: "Mantras",
};
DiabloCalc.monk = {
  spirit: [{min: 0, max: "maxspirit", name: "Spirit", buffs: false, show: function(rune, stats) {return !!stats.set_shenlong_2pc;}}],
};
DiabloCalc.skills.monk = {
  fistsofthunder: {
    id: "fists-of-thunder",
    name: "Fists of Thunder",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      a: "Thunderclap",
      e: "Wind Blast",
      c: "Static Charge",
      d: "Quickening",
      b: "Bounding Light",
    },
    range: 5,
    params: DiabloCalc.monk.spirit,
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "lit", coeff: 2}, "Third Hit Damage": {elem: "lit", coeff: 4}}; break;
      case "a": res = {"Damage": {elem: "lit", coeff: 2}, "Third Hit Damage": {elem: "lit", coeff: 4}, "Shockwave Damage": {elem: "lit", coeff: 1.2}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 2}, "Third Hit Damage": {elem: "col", coeff: 4}}; break;
      case "c": res = {"Damage": {elem: "lit", coeff: 2}, "Third Hit Damage": {elem: "lit", coeff: 4}, "Static Charge Damage": {elem: "lit", coeff: 0.3}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 2}, "Third Hit Damage": {elem: "phy", coeff: 4}}; break;
      case "b": res = {"Damage": {elem: "hol", coeff: 2}, "Third Hit Damage": {elem: "hol", coeff: 4}, "Arc Damage": {elem: "hol", coeff: 2.4}}; break;
      }
      if (stats.set_shenlong_2pc) {
        var percent = {};
        percent[DiabloCalc.itemSets.shenlong.name] = this.params[0].val * 2;
        for (var k in res) {
          res[k].percent = percent;
        }
      }
      var ias = (stats.passives.alacrity ? 1.15 : 1) * (stats.set_storms_2pc ? 1.25 : 1);
      res["DPS"] = {sum: "sequence", "First Hit": {src: "Damage", speed: 1.55 * ias, round: "up", fpa: 57},
                                     "Second Hit": {src: "Damage", speed: 1.55 * ias, round: "up", fpa: 57.391289},
                                     "Third Hit": {src: "Third Hit Damage", speed: ias, round: "up", fpa: 58.064510}};
      if (res["Shockwave Damage"]) res["DPS"]["Shockwave Damage"] = {count: 3};
      if (res["Arc Damage"]) res["DPS"]["Arc Damage"] = {};
      var spirit = (rune === "d" ? 20 : 14);
      if (stats.skills.breathofheaven === "d" && DiabloCalc.isSkillActive("breathofheaven")) {
        spirit += 14;
      }
      spirit *= (1 + 0.01 * (stats.leg_bandofruechambers || 0)) * (1 + 0.01 * (stats.resourcegen || 0));
      res["Spirit/sec"] = {sum: true, "Spirit per Hit": {value: spirit, refspeed: "DPS", count: 3}};
      return res;
    },
  },
  deadlyreach: {
    id: "deadly-reach",
    name: "Deadly Reach",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      b: "Piercing Trident",
      e: "Searing Grasp",
      c: "Scattered Blows",
      d: "Strike from Beyond",
      a: "Foresight",
    },
    range: 12,
    params: DiabloCalc.monk.spirit,
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 1.5}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 1.5}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 2.6}}; break;
      case "c": res = {"Damage": {elem: "lit", coeff: 1.5}, "Blast Damage": {elem: "lit", coeff: 2.15}}; break;
      case "d": res = {"Damage": {elem: "col", coeff: 1.5}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 1.5}}; break;
      }
      if (stats.set_shenlong_2pc) {
        var percent = {};
        percent[DiabloCalc.itemSets.shenlong.name] = this.params[0].val * 2;
        for (var k in res) {
          res[k].percent = percent;
        }
      }
      var ias = (stats.passives.alacrity ? 1.15 : 1) * (stats.set_storms_2pc ? 1.25 : 1);
      res["DPS"] = {sum: "sequence", "First Hit": {src: "Damage", speed: 1.5 * ias, round: "up", fpa: 55.384609},
                                     "Second Hit": {src: "Damage", speed: 1.5 * ias, round: "up", fpa: 57.391300},
                                     "Third Hit": {src: "Damage", speed: ias, round: "up", fpa: (rune === "c" ? 57.857132 : 58.064510)}};
      var spirit = 12;
      if (stats.skills.breathofheaven === "d" && DiabloCalc.isSkillActive("breathofheaven")) {
        spirit += 14;
      }
      spirit *= (1 + 0.01 * (stats.leg_bandofruechambers || 0)) * (1 + 0.01 * (stats.resourcegen || 0));
      res["Spirit/sec"] = {sum: true, "Spirit per Hit": {value: spirit, refspeed: "DPS", count: 3}};
      return res;
    },
    active: false,
    buffs: {
      a: {damage: 15},
    },
  },
  cripplingwave: {
    id: "crippling-wave",
    name: "Crippling Wave",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      a: "Mangle",
      c: "Concussion",
      d: "Rising Tide",
      b: "Tsunami",
      e: "Breaking Wave",
    },
    range: 11,
    params: [DiabloCalc.monk.spirit[0], {rune: "d", min: 0, max: 10, val: 1, name: "Enemies Hit", buffs: false}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 1.55}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 2.55}}; break;
      case "c": res = {"Damage": {elem: "phy", coeff: 1.55}}; break;
      case "d": res = {"Damage": {elem: "hol", coeff: 1.55}}; break;
      case "b": res = {"Damage": {elem: "col", coeff: 1.55}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 1.55}}; break;
      }
      if (stats.set_shenlong_2pc) {
        var percent = {};
        percent[DiabloCalc.itemSets.shenlong.name] = this.params[0].val * 2;
        for (var k in res) {
          res[k].percent = percent;
        }
      }
      var ias = (stats.passives.alacrity ? 1.15 : 1) * (stats.set_storms_2pc ? 1.25 : 1);
      res["DPS"] = {sum: "sequence", "First Hit": {src: "Damage", speed: 1.45 * ias, round: "up", fpa: 56.842102},
                                     "Second Hit": {src: "Damage", speed: 1.45 * ias, round: "up", fpa: 56.842102},
                                     "Third Hit": {src: "Damage", speed: ias, round: "up", fpa: 58}};
      var spirit = (rune === "d" ? 12 + this.params[1].val * 2.5 : 12);
      if (stats.skills.breathofheaven === "d" && DiabloCalc.isSkillActive("breathofheaven")) {
        spirit += 14;
      }
      spirit *= (1 + 0.01 * (stats.leg_bandofruechambers || 0)) * (1 + 0.01 * (stats.resourcegen || 0));
      res["Spirit/sec"] = {sum: true, "Spirit per Hit": {value: spirit, refspeed: "DPS", count: 3}};
      return res;
    },
    active: true,
    buffs: {
      e: {dmgtaken: 10},
    },
  },
  wayofthehundredfists: {
    id: "way-of-the-hundred-fists",
    name: "Way of the Hundred Fists",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      b: "Hands of Lightning",
      c: "Blazing Fists",
      a: "Fists of Fury",
      d: "Assimilation",
      e: "Windforce Flurry",
    },
    range: 5,
    params: [DiabloCalc.monk.spirit[0],
             {rune: "c", min: 0, max: 3, val: 0, name: "Stacks"},
             {rune: "d", min: 0, max: 10, val: 0, name: "Stacks", inf: true}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 1.9}}; break;
      case "b": res = {"Damage": {elem: "lit", coeff: 1.9}, "Second Hit Damage": {elem: "lit", coeff: 4.23, total: true}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 1.9}}; break;
      case "a": res = {"Damage": {elem: "hol", coeff: 1.9}, "Extra Damage": {elem: "hol", coeff: 0.6, total: true}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 1.9}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 1.9}, "Wave Damage": {elem: "col", coeff: 5}}; break;
      }
      if (stats.set_shenlong_2pc) {
        var percent = {};
        percent[DiabloCalc.itemSets.shenlong.name] = this.params[0].val * 2;
        for (var k in res) {
          res[k].percent = percent;
        }
      }
      var ias = (stats.passives.alacrity ? 1.15 : 1) * (stats.set_storms_2pc ? 1.25 : 1);
      res["DPS"] = {sum: "sequence", "First Hit": {src: "Damage", speed: 1.275 * ias, round: "up", fpa: 57},
                                     "Second Hit": {src: (rune === "b" ? "Second Hit Damage" : "Damage"), speed: 1.175 * ias, round: "up", fpa: 42},
                                     "Third Hit": {src: "Damage", speed: ias, round: "up", fpa: 57.599998}};
      if (res["Dash Damage"]) res["DPS"]["Dash Damage"] = {};
      if (res["Wave Damage"]) res["DPS"]["Wave Damage"] = {};
      var spirit = 12;
      if (stats.skills.breathofheaven === "d" && DiabloCalc.isSkillActive("breathofheaven")) {
        spirit += 14;
      }
      spirit *= (1 + 0.01 * (stats.leg_bandofruechambers || 0)) * (1 + 0.01 * (stats.resourcegen || 0));
      res["Spirit/sec"] = {sum: true, "Spirit per Hit": {value: spirit, refspeed: "DPS", count: 3}};
      return res;
    },
    active: true,
    buffs: function(rune, stats) {
      if (rune === "c") return {ias: this.params[1].val * 5, extrams: this.params[1].val * 5};
      if (rune === "d") return {damage: this.params[2].val * 5};
    },
  },
  lashingtailkick: {
    id: "lashing-tail-kick",
    name: "Lashing Tail Kick",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      a: "Vulture Claw Kick",
      d: "Sweeping Armada",
      b: "Spinning Flame Kick",
      e: "Scorpion Sting",
      c: "Hand of Ytar",
    },
    range: {x: 10, a: 10, d: 15, e: 10},
    active: true,
    activetip: "First 5-7 enemies",
    activeshow: function(rune, stats) {
      return !!(stats.leg_scarbringer || stats.leg_scarbringer_p6);
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 7.55}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 7.55}, "Burn Damage": {elem: "fir", coeff: 2.3, total: true}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 8.25}}; break;
      case "b": res = {"Damage": {elem: "fir", coeff: 7.55}}; break;
      case "e": res = {"Damage": {elem: "lit", coeff: 7.55}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 7.55}}; break;
      }
      if (stats.leg_gyananakashu) {
        res["Fireball Damage"] = {elem: "fir", coeff: 0.01 * stats.leg_gyananakashu};
      }
      if (this.active && (stats.leg_scarbringer || stats.leg_scarbringer_p6)) {
        res["Damage"].percent = {};
        res["Damage"].percent[DiabloCalc.itemById.P42_Unique_Fist_013_x1.name] = (stats.leg_scarbringer_p6 || 300);
        if (res["Burn Damage"]) {
          res["Burn Damage"].percent = res["Damage"].percent;
        }
      }
      res = $.extend({"Cost": {cost: 50}, "DPS": {sum: true,
        "Damage": {fpa: 57.3913, speed: (stats.leg_riveradancers ? 1.5 : 1)}}}, res);
      if (res["Fireball Damage"]) {
        res["DPS"]["Fireball Damage"] = {fpa: 57.3913, speed: (stats.leg_riveradancers ? 1.5 : 1), nobp: true};
      }
      if (res["Burn Damage"]) {
        res["DPS"]["Burn Damage"] = {fpa: 57.3913, speed: (stats.leg_riveradancers ? 1.5 : 1), nobp: true};
      }
      return res;
    },
  },
  tempestrush: {
    id: "tempest-rush",
    name: "Tempest Rush",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      d: "Northern Breeze",
      b: "Tailwind",
      e: "Flurry",
      c: "Electric Field",
      a: "Bluster",
    },
    range: 7,
    active: true,
    activetip: "3 or fewer targets",
    activeshow: function(rune, stats) {
      return !!(stats.leg_balance || stats.leg_balance_p6);
    },
    params: [{rune: "e", min: 1, max: 100, name: "Flurry Stacks", buffs: false}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Tick Damage": {elem: "phy", aps: true, coeff: 3.9}}; break;
      case "d": res = {"Tick Damage": {elem: "hol", aps: true, coeff: 5}}; break;
      case "b": res = {"Tick Damage": {elem: "phy", aps: true, coeff: 3.9}}; break;
      case "e": res = {"Tick Damage": {elem: "col", aps: true, coeff: 3.9}, "Flurry Damage": {elem: "col", coeff: 0.9, aps: true, addcoeff: [[0.9, this.params[0].val]]}}; break;
      case "c": res = {"Tick Damage": {elem: "lit", aps: true, coeff: 3.9}, "Field DPS": {elem: "lit", coeff: 1.35, aps: true, total: true}}; break;
      case "a": res = {"Tick Damage": {elem: "fir", aps: true, coeff: 3.9}}; break;
      }
      res["Tick Damage"].divide = {"Speed Factor": 5};
      if ((stats.leg_balance || stats.leg_balance_p6) && this.active) {
        res["Tick Damage"].chc = 100;
      }
      return $.extend({"Cost": {cost: (rune === "d" ? 25 : 30), speed: 1}, "DPS": {sum: true, "Tick Damage": {aps: 5}}}, res);
    },
  },
  waveoflight: {
    id: "wave-of-light",
    name: "Wave of Light",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      a: "Wall of Light",
      b: "Explosive Light",
      d: "Empowered Wave",
      e: "Shattering Light",
      c: "Pillar of the Ancients",
    },
    range: function(rune, stats) {
      if (!stats.leg_kyoshirosblade) {
        switch (rune) {
        case "x": return 20;
        case "a": return 20;
        case "d": return 20;
        case "e": return 20;
        case "c": return 25;
        }
      }
    },
    active: true,
    activetip: "3 or fewer targets",
    activeshow: function(rune, stats) {
      return !!stats.leg_kyoshirosblade;
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "hol", coeff: 8.35}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 8.35}}; break;
      case "b": res = {"Damage": {elem: "fir", coeff: 8.3}}; break;
      case "d": res = {"Damage": {elem: "hol", coeff: 10.45}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 8.35}, "Wave Damage": {elem: "col", coeff: 8.2}}; break;
      case "c": res = {"Damage": {elem: "lit", coeff: 6.35}, "Residual Damage": {elem: "lit", coeff: 7.85, total: true}}; break;
      }
      if (stats.leg_kyoshirosblade) {
        var pct = {};
        pct[DiabloCalc.itemById.P4_Unique_Fist_102.name] = (this.active ? stats.leg_kyoshirosblade : 150);
        for (var id in res) res[id].percent = pct;
      }
      res["DPS"] = {sum: true, "Damage": {speed: 1, fpa: 58.823528, round: "up"}};
      if (res["Wave Damage"]) res["DPS"]["Wave Damage"] = $.extend({}, res["DPS"]["Damage"]);
      if (res["Residual Damage"]) res["DPS"]["Residual Damage"] = $.extend({}, res["DPS"]["Damage"]);
      var rcr = {};
      if (stats.leg_incensetorchofthegrandtemple_p6) rcr.leg_incensetorchofthegrandtemple_p6 = 50;
      else if (stats.leg_incensetorchofthegrandtemple) rcr.leg_incensetorchofthegrandtemple = stats.leg_incensetorchofthegrandtemple;
      return $.extend({"Cost": {cost: 75, rcr: rcr}}, res);
    },
  },
  blindingflash: {
    id: "blinding-flash",
    name: "Blinding Flash",
    category: "defensive",
    row: 2,
    col: 0,
    runes: {
      d: "Self Reflection",
      c: "Mystifying Light",
      b: "Replenishing Light",
      e: "Crippling Light",
      a: "Faith in the Light",
    },
    range: 20,
    info: {
      x: {"Uptime": {duration: 3, cooldown: 15}},
      d: {"Uptime": {duration: 6, cooldown: 15}},
      c: {"Uptime": {duration: 3, cooldown: 15}},
      b: {"Uptime": {duration: 3, cooldown: 15}},
      e: {"Uptime": {duration: 3, cooldown: 15}},
      a: {"Uptime": {duration: 3, cooldown: 15}},
    },
    active: false,
    buffs: function(rune, stats) {
      if (rune === "a") return {damage: 29};
    },
  },
  breathofheaven: {
    id: "breath-of-heaven",
    name: "Breath of Heaven",
    category: "defensive",
    row: 2,
    col: 1,
    runes: {
      a: "Circle of Scorn",
      b: "Circle of Life",
      c: "Blazing Wrath",
      d: "Infused with Light",
      e: "Zephyr",
    },
    range: {a: 12},
    info: {
      x: {"Cooldown": {cooldown: 15, cdr: "leg_eyeofpeshkov"}},
      a: {"Cooldown": {cooldown: 15, cdr: "leg_eyeofpeshkov"}, "Damage": {elem: "hol", coeff: 5.05}},
      b: {"Cooldown": {cooldown: 15, cdr: "leg_eyeofpeshkov"}},
      c: {"Uptime": {duration: 9, cooldown: 15, cdr: "leg_eyeofpeshkov"}},
      d: {"Uptime": {duration: 5, cooldown: 15, cdr: "leg_eyeofpeshkov"}},
      e: {"Cooldown": {cooldown: 15, cdr: "leg_eyeofpeshkov"}},
    },
    active: true,
    buffs: {
      c: {damage: 10},
      d: {},
    },
  },
  serenity: {
    id: "serenity",
    name: "Serenity",
    category: "defensive",
    row: 2,
    col: 2,
    runes: {
      a: "Peaceful Repose",
      e: "Unwelcome Disturbance",
      d: "Tranquility",
      c: "Ascension",
      b: "Instant Karma",
    },
    range: {e: 20},
    info: {
      x: {"Uptime": {duration: 3, cooldown: 16, after: true}},
      a: {"Uptime": {duration: 3, cooldown: 16, after: true}},
      e: {"DPS": {elem: "phy", coeff: 4.38, total: true}, "Uptime": {duration: 3, cooldown: 16, after: true}},
      d: {"Uptime": {duration: 3, cooldown: 16, after: true}},
      c: {"Uptime": {duration: 4, cooldown: 16, after: true}},
      b: {"Uptime": {duration: 3, cooldown: 16, after: true}},
    },
  },
  innersanctuary: {
    id: "inner-sanctuary",
    name: "Inner Sanctuary",
    category: "defensive",
    row: 2,
    col: 3,
    nolmb: true,
    runes: {
      b: "Sanctified Ground",
      d: "Safe Haven",
      c: "Temple of Protection",
      a: "Intervene",
      e: "Forbidden Palace",
    },
    range: {e: 11},
    info: {
      x: {"Uptime": {duration: 6, cooldown: 20}},
      b: {"Uptime": {duration: 8, cooldown: 20}},
      d: {"Uptime": {duration: 6, cooldown: 20}},
      c: {"Uptime": {duration: 6, cooldown: 20}},
      a: {"Uptime": {duration: 6, cooldown: 20}},
      e: {"Uptime": {duration: 6, cooldown: 20}},
    },
    active: false,
    buffs: function(rune, stats) {
      var res = {dmgred: 55};
      if (rune === "d") res.regen = 35779 + (stats.regen || 0) * 0.07;
      return res;
    },
  },
  dashingstrike: {
    id: "dashing-strike",
    name: "Dashing Strike",
    category: "techniques",
    row: 3,
    col: 0,
    runes: {
      b: "Way of the Falling Star",
      c: "Blinding Speed",
      d: "Quicksilver",
      e: "Radiance",
      a: "Barrage",
    },
    range: 10,
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 3.7}}; break;
      case "b": res = {"Damage": {elem: "hol", coeff: 3.7}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 3.7}}; break;
      case "d": res = {"Damage": {elem: "lit", coeff: 3.7}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 3.7}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 3.7}, "Barrage Damage": {elem: "phy", coeff: 9.75, total: true}}; break;
      }
      if (stats.set_storms_4pc) {
        res["Cost"] = {cost: 75};
      }
      if (stats.set_storms_6pc && DiabloCalc.itemaffixes.set_storms_6pc.active) {
        res["Damage"].coeff = 600;
      }
      return $.extend({"Cooldown": {cooldown: 8}}, res);
    },
    active: false,
    buffs: {
      b: {extrams: 20},
      c: {dodge: 40},
      e: {ias: 15},
    },
  },
  explodingpalm: {
    id: "exploding-palm",
    name: "Exploding Palm",
    category: "techniques",
    row: 3,
    col: 1,
    runes: {
      c: "The Flesh is Weak",
      d: "Strong Spirit",
      b: "Impending Doom",
      a: "Shocking Grasp",
      e: "Essence Burn",
    },
    range: 5,
    info: function(rune, stats) {
      var expl = {};
      if (stats.leg_thefistofazturrasq) {
        expl[DiabloCalc.itemById.Unique_Fist_009_x1.name] = stats.leg_thefistofazturrasq;
      }
      if (stats.leg_thefistofazturrasq_p2) {
        expl[DiabloCalc.itemById.P4_Unique_Fist_009_x1.name] = stats.leg_thefistofazturrasq_p2;
      }
      if (stats.leg_thefistofazturrasq_p6) {
        expl[DiabloCalc.itemById.P61_Unique_Fist_009_x1.name] = stats.leg_thefistofazturrasq_p6;
      }
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 12, total: true}, "Explosion Damage": {elem: "phy", coeff: 27.7, percent: expl}}; break;
      case "c": res = {"Damage": {elem: "phy", coeff: 12, total: true}, "Explosion Damage": {elem: "phy", coeff: 27.7, percent: expl}}; break;
      case "d": res = {"Damage": {elem: "hol", coeff: 12, total: true}, "Explosion Damage": {elem: "hol", coeff: 27.7, percent: expl}}; break;
      case "b": res = {"Explosion Damage": {elem: "col", coeff: 63.05, percent: expl}}; break;
      case "a": res = {"Damage": {elem: "lit", coeff: 12, total: true}, "Explosion Damage": {elem: "lit", coeff: 27.7, percent: expl}}; break;
      case "e": res = {"Damage": {elem: "fir", coeff: 18.75, total: true}, "Explosion Damage": {elem: "fir", coeff: 32.6, percent: expl, total: true}}; break;
      }
      return $.extend({"Cost": {cost: 40}}, res);
    },
    active: false,
    buffs: {
      c: {dmgtaken: 15},
    },
  },
  sweepingwind: {
    id: "sweeping-wind",
    name: "Sweeping Wind",
    category: "techniques",
    row: 3,
    col: 2,
    nolmb: true,
    runes: {
      e: "Master of Wind",
      a: "Blade Storm",
      b: "Fire Storm",
      d: "Inner Storm",
      c: "Cyclone",
    },
    range: {x: 10, e: 10, a: 10, b: 14, d: 10, c: 10},
    params: [{min: 0, max: "3+(leg_vengefulwind?3:0)+leg_vengefulwind_p2", name: "Stacks", buffs: false}],
    info: function(rune, stats) {
      var res = {"Cost": {cost: 75}, "DPS": {elem: "phy", aps: true, coeff: 1.05, factors: {"Stacks": this.params[0].val}, total: true}};
      if (rune === "e") res["DPS"].elem = "col";
      if (rune === "a") res["DPS"].coeff = 1.45;
      if (rune === "b") res["DPS"].elem = "fir";
      if (rune === "d") res["DPS"].elem = "hol";
      if (rune === "c") {
        res["DPS"].elem = "lit";
        res["Tornado Damage"] = {elem: "lit", coeff: 0.95};
      }
      if (!this.params[0].val) delete res["DPS"];
      return res;
    },
    passive: function(rune, stats) {
      var buffs = {};
      if (rune === "d" && this.params[0].val >= 3) buffs.spiritregen = 8;
      if (stats.set_sunwuko_6pc && this.params[0].val) buffs.dmgmul = {skills: ["lashingtailkick", "tempestrush", "waveoflight"], percent: 1500 * this.params[0].val};
      return buffs;
    },
  },
  cyclonestrike: {
    id: "cyclone-strike",
    name: "Cyclone Strike",
    category: "focus",
    row: 4,
    col: 0,
    runes: {
      d: "Eye of the Storm",
      b: "Implosion",
      a: "Sunburst",
      e: "Wall of Wind",
      c: "Soothing Breeze",
    },
    range: {x: 24, d: 24, b: 34, a: 24, e: 24, c: 24},
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "hol", coeff: 2.61}}; break;
      case "d": res = {"Damage": {elem: "lit", coeff: 2.61}}; break;
      case "b": res = {"Damage": {elem: "hol", coeff: 2.61}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 4.54}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 2.61}}; break;
      case "c": res = {"Damage": {elem: "hol", coeff: 2.61}, "Healing": DiabloCalc.formatNumber(31036 + (stats.healbonus || 0) * 0.17, 0, 1000)}; break;
      }
      return $.extend({"Cost": {cost: (rune === "d" ? 26 : 50)}}, res);
    },
  },
  sevensidedstrike: {
    id: "sevensided-strike",
    name: "Seven-Sided Strike",
    category: "focus",
    row: 4,
    col: 1,
    runes: {
      a: "Sudden Assault",
      b: "Incinerate",
      c: "Pandemonium",
      d: "Sustained Attack",
      e: "Fulminating Onslaught",
    },
    info: function(rune, stats) {
      var res;
      var hits = 7 + (stats.leg_lionsclaw ? 7 : 0);
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 56.77, divide: {"Base Hits": 7}}, "Total Damage": {sum: true, "Damage": {count: hits}}}; break;
      case "a": res = {"Damage": {elem: "lit", coeff: 82.85, divide: {"Base Hits": 7}}, "Total Damage": {sum: true, "Damage": {count: hits}}}; break;
      case "b": res = {"Damage": {elem: "fir", coeff: 56.77, divide: {"Base Hits": 7}}, "Burn Damage": {elem: "fir", coeff: 6.3, total: true}, "Total Damage": {sum: true, "Damage": {count: 7}, "Burn Damage": {count: hits}}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 56.77, divide: {"Base Hits": 7}}, "Total Damage": {sum: true, "Damage": {count: hits}}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 56.77, divide: {"Base Hits": 7}}, "Total Damage": {sum: true, "Damage": {count: hits}}}; break;
      case "e": res = {"Damage": {elem: "hol", coeff: 8.77}, "Total Damage": {sum: true, "Damage": {count: hits}}}; break;
      }
      if (stats.set_uliana_4pc) {
        res["Damage"].factors = {};
        res["Damage"].factors[DiabloCalc.itemSets.uliana.name] = 7.77 * hits;
      }
      if (stats.leg_gungdogear && stats.set_uliana_6pc) {
        var ep_rune = (stats.skills.explodingpalm || "x");
        var ep_info = DiabloCalc.skills.monk.explodingpalm.info(ep_rune, stats);
        ep_info = DiabloCalc.skill_processInfo(ep_info, {skill: ["explodingpalm", ep_rune]});
        res["Exploding Palm Damage"] = {sum: true};
        res["Exploding Palm Damage"][DiabloCalc.skills.monk.explodingpalm.name] = {
          value: ep_info["Explosion Damage"].value, count: (stats.leg_lionsclaw ? 14 : 7),
        };
      }
      var base = {"Cooldown": {cooldown: (rune === "d" ? 14 : 30), cdr: "leg_theflowofeternity+leg_theflowofeternity_p2"}};
      if (rune !== "c") base["Cost"] = {cost: 50};
      return $.extend(base, res);
    },
    active: true,
    buffs: function(rune, stats) {
      if (stats.leg_bindingofthelost || stats.leg_bindingofthelost_p6) {
        return {dmgred: (stats.leg_bindingofthelost || stats.leg_bindingofthelost_p6) * (7 + (stats.leg_lionsclaw ? 7 : 0))};
      }
    },
  },
  mystically: {
    id: "mystic-ally",
    name: "Mystic Ally",
    category: "focus",
    row: 4,
    col: 2,
    runes: {
      b: "Water Ally",
      a: "Fire Ally",
      d: "Air Ally",
      e: "Enduring Ally",
      c: "Earth Ally",
    },
    info: function(rune, stats) {
      var res = {"Cooldown": {cooldown: 30}};
      var runes = this.runes;
      if (!stats.set_inna_6pc) {
        runes = {};
        runes[rune] = "Damage";
      }
      var pct = {};
      if (stats.set_inna_2pc) pct[DiabloCalc.itemSets.inna.name] = 100;
      var count = (stats.leg_thecrudestboots ? 2 : 1);
      var nobp = false;
      var highest = undefined, highestValue = 0;
      var dps = {sum: true};
      for (var x in runes) {
        var info = {};
        info[runes[x]] = {elem: DiabloCalc.skilltips.monk.mystically.elements[x],
          pet: true, aps: true, coeff: 1.3/* * (stats.set_inna_2pc ? 2 : 1)*/};
        var pci = DiabloCalc.skill_processInfo(info, {skill: ["mystically", x]})[runes[x]];
        dps[runes[x]] = {pet: 40, speed: 1, count: count, value: pci.value, nobp: nobp};
        nobp = true;
        if (pci.value > highestValue) {
          highest = info[runes[x]];
          highestValue = pci.value;
        }
      }
      if (highest) res[stats.set_inna_6pc ? "Damage (highest)" : "Damage"] = highest;
      res["DPS"] = dps;
      /*if ("x" in runes) {
        res["Activated Damage"] = {elem: "phy", pet: true, aps: true, coeff: 1.3,
          percent: $.extend({"Activation": 50}, pct)};
      }*/ // NOT WORKING
      if ("b" in runes) {
        res["Wave Damage"] = {elem: "col", pet: true, aps: true, coeff: 6.25, factors: {"Count": 7 * count}};
      }
      if ("a" in runes) {
        res["Explosion Damage"] = {elem: "fir", pet: true, coeff: 4.8, factors: {"Count": 5 * count}};
      }
      if ("c" in runes) {
        res["Boulder DPS"] = {elem: "phy", pet: true, aps: true, coeff: 3.8, total: true, factors: {"Count": count}};
      }
      return res;
    },
    passive: function(rune, stats) {
      var count = (stats.leg_thecrudestboots ? 2 : 1) * (stats.set_inna_2pc ? 2 : 1);
      var res = {};
      if (rune === "a" || stats.set_inna_6pc) res.damage = 10 * count;
      if (rune === "d" || stats.set_inna_6pc) res.spiritregen = 4 * count;
      if (rune === "e" || stats.set_inna_6pc) res.regen = (10728.42 + stats.regen * 0.07) * count;
      if (rune === "c" || stats.set_inna_6pc) res.life = 20 * count;
      return res;
    },
  },
  epiphany: {
    id: "epiphany",
    name: "Epiphany",
    category: "focus",
    row: 4,
    col: 3,
    runes: {
      a: "Desert Shroud",
      e: "Ascendance",
      b: "Soothing Mist",
      c: "Insight",
      d: "Inner Fire",
    },
    info: {
      "*": {"Uptime": {duration: 15, cooldown: 60}},
      b: {"Healing": "@16093+0.04*healbonus"},
      d: {"Extra Damage": {elem: "fir", coeff: 3.53}},
    },
    active: false,
    buffs: {
      x: {spiritregen: 20},
      a: {spiritregen: 20, dmgred: 50},
      e: {spiritregen: 20},
      b: {spiritregen: 20},
      c: {spiritregen: 45},
      d: {spiritregen: 20},
    },
  },
  mantraofsalvation: {
    id: "mantra-of-salvation",
    name: "Mantra of Salvation",
    category: "mantras",
    exclusive: "mantras",
    row: 5,
    col: 0,
    nolmb: true,
    runes: {
      c: "Hard Target",
      e: "Divine Protection",
      d: "Wind through the Reeds",
      b: "Perseverance",
      a: "Agility",
    },
    info: {
      "*": {"Cost": {cost: 50, rcr: {chantofresonance: "passives.chantofresonance?50:0"}}},
    },
    active: false,
    buffs: {
      x: {resist_percent: 20},
      c: {resist_percent: 20},
      e: {resist_percent: 20},
      d: {resist_percent: 20},
      b: {resist_percent: 20},
      a: {resist_percent: 20},
    },
    passive: function(rune, stats) {
      var base = 20 * (stats.set_inna_2pc ? 2 : 1);
      switch (rune) {
      case "x": return {resist_percent: base};
      case "c": return {resist_percent: base, armor_percent: 20};
      case "e": return {resist_percent: base};
      case "d": return {resist_percent: base, extrams: 10};
      case "b": return {resist_percent: base + 20};
      case "a": return {resist_percent: base, dodge: 35};
      }
    },
  },
  mantraofretribution: {
    id: "mantra-of-retribution",
    name: "Mantra of Retribution",
    category: "mantras",
    exclusive: "mantras",
    row: 5,
    col: 1,
    nolmb: true,
    runes: {
      a: "Retaliation",
      b: "Transgression",
      c: "Indignation",
      d: "Against All Odds",
      e: "Collateral Damage",
    },
    info: {
      "*": {"Cost": {cost: 50, rcr: {chantofresonance: "passives.chantofresonance?50:0"}}},
      x: {"Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)"}, "Activated Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)*2"}},
      a: {"Damage": {elem: "fir", coeff: "1.01*(set_inna_2pc?2:1)+1.01"}, "Activated Damage": {elem: "fir", coeff: "1.01*(set_inna_2pc?2:1)*2+2.02"}},
      b: {"Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)"}, "Activated Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)*2"}},
      c: {"Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)"}, "Activated Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)*2"}},
      d: {"Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)"}, "Activated Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)*2"}},
      e: {"Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)"}, "Activated Damage": {elem: "hol", coeff: "1.01*(set_inna_2pc?2:1)*2"}},
    },
    passive: function(rune, stats) {
      if (rune === "b") return {ias: 10/* * (stats.set_inna_2pc ? 2 : 1)*/};
    },
  },
  mantraofhealing: {
    id: "mantra-of-healing",
    name: "Mantra of Healing",
    category: "mantras",
    exclusive: "mantras",
    row: 5,
    col: 2,
    nolmb: true,
    runes: {
      a: "Sustenance",
      d: "Circular Breathing",
      b: "Boon of Inspiration",
      c: "Heavenly Body",
      e: "Time of Need",
    },
    info: {
      "*": {"Cost": {cost: 50, rcr: {chantofresonance: "passives.chantofresonance?50:0"}}, "Shield": "@62064+healbonus*0.15"},
    },
    passive: function(rune, stats) {
      var regen = 10728.42;
      regen += (stats.regen || 0) * 0.07;
      regen *= (stats.set_inna_2pc ? 2 : 1);
      switch (rune) {
      case "x": return {regen: regen};
      case "a": return {regen: regen * 2};
      case "d": return {regen: regen, spiritregen: 3};
      case "b": return {regen: regen, lph: 3576 + (stats.lph || 0) * 0.2};
      case "c": return {regen: regen, life: 20};
      case "e": return {regen: regen};
      }
    },
  },
  mantraofconviction: {
    id: "mantra-of-conviction",
    name: "Mantra of Conviction",
    category: "mantras",
    exclusive: "mantras",
    row: 5,
    col: 3,
    nolmb: true,
    runes: {
      a: "Overawe",
      e: "Intimidation",
      c: "Dishearten",
      d: "Annihilation",
      b: "Submission",
    },
    info: {
      "*": {"Cost": {cost: 50, rcr: {chantofresonance: "passives.chantofresonance?50:0"}}},
      b: {"DPS": {elem: "hol", weapon: "mainhand", coeff: 0.38, total: true}},
    },
    active: false,
    buffs: {
      x: {dmgtaken: 8},
      a: {dmgtaken: 8},
      e: {dmgtaken: 8},
      c: {dmgtaken: 8},
      d: {dmgtaken: 8},
      b: {dmgtaken: 8},
    },
    passive: function(rune, stats) {
      var base = 8 * (stats.set_inna_2pc ? 2 : 1);
      switch (rune) {
      case "x": return {dmgtaken: base};
      case "a": return {dmgtaken: base + 4};
      case "e": return {dmgtaken: base};
      case "c": return {dmgtaken: base};
      case "d": return {dmgtaken: base};
      case "b": return {dmgtaken: base};
      }
    },
  },
};
DiabloCalc.passives.monk = {
  resolve: {
    id: "resolve",
    name: "Resolve",
    index: 0,
  },
  fleetfooted: {
    id: "fleet-footed",
    name: "Fleet Footed",
    index: 1,
    buffs: {extrams: 10},
  },
  exaltedsoul: {
    id: "exalted-soul",
    name: "Exalted Soul",
    index: 2,
    buffs: {maxspirit: 50, spiritregen: 4},
  },
  transcendence: {
    id: "transcendence",
    name: "Transcendence",
    index: 3,
    buffs: function(stats) {
      return {lifespirit: 429 + 0.004 * stats.healbonus};
    },
  },
  chantofresonance: {
    id: "chant-of-resonance",
    name: "Chant of Resonance",
    index: 4,
    buffs: function(stats) {
      if (stats.skills.mantraofsalvation || stats.skills.mantraofretribution ||
          stats.skills.mantraofhealing || stats.skills.mantraofconviction) {
        return {spiritregen: 4};
      }
    },
  },
  seizetheinitiative: {
    id: "seize-the-initiative",
    name: "Seize the Initiative",
    index: 5,
    active: false,
    buffs: {ias: 30},
  },
  theguardianspath: {
    id: "the-guardians-path",
    name: "The Guardian's Path",
    index: 6,
    buffs: function(stats) {
      if (stats.info.mainhand.slot == "onehand" && stats.info.offhand && stats.info.offhand.slot == "onehand") {
        return {dodge: 35};
      } else if (stats.info.mainhand.slot == "twohand") {
        return {resourcegen: 15};
      }
    },
  },
  sixthsense: {
    id: "sixth-sense",
    name: "Sixth Sense",
    index: 7,
    buffs: {nonphys: 25},
  },
  determination: {
    id: "determination",
    name: "Determination",
    index: 8,
    params: [{min: 0, max: 5, name: "Nearby Enemies"}],
    buffs: function(stats) {return {damage: 4 * this.params[0].val};},
  },
  relentlessassault: {
    id: "relentless-assault",
    name: "Relentless Assault",
    index: 9,
    active: true,
    buffs: {dmgmul: 20},
  },
  beaconofytar: {
    id: "beacon-of-ytar",
    name: "Beacon of Ytar",
    index: 10,
    buffs: {cdr: 20},
  },
  alacrity: {
    id: "alacrity",
    name: "Alacrity",
    index: 11,
  },
  harmony: {
    id: "harmony",
    name: "Harmony",
    index: 12,
    buffs: function(stats) {
      var single = (stats.resphy || 0) + (stats.resfir || 0) + (stats.rescol || 0) +
                   (stats.respsn || 0) + (stats.resarc || 0) + (stats.reslit || 0);
      single *= 0.4;
      return {
        resphy: single - (stats.resphy || 0) * 0.4,
        resfir: single - (stats.resfir || 0) * 0.4,
        rescol: single - (stats.rescol || 0) * 0.4,
        respsn: single - (stats.respsn || 0) * 0.4,
        resarc: single - (stats.resarc || 0) * 0.4,
        reslit: single - (stats.reslit || 0) * 0.4,
      };
    },
  },
  combinationstrike: {
    id: "combination-strike",
    name: "Combination Strike",
    params: [{min: 0, max: 4, val: 1, name: "Stacks"}],
    buffs: function(stats) {return {damage: 10 * this.params[0].val};},
    index: 13,
  },
  neardeathexperience: {
    id: "near-death-experience",
    name: "Near Death Experience",
    index: 14,
  },
  unity: {
    id: "unity",
    name: "Unity",
    index: 15,
    params: [{min: 0, max: 4, val: 1, name: "Stacks"}],
    buffs: function(stats) {return {damage: 5 * this.params[0].val};},
  },
  momentum: {
    id: "momentum",
    name: "Momentum",
    index: 16,
    active: true,
    buffs: {damage: 20},
  },
  mythicrhythm: {
    id: "mythic-rhythm",
    name: "Mythic Rhythm",
    index: 17,
    active: false,
    buffs: {dmgmul: {skills: ["lashingtailkick", "tempestrush", "waveoflight",
      "dashingstrike", "explodingpalm", "sweepingwind", "cyclonestrike", "sevensidedstrike"], percent: 40}},
  },
};
DiabloCalc.partybuffs.monk = {
  cripplingwave: {
    runelist: "e",
  },
  blindingflash: {
    runelist: "e",
    buffs: {e: {regen: 26821}},
  },
  innersanctuary: {
    runelist: "*",
  },
  explodingpalm: {
    runelist: "c",
  },

  mantraofsalvation: {
    runelist: "*",
    boxnames: ["Activated", "Inna's Mantra"],
    buffs: function(rune, stats) {
      var base = 20 * (this.boxvals[1] ? 2 : 1);
      var res = {resist_percent: base + (this.boxvals[0] ? 20 : 0)};
      if (rune === "c") res.armor_percent = 20;
      if (rune === "d") res.extrams = 10;
      if (rune === "b") res.resist_percent += 20;
      if (rune === "a") res.dodge = 35;
      return res;
    },
  },
  mantraofretribution: {
    runelist: "b",
    boxnames: ["Inna's Mantra"],
    buffs: function(rune, stats) {
      if (rune === "b") return {ias: 10 * (this.boxvals[0] ? 2 : 1)};
    },
  },
  mantraofhealing: {
    runelist: "*",
    boxnames: ["Inna's Mantra"],
    buffs: function(rune, stats) {
      var base = 10728.42 * (this.boxvals[0] ? 2 : 1);
      switch (rune) {
      case "x": return {regen: base};
      case "a": return {regen: base + 10728.42};
      case "d": return {regen: base, spiritregen: 3};
      case "b": return {regen: base};
      case "c": return {regen: base, life: 20};
      case "e": return {regen: base};
      }
    },
  },
  mantraofconviction: {
    runelist: "*",
    boxnames: ["Activated", "Inna's Mantra"],
    buffs: function(rune, stats) {
      var base = 10 * (this.boxvals[1] ? 2 : 1);
      var res = {dmgtaken: base};
      if (rune === "a") res.dmgtaken += 6;
      if (this.boxvals[0]) res.dmgtaken += (rune === "a" ? 8 : 10);
      return res;
    },
  },

  unity: {
    buffs: {damage: 5},
  },
};

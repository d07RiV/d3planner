if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.extraskills) DiabloCalc.extraskills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.necromancer = {
  primary: "Primary",
  secondary: "Secondary",
  corpses: "Corpses",
  reanimation: "Reanimation",
  curses: "Curses",
  bloodbone: "Blood & Bone",
};
DiabloCalc.skills.necromancer = {
  bonespikes: {
    id: "bone-spikes",
    name: "Bone Spikes",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      a: "Sudden Impact",
      c: "Bone Pillars",
      d: "Frost Spikes",
      b: "Path of Bones",
      e: "Blood Spikes",
    },
    range: 70,
    params: [{rune: "b", min: 8, max: 80, name: "Distance"}],
    info: {
      "*": {"Damage": {elem: "phy", coeff: 1.2}, "DPS": {sum: true, "Damage": {speed: "passives.swiftharvesting?1.15:1", fpa: 60, round: "up"}}},
      a: {"Damage": {elem: "phy", coeff: 1.2}},
      c: {"Damage": {elem: "psn", coeff: 1.8}, "DPS": {sum: true, "Damage": {speed: "passives.swiftharvesting?1.15:1", fpa: 58.0645, round: "up"}}},
      d: {"Damage": {elem: "col", coeff: 1.2}},
      b: {"Damage": {elem: "phy", coeff: "0.8+0.8*($1-8)/72"}, "DPS": {sum: true, "Damage": {speed: "passives.swiftharvesting?1.15:1", fpa: 58.0645, round: "up"}}},
      e: {"Damage": {elem: "phy", coeff: 1.2}, "Bleed Damage": {elem: "phy", coeff: 0.5}},
    },
  },
  grimscythe: {
    id: "grim-scythe",
    name: "Grim Scythe",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      b: "Execution",
      d: "Dual Scythes",
      e: "Cursed Scythe",
      c: "Frost Scythe",
      a: "Blood Scythe",
    },
    range: 6.5,
    params: [{rune: "c", name: "Stacks", min: 0, max: 15, val: 0},
             {min: 0, max: "0.999+maxessence/(12*(1+0.01*resourcegen))", name: "Enemies Hit", buffs: false, show: function(rune, stats) {
               return !!stats.leg_legersdisdain;
             }}],
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 1.5}, "DPS": {sum: true, "Damage": {speed: "passives.swiftharvesting?1.15:1", fpa: 58.0645, round: "up"}}};
      if (rune === "e") res["Damage"].elem = "psn";
      if (rune === "c") res["Damage"].elem = "col";
      if (stats.leg_legersdisdain) {
        var pct = {};
        pct[DiabloCalc.itemById.P6_Unique_Phylactery_03.name] = stats.leg_legersdisdain * Math.min(stats.maxessence, this.params[1].val * 12 * (1 + 0.01 * (stats.resourcegen || 0)));
        res["Damage"].percent = pct;
      }
      return res;
    },
    active: true,
    buffs: function(rune, stats) {
      if (rune === "c") {
        return {ias: this.params[0].val};
      }
    },
  },
  siphonblood: {
    id: "siphon-blood",
    name: "Siphon Blood",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      e: "Blood Sucker",
      a: "Suppress",
      d: "Power Shift",
      b: "Purity of Essence",
      c: "Drain Life",
    },
    range: 50,
    params: [{rune: "d", min: 0, max: 10, val: 0, name: "Stacks", buffs: false}],
    info: {
      "*": {"DPS": {elem: "phy", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}}},
      e: {"DPS": {elem: "phy", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}}},
      a: {"DPS": {elem: "col", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}}},
      d: {"DPS": {elem: "psn", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}, percent: {"Stacks": "10*$1"}}},
      b: {"DPS": {elem: "phy", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}}},
      c: {"DPS": {elem: "phy", aps: true, coeff: 3.0, total: true, passives: {"swiftharvesting": 15}}},
    },
  },
  bonespear: {
    id: "bone-spear",
    name: "Bone Spear",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      c: "Blighted Marrow",
      e: "Teeth",
      a: "Crystallization",
      b: "Shatter",
      d: "Blood Spear",
    },
    range: 0,
    params: [{rune: "c", min: 0, max: 10, inf: true, val: 0, name: "Enemies Hit", buffs: false},
             {rune: "a", min: 0, max: 10, val: 0, name: "Enemies Hit"}],
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 5.0}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58.0645, round: "up"}}, "Cost": {cost: 20}};
      if (stats.leg_maltoriuspetrifiedspike) res["Cost"].cost = 40;
      if (rune === "c") { res["Damage"].elem = "psn"; res["Damage"].percent = {"Bonus": 15 * this.params[0].val}; }
      if (rune === "e") res["Damage"].coeff = 3.0;
      if (rune === "a") res["Damage"].elem = "col";
      if (rune === "d") res["Damage"].coeff = 6.5;
      if (stats.skills.simulacrum && DiabloCalc.skills.necromancer.simulacrum.active) {
        res["DPS"]["Damage"].count = (stats.skills.simulacrum === "d" ? 3 : 2);
      }
      return res;
    },
    buffs: function(rune, stats) {
      if (rune === "a") {
        return {ias: 3 * this.params[1].val};
      }
    },
  },
  skeletalmage: {
    id: "skeletal-mage",
    name: "Skeletal Mage",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      a: "Gift of Death",
      d: "Contamination",
      e: "Skeleton Archer",
      b: "Singularity",
      c: "Life Support",
    },
    range: 60,
    params: [{min: 0, max: 10, val: 1, name: "Count", buffs: false},
             {rune: "e", min: 0, max: 10, name: "Stacks"},
             {rune: "b", min: 0, max: "maxessence", name: "Essence", buffs: false}],
    info: {
      "*": {"Damage": {elem: "phy", pet: true, coeff: 2.0}, "DPS": {sum: true, "Damage": {pet: 60, speed: 1}}, "Total DPS": {sum: true, "DPS": {count: "$1"}}, "Cost": {cost: 40}},
      a: {"Damage": {elem: "phy", pet: true, coeff: 2.0}},
      d: {"Damage": {elem: "psn", pet: true, coeff: 2.0}, "Aura DPS": {elem: "psn", total: true, coeff: 1.0}, "DPS": {sum: true, "Damage": {pet: 60, speed: 1}, "Aura DPS": {}}},
      e: {"Damage": {elem: "col", pet: true, coeff: 4.0}, "DPS": {sum: true, "Damage": {pet: 120, speed: 1}}},
      b: {"Damage": {elem: "phy", pet: true, coeff: 2.0, percent: {"Essence Consumed": "$3*3"}}},
      c: {"Damage": {elem: "phy", pet: true, coeff: 2.0}},
    },
    active: true,
    buffs: function(rune, stats) {
      if (rune === "e") {
        return {ias: 3 * this.params[1].val};
      }
    },
  },
  deathnova: {
    id: "death-nova",
    name: "Death Nova",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      e: "Unstable Compound",
      a: "Tendril Nova",
      d: "Blight",
      b: "Bone Nova",
      c: "Blood Nova",
    },
    range: 0,
    info: function(rune, stats) {
      var res = {"Damage": {elem: "psn", coeff: 3.5}, "DPS": {sum: true, "Damage": {speed: 1, fpa: 58.0645, round: "up"}}, "Cost": {cost: 20}};
      if (rune === "a") res["Damage"] = {elem: "phy", coeff: 2.25};
      if (rune === "b") res["Damage"] = {elem: "phy", coeff: 4.75};
      if (rune === "c") res["Damage"] = {elem: "phy", coeff: 4.5};
      if (stats.skills.simulacrum && DiabloCalc.skills.necromancer.simulacrum.active) {
        res["DPS"]["Damage"].count = (stats.skills.simulacrum === "d" ? 3 : 2);
      }
      return res;
    },
  },
  corpseexplosion: {
    id: "corpse-explosion",
    name: "Corpse Explosion",
    category: "corpses",
    row: 2,
    col: 0,
    runes: {
      d: "Bloody Mess",
      c: "Close Quarters",
      a: "Shrapnel",
      e: "Dead Cold",
      b: "Final Embrace",
    },
    range: 0,
    info: {
      "*": {"Damage": {elem: "phy", coeff: 3.5}},
      d: {"Damage": {elem: "phy", coeff: 3.5}},
      c: {"Damage": {elem: "psn", coeff: 5.25}},
      a: {"Damage": {elem: "psn", coeff: 3.5}},
      e: {"Damage": {elem: "col", coeff: 3.5}},
      b: {"Damage": {elem: "phy", coeff: 3.5}},
    },
  },
  corpselance: {
    id: "corpse-lance",
    name: "Corpse Lance",
    category: "corpses",
    row: 2,
    col: 1,
    runes: {
      e: "Shredding Splinters",
      b: "Brittle Touch",
      a: "Ricochet",
      d: "Visceral Impact",
      c: "Blood Lance",
    },
    range: 0,
    params: [{rune: "b", min: 0, max: 20, val: 0, name: "Stacks"},
             {min: 0, max: 20, name: "Corpses Consumed", buffs: false, show: function(rune, stats) {
               return !!stats.leg_corpsewhisperpauldrons;
             }}],
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 17.5}};
      if (rune === "e") res["Damage"].elem = "psn";
      if (rune === "b") res["Damage"].elem = "col";
      if (rune === "a") res["Damage"].elem = "psn";
      if (rune === "c") res["Additional Damage"] = {elem: "phy", coeff: 5.25};
      if (stats.leg_corpsewhisperpauldrons) {
        var pct = {};
        pct[DiabloCalc.itemById.P6_Necro_Unique_Shoulders_21.name] = stats.leg_corpsewhisperpauldrons * this.params[1].val;
        res["Damage"].percent = pct;
        if (res["Additional Damage"]) res["Additional Damage"].percent = pct;
      }
      res["DPS"] = {sum: true, "Damage": {speed: 1, fpa: 12}};
      if (res["Additional Damage"]) res["DPS"]["Additional Damage"] = {speed: 1, fpa: 12, nobp: true};
      return res;
    },
    active: true,
    buffs: function(rune, stats) {
      if (rune === "b") {
        return {chctaken: 5 * this.params[0].val};
      }
    },
  },
  devour: {
    id: "devour",
    name: "Devour",
    category: "corpses",
    row: 2,
    col: 2,
    runes: {
      e: "Satiated",
      b: "Ruthless",
      d: "Devouring Aura",
      c: "Voracious",
      a: "Cannibalize ",
    },
    range: 0,
    active: true,
    params: [{rune: "ec", min: 0, max: 25, val: 0, name: "Stacks"}],
    buffs: function(rune, stats) {
      if (rune === "e") return {life: 2 * this.params[0].val};
      if (rune === "c") return {rcr_essence: 2 * this.params[0].val};
    },
  },
  revive: {
    id: "revive",
    name: "Revive",
    category: "corpses",
    row: 2,
    col: 3,
    runes: {
      c: "Personal Army",
      e: "Horrific Return",
      a: "Purgatory",
      d: "Recklessness",
      b: "Oblation",
    },
    range: 0,
    active: true,
    params: [{rune: "c", min: 0, max: 10, val: 0, name: "Stacks"}],
    buffs: function(rune, stats) {
      if (rune === "c") {
        return {dmgred: this.params[0].val};
      }
    },
  },
  commandskeletons: {
    id: "command-skeletons",
    name: "Command Skeletons",
    category: "reanimation",
    row: 3,
    col: 0,
    runes: {
      a: "Enforcer",
      e: "Frenzy",
      b: "Dark Mending",
      c: "Freezing Grasp",
      d: "Kill Command",
    },
    range: 0,
    params: [{min: 1, max: 7, name: "Skeletons", buffs: false},
             {min: 0, max: "1+500/(leg_boneringer+0.01)", name: "Active Time", buffs: false, show: function(rune, stats) {
               return !!stats.leg_boneringer;
             }}],
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", pet: true, coeff: 0.5}, "DPS": {sum: true, "Damage": {pet: 50, speed: 1, count: this.params[0].val}}, "Cost": {cost: 50, rcr: stats.passives.commanderoftherisendead ? 30 : 0}};
      var allRunes = false;
      if (stats.leg_bloodsongmail && stats.skills.landofthedead && DiabloCalc.skills.necromancer.landofthedead.active) {
        allRunes = true;
      }
      if (allRunes || rune === "a") res["Cost"].cost = 25;
      if (allRunes || rune === "e") if (this.active) res["DPS"]["Damage"].pet = 40;
      if (rune === "c") res["Damage"].elem = "col";
      if (rune === "d") res["Damage"].elem = "psn";
      if (allRunes || rune === "d") {
        res["Explosion Damage"] = {elem: res["Damage"].elem, pet: true, coeff: 2.15};
        res["Total Explosion Damage"] = {sum: true, "Explosion Damage": {count: this.params[0].val}};
      }
      if (stats.leg_boneringer) {
        var pct = {};
        pct[DiabloCalc.itemById.P6_Unique_Phylactery_02.name] = Math.min(stats.leg_boneringer * this.params[1].val, 500);
        res["Damage"].percent = pct;
        if (res["Explosion Damage"]) res["Explosion Damage"].percent = pct;
      }
      return res;
    },
    active: false,
    buffs: function(rune, stats) {
      var res = {dmgmul: {list: [{skills: ["commandskeletons"], percent: 50}]}};
      if (stats.set_jesseth_2pc) {
        res.dmgmul.list.push({source: "set_jesseth_2pc", value: {pet: true, percent: 400}});
      }
      return res;
    },
  },
  commandgolem: {
    id: "command-golem",
    name: "Command Golem",
    category: "reanimation",
    row: 3,
    col: 1,
    runes: {
      d: "Flesh Golem",
      e: "Ice Golem",
      a: "Bone Golem",
      c: "Decay Golem",
      b: "Blood Golem",
    },
    range: 100,
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", pet: true, coeff: 4.5}, "DPS": {sum: true, "Damage": {pet: 90, speed: 1}}, "Cooldown": {cooldown: 45, cdr: stats.passives.commanderoftherisendead ? 30 : 0}};
      switch (rune) {
      case "e": res["Damage"].elem = "col"; break;
      case "a": res["Activation Damage"] = {elem: "phy", pet: true, coeff: 20.0, total: true}; break;
      case "c": res["Damage"].elem = "psn"; break;
      }
      return res;
    },
    active: false,
    params: [{rune: "c", min: 0, max: 10, val: 0, name: "Corpses Consumed"}],
    buffs: function(rune, stats) {
      var res = {};
      if (rune === "e") res.chctaken = 10;
      if (rune === "c") res.dmgmul = {skills: ["commandgolem"], percent: 30 * this.params[0].val};
      if (stats.leg_golemskinbreeches) res.dmgred = 30;
      return res;
    },
  },
  armyofthedead: {
    id: "army-of-the-dead",
    name: "Army of the Dead",
    category: "reanimation",
    row: 3,
    col: 2,
    runes: {
      a: "Blighted Grasp",
      d: "Death Valley",
      c: "Unconventional Warfare",
      b: "Frozen Army",
      e: "Dead Storm",
    },
    range: 45,
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 120.00, total: true}, "Cooldown": {cooldown: 120}};
      if (stats.leg_fatesvow || rune === "c") res["Damage"].coeff = 500.00;
      else if (rune === "a") res["Damage"].coeff = 140.0;
      else if (rune === "e") res["Damage"].coeff = 155.0;
      if (rune === "a") res["Damage"].elem = "psn";
      if (rune === "b") res["Damage"].elem = "col";
      return res;
    },
  },
  landofthedead: {
    id: "land-of-the-dead",
    name: "Land of the Dead",
    category: "reanimation",
    row: 3,
    col: 3,
    runes: {
      b: "Frozen Lands",
      c: "Plaguelands",
      e: "Shallow Graves",
      a: "Invigoration",
      d: "Land of Plenty",
    },
    range: 70,
    info: {
      "*": {"Cooldown": {cooldown: 120}},
      c: {"Damage": {elem: "psn", coeff: 100.00, total: true}},
    },
    active: false,
    buffs: function(rune, stats) {
      var res = {};
      if (stats.leg_bloodsongmail) {
        res.dmgmul = {skills: ["commandskeletons"], percent: stats.leg_bloodsongmail};
      }
      if (rune === "a") res.rcr_essence = 100;
      return res;
    },
  },
  decrepify: {
    id: "decrepify",
    name: "Decrepify",
    category: "curses",
    row: 4,
    col: 0,
    runes: {
      e: "Dizzying Curse",
      a: "Enfeeblement",
      b: "Opportunist",
      d: "Wither",
      c: "Borrowed Time",
    },
    range: 70,
    active: false,
    info: {
      "*": {"Cost": {cost: 10, rcr: "passives.eternaltorment?50:0"}},
    },
    params: [{rune: "b", min: 0, max: 10, val: 0, name: "Stacks"},
             {rune: "c", min: 0, max: 20, val: 0, name: "Stacks"},],
    buffs: function(rune, stats) {
      var res = {};
      if (rune === "b") res.extrams = this.params[0].val * 3;
      if (rune === "c") res.cdr = this.params[1].val;
      if (stats.leg_daynteesbinding) res.dmgred = stats.leg_daynteesbinding;
      return res;
    },
  },
  leech: {
    id: "leech",
    name: "Leech",
    category: "curses",
    row: 4,
    col: 1,
    runes: {
      b: "Transmittable",
      a: "Osmosis",
      e: "Blood Flask",
      c: "Sanguine End",
      d: "Cursed Ground",
    },
    range: 70,
    info: {
      "*": {"Cost": {cost: 10, rcr: "passives.eternaltorment?50:0"}},
    },
    active: false,
    params: [{rune: "ad", min: 0, max: 20, val: 0, name: "Enemies Hit"}],
    buffs: function(rune, stats) {
      if (rune === "a") return {regen: this.params[0].val * 751};
      if (rune === "d") return {regen_percent: this.params[0].val};
    },
  },
  frailty: {
    id: "frailty",
    name: "Frailty",
    category: "curses",
    row: 4,
    col: 2,
    runes: {
      d: "Scent of Blood",
      c: "Volatile Death",
      e: "Aura of Frailty",
      b: "Harvest Essence",
      a: "Early Grave",
    },
    range: 70,
    info: {
      "*": {"Cost": {cost: 10, rcr: "passives.eternaltorment?50:0"}},
      c: {"Damage": {elem: "phy", coeff: 1.00}},
      e: {"Range": "@15+pickup*0.5", "Cost": null},
    },
    active: false,
    buffs: function(rune, stats) {
      if (rune === "d") return {dmgtaken: {pet: true, percent: 15}};
    },
  },
  bonearmor: {
    id: "bone-armor",
    name: "Bone Armor",
    category: "bloodbone",
    row: 5,
    col: 0,
    runes: {
      a: "Vengeful Armaments",
      c: "Dislocation",
      b: "Limited Immunity",
      e: "Harvest of Anguish",
      d: "Thy Flesh Sustained",
    },
    range: 70,
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 1.25}, "Cost": {cost: 10}, "Cooldown": {cooldown: 10}};
      if (rune === "a") res["Damage"].coeff = 1.45;
      if (rune === "c") res["Damage"].elem = "psn";
      if (rune === "b") res["Cooldown"].cooldown = 45;
      if (rune === "e") res["Damage"].elem = "col";
      if (stats.set_inarius_6pc) {
        res["DPS"] = {elem: res["Damage"].elem, coeff: 7.5, total: true};
      }
      return res;
    },
    active: false,
    params: [{min: 1, max: "10+(leg_wisdomofkalan?5:0)", val: 0, name: "Stacks"}],
    buffs: function(rune, stats) {
      if (!this.params[0].val) return;
      var res = {dmgred: (stats.set_inarius_4pc ? 5 : 3) * this.params[0].val};
      if (rune === "e") res.extrams = this.params[0].val;
      if (rune === "d") res.regen_bonus = 10 * this.params[0].val;
      res.dmgmul = {list: []};
      if (stats.leg_scytheofthecycle) {
        res.dmgmul.list.push({source: "P6_Unique_Scythe1H_03", value: {skills: ["bonespear", "skeletalmage", "deathnova"], percent: stats.leg_scytheofthecycle}});
      }
      if (stats.set_inarius_6pc) {
        res.dmgmul.list.push({source: "set_inarius_6pc", value: 2750});
      }
      return res;
    },
  },
  bonespirit: {
    id: "bone-spirit",
    name: "Bone Spirit",
    category: "bloodbone",
    row: 5,
    col: 1,
    runes: {
      e: "Astral Projection",
      b: "Panic Attack",
      c: "Poltergeist",
      d: "Unfinished Business",
      a: "Possession",
    },
    range: 60,
    params: [{rune: "e", min: 0, max: 10, inf: true, val: 0, name: "Enemies Hit", buffs: false},
             {min: 0, max: 30, name: "Active Time", buffs: false, show: function(rune, stats) {
               return !!stats.leg_defilercuisses;
             }}],
    info: function(rune, stats) {
      var res = {"Damage": {elem: "phy", coeff: 40.00}, "Cooldown": {cooldown: 15}};
      if (rune === "e") res["Damage"] = {elem: "col", coeff: 40.00, percent: {"Bonus": 15 * this.params[0].val}};
      if (rune === "b") res["Damage"].elem = "psn";
      if (rune === "d") res["Damage"] = {elem: "col", coeff: 12.50};
      if (stats.leg_defilercuisses) {
        var pct = {};
        pct[DiabloCalc.itemById.P6_Necro_Unique_Pants_22.name] = stats.leg_defilercuisses * this.params[1].val;
        res["Damage"].percent = pct;
      }
      return res;
    },
  },
  bloodrush: {
    id: "blood-rush",
    name: "Blood Rush",
    category: "bloodbone",
    row: 5,
    col: 2,
    runes: {
      d: "Potency",
      a: "Transfusion",
      e: "Molting",
      b: "Hemostasis",
      c: "Metabolism",
    },
    range: 50,
    info: {
      "*": {"Cooldown": {cooldown: 5}},
    },
    active: false,
    buffs: function(rune, stats) {
      if (rune === "d" || stats.set_trangoul_2pc) return {armor_percent: 100};
    },
  },
  simulacrum: {
    id: "simulacrum",
    name: "Simulacrum",
    category: "bloodbone",
    row: 5,
    col: 3,
    runes: {
      b: "Cursed Form",
      a: "Reservoir",
      e: "Self Sacrifice",
      c: "Blood Debt",
      d: "Blood and Bone",
    },
    range: 0,
    info: {
      "*": {"Cooldown": {cooldown: 120}},
    },
    active: false,
    activeshow: function(rune, stats) {
      return true;
    },
    buffs: {
      a: {maxessence_percent: 100},
    },
  },
};
DiabloCalc.passives.necromancer = {
  lifefromdeath: {
    id: "life-from-death",
    name: "Life from Death",
    index: 0,
  },
  fueledbydeath: {
    id: "fueled-by-death",
    name: "Fueled by Death",
    index: 1,
    active: true,
    params: [{min: 0, max: 10, name: "Stacks"}],
    buffs: function(stats) {
      return {extrams: this.params[0].val * 3};
    },
  },
  standalone: {
    id: "stand-alone",
    name: "Stand Alone",
    index: 2,
    active: true,
    params: [{min: 0, max: 10, name: "Minions"}],
    buffs: function(stats) {
      return {armor_percent: 100 - 10 * this.params[0].val};
    },
  },
  boneprison: {
    id: "bone-prison",
    name: " Bone Prison",
    index: 3,
  },
  swiftharvesting: {
    id: "swift-harvesting",
    name: "Swift Harvesting",
    index: 4,
  },
  commanderoftherisendead: {
    id: "commander-of-the-risen-dead",
    name: "Commander of the Risen Dead",
    index: 5,
  },
  extendedservitude: {
    id: "extended-servitude",
    name: "Extended Servitude",
    index: 6,
  },
  rigormortis: {
    id: "rigor-mortis",
    name: "Rigor Mortis",
    index: 7,
  },
  overwhelmingessence: {
    id: "overwhelming-essence",
    name: "Overwhelming Essence",
    index: 8,
    buffs: {maxessence: 40},
  },
  darkreaping: {
    id: "dark-reaping",
    name: "Dark Reaping",
    index: 9,
  },
  spreadingmalediction: {
    id: "spreading-malediction",
    name: "Spreading Malediction",
    index: 10,
    active: true,
    params: [{min: 0, max: 20, inf: true, name: "Stacks"}],
    buffs: function(stats) {
      return {dmgmul: this.params[0].val};
    },
  },
  eternaltorment: {
    id: "eternal-torment",
    name: " Eternal Torment",
    index: 11,
  },
  finalservice: {
    id: "final-service",
    name: "Final Service",
    index: 12,
  },
  grislytribute: {
    id: "grisly-tribute",
    name: "Grisly Tribute",
    index: 13,
  },
  drawlife: {
    id: "draw-life",
    name: "Draw Life",
    index: 14,
    active: true,
    params: [{min: 0, max: 20, inf: true, name: "Nearby Enemies"}],
    buffs: function(stats) {
      return {regen_bonus: 10 * this.params[0].val};
    },
  },
  serration: {
    id: "serration",
    name: "Serration",
    index: 15,
    active: true,
    params: [{min: 0, max: 30, step: 1.5, name: "Distance"}],
    buffs: function(stats) {
      return {dmgmul: {skills: ["bonespikes", "bonespear", "bonespirit"], percent: this.params[0].val / 1.5}};
    },
  },
  aberrantanimator: {
    id: "aberrant-animator",
    name: "Aberrant Animator",
    index: 16,
  },
  bloodforblood: {
    id: "blood-for-blood",
    name: "Blood for Blood",
    index: 17,
  },
  bloodispower: {
    id: "blood-is-power",
    name: "Blood Is Power",
    index: 18,
  },
  rathmasshield: {
    id: "rathmas-shield",
    name: "Rathma's Shield",
    index: 19,
  },
};
DiabloCalc.partybuffs.necromancer = {
  corpselance: {
    runelist: "b",
    params: [{min: 0, max: 20, val: 0, name: "Stacks"}],
    buffs: function(stats) {
      return {chctaken: this.params[0].val * 5};
    },
  },
  commandgolem: {
    runelist: "e",
  },
};

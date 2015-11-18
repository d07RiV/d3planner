DiabloCalc.addItems([

  // BOW

  {
    id: "Unique_Bow_005_x1",
    name: "Uskang",
    suffix: _L("Legacy"),
    type: "bow",
    quality: "legendary",
    preset: ["wpnlit", "mainstat", "expadd"],
  },

  {
    id: "Unique_Bow_005_p1",
    name: "Uskang",
    type: "bow",
    quality: "legendary",
    affixes: {
      dmglit: "elementalDamage",
    },
    preset: ["wpnlit", "mainstat", "dmglit"],
  },

  {
    id: "Unique_Bow_001_x1",
    name: "Etrayu",
    suffix: _L("Legacy"),
    type: "bow",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "dura"],
  },

  {
    id: "Unique_Bow_001_p1",
    name: "Etrayu",
    type: "bow",
    quality: "legendary",
    affixes: {
      dmgcol: "elementalDamage",
    },
    preset: ["wpncol", "mainstat", "dmgcol", "dura"],
  },

  {
    id: "Unique_Bow_008_x1",
    name: "The Raven's Wing",
    type: "bow",
    quality: "legendary",
    required: {
      gf: "gfLarge",
      custom: {id: "leg_theravenswing", name: "A raven flies to your side", format: "A raven flies to your side.", args: 0},
    },
    preset: ["mainstat", "gf"],
  },

  {
    id: "Unique_Bow_101_x1",
    name: "Kridershot",
    type: "bow",
    quality: "legendary",
    required: {
      custom: {id: "leg_kridershot", name: "Elemental Arrow Generates Hatred", format: "Elemental Arrow now generates %d Hatred.", min: 3, max: 4},
    },
    preset: ["mainstat", "damage"],
  },

  {
    id: "Unique_Bow_015_x1",
    name: "Cluckeye",
    type: "bow",
    quality: "legendary",
    required: {
      custom: {id: "leg_cluckeye", name: "Chance to Cluck", format: "%d%% chance to cluck when attacking.", min: 25, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bow_009_x1",
    name: "Windforce",
    type: "bow",
    quality: "legendary",
    required: {
      hitknockback: {min: 30, max: 50, step: 0.1},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bow_103_x1",
    name: "Leonine Bow of Hashir",
    type: "bow",
    quality: "legendary",
    required: {
      custom: {id: "leg_leoninebowofhashir", name: "Chance to Pull Enemies", format: "Bolas have a %d%% chance on explosion to pull in all enemies within 24 yards.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bow_010_x1",
    name: "Sydyru Crust",
    type: "bow",
    quality: "legendary",
    preset: ["wpnpsn", "weaponias", "edmg"],
  },

  {
    id: "Unique_Bow_007_x1",
    name: "Unbound Bolt",
    type: "bow",
    quality: "legendary",
    affixes: {
      chd: {min: 31, max: 35},
    },
    preset: ["wpncol", "weaponias", "chd"],
  },

  // CROSSBOW

  {
    id: "Unique_XBow_001_x1",
    name: "Demon Machine",
    type: "crossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_demonmachine", name: "Chance to Shoot Explosive Bolts", format: "%d%% chance to shoot explosive bolts when attacking.", min: 35, max: 65},
    },
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_XBow_011_x1",
    name: "Buriza-Do Kyanon",
    type: "crossbow",
    quality: "legendary",
    required: {
      hitfreeze: {min: 7.5, max: 10, step: 0.1},
      custom: {id: "leg_burizadokyanon", name: "Projectiles Pierce", format: "Your projectiles pierce %d additional times.", min: 1, max: 2},
    },
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_XBow_006_x1",
    name: "Bakkan Caster",
    type: "crossbow",
    quality: "legendary",
    preset: ["mainstat"],
  },

  {
    id: "Unique_XBow_012_x1",
    name: "Pus Spitter",
    type: "crossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_pusspitter", name: "Chance to Lob an Acid Blob", format: "%d%% chance to lob an acid blob when attacking.", min: 25, max: 50},
    },
    preset: ["wpnpsn", "mainstat"],
  },

  {
    id: "Unique_XBow_002_x1",
    name: "Hellrack",
    type: "crossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_hellrack", name: "Chance to Root Enemies", format: "Chance to root enemies to the ground when you hit them.", args: 0},
    },
    preset: ["wpnfir", "sockets", "mainstat"],
  },

  {
    id: "Unique_XBow_003_x1",
    name: "Manticore",
//    suffix: _L("Legacy"),
    type: "crossbow",
    quality: "legendary",
    preset: ["wpnpsn", "mainstat", "sockets"],
  },

  {
    id: "Unique_Xbow_101_x1",
    ids: ["Unique_XBow_101_x1"],
    name: "Chanon Bolter",
    type: "crossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_chanonbolter", name: "Lure Cooldown on Spike Traps", format: "Your Spike Traps lure enemies to them. Enemies may be taunted once every %d seconds.", min: 12, max: 16, best: "min"},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Xbow_102_x1",
    name: "Wojahnni Assaulter",
    type: "crossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_wojahnniassaulter", name: "Rapid Fire Ramp-Up", format: "Rapid Fire deals %d%% more damage for every second that you channel. Stacks up to 4 times.", min: 30, max: 40},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_XBow_004_x1",
    name: "Arcane Barb",
    type: "crossbow",
    quality: "legendary",
    preset: ["wpnarc"],
  },

  // HAND CROSSBOW

  {
    id: "Unique_HandXBow_005_x1",
    name: "Izzuccob",
    type: "handcrossbow",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "maxdisc"],
  },

  {
    id: "Unique_HandXBow_004_x1",
    name: "Balefire Caster",
    suffix: _L("Legacy"),
    type: "handcrossbow",
    quality: "legendary",
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_HandXBow_004_p1",
    name: "Balefire Caster",
    type: "handcrossbow",
    quality: "legendary",
    affixes: {
      dmgfir: "elementalDamage",
    },
    preset: ["wpnfir", "mainstat", "dmgfir"],
  },

  {
    id: "Unique_HandXBow_101_x1",
    name: "K'mar Tenclip",
    type: "handcrossbow",
    quality: "legendary",
    required: {
      skill_demonhunter_strafe: {min: 75, max: 100},
      custom: {id: "leg_kmartenclip", name: "Strafe Gains Drifting Shadow", format: "Strafe gains the effect of the Drifting Shadow rune.", args: 0},
    },
    preset: ["mainstat", "sockets"],
    primary: 5,
  },

  {
    id: "Unique_HandXBow_007_x1",
    name: "Dawn",
//    suffix: _L("Legacy"),
    type: "handcrossbow",
    quality: "legendary",
    affixes: {
      hitstun: {min: 1, max: 5, step: 0.1},
    },
    preset: ["wpnhol", "mainstat", "hitstun"],
  },

  {
    id: "Unique_HandXBow_012_x1",
    name: "Calamity",
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_calamity", name: "Enemies Become Marked for Death", format: "Enemies you hit become Marked for Death.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_HandXBow_006_x1",
    name: "Blitzbolter",
    type: "handcrossbow",
    quality: "legendary",
    preset: ["wpnhol"],
  },

  {
    id: "Unique_HandXBow_002_x1",
    name: "Danetta's Revenge",
    type: "handcrossbow",
    quality: "set",
    set: "danetta",
    required: {
      custom: {id: "leg_danettasrevenge", name: "Vault Gains Rattling Roll", format: "Vault gains the effect of the Rattling Roll rune.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_HandXBow_001_x1",
    name: "Danetta's Spite",
    type: "handcrossbow",
    quality: "set",
    set: "danetta",
    required: {
      custom: {id: "leg_danettasspite", name: "Leave Clone After Vault", format: "Leave a clone of yourself behind after using Vault.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_HandXBow_003_x1",
    name: "Natalya's Slayer",
    type: "handcrossbow",
    quality: "set",
    set: "natalya",
    affixes: {
      skill_demonhunter_rainofvengeance: {min: 20, max: 25},
    },
    preset: ["wpncol", "mainstat", "damage", "sockets", "skill_demonhunter_rainofvengeance"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_HandXBow_016_x1",
    name: "Hallowed Condemnation",
    type: "handcrossbow",
    quality: "set",
    set: "hallowed",
    preset: ["wpnhol"],
  },

  // WAND

  {
    id: "Unique_Wand_003_x1",
    name: "Starfire",
    type: "wand",
    quality: "legendary",
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_Wand_006_x1",
    name: "Blackhand Key",
    type: "wand",
    quality: "legendary",
    preset: ["wpnarc", "mainstat", "maxap"],
  },

  {
    id: "Unique_Wand_102_x1",
    name: "Serpent's Sparker",
    type: "wand",
    quality: "legendary",
    required: {
      custom: {id: "leg_serpentssparker", name: "Extra Hydra", format: "You may have one extra Hydra active at a time.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Wand_101_x1",
    name: "Wand of Woh",
    type: "wand",
    quality: "legendary",
    required: {
      custom: {id: "leg_wandofwoh", name: "Quadruple Explosive Blast", format: "3 additional Explosive Blasts are triggered after casting Explosive Blast.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Wand_010_x1",
    name: "Fragment of Destiny",
    type: "wand",
    quality: "legendary",
    required: {
      skill_wizard_spectralblade: {min: 15, max: 30},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Wand_002_x1",
    name: "Gesture of Orpheus",
    suffix: _L("Legacy"),
    type: "wand",
    quality: "legendary",
    affixes: {
      dmgarc: "elementalDamage",
    },
    required: {
      custom: {id: "leg_gestureoforpheus", name: "Slow Time Cooldown Reduction", format: "Reduces the cooldown of Slow Time by %d%%.", min: 50, max: 70},
    },
    preset: ["wpnarc", "mainstat", "dmgarc"],
  },

  {
    id: "P2_Unique_Wand_002",
    name: "Gesture of Orpheus",
    type: "wand",
    quality: "legendary",
    affixes: {
      elemental: "elementalDamage",
    },
    required: {
      custom: {id: "leg_gestureoforpheus_p2", name: "Slow Time Cooldown Reduction", format: "Reduces the cooldown of Slow Time by %d%%.", min: 30, max: 40},
    },
    preset: ["wpnarc", "mainstat", "elemental"],
  },

  {
    id: "Unique_Wand_013_x1",
    name: "Slorak's Madness",
    type: "wand",
    quality: "legendary",
    required: {
      skill_wizard_disintegrate: {min: 15, max: 30},
      custom: {id: "leg_sloraksmadness", name: "This wand finds your death humorous", format: "This wand finds your death humorous.", args: 0},
    },
    preset: ["wpnarc", "mainstat"],
    primary: 5,
    secondary: 2,
  },

  {
    id: "P1_Wand_norm_unique_01",
    name: "Aether Walker",
    type: "wand",
    quality: "legendary",
    required: {
      custom: {id: "leg_aetherwalker", name: "Remove Teleport Cooldown", format: "Teleport no longer has a cooldown but costs 25 Arcane Power.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Wand_009_x1",
    name: "Atrophy",
    type: "wand",
    quality: "legendary",
    preset: ["wpnfire"],
  },

  {
    id: "Unique_Wand_012_x1",
    name: "Chantodo's Will",
    type: "wand",
    quality: "set",
    set: "chantodo",
    preset: ["mainstat"],
  },

  {
    id: "Unique_Wand_018_x1",
    name: "Hallowed Baton",
    type: "wand",
    quality: "set",
    set: "hallowed",
    preset: ["wpnholy"],
  },

  {
    id: "Unique_Bow_102_x1",
    name: "Odyssey's End",
    type: "bow",
    quality: "legendary",
    required: {
      custom: {id: "leg_odysseysend", name: "Snared Damage Bonus", format: "Enemies snared by your Entangling Shot take %d%% increased damage from all sources.", min: 20, max: 25},
    },
    preset: ["mainstat"],
  },

  {
    id: "P2_handXbow_norm_unique_03",
    local: true,
    name: "The Demon's Demise",
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_thedemonsdemise", name: "Sticky Trap Chains", format: "Spike Trap - Sticky Trap spreads to nearby enemies when it explodes.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P3_Unique_HandXBow_005",
    local: true,
    name: "Valla's Bequest",
    type: "handcrossbow",
    quality: "legendary",
    required: {
      skill_demonhunter_strafe: {min: 75, max: 100},
      custom: {id: "leg_vallasbequest", name: "Strafe Pierce", format: "Strafe projectiles pierce.", args: 0},
    },
    preset: ["mainstat", "maxdisc"],
    primary: 5,
  },

  {
    id: "Unique_Bow_104_x1",
    local: true,
    name: "Yang's Recurve",
    type: "bow",
    quality: "legendary",
    required: {
      rcr: {min: 40, max: 50, noblock: true},
      custom: {id: "leg_yangsrecurve", name: "Multishot Speed", format: "Multishot attacks 50%% faster.", args: 0},
    },
    preset: ["mainstat", "damage"],
    primary: 5,
  },

  {
    id: "P1_Wand_norm_unique_02",
    name: "Unstable Scepter",
    suffix: _L("PTR"),
    type: "wand",
    quality: "legendary",
    required: {
      skill_wizard_arcaneorb: {min: 50, max: 65},
      custom: {id: "leg_unstablescepter", name: "Double Arcane Orb Explosion", format: "Arcane Orb's explosion triggers an additional time.", args: 0},
    },
    preset: ["mainstat"],
    primary: 5,
  },

  {
    id: "P4_Unique_HandXBow_001",
    name: "Dawn",
    suffix: _L("PTR"),
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_dawn", name: "Vengeance Cooldown Reduction", format: "Reduce the cooldown of Vengeance by %d%%.", min: 45, max: 60},
    },
    preset: ["mainstat", "wpnhol"],
  },

  {
    id: "P4_Unique_HandXBow_01",
    name: "Lianna's Wings",
    suffix: _L("PTR"),
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_liannaswings", name: "Smoke Screen on Shadow Power", format: "Shadow Power also triggers Smoke Screen.", args: 0},
    },
    preset: ["mainstat", "wpnhol"],
  },

  {
    id: "P4_Unique_HandXBow_02",
    name: "Fortress Ballista",
    suffix: _L("PTR"),
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_fortressballista", name: "Attacks Grant Absorb Shield", format: "Attacks grant you an absorb shield for %.1f%% of your maximum Life. Stacks up to 10 times.", min: 4, max: 5, step: 0.1},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_XBow_001",
    name: "Manticore",
    suffix: _L("PTR"),
    type: "crossbow",
    quality: "legendary",
    required: {
      skill_demonhunter_clusterarrow: {min: 75, max: 100},
      custom: {id: "leg_manticore", name: "Cluster Arrow Cost Reduction", format: "Reduces the Hatred cost of Cluster Arrow by %d%%.", min: 40, max: 50},
    },
    preset: ["mainstat", "wpnpsn"],
    primary: 5,
  },

]);

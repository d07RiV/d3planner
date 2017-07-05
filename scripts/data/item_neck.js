DiabloCalc.addItems([

  {
    id: "x1_Amulet_norm_unique_25",
    name: "Hellfire Amulet",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "extra_passive", name: "Extra Passive Skill", format: "Gain the %p passive.", args: -1},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Amulet_003_x1",
    name: "Moonlight Ward",
    type: "amulet",
    quality: "legendary",
    affixes: {
      dmgarc: {min: 20, max: 25},
    },
    required: {
      custom: {id: "leg_moonlightward", name: "Arcane Explosion Damage", format: "Hitting an enemy within 15 yards has a chance to ward you with shards of Arcane energy that explode when enemies get close, dealing %d%% weapon damage as Arcane to enemies within 15 yards.", min: 240, max: 320},
    },
    preset: ["chc", "dmgarc"],
  },

  {
    id: "Unique_Amulet_010_x1",
    name: "Squirt's Necklace",
    type: "amulet",
    quality: "legendary",
    preset: ["mainstat", "gf", "chd"],
  },

  {
    id: "Unique_Amulet_014_x1",
    name: "Eye of Etlich",
    type: "amulet",
    quality: "legendary",
    required: {
      rangedef: {min: 30, max: 35, step: "any"},
    },
    preset: ["elemental"],
  },

  {
    id: "Unique_Amulet_009_x1",
    name: "Rondal's Locket",
    type: "amulet",
    quality: "legendary",
    affixes: {
      pickup: {min: 4, max: 6},
    },
    preset: ["mainstat", "healbonus"],
  },

  {
    id: "Unique_Amulet_012_x1",
    name: "Talisman of Aranoch",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_talismanofaranoch", name: "Cold Absorb", format: "Prevent all Cold damage taken and heal yourself for %d%% of the amount prevented.", min: 10, max: 15},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Amulet_102_x1",
    name: "Ancestors' Grace",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_ancestorsgrace", name: "Revive", format: "When receiving fatal damage, you are instead restored to 100%% of maximum Life and resources. This item is destroyed in the process.", args: 0, cube: false},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Amulet_103_x1",
    name: "Countess Julia's Cameo",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_countessjuliascameo", name: "Arcane Absorb", format: "Prevent all Arcane damage taken and heal yourself for %d%% of the amount prevented.", min: 20, max: 25},
    },
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Amulet_107_x1",
    name: "Dovu Energy Trap",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_dovuenergytrap", name: "Extra Stun Duration", format: "Increases duration of Stun effects by %d%%.", min: 20, max: 25},
    },
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Amulet_101_x1",
    name: "Haunt of Vaxo",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_hauntofvaxo", name: "Summon Shadow Clones", format: "Summons shadow clones to your aid when you Stun an enemy. This effect may occur once every 30 seconds.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Amulet_108_x1",
    name: "Rakoff's Glass of Life",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_rakoffsglassoflife", name: "Extra Health Globes", format: "Enemies you kill have a %d%% additional chance to drop a health globe.", min: 3, max: 4},
    },
    affixes: {
      pickup: "pickupNormal",
    },
    preset: ["mainstat", "healbonus"],
  },

  {
    id: "Unique_Amulet_104_x1",
    name: "The Ess of Johan",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_theessofjohan", name: "Slow Amount After Pull", format: "Chance on hit to pull in enemies toward your target and Slow them by %d%%.", min: 60, max: 80},
    },
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Amulet_013_x1",
    name: "Holy Beacon",
    type: "amulet",
    quality: "legendary",
    affixes: {
      spiritregen: "spiritregenNormal",
    },
    preset: ["mainstat", "dmghol", "spiritregen"],
  },

  {
    id: "Unique_Amulet_002_p1",
    ids: ["Unique_Amulet_002_x1"],
    name: "Kymbo's Gold",
    type: "amulet",
    quality: "legendary",
    affixes: {
      gf: {min: 75, max: 100},
    },
    required: {
      custom: {id: "leg_kymbosgold", name: "Gold Heals", format: "Picking up gold heals you for an amount equal to the gold that was picked up.", args: 0},
    },
    preset: ["mainstat", "gf"],
  },

  {
    id: "Unique_Amulet_001_x1",
    name: "The Flavor of Time",
    type: "amulet",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
    },
    preset: ["cdr", "ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Amulet_015_x1",
    name: "Mara's Kaleidoscope",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_maraskaleidoscope", name: "Poison Absorb", format: "Prevent all Poison damage taken and heal yourself for %d%% of the amount prevented.", min: 10, max: 15},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Amulet_005_x1",
    name: "Ouroboros",
    type: "amulet",
    quality: "legendary",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Amulet_006_x1",
    name: "The Star of Azkaranth",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_thestarofazkaranth", name: "Fire Absorb", format: "Prevent all Fire damage taken and heal yourself for %d% of the amount prevented.", min: 10, max: 15},
    },
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Amulet_004_x1",
    name: "Xephirian Amulet",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_xephirianamulet", name: "Lightning Absorb", format: "Prevent all Lightning damage taken and heal yourself for %d% of the amount prevented.", min: 10, max: 15},
    },
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Amulet_109_x1_210",
    name: "Halcyon's Ascent",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_halcyonsascent", name: "Mesmerize Enemies", format: "When you use Vengeance, you mesmerize nearby enemies with your skill, causing them to jump uncontrollably for %d seconds.", min: 6, max: 8},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Amulet_016_x1",
    name: "Blackthorne's Duncraig Cross",
    type: "amulet",
    quality: "set",
    set: "blackthorne",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Amulet_007_x1",
    name: "Tal Rasha's Allegiance",
    type: "amulet",
    quality: "set",
    set: "talrasha",
    preset: ["mainstat", "chd"],
  },

  {
    id: "Unique_Amulet_008_x1",
    name: "The Traveler's Pledge",
    type: "amulet",
    quality: "set",
    set: "endlesswalk",
    preset: ["mainstat", "chd"],
  },

  {
    id: "Unique_Amulet_Set_11_x1",
    name: "Sunwuko's Shines",
    type: "amulet",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P43_AkkhanSet_Amulet",
    name: "Talisman of Akkhan",
    type: "amulet",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "chc"],
  },

  {
    id: "p43_RetroAmulet_001",
    name: "Optic Amulet",
    suffix: _L("Retro"),
    type: "amulet",
    quality: "magic",
    preset: ["resall", "meleedef"],
  },

  {
    id: "P6_Unique_Amulet_01",
    name: "The Johnstone",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_thejohnstone", name: "Corpse Skill Bonus Damage", format: "Each corpse consumed in the Land of the Dead grants a stack of Macabre Knowledge. Macabre Knowledge increases the damage of Corpse Lance and Corpse Explosion by %d%% while outside Land of the Dead.", min: 150, max: 200},
    },
    preset: ["mainstat", "chd"],
  },

  {
    id: "P6_Unique_Amulet_02",
    name: "Haunted Visions",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_hauntedvisions", name: "Double Simulacrum Duration", format: "Simulacrum now drains 5%% of your maximum life every second and lasts twice as long.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Unique_Amulet_03",
    name: "Wisdom of Kalan",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_wisdomofkalan", name: "Max Bone Armor Stacks", format: "Increases the maximum stacks of Bone Armor by 5.", args: 0},
    },
    preset: ["mainstat", "ias"],
  },

]);

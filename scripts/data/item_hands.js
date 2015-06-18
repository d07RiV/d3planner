DiabloCalc.addItems([

  {
    id: "Unique_Gloves_007_x1",
    name: "Stone Gauntlets",
    type: "gloves",
    quality: "legendary",
    affixes: {
      hitimmobilize: {min: 10, max: 20, step: 0.1},
    },
    preset: ["mainstat", "hitimmobilize"],
  },

  {
    id: "Unique_Gloves_014_x1",
    name: "Magefist",
    type: "gloves",
    quality: "legendary",
    required: {
      dmgfir: "elementalDamage",
    },
    preset: ["mainstat", "ias"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Gloves_101_x1",
    name: "St. Archew's Gage",
    suffix: _L("Legacy"),
    type: "gloves",
    quality: "legendary",
    required: {
      custom: {id: "leg_starchewsgage", name: "Absorb Shield", format: "When there are 5 or more enemies within 12 yards, you gain an absorb shield equal to %d%% of your maximum Life for 6 seconds. This effect may occur once every 30 seconds.", min: 20, max: 25},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Gloves_101_p2",
    name: "St. Archew's Gage",
    type: "gloves",
    quality: "legendary",
    required: {
      custom: {id: "leg_starchewsgage_p2", name: "Absorb Shield", format: "The first time an elite pack damages you, gain an absorb shield for %d%% of your maximum Life for 15 seconds.", min: 120, max: 150},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Gloves_011_x1",
    name: "Gladiator Gauntlets",
    type: "gloves",
    quality: "legendary",
    required: {
      custom: {id: "leg_gladiatorgauntlets", name: "Gold on Massacre", format: "After earning a massacre bonus, gold rains from sky.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_002_x1",
    name: "Frostburn",
    type: "gloves",
    quality: "legendary",
    required: {
      dmgcol: {min: 10, max: 15},
      custom: {id: "leg_frostburn", name: "Chance to Freeze", format: "Your Cold damage has up to a %d%% chance to Freeze enemies.", min: 34, max: 45},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Gloves_003_x1",
    name: "Tasker and Theo",
    type: "gloves",
    quality: "legendary",
    required: {
      custom: {id: "leg_taskerandtheo", name: "Pet Attack Speed", format: "Increase attack speed of your pets by %d%%.", min: 40, max: 50},
    },
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Gloves_001_x1",
    name: "Penders Purchase",
    type: "gloves",
    quality: "legendary",
  },

  // SET

  {
    id: "Unique_Gloves_008_x1",
    name: "Immortal King's Irons",
    type: "gloves",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_06_x1",
    name: "Firebird's Talons",
    type: "gloves",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Gloves_Set_08_x1",
    name: "Fists of Thunder",
    type: "gloves",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_10_x1",
    name: "Gauntlets of Akkhan",
    type: "gloves",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_16_x1",
    name: "Helltooth Gauntlets",
    type: "gloves",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Gloves_Set_09_x1",
    name: "Jade Harvester's Mercy",
    type: "gloves",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_07_x1",
    name: "Marauder's Gloves",
    type: "gloves",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_12_x1",
    name: "Pride of the Invoker",
    type: "gloves",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "chc", "thorns"],
  },

  {
    id: "Unique_Gloves_Set_15_x1",
    name: "Pull of the Earth",
    type: "gloves",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_05_x1",
    name: "Raekor's Wraps",
    type: "gloves",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_01_p1",
    name: "Roland's Grasp",
    type: "gloves",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_11_x1",
    name: "Sunwuko's Paws",
    type: "gloves",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_14_x1",
    name: "The Shadow's Grasp",
    type: "gloves",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_13_x1",
    name: "Vyr's Grasping Gauntlets",
    type: "gloves",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_009_x1",
    name: "Asheara's Ward",
    type: "gloves",
    quality: "set",
    set: "asheara",
  },

  {
    id: "Unique_Gloves_015_x1",
    name: "Cain's Scrivener",
    type: "gloves",
    quality: "set",
    set: "cain",
  },

  {
    id: "Unique_Gloves_017_x1",
    name: "Sage's Purchase",
    type: "gloves",
    quality: "set",
    set: "sage",
  },

  {
    id: "P2_Unique_Gloves_01",
    ids: ["ptr_NatalyasGauntlets"],
    name: "Natalya's Touch",
    type: "gloves",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Gloves_04",
    ids: ["ptr_InnasHold"],
    name: "Inna's Hold",
    type: "gloves",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Gloves_03",
    ids: ["ptr_ZunimassasFingerWraps"],
    name: "Zunimassa's Finger Wraps",
    type: "gloves",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Gloves_02",
    ids: ["ptr_TalRashasGrasp"],
    name: "Tal Rasha's Grasp",
    type: "gloves",
    quality: "set",
    set: "talrasha",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_02_p2",
    ids: ["ptr_MagnumGloves"],
    name: "Fierce Gauntlets",
    type: "gloves",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_03_p2",
    ids: ["ptr_UnhallowedGloves"],
    name: "Fiendish Grips",
    type: "gloves",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Gloves_Set_01_p2",
    ids: ["ptr_WastesGloves"],
    name: "Gauntlet of the Wastes",
    type: "gloves",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "chc"],
  },

]);

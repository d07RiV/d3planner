DiabloCalc.addItems([

  {
    id: "Unique_Shoulder_001_x1",
    name: "Homing Pads",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_homingpads", name: "Town Portal Damage Reduction", format: "Your Town Portal is no longer interrupted by taking damage. While casting Town Portal you gain a protective bubble that reduces damage taken by %d%%.", min: 50, max: 65},
    },
    preset: ["mainstat", "gf"],
  },

  {
    id: "Unique_Shoulder_002_x1",
    name: "Death Watch Mantle",
    suffix: _L("Legacy"),
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_deathwatchmantle", name: "Chance to Cast Fan of Knives", format: "%d%% chance to explode in a fan of knives for 200%% weapon damage when hit.", min: 15, max: 35},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shoulder_002_p2",
    name: "Death Watch Mantle",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_deathwatchmantle_p2", name: "Fan of Knives Chance/Damage", format: "%d%% chance to explode in a fan of knives for 750-950%% weapon damage when hit.", min: 25, max: 35},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shoulder_101_x1",
    name: "Profane Pauldrons",
    type: "shoulders",
    quality: "legendary",
    affixes: {
      pickup: {min: 4, max: 6},
    },
    preset: ["mainstat", "pickup", "healbonus"],
  },

  {
    id: "Unique_Shoulder_102_x1",
    name: "Spaulders of Zakara",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_spauldersofzakara", name: "Items Become Indestructible", format: "Your items become indestructible.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shoulder_003_x1",
    name: "Vile Ward",
    suffix: _L("Legacy"),
    type: "shoulders",
    quality: "legendary",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_003_p1",
    name: "Vile Ward",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_vileward", name: "Furious Charge Bonus Damage", format: "Furious Charge deals %d%% increased damage for every enemy hit while charging.", min: 30, max: 35},
    },
    preset: ["mainstat"],
    secondary: 3,
  },

  {
    id: "Unique_Shoulder_007_x1",
    name: "Corruption",
    type: "shoulders",
    quality: "legendary",
  },

  {
    id: "Unique_Shoulder_Set_12_x1",
    name: "Burden of the Invoker",
    type: "shoulders",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "thorns"],
  },

  {
    id: "Unique_Shoulder_Set_06_x1",
    name: "Firebird's Pinions",
    type: "shoulders",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Shoulder_Set_16_x1",
    name: "Helltooth Mantle",
    type: "shoulders",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Shoulder_Set_09_x1",
    name: "Jade Harvester's Joy",
    type: "shoulders",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_08_x1",
    name: "Mantle of the Upside-Down Sinners",
    type: "shoulders",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_07_x1",
    name: "Marauder's Spines",
    type: "shoulders",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Shoulder_Set_10_x1",
    name: "Pauldrons of Akkhan",
    type: "shoulders",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "allres"],
  },

  {
    id: "Unique_Shoulder_Set_05_x1",
    name: "Raekor's Budren",
    type: "shoulders",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "allres"],
  },

  {
    id: "Unique_Shoulder_Set_01_p1",
    name: "Roland's Mantle",
    type: "shoulders",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "allres"],
  },

  {
    id: "Unique_Shoulder_Set_15_x1",
    name: "Spires of the Earth",
    type: "shoulders",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "allres"],
  },

  {
    id: "Unique_Shoulder_Set_11_x1",
    name: "Sunwuko's Balance",
    type: "shoulders",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "allres"],
  },

  {
    id: "Unique_Shoulder_017_x1",
    name: "Asheara's Custodian",
    type: "shoulders",
    quality: "set",
    set: "asheara",
  },

  {
    id: "Unique_Shoulder_008_x1",
    name: "Aughild's Power",
    type: "shoulders",
    quality: "set",
    set: "aughild",
  },

  {
    id: "Unique_Shoulder_006_x1",
    name: "Born's Privilege",
    type: "shoulders",
    quality: "set",
    set: "born",
  },

  {
    id: "Unique_Shoulder_009_x1",
    name: "Demon's Aileron",
    type: "shoulders",
    quality: "set",
    set: "demon",
  },

  {
    id: "Unique_Shoulder_Set_02_p2",
    ids: ["ptr_MagnumShoulders"],
    name: "Dashing Pauldrons of Despair",
    type: "shoulders",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "armor"],
  },

  {
    id: "Unique_Shoulder_Set_03_p2",
    ids: ["ptr_UnhallowedShoulders"],
    name: "Unsanctified Shoulders",
    type: "shoulders",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_01_p2",
    ids: ["ptr_WastesShoulders"],
    name: "Pauldrons of the Wastes",
    type: "shoulders",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "resall"],
  },

]);

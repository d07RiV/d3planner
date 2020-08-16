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
    suffix: _L("Legacy"),
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
    affixes: {
      pickup: {min: 1, max: 7},
      healbonus: {min: 5978, max: 38625},
    },
    preset: ["pickup", "healbonus"],
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
    suffix: _L("Legacy"),
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

  {
    id: "P3_Unique_Shoulder_102",
    local: true,
    name: "Fury of the Ancients",
    suffix: _L("Legacy"),
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_furyoftheancients", name: "CotA Gains Ancients' Fury", format: "Call of the Ancients gains the effect of the Ancients' Fury rune.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shoulder_Set_01_p3",
    local: true,
    name: "Uliana's Strength",
    type: "shoulders",
    quality: "set",
    set: "uliana",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_02_p3",
    local: true,
    name: "Arachyr's Mantle",
    type: "shoulders",
    quality: "set",
    set: "arachyr",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_03_p3",
    local: true,
    name: "Mountain of the Light",
    type: "shoulders",
    quality: "set",
    set: "light",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Shoulder_Set_13_x1",
    local: true,
    name: "Vyr's Proud Pauldrons",
    type: "shoulders",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P4_Unique_Shoulder_101",
    name: "Lefebvre's Soliloquy",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_lefebvressoliloquy", name: "Cyclone Strike Damage Reduction", format: "Cyclone Strike reduces your damage taken by %d%% for 5 seconds.", min: 40, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Shoulder_103",
    name: "Mantle of Channeling",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_mantleofchanneling", name: "Bonus Damage While Channeling", format: "While channeling Siphon Blood, Whirlwind, Rapid Fire, Strafe, Tempest Rush, Firebats, Arcane Torrent, Disintegrate, or Ray of Frost for at least 1 second, you deal %d%% increased damage and take 25%% reduced damage.", min: 20, max: 25},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Shoulder_Set_14_x1",
    name: "The Shadow's Burden",
    type: "shoulders",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P6_Necro_Set_1_Shoulders",
    name: "Rathma's Spikes",
    type: "shoulders",
    quality: "set",
    set: "rathma",
    preset: ["mainstat", "cdr"],
  },

  {
    id: "P6_Necro_Set_2_Shoulders",
    name: "Trag'Oul's Heart",
    type: "shoulders",
    quality: "set",
    set: "trangoul",
    preset: ["mainstat", "regen"],
  },

  {
    id: "P6_Necro_Set_3_Shoulders",
    name: "Inarius's Martyrdom",
    type: "shoulders",
    quality: "set",
    set: "inarius",
    preset: ["mainstat"],
  },

  {
    id: "P6_Necro_Set_4_Shoulders",
    name: "Pestilence Defense",
    type: "shoulders",
    quality: "set",
    set: "pestilence",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "P6_Necro_Unique_Shoulders_21",
    name: "Corpsewhisper Pauldrons",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_corpsewhisperpauldrons", name: "Corpse Lance Damage per Stack", format: "Corpse Lance damage is increased by %d%% for 3 seconds when you consume a corpse. Max 20 stacks.", min: 25, max: 30},
    },
    preset: ["mainstat"],
  },

  {
    id: "P6_Necro_Unique_Shoulders_22",
    name: "Razeth's Volition",
    suffix: _L("Legacy"),
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_razethsvolition", name: "Skeletal Mage Gains Gift of Death", format: "Skeletal Mage gains the effect of the Gift of Death rune.", args: 0},
    },
    preset: ["mainstat", "rcr"],
  },

  {
    id: "P66_Unique_Shoulder_008",
    name: "Aughild's Power",
    type: "shoulders",
    quality: "set",
    set: "aughild_v2",
  },

  {
    id: "P67_Unique_Shoulder_102",
    local: true,
    name: "Fury of the Ancients",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_furyoftheancients_p67", name: "CotA Gains Ancients' Fury", format: "Call of the Ancients gains the effect of the Ancients' Fury rune, and your Ancients attack 100%% faster.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P67_Unique_Shoulder_Set_02",
    name: "Mirrors of Justice",
    type: "shoulders",
    quality: "set",
    set: "justice",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P67_Unique_Shoulder_Set_01",
    name: "Spaulders of Valor",
    type: "shoulders",
    quality: "set",
    set: "valor",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P68_Unique_Shoulder_Set_04",
    name: "Mundunugu's Descendant",
    type: "shoulders",
    quality: "set",
    set: "mundunugu",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P68_Unique_Shoulder_Set_05",
    name: "Spines of Savages",
    type: "shoulders",
    quality: "set",
    set: "savages",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P68_Unique_Shoulder_Set_03",
    name: "Typhon's Tibia",
    type: "shoulders",
    quality: "set",
    set: "typhon",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P69_Necro_Set_5_Shoulders",
    name: "Glamorous Gigot",
    type: "shoulders",
    quality: "set",
    set: "masquerade",
    preset: ["mainstat"],
  },

  {
    id: "P69_Unique_Shoulder_Set_06",
    name: "Mechanical Pauldrons",
    type: "shoulders",
    quality: "set",
    set: "dreadlands",
    preset: ["mainstat", "resall"],
  },
  
  {
    id: "P69_Necro_Unique_Shoulders_22",
    name: "Razeth's Volition",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_razethsvolition_p69", name: "Skeletal Mage Gains Gift of Death", format: "Skeletal Mage gains the effect of the Gift of Death and Singularity runes. You gain %d%% damage reduction if your Essence is not full.", min: 35, max: 50, best: "min"},
    },
    preset: ["mainstat", "rcr"],
  },

]);
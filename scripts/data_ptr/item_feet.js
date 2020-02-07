DiabloCalc.addItems([

  {
    id: "Unique_Boots_009_x1",
    name: "Lut Socks",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_lutsocks", name: "Leap can be cast multiple times", format: "Leap can be cast up to three times within 2 seconds before the cooldown begins.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Boots_010_x1",
    name: "The Crudest Boots",
    suffix: _L("Legacy"),
    type: "boots",
    quality: "legendary",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P1_Unique_Boots_010",
    ids: ["p1_Unique_Boots_010"],
    name: "The Crudest Boots",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_thecrudestboots", name: "Double Mystic Ally", format: "Mystic Ally summons two Mystic Allies that fight by your side.", args: 0},
    },
    preset: ["mainstat", "ms"],
  },

  {
    id: "Unique_Boots_001_x1",
    name: "Boj Anglers",
    type: "boots",
    quality: "legendary",
    preset: ["mainstat", "skill_head"],
  },

  {
    id: "Unique_Boots_104_x1",
    name: "Irontoe Mudsputters",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_irontoemudsputters", name: "Increased Speed on Low Life", format: "Gain up to %d%% increased movement speed based on amount of Life missing.", min: 25, max: 30},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_007_x1",
    name: "Fire Walkers",
    suffix: _L("Legacy"),
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_firewalkers", name: "Burn the Ground", format: "Burn the ground you walk on, dealing 100%% weapon damage each second.", args: 0},
    },
    preset: ["mainstat", "ms"],
  },

  {
    id: "Unique_Boots_007_p2",
    name: "Fire Walkers",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_firewalkers_p2", name: "Burn the Ground", format: "Burn the ground you walk on, dealing %d%% weapon damage each second.", min: 300, max: 400},
    },
    preset: ["mainstat", "ms"],
  },

  {
    id: "Unique_Boots_008_x1",
    name: "Ice Climbers",
    type: "boots",
    quality: "legendary",
    primary: 5,
    required: {
      colddef: {min: 7, max: 10},
      custom: {id: "leg_iceclimbers", name: "Cannot Be Frozen", format: "Gain immunity to Freeze and Immobilize effects.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Boots_005_x1",
    name: "Board Walkers",
    type: "boots",
    quality: "legendary",
    preset: ["ms"],
  },

  // SET

  {
    id: "Unique_Boots_019_x1",
    name: "Blackthorne's Spurs",
    type: "boots",
    quality: "set",
    set: "blackthorne",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_012_x1",
    name: "Immortal King's Stride",
    type: "boots",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Boots_011_x1",
    name: "Natalya's Bloody Footprints",
    type: "boots",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Boots_013_x1",
    name: "Zunimassa's Trail",
    type: "boots",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_08_x1",
    name: "Eight-Demon Boots",
    type: "boots",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_06_x1",
    name: "Firebird's Tarsi",
    type: "boots",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_16_x1",
    name: "Helltooth Greaves",
    type: "boots",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_09_x1",
    name: "Jade Harvester's Swiftness",
    type: "boots",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_07_x1",
    name: "Marauder's Treads",
    type: "boots",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_05_x1",
    name: "Raekor's Striders",
    type: "boots",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_01_p1",
    name: "Roland's Stride",
    type: "boots",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_10_x1",
    name: "Sabatons of Akkhan",
    type: "boots",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_14_x1",
    name: "The Shadow's Heels",
    type: "boots",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_13_x1",
    name: "Vyr's Swaggering Stance",
    type: "boots",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "skill_head"],
  },

  {
    id: "Unique_Boots_014_x1",
    name: "Asheara's Finders",
    type: "boots",
    quality: "set",
    set: "asheara",
  },

  {
    id: "Unique_Boots_015_x1",
    suffix: _L("Legacy"),
    name: "Cain's Travelers",
    type: "boots",
    quality: "set",
    set: "cain",
  },

  {
    id: "Unique_Boots_017_x1",
    suffix: _L("Legacy"),
    name: "Captain Crimson's Waders",
    type: "boots",
    quality: "set",
    set: "crimson",
  },

  {
    id: "Unique_Boots_018_x1",
    name: "Sage's Passage",
    type: "boots",
    quality: "set",
    set: "sage",
  },

  {
    id: "P2_Unique_Boots_01",
    ids: ["ptr_NilfursBoast"],
    name: "Nilfur's Boast",
    suffix: _L("Legacy"),
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_nilfursboast", name: "Meteor Damage Bonus", format: "Increase the damage of Meteor by 100%%. When your Meteor hits 3 or fewer enemies, the damage is increased by %d%%.", min: 150, max: 200},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P2_Unique_Boots_02",
    ids: ["ptr_InnasSandals"],
    name: "Inna's Sandals",
    type: "boots",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Boots_Set_02_p2",
    ids: ["ptr_MagnumBoots"],
    name: "Striders of Destiny",
    type: "boots",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_03_p2",
    ids: ["ptr_UnhallowedBoots"],
    name: "Hell Walkers",
    type: "boots",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_01_p2",
    ids: ["ptr_WastesBoots"],
    name: "Sabaton of the Wastes",
    type: "boots",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_01_p3",
    local: true,
    name: "Uliana's Destiny",
    type: "boots",
    quality: "set",
    set: "uliana",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_02_p3",
    local: true,
    name: "Arachyr's Stride",
    type: "boots",
    quality: "set",
    set: "arachyr",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Boots_Set_03_p3",
    local: true,
    name: "Foundation of the Light",
    type: "boots",
    quality: "set",
    set: "light",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P4_Unique_Boots_001",
    local: true,
    name: "Rivera Dancers",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_riveradancers", name: "Lashing Tail Kick Damage", format: "Lashing Tail Kick attacks 50%% faster and deals %d%% increased damage.", min: 250, max: 300},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Boots_Set_12_x1",
    name: "Zeal of the Invoker",
    type: "boots",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "thorns"],
  },

  {
    id: "Unique_Boots_Set_15_x1",
    name: "Foundation of the Earth",
    type: "boots",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P41_Unique_Boots_01",
    name: "Nilfur's Boast",
    suffix: _L("Legacy"),
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_nilfursboast_p2", name: "Meteor Damage Bonus", format: "Increase the damage of Meteor by 200%%. When your Meteor hits 3 or fewer enemies, the damage is increased by %d%%.", min: 275, max: 350},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P6_Necro_Set_1_Boots",
    name: "Rathma's Ossified Sabatons",
    type: "boots",
    quality: "set",
    set: "rathma",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P6_Necro_Set_2_Boots",
    name: "Trag'Oul's Stalwart Greaves",
    type: "boots",
    quality: "set",
    set: "trangoul",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P6_Necro_Set_3_Boots",
    name: "Inarius's Perseverance",
    type: "boots",
    quality: "set",
    set: "inarius",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P6_Necro_Set_4_Boots",
    name: "Pestilence Battle Boots",
    type: "boots",
    quality: "set",
    set: "pestilence",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P6_Necro_Unique_Boots_21",
    name: "Steuart's Greaves",
    suffix: _L("Legacy"),
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_steuartsgreaves", name: "Blood Rush Movement Speed", format: "You gain %d%% increased movement speed for 10 seconds after using Blood Rush.", min: 40, max: 50},
    },
    preset: ["mainstat", "ms"],
  },

  {
    id: "P6_Necro_Unique_Boots_22",
    name: "Bryner's Journey",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_brynersjourney", name: "Chance to Cast Bone Nova", format: "Attacking with Bone Spikes has a %d%% chance to cast a Bone Nova at the target location.", min: 20, max: 30},
    },
    preset: ["mainstat"],
  },

  {
    id: "P61_Necro_Unique_Boots_21",
    name: "Steuart's Greaves",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_steuartsgreaves_p6", name: "Blood Rush Movement Speed", format: "You gain %d%% increased movement speed for 10 seconds after using Blood Rush.", min: 75, max: 100},
    },
    preset: ["mainstat", "ms"],
  },

  {
    id: "P61_Unique_Boots_01",
    name: "Nilfur's Boast",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_nilfursboast_p6", name: "Meteor Damage Bonus", format: "Increase the damage of Meteor by 600%%. When your Meteor hits 3 or fewer enemies, the damage is increased by %d%%.", min: 675, max: 900},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P66_Unique_Boots_015",
    name: "Cain's Travelers",
    type: "boots",
    quality: "set",
    set: "cain_v2",
  },

  {
    id: "P66_Unique_Boots_017",
    name: "Captain Crimson's Waders",
    type: "boots",
    quality: "set",
    set: "crimson_v2",
  },

  {
    id: "P67_Unique_Boots_Set_01",
    name: "Greaves of Valor",
    type: "boots",
    quality: "set",
    set: "valor",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P67_Unique_Boots_Set_02",
    name: "Weaves of Justice",
    type: "boots",
    quality: "set",
    set: "justice",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P68_Unique_Boots_Set_05",
    name: "Heel of Savages",
    type: "boots",
    quality: "set",
    set: "savages",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P68_Unique_Boots_Set_04",
    name: "Mundunugu's Dance",
    type: "boots",
    quality: "set",
    set: "mundunugu",
    preset: ["mainstat", "vit"],
  },

  {
    id: "P68_Unique_Boots_Set_03",
    name: "Typhon's Tarsus",
    type: "boots",
    quality: "set",
    set: "typhon",
    preset: ["mainstat", "vit"],
  },

]);

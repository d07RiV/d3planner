DiabloCalc.addItems([

  {
    id: "Unique_Chest_012_x1",
    name: "Aquila Cuirass",
    suffix: _L("Legacy"),
    type: "chestarmor",
    quality: "legendary",
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Chest_018_x1",
    name: "Heart of Iron",
    suffix: _L("Legacy"),
    type: "chestarmor",
    quality: "legendary",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Chest_010_x1",
    name: "Chaingmail",
    type: "chestarmor",
    quality: "legendary",
    required: {
      custom: {id: "leg_chaingmail", name: "Heal After Survival", format: "After earning a survival bonus, quickly heal to full Life.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Chest_006_x1",
    name: "Cindercoat",
    type: "chestarmor",
    quality: "legendary",
    affixes: {
      dmgfir: "elementalDamage",
    },
    required: {
      custom: {id: "leg_cindercoat", name: "Fire Skills Cost Reduction", format: "Reduces the resource cost of Fire skills by %d%%.", min: 23, max: 30},
    },
    preset: ["mainstat", "dmgfir"],
  },

  {
    id: "Unique_Chest_101_x1",
    name: "Shi Mizu's Haori",
    type: "chestarmor",
    quality: "legendary",
    required: {
      custom: {id: "leg_shimizushaori", name: "Critical Health Threshold", format: "While below %d%% Life, all attacks are guaranteed Critical Hits.", min: 20, max: 25},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Chest_001_x1",
    //local: true,
    name: "Goldskin",
    type: "chestarmor",
    quality: "legendary",
    required: {
      gf: {min: 100, max: 100},
      custom: {id: "leg_goldskin", name: "Enemies drop gold on hit", format: "Chance for enemies to drop gold when you hit them.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Chest_002_x1",
    //local: true,
    name: "Tyrael's Might",
    type: "chestarmor",
    quality: "legendary",
    required: {
      damage_demons: {min: 10, max: 20},
    },
    preset: ["mainstat", "resall", "dura"],
  },

  {
    id: "Unique_Chest_102_x1",
    name: "Armor of the Kind Regent",
    type: "chestarmor",
    quality: "legendary",
    required: {
      custom: {id: "leg_armorofthekindregent", name: "Smite hits second target", format: "Smite will now also be cast at a second nearby enemy.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Chest_019_x1",
    name: "Mantle of the Rydraelm",
    type: "chestarmor",
    quality: "legendary",
  },

  // SET

  {
    id: "Unique_ChestArmor_028_x1",
    name: "Blackthorne's Surcoat",
    type: "chestarmor",
    quality: "set",
    set: "blackthorne",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_013_x1",
    name: "Immortal King's Eternal Reign",
    type: "chestarmor",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_015_x1",
    //local: true,
    name: "Inna's Vast Expanse",
    type: "chestarmor",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_014_x1",
    name: "Tal Rasha's Relentless Pursuit",
    type: "chestarmor",
    quality: "set",
    set: "talrasha",
    affixes: {
      ias: "iasNormal",
    },
    preset: ["mainstat", "vit", "ias", "sockets"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Chest_016_x1",
    //local: true,
    name: "Zunimassa's Marrow",
    type: "chestarmor",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_10_x1",
    name: "Breastplate of Akkhan",
    type: "chestarmor",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_06_x1",
    usealt: true,
    name: "Firebird's Breast",
    type: "chestarmor",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_08_x1",
    usealt: true,
    name: "Heart of the Crashing Wave",
    type: "chestarmor",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_16_x1",
    usealt: true,
    name: "Helltooth Tunic",
    type: "chestarmor",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_09_x1",
    name: "Jade Harvester's Peace",
    type: "chestarmor",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_07_x1",
    name: "Marauder's Carapace",
    type: "chestarmor",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_05_x1",
    usealt: true,
    name: "Raekor's Heart",
    type: "chestarmor",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_01_p1",
    usealt: true,
    name: "Roland's Bearing",
    type: "chestarmor",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_14_x1",
    usealt: true,
    name: "The Shadow's Bane",
    type: "chestarmor",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_13_x1",
    usealt: true,
    name: "Vyr's Astonishing Aura",
    type: "chestarmor",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_026_x1",
    name: "Aughild's Rule",
    type: "chestarmor",
    quality: "set",
    set: "aughild",
  },

  {
    id: "Unique_Chest_025_x1",
    name: "Born's Frozen Soul",
    type: "chestarmor",
    quality: "set",
    set: "born",
  },

  {
    id: "Unique_Chest_027_x1",
    name: "Demon's Marrow",
    type: "chestarmor",
    quality: "set",
    set: "demon",
  },

  // CLOAKS

  {
    id: "Unique_Cloak_005_x1",
    name: "Beckon Sail",
    type: "cloak",
    quality: "legendary",
    required: {
      custom: {id: "leg_beckonsail", name: "Smoke Screen on Fatal Damage", format: "When receiving fatal damage, you instead automatically cast Smoke Screen and are healed to 25%% Life. This effect may occur once every 120 seconds.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Cloak_101_x1",
    name: "Blackfeather",
    type: "cloak",
    quality: "legendary",
    required: {
      custom: {id: "leg_blackfeather", name: "Counter Rocket Damage", format: "Dodging or getting hit by a ranged attack automatically shoots a homing rocket back at the attacker for %d%% weapon damage as Physical.", min: 600, max: 800},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Cloak_002_p1",
    ids: ["Unique_Cloak_002_x1"],
    name: "The Cloak of Garwulf",
    type: "cloak",
    quality: "legendary",
    required: {
      custom: {id: "leg_thecloakofgarwulf", name: "Extra Wolves", format: "Companion - Wolf Companion now summons 3 wolves.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Cloak_001_x1",
    name: "The Cape of the Dark Night",
    type: "cloak",
    quality: "legendary",
    required: {
      custom: {id: "leg_thecapeofthedarknight", name: "Drop Caltrops When Hit", format: "Automatically drop Caltrops when you are hit. This effect may only occur once every 6 seconds.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Cloak_006_x1",
    usealt: true,
    name: "Natalya's Embrace",
    type: "cloak",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_02_p2",
    usealt: true,
    ids: ["ptr_MagnumChest"],
    local: true,
    name: "Harness of Truth",
    type: "chestarmor",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_03_p2",
    ids: ["ptr_UnhallowedChest"],
    local: true,
    name: "Cage of the Hellborn",
    type: "cloak",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_01_p2",
    usealt: true,
    ids: ["ptr_WastesChest"],
    local: true,
    name: "Cuirass of the Wastes",
    type: "chestarmor",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_01_p3",
    local: true,
    usealt: true,
    name: "Uliana's Heart",
    type: "chestarmor",
    quality: "set",
    set: "uliana",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_02_p3",
    usealt: true,
    local: true,
    name: "Arachyr’s Carapace",
    type: "chestarmor",
    quality: "set",
    set: "arachyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_03_p3",
    local: true,
    name: "Heart of the Light",
    type: "chestarmor",
    quality: "set",
    set: "light",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P4_Unique_Chest_012",
    name: "Aquila Cuirass",
    suffix: _L("PTR"),
    type: "chestarmor",
    quality: "legendary",
    required: {
      custom: {id: "leg_aquilacuirass", name: "Damage Reduction Threshold", format: "While above %d%% primary resource, all damage taken is reduced by 50%%.", min: 90, max: 95, best: "min"},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P4_Unique_Chest_018",
    name: "Heart of Iron",
    suffix: _L("PTR"),
    type: "chestarmor",
    quality: "legendary",
    required: {
      custom: {id: "leg_heartofiron", name: "Thorns From Vitality", format: "Gain Thorns equal to %d%% of your Vitality.", min: 400, max: 500},
    },
    preset: ["mainstat", "vit", "thorns"],
  },

  {
    id: "Unique_Chest_Set_11_x1",
    name: "Sunwuko's Soul",
    suffix: _L("PTR"),
    type: "chestarmor",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Chest_Set_15_x1",
    name: "Spirit of the Earth",
    suffix: _L("PTR"),
    type: "chestarmor",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "sockets"],
  },

]);

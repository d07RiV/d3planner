DiabloCalc.addItems([

  {
    id: "Unique_Pants_007_x1",
    name: "Pox Faulds",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_poxfaulds", name: "Poison Cloud Damage", format: "When 3 or more enemies are within 12 yards, you release a vile stench that deals %d%% weapon damage as Poison every second for 10 seconds to enemies within 15 yards.", min: 240, max: 320},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Pants_007_p2",
    name: "Pox Faulds",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_poxfaulds_p2", name: "Poison Cloud Damage", format: "When 3 or more enemies are within 12 yards, you release a vile stench that deals %d%% weapon damage as Poison every second for 5 seconds to enemies within 15 yards.", min: 450, max: 550},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Pants_002_x1",
    name: "Hammer Jammers",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
    },
    preset: ["mainstat", "ms", "gf"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Pants_101_x1",
    name: "Hexing Pants of Mr. Yan",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_hexingpantsofmryan", name: "Damage Decrease While Standing Still", format: "Your resource generation and damage is increased by 25%% while moving and decreased by %d%% while standing still.", min: 20, max: 25, best: "min"},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Pants_001_x1",
    name: "Swamp Land Waders",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    affixes: {
      dmgpsn: "elementalDamage",
      ccr: "ccrNormal",
    },
    preset: ["mainstat", "dmgpsn", "ccr", "sockets"],
    primary: 5,
  },

  {
    id: "Unique_Pants_006_x1",
    name: "Depth Diggers",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    preset: ["mainstat", "resall", "gf"],
  },

  {
    id: "Unique_Pants_006_p1",
    name: "Depth Diggers",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_depthdiggers", name: "Increased Primary Skill Damage", format: "Primary skills that generate resource deal %d%% additional damage.", min: 80, max: 100},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Pants_005_x1",
    name: "Skelon's Deceit",
    type: "pants",
    quality: "legendary",
  },

  // SET

  {
    id: "Unique_Pants_013_x1",
    name: "Blackthorne's Jousting Mail",
    type: "pants",
    quality: "set",
    set: "blackthorne",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_008_x1",
    name: "Inna's Temperance",
    type: "pants",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_10_x1",
    name: "Cuisses of Akkhan",
    type: "pants",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_06_x1",
    name: "Firebird's Down",
    type: "pants",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_16_x1",
    name: "Helltooth Leg Guards",
    type: "pants",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_09_x1",
    name: "Jade Harvester's Courage",
    type: "pants",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_07_x1",
    name: "Marauder's Encasement",
    type: "pants",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_05_x1",
    name: "Raekor's Breeches",
    type: "pants",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_01_p1",
    name: "Roland's Determination",
    type: "pants",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_08_x1",
    name: "Scales of the Dancing Serpent",
    type: "pants",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_14_x1",
    name: "The Shadow's Coil",
    type: "pants",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_13_x1",
    name: "Vyr's Fantastic Finery",
    type: "pants",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_15_x1",
    name: "Weight of the Earth",
    type: "pants",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_009_x1",
    name: "Asheara's Pace",
    type: "pants",
    quality: "set",
    set: "asheara",
  },

  {
    id: "Unique_Pants_010_x1",
    name: "Cain's Habit",
    type: "pants",
    quality: "set",
    set: "cain",
  },

  {
    id: "Unique_Pants_012_x1",
    name: "Captain Crimson's Thrust",
    type: "pants",
    quality: "set",
    set: "crimson",
  },

  {
    id: "Unique_Pants_014_x1",
    name: "Demon's Plate",
    type: "pants",
    quality: "set",
    set: "demon",
  },

  {
    id: "P2_Unique_Pants_02",
    ids: ["ptr_ImmortalKingsStature"],
    name: "Immortal King's Stature",
    type: "pants",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P2_Unique_Pants_01",
    ids: ["ptr_NatalyasLeggings"],
    name: "Natalya's Leggings",
    type: "pants",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P2_Unique_Pants_04",
    ids: ["ptr_ZunimassasCloth"],
    name: "Zunimassa's Cloth",
    type: "pants",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P2_Unique_Pants_03",
    ids: ["ptr_TalRashasStride"],
    name: "Tal Rasha's Stride",
    type: "pants",
    quality: "set",
    set: "talrasha",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_02_p2",
    ids: ["ptr_MagnumLegs"],
    name: "Leg Guards of Mystery",
    type: "pants",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_03_p2",
    ids: ["ptr_UnhallowedLegs"],
    name: "Unholy Plates",
    type: "pants",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_01_p2",
    ids: ["ptr_WastesLegs"],
    name: "Tasset of the Wastes",
    type: "pants",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_01_p3",
    local: true,
    name: "Uliana's Burden",
    type: "pants",
    quality: "set",
    set: "uliana",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_02_p3",
    local: true,
    name: "Arachyr's Legs",
    type: "pants",
    quality: "set",
    set: "arachyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_03_p3",
    local: true,
    name: "Towers of the Light",
    type: "pants",
    quality: "set",
    set: "light",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P4_Unique_Pants_002",
    name: "Hammer Jammers",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_hammerjammers", name: "Blessed Hammer Damage Bonus", format: "Enemies take %d%% increased damage from your Blessed Hammers for 10 seconds after you hit them with a Blind, Immobilize, or Stun.", min: 300, max: 400},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_11_x1",
    name: "Sunwuko's Leggings",
    type: "pants",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Pants_Set_12_x1",
    name: "Renewal of the Invoker",
    type: "pants",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "sockets", "thorns"],
  },

  {
    id: "P41_Unique_Pants_001",
    name: "Swamp Land Waders",
    type: "pants",
    quality: "legendary",
    affixes: {
      dmgphy: "elementalDamage",
      dmgfir: "elementalDamage",
      dmglit: "elementalDamage",
      dmgcol: "elementalDamage",
      dmgpsn: "elementalDamage",
      dmgarc: "elementalDamage",
      dmghol: "elementalDamage",
    },
    required: {
      custom: {id: "leg_swamplandwaders", name: "Sacrifice Damage Bonus", format: "Sacrifice deals %d%% additional damage against enemies affected by Locust Swarm or Grasp of the Dead.", min: 300, max: 400},
    },
    preset: ["mainstat", "elemental", "sockets"],
    primary: 5,
  },

  {
    id: "P6_Necro_Set_1_Pants",
    name: "Rathma's Skeletal Legplates",
    type: "pants",
    quality: "set",
    set: "rathma",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_2_Pants",
    name: "Trag'Oul's Hide",
    type: "pants",
    quality: "set",
    set: "trangoul",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_3_Pants",
    name: "Inarius's Reticence",
    type: "pants",
    quality: "set",
    set: "inarius",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_4_Pants",
    name: "Pestilence Incantations",
    type: "pants",
    quality: "set",
    set: "pestilence",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Unique_Pants_21",
    name: "Golemskin Breeches",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_golemskinbreeches", name: "Golem Damage Bonus", format: "Your Golem's damage is increased by %d%% and you take 30%% less damage while it is alive.", min: 100, max: 125},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Unique_Pants_22",
    name: "Defiler Cuisses",
    suffix: _L("Legacy"),
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_defilercuisses", name: "Bone Spirit Damage per Stack", format: "Your Bone Spirit's damage is increased by %d%% for every second it is active.", min: 75, max: 100},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P61_Necro_Unique_Pants_21",
    name: "Golemskin Breeches",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_golemskinbreeches_p6", name: "Golem Damage Bonus", format: "The cooldown on Command Golem is reduced by %d seconds and you take 30%% less damage while your golem is alive.", min: 20, max: 25},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P61_Necro_Unique_Pants_22",
    name: "Defiler Cuisses",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_defilercuisses_p6", name: "Bone Spirit Damage per Stack", format: "Your Bone Spirit's damage is increased by %d%% for every second it is active.", min: 400, max: 500},
    },
    preset: ["mainstat", "sockets"],
  },

]);

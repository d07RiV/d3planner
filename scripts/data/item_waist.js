DiabloCalc.addItems([

  {
    id: "Unique_Belt_010_x1",
    name: "Goldwrap",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_goldwrap", name: "Gold to Armor", format: "On gold pickup: Gain armor for 5 seconds equal to the amount picked up.", args: 0},
    },
    preset: ["mainstat", "gf"],
  },

  {
    id: "Unique_Belt_002_x1",
    name: "Vigilante Belt",
    type: "belt",
    quality: "legendary",
    affixes: {
      cdr: "cdrSmall",
    },
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Belt_001_x1",
    name: "Saffron Wrap",
    type: "belt",
    quality: "legendary",
    affixes: {
      rcr: "rcrSmall",
      ccr: "ccrNormal",
    },
    preset: ["mainstat", "rcr", "ccr"],
  },

  {
    id: "Unique_Belt_008_x1",
    name: "String of Ears",
    type: "belt",
    quality: "legendary",
    affixes: {
      meleedef: {min: 25, max: 30, step: 0.1},
    },
    preset: ["mainstat", "meleedef"],
  },

  {
    id: "Unique_Belt_104_x1",
    name: "Cord of the Sherma",
    suffix: _L("Legacy"),
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_cordofthesherma", name: "Chaos Field Duration", format: "Chance on hit to create a chaos field that Blinds and Slows enemies inside for %d seconds.", min: 2, max: 4},
    },
    preset: ["mainstat", "vit", "pickup"],
  },

  {
    id: "Unique_Belt_104_p2",
    name: "Cord of the Sherma",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_cordofthesherma_p2", name: "Chaos Field Duration", format: "Chance on hit to create a chaos field that Blinds and Slows enemies inside for %d seconds.", min: 3, max: 4},
    },
    preset: ["mainstat", "vit", "pickup"],
  },

  {
    id: "Unique_Belt_105_x1",
    name: "Harrington Waistguard",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_harringtonwaistguard", name: "Chest Damage Bonus", format: "Opening a chest grants %d%% increased damage for 10 seconds.", min: 100, max: 135},
    },
    preset: ["mainstat", "gf"],
  },

  {
    id: "Unique_Belt_107_x1",
    name: "Hwoj Wrap",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_hwojwrap", name: "Locust Swarm Slow", format: "Locust Swarm also Slows enemies by %d%%.", min: 60, max: 80},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Belt_101_x1",
    name: "Razor Strop",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_razorstrop", name: "Health Globe Explosion Damage", format: "Picking up a Health Globe releases an explosion that deals %d%% weapon damage as Fire to enemies within 20 yards.", min: 300, max: 400},
    },
    preset: ["mainstat", "pickup"],
  },

  {
    id: "Unique_Belt_102_p1",
    name: "Sash of Knives",
    suffix: _L("Legacy"),
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_sashofknives", name: "Dagger Damage", format: "25%% chance on attack to throw a dagger at a nearby enemy for %d%% weapon damage as Physical.", min: 275, max: 350},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Belt_102_p2",
    name: "Sash of Knives",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_sashofknives_p2", name: "Dagger Damage", format: "With every attack, you throw a dagger at a nearby enemy for %d%% weapon damage as Physical.", min: 500, max: 650},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Belt_108_x1",
    name: "Sebor's Nightmare",
    suffix: _L("Legacy"),
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_seborsnightmare", name: "Haunt When Opening Chests", format: "Haunt is cast on 5 nearby enemies when you open a chest.", args: 0},
    },
    preset: ["mainstat", "pickup"],
  },

  {
    id: "Unique_Belt_108_p2",
    name: "Sebor's Nightmare",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_seborsnightmare_p2", name: "Haunt When Opening Chests", format: "Haunt is cast on all nearby enemies when you open a chest.", args: 0},
    },
    preset: ["mainstat", "pickup"],
  },

  {
    id: "Unique_Belt_003_x1",
    name: "Angel Hair Braid",
    suffix: _L("Legacy"),
    type: "belt",
    quality: "legendary",
    preset: ["mainstat", "life", "resall", "dura"],
  },

  {
    id: "Unique_Belt_003_p1",
    name: "Angel Hair Braid",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_angelhairbraid", name: "Punish Gains All Runes", format: "Punish gains the effect of every rune.", args: 0},
    },
    preset: ["mainstat", "dura"],
  },

  {
    id: "Unique_BarbBelt_003_x1",
    name: "Thundergod's Vigor",
    type: "belt",
    quality: "legendary",
    affixes: {
      dmglit: {min: 10, max: 15},
    },
    required: {
      reslit: {min: 150, max: 200, noblock: true},
      custom: {id: "leg_thundergodsvigor", name: "Lightning Bolts Damage", format: "Blocking, dodging or being hit causes you to discharge bolts of electricity that deal %d%% weapon damage as Lightning.", min: 100, max: 130},
      basearmor: "basearmorMightyBelt",
    },
    preset: ["mainstat", "vit", "dmglit"],
  },

  {
    id: "Unique_Belt_005_x1",
    name: "Hellcat Waistguard",
    type: "belt",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
      edmg: {min: 3, max: 5},
    },
    preset: ["mainstat", "vit", "ias", "edmg"],
  },

  {
    id: "Unique_Belt_009_x1",
    name: "The Witching Hour",
    type: "belt",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
      chd: "chdSmall",
    },
    preset: ["ias", "chd"],
  },

  {
    id: "Unique_Belt_106_x1",
    name: "Jang's Envelopment",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_jangsenvelopment", name: "Black Hole Slow", format: "Enemies damaged by Black Hole are also slowed by %d%% for 3 seconds.", min: 60, max: 80},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Belt_004_x1",
    name: "Fleeting Strap",
    type: "belt",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    preset: ["ias"],
  },

  // SET

  {
    id: "Unique_Belt_015_x1",
    name: "Blackthorne's Notched Belt",
    type: "belt",
    quality: "set",
    set: "blackthorne",
    preset: ["mainstat", "vit", "gf"],
  },

  {
    id: "Unique_Belt_007_x1",
    name: "Inna's Favor",
    type: "belt",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Belt_006_x1",
    name: "Tal Rasha's Brace",
    type: "belt",
    quality: "set",
    set: "talrasha",
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Belt_Set_02_x1",
    name: "Krelm's Buff Belt",
    type: "belt",
    quality: "set",
    set: "krelm",
    required: {
      custom: {id: "leg_krelmsbuffbelt", name: "Move Speed When Not Taking Damage", format: "Gain 25%% run speed. This effect is lost for 5 seconds after taking damage.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Belt_012_x1",
    name: "Captain Crimson's Silk Girdle",
    type: "belt",
    quality: "set",
    set: "crimson",
  },

  {
    id: "Unique_Belt_014_x1",
    name: "Demon's Restraint",
    type: "belt",
    quality: "set",
    set: "demon",
  },

  {
    id: "Unique_Belt_013_x1",
    name: "Guardian's Case",
    type: "belt",
    quality: "set",
    set: "guardian",
  },

  // MIGHTY BELTS

  {
    id: "Unique_BarbBelt_004_x1",
    name: "Girdle of Giants",
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    preset: ["mainstat", "ias", "maxfury"],
  },

  {
    id: "Unique_BarbBelt_006_x1",
    name: "The Undisputed Champion",
    suffix: _L("Legacy"),
    type: "mightybelt",
    quality: "legendary",
    preset: ["mainstat", "resall", "lifefury"],
  },

  {
    id: "P2_Unique_BarbBelt_006",
    name: "The Undisputed Champion",
    type: "mightybelt",
    quality: "legendary",
    required: {
      custom: {id: "leg_theundisputedchampion", name: "Frenzy Gains All Runes", format: "Frenzy gains the effect of every rune.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_BarbBelt_007_x1",
    name: "Kotuur's Brace",
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      block: "blockShield",
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_BarbBelt_002_x1",
    name: "Pride of Cassius",
    type: "mightybelt",
    quality: "legendary",
    required: {
      custom: {id: "leg_prideofcassius", name: "Increased Ignore Pain Duration", format: "Increases the duration of Ignore Pain by %d seconds.", min: 4, max: 6},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_BarbBelt_101_x1",
    name: "Chilanik's Chain",
    type: "mightybelt",
    quality: "legendary",
    required: {
      custom: {id: "leg_chilanikschain", name: "War Cry Speed Increase", format: "Using War Cry increases the movement speed for you and all allies affected by %d%% for 10 seconds.", min: 30, max: 40},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_BarbBelt_001_x1",
    name: "Dread Iron",
    suffix: _L("Legacy"),
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
      edef: "edefNormal",
    },
    preset: ["mainstat", "ms", "edef", "dura"],
    primary: 5,
    secondary: 2,
  },

  {
    id: "Unique_BarbBelt_008_x1",
    name: "Ageless Might",
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      thorns: "thornsLarge",
      meleedef: "defNormal",
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_BarbBelt_005_x1",
    name: "Lamentation",
    suffix: _L("Legacy"),
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      chc: {min: 1, max: 2, step: 0.5},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_BarbBelt_005_p1",
    name: "Lamentation",
    type: "mightybelt",
    quality: "legendary",
    required: {
      custom: {id: "leg_lamentation", name: "Rend Stacks Twice", format: "Rend can now stack up to 2 times on an enemy.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_BarbBelt_009_x1",
    name: "Immortal King's Tribal Binding",
    type: "mightybelt",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "resall"],
  },

  {
    id: "P2_Unique_Belt_008",
    name: "Belt of the Trove",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_beltofthetrove", name: "Bombardment Rate", format: "Every %d seconds, call down Bombardment on a random nearby enemy.", min: 6, max: 8, best: "min"},
    },
    affixes: {
      meleedef: "defNormal",
    },
    preset: ["mainstat", "resall", "meleedef"],
  },

  {
    id: "P2_Unique_Belt_05",
    ids: ["ptr_HammerBelt"],
    name: "Blessed of Haull",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_blessedofhaull", name: "Justice Spawns Blessed Hammer", format: "Justice spawns a Blessed Hammer when it hits an enemy.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P2_Unique_Belt_04",
    ids: ["ptr_Omnislash"],
    name: "Omnislash",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_omnislash", name: "Omnislash", format: "Slash attacks in all directions.", args: 0},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P2_Unique_Belt_01",
    ids: ["ptr_CrashingRain"],
    name: "Crashing Rain",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_crashingrain", name: "Crashing Beast Damage", format: "Rain of Vengeance also summons a crashing beast that deals %d%% weapon damage.", min: 3000, max: 4000},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P2_Unique_Belt_03",
    ids: ["ptr_HauntedGirdle"],
    name: "Haunting Girdle",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_hauntinggirdle", name: "Extra Haunt Spirit", format: "Haunt releases 1 extra spirit.", args: 0},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P2_Unique_Belt_02",
    ids: ["ptr_BeltofTranscendence"],
    name: "Belt of Transcendence",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_beltoftranscendence", name: "Summon Sycophants", format: "Summon a Fetish Sycophant when you hit with a Mana spender.", args: 0},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P2_Unique_BarbBelt_001",
    ids: ["ptr_DreadIron"],
    name: "Dread Iron",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_dreadiron", name: "Ground Stomp Causes Avalance", format: "Ground Stomp causes an Avalanche.", args: 0},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P2_Unique_Belt_06",
    ids: ["ptr_OmrynsChain"],
    name: "Omryn's Chain",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_omrynschain", name: "Vault Drops Caltrops", format: "Drop Caltrops when using Vault.", args: 0},
    },
    preset: ["mainstat"],
  },

]);

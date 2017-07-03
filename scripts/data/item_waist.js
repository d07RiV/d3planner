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
    suffix: _L("Legacy"),
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
    suffix: _L("Legacy"),
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
    secondary: 3,
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
    suffix: _L("Legacy"),
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
    suffix: _L("Legacy"),
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
      basearmor: "basearmorMightyBelt",
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
    type: "mightybelt",
    quality: "legendary",
    required: {
      skill_barbarian_avalanche: {min: 150, max: 200},
      custom: {id: "leg_dreadiron", name: "Ground Stomp Causes Avalance", format: "Ground Stomp causes an Avalanche.", args: 0},
    },
    preset: ["mainstat", "vit"],
    primary: 5,
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

  {
    id: "P3_Unique_Belt_005",
    local: true,
    name: "Hunter's Wrath",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_hunterswrath", name: "Generator Damage Bonus", format: "Your primary skills attack 30%% faster and deal %d%% increased damage.", min: 45, max: 60},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P3_Unique_Belt_01",
    local: true,
    name: "Sacred Harness",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_sacredharness", name: "Falling Sword Casts Judgment", format: "Judgment gains the effect of the Debilitate rune and is cast at your landing location when casting Falling Sword.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P3_Unique_Belt_02",
    suffix: _L("Legacy"),
    name: "Fazula's Improbable Chain",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_fazulasimprobablechain", name: "Archon Stacks Extra Bonuses", format: "You automatically start with %d Archon stacks when entering Archon form.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "P3_Unique_Belt_03",
    local: true,
    name: "Binding of the Lost",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_bindingofthelost", name: "Damage Reduction", format: "Each hit with Seven-Sided Strike grants %.1f%% damage reduction for 7 seconds.", min: 3, max: 3.5, step: 0.1},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Belt_01",
    local: true,
    name: "Chain of Shadows",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_chainofshadows", name: "Free Impale After Vault", format: "After using Impale, Vault costs no resource for 2 seconds.", args: 0},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P4_Unique_Belt_02",
    local: true,
    name: "The Shame of Delsere",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_theshameofdelsere", name: "Arcane Power Gain", format: "Your Signature Spells attack 50% faster and restore %d Arcane Power.", min: 9, max: 12},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Belt_03",
    local: true,
    name: "String of Ears",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_stringofears", name: "Melee Damage Reduction", format: "Reduces damage from melee attacks by %d%%.", min: 25, max: 30},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P4_Unique_Belt_04",
    local: true,
    name: "Zoey's Secret",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_zoeyssecret", name: "Damage Reduction Per Companion", format: "You take %.1f%% less damage for every Companion you have active.", min: 8, max: 9, step: 0.1},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "P4_Unique_Belt_05",
    local: true,
    name: "Kyoshiro's Soul",
    type: "belt",
    quality: "legendary",
    required: {
      skill_monk_sweepingwind: {min: 100, max: 125},
      custom: {id: "leg_kyoshirossoul", name: "Sweeping Wind Gains Stacks", format: "Sweeping Wind gains 2 stacks every second it does not deal damage to any enemies.", args: 0},
    },
    preset: ["mainstat"],
    primary: 5,
  },

  {
    id: "P4_Unique_Belt_06",
    local: true,
    name: "Hergbrash's Binding",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_hergbrashsbinding", name: "Channeling Cost Reduction", format: "Reduces the Arcane Power cost of Arcane Torrent, Disintegrate, and Ray of Frost by %d%%.", min: 50, max: 65},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Belt_07",
    name: "Fazula's Improbable Chain",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_fazulasimprobablechain_p2", name: "Archon Stacks Extra Bonuses", format: "You automatically start with %d Archon stacks when entering Archon form.", min: 40, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "P41_Unique_Belt_007",
    name: "Bakuli Jungle Wraps",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_bakulijunglewraps", name: "Extra Firebats Damage", format: "Firebats deals %d%% increased damage to enemies affected by Locust Swarm or Piranhas.", min: 150, max: 200},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "P42_Crusader_FoH_Belt",
    name: "Khassett's Cord of Righteousness",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_cordoftherighteous", name: "Bonus FoH Damage", format: "Fist of the Heavens costs 40%% less Wrath and deals %d%% more damage.", min: 130, max: 170},
    },
    preset: ["mainstat"],
  },

  {
    id: "P42_Unique_BarbBelt_EQ",
    name: "Girdle of Giants",
    type: "mightybelt",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    required: {
      custom: {id: "leg_girdleofgiants", name: "Earthquake Damage Bonus", format: "Seismic Slam increases Earthquake damage by %d%% for 3 seconds.", min: 80, max: 100},
    },
    preset: ["mainstat", "ias", "maxfury"],
  },

  {
    id: "P43_Unique_Belt_001_x1",
    name: "Saffron Wrap",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_saffronwrap", name: "Overpower Damage Bonus", format: "The damage of your next Overpower is increased by %d%% for each enemy hit. Max 20 enemies.", min: 40, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "P43_Unique_Belt_005_x1",
    name: "Hellcat Waistguard",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_hellcatwaistguard", name: "Grenade Bounces", format: "Grenades have a chance to bounce %d times dealing an additional 50%% damage on each bounce. This bonus is increased to 800%% on the final bounce.", min: 3, max: 5},
    },
    preset: ["mainstat"],
  },

  {
    id: "P6_Unique_Belt_01",
    name: "Dayntee's Binding",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_daynteesbinding", name: "Decrepify Damage Reduction", format: "You gain an additional %d%% damage reduction when there is an enemy afflicted by your Decrepify.", min: 40, max: 50},
    },
    preset: ["mainstat"],
  },

]);

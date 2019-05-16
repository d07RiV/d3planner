DiabloCalc.addItems([

  {
    id: "Unique_Helm_001_x1",
    name: "Broken Crown",
    suffix: _L("Legacy"),
    type: "helm",
    quality: "legendary",
    preset: ["mainstat", "chc", "expadd"],
  },

  {
    id: "P2_Unique_Helm_001",
    name: "Broken Crown",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_brokencrown", name: "Extra Gem Drops", format: "Whenever a gem drops, a gem of the type socketed into your helmet also drops. This effect does not apply to Legendary Gems.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_002_x1",
    name: "Leoric's Crown",
    suffix: _L("Legacy"),
    type: "helm",
    quality: "legendary",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Helm_002_p1",
    ids: ["Unique_Helm_002_p3"],
    name: "Leoric's Crown",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_leoricscrown", name: "Increased Gem Effects", format: "Increase the effect of any gem socketed into your helm by %d%%. This effect does not apply to Legendary Gems.", min: 75, max: 100,
        altformat: "Increase the effect of any gem socketed into this item by %d%%."},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_007_x1",
    name: "Blind Faith",
    type: "helm",
    quality: "legendary",
    affixes: {
      hitblind: {min: 20, max: 40, step: 0.1},
    },
    preset: ["mainstat", "hitblind"],
  },

  {
    id: "Unique_Helm_102_x1",
    name: "Deathseer's Cowl",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_deathseerscowl", name: "Chance to Charm Undead", format: "%d%% chance on being hit by an Undead enemy to charm it for 2 seconds.", min: 15, max: 20},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_004_x1",
    name: "Skull of Resonance",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_skullofresonance", name: "Threatening Shout Charms Enemies", format: "Threatening Shout has a chance to Charm enemies and cause them to join your side.", args: 0},
    },
    preset: ["mainstat", "resall", "sockets"],
  },

  {
    id: "Unique_Helm_003_x1",
    name: "Andariel's Visage",
    suffix: _L("Legacy"),
    type: "helm",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
      elemental: "elementalDamage",
    },
    required: {
      respsn: {min: 150, max: 200, noblock: true},
      firetaken: {min: 5, max: 10},
      custom: {id: "leg_andarielsvisage", name: "Poison Nova Damage", format: "Chance on hit to release a Poison Nova that deals %d%% weapon damage as Poison to enemies within 10 yards.", min: 100, max: 130},
    },
    preset: ["mainstat", "elemental", "ias"],
    primary: 5,
  },

  {
    id: "Unique_Helm_003_p2",
    name: "Andariel's Visage",
    type: "helm",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
      elemental: "elementalDamage",
    },
    required: {
      respsn: {min: 150, max: 200, noblock: true},
      firetaken: {min: 5, max: 10},
      custom: {id: "leg_andarielsvisage_p2", name: "Poison Nova Damage", format: "Chance on hit to release a Poison Nova that deals %d%% weapon damage as Poison to enemies within 10 yards.", min: 350, max: 450},
    },
    preset: ["mainstat", "elemental", "ias"],
    primary: 5,
  },

  {
    id: "Unique_Helm_006_x1",
    name: "Mempo of Twilight",
    type: "helm",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    preset: ["mainstat", "resall", "ias", "sockets"],
  },
/*
  // Crafted level 60 item, what do?
  {
    id: "Unique_Helm_011_1xx",
    name: "The Helm of Command",
    type: "helm",
    affixes: {
      block: {min: 8, max: 8},
    },
    quality: "legendary",
    preset: ["block"],
  },
*/
  {
    id: "Unique_Helm_011_x1",
    name: "The Helm of Rule",
    type: "helm",
    affixes: {
      block: {min: 11, max: 11},
    },
    quality: "legendary",
    preset: ["vit", "block"],
  },

  // SET

  {
    id: "Unique_Helm_008_x1",
    name: "Immortal King's Triumph",
    type: "helm",
    quality: "set",
    set: "immortalking",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_009_x1",
    name: "Natalya's Sight",
    type: "helm",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_010_x1",
    name: "Tal Rasha's Guise of Wisdom",
    type: "helm",
    quality: "set",
    set: "talrasha",
    preset: ["mainstat", "sockets", "chc"],
  },

  {
    id: "Unique_Helm_Set_12_x1",
    name: "Crown of the Invoker",
    type: "helm",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "sockets", "thorns"],
  },

  {
    id: "Unique_Helm_Set_15_x1",
    name: "Eyes of the Earth",
    type: "helm",
    quality: "set",
    set: "earth",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_06_x1",
    name: "Firebird's Plume",
    type: "helm",
    quality: "set",
    set: "firebird",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_16_x1",
    name: "Helltooth Mask",
    type: "helm",
    quality: "set",
    set: "helltooth",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_10_x1",
    name: "Helm of Akkhan",
    type: "helm",
    quality: "set",
    set: "akkhan",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_09_x1",
    name: "Jade Harvester's Wisdom",
    type: "helm",
    quality: "set",
    set: "jadeharvester",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_07_x1",
    name: "Marauder's Visage",
    type: "helm",
    quality: "set",
    set: "marauder",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_08_x1",
    name: "Mask of the Searing Sky",
    type: "helm",
    quality: "set",
    set: "storms",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_05_x1",
    name: "Raekor's Will",
    type: "helm",
    quality: "set",
    set: "raekor",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_01_p1",
    name: "Roland's Visage",
    type: "helm",
    quality: "set",
    set: "roland",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_11_x1",
    name: "Sunwuko's Crown",
    type: "helm",
    quality: "set",
    set: "sunwuko",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_014_x1",
    name: "Aughild's Spike",
    type: "helm",
    quality: "set",
    set: "aughild",
    preset: ["resall"],
  },

  {
    id: "Unique_Helm_012_x1",
    name: "Cain's Insight",
    type: "helm",
    quality: "set",
    set: "cain",
    preset: ["expadd"],
  },

  {
    id: "Unique_Helm_015_x1",
    name: "Guardian's Gaze",
    type: "helm",
    quality: "set",
    set: "guardian",
    affixes: {
      ms: "msNormal",
    },
    preset: ["ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Helm_016_x1",
    name: "Sage's Apogee",
    type: "helm",
    quality: "set",
    set: "sage",
    preset: ["sockets"],
  },

  // WIZARD HAT

  {
    id: "P1_Unique_WizardHat_003",
    ids: ["p1_Unique_WizardHat_003"],
    name: "The Swami",
    suffix: _L("Legacy"),
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_theswami", name: "Extra Archon Damage Duration", format: "The damage bonus from kills while in Archon form now lasts for %d seconds after Archon expires.", min: 10, max: 15},
    },
    preset: ["mainstat", "apoc", "maxap"],
  },

  {
    id: "Unique_WizardHat_001_x1",
    name: "Dark Mage's Shade",
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_darkmagesshade", name: "Automatic Diamond Skin Cooldown", format: "Automatically cast Diamond Skin when you fall below 35%% Life. This effect may occur once every %d seconds.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_WizardHat_101_x1",
    name: "Archmage's Vicalyke",
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_archmagesvicalyke", name: "Mirror Images Multiply", format: "Your Mirror Images have a chance to multiply when killed by enemies.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_WizardHat_103_x1",
    name: "The Magistrate",
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_themagistrate", name: "Hydra Casts Frost Nova", format: "Frost Hydra now periodically casts Frost Nova.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_WizardHat_102_x1",
    name: "Velvet Camaral",
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_velvetcamaral", name: "Double Electrocute Jumps", format: "Double the number of enemies your Electrocute jumps to.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_WizardHat_004_x1",
    name: "Storm Crow",
    type: "wizardhat",
    quality: "legendary",
    affixes: {
      dmglit: "elementalDamage",
    },
    required: {
      custom: {id: "leg_stormcrow", name: "Chance to Cast Fiery Ball", format: "%d%% chance to cast a fiery ball when attacking.", min: 20, max: 40},
    },
    preset: ["mainstat", "dmglit"],
  },

  // VOODOO MASK

  {
    id: "Unique_VoodooMask_006_x1",
    name: "Split Tusk",
    type: "voodoomask",
    quality: "legendary",
    preset: ["mainstat", "expadd", "maxmana"],
  },

  {
    id: "Unique_VoodooMask_005_x1",
    name: "Quetzalcoatl",
    type: "voodoomask",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    required: {
      custom: {id: "leg_quetzalcoatl", name: "Double D.o.t. Speed", format: "Locust Swarm and Haunt now deal their damage in half of the normal duration.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_VoodooMask_101_x1",
    name: "Carnevil",
    suffix: _L("Legacy"),
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_carnevil", name: "Fetishes Shoot Darts", format: "The 5 Fetishes closest to you will shoot a powerful Poison Dart every time you do.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_VoodooMask_102_x1",
    name: "Mask of Jeram",
    suffix: _L("Legacy"),
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_maskofjeram", name: "Pet Damage", format: "Pets deal %d%% increased damage.", min: 75, max: 100},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_VoodooMask_002_x1",
    name: "The Grin Reaper",
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_thegrinreaper", name: "༼ ºل͜º ༽ºل͜º ༽ºل͜º ༽", format: "Chance when attacking to summon horrific Mimics that cast some of your equipped skills.", args: 0},
//      custom: {id: "leg_thegrinreaper", name: "Chance to Summon Mimics", format: "Chance when attacking to summon horrific Mimics that cast some of your equipped skills.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_VoodooMask_001_x1",
    name: "Tiklandian Visage",
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_tiklandianvisage", name: "Horrify Duration", format: "Horrify causes you to Fear and Root enemies around you for %d seconds.", min: 6, max: 8},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_VoodooMask_008_x1",
    name: "Visage of Giyua",
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_visageofgiyua", name: "Summon Fetish Army", format: "Summon a Fetish Army after you kill 2 Elites.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_VoodooMask_007_x1",
    name: "Zunimassa's Vision",
    type: "voodoomask",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "sockets"],
  },

  // SPIRIT STONE

  {
    id: "Unique_SpiritStone_005_x1",
    name: "See No Evil",
    type: "spiritstone",
    quality: "legendary",
    preset: ["mainstat", "expadd"],
  },

  {
    id: "Unique_SpiritStone_004_x1",
    name: "Gyana Na Kashu",
    type: "spiritstone",
    quality: "legendary",
    required: {
      skill_monk_lashingtailkick: {min: 75, max: 100},
      custom: {id: "leg_gyananakashu", name: "Fireball Damage", format: "Lashing Tail Kick releases a piercing fireball that deals %d%% weapon damage as Fire to enemies within 10 yards on impact.", min: 1050, max: 1400},
    },
    preset: ["mainstat", "sockets"],
    primary: 5,
  },

  {
    id: "Unique_SpiritStone_003_x1",
    name: "Erlang Shen",
    type: "spiritstone",
    quality: "legendary",
    preset: ["mainstat", "ccr"],
  },

  {
    id: "Unique_SpiritStone_002_x1",
    name: "The Mind's Eye",
    type: "spiritstone",
    quality: "legendary",
    required: {
      custom: {id: "leg_themindseye", name: "Spirit Regeneration in Inner Sanctuary", format: "Inner Sanctuary increases Spirit Regeneration per second by %d.", min: 10, max: 15},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_SpiritStone_103_x1",
    name: "Eye of Peshkov",
    type: "spiritstone",
    quality: "legendary",
    required: {
      custom: {id: "leg_eyeofpeshkov", name: "Breath of Heaven Cooldown Reduction", format: "Reduce the cooldown of Breath of Heaven by %d%%.", min: 38, max: 50},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_SpiritStone_102_x1",
    name: "Kekegi's Unbreakable Spirit",
    type: "spiritstone",
    quality: "legendary",
    required: {
      custom: {id: "leg_kekegisunbreakablespirit", name: "Free Cast Duration", format: "Damaging enemies has a chance to grant you an effect that removes the Spirit cost of your abilities for %d seconds.", min: 2, max: 4},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_SpiritStone_101_x1",
    name: "The Laws of Seph",
    type: "spiritstone",
    quality: "legendary",
    required: {
      custom: {id: "leg_thelawsofseph", name: "Blinding Flash Spirit Recovery", format: "Using Blinding Flash restores %d Spirit.", min: 125, max: 165},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_SpiritStone_001_x1",
    name: "Bezoar Stone",
    type: "spiritstone",
    affixes: {
      skill_monk_cyclonestrike_cost: {min: 1, max: 3},
      skill_monk_wayofthehundredfists: "skillNormal",
      skill_monk_sweepingwind: "skillNormal",
      skill_monk_explodingpalm: "skillNormal",
      skill_monk_cripplingwave: "skillNormal",
      skill_monk_deadlyreach: "skillNormal",
      skill_monk_fistsofthunder: "skillNormal",
    },
    quality: "legendary",
    preset: ["mainstat"],
  },

  {
    id: "Unique_SpiritStone_006_x1",
    name: "The Eye of the Storm",
    type: "spiritstone",
    quality: "legendary",
    affixes: {
      dmglit: {min: 15, max: 30},
    },
    preset: ["mainstat", "dmglit"],
  },

  {
    id: "P1_Unique_SpiritStone_008",
    ids: ["Unique_SpiritStone_008_x1"],
    name: "Madstone",
    type: "spiritstone",
    quality: "legendary",
    required: {
      custom: {id: "leg_madstone", name: "Auto Exploding Palm", format: "Your Seven-Sided Strike applies Exploding Palm.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_SpiritStone_007_x1",
    name: "Tzo Krin's Gaze",
    type: "spiritstone",
    quality: "legendary",
    affixes: {
      skill_monk_waveoflight: {min: 125, max: 150},
    },
    required: {
      custom: {id: "leg_tzokrinsgaze", name: "Wave of Light Cast at Enemy", format: "Wave of Light is now cast at your enemy.", args: 0},
    },
    preset: ["mainstat", "skill_monk_waveoflight"],
    primary: 5,
  },

  {
    id: "Unique_SpiritStone_009_x1",
    name: "Inna's Radiance",
    type: "spiritstone",
    quality: "set",
    set: "inna",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_WizardHat_104_x1",
    ids: ["ptr_CrownofthePrimus"],
    name: "Crown of the Primus",
    type: "wizardhat",
    quality: "legendary",
    required: {
     custom: {id: "leg_crownoftheprimus", name: "Slow Time Gains All Runes", format: "Slow Time gains the effect of every rune.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_02_p2",
    ids: ["ptr_MagnumHelm"],
    name: "Shrouded Mask",
    type: "helm",
    quality: "set",
    set: "magnumopus",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_03_p2",
    ids: ["ptr_UnhallowedHelm"],
    name: "Accursed Visage",
    type: "helm",
    quality: "set",
    set: "unhallowed",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_01_p2",
    ids: ["ptr_WastesHelm"],
    name: "Helm of the Wastes",
    type: "helm",
    quality: "set",
    set: "wastes",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P3_Unique_WizardHat_003",
    local: true,
    name: "The Swami",
    type: "wizardhat",
    quality: "legendary",
    required: {
      custom: {id: "leg_theswami_p3", name: "Extra Archon Damage Duration", format: "The bonuses from Archon stacks now last for %d seconds after Archon expires.", min: 15, max: 20},
    },
    preset: ["mainstat", "apoc", "maxap"],
  },

  {
    id: "Unique_Helm_Set_01_p3",
    local: true,
    name: "Uliana's Spirit",
    type: "helm",
    quality: "set",
    set: "uliana",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_02_p3",
    local: true,
    name: "Arachyr's Visage",
    type: "helm",
    quality: "set",
    set: "arachyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_03_p3",
    local: true,
    name: "Crown of the Light",
    type: "helm",
    quality: "set",
    set: "light",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_13_x1",
    local: true,
    name: "Vyr's Sightless Skull",
    type: "helm",
    quality: "set",
    set: "vyr",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P4_Unique_Helm_102",
    name: "Warhelm of Kassar",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_warhelmofkassar", name: "Phalanx Damage and Cooldown", format: "Reduce the cooldown and increase the damage of Phalanx by %d%%.", min: 45, max: 60},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P4_Unique_Helm_103",
    name: "Visage of Gunes",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_visageofgunes", name: "Vengeance Gains Dark Heart Rune", format: "Vengeance gains the effect of the Dark Heart rune.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Helm_Set_14_x1",
    name: "The Shadow's Mask",
    type: "helm",
    quality: "set",
    set: "shadow",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "p43_RetroHelm_001",
    name: "Harlequin Crest",
    suffix: _L("Retro"),
    type: "helm",
    quality: "magic",
    preset: ["vit", "resall"],
  },

  {
    id: "p43_RetroHelm_002",
    name: "The Undead Crown",
    suffix: _L("Retro"),
    type: "helm",
    quality: "magic",
    affixes: {
      laek: "laekLarge",
    },
    preset: ["laek"],
  },

  {
    id: "p43_RetroHelm_003",
    name: "Veil of Steel",
    suffix: _L("Retro"),
    type: "helm",
    quality: "magic",
    preset: ["mainstat", "vit", "resall"],
  },

  {
    id: "P6_Necro_Set_1_Helm",
    name: "Rathma's Skull Helm",
    type: "helm",
    quality: "set",
    set: "rathma",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_2_Helm",
    name: "Trag'Oul's Guise",
    type: "helm",
    quality: "set",
    set: "trangoul",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_3_Helm",
    name: "Inarius's Understanding",
    type: "helm",
    quality: "set",
    set: "inarius",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Set_4_Helm",
    name: "Pestilence Mask",
    type: "helm",
    quality: "set",
    set: "pestilence",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Unique_Helm_21",
    name: "Mask of Scarlet Death",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_maskofscarletdeath", name: "Revive Damage per Corpse", format: "Revive now consumes all corpses to raise a minion that deals %d%% more damage per corpse.", min: 125, max: 150},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P6_Necro_Unique_Helm_22",
    name: "Fate's Vow",
    suffix: _L("Legacy"),
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_fatesvow", name: "Army of the Dead Gains Unconventional Warfare", format: "Army of the Dead gains the effect of the Unconventional Warfare rune.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P61_Necro_Unique_Helm_22",
    name: "Fate's Vow",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_fatesvow_p6", name: "Army of the Dead Gains Unconventional Warfare", format: "Army of the Dead deals an additional %d%% damage and gains the effect of the Unconventional Warfare rune.", min: 200, max: 250},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P61_Unique_VoodooMask_102_x1",
    name: "Mask of Jeram",
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_maskofjeram_p6", name: "Pet Damage", format: "Pets deal %d%% increased damage.", min: 150, max: 200},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P65_Unique_VoodooMask_101_x1",
    name: "Carnevil",
    type: "voodoomask",
    quality: "legendary",
    required: {
      custom: {id: "leg_carnevil_p65", name: "Fetishes Shoot Darts", format: "The 10 Fetishes closest to you will shoot a powerful Poison Dart every time you do.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

]);

DiabloCalc.addItems([

  {
    id: "Unique_Bracer_006_x1",
    name: "Gungdo Gear",
    suffix: _L("Legacy"),
    type: "bracers",
    quality: "legendary",
    affixes: {
      ccr: "ccrNormal",
    },
    preset: ["mainstat", "vit", "ccr"],
  },

  {
    id: "P2_Unique_Bracer_006",
    name: "Gungdo Gear",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_gungdogear", name: "Exploding Palm Chains", format: "Exploding Palm's on-death explosion applies Exploding Palm.", args: 0},
    },
    preset: ["mainstat", "elemental"],
  },

  {
    id: "Unique_Bracer_004_x1",
    name: "Steady Strikers",
    type: "bracers",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
    },
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Bracer_003_x1",
    name: "Slave Bonds",
    type: "bracers",
    quality: "legendary",
    affixes: {
      laek: "laekLarge",
      ms: "msNormal",
    },
    preset: ["mainstat", "ms", "laek"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Bracer_102_x1",
    name: "Ancient Parthan Defenders",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_ancientparthandefenders", name: "Damage Reduction on Stun", format: "Each stunned enemy within 25 yards reduces your damage taken by %d%%.", min: 9, max: 12},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bracer_107_x1",
    name: "Custerian Wristguards",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_custerianwristguards", name: "Gold to Experience", format: "Picking up gold grants experience.", args: 0},
    },
    preset: ["chc", "gf"],
  },

  {
    id: "Unique_Bracer_106_x1",
    name: "Nemesis Bracers",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_nemesisbracers", name: "Shrines Spawn Champions", format: "Shrines will spawn an enemy champion.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bracer_101_x1",
    name: "Warzechian Armguards",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_warzechianarmguards", name: "Speed After Breaking Objects", format: "Every time you destroy a wreckable object, you gain a short burst of speed.", args: 0},
    },
    preset: ["mainstat", "chc", "pickup"],
  },

  {
    id: "Unique_Bracer_002_x1",
    name: "Promise of Glory",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_promiseofglory", name: "Chance to Spawn Nephalem Globe", format: "%d%% chance to spawn a Nephalem Glory globe when you Blind an enemy.", min: 4, max: 6},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Bracer_005_x1",
    name: "Lacuni Prowlers",
    type: "bracers",
    quality: "legendary",
    affixes: {
      ias: "iasNormal",
      ms: "msNormal",
    },
    preset: ["ias", "ms", "thorns"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Bracer_007_x1",
    name: "Strongarm Bracers",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_strongarmbracers", name: "Damage Bonus on Knockback", format: "Enemies hit by knockbacks suffer %d%% increased damage for 6 seconds.", min: 20, max: 30},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Bracer_104_x1",
    name: "Trag'Oul Coils",
    suffix: _L("Legacy"),
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_tragoulcoils", name: "Cooldown Reduction From Healing Wells", format: "Healing wells replenish all resources and reduce all cooldowns by %d seconds.", min: 45, max: 60},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bracer_001_x1",
    name: "Kethrye's Splint",
    type: "bracers",
    quality: "legendary",
  },

  {
    id: "Unique_Bracer_103_x1",
    name: "Reaper's Wraps",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_reaperswraps", name: "Health Globes Resource Recovery", format: "Health globes restore %d%% of your primary resource.", min: 25, max: 30},
    },
  },

  // SET

  {
    id: "Unique_Bracer_Set_02_x1",
    name: "Krelm's Buff Bracers",
    type: "bracers",
    quality: "set",
    set: "krelm",
    required: {
      custom: {id: "leg_krelmsbuffbracers", name: "Stun Immunity", format: "You are immune to Knockback and Stun effects.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Bracer_Set_12_x1",
    name: "Shackles of the Invoker",
    type: "bracers",
    quality: "set",
    set: "invoker",
    preset: ["mainstat", "thorns"],
  },

  {
    id: "Unique_Bracer_009_x1",
    name: "Aughild's Search",
    type: "bracers",
    quality: "set",
    set: "aughild",
  },

  {
    id: "Unique_Bracer_011_x1",
    name: "Demon's Animus",
    type: "bracers",
    quality: "set",
    set: "demon",
  },

  {
    id: "Unique_Bracer_010_x1",
    name: "Guardian's Aversion",
    type: "bracers",
    quality: "set",
    set: "guardian",
  },

  {
    id: "P2_Unique_Bracer_110",
    ids: ["ptr_DrakonsLesson"],
    name: "Drakon's Lesson",
    suffix: _L("Legacy"),
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_drakonslesson", name: "Increased Shield Bash Damage", format: "When your Shield Bash hits 3 or fewer enemies, its damage is increased by %d%% and 25%% of its Wrath Cost is refunded.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc"],
  },

/*  {
    id: "ptr_MorticksBrace",
    local: "Unique_Bracer_003_x1",
    name: "Mortick's Brace",
    suffix: "PTR",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_morticksbrace", name: "WotB Gains All Runes", format: "Wrath of the Berserker Gains the effect of every rune.", args: 0},
    },
  },*/

  {
    id: "Unique_Bracer_108_x1",
    ids: ["ptr_RanslorsFolly"],
    name: "Ranslor's Folly",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_ranslorsfolly", name: "Energy Twister Vortex", format: "Energy Twister Periodically pulls in lesser enemies within 30 yards.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Bracer_109",
    ids: ["ptr_SpiritGuards"],
    name: "Spirit Guards",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_spiritguards", name: "Damage Reduction", format: "Your Spirit Generators reduce your damage taken by %d%% for 3 seconds.", min: 30, max: 40},
    },
    preset: ["mainstat", "chc"],
  },

/*  {
    id: "FakeDmoBracer",
    local: "Unique_Bracer_010_x1",
    name: "Sparkling Wraps of Imbalance",
    suffix: "Fake",
    type: "bracers",
    quality: "set",
    set: "magnumopus",
  },*/

  {
    id: "P3_Unique_Bracer_101",
    local: true,
    name: "Gabriel's Vambraces",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_gabrielsvambraces", name: "Blessed Hammer Cost Refund", format: "When your Blessed Hammer hits 3 or fewer enemies, %d%% of its Wrath Cost is refunded.", min: 75, max: 100},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P3_Unique_Bracer_103",
    local: true,
    name: "Wraps of Clarity",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_wrapsofclarity", name: "Damage Reduction", format: "Your Hatred Generators reduce your damage taken by %d%% for 5 seconds.", min: 30, max: 35},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P3_Unique_Bracer_104",
    local: true,
    name: "Bracers of Destruction",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_bracersofdestruction", name: "Seismic Slam Damage Increase", format: "Seismic Slam deals %d%% increased damage to the first 5 enemies it hits.", min: 300, max: 400},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P3_Unique_Bracer_105",
    local: true,
    name: "Bracers of the First Men",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_bracersofthefirstmen", name: "HotA Damage", format: "Hammer of the Ancients attacks 50%% faster and deals %d%% increased damage.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P3_Unique_Bracer_106",
    local: true,
    name: "Jeram's Bracers",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_jeramsbracers", name: "Wall of Death Damage", format: "Wall of Death deals %d%% increased damage and can be cast up to three times within 2 seconds before the cooldown begins.", min: 75, max: 100},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P3_Unique_Bracer_107",
    local: true,
    name: "Coils of the First Spider",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_coilsofthefirstspider", name: "Firebats Life on Hit", format: "While channeling Firebats, you gain 30%% damage reduction and %d Life per Hit.", min: 60000, max: 80000},
    },
    preset: ["mainstat", "chc", "regen"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "P4_Unique_Bracer_101",
    local: true,
    name: "Skular's Salvation",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_skularssalvation", name: "Boulder Toss Damage Bonus", format: "Increase the damage of Ancient Spear - Boulder Toss by 100%%. When your Boulder Toss hits 5 or fewer enemies, the damage is increased by %d%%.", min: 120, max: 150},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_102",
    local: true,
    name: "Lakumba's Ornament",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_lakumbasornament", name: "Soul Harvest Damage Reduction", format: "Reduce all damage taken by 6%% for each stack of Soul Harvest you have.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_103",
    local: true,
    name: "Akkhan's Manacles",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_akkhansmanacles", name: "Blessed Shield Damage on First Target", format: "Blessed Shield damage is increased by %d%% for the first enemy it hits.", min: 400, max: 500},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_104",
    local: true,
    name: "Bracer of Fury",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_braceroffury", name: "Heaven's Fury Damage on Blinded", format: "Heaven's Fury deals %d%% increased damage to enemies that are Blinded, Immobilized, or Stunned.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_105",
    local: true,
    name: "Pinto's Pride",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_pintospride", name: "Wave of Light Damage Bonus", format: "Wave of Light also Slows enemies by 80%% for 3 seconds and deals %d%% increased damage.", min: 125, max: 150},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_106",
    local: true,
    name: "Vambraces of Sescheron",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_vambracesofsescheron", name: "Primary Skills Heal", format: "Your primary skills heal you for %.1f%% of your missing Life.", min: 5, max: 6, step: 0.1},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_107",
    local: true,
    name: "Cesar's Memento",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_cesarsmemento", name: "Tempest Rush Damage Bonus", format: "Enemies take %d%% increased damage from your Tempest Rush for 5 seconds after you hit them with a Blind, Freeze, or Stun.", min: 300, max: 400},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_108",
    local: true,
    name: "Bindings of the Lesser Gods",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_bindingsofthelessergods", name: "Mystic Ally Damage Bonus", format: "Enemies hit by your Cyclone Strike take %d%% increased damage from your Mystic Ally for 5 seconds.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_110",
    local: true,
    name: "Drakon's Lesson",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_drakonslesson_p2", name: "Increased Shield Bash Damage", format: "When your Shield Bash hits 3 or fewer enemies, its damage is increased by %d%% and 25%% of its Wrath Cost is refunded.", min: 300, max: 400},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Bracer_004",
    name: "Ashnagarr's Blood Bracer",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_ashnagarrsblood", name: "Shield Increase", format: "Increases the potency of your shields by %d%%.", min: 75, max: 100},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P42_Unique_Bracer_SpikeTrap",
    name: "Trag'Oul Coils",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_tragoulcoils_p2", name: "Spike Trap Bonuses", format: "Spike Traps gain the Impaling Spines rune and are deployed twice as fast.", args: 0},
    },
    preset: ["mainstat"],
  },

]);

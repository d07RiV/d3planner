DiabloCalc.addItems([

  {
    id: "Unique_Bracer_006_x1",
    name: "Gungdo Gear",
    suffix: "Legacy",
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
      custom: {id: "leg_custerianwristguards", name: "Experience to Gold", format: "Picking up gold grants experience.", args: 0},
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
      custom: {id: "leg_strongarmbracers", name: "Damage Bonus on Knockback", format: "Enemies hit by knockbacks suffer %d%% more damage for 5 seconds when they land.", min: 20, max: 30},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Bracer_104_x1",
    name: "Trag'Oul Coils",
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
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_drakonslesson", name: "Increased Shield Bash Damage", format: "When your Shield Bash hits 3 or less enemies, its damage is increased by %d%% and 25%% of its Wrath Cost is refunded.", min: 150, max: 200},
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
      custom: {id: "leg_ranslorsfolly", name: "Energy Twister Vortex", format: "Energy Twister Periodically pulls in enemies within 30 yards.", args: 0},
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

]);

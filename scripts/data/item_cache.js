DiabloCalc.addItems([

  // ACT 1

  {
    id: "Unique_Amulet_105_x1",
    name: "Golden Gorget of Leoric",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_goldengorgetofleoric", name: "Summon Skeletons", format: "After earning a massacre bonus, %d Skeletons are summoned to fight by your side for 10 seconds.", min: 4, max: 6},
    },
    preset: ["mainstat", "chc", "resall"],
  },

  {
    id: "Unique_Mace_1H_101_x1",
    name: "Mad Monarch's Scepter",
    type: "mace",
    quality: "legendary",
    required: {
      custom: {id: "leg_madmonarchsscepter", name: "Poison Nova Damage", format: "After killing 10 enemies, you release a Poison Nova that deals %d%% weapon damage as Poison to enemies within 30 yards.", min: 1050, max: 1400},
    },
    preset: ["wpnphy", "mainstat", "damage"],
  },

  {
    id: "Unique_Shoulder_103_x1",
    name: "Pauldrons of the Skeleton King",
    type: "shoulders",
    quality: "legendary",
    required: {
      custom: {id: "leg_pauldronsoftheskeletonking", name: "Chance to Revive", format: "When receiving fatal damage, there is a chance that you are instead restored to 25%% of maximum Life and cause nearby enemies to flee in fear.", args: 0},
    },
    preset: ["mainstat", "vit", "armor"],
  },

  {
    id: "P3_Unique_Ring_107",
    ids: ["Unique_Ring_107_x1"],
    name: "Ring of Royal Grandeur",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_ringofroyalgrandeur", name: "Set Requirements Reduction", format: "Reduces the number of items needed for set bonuses by 1 (to a minimum of 2).", args: 0},
    },
    preset: ["mainstat", "ias", "lph"],
  },

  {
    id: "Unique_Bracer_105_x1",
    name: "Sanguinary Vambraces",
    type: "bracers",
    quality: "legendary",
    required: {
      custom: {id: "leg_sanguinaryvambraces", name: "Chance to Deal Thorns Damage", format: "Chance on being hit to deal 1000%% of your Thorns damage to nearby enemies.", args: 0},
    },
    preset: ["mainstat", "chc", "thorns"],
  },

  // ACT 2

  {
    id: "Unique_Cloak_102_x1",
    name: "Cloak of Deception",
    type: "cloak",
    quality: "legendary",
    required: {
      custom: {id: "leg_cloakofdeception", name: "Chance to Avoid Missiles", format: "Enemy missiles sometimes pass through you harmlessly.", args: 0},
    },
    preset: ["mainstat", "vit", "armor"],
  },

  {
    id: "Unique_Shield_107_x1",
    name: "Coven's Criterion",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_covenscriterion", name: "Damage Reduction on Block", format: "You take %d%% less damage from blocked attacks.", min: 45, max: 60},
    },
    preset: ["vit", "block"],
  },

  {
    id: "Unique_Gloves_103_x1",
    name: "Gloves of Worship",
    type: "gloves",
    quality: "legendary",
    required: {
      custom: {id: "leg_glovesofworship", name: "Extended Shrine Duration", format: "Shrine effects last for 10 minutes.", args: 0},
    },
    preset: ["mainstat", "lph", "chd"],
  },

  {
    id: "Unique_Boots_103_x1",
    name: "Illusory Boots",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_illusoryboots", name: "Move Through Enemies", format: "You may move unhindered through enemies.", args: 0},
    },
    preset: ["mainstat", "resall", "ms"],
  },

  // ACT 3

  {
    id: "Unique_Ring_108_x1",
    name: "Avarice Band",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_avariceband", name: "Gold Increases Pickup Radius", format: "Each time you pick up gold, increase your Gold and Health Pickup radius by 1 yard for 10 seconds, stacking up to 30 times.", args: 0},
    },
    preset: ["mainstat", "chc", "gf"],
  },

  {
    id: "Unique_Axe_2H_103_x1",
    name: "Burst of Wrath",
    type: "axe2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_burstofwrath", name: "Chance to Gain Resource on Kill", format: "Killing enemies and destroying objects has a chance to grant 20%% of your maximum primary resource.", args: 0},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Boots_102_x1",
    name: "Boots of Disregard",
    type: "boots",
    quality: "legendary",
    required: {
      custom: {id: "leg_bootsofdisregard", name: "Regeneration While Standing Still", format: "Gain 10000 Life regeneration per Second for each second you stand still. This effect stacks up to 4 times.", args: 0},
    },
    preset: ["vit", "armor", "regen"],
  },

  {
    id: "Unique_Dagger_103_x1",
    name: "Envious Blade",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_enviousblade", name: "Critical Hit Against Full Health", format: "Gain 100%% Critical Hit Chance against enemies at full health.", args: 0},
    },
    preset: ["wpnpsn", "mainstat"],
  },

  {
    id: "Unique_Amulet_106_x1",
    name: "Overwhelming Desire",
    type: "amulet",
    quality: "legendary",
    required: {
      custom: {id: "leg_overwhelmingdesire", name: "Chance to Charm Enemies", format: "Chance on hit to charm the enemy. While charmed, the enemy takes 35%% more damage.", args: 0},
    },
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Helm_103_x1",
    name: "Pride's Fall",
    type: "helm",
    quality: "legendary",
    required: {
      custom: {id: "leg_pridesfall", name: "Reduces Resource Costs", format: "Your resource costs are reduced by 30%% after not taking damage for 5 seconds.", args: 0},
    },
    preset: ["mainstat", "vit", "chc"],
  },

  // ACT 5

  {
    id: "Unique_Ring_109_x1",
    name: "Pandemonium Loop",
    type: "ring",
    quality: "legendary",
    required: {
      hitfear: {min: 10, max: 15, step: 0.1},
      custom: {id: "leg_pandemoniumloop", name: "Feared Enemies Explode", format: "Enemies slain while Feared die in a bloody explosion and cause other nearby enemies to flee in Fear.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CruShield_108_x1",
    name: "Salvation",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_salvation", name: "Heal on Block", format: "Blocked attacks heal you and your allies for %d%% of the amount blocked.", min: 20, max: 30},
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_Pants_102_x1",
    name: "Death's Bargain",
    type: "pants",
    quality: "legendary",
    required: {
      custom: {id: "leg_deathsbargain", name: "Regeneration to Damage", format: "Gain an aura of death that deals %d%% of your Life per Second as Physical damage to enemies within 16 yards. You no longer regenerate Life.", min: 750, max: 1000},
    },
    preset: ["mainstat", "regen"],
  },

  {
    id: "Unique_HandXBow_102_x1",
    name: "Helltrapper",
    type: "handcrossbow",
    quality: "legendary",
    required: {
      custom: {id: "leg_helltrapper", name: "Chance to Summon Devices on Hit", format: "%d%% chance on hit to summon a Spike Trap, Caltrops or Sentry.", min: 7, max: 10},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Belt_103_x1",
    name: "Insatiable Belt",
    type: "belt",
    quality: "legendary",
    required: {
      custom: {id: "leg_insatiablebelt", name: "Globes Increase Health", format: "Picking up a Health Globe increases your maximum Life by 5%% for 15 seconds, stacking up to 5 times.", args: 0},
    },
    preset: ["mainstat", "vit", "pickup"],
  },

  {
    id: "Unique_Mace_2H_104_x1",
    name: "Soulsmasher",
    type: "mace2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_soulsmasher", name: "Life per Kill to Explosion", format: "When you kill an enemy, it explodes for %d%% of your Life per Kill as damage to all enemies within 20 yards. You no longer benefit from your Life per Kill.", min: 450, max: 600},
    },
    preset: ["mainstat", "laek"],
  },

]);

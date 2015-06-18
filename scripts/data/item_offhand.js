DiabloCalc.addItems([

  // SHIELD

  {
    id: "Unique_Shield_007_x1",
    name: "Denial",
    suffix: _L("Legacy"),
    type: "shield",
    quality: "legendary",
    preset: ["mainstat", "resall", "ccr"],
  },

  {
    id: "P2_Unique_Shield_007",
    ids: ["ptr_Denial"],
    name: "Denial",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_denial", name: "Sweep Attack Bonus", format: "Each enemy hit by your Sweep Attack increases the damage of your next Sweep Attack by %d%%, stacking up to 5 times.", min: 30, max: 40},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shield_101_x1",
    name: "Defender of Westmarch",
    suffix: _L("Legacy"),
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_defenderofwestmarch", name: "Charging Wolf Damage", format: "Blocks have a chance of summoning a charging wolf that deals %d%% weapon damage to all enemies it passes through.", min: 300, max: 400},
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_Shield_101_p2",
    name: "Defender of Westmarch",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_defenderofwestmarch_p2", name: "Charging Wolf Damage", format: "Blocks have a chance of summoning a charging wolf that deals %d%% weapon damage to all enemies it passes through.", min: 800, max: 1000},
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_Shield_102_x1",
    name: "Eberli Charo",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_eberlicharo", name: "Heaven's Fury Cooldown Reduction", format: "Reduces the cooldown of Heaven's Fury by %d%%.", min: 45, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shield_004_x1",
    name: "Freeze of Deflection",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_freezeofdeflection", name: "Chance to Freeze on Block", format: "Blocking an attack has a chance to Freeze the attacker for %.1f seconds.", min: 1.5, max: 2.5, step: 0.5},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Shield_104_x1",
    name: "Vo'Toyias Spiker",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_votoyiasspiker", name: "Provoke Doubles Thorns Damage", format: "Enemies affected by Provoke take double damage from Thorns.", args: 0},
    },
    preset: ["mainstat", "thorns"],
  },

  {
    id: "Unique_Shield_008_x1",
    name: "Lidless Wall",
    type: "shield",
    quality: "legendary",
    affixes: {
      elemental: "elementalDamage",
      maxdisc: "maxdiscNormal",
      maxfury: "maxfuryNormal",
      maxap: "maxapNormal",
      maxmana: "maxmanaNormal",
      maxspirit: "maxspiritNormal",
      maxwrath: "maxwrathNormal",
    },
    preset: ["mainstat", "elemental", "resource"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Shield_002_x1",
    name: "Ivory Tower",
    suffix: _L("Legacy"),
    type: "shield",
    quality: "legendary",
    affixes: {
      meleedef: {min: 10, max: 20},
    },
    preset: ["mainstat", "vit", "meleedef"],
  },

  {
    id: "P2_Unique_Shield_002",
    ids: ["ptr_IvoryTower"],
    name: "Ivory Tower",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_ivorytower", name: "Fires of Heaven on Block", format: "Blocks release forward a Fires of Heaven.", args: 0},
    },
    affixes: {
      meleedef: {min: 10, max: 20},
    },
    preset: ["mainstat", "vit"],
  },

  {
    id: "Unique_Shield_009_x1",
    name: "Stormshield",
    type: "shield",
    quality: "legendary",
    affixes: {
      meleedef: {min: 25, max: 30},
    },
    required: {
      baseblock: {min: 19, max: 24},
    },
    preset: ["mainstat", "meleedef"],
  },

  {
    id: "Unique_Shield_011_x1",
    name: "Wall of Man",
    type: "shield",
    quality: "legendary",
    required: {
      custom: {id: "leg_wallofman", name: "Chance to Gain Shield of Bones", format: "%d%% chance to be protected by a shield of bones when you are hit.", min: 20, max: 30},
    },
  },

  {
    id: "Unique_Shield_012_x1",
    name: "Hallowed Barricade",
    type: "shield",
    quality: "set",
    set: "hallowed",
    affixes: {
      dmghol: "elementalDamage",
    },
    preset: ["dmghol"],
  },

  // CRUSADER SHIELD

  {
    id: "Unique_CruShield_104_x1",
    name: "Akarat's Awakening",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_akaratsawakening", name: "Chance to Reduce Cooldowns on Block", format: "Every successful block has a %d%% chance to reduce all cooldowns by 1 second.", min: 20, max: 25},
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_CruShield_103_x1",
    name: "Hallowed Bulwark",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_hallowedbulwark", name: "Iron Skin Bonus Block Amount", format: "Iron Skin also increases your Block Amount by %d%%.", min: 45, max: 60},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CruShield_105_x1",
    name: "Hellskull",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_hellskull", name: "Two-Handed Damage Increase", format: "Gain 10%% increased damage while wielding a two-handed weapon.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CruShield_102_x1",
    name: "Jekangbord",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_jekangbord", name: "Extra Blessed Shield Ricochets", format: "Blessed Shield ricochets to %d additional enemies.", min: 4, max: 6},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CruShield_106_x1",
    name: "Sublime Conviction",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_sublimeconviction", name: "Chance to Stun on Block", format: "When you block, you have up to a %d%% chance to Stun the attacker for 1.5 seconds based on your current Wrath.", min: 15, max: 20},
    },
    preset: ["mainstat", "block"],
  },

  {
    id: "Unique_CruShield_107_x1",
    name: "The Final Witness",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_thefinalwitness", name: "Shield Glare Hits All Enemies", format: "Shield Glare now hits all enemies around you.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P1_CruShield_norm_unique_01",
    name: "Frydehr's Wrath",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_frydehrswrath", name: "Remove Condemn Cooldown", format: "Condemn has no cooldown but instead costs 40 Wrath.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P1_CruShield_norm_unique_02",
    name: "Unrelenting Phalanx",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_unrelentingphalanx", name: "Phalanx now casts twice", format: "Phalanx now casts twice.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CruShield_101_x1",
    name: "Piro Marella",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_piromarella", name: "Shield Bash Cost Reduction", format: "Reduces the Wrath cost of Shield Bash by %d%%.", min: 40, max: 50},
    },
  },

  // MOJO

  {
    id: "Unique_Mojo_003_x1",
    name: "Gazing Demise",
    type: "mojo",
    quality: "legendary",
    preset: ["mainstat", "regen", "manaregen"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Mojo_004_x1",
    name: "Homunculus",
    suffix: _L("Legacy"),
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_homunculus", name: "Zombie Dog Spawn Interval", format: "A Zombie Dog is automatically summoned to your side every %d seconds.", min: 4, max: 6},
    },
    preset: ["mainstat", "maxmana"],
  },

  {
    id: "Unique_Mojo_004_p2",
    name: "Homunculus",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_homunculus_p2", name: "Zombie Dog Spawn Interval", format: "A Zombie Dog is automatically summoned to your side every 2 seconds.", args: 0},
      skill_witchdoctor_sacrifice: {min: 20, max: 25, noblock: true},
    },
    preset: ["mainstat", "chc", "maxmana"],
    primary: 6,
  },

  {
    id: "Unique_Mojo_102_x1",
    name: "Shukrani's Triumph",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_shukranistriumph", name: "Endless Spirit Walk", format: "Spirit Walk lasts until you attack or until an enemy is within 30 yards of you.", args: 0},
    },
    preset: ["mainstat", "chc", "manaregen"],
  },

  {
    id: "Unique_Mojo_009_x1",
    name: "Thing of the Deep",
    type: "mojo",
    quality: "legendary",
    required: {
      pickup: {min: 20, max: 20},
    },
    preset: ["mainstat", "chc", "manaregen", "maxmana"],
  },

  {
    id: "Unique_Mojo_008_x1",
    name: "Ukhapian Serpent",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_ukhapianserpent", name: "Redirect Damage to Zombie Dogs", format: "%d%% of the damage you take is redirected to your Zombie Dogs.", min: 25, max: 30},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Mojo_002_x1",
    name: "Spite",
    type: "mojo",
    quality: "legendary",
    preset: ["maxmana", "chc"],
  },

  {
    id: "Unique_Mojo_010_x1",
    name: "Manajuma's Gory Fetch",
    type: "mojo",
    quality: "set",
    set: "manajuma",
    preset: ["mainstat", "manaregen"],
  },

  {
    id: "Unique_Mojo_011_x1",
    name: "Zunimassa's String of Skulls",
    type: "mojo",
    quality: "set",
    set: "zunimassa",
    affixes: {
      skill_witchdoctor_fetisharmy: {min: 20, max: 25},
    },
    preset: ["mainstat", "chc", "manaregen", "skill_witchdoctor_fetisharmy"],
    primary: 6,
    secondary: 1,
  },

  // SOURCE

  {
    id: "Unique_Orb_005_x1",
    name: "Winter Flurry",
    type: "source",
    quality: "legendary",
    affixes: {
      dmgcol: "elementalDamage",
    },
    required: {
      custom: {id: "leg_winterflurry", name: "Frost Nova on Kill", format: "Enemies killed by Cold damage have a %d%% chance to release a Frost Nova.", min: 15, max: 20},
    },
    preset: ["mainstat", "dmgcol"],
  },

  {
    id: "Unique_Orb_103_x1",
    name: "Light of Grace",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_lightofgrace", name: "Ray of Frost now pierces", format: "Ray of Frost now pierces.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Orb_101_x1",
    name: "Mirrorball",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_mirrorball", name: "Extra Magic Missiles", format: "Magic Missile fires %d extra missiles.", min: 1, max: 2},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Orb_102_x1",
    name: "Myken's Ball of Hate",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_mykensballofhate", name: "Electrocute Can Chain Back", format: "Electrocute can chain to enemies that have already been hit.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Orb_001_x1",
    name: "The Oculus",
    type: "source",
    quality: "legendary",
    required: {
      skill_wizard_teleport_cooldown: {min: 1, max: 4},
      custom: {id: "leg_theoculus", name: "Chance to Reset Teleport Cooldown", format: "Taking damage has up to a %d%% chance to reset the cooldown on Teleport.", min: 15, max: 20},
    },
    preset: ["mainstat", "apoc"],
  },

  {
    id: "Unique_Orb_003_x1",
    name: "Triumvirate",
    suffix: _L("Legacy"),
    type: "source",
    quality: "legendary",
    required: {
      dmgfir: {min: 7, max: 10, noblock: true},
      dmglit: {min: 7, max: 10, noblock: true},
      dmgarc: {min: 7, max: 10, noblock: true},
    },
    preset: ["mainstat", "chc", "maxap"],
    primary: 7,
  },

  {
    id: "P2_Unique_Orb_003",
    ids: ["ptr_Triumvirate"],
    name: "Triumvirate",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_triumvirate", name: "Arcane Orb Damage Increase", format: "Your Signature Spells increase the damage of Arcane Orb by %d%% for 6 seconds, stacking up to 3 times.", min: 75, max: 100},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Orb_004_x1",
    name: "Cosmic Strand",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_cosmicstrand", name: "Teleport Gains Wormhole", format: "Teleport gains the effect of the Wormhole rune.", args: 0},
    },
  },

  {
    id: "Unique_Orb_011_x1",
    name: "Chantodo's Force",
    type: "source",
    quality: "set",
    set: "chantodo",
    preset: ["mainstat", "chc", "apoc", "maxap"],
  },

  {
    id: "Unique_Orb_012_x1",
    name: "Tal Rasha's Unwavering Glare",
    type: "source",
    quality: "set",
    set: "talrasha",
    affixes: {
      skill_wizard_meteor: {min: 20, max: 25},
    },
    preset: ["mainstat", "chc", "skill_wizard_meteor"],
    primary: 6,
    secondary: 1,
  },

  {
    id: "Unique_Orb_Set_06_x1",
    name: "Firebird's Eye",
    type: "source",
    quality: "set",
    set: "firebird",
    affixes: {
      dmgfir: "elementalDamage",
    },
    preset: ["mainstat", "dmgfir"],
  },

  // QUIVER

  {
    id: "Unique_Quiver_006_x1",
    name: "Fletcher's Pride",
    type: "quiver",
    quality: "legendary",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Quiver_002_x1",
    name: "Sin Seekers",
    type: "quiver",
    quality: "legendary",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Quiver_004_x1",
    name: "Holy Point Shot",
    type: "quiver",
    quality: "legendary",
    affixes: {
      elemental: "elementalDamage",
    },
    preset: ["mainstat", "elemental"],
  },

  {
    id: "Unique_Quiver_005_x1",
    name: "Silver Star Piercers",
    suffix: _L("Legacy"),
    type: "quiver",
    quality: "legendary",
    preset: ["mainstat", "bleed"],
  },

  {
    id: "Unique_Quiver_005_p1",
    name: "Spines of Seething Hatred",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_spinesofseethinghatred", name: "Chakram Generates Hatred", format: "Chakram now generates %d Hatred.", min: 3, max: 4},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Quiver_102_x1",
    name: "Bombadier's Rucksack",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_bombadiersrucksack", name: "Extra Sentries", format: "You may have 2 additional Sentries.", args: 0},
    },
    preset: ["dex", "chc"],
  },

  {
    id: "Unique_Quiver_103_x1",
    name: "Emimei's Duffel",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_emimeisduffel", name: "Bolas now explode instantly", format: "Bolas now explode instantly.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Quiver_101_x1",
    name: "The Ninth Cirri Satchel",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_theninthcirrisatchel", name: "Hungering Arrow Pierces", format: "Hungering Arrow has %d%% additional chance to pierce.", min: 20, max: 25},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Quiver_001_p1",
    name: "Meticulous Bolts",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_meticulousbolts", name: "Ball Lightning Speed", format: "Elemental Arrow - Ball Lightning now travels at %d%% speed.", min: 30, max: 40},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Quiver_007_x1",
    name: "Dead Man's Legacy",
    suffix: _L("Legacy"),
    type: "quiver",
    quality: "legendary",
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Quiver_007",
    ids: ["ptr_DeadMansLegacy"],
    name: "Dead Man's Legacy",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_deadmanslegacy", name: "Double Multishot Threshold", format: "Multishot hits enemies below %d%% health twice.", min: 50, max: 60},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Quiver_003_x1",
    name: "Archfiend Arrows",
    type: "quiver",
    quality: "legendary",
    preset: ["chc", "edmg"],
  },

]);

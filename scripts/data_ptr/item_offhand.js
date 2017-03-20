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
    primary: 5,
    secondary: 1,
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
    primary: 5,
    secondary: 1,
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
      custom: {id: "leg_freezeofdeflection", name: "Chance to Freeze on Block", format: "Blocking an attack has a chance to Freeze the attacker for %.1f seconds.", min: 0.5, max: 1.5, step: 0.1},
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
    affixes: {
      skill_crusader_blessedshield: {min: 150, max: 200},
    },
    required: {
      custom: {id: "leg_jekangbord", name: "Extra Blessed Shield Ricochets", format: "Blessed Shield ricochets to %d additional enemies.", min: 4, max: 6},
    },
    preset: ["mainstat", "skill_crusader_blessedshield"],
    primary: 5,
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
    affixes: {
      skill_crusader_condemn: {min: 150, max: 200},
    },
    required: {
      custom: {id: "leg_frydehrswrath", name: "Remove Condemn Cooldown", format: "Condemn has no cooldown but instead costs 40 Wrath.", args: 0},
    },
    preset: ["mainstat", "skill_crusader_condemn"],
    primary: 5,
  },

  {
    id: "P1_CruShield_norm_unique_02",
    name: "Unrelenting Phalanx",
    type: "crusadershield",
    quality: "legendary",
    affixes: {
      skill_crusader_phalanx: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_unrelentingphalanx", name: "Phalanx now casts twice", format: "Phalanx now casts twice.", args: 0},
    },
    preset: ["mainstat", "skill_crusader_phalanx"],
    primary: 5,
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
    suffix: _L("Legacy"),
    type: "mojo",
    quality: "legendary",
    preset: ["mainstat", "regen", "manaregen"],
    primary: 6,
    secondary: 1,
  },

  {
    id: "Unique_Mojo_004_x1",
    name: "Homunculus",
    suffix: _L("Legacy"),
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_homunculus", name: "Zombie Dog Spawn Interval", format: "A Zombie Dog is automatically summoned to your side every %d seconds.", min: 4, max: 6, best: "min"},
    },
    preset: ["mainstat", "maxmana"],
  },

  {
    id: "Unique_Mojo_004_p2",
    name: "Homunculus",
    suffix: _L("Legacy"),
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_homunculus_p2", name: "Spawn Zombie Dogs", format: "A Zombie Dog is automatically summoned to your side every 2 seconds.", args: 0},
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
    suffix: _L("Legacy"),
    type: "mojo",
    quality: "legendary",
    required: {
      pickup: {min: 20, max: 20},
    },
    preset: ["mainstat", "chc", "manaregen", "maxmana"],
  },

  {
    id: "Unique_Mojo_008_x1",
    name: "Uhkapian Serpent",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_uhhapianserpent", name: "Redirect Damage to Zombie Dogs", format: "%d%% of the damage you take is redirected to your Zombie Dogs.", min: 25, max: 30},
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
    preset: ["mainstat", "chc"],
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
    preset: ["mainstat", "vit", "chc", "skill_witchdoctor_fetisharmy"],
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
    suffix: _L("Legacy"),
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
      skill_wizard_meteor: {min: 20, max: 25}, // enchantable to support legacy items
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
    suffix: _L("Legacy"),
    type: "quiver",
    quality: "legendary",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Quiver_002_x1",
    name: "Sin Seekers",
    suffix: _L("Legacy"),
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
    name: "Bombardier's Rucksack",
    type: "quiver",
    quality: "legendary",
    affixes: {
      skill_demonhunter_sentry: {min: 75, max: 100},
    },
    required: {
      custom: {id: "leg_bombadiersrucksack", name: "Extra Sentries", format: "You may have 2 additional Sentries.", args: 0},
    },
    preset: ["dex", "chc", "skill_demonhunter_sentry"],
    primary: 6,
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
    suffix: _L("Legacy"),
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_meticulousbolts", name: "Ball Lightning Speed", format: "Elemental Arrow - Ball Lightning now travels at %d%% speed.", min: 30, max: 40, best: "min"},
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
    affixes: {
      skill_demonhunter_multishot: {min: 75, max: 100},
    },
    required: {
      custom: {id: "leg_deadmanslegacy", name: "Double Multishot Threshold", format: "Multishot hits enemies below %d%% health twice.", min: 50, max: 60},
    },
    preset: ["mainstat", "chc", "skill_demonhunter_multishot"],
    primary: 6,
  },

  {
    id: "Unique_Quiver_003_x1",
    name: "Archfiend Arrows",
    type: "quiver",
    quality: "legendary",
    preset: ["chc", "edmg"],
  },

  {
    id: "P2_mojo_norm_unique_02",
    local: true,
    name: "Henri’s Perquisition",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_henrisperquisition", name: "Damage Reduction", format: "The first time an enemy deals damage to you, reduce that damage by %d%% and Charm the enemy for 3 seconds.", min: 60, max: 80},
      dura: "one",
    },
    preset: ["chc", "mainstat"],
    secondary: 3,
  },

  {
    id: "Unique_Shield_103_x1",
    local: true,
    name: "Guard of Johanna",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_guardofjohanna", name: "Increased Blessed Hammer Damage", format: "Blessed Hammer damage is increased by %d%% for the first 3 enemies it hits.", min: 200, max: 250},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Mojo_001",
    name: "Vile Hive",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_vilehive", name: "Locust Swarm Damage Bonus", format: "Locust Swarm gains the effect of the Pestilence rune and deals %d%% increased damage.", min: 45, max: 60},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Mojo_002",
    name: "Thing of the Deep",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_thingofthedeep", name: "Pickup Radius", format: "Increases Gold and Health Pickup by 20 yards.", args: 0},
    },
    preset: ["mainstat", "chc", "maxmana"],
  },

  {
    id: "P4_Unique_Mojo_003",
    name: "Wilken's Reach",
    type: "mojo",
    quality: "legendary",
    affixes: {
      skill_witchdoctor_graspofthedead: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_wilkensreach", name: "Grasp of the Dead Has no Cooldown", format: "Grasp of the Dead no longer has a cooldown.", args: 0},
    },
    preset: ["mainstat", "chc", "maxmana", "skill_witchdoctor_graspofthedead"],
    primary: 6,
  },

  {
    id: "P4_Unique_Orb_001",
    name: "Primordial Soul",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_primordialsoul", name: "Elemental Exposure Upgrade", format: "Elemental Exposure's damage bonus per stack is increased to 10%%.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Orb_002",
    name: "Etched Sigil",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_etchedsigil", name: "Channeling Skills Cast Other Skills", format: "Your Arcane Torrent, Disintegrate, and Ray of Frost also cast one of your other damaging Arcane Power Spenders every second.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Orb_003",
    name: "Triumvirate",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_triumvirate_p2", name: "Arcane Orb Damage Increase", format: "Your Signature Spells increase the damage of Arcane Orb by %d%% for 6 seconds, stacking up to 3 times.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Quiver_001",
    name: "Sin Seekers",
    type: "quiver",
    quality: "legendary",
    affixes: {
      skill_demonhunter_rapidfire: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_sinseekers", name: "Rapid Fire Has no Channel Cost", format: "Rapid Fire no longer has a channel cost.", args: 0},
    },
    preset: ["mainstat", "chc", "skill_demonhunter_rapidfire"],
    primary: 6,
  },

  {
    id: "P4_Unique_Shield_Set_01_x1",
    name: "Shield of the Steed",
    type: "crusadershield",
    quality: "set",
    set: "norvald",
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Shield_106_x1",
    name: "Shield of Fury",
    type: "crusadershield",
    quality: "legendary",
    required: {
      custom: {id: "leg_shieldoffury", name: "Heaven's Fury Ramp Up", format: "Each time an enemy takes damage from your Heaven's Fury, it increases the damage they take from your Heaven's Fury by %d%%.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Orb_004",
    name: "Orb of Infinite Depth",
    type: "source",
    quality: "legendary",
    required: {
      custom: {id: "leg_orbofinfinitedepth", name: "Damage Bonus", format: "Each time you hit an enemy with Explosive Blast your damage is increased by %d%% and your damage reduction is increased by 15%% for 6 seconds. This effect can stack up to 4 times.", min: 4, max: 5},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P41_Unique_Quiver_001",
    name: "Augustine's Panacea",
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_augustinespanacea", name: "Elemental Arrow Bonuses", format: "Elemental Arrow gains an effect based on the rune:\r\n   Ball Lightning now travels at 30%% speed.\r\n   Frost Arrow damage and Chilled duration increased by %{0}d%%.\r\n   Immolation Arrow ground damage over time increased by %{0}d%%.\r\n   Lightning Bolts damage and Stun duration increased by %{0}d%%.\r\n   Nether Tentacles damage and healing amount increased by %{0}d%%.", min: 200, max: 250},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P42_Unique_Mojo_003_x1",
    name: "Gazing Demise",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_gazingdemise", name: "Spirit Barrage Phantasm Bonus", format: "Spirit Barrage gains the Phantasm rune. Each active Phantasm increases the damage of Spirit Barrage by %d%%.", min: 40, max: 50},
    },
    preset: ["mainstat", "regen", "manaregen"],
    primary: 6,
  },

  {
    id: "P42_Unique_Mojo_004",
    name: "Homunculus",
    type: "mojo",
    quality: "legendary",
    required: {
      custom: {id: "leg_homunculus_p3", name: "Spawn Zombie Dogs", format: "A Zombie Dog is automatically summoned to your side every 2 seconds.", args: 0},
      skill_witchdoctor_sacrifice: {min: 50, max: 60, noblock: true},
    },
    preset: ["mainstat", "chc", "maxmana"],
    primary: 6,
  },

  /*{
    id: "P42_Unique_Quiver_006_x1",
    name: "Fletcher's Pride",
    suffix: _L("PTR"),
    type: "quiver",
    quality: "legendary",
    required: {
      custom: {id: "leg_fletcherspride", name: "Spike Trap Bonuses", format: "Spike Traps gain the Impaling Spines rune and are deployed twice as fast.", args: 0},
    },
    preset: ["mainstat", "rcr"],
  },*/

]);

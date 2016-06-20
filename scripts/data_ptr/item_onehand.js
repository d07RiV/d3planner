DiabloCalc.addItems([

  // AXE

  {
    id: "Unique_Axe_1H_003_x1",
    name: "Genzaniku",
    type: "axe",
    quality: "legendary",
    required: {
      custom: {id: "leg_genzaniku", name: "Summon Fallen Champion", format: "Chance to summon a ghostly Fallen Champion when attacking.", args: 0},
    },
  },

  {
    id: "Unique_Axe_1H_001_x1",
    name: "Flesh Tearer",
    type: "axe",
    quality: "legendary",
    preset: ["wpnphy", "bleed"],
  },

  {
    id: "Unique_Axe_1H_103_x1",
    name: "Hack",
    type: "axe",
    quality: "legendary",
    required: {
      custom: {id: "leg_hack", name: "Apply Thorns on Hit", format: "%d%% of your Thorns damage is applied on every attack.", min: 75, max: 100},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Axe_1H_006_x1",
    name: "The Butcher's Sickle",
    type: "axe",
    quality: "legendary",
    required: {
      custom: {id: "leg_thebutcherssickle", name: "Chance to Drag Enemies", format: "%d%% chance to drag enemies to you when attacking.", min: 20, max: 25},
    },
  },

  {
    id: "Unique_Axe_1H_007_x1",
    name: "The Burning Axe of Sankis",
    type: "axe",
    quality: "legendary",
    affixes: {
      dmgfir: "elementalDamage",
    },
    required: {
      custom: {id: "leg_theburningaxeofsankis", name: "Chance to Ignore Pain", format: "Chance to fight through the pain when enemies hit you.", args: 0},
    },
    preset: ["wpnfir", "dmgfir"],
  },

  {
    id: "Unique_Axe_1H_004_x1",
    name: "Utar's Roar",
    type: "axe",
    quality: "legendary",
    affixes: {
      dmgcol: "elementalDamage",
    },
    preset: ["wpncol", "dmgcol"],
  },

  {
    id: "Unique_Axe_1H_013_x1",
    name: "Hallowed Breach",
    type: "axe",
    quality: "set",
    set: "hallowed",
    preset: ["wpnhol"],
  },

  // DAGGER

  {
    id: "Unique_Dagger_003_x1",
    name: "The Barber",
    type: "dagger",
    quality: "legendary",
    affixes: {
      chd: {min: 31, max: 35},
    },
    preset: ["mainstat", "damage", "chd"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Dagger_007_x1",
    name: "Pig Sticker",
    type: "dagger",
    quality: "legendary",
    required: {
      damage_beasts: {min: 15, max: 30},
      damage_humans: {min: 15, max: 30},
      custom: {id: "leg_pigsticker", name: "Squeal!", format: "Squeal!", args: 0},
    },
    preset: ["mainstat"],
    primary: 5,
    secondary: 3,
  },

  {
    id: "Unique_Dagger_002_x1",
    name: "Kill",
    type: "dagger",
    quality: "legendary",
    preset: ["wpnpsn", "weaponias"],
  },

  {
    id: "Unique_Dagger_010_x1_210",
    name: "Wizardspike",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_wizardspike", name: "Chance to Hurl Frozen Orb", format: "Performing an attack has a %d%% chance to hurl a Frozen Orb.", min: 20, max: 25},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Dagger_006_x1",
    name: "Blood-Magic Edge",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_bloodmagicedge", name: "Blood oozes from you", format: "Blood oozes from you.", args: 0},
    },
    preset: ["wpnphy", "weaponias"],
  },

  // MACE

  {
    id: "Unique_Mace_1H_002_x1",
    name: "Odyn Son",
    type: "mace",
    quality: "legendary",
    affixes: {
      dmglit: "elementalDamage",
    },
    required: {
      custom: {id: "leg_odynson", name: "Chance to Cast Chain Lightning", format: "%d%% chance to Chain Lightning enemies when you hit them.", min: 20, max: 40},
    },
    preset: ["wpnlit", "dmglit"],
  },

  {
    id: "Unique_Mace_1H_005_x1",
    name: "Nutcracker",
    type: "mace",
    quality: "legendary",
    affixes: {
      hitstun: {min: 5, max: 10, step: 0.1},
      chd: {min: 31, max: 35},
    },
    preset: ["wpnphy"],
  },

  {
    id: "Unique_Mace_1H_007_x1",
    name: "Telranden's Hand",
    type: "mace",
    quality: "legendary",
    preset: ["wpnarc", "mainstat", "weaponias"],
  },

  {
    id: "Unique_Mace_1H_103_x1",
    name: "Jace's Hammer of Vigilance",
    type: "mace",
    quality: "legendary",
    affixes: {
      skill_crusader_blessedhammer: {min: 15, max: 20},
    },
    required: {
      custom: {id: "leg_jaceshammerofvigilance", name: "Increases Blessed Hammers Size", format: "Increase the size of your Blessed Hammers.", args: 0},
    },
    preset: ["wpnhol", "mainstat", "skill_crusader_blessedhammer"],
    primary: 5,
  },

  {
    id: "Unique_Mace_1H_102_x1",
    name: "Solanium",
    type: "mace",
    quality: "legendary",
    required: {
      custom: {id: "leg_solanium", name: "Chance to Spawn Globe on Criticals", format: "Critical Hits have a %d%% chance to spawn a health globe.", min: 3, max: 4},
    },
    preset: ["wpnhol", "sockets"],
  },

  {
    id: "Unique_Mace_1H_008_x1",
    name: "Nailbiter",
    type: "mace",
    quality: "legendary",
    affixes: {
      thorns: "thornsLarge",
    },
    preset: ["wpnphy", "damage", "thorns"],
  },

  {
    id: "Unique_Mace_1H_003_x1",
    name: "Neanderthal",
    type: "mace",
    quality: "legendary",
    affixes: {
      thorns: "thornsLarge",
    },
    preset: ["wpnphy", "mainstat", "expadd", "thorns"],
  },

  {
    id: "Unique_Mace_1H_001_x1",
    name: "Echoing Fury",
    type: "mace",
    quality: "legendary",
    required: {
      hitfear: {min: 10, max: 20, step: 0.1, noblock: true},
    },
    preset: ["wpnphy", "mainstat", "weaponias", "damage"],
  },

  {
    id: "Unique_Mace_1H_011_x1",
    name: "Sun Keeper",
    type: "mace",
    quality: "legendary",
    affixes: {
      gf: "gfLarge",
    },
    required: {
      edmg: {min: 15, max: 30},
    },
    preset: ["wpnhol", "mainstat", "gf"],
  },

  {
    id: "Unique_Mace_1H_009_x1",
    name: "Devastator",
    type: "mace",
    quality: "legendary",
    affixes: {
      dmgfir: "elementalDamage",
    },
    preset: ["wpnfir", "dmgfir"],
  },

  // SPEAR

  {
    id: "Unique_Spear_004_x1",
    name: "Scrimshaw",
    suffix: _L("Legacy"),
    type: "spear",
    quality: "legendary",
    preset: ["wpnlit", "mainstat", "damage"],
  },

  {
    id: "Unique_Spear_001_x1",
    name: "Arreat's Law",
    suffix: _L("Legacy"),
    type: "spear",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "sockets"],
  },

  {
    id: "Unique_Spear_002_x1",
    name: "The Three Hundredth Spear",
    suffix: _L("Legacy"),
    type: "spear",
    quality: "legendary",
    required: {
      skill_barbarian_weaponthrow: {min: 35, max: 50},
      skill_barbarian_ancientspear: {min: 35, max: 50},
    },
    preset: ["mainstat"],
    primary: 6,
    secondary: 0,
  },

  {
    id: "Unique_Spear_003_x1",
    name: "Empyrean Messenger",
    type: "spear",
    quality: "legendary",
    preset: ["wpnhol", "mainstat", "edmg"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Spear_101_x1",
    name: "Akanesh, the Herald of Righteousness",
    type: "spear",
    quality: "legendary",
    affixes: {
      dmghol: {min: 15, max: 25},
    },
    preset: ["wpnhol", "mainstat", "dmghol"],
    primary: 5,
    secondary: 1,
  },

  // SWORD

  {
    id: "Unique_Sword_1H_017_x1",
    name: "Monster Hunter",
    type: "sword",
    quality: "legendary",
    required: {
      damage_beasts: {min: 9, max: 15},
    },
    preset: ["wpnfir"],
  },

  {
    id: "Unique_Sword_1H_002_x1",
    name: "Wildwood",
    type: "sword",
    quality: "legendary",
    preset: ["wpnpsn", "mainstat", "damage", "expadd"],
  },

  {
    id: "Unique_Sword_1H_014_x1",
    name: "Doombringer",
    type: "sword",
    quality: "legendary",
    affixes: {
      dmgphy: "elementalDamage",
      life: "lifeMedium",
    },
    preset: ["mainstat", "dmgphy"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Sword_1H_003_x1",
    name: "The Ancient Bonesaber of Zumakalis",
    type: "sword",
    quality: "legendary",
    preset: ["wpnarc", "mainstat", "weaponias"],
  },

  {
    id: "Unique_Sword_1H_102_x1",
    name: "Exarian",
    type: "sword",
    quality: "legendary",
    affixes: {
      chd: {min: 31, max: 35},
    },
    preset: ["chd"],
  },

  {
    id: "Unique_Sword_1H_104_x1",
    name: "Fulminator",
    suffix: _L("Legacy"),
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_fulminator", name: "Lightning Rod Damage", format: "Lightning damage has a chance to turn enemies into lightning rods, causing them to pulse %d%% weapon damage as Lightning every second to nearby enemies for 6 seconds.", min: 167, max: 222},
    },
    preset: ["wpnlit", "weaponias"],
  },

  {
    id: "Unique_Sword_1H_103_x1",
    name: "Gift of Silaria",
    type: "sword",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
    },
    preset: ["mainstat", "ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Sword_1H_109_x1",
    name: "Rimeheart",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_rimeheart", name: "Chance to Deal a Lot of Damage", format: "10%% chance on hit to instantly deal 10000%% weapon damage as Cold to enemies that are Frozen.", args: 0},
    },
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_Sword_1H_101_x1",
    name: "Thunderfury, Blessed Blade of the Windseeker",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_thunderfury", name: "Did someone say [Thunderfury, Blessed Blade of the Windseeker]?", format: "Chance on hit to blast your enemy with Lightning, dealing %d%% weapon damage as Lightning and then jumping to additional nearby enemies. Each enemy hit has their attack speed and movement speed reduced by 30%% for 3 seconds. Jumps up to 5 targets.", min: 279, max: 372},
      //custom: {id: "leg_thunderfury", name: "Lightning Effect Damage", format: "Chance on hit to blast your enemy with Lightning, dealing %d%% weapon damage as Lightning and then jumping to additional nearby enemies. Each enemy hit has their attack speed and movement speed reduced by 30%% for 3 seconds. Jumps up to 5 targets.", min: 279, max: 372},
    },
    preset: ["wpnlit", "mainstat", "sockets"],
  },

  {
    id: "Unique_Sword_1H_007_x1",
    name: "Sever",
    type: "sword",
    quality: "legendary",
    required: {
      damage_demons: {min: 5, max: 10},
      custom: {id: "leg_sever", name: "Slain enemies rest in pieces", format: "Slain enemies rest in pieces.", args: 0},
    },
    preset: ["wpnphy", "mainstat", "damage"],
  },

  {
    id: "Unique_Sword_1H_004_x1",
    name: "Skycutter",
    type: "sword",
    quality: "legendary",
    affixes: {
      dmghol: "elementalDamage",
    },
    required: {
      custom: {id: "leg_skycutter", name: "Chance to Summon Angels", format: "Chance to summon angelic assistance when attacking.", args: 0},
    },
    preset: ["wpnhol", "mainstat", "dmghol"],
  },

  {
    id: "Unique_Sword_1H_012_x1",
    name: "Azurewrath",
    suffix: _L("Legacy"),
    type: "sword",
    quality: "legendary",
    affixes: {
      dmgcol: "elementalDamage",
    },
    required: {
      hitfreeze: {min: 20, max: 25, step: 0.1},
      custom: {id: "leg_azurewrath", name: "Aura Damage vs Undead", format: "Undead enemies within 25 yards take %d%% weapon damage as Holy every second and are sometimes knocked back.", min: 30, max: 40},
    },
    preset: ["wpncol", "dmgcol"],
  },

  {
    id: "Unique_Sword_1H_011_x1",
    name: "Devil Tongue",
    type: "sword",
    quality: "legendary",
    required: {
      gf: "gfLarge",
    },
    preset: ["wpnfir", "mainstat", "damage"],
  },

  {
    id: "Unique_Sword_1H_Promo_02_x1",
    name: "Shard of Hate",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_shardofhate", name: "Effect Damage", format: "Elemental skills have a chance to trigger a powerful attack that deals %d%% weapon damage:\r\n   Cold skills trigger Freezing Skull\r\n   Poison skills trigger Poison Nova\r\n   Lightning skills trigger Charged Bolt", min: 200, max: 250},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Sword_1H_019_x1",
    name: "Griswold's Perfection",
    type: "sword",
    quality: "legendary",
    preset: ["wpnfir"],
  },

  {
    id: "Unique_Sword_1H_Set_03_x1",
    name: "Little Rogue",
    type: "sword",
    quality: "set",
    set: "istvan",
    preset: ["mainstat"],
  },

  {
    id: "Unique_Sword_1H_Set_02_x1",
    name: "The Slanderer",
    type: "sword",
    quality: "set",
    set: "istvan",
    preset: ["mainstat"],
  },

  {
    id: "Unique_Sword_1H_018_x1",
    name: "Born's Furious Wrath",
    type: "sword",
    quality: "set",
    set: "born",
    preset: ["wpnhol"],
  },

  // CEREMONIAL KNIFE

  {
    id: "Unique_CeremonialDagger_003_x1",
    name: "Deadly Rebirth",
    type: "ceremonialknife",
    quality: "legendary",
    affixes: {
      skill_witchdoctor_graspofthedead: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_deadlyrebirth", name: "Grasp of the Dead Gains Rain of Corpses", format: "Grasp of the Dead gains the effect of the Rain of Corpses rune.", args: 0},
    },
    preset: ["wpnarc", "mainstat", "skill_witchdoctor_graspofthedead"],
    primary: 5,
  },

  {
    id: "Unique_CeremonialDagger_102_x1",
    name: "Rhen'ho Flayer",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_rhenhoflayer", name: "Plague of Toads Tracks Enemies", format: "Plague of Toads now seek out enemies and can explode twice.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P1_CeremonialDagger_norm_unique_01",
    name: "Sacred Harvester",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_sacredharvester", name: "Extra Soul Harvest Stacks", format: "Soul Harvest now stacks up to 10 times.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P1_CeremonialDagger_norm_unique_02",
    name: "The Dagger of Darts",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_thedaggerofdarts", name: "Poison Darts Pierce", format: "Your Poison Darts and your Fetishes' Poison Darts now pierce.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CeremonialDagger_008_x1",
    name: "Last Breath",
    suffix: _L("Legacy"),
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      skill_witchdoctor_massconfusion_cooldown: {min: 15, max: 20},
    },
    preset: ["mainstat"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_CeremonialDagger_004_x1",
    name: "The Spider Queen's Grasp",
    type: "ceremonialknife",
    quality: "legendary",
    affixes: {
      skill_witchdoctor_corpsespiders: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_thespiderqueensgrasp", name: "Corpse Spiders Slow Enemies", format: "Corpse Spiders releases a web on impact that Slows enemies by %d%%.", min: 60, max: 80},
    },
    preset: ["mainstat", "skill_witchdoctor_corpsespiders"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_CeremonialDagger_101_x1",
    name: "Starmetal Kukri",
    type: "ceremonialknife",
    quality: "legendary",
    affixes: {
      chd: {min: 31, max: 35},
    },
    required: {
      custom: {id: "leg_starmetalkukri", name: "Fetishes Reduce Cooldowns on Hit", format: "Reduce the cooldown of Fetish Army and Big Bad Voodoo by 1 second each time your fetishes deal damage.", args: 0},
    },
    preset: ["mainstat", "chd"],
  },

  {
    id: "Unique_CeremonialDagger_001_x1",
    name: "Anessazi Edge",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_anessaziedge", name: "Zombie Dogs Stun When Summoned", format: "Zombie Dogs stuns enemies around them for 1.5 seconds when summoned.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CeremonialDagger_002_x1",
    name: "The Gidbinn",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_thegidbinn", name: "Chance to Summon a Fetish", format: "Chance to summon a Fetish when attacking.", args: 0},
    },
    preset: ["mainstat", "manaregen"],
  },

  {
    id: "Unique_CeremonialDagger_006_x1",
    name: "Living Umbral Oath",
    type: "ceremonialknife",
    quality: "legendary",
    preset: ["wpnphy"],
  },

  {
    id: "Unique_CeremonialDagger_009_x1",
    name: "Manajuma's Carving Knife",
    type: "ceremonialknife",
    quality: "set",
    set: "manajuma",
    preset: ["wpnpsn", "mainstat"],
  },

  {
    id: "Unique_CeremonialDagger_011_x1",
    name: "Hallowed Sufferance",
    type: "ceremonialknife",
    quality: "set",
    set: "hallowed",
    preset: ["wpnhol"],
  },

  // FIST WEAPON

  {
    id: "Unique_Fist_007_x1",
    name: "Fleshrake",
    suffix: _L("Legacy"),
    type: "fistweapon",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "lifespirit"],
  },

  {
    id: "Unique_Fist_003_x1",
    name: "Rabid Strike",
    type: "fistweapon",
    quality: "legendary",
    affixes: {
      chd: {min: 31, max: 35},
      hitslow: {min: 15, max: 25, step: 0.1},
    },
    preset: ["wpnpsn", "mainstat", "chd", "hitslow"],
  },

  {
    id: "Unique_Fist_013_x1",
    name: "Scarbringer",
    suffix: _L("Legacy"),
    type: "fistweapon",
    quality: "legendary",
    preset: ["wpnhol", "bleed"],
  },

  {
    id: "Unique_Fist_012_x1",
    name: "Sledge Fist",
    type: "fistweapon",
    quality: "legendary",
    required: {
      hitstun: {min: 30, max: 50, step: 0.1, noblock: true},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Fist_101_x1",
    name: "Jawbreaker",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_jawbreaker", name: "Dashing Strike Reset Distance", format: "When Dashing Strike hits an enemy more than %d yards away, its Charge cost is refunded.", min: 31, max: 35, best: "min"},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Fist_005_x1",
    name: "Logan's Claw",
    type: "fistweapon",
    quality: "legendary",
    preset: ["wpnpsn", "mainstat", "lph"],
  },

  {
    id: "Unique_Fist_008_x1",
    name: "Crystal Fist",
    suffix: _L("Legacy"),
    type: "fistweapon",
    quality: "legendary",
    preset: ["wpnhol", "mainstat", "damage", "dura"],
  },

  {
    id: "Unique_Fist_009_x1",
    name: "The Fist of Az'Turrasq",
    suffix: _L("Legacy"),
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_thefistofazturrasq", name: "Exploding Palm Explosion Damage", format: "Exploding Palm's on-death explosion damage is increased by %d%%.", min: 75, max: 100},
    },
    preset: ["spiritregen", "mainstat"],
  },

  {
    id: "Unique_Fist_006_x1",
    name: "Won Khim Lau",
    type: "fistweapon",
    quality: "legendary",
    affixes: {
      dmglit: {min: 15, max: 25},
    },
    preset: ["wpnlit", "mainstat", "dmglit"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "P1_fistWeapon_norm_unique_02",
    name: "Vengeful Wind",
    suffix: _L("Legacy"),
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_vengefulwind", name: "Extra Sweeping Wind Stacks", format: "Increases the maximum stack count of Sweeping Wind by 3.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Fist_004_x1",
    name: "Demon Claw",
    type: "fistweapon",
    quality: "legendary",
    preset: ["wpnfir"],
  },

  {
    id: "Unique_Fist_011_x1",
    name: "Shenlong's Fist of Legend",
    type: "fistweapon",
    quality: "set",
    set: "shenlong",
    preset: ["wpnlit", "mainstat"],
  },

  {
    id: "Unique_Fist_010_x1",
    name: "Shenlong's Relentless Assault",
    type: "fistweapon",
    quality: "set",
    set: "shenlong",
    preset: ["wpnlit", "mainstat"],
  },

  {
    id: "Unique_Fist_015_x1",
    name: "Hallowed Hold",
    type: "fistweapon",
    quality: "set",
    set: "hallowed",
    preset: ["wpnhol"],
  },

  // FLAIL

  {
    id: "Unique_Flail_1H_106_x1",
    name: "Darklight",
    suffix: _L("Legacy"),
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_darklight", name: "Chance to Cast Extra Fist of the Heavens", format: "Fist of the Heavens has a %d%% chance to also be cast at your location.", min: 45, max: 60},
    },
    preset: ["wpnlit", "mainstat"],
  },

  {
    id: "Unique_Flail_1H_105_x1",
    name: "Gyrfalcon's Foote",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_gyrfalconsfoote", name: "Free Blessed Shield", format: "Removes the resource cost of Blessed Shield.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Flail_1H_107_x1",
    name: "Inviolable Faith",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_inviolablefaith", name: "Multiple Consecration Casts", format: "Casting Consecration also casts Consecration beneath all of your allies.", args: 0},
    },
    preset: ["wpnhol", "sockets"],
  },

  {
    id: "Unique_Flail_1H_102_x1",
    name: "Justinian's Mercy",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_justiniansmercy", name: "Blessed Hammer Gains Dominion", format: "Blessed Hammer gains the effect of the Dominion rune.", args: 0},
    },
    preset: ["sockets"],
  },

  {
    id: "Unique_Flail_1H_104_x1",
    name: "Kassar's Retribution",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_kassarsretribution", name: "Increased Speed After Casting Justice", format: "Casting Justice increases your movement speed by %d%% for 2 seconds.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Flail_1H_103_x1",
    name: "Swiftmount",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_swiftmount", name: "Double Steed Charge Duration", format: "Doubles the duration of Steed Charge.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Flail_1H_101_x1",
    name: "Golden Scourge",
    type: "flail",
    quality: "legendary",
    affixes: {
      dmghol: "elementalDamage",
    },
    required: {
      custom: {id: "leg_goldenscourge", name: "Smite Jumps to Additional Enemies", format: "Smite now jumps to 3 additional enemies.", args: 0},
    },
    preset: ["wpnhol", "dmghol"],
  },

  // MIGHTY WEAPON

  {
    id: "Unique_Mighty_1H_006_x1",
    name: "Fjord Cutter",
    suffix: _L("Legacy"),
    type: "mightyweapon",
    quality: "legendary",
    required: {
      hitfreeze: {min: 7.5, max: 10, step: 0.1},
      custom: {id: "leg_fjordcutter", name: "Chance to Gain Chilling Aura", format: "%d%% chance to be surrounded by a Chilling Aura when attacking.", min: 20, max: 30},
    },
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_Mighty_1H_012_x1",
    name: "Ambo's Pride",
    type: "mightyweapon",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "bleed"],
  },

  {
    id: "Unique_Mighty_1H_005_x1",
    name: "Blade of the Warlord",
    suffix: _L("Legacy"),
    type: "mightyweapon",
    quality: "legendary",
    preset: ["wpnhol", "mainstat", "sockets"],
  },

  {
    id: "Unique_Mighty_1H_102_x1",
    name: "Remorseless",
    type: "mightyweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_remorseless", name: "Chance to Summon Ancient", format: "Hammer of the Ancients has a %d%% chance to summon an Ancient for 20 seconds.", min: 25, max: 30},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Mighty_1H_001_x1",
    name: "Night's Reaping",
    type: "mightyweapon",
    quality: "legendary",
    affixes: {
      life: "lifeLarge",
    },
    preset: ["wpncol", "life"],
  },

  {
    id: "Unique_Mighty_1H_010_x1",
    name: "Bul-Kathos's Solemn Vow",
    type: "mightyweapon",
    quality: "set",
    set: "bulkathos",
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "Unique_Mighty_1H_011_x1",
    name: "Bul-Kathos's Warrior Blood",
    type: "mightyweapon",
    quality: "set",
    set: "bulkathos",
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "Unique_Mighty_1H_015_x1",
    name: "Hallowed Nemesis",
    type: "mightyweapon",
    quality: "set",
    set: "hallowed",
    preset: ["wpnhol"],
  },

  {
    id: "Unique_Dagger_104_x1",
    ids: ["ptr_EunJangDo"],
    name: "Eun-jang-do",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_eunjangdo", name: "Freeze Threshold", format: "Attacking enemies below %d%% Life freezes them for 3 seconds.", min: 17, max: 20},
    },
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_Sword_1H_113_x1",
    ids: ["ptr_InGeom"],
    name: "In-geom",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_ingeom", name: "Cooldown Reduction", format: "Your skill cooldowns are reduced by %d seconds for 15 seconds after killing an elite pack.", min: 8, max: 10},
    },
    preset: ["wpnhol", "mainstat", "damage"],
  },

  {
    id: "Unique_Axe_1H_005_104",
    name: "Sky Splitter",
    suffix: _L("Legacy"),
    type: "axe",
    quality: "legendary",
    affixes: {
      regen: "regenLarge",
    },
    required: {
      custom: {id: "leg_skysplitter", name: "Chance to Smite", format: "%d%% chance to smite enemies with lightning when you hit them.", min: 10, max: 20},
    },
    preset: ["wpnhol", "damage", "weaponias", "regen", "mainstat"],
    primary: 5,
  },

  {
    id: "Unique_Axe_1H_005_p2",
    name: "Sky Splitter",
    type: "axe",
    quality: "legendary",
    required: {
      custom: {id: "leg_skysplitter_p2", name: "Chance to Smite", format: "%d%% chance to Smite enemies for 600-750%% weapon damage as Lightning when you hit them.", min: 15, max: 20},
    },
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "Unique_Sword_1H_021_x1",
    ids: ["Unique_Sword_1H_021"],
    name: "Spectrum",
    type: "sword",
    quality: "legendary",
    preset: ["mainstat"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Offhand_001_x1",
    name: "The Horadric Hamburger",
    type: "dagger",
    quality: "legendary",
    preset: ["mainstat"],
  },

  {
    id: "P1_fistWeapon_norm_unique_01",
    local: true,
    name: "Lion’s Claw",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_lionsclaw", name: "Extra Seven-Sided Strike Attacks", format: "Seven-Sided Strike performs an additional 7 strikes.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P1_flail1H_norm_unique_01",
    local: true,
    name: "Johanna's Argument",
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_johannasargument", name: "Blessed Hammer Bonus", format: "Increase the attack speed and damage of Blessed Hammer by 100%%.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "P3_Unique_Mighty_1H_006",
    local: true,
    name: "Fjord Cutter",
    type: "mightyweapon",
    quality: "legendary",
    required: {
      hitfreeze: {min: 7.5, max: 10, step: 0.1},
      custom: {id: "leg_fjordcutter_p3", name: "Chilling Aura", format: "You are surrounded by a Chilling Aura when attacking.", args: 0},
    },
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "P3_Unique_Spear_001",
    local: true,
    name: "Arreat's Law",
    type: "spear",
    quality: "legendary",
    required: {
      custom: {id: "leg_arreatslaw", name: "Weapon Throw Extra Fury", format: "Weapon Throw generates up to %d additional Fury based on how far away the enemy hit is. Maximum benefit when the enemy hit is 20 or more yards away.", min: 15, max: 20},
    },
    preset: ["wpnphy", "mainstat"],
  },

  {
    id: "P3_Unique_Sword_1H_012",
    local: true,
    name: "Azurewrath",
    type: "sword",
    quality: "legendary",
    affixes: {
      dmgcol: "elementalDamage",
    },
    required: {
      hitfreeze: {min: 20, max: 25, step: 0.1},
      custom: {id: "leg_azurewrath_p3", name: "Aura Damage vs Undead", format: "Undead and Demon enemies within 25 yards take %d%% weapon damage as Holy every second and are sometimes knocked into the air.", min: 500, max: 650},
    },
    preset: ["wpncol", "dmgcol"],
  },

  {
    id: "P3_Unique_Sword_1H_104",
    local: true,
    name: "Fulminator",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_fulminator", name: "Lightning Rod Damage", format: "Lightning damage has a chance to turn enemies into lightning rods, causing them to pulse %d%% weapon damage as Lightning every second to nearby enemies for 6 seconds.", min: 444, max: 555},
    },
    preset: ["wpnlit", "mainstat"],
  },

  {
    id: "Unique_Mighty_1H_103_x1",
    local: true,
    name: "Dishonored Legacy",
    type: "mightyweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_dishonoredlegacy", name: "Cleave Extra Damage", format: "Cleave deals up to %d%% increased damage based on percentage of missing Fury.", min: 300, max: 400},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Spear_004_p3",
    local: true,
    name: "Scrimshaw",
    type: "spear",
    quality: "legendary",
    affixes: {
      skill_witchdoctor_zombiecharger: {min: 60, max: 80},
    },
    required: {
      custom: {id: "leg_scrimshaw", name: "Zombie Charger Cost Reduction", format: "Reduces the Mana cost of Zombie Charger by %d%%.", min: 40, max: 50},
    },
    preset: ["wpnphy", "mainstat", "damage", "skill_witchdoctor_zombiecharger"],
    primary: 5,
  },

  {
    id: "P4_Unique_Axe_1H_102",
    local: true,
    name: "Mordullu's Promise",
    type: "axe",
    quality: "legendary",
    required: {
      custom: {id: "leg_mordulluspromise", name: "Firebomb Mana Generation", format: "Firebomb generates %d Mana.", min: 100, max: 125},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_CeremonialDagger_008",
    name: "Last Breath",
    type: "ceremonialknife",
    quality: "legendary",
    required: {
      custom: {id: "leg_lastbreath", name: "Mass Confusion Cooldown", format: "Reduces cooldown of Mass Confusion by %d seconds.", min: 15, max: 20},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Dagger_002",
    name: "Voo's Juicer",
    type: "dagger",
    quality: "legendary",
    affixes: {
      skill_witchdoctor_spiritbarrage: {min: 45, max: 60},
    },
    required: {
      custom: {id: "leg_voosjuicer", name: "Spirit Barrage Gains Extra Runes", format: "Spirit Barrage gains the effects of the Phlebotomize and The Spirit is Willing runes.", args: 0},
    },
    preset: ["mainstat", "wpncol", "skill_witchdoctor_spiritbarrage"],
    primary: 5,
  },

  {
    id: "P4_Unique_Fist_102",
    name: "Kyoshiro's Blade",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_kyoshirosblade", name: "Wave of Light Damage Bonus", format: "Increase the damage of Wave of Light by 150%%. When the initial impact of your Wave of Light hits 3 or fewer enemies, the damage is increased by %d%%.", min: 200, max: 250},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Mighty_1H_005",
    name: "Blade of the Warlord",
    type: "mightyweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_bladeofthewarlord", name: "Bash Damage Bonus", format: "Bash consumes up to 40 Fury to deal up to %d%% increased damage.", min: 400, max: 500},
    },
    preset: ["mainstat", "wpnhol"],
  },

  {
    id: "P4_Unique_Mighty_1H_104",
    name: "Oathkeeper",
    type: "mightyweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_oathkeeper", name: "Primary Skill Damage Bonus", format: "Your primary skills attack 50%% faster and deal %d%% increased damage.", min: 150, max: 200},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Spear_002",
    name: "The Three Hundredth Spear",
    type: "spear",
    quality: "legendary",
    required: {
      custom: {id: "leg_thethreehundredthspear", name: "Thrown Damage Bonus", format: "Increase the damage of Weapon Throw and Ancient Spear by %d%%.", min: 45, max: 60},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Sword_1H_01",
    name: "Sword of Ill Will",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_swordofillwill", name: "Chakram Damage Bonus", format: "Chakram deals %.1f%% increased damage for every point of Hatred you have.", min: 1.0, max: 1.4, step: 0.1},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_fistWeapon_norm_unique_02",
    name: "Vengeful Wind",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_vengefulwind_p2", name: "Extra Sweeping Wind Stacks", format: "Increases the maximum stack count of Sweeping Wind by %d.", min: 6, max: 7},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Dagger_101_x1",
    name: "Karlei's Point",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_karleispoint", name: "Impale Hatred Refund", format: "Impale returns %d Hatred if it hits an enemy already Impaled.", min: 10, max: 15},
    },
    preset: ["mainstat", "wpncol"],
  },

  {
    id: "Unique_Dagger_102_x1",
    name: "Lord Greenstone's Fan",
    suffix: _L("Legacy"),
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_lordgreenstonesfan", name: "Fan of Knives Damage Bonus", format: "Every second, gain %d%% increased damage for your next Fan of Knives. Stacks up to 30 times.", min: 80, max: 100},
    },
    preset: ["mainstat", "wpncol"],
  },

  {
    id: "Unique_Sword_1H_107_x1",
    name: "The Twisted Sword",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_thetwistedsword", name: "Energy Twister Damage Bonus", format: "Energy Twister damage is increased by %d%% for each Energy Twister you have out up to a maximum of 8.", min: 125, max: 150},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Sword_1H_112_x1",
    name: "Deathwish",
    type: "sword",
    quality: "legendary",
    required: {
      custom: {id: "leg_deathwish", name: "Damage Increase While Channeling", format: "While channeling Arcane Torrent, Disintegrate, or Ray of Frost, all damage is increased by %d%%.", min: 30, max: 35},
    },
    preset: ["mainstat"],
  },

  {
    id: "P4_Unique_Fist_009_x1",
    name: "The Fist of Az'Turrasq",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_thefistofazturrasq_p2", name: "Exploding Palm Explosion Damage", format: "Exploding Palm's on-death explosion damage is increased by %d%%.", min: 250, max: 300},
    },
    preset: ["mainstat"],
  },

  {
    id: "P41_Unique_Dagger_102_x1",
    name: "Lord Greenstone's Fan",
    type: "dagger",
    quality: "legendary",
    required: {
      custom: {id: "leg_lordgreenstonesfan_p2", name: "Fan of Knives Damage Bonus", format: "Every second, gain %d%% increased damage for your next Fan of Knives. Stacks up to 30 times.", min: 160, max: 200},
    },
    preset: ["mainstat", "wpncol"],
  },

  {
    id: "P41_Unique_Fist_007",
    name: "Fleshrake",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_fleshrake", name: "Dashing Strike Damage Bonus", format: "Dashing Strike increases the damage of Dashing Strike by %d%% for 1 second, stacking up to 5 times.", min: 75, max: 100},
    },
    preset: ["mainstat"],
  },

  {
    id: "P41_Unique_Fist_008",
    name: "Crystal Fist",
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_crystalfist", name: "Dashing Strike Damage Reduction", format: "Dashing Strike reduces your damage taken by %d%% for 6 seconds.", min: 40, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "P42_Unique_Fist_013_x1",
    name: "Scarbringer",
    suffix: _L("PTR"),
    type: "fistweapon",
    quality: "legendary",
    required: {
      custom: {id: "leg_scarbringer", name: "Bonus Lashing Tail Kick Damage", format: "Lashing Tail Kick does 1000%% more damage to the first 5 enemies hit.", args: 0},
    },
    preset: ["wpnhol", "bleed"],
  },

  {
    id: "Unique_Flail_1H_106_x1",
    name: "Darklight",
    suffix: _L("PTR"),
    type: "flail",
    quality: "legendary",
    required: {
      custom: {id: "leg_darklight_p2", name: "Chance to Cast Fist of the Heavens Twice", format: "Fist of the Heavens has a %d%% chance to be cast twice.", min: 45, max: 60},
    },
    preset: ["wpnlit", "mainstat"],
  },

]);

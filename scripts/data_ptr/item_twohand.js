DiabloCalc.addItems([

  // AXE

  {
    id: "Unique_Axe_2H_003_x1",
    name: "The Executioner",
    type: "axe2h",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "expadd"],
  },

  {
    id: "Unique_Axe_2H_001_x1",
    name: "Butcher's Carver",
    type: "axe2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_butcherscarver", name: "The Butcher still inhabits his carver", format: "The Butcher still inhabits his carver.", args: 0},
    },
    preset: ["mainstat"],
    secondary: 3,
  },

  {
    id: "Unique_Axe_2H_011_x1",
    name: "Messerschmidt's Reaver",
    type: "axe2h",
    quality: "legendary",
    preset: ["wpnfir", "mainstat", "laek"],
  },

  {
    id: "Unique_Axe_2H_009_x1",
    name: "Skorn",
    type: "axe2h",
    quality: "legendary",
    preset: ["mainstat", "bleed", "sockets"],
  },

  {
    id: "Unique_Axe_2H_010_x1",
    name: "Cinder Switch",
    type: "axe2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_cinderswitch", name: "Chance to Cast Fireball", format: "%d%% chance to cast a fireball when attacking.", min: 25, max: 50},
    },
    preset: ["wpnfir"],
  },

  // MACE

  {
    id: "Unique_Mace_2H_003_x1",
    name: "Arthef's Spark of Life",
    type: "mace2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_arthefssparkoflife", name: "Heal When Killing Undead", format: "Heal for %d%% of your missing Life when you kill an Undead enemy.", min: 3, max: 4},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Mace_2H_001_x1",
    name: "Crushbane",
    type: "mace2h",
    quality: "legendary",
    preset: ["wpncol", "mainstat"],
  },

  {
    id: "Unique_Mace_2H_010_x1",
    name: "Skywarden",
    type: "mace2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_skywarden", name: "Gain Random Laws", format: "Every 60 seconds, gain a random Law for 60 seconds.", args: 0},
    },
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "Unique_Mace_2H_012_x1",
    name: "Wrath of the Bone King",
    suffix: _L("Legacy"),
    type: "mace2h",
    quality: "legendary",
    preset: ["wpnphy", "onhit", "laek"],
  },

  {
    id: "Unique_Mace_2H_012_p1",
    name: "Wrath of the Bone King",
    type: "mace2h",
    quality: "legendary",
    affixes: {
      dmgcol: {min: 25, max: 30},
    },
    preset: ["wpncol", "dmgcol", "onhit", "laek"],
  },

  {
    id: "Unique_Mace_2H_103_x1",
    name: "The Furnace",
    type: "mace2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_thefurnace", name: "Damage Against Elites", format: "Increases damage against elites by %d%%.", min: 40, max: 50},
    },
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_Mace_2H_009_x1",
    name: "Schaefer's Hammer",
    suffix: _L("Legacy"),
    type: "mace2h",
    quality: "legendary",
    affixes: {
      dmglit: {min: 20, max: 25},
    },
    required: {
      custom: {id: "leg_schaefershammer", name: "Lightning Charge Damage", format: "Getting hit has a chance to charge you with Lightning, causing you to deal %d%% weapon damage as Lightning every second for 5 seconds to nearby enemies.", min: 190, max: 250},
    },
    preset: ["wpnlit", "dmglit"],
  },

  {
    id: "Unique_Mace_2H_009_p2",
    name: "Schaefer's Hammer",
    type: "mace2h",
    quality: "legendary",
    affixes: {
      dmglit: {min: 20, max: 25},
    },
    required: {
      custom: {id: "leg_schaefershammer_p2", name: "Lightning Charge Damage", format: "Casting a Lightning skill charges you with Lightning, causing you to deal %d%% weapon damage as Lightning every second for 5 seconds to nearby enemies.", min: 650, max: 850},
    },
    preset: ["wpnlit", "dmglit"],
  },

  {
    id: "Unique_Mace_2H_002_x1",
    name: "Sledge of Athskeleng",
    type: "mace2h",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
    },
    preset: ["wpnphy", "mainstat", "damage", "ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Mace_2H_006_x1",
    name: "Sunder",
    type: "mace2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_sunder", name: "Chance to Sunder the Ground", format: "%d%% chance to sunder the ground your enemies walk on when you attack.", min: 25, max: 50},
    },
    preset: ["wpnfir"],
  },

  // POLEARM

  {
    id: "Unique_Polearm_002_x1",
    name: "Pledge of Caldeum",
    type: "polearm",
    quality: "legendary",
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_Polearm_004_x1",
    name: "Standoff",
    type: "polearm",
    quality: "legendary",
    preset: ["wpncol", "mainstat", "sockets"],
  },

  {
    id: "Unique_Polearm_101_x1",
    name: "Bovine Bardiche",
    type: "polearm",
    quality: "legendary",
    required: {
      custom: {id: "leg_bovinebardiche", name: "Chance to Summon Cows", format: "Chance on hit to summon a herd of murderous cows.", args: 0},
    },
    preset: ["wpnlit", "mainstat"],
  },

  {
    id: "Unique_Polearm_003_x1",
    name: "Heart Slaughter",
    suffix: _L("Legacy"),
    type: "polearm",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "laek"],
  },

  {
    id: "Unique_Polearm_003_p1",
    name: "Heart Slaughter",
    type: "polearm",
    quality: "legendary",
    affixes: {
      dmgphy: {min: 25, max: 30},
    },
    preset: ["wpnphy", "mainstat", "dmgphy", "laek"],
  },

  {
    id: "Unique_Polearm_001_x1",
    name: "Vigilance",
    type: "polearm",
    quality: "legendary",
    required: {
      custom: {id: "leg_vigilance", name: "Chance to Cast Inner Sanctuary", format: "Getting hit has a chance to automatically cast Inner Sanctuary.", args: 0},
    },
    preset: ["wpnhol", "mainstat"],
  },

  // STAFF

  {
    id: "Unique_Staff_008_x1",
    name: "Autumn's Call",
    type: "staff",
    quality: "legendary",
    preset: ["wpnhol", "mainstat", "expadd"],
  },

  {
    id: "Unique_Staff_001_x1",
    name: "The Broken Staff",
    type: "staff",
    quality: "legendary",
    preset: ["wpnlit", "mainstat", "sockets", "dura"],
  },

  {
    id: "Unique_Staff_101_x1",
    name: "Ahvarion, Spear of Lycander",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_ahvarion", name: "Chance to Gain Random Shrine Effect", format: "Chance on killing a demon to gain a random Shrine effect.", args: 0},
    },
    preset: ["wpnhol", "sockets"],
  },

  {
    id: "Unique_Staff_103_x1",
    name: "The Smoldering Core",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_thesmolderingcore", name: "Lure to Meteors", format: "Lesser enemies are now lured to your Meteor impact areas.", args: 0},
    },
    preset: ["wpnfir", "mainstat", "sockets"],
  },

  {
    id: "Unique_Staff_102_x1",
    name: "Valthek's Rebuke",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_valtheksrebuke", name: "Energy Twister Travels in a Straight Path", format: "Energy Twister now travels in a straight path.", args: 0},
    },
    preset: ["wpnarc", "mainstat", "sockets"],
  },

  {
    id: "Unique_Staff_006_x1",
    name: "Maloth's Focus",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_malothsfocus", name: "Enemies Occasionally Flee", format: "Enemies occasionally flee at the sight of this staff.", args: 0},
    },
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_Staff_003_x1",
    name: "Wormwood",
    suffix: _L("Legacy"),
    type: "staff",
    quality: "legendary",
    affixes: {
      hitfear: {min: 5, max: 15, step: 0.1},
    },
    preset: ["wpnpsn", "mainstat", "hitfear"],
  },

  {
    id: "P2_Unique_Staff_003",
    name: "Wormwood",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_wormwood", name: "Locust Swarm Autocast", format: "Locust Swarm is cast on a nearby enemy every second.", args: 0},
    },
    affixes: {
      dmgpsn: {min: 20, max: 25},
    },
    preset: ["wpnpsn", "mainstat", "dmgpsn"],
  },

  {
    id: "Unique_Staff_009_x1",
    name: "The Grand Vizier",
    suffix: _L("Legacy"),
    type: "staff",
    quality: "legendary",
    affixes: {
      gf: "gfLarge",
    },
    preset: ["wpnfir", "mainstat", "gf"],
  },

  {
    id: "Unique_Staff_009_p1",
    name: "The Grand Vizier",
    type: "staff",
    quality: "legendary",
    required: {
      skill_wizard_meteor: {min: 25, max: 30},
      custom: {id: "leg_thegrandvizier", name: "Reduce Meteor Cost", format: "Reduces the Arcane Power cost of Meteor by %d%%.", min: 40, max: 50},
    },
    preset: ["wpnfir", "mainstat"],
    primary: 5,
  },

  {
    id: "Unique_Staff_007_x1",
    name: "The Tormentor",
    type: "staff",
    quality: "legendary",
    required: {
      custom: {id: "leg_thetormentor", name: "Chance to Charm Enemies", format: "Chance to charm enemies when you hit them.", args: 0},
    },
    preset: ["wpnarc", "mainstat"],
  },

  {
    id: "Unique_Staff_002_x1",
    name: "Mark of the Magi",
    type: "staff",
    quality: "legendary",
    preset: ["wpnarc"],
  },

  // SWORD

  {
    id: "Unique_Sword_2H_012_x1",
    name: "Faithful Memory",
    type: "sword2h",
    quality: "legendary",
    affixes: {
      thorns: "thornsLarge",
    },
    preset: ["wpnhol", "mainstat", "thorns"],
  },

  {
    id: "Unique_Sword_2H_002_x1",
    name: "The Zweihander",
    type: "sword2h",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "expadd"],
  },

  {
    id: "Unique_Sword_2H_011_x1",
    name: "Blackguard",
    type: "sword2h",
    quality: "legendary",
    affixes: {
      ccr: "ccrNormal",
    },
    preset: ["wpnphy", "mainstat", "damage", "ccr"],
  },

  {
    id: "Unique_Sword_2H_004_x1",
    name: "Scourge",
    type: "sword2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_scourge", name: "Chance to Explode With Fury", format: "%d%% chance to explode with demonic fury when attacking.", min: 20, max: 45},
    },
    preset: ["wpnpsn", "sockets"],
  },

  {
    id: "Unique_Sword_2H_101_x1",
    name: "Stalgard's Decimator",
    type: "sword2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_stalgardsdecimator", name: "Piercing Axe Damage", format: "Your melee attacks throw a piercing axe at a nearby enemy, dealing %d%% weapon damage as Physical.", min: 550, max: 700},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Sword_2H_007_x1",
    name: "Blade of Prophecy",
    type: "sword2h",
    quality: "legendary",
    affixes: {
    },
    required: {
      custom: {id: "leg_bladeofprophecy", name: "Condemn Explosions Chain", format: "Two Condemned enemies also trigger Condemn's explosion.", args: 0},
    },
    preset: ["cdr", "resource"],
  },

  {
    id: "Unique_Sword_2H_008_x1",
    name: "The Sultan of the Blinding Sand",
    type: "sword2h",
    quality: "legendary",
    affixes: {
      hitblind: {min: 20, max: 40, step: 0.1},
    },
    preset: ["wpnhol", "mainstat", "hitblind"],
  },

  {
    id: "Unique_Sword_2H_010_x1",
    name: "Maximus",
    type: "sword2h",
    quality: "legendary",
    affixes: {
      dmgfir: "elementalDamage",
    },
    required: {
      custom: {id: "leg_maximus", name: "Chance to Summon Demonic Slave", format: "Chance on hit to summon a Demonic Slave.", args: 0},
    },
    preset: ["wpnfir", "mainstat", "dmgfir"],
  },

  {
    id: "Unique_Sword_2H_001_x1",
    name: "The Grandfather",
    type: "sword2h",
    quality: "legendary",
    affixes: {
      life: "lifeLarge",
    },
    preset: ["wpnphy", "mainstat", "life", "dura"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Sword_2H_003_x1",
    name: "Warmonger",
    type: "sword2h",
    quality: "legendary",
    preset: ["wpnphy", "mainstat", "sockets"],
  },

  {
    id: "Unique_Sword_2H_102_x1",
    name: "Cam's Rebuttal",
    type: "sword2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_camsrebuttal", name: "Falling Sword can be cast twice", format: "Falling Sword can be used again within 4 seconds before the cooldown is triggered.", args: 0},
    },
    preset: ["mainstat"],
  },

  // DAIBO

  {
    id: "Unique_CombatStaff_2H_002_x1",
    name: "Balance",
    type: "daibo",
    quality: "legendary",
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "Unique_CombatStaff_2H_005_x1",
    name: "The Flow of Eternity",
    type: "daibo",
    quality: "legendary",
    required: {
      custom: {id: "leg_theflowofeternity", name: "Seven-Sided Strike Cooldown Reduction", format: "Reduces the cooldown of Seven-Sided Strike by %d%%.", min: 45, max: 60},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CombatStaff_2H_007_x1",
    name: "The Paddle",
    type: "daibo",
    quality: "legendary",
    required: {
      custom: {id: "leg_thepaddle", name: "Slap!", format: "Slap!", args: 0},
    },
    preset: ["wpnphy", "mainstat"],
  },

  {
    id: "Unique_CombatStaff_2H_101_x1",
    name: "Staff of Kyro",
    type: "daibo",
    quality: "legendary",
    required: {
      skill_monk_deadlyreach: {min: 40, max: 50},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_CombatStaff_2H_102_x1",
    name: "Warstaff of General Quang",
    type: "daibo",
    quality: "legendary",
    required: {
      custom: {id: "leg_warstaffofgeneralquang", name: "Tempest Rush Gains Tailwind", format: "Tempest Rush gains the effect of the Tailwind rune.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CombatStaff_2H_003_x1",
    name: "Incense Torch of the Grand Temple",
    type: "daibo",
    quality: "legendary",
    required: {
      skill_monk_waveoflight: {min: 25, max: 30},
      custom: {id: "leg_incensetorchofthegrandtemple", name: "Wave of Light Cost Reduction", format: "Reduces the Spirit cost of Wave of Light by %d%%.", min: 40, max: 50},
    },
    preset: ["mainstat"],
    primary: 5,
  },

  {
    id: "Unique_CombatStaff_2H_009_x1",
    name: "Flying Dragon",
    type: "daibo",
    quality: "legendary",
    required: {
      custom: {id: "leg_flyingdragon", name: "Chance to Double Attack Speed", format: "Chance to double your attack speed when attacking.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_CombatStaff_2H_008_x1",
    name: "Lai Yui's Persuader",
    type: "daibo",
    quality: "legendary",
    preset: ["wpncol"],
  },

  {
    id: "Unique_CombatStaff_2H_004_x1",
    name: "Rozpedin's Force",
    type: "daibo",
    quality: "legendary",
    preset: ["wpnhol"],
  },

  {
    id: "Unique_CombatStaff_2H_001_x1",
    name: "Inna's Reach",
    type: "daibo",
    quality: "set",
    set: "inna",
    affixes: {
      skill_monk_mystically: {min: 20, max: 25},
    },
    preset: ["mainstat", "skill_monk_mystically"],
    primary: 5,
  },

  // FLAIL

  {
    id: "Unique_Flail_2H_102_x1",
    name: "Baleful Remnant",
    type: "flail2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_balefulremnant", name: "Summon Phalanx Avatars", format: "Enemies killed while Akarat's Champion is active turn into Phalanx Avatars for 10 seconds.", args: 0},
    },
    preset: ["sockets"],
  },

  {
    id: "Unique_Flail_2H_103_x1",
    name: "Fate of the Fell",
    type: "flail2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_fateofthefell", name: "Holy Shotgun", format: "Gain two additional rays of Heaven\u2019s Fury.", args: 0},
    },
    preset: ["wpnfir", "mainstat"],
  },

  {
    id: "Unique_Flail_2H_104_x1",
    name: "Golden Flense",
    suffix: _L("Legacy"),
    type: "flail2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_goldenflense", name: "Sweep Attack Restores Wrath", format: "Sweep Attack restores %d Wrath for each enemy hit.", min: 3, max: 4},
    },
    preset: ["mainstat"],
  },

  {
    id: "P2_Unique_Flail_2H_104",
    ids: ["p2_Unique_Flail_2H_104"],
    name: "Golden Flense",
    type: "flail2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_goldenflense_p2", name: "Sweep Attack Restores Wrath", format: "Sweep Attack restores %d Wrath for each enemy hit.", min: 4, max: 6},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Flail_2H_101_x1",
    name: "The Mortal Drama",
    type: "flail2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_themortaldrama", name: "Double Bombardment Impacts", format: "Double the number of Bombardment impacts.", args: 0},
    },
    preset: ["mainstat"],
  },

  // MIGHTY WEAPON

  {
    id: "Unique_Mighty_2H_004_x1",
    name: "Bastion's Revered",
    suffix: _L("Legacy"),
    type: "mightyweapon2h",
    quality: "legendary",
    preset: ["wpncol", "mainstat", "maxfury"],
  },

  {
    id: "Unique_Mighty_2H_004_p1",
    name: "Bastion's Revered",
    type: "mightyweapon2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_bastionsrevered", name: "Extra Frenzy Stacks", format: "Frenzy now stacks up to 10 times.", args: 0},
    },
    preset: ["wpncol", "mainstat", "sockets"],
  },

  {
    id: "Unique_Mighty_2H_006_x1",
    name: "Fury of the Vanished Peak",
    type: "mightyweapon2h",
    quality: "legendary",
    required: {
      skill_barbarian_seismicslam: {min: 25, max: 30},
      custom: {id: "leg_furyofthevanishedpeak", name: "Seismic Slam Cost Reduction", format: "Reduces the Fury cost of Seismic Slam by %d%%.", min: 40, max: 50},
    },
    preset: ["mainstat"],
    primary: 5,
  },

  {
    id: "Unique_Mighty_2H_101_x1",
    name: "Madawc's Sorrow",
    type: "mightyweapon2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_madawcssorrow", name: "Stun on First Hit", format: "Stun enemies for 2 seconds the first time you hit them.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Mighty_2H_001_x1",
    name: "The Gavel of Judgment",
    suffix: _L("Legacy"),
    type: "mightyweapon2h",
    quality: "legendary",
    preset: ["wpnhol", "mainstat"],
  },

  {
    id: "P2_Unique_Mighty_2H_001",
    ids: ["ptr_TheGavelofJudgment", "p2_Unique_Mighty_2H_001"],
    name: "The Gavel of Judgment",
    type: "mightyweapon2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_gavelofjudgment", name: "Fury Returned", format: "Hammer of the Ancients returns %d Fury if it hits 3 or fewer enemies.", min: 15, max: 20},
      skill_barbarian_hammeroftheancients: {min: 30, max: 40},
    },
    preset: ["wpnhol", "mainstat"],
    primary: 5,
  },

  {
    id: "Unique_Mighty_2H_012_x1",
    name: "War of the Dead",
    type: "mightyweapon2h",
    quality: "legendary",
    preset: ["wpnphy"],
  },

  {
    id: "Unique_Mighty_2H_010_x1",
    name: "Immortal King's Boulder Breaker",
    type: "mightyweapon2h",
    quality: "set",
    set: "immortalking",
    required: {
      skill_barbarian_calloftheancients: {min: 45, max: 60},
    },
    preset: ["mainstat", "dura"],
    primary: 5,
  },

  {
    id: "Unique_Sword_2H_103_x1",
    ids: ["ptr_BloodBrother"],
    name: "Blood Brother",
    type: "sword2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_bloodbrother", name: "Chance to Block", format: "Grants a %d%% chance to block attacks. Blocked attacks inflict 30%% less damage. After blocking an attack, your next attack inflicts 30%% additional damage.", min: 15, max: 20},
    },
    preset: ["mainstat", "damage"],
  },

  {
    id: "Unique_Sword_2H_104_x1",
    ids: ["ptr_CorruptedAshbringer"],
    name: "Corrupted Ashbringer",
    type: "sword2h",
    quality: "legendary",
    required: {
      custom: {id: "leg_corruptedashbringer", name: "Burn Damage", format: "Chance on kill to raise a skeleton to fight for you. Upon accumulating 5 skeletons, they explode for 1000%% weapon damage and the sword transforms into Ashbringer for a short time. Attacking with Ashbringer burns your target for %d%% weapon damage as Holy.", min: 4500, max: 6000},
      damage_undead: {min: 9, max: 15},
    },
    preset: ["mainstat", "wpnpsn", "laek"],
    secondary: 3,
  },

]);

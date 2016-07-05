DiabloCalc.addItems([

  {
    id: "Unique_Ring_024_x1",
    name: "Hellfire Ring",
    type: "ring",
    quality: "legendary",
    required: {
      expmul: {min: 45, max: 45},
      custom: {id: "leg_hellfirering", name: "Engulf the Ground in Lava", format: "Chance on hit to engulf the ground in lava, dealing 200%% weapon damage per second for 6 seconds.", args: 0},
    },
    secondary: 3,
  },

  {
    id: "Unique_Ring_021_x1",
    name: "Manald Heal",
    type: "ring",
    quality: "legendary",
    affixes: {
      maxdisc: "maxdiscNormal",
      maxfury: "maxfuryNormal",
      maxap: "maxapNormal",
      maxmana: "maxmanaNormal",
      maxspirit: "maxspiritNormal",
      maxwrath: "maxwrathNormal",
      spiritregen: "spiritregenNormal",
      wrathregen: "wrathregenNormal",
    },
    preset: ["mainstat", "resource"],
  },

  {
    id: "Unique_Ring_018_x1",
    name: "Nagelring",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      mf: {min: 25, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_018_p2",
    ids: ["ptr_Nagelring"],
    name: "Nagelring",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_nagelring", name: "Summon Fallen Lunatic", format: "Summons a Fallen Lunatic to your side every %d seconds.", min: 10, max: 12, best: "min"},
      mf: {min: 25, max: 50},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_005_x1",
    name: "Stolen Ring",
    type: "ring",
    quality: "legendary",
    affixes: {
      pickup: "pickupNormal",
    },
    preset: ["mainstat", "gf", "pickup"],
  },

  {
    id: "Unique_Ring_002_x1",
    name: "Leoric's Signet",
    type: "ring",
    quality: "legendary",
    required: {
      expmul: {min: 20, max: 30},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Ring_009_x1",
    name: "Band of Untold Secrets",
    type: "ring",
    quality: "legendary",
    affixes: {
      ms: "msNormal",
    },
    preset: ["mainstat", "ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Ring_006_x1",
    name: "Broken Promises",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Ring_006_p2",
    ids: ["ptr_BrokenPromises"],
    name: "Broken Promises",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_brokenpromises", name: "Critical Boost Duration", format: "After 5 consecutive non-critical hits, your chance to critically hit is increased to 100%% for %d seconds.", min: 2, max: 3},
    },
    preset: ["mainstat", "rcr"],
  },

  {
    id: "Unique_Ring_004_x1",
    name: "Puzzle Ring",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_puzzlering", name: "Goblin Item Drop Rate", format: "Summon a treasure goblin who picks up normal-quality items for you. After picking up %d items, he drops a rare item with a chance for a legendary.", min: 12, max: 16, best: "min"},
    },
    preset: ["mainstat", "gf", "ias"],
  },

  {
    id: "Unique_Ring_106_x1",
    name: "Band of Rue Chambers",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_bandofruechambers", name: "Increase Spirit Generation", format: "Your Spirit Generators generate %d%% more Spirit.", min: 40, max: 50},
    },
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Ring_104_x1",
    name: "Rechel's Ring of Larceny",
    type: "ring",
    quality: "legendary",
    affixes: {
      hitfear: {min: 1.0, max: 5.1, step: 0.1},
    },
    required: {
      custom: {id: "leg_rechelsringoflarceny", name: "Increased Speed on Fear", format: "Gain %d%% increased movement speed for 4 seconds after Fearing an enemy.", min: 45, max: 60},
    },
    preset: ["mainstat", "hitfear"],
  },

  {
    id: "Unique_Ring_103_x1",
    name: "Rogar's Huge Stone",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_rogarshugestone", name: "Increased Regeneration at Low Life", format: "Increase your Life per Second by up to %d%% based on your missing Life.", min: 75, max: 100},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_101_x1",
    name: "The Tall Man's Finger",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_thetallmansfinger", name: "Gargantuan Dog", format: "Zombie Dogs instead summons a single gargantuan dog with more damage and health than all other dogs combined.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_102_x1",
    name: "Wyrdward",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_wyrdward", name: "Chance to Stun With Lightning Damage", format: "Lightning damage has a %d%% chance to Stun for 1.5 seconds.", min: 13, max: 17},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_102_p2",
    name: "Wyrdward",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_wyrdward_p2", name: "Chance to Stun With Lightning Damage", format: "Lightning damage has a %d%% chance to Stun for 1.5 seconds.", min: 25, max: 35},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_020_x1",
    name: "Bul-Kathos's Wedding Band",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_bulkathossweddingband", name: "Drain Life", format: "You drain life from enemies around you.", args: 0},
    },
    preset: ["mainstat", "chd"],
  },

  {
    id: "Unique_Ring_007_x1",
    name: "Eternal Union",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    affixes: {
      life: {min: 15, max: 20},
    },
    preset: ["mainstat", "life"],
  },

  {
    id: "Unique_Ring_007_p1",
    name: "Eternal Union",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_eternalunion", name: "Triple Phalanx Duration", format: "Increases the duration of Phalanx avatars by 200%%.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_008_x1",
    name: "Justice Lantern",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    affixes: {
      block: "blockRelic",
      ccr: {min: 35, max: 50},
    },
    preset: ["mainstat", "block", "ccr"],
  },

  {
    id: "Unique_Ring_023_x1",
    name: "Obsidian Ring of the Zodiac",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    affixes: {
      dura: "one",
    },
    preset: ["cdr", "rcr", "dura", "ias", "chc"],
  },

  {
    id: "Unique_Ring_023_p2",
    ids: ["ptr_Zodiac"],
    name: "Obsidian Ring of the Zodiac",
    type: "ring",
    quality: "legendary",
    affixes: {
      dura: "one",
    },
    required: {
      custom: {id: "leg_obsidianringofthezodiac", name: "Cooldown Reduction", format: "Reduce the remaining cooldown of one of your skills by 1 seconds when you hit with a resource-spending attack.", args: 0},
    },
    secondary: 3,
    preset: ["cdr", "rcr", "dura", "ias", "chc"],
  },

  {
    id: "Unique_Ring_001_x1",
    name: "Band of Hollow Whispers",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_bandofhollowwhispers", name: "Haunt Nearby Enemies", format: "This ring occasionally haunts nearby enemies.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_003_x1",
    name: "Krede's Flame",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_kredesflame", name: "Fire Damage Restores Resource", format: "Taking Fire damage restores your primary resource.", args: 0},
    },
    preset: ["mainstat"],
  },

  {
    id: "Unique_Ring_017_x1",
    name: "Oculus Ring",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      ias: {min: 7, max: 9, noblock: true},
      edef: {min: 12, max: 16},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Ring_017_p2",
    ids: ["ptr_Oculus"],
    name: "Oculus Ring",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_oculusring", name: "Damage Bonus", format: "Chance to create an area of focused power on killing a monster. Damage is increased by %d%% while standing in the area.", min: 35, max: 40},
      ias: {min: 7, max: 9, noblock: true},
      edef: {min: 12, max: 16},
    },
    preset: ["mainstat", "resall"],
  },

  {
    id: "Unique_Ring_022_x1",
    name: "Skull Grasp",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    preset: ["mainstat", "chc"],
  },

  {
    id: "P2_Unique_Ring_01",
    ids: ["ptr_SkullGrasp"],
    name: "Skull Grasp",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_skullgrasp", name: "Whirlwind Damage", format: "Increase the damage of Whirlwind by %d%% weapon damage.", min: 300, max: 400},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Ring_019_x1",
    name: "Stone of Jordan",
    type: "ring",
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
    required: {
      edmg: {min: 25, max: 30},
    },
    preset: ["mainstat", "elemental", "resource"],
  },

  {
    id: "Unique_Ring_010_x1",
    name: "Unity",
    type: "ring",
    quality: "legendary",
    required: {
      edmg: {min: 12, max: 15},
      custom: {id: "leg_unity", name: "Split Damage", format: "All damage taken is split between wearers of this item.", args: 0},
    },
    preset: ["mainstat", "chc"],
  },

  // SET

  {
    id: "Unique_Ring_015_x1",
    name: "Litany of the Undaunted",
    type: "ring",
    quality: "set",
    set: "nightmares",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Ring_014_x1",
    name: "The Wailing Host",
    type: "ring",
    quality: "set",
    set: "nightmares",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Ring_013_x1",
    name: "The Compass Rose",
    type: "ring",
    quality: "set",
    set: "endlesswalk",
    affixes: {
      ms: "msNormal",
    },
    preset: ["mainstat", "ms"],
    primary: 5,
    secondary: 1,
  },

  {
    id: "Unique_Ring_011_x1",
    name: "Natalya's Reflection",
    type: "ring",
    quality: "set",
    set: "natalya",
    preset: ["mainstat", "ias"],
  },

  {
    id: "Unique_Ring_012_x1",
    name: "Zunimassa's Pox",
    type: "ring",
    quality: "set",
    set: "zunimassa",
    preset: ["mainstat", "cdr"],
  },

  {
    id: "Unique_Ring_Set_001_x1",
    name: "Focus",
    type: "ring",
    quality: "set",
    set: "bastionsofwill",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "Unique_Ring_Set_002_x1",
    name: "Restraint",
    type: "ring",
    quality: "set",
    set: "bastionsofwill",
    preset: ["mainstat", "sockets"],
  },

  {
    id: "p2_Unique_Ring_Wizard_001",
    name: "Halo of Arlyse",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_haloofarlyse", name: "Melee Damage Reduction", format: "Your Ice Armor now reduces damage from melee attacks by %d%% and automatically casts Frost Nova whenever you take 10%% of your Life in damage.", min: 50, max: 60},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P2_Unique_Ring_03",
    ids: ["ptr_Arcstone"],
    name: "Arcstone",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_arcstone", name: "Pulse Damage", format: "Lightning pulses periodically between all wearers of this item, dealing %d%% weapon damage.", min: 1000, max: 1500},
    },
    preset: ["mainstat"],
  },

  {
    id: "P2_Unique_Ring_04",
    ids: ["ptr_Blizzcon"],
    name: "Convention of Elements",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_conventionofelements", name: "Elemental Damage", format: "Gain %d%% increased damage to a single element for 4 seconds. This effect rotates through the elements available to your class in the following order: Arcane, Cold, Fire, Holy, Lightning, Physical, Poison.", min: 150, max: 200},
    },
    preset: ["mainstat", "chc", "sockets"],
  },

  {
    id: "P2_Unique_Ring_02",
    ids: ["ptr_TheLittleMansFinger"],
    name: "The Short Man's Finger",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_theshortmansfinger", name: "Baby Gargantuans", format: "Gargantuan instead summons three smaller gargantuans each more powerful than before.", args: 0},
    },
    preset: ["mainstat", "chd"],
  },

  {
    id: "P4_Unique_Ring_01",
    name: "Ring of Emptiness",
    suffix: _L("Legacy"),
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_ringofemptiness", name: "Bonus Damage on Afflicted Targets", format: "You deal %d%% increased damage to enemies affected by both your Haunt and Locust Swarm.", min: 75, max: 100},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Ring_02",
    name: "Elusive Ring",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_elusivering", name: "Damage Reduction on Defensive Skills", format: "After casting Shadow Power, Smoke Screen, or Vault, take %d%% reduced damage for 8 seconds.", min: 50, max: 60},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P4_Unique_Ring_03",
    name: "Justice Lantern",
    type: "ring",
    quality: "legendary",
    required: {
      block: "blockRelic",
      custom: {id: "leg_justicelantern", name: "Block to Damage Reduction", format: "Gain damage reduction equal to %d%% of your Block Chance.", min: 45, max: 55},
      ccr: {min: 35, max: 50},
    },
    preset: ["mainstat", "sockets"],
    primary: 5,
  },

  {
    id: "P4_Unique_Ring_05",
    name: "Band of Might",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_bandofmight", name: "Damage Reduction on Movement Skills", format: "After casting Furious Charge, Ground Stomp, or Leap, take %d%% reduced damage for 8 seconds.", min: 50, max: 60},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "Unique_Ring_017_p4",
    name: "Oculus Ring",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_oculusring_p2", name: "Damage Bonus", format: "Chance to create an area of focused power on killing a monster. Damage is increased by %d%% while standing in the area.", min: 70, max: 85},
    },
    preset: ["sockets"],
  },

  {
    id: "P41_Unique_Ring_02",
    name: "Skull Grasp",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_skullgrasp_p2", name: "Whirlwind Damage", format: "Increase the damage of Whirlwind by %d%%.", min: 250, max: 300},
    },
    preset: ["mainstat", "chc"],
  },

  {
    id: "P41_Unique_Ring_01",
    name: "Halo of Karini",
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_haloofkarini", name: "Damage Reduction", format: "You take %d%% less damage for 3 seconds after your Storm Armor electrocutes an enemy more than 30 yards away.", min: 45, max: 60},
    },
    preset: ["mainstat", "sockets"],
  },

  {
    id: "P42_Unique_Ring_Haunt",
    name: "Ring of Emptiness",
    suffix: _L("PTR"),
    type: "ring",
    quality: "legendary",
    required: {
      custom: {id: "leg_ringofemptiness_p2", name: "Bonus Damage on Afflicted Targets", format: "You deal %d%% increased damage to enemies affected by both your Haunt and Locust Swarm.", min: 250, max: 300},
    },
    preset: ["mainstat", "chc"],
  },

]);

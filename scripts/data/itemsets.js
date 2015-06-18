DiabloCalc.itemSets = {

  chantodo: {
    name: "Chantodo's Resolve",
    order: ["source", "wand"],
    tclass: "wizard",
    bonuses: {
      "2": [
        {stat: "int", value: [250]},
        {stat: "edef", value: [10]},
        {format: "Your shields heal for 25%% of their remaining amount when they expire."},
      ],
    },
  },

  danetta: {
    name: "Danetta's Hatred",
    tclass: "demonhunter",
    bonuses: {
      "2": [
        {format: "Vault now costs 8 Hatred instead of Discipline."},
      ],
    },
  },

  blackthorne: {
    name: "Blackthorne's Battlegear",
    order: ["amulet", "pants", "belt", "boots", "chestarmor"],
    bonuses: {
      "2": [
        {stat: "vit", value: [250]},
        {stat: "edmg", value: [10]},
      ],
      "3": [
        {stat: "edef", value: [10]},
        {stat: "gf", value: [25]},
      ],
      "4": [
        {format: "You are immune to Desecrator, Molten, and Plagued monster ground effects."},
      ],
    },
  },

  bulkathos: {
    name: "Bul-Kathos's Oath",
    tclass: "barbarian",
    bonuses: {
      "2": [
        {stat: "furyregen", value: [10]},
        {format: "During Whirlwind gain 30%% increased Attack Speed and Movement Speed."},
      ],
    },
  },

  endlesswalk: {
    name: "Endless Walk",
    order: ["ring", "amulet"],
    bonuses: {
      "2": [
        {stat: "vit", value: [250]},
        {stat: "chd", value: [50]},
      ],
    },
  },

  nightmares: {
    name: "Legacy of Nightmares",
    bonuses: {
      "2": [
        {stat: "gf", value: [15]},
        {stat: "mf", value: [15]},
        {format: "This ring sometimes summons a Skeleton when you attack."},
      ],
    },
  },

  manajuma: {
    name: "Manajuma's Way",
    order: ["ceremonialknife", "mojo"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {stat: "int", value: [250]},
        {stat: "manaperkill", value: [30]},
        {format: "You are surrounded by a deadly Poison Cloud."},
      ],
    },
  },

  shenlong: {
    name: "Shenlong's Spirit",
    tclass: "monk",
    bonuses: {
      "2": [
        {stat: "dex", value: [250]},
        {stat: "spiritregen", value: [4]},
        {format: "Chance to hurl a ball of pure energy when attacking."},
      ],
    },
  },

  bastionsofwill: {
    name: "Bastions of Will",
    bonuses: {
      "2": [
        {format: "When you hit with a resource-generating attack or primary skill, deal 50%% increased damage for 5 seconds."},
        {format: "When you hit with a resource-spending attack, deal 50%% increased damage for 5 seconds."},
      ],
    },
  },

  istvan: {
    name: "Istvan's Paired Blades",
    bonuses: {
      "2": [
        {format: "Every time you spend primary resource, you gain 6%% increased attack speed for 5 seconds. This effect stacks up to 5 times."},
      ],
    },
  },

  invoker: {
    name: "Thorns of the Invoker",
    order: ["shoulders", "helm", "gloves", "bracers"],
    bonuses: {
      "2": [
        {stat: "thorns", value: [4000]},
      ],
      "4": [
        {format: "Your Thorns damage now hits all enemies in a 15 yard radius."},
      ],
    },
  },

  krelm: {
    name: "Krelm\u2019s Buff Bulwark",
    order: ["belt", "bracers"],
    bonuses: {
      "2": [
        {stat: "vit", value: [500]},
      ],
    },
  },

  asheara: {
    name: "Asheara's Vestments",
    order: ["shoulders", "boots", "pants", "gloves"],
    bonuses: {
      "2": [
        {stat: "resall", value: [100]},
      ],
      "3": [
        {stat: "life", value: [20]},
      ],
      "4": [
        {format: "Attacks cause your followers to occasionally come to your aid."},
      ],
    },
  },

  aughild: {
    name: "Aughild's Authority",
    order: ["shoulders", "chestarmor", "bracers", "helm"],
    bonuses: {
      "2": [
        {stat: "rangedef", value: [7]},
        {stat: "meleedef", value: [7]},
      ],
      "3": [
        {stat: "edef", value: [15]},
        {stat: "edmg", value: [15]},
      ],
    },
  },

  born: {
    name: "Born's Command",
    order: ["chestarmor", "sword", "shoulders"],
    bonuses: {
      "2": [
        {stat: "life", value: [15]},
      ],
      "3": [
        {stat: "cdr", value: [10]},
        {stat: "expmul", value: [20]},
      ],
    },
  },

  cain: {
    name: "Cain's Destiny",
    order: ["pants", "helm", "gloves", "boots"],
    bonuses: {
      "2": [
        {stat: "ias", value: [8]},
      ],
      "3": [
        {stat: "mf", value: [50]},
        {stat: "expmul", value: [50]},
      ],
    },
  },

  crimson: {
    name: "Captain Crimson's Trimmings",
    order: ["belt", "pants", "boots"],
    bonuses: {
      "2": [
        {stat: "regen", value: [6000]},
        {stat: "cdr", value: [10]},
      ],
      "3": [
        {stat: "resall", value: [50]},
        {stat: "rcr", value: [10]},
      ],
    },
  },

  demon: {
    name: "Demon's Hide",
    order: ["shoulders", "bracers", "chestarmor", "pants", "belt"],
    bonuses: {
      "2": [
        {stat: "firethorns", value: [6000]},
      ],
      "3": [
        {stat: "area", value: [25]},
      ],
      "4": [
        {stat: "damage_demons", value: [15]},
        {format: "Chance to reflect projectiles when you are hit by enemies."},
      ],
    },
  },

  guardian: {
    name: "Guardian's Jeopardy",
    order: ["bracers", "belt", "helm"],
    bonuses: {
      "2": [
        {stat: "vit", value: [250]},
        {stat: "regen", value: [8000]},
      ],
      "3": [
        {stat: "ms", value: [15]},
      ],
    },
  },

  hallowed: {
    name: "Hallowed Protectors",
    order: ["shield", "wand", "axe", "handcrossbow", "fistweapon", "mightyweapon", "ceremonialknife"],
    bonuses: {
      "2": [
        {stat: "resall", value: [100]},
        {stat: "ias", value: [10]},
      ],
    },
  },

  sage: {
    name: "Sage's Journey",
    order: ["helm", "boots", "gloves"],
    bonuses: {
      "2": [
        {stat: "str", value: [250]},
        {stat: "dex", value: [250]},
        {stat: "int", value: [250]},
        {stat: "vit", value: [250]},
      ],
      "3": [
        {format: "Whenever a Death's Breath drops, a second one will also drop."},
      ],
    },
  },

  talrasha: {
    name: "Tal Rasha's Elements",
    order: ["pants", "amulet", "helm", "source", "chestarmor", "belt", "gloves"],
    tclass: "wizard",
    bonuses: {
      "2": [
        {format: "Damaging enemies with Arcane, Cold, Fire or Lightning will cause a Meteor of the same damage type to fall from the sky. There is an 8 second cooldown for each damage type."},
      ],
      "4": [
        {format: "Attacks increase your resistance to that element by 100%% for 6 seconds."},
      ],
      "6": [
        {format: "Attacks increase your damage by 150%% for 6 seconds. Arcane, Cold, Fire, and Lightning attacks each add one stack. Adding a stack refreshes the duration."},
      ],
    },
  },

  vyr: {
    name: "Vyr's Amazing Arcana",
    order: ["chestarmor", "pants", "gloves", "boots"],
    tclass: "wizard",
    bonuses: {
      "2": [
        {stat: "int", value: [500]},
      ],
      "4": [
        {format: "Archon gains the effect of every rune."},
      ],
    },
  },

  firebird: {
    name: "Firebird's Finery",
    class: "wizard",
    order: ["chestarmor", "pants", "source", "shoulders", "helm", "gloves", "boots"],
    bonuses: {
      "2": [
        {format: "When you die, a meteor falls from the sky and revives you. This effect has a 300 second cooldown."},
      ],
      "4": [
        {format: "Your Fire Spells cause up to 3 enemies to explode, dealing 400%% weapon damage as Fire to enemies within 10 yards."},
      ],
      "6": [
        {format: "Dealing Fire damage causes the enemy to take the same amount of damage over 3 seconds, stacking up to 3000%% weapon damage as Fire per second. After reaching 3000%% damage per second, the enemy will burn until they die."},
      ],
    },
  },

  natalya: {
    name: "Natalya's Vengeance",
    tclass: "demonhunter",
    order: ["helm", "cloak", "boots", "gloves", "handcrossbow", "pants", "ring"],
    bonuses: {
      "2": [
        {format: "Reduce the cooldown of Rain of Vengeance by 2 seconds when you hit with a Hatred-generating attack or Hatred-spending attack."},
      ],
      "4": [
        {format: "Rain of Vengeance deals 100% increased damage."},
      ],
      "6": [
        {format: "After casting Rain of Vengenace, deal 400%% increased damage and take 30%% reduced damage for 5 seconds."},
      ],
    },
  },

  shadow: {
    name: "The Shadow\u2019s Mantle",
    order: ["chestarmor", "pants", "gloves", "boots"],
    tclass: "demonhunter",
    bonuses: {
      "2": [
        {format: "When receiving fatal damage, you instead automatically cast Smoke Screen and are healed to 25%% Life. This effect may occur once every 120 seconds."},
      ],
      "4": [
        {format: "Shadow Power gains the effect of every rune."},
      ],
    },
  },

  marauder: {
    name: "Embodiment of the Marauder",
    class: "demonhunter",
    order: ["chestarmor", "pants", "gloves", "shoulders", "boots", "helm"],
    bonuses: {
      "2": [
        {format: "Companion calls all companion types to your side."},
      ],
      "4": [
        {format: "Sentries now cast your Hatred spenders every time you do."},
      ],
      "6": [
        {format: "Your generators, Chakram, Cluster Arrow, Elemental Arrow, Impale and Multishot deal 100%% increased damage for every active Sentry."},
      ],
    },
  },

  zunimassa: {
    name: "Zunimassa's Haunt",
    order: ["gloves", "boots", "voodoomask", "chestarmor", "pants", "mojo", "ring"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {format: "Your Fetish Army lasts until they die."},
      ],
      "4": [
        {format: "You and your pets take 2% less damage for every Fetish you have alive."},
      ],
      "6": [
        {format: "Enemies hit by your Mana spenders take 275%% more damage from your pets for 4 seconds."},
      ],
    },
  },

  helltooth: {
    name: "Helltooth Harness",
    class: "witchdoctor",
    order: ["gloves", "boots", "pants", "shoulders", "helm", "chestarmor"],
    bonuses: {
      "2": [
        {stat: "int", value: [500]},
      ],
      "4": [
        {stat: "skill_witchdoctor_wallofzombies_cooldown", value: [2]},
      ],
      "6": [
        {format: "Wall of Zombies spews acid, dealing 300%% weapon damage every second for its entire duration."},
      ],
    },
  },

  jadeharvester: {
    name: "Raiment of the Jade Harvester",
    order: ["pants", "shoulders", "gloves", "chestarmor", "boots", "helm"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {format: "When Haunt lands on an enemy already affected by Haunt, it instantly deals 10 seconds worth of Haunt damage."},
      ],
      "4": [
        {format: "Soul Harvest gains the effect of every rune."},
      ],
      "6": [
        {format: "Soul Harvest consumes your damage over time effects on enemies, instantly dealing their remaining damage."},
      ],
    },
  },

  immortalking: {
    name: "Immortal King's Call",
    order: ["chestarmor", "helm", "pants", "gloves", "mightyweapon2h", "boots", "mightybelt"],
    tclass: "barbarian",
    bonuses: {
      "2": [
        {format: "Call of the Ancients last until they die."},
      ],
      "4": [
        {format: "Reduce the cooldown of Wrath of the Berserker and Call of the Ancients by 3 seconds for every 10 Fury you spend with an attack."},
      ],
      "6": [
        {format: "While both Wrath of the Berserker and Call of the Ancients are active, you deal 100% increased damage."},
      ],
    },
  },

  earth: {
    name: "Might of the Earth",
    order: ["helm", "gloves", "shoulders", "pants"],
    tclass: "barbarian",
    bonuses: {
      "2": [
        {format: "Reduce the cooldown of Earthquake by 2 seconds every time it kills an enemy."},
      ],
      "4": [
        {format: "Cause an Earthquake when you land after using Leap."},
      ],
    },
  },

  raekor: {
    name: "The Legacy of Raekor",
    class: "barbarian",
    order: ["pants", "shoulders", "chestarmor", "boots", "helm", "gloves"],
    bonuses: {
      "2": [
        {format: "The first enemy hit by Furious Charge takes 100%% additional damage."},
      ],
      "4": [
        {format: "Furious Charge gains the effect of every rune."},
      ],
      "5": [
        {format: "Enemies hit by Furious Charge take 3000%% weapon damage over 3 seconds."},
      ],
    },
  },

  inna: {
    name: "Inna's Mantra",
    order: ["spiritstone", "belt", "boots", "daibo", "pants", "gloves", "chestarmor"],
    tclass: "monk",
    bonuses: {
      "2": [
        {format: "Increase the passive effect of your Mystic Ally and the base passive effect of your Mantra by 100%%."},
      ],
      "4": [
        {format: "Gain the base effect of all four Mantras at all times."},
      ],
      "6": [
        {format: "Mystic Ally casts Cyclone Strike, Exploding Palm, Lashing Tail Kick, Seven-Sided Strike, and Wave of Light when you do."},
      ],
    },
  },

  sunwuko: {
    name: "Monkey King's Garb",
    order: ["shoulders", "helm", "gloves", "amulet"],
    tclass: "monk",
    bonuses: {
      "2": [
        {format: "Casting Cyclone Strike, Exploding Palm, Lashing Tail Kick, Tempest Rush or Wave of Light causes a decoy to spawn that taunts nearby enemies and then explodes for 1000%% damage."},
      ],
      "4": [
        {format: "When your Decoy explodes, you gain a buff that increases the damage of Cyclone Strike, Exploding Palm, Lashing Tail Kick, Tempest Rush and Wave of Light by 500%% for 3 seconds."},
      ],
    },
  },

  storms: {
    name: "Raiment of a Thousand Storms",
    class: "monk",
    order: ["boots", "gloves", "chestarmor", "shoulders", "helm", "pants"],
    bonuses: {
      "2": [
        {format: "Your Spirit Generators have 25%% increased attack speed and 300%% increased damage."},
      ],
      "4": [
        {format: "Dashing Strike now spends 75 Spirit, but refunds a Charge when it does."},
      ],
      "6": [
        {format: "Your Spirit Generators increase the weapon damage of Dashing Strike to 12500%% for 6 seconds."},
      ],
    },
  },

  akkhan: {
    name: "Armor of Akkhan",
    class: "crusader",
    order: ["chestarmor", "pants", "gloves", "helm", "shoulders", "boots"],
    bonuses: {
      "2": [
        {stat: "str", value: [500]},
      ],
      "4": [
        {format: "Reduce the cost of all abilities by 50%% while Akarat's Champion is active."},
      ],
      "6": [
        {format: "Reduce the cooldown of Akarat's Champion by 50%%."},
      ],
    },
  },

  roland: {
    name: "Roland's Legacy",
    class: "crusader",
    order: ["chestarmor", "pants", "gloves", "shoulders", "boots", "helm"],
    bonuses: {
      "2": [
        {format: "Every use of Shield Bash and Sweep Attack reduces the cooldown of your Laws and Defensive Skills by 1 second."},
      ],
      "4": [
        {format: "Increase the damage of Shield Bash and Sweep Attack by 500%%."},
      ],
      "6": [
        {format: "Every use of Shield Bash or Sweep Attack that hits an enemy grants 30%% increased Attack Speed for 3 seconds. This effect stacks up to 5 times."},
      ],
    },
  },

  magnumopus: {
    name: "Delsere's Magnum Opus",
    class: "wizard",
    order: ["gloves", "boots", "pants", "helm", "shoulders", "chestarmor"],
    bonuses: {
      "2": [
        {format: "Casting Arcane Orb, Energy Twister, Magic Missile or Shock Pulse reduces the cooldown of Slow Time by 2 seconds."},
      ],
      "4": [
        {format: "Enemies affected by your Slow Time take 2000%% weapon damage every second."},
      ],
      "6": [
        {format: "Enemies affected by your Slow Time take 750%% more damage from your Arcane Orb, Energy Twister, Magic Missile, and Shock Pulse abilities."},
      ],
    },
  },

  unhallowed: {
    name: "Unhallowed Essence",
    class: "demonhunter",
    order: ["helm", "boots", "pants", "shoulders", "chestarmor", "gloves"],
    bonuses: {
      "2": [
        {format: "Your generators also generate 1 Discipline."},
      ],
      "4": [
        {format: "Gain 20%% damage reduction and deal 20%% increased damage for 4 seconds if no enemy is within 10 yards of you."},
      ],
      "6": [
        {format: "Your generators and Multishot deal 15%% increased damage for every point of Discipline you have."},
      ],
    },
  },

  wastes: {
    name: "Wrath of the Wastes",
    class: "barbarian",
    order: ["chestarmor", "gloves", "pants", "helm", "boots", "shoulders"],
    bonuses: {
      "2": [
        {format: "Increase the damage of Rend by 500%% and its duration to 15 seconds."},
      ],
      "4": [
        {format: "During Whirlwind you gain 40%% damage reduction."},
      ],
      "6": [
        {format: "Whirlwind gains the effect of the Dust Devils rune and Dust Devils damage is increased to 2500%% weapon damage."},
      ],
    },
  },

};

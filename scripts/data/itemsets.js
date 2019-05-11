DiabloCalc.itemSets = {

  chantodo: {
    name: "Chantodo's Resolve",
    order: ["source", "wand"],
    tclass: "wizard",
    bonuses: {
      "2": [
        {format: "Every second while in Archon form you expel a Wave of Destruction, dealing 1000%% weapon damage to enemies within 30 yards."},
        {format: "Every time you hit with an attack while not in Archon form, 1000%% weapon damage is added to the Wave of Destruction, stacking up to 20 times."},
      ],
    },
  },

  danetta: {
    name: "Danetta's Hatred",
    tclass: "demonhunter",
    bonuses: {
      "2": [
        {format: "Vault costs 8 Hatred instead of Discipline."},
        {format: "Vault deals 800%% increased damage."},
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
        {stat: "furyregen", value: [15]},
        {format: "During Whirlwind gain 45%% increased Attack Speed and Movement Speed."},
      ],
    },
  },

  endlesswalk: {
    name: "Endless Walk",
    order: ["ring", "amulet"],
    bonuses: {
      "2": [
        {format: "While moving, damage taken is reduced by up to 50%%."},
        {format: "While standing still, damage dealt is increased by up to 100%%."},
      ],
    },
  },

  nightmares: {
    name: "Legacy of Nightmares",
    bonuses: {
      "2": [
        {format: "While this is your only Item Set bonus every Ancient item you have equipped increases your damage dealt by 750%% and reduces your damage taken by 4%%."},
      ],
    },
  },

  manajuma: {
    name: "Manajuma's Way",
    order: ["ceremonialknife", "mojo"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {format: "Your Hex - Angry Chicken explosion damage is increased by 400%% and slain enemies trigger an additional explosion."},
        {format: "Your Hex - Angry Chicken lasts 15 seconds and movement speed as a chicken is increased by an additional 100%."},
      ],
    },
  },

  shenlong: {
    name: "Shenlong's Spirit",
    tclass: "monk",
    bonuses: {
      "2": [
        {format: "The damage of your Spirit Generators is increased by 2%% for each point of Spirit you have."},
        {format: "When reaching maximum Spirit, all damage is increased by 200%%, but you no longer passively regenerate Spirit and 65 Spirit is drained every second until you run out of Spirit."},
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
        {format: "Every time you spend primary resource, gain 6%% increased Attack Speed, Damage, and Armor for 5 seconds. This effect stacks up to 5 times."},
      ],
    },
  },

  invoker: {
    name: "Thorns of the Invoker",
    class: "crusader",
    order: ["shoulders", "helm", "gloves", "bracers"],
    bonuses: {
      "2": [
        {format: "Your Thorns damage now hits all enemies in a 15 yard radius around you. Each time you hit an enemy with Punish, Slash, or block an attack your Thorns is increased by 350% for 2 seconds."},
      ],
      "4": [
        {format: "You take 50%% less damage for 20 seconds after damaging an enemy with Bombardment."},
      ],
      "6": [
        {format: "The attack speed of Punish and Slash are increased by 50%% and deal 15000%% of your Thorns damage to the first enemy hit."},
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
        {format: "Increases Death's Breath drops by 1."},
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
        {format: "Arcane, Cold, Fire, and Lightning attacks each increase all of your resistances by 25%% for 8 seconds."},
      ],
      "6": [
        {format: "Attacks increase your damage by 2000%% for 8 seconds. Arcane, Cold, Fire, and Lightning attacks each add one stack. At 4 stacks, each different elemental attack extends the duration by 2 seconds, up to a maximum of 8 seconds."},
      ],
    },
  },

  vyr: {
    name: "Vyr's Amazing Arcana",
    order: ["chestarmor", "pants", "gloves", "boots", "helm", "shoulders"],
    tclass: "wizard",
    bonuses: {
      "2": [
        {format: "Archon gains the effect of every rune."},
      ],
      "4": [
        {format: "Archon stacks also increase your Attack Speed, Armor, and Resistances by 1%%."},
      ],
      "6": [
        {format: "You gain 1 Archon stack when you hit with an Archon ability and Archon stacks also reduce damage taken by 0.15%% and have their damage bonus increased to 100%%."},
      ],
    },
  },

  firebird: {
    name: "Firebird's Finery",
    class: "wizard",
    order: ["chestarmor", "pants", "source", "shoulders", "helm", "gloves", "boots"],
    bonuses: {
      "2": [
        {format: "When you die, a meteor falls from the sky and revives you. This effect has a 60 second cooldown."},
      ],
      "4": [
        {format: "Dealing Fire damage with one of your skills causes the enemy to take 1000%% weapon damage as Fire per second for 3 seconds. This effect can be repeated a second and third time by different skills. If an enemy is burning due to three different skills simultaneously the enemy will Ignite, taking 3000%% weapon damage per second until they die."},
      ],
      "6": [
        {format: "Your damage is increased by 200%% and damage taken reduced by 3%% for each enemy that is Ignited. This effect can stack up to 20 times. You always receive the maximum bonus whenever a nearby Elite monster is Ignited."},
      ],
    },
  },

  natalya: {
    name: "Natalya's Vengeance",
    tclass: "demonhunter",
    order: ["helm", "cloak", "boots", "gloves", "handcrossbow", "pants", "ring"],
    bonuses: {
      "2": [
        {format: "Reduce the cooldown of Rain of Vengeance by 4 seconds when you hit with a Hatred-generating attack or Hatred-spending attack."},
      ],
      "4": [
        {format: "Rain of Vengeance deals 100% increased damage."},
      ],
      "6": [
        {format: "After casting Rain of Vengenace, deal 14000%% increased damage and take 60%% reduced damage for 10 seconds."},
      ],
    },
  },

  shadow: {
    name: "The Shadow’s Mantle",
    order: ["chestarmor", "pants", "gloves", "boots"],
    tclass: "demonhunter",
    bonuses: {
      "2": [
        {format: "While equipped with a melee weapon, your damage is increased by 6000%%."},
      ],
      "4": [
        {format: "Shadow Power gains the effect of every rune and lasts forever."},
      ],
      "6": [
        {format: "Impale deals an additional 75000% weapon damage to the first enemy hit."},
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
        {format: "Sentries deal 400% increased damage and cast Elemental Arrow, Chakram, Impale, Multishot, and Cluster Arrow when you do."},
      ],
      "6": [
        {format: "Your primary skills, Elemental Arrow, Chakram, Impale, Multishot, Cluster Arrow, Companions, and Vengeance deal 12000%% increased damage for every active Sentry."},
      ],
    },
  },

  zunimassa: {
    name: "Zunimassa's Haunt",
    order: ["gloves", "boots", "voodoomask", "chestarmor", "pants", "mojo", "ring"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {format: "Your Fetish Army lasts until they die and the cooldown of your Fetish Army is reduced by 80%."},
      ],
      "4": [
        {format: "You and your pets take 3% less damage for every Fetish you have alive."},
      ],
      "6": [
        {format: "Enemies hit by your Mana spenders take 15000%% more damage from your pets for 8 seconds."},
      ],
    },
  },

  helltooth: {
    name: "Helltooth Harness",
    class: "witchdoctor",
    order: ["gloves", "boots", "pants", "shoulders", "helm", "chestarmor"],
    bonuses: {
      "2": [
        {format: "Enemies hit by your primary skills, Acid Cloud, Firebats, Zombie Charger, Zombie Dogs, Gargantuan, Grasp of the Dead, Piranhas, or Wall of Death are afflicted by Necrosis, becoming Slowed and taking 3000%% weapon damage every second for 10 seconds."},
      ],
      "4": [
        {format: "After applying Necrosis to an enemy, you take 60%% reduced damage for 10 seconds."},
      ],
      "6": [
        {format: "After casting Wall of Death, gain 9000%% increased damage for 15 seconds to your primary skills, Acid Cloud, Firebats, Zombie Charger, Zombie Dogs, Gargantuan, Grasp of the Dead, Piranhas, and Wall of Death."},
      ],
    },
  },

  jadeharvester: {
    name: "Raiment of the Jade Harvester",
    order: ["pants", "shoulders", "gloves", "chestarmor", "boots", "helm"],
    tclass: "witchdoctor",
    bonuses: {
      "2": [
        {format: "When Haunt lands on an enemy already affected by Haunt, it instantly deals 3500 seconds worth of Haunt damage."},
      ],
      "4": [
        {format: "Soul Harvest gains the effect of every rune and has its cooldown reduced by 1 second every time you cast Haunt or Locust Swarm."},
      ],
      "6": [
        {format: "Soul Harvest reduces damage taken by 50% for 12 seconds and consumes your damage over time effects on enemies, instantly dealing 10,000 seconds worth of remaining damage."},
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
        {format: "While both Wrath of the Berserker and Call of the Ancients are active, you deal 4000% increased damage."},
      ],
    },
  },

  earth: {
    name: "Might of the Earth",
    order: ["helm", "gloves", "shoulders", "pants"],
    tclass: "barbarian",
    bonuses: {
      "2": [
        {format: "Reduce the cooldown of Earthquake, Avalanche, Leap, and Ground Stomp by 1 second for every 30 Fury you spend with an attack."},
      ],
      "4": [
        {format: "Leap causes an Earthquake when you land. Additionally, Leap gains the effect of the Iron Impact rune and the rune's effect and duration are increased by 150%%."},
      ],
      "6": [
        {format: "Increase the damage of Earthquake, Avalanche, Leap, Ground Stomp, Ancient Spear and Seismic Slam by 20000%%."},
      ],
    },
  },

  raekor: {
    name: "The Legacy of Raekor",
    class: "barbarian",
    order: ["pants", "shoulders", "chestarmor", "boots", "helm", "gloves"],
    bonuses: {
      "2": [
        {format: "Furious Charge refunds a charge if it hits only 1 enemy."},
      ],
      "4": [
        {format: "Furious Charge gains the effect of every rune and deals 1000%% increased damage."},
      ],
      "6": [
        {format: "Every use of Furious Charge increases the damage of your next Fury-spending attack by 5500%%. This effect stacks. Every use of a Fury-spending attack consumes up to 5 stacks."},
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
        {format: "Gain the five runed Mystic Allies at all times and your damage is increased by 750%% for each Mystic Ally you have out."},
      ],
    },
  },

  sunwuko: {
    name: "Monkey King's Garb",
    order: ["shoulders", "helm", "gloves", "amulet"],
    tclass: "monk",
    bonuses: {
      "2": [
        {format: "Your damage taken is reduced by 50%% while Sweeping Wind is active."},
      ],
      "4": [
        {format: "Every second Sweeping Wind spawns a decoy next to the last enemy you hit that taunts nearby enemies and then explodes for 1000%% weapon damage for each stack of Sweeping Wind you have."},
      ],
      "6": [
        {format: "Lashing Tail Kick, Tempest Rush, and Wave of Light have their damage increased by 1500%% for each stack of Sweeping Wind you have."},
      ],
    },
  },

  storms: {
    name: "Raiment of a Thousand Storms",
    class: "monk",
    order: ["boots", "gloves", "chestarmor", "shoulders", "helm", "pants"],
    bonuses: {
      "2": [
        {format: "Your Spirit Generators have 25%% increased attack speed and 400%% increased damage."},
      ],
      "4": [
        {format: "Dashing Strike now spends 75 Spirit, but refunds a Charge when it does."},
      ],
      "6": [
        {format: "Your Spirit Generators increase the weapon damage of Dashing Strike to 60000%% for 6 seconds and Dashing Strike increases the damage of your Spirit Generators by 6000%% for 6 seconds."},
      ],
    },
  },

  akkhan: {
    name: "Armor of Akkhan",
    class: "crusader",
    order: ["chestarmor", "pants", "gloves", "helm", "shoulders", "boots"],
    bonuses: {
      "2": [
        {format: "Reduce the cost of all abilities by 50%% while Akarat's Champion is active."},
      ],
      "4": [
        {format: "Reduce the cooldown of Akarat's Champion by 50%%."},
      ],
      "6": [
        {format: "While Akarat's Champion is active, you deal 1500%% increased damage and take 50%% less damage."},
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
        {format: "Increase the damage of Shield Bash and Sweep Attack by 13000%%."},
      ],
      "6": [
        {format: "Every use of Shield Bash or Sweep Attack that hits an enemy grants 75%% increased Attack Speed and 15%% damage reduction for 8 seconds. This effect stacks up to 5 times."},
      ],
    },
  },

  magnumopus: {
    name: "Delsere's Magnum Opus",
    class: "wizard",
    order: ["gloves", "boots", "pants", "helm", "shoulders", "chestarmor"],
    bonuses: {
      "2": [
        {format: "Casting Arcane Orb, Energy Twister, Explosive Blast, Magic Missile, Shock Pulse, Spectral Blade, or Wave of Force reduces the cooldown of Slow Time by 3 seconds."},
      ],
      "4": [
        {format: "You take 60%% reduced damage while you have a Slow Time active. Allies inside your Slow Time gain half benefit."},
      ],
      "6": [
        {format: "Enemies affected by your Slow Time and for 5 seconds after exiting take 8500%% increased damage from your Arcane Orb, Energy Twister, Explosive Blast, Magic Missile, Shock Pulse, Spectral Blade, and Wave of Force abilities."},
      ],
    },
  },

  unhallowed: {
    name: "Unhallowed Essence",
    class: "demonhunter",
    order: ["helm", "boots", "pants", "shoulders", "chestarmor", "gloves"],
    bonuses: {
      "2": [
        {format: "Your generators generate 2 additional Hatred and 1 Discipline."},
      ],
      "4": [
        {format: "Gain 60%% damage reduction and deal 60%% increased damage for 8 seconds if no enemy is within 10 yards of you."},
      ],
      "6": [
        {format: "Your generators, Multishot and Vengeance deal 350%% increased damage for every point of Discipline you have."},
      ],
    },
  },

  wastes: {
    name: "Wrath of the Wastes",
    class: "barbarian",
    order: ["chestarmor", "gloves", "pants", "helm", "boots", "shoulders"],
    bonuses: {
      "2": [
        {format: "Increase the damage per second of Rend by 500%% and its duration to 15 seconds."},
      ],
      "4": [
        {format: "During Whirlwind and for 3 seconds after, you gain 50%% damage reduction and your applied Rends deal triple damage."},
      ],
      "6": [
        {format: "Whirlwind gains the effect of the Dust Devils rune and all Whirlwind damage is increased by 10000%%."},
      ],
    },
  },

  light: {
    name: "Seeker of the Light",
    class: "crusader",
    order: ["chestarmor", "gloves", "pants", "helm", "boots", "shoulders"],
    bonuses: {
      "2": [
        {format: "Every use of Blessed Hammer that hits an enemy reduces the cooldown of Falling Sword and Provoke by 1 second."},
      ],
      "4": [
        {format: "You take 50%% less damage for 8 seconds after landing with Falling Sword."},
      ],
      "6": [
        {format: "Increase the damage of Blessed Hammer by 12000%% and Falling Sword by 1000%%."},
      ],
    },
  },

  uliana: {
    name: "Uliana's Stratagem",
    class: "monk",
    order: ["chestarmor", "gloves", "pants", "helm", "boots", "shoulders"],
    bonuses: {
      "2": [
        {format: "Every third hit of your Spirit Generators applies Exploding Palm."},
      ],
      "4": [
        {format: "Your Seven-Sided Strike deals 777%% its total damage with each hit."},
      ],
      "6": [
        {format: "Increase the damage of your Exploding Palm by 9000%% and your Seven-Sided Strike detonates your Exploding Palm."},
      ],
    },
  },

  arachyr: {
    name: "Spirit of Arachyr",
    class: "witchdoctor",
    order: ["chestarmor", "gloves", "pants", "helm", "boots", "shoulders"],
    bonuses: {
      "2": [
        {format: "Summon a permanent Spider Queen who leaves behind webs that deal 4000%% weapon damage over 5 seconds and Slows enemies. The Spider Queen is commanded to move to where you cast your Corpse Spiders."},
      ],
      "4": [
        {format: "Hex gains the effect of the Toad of Hugeness rune. After summoning a Toad of Hugeness is active, you gain 50%% damage reduction and heal for 10%% of your maximum Life per second for 15 seconds."},
      ],
      "6": [
        {format: "The damage of your creature skills is increased by 9000%%. Creature skills are Corpse Spiders, Plague of Toads, Firebats, Locust Swarm, Hex, and Piranhas."},
      ],
    },
  },

  norvald: {
    name: "Norvald's Fervor",
    class: "crusader",
    order: ["flail2h", "crusadershield"],
    bonuses: {
      "2": [
        {format: "Increases the duration of Steed Charge by 2 seconds. In addition, killing an enemy reduces the cooldown of Steed Charge by 1 second."},
        {format: "Gain 100%% increased damage while using Steed Charge and for 5 seconds after it ends."},
      ],
    },
  },

  rathma: {
    name: "Bones of Rathma",
    class: "necromancer",
    order: [],
    bonuses: {
      "2": [
        {format: "Your minions have a chance to reduce the cooldown of Army of the Dead by 1 second each time they deal damage."},
      ],
      "4": [
        {format: "You gain 1%% damage reduction for 15 seconds each time one of your minions deal damage. Max 50 stacks."},
      ],
      "6": [
        {format: "Each active Skeletal Mage increases the damage of your minions and Army of the Dead by 1000%% up to a max of 4000%%."},
      ],
    },
  },

  trangoul: {
    name: "Trag'Oul's Avatar",
    class: "necromancer",
    order: [],
    bonuses: {
      "2": [
        {format: "Blood Rush gains the effect of every rune."},
      ],
      "4": [
        {format: "While at full Life, your healing from skills is added to your maximum Life for 45 seconds, up to 100%% more."},
      ],
      "6": [
        {format: "Your Life-spending abilities deal 3800%% increased damage and your healing from skills is increased by 100%%."},
      ],
    },
  },

  inarius: {
    name: "Grace of Inarius",
    class: "necromancer",
    order: [],
    bonuses: {
      "2": [
        {format: "Bone Armor damage is increased by 1000%%."},
      ],
      "4": [
        {format: "Bone Armor grants an additional 2%% damage reduction per enemy hit."},
      ],
      "6": [
        {format: "Bone Armor also activates a swirling tornado of bone, damaging nearby enemies for 1000%% weapon damage and increasing the damage they take from the Necromancer by 3750%%."},
      ],
    },
  },

  pestilence: {
    name: "Pestilence Master's Shroud",
    class: "necromancer",
    order: [],
    bonuses: {
      "2": [
        {format: "Each corpse you consume fires a Corpse Lance at a nearby enemy."},
      ],
      "4": [
        {format: "Each enemy you hit with Bone Spear, Corpse Lance and Corpse Explosion reduces your damage taken by 2%%, up to a maximum of 50%%. Lasts 15 seconds."},
      ],
      "6": [
        {format: "Each corpse you consume grants you an Empowered Bone Spear charge that increases the damage of your next Bone Spear by 3300%%. In addition, Corpse Lance and Corpse Explosion damage is increased by 1650%%."},
      ],
    },
  },

  jesseth: {
    name: "Jesseth Arms",
    class: "necromancer",
    order: [],
    bonuses: {
      "2": [
        {format: "When the target of your Command Skeletons dies, your skeletons are automatically commanded to attack a nearby target."},
        {format: "While your skeletons are commanded to attack a target, all of your minions deal 400%% increased damage."},
      ],
    },
  },

};

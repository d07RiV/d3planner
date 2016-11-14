if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.partybuffs.items = {
  leg_overwhelmingdesire: {
  },
  leg_odysseysend: {
    stat: "dmgtaken",
    classes: ["demonhunter"],
  },
  /*leg_calamity: {
    buffs: function() {return {dmgtaken: 20};},
    classes: ["demonhunter"],
  },*/
  leg_strongarmbracers: {
    stat: "dmgtaken",
  },
  leg_oculusring: {
    stat: "damage",
  },
  leg_oculusring_p2: {
    stat: "dmgmul",
  },
  toxin: {
    buffs: function() {return {dmgtaken: 10};},
  },
  iceblink: {
    buffs: function() {return {chctaken: 10};},
  },
};
DiabloCalc.partybuffs.followers = {
  templar_loyalty: {
    category: "Templar",
    name: "Loyalty",
    icon: 0,
    level: 10,
    desc: ["Regenerates 6437 Life per second for you and the Templar."],
    buffs: function(stats) {
      return {regen: 6437};
    },
  },
  templar_inspire: {
    category: "Templar",
    name: "Inspire",
    icon: 1,
    level: 20,
    desc: ["Increases your resource generation.", "Mana: 7 per second.<br/>Hatred: 1 per second.<br/>Wrath: 1.1 per second.<br/>Arcane Power: 1.4 per second.<br/>Fury: 10% generated.<br/>Spirit: 10% generated."],
    buffs: function(stats) {
      switch (DiabloCalc.charClass) {
      case "wizard": return {apregen: 1.4};
      case "demonhunter": return {hatredregen: 1};
      case "witchdoctor": return {manaregen: 7};
      case "barbarian": return {resourcegen: 10};
      case "monk": return {resourcegen: 10};
      case "crusader": return {wrathregen: 1.1};
      }
    },
  },
  scoundrel_hysteria: {
    category: "Scoundrel",
    name: "Hysteria",
    icon: 2,
    level: 20,
    desc: ["Whenever you or the Scoundrel land a Critical Hit, you both will go into hysterics, increasing all damage done by 3% for 3 seconds."],
    buffs: function(stats) {
      return {damage: 3};
    },
  },
  scoundrel_anatomy: {
    category: "Scoundrel",
    name: "Anatomy",
    icon: 3,
    level: 20,
    desc: ["Increases Critical Hit Chance by 1.8% for you and the Scoundrel."],
    buffs: function(stats) {
      return {chc: 1.8};
    },
  },
  enchantress_missileward: {
    category: "Enchantress",
    name: "Missile Ward",
    icon: 4,
    level: 10,
    desc: ["Buffs you and the Enchantress, reducing damage from ranged attacks by 6%."],
    buffs: function(stats) {
      return {rangedef: 6};
    },
  },
  enchantress_poweredarmor: {
    category: "Enchantress",
    name: "Powered Armor",
    icon: 5,
    level: 10,
    desc: ["Buffs you and the Enchantress, increasing Armor by 3% and slowing melee attackers by 60% for 1 second."],
    buffs: function(stats) {
      return {armor_percent: 3};
    },
  },
  enchantress_erosion: {
    category: "Enchantress",
    name: "Erosion",
    icon: 6,
    level: 15,
    desc: ["Cooldown: 15 seconds", "Conjures a pool of energy that deals 330% weapon damage as Arcane over 5 seconds. Affected enemies will also take 3% increased damage."],
    buffs: function(stats) {
      return {dmgtaken: 3};
    },
  },
  enchantress_focusedmind: {
    category: "Enchantress",
    name: "Focused Mind",
    icon: 7,
    level: 20,
    desc: ["A 40 yard aura that increases attack speed for you and the Enchantress by 3%."],
    buffs: function(stats) {
      return {ias: 3};
    },
  },
};
DiabloCalc.partybuffs.shrines = {
  shrine_blessed: {
    category: "Shrines",
    name: "Blessed",
    icon: 8,
    desc: ["You take less damage from attacks.", "2 minutes left"],
    buffs: function(stats) {
      return {dmgred: 25};
    },
  },
  shrine_empowered: {
    category: "Shrines",
    name: "Empowered",
    icon: 9,
    desc: ["Your resource regeneration is increased and your cooldowns are reduced.", "2 minutes left"],
    buffs: function(stats) {
      return {cdr: 50, resourcegen: 100};
    },
  },
  shrine_enlightened: {
    category: "Shrines",
    name: "Enlightened",
    icon: 10,
    desc: ["You gain more experience from monsters you kill.", "2 minutes left"],
    buffs: function(stats) {
      return {expmul: 25};
    },
  },
  shrine_fleeting: {
    category: "Shrines",
    name: "Fleeting",
    icon: 11,
    desc: ["You move faster with an increased pickup radius.", "2 minutes left"],
    buffs: function(stats) {
      return {extrams: 25, pickup: 25};
    },
  },
  shrine_fortune: {
    category: "Shrines",
    name: "Fortune",
    icon: 12,
    desc: ["Your chance to find magic items and gold is greatly increased.", "2 minutes left"],
    buffs: function(stats) {
      return {extrams: 25, pickup: 20};
    },
  },
  shrine_frenzied: {
    category: "Shrines",
    name: "Frenzied",
    icon: 13,
    desc: ["Your attack rate is greatly increased.", "2 minutes left"],
    buffs: function(stats) {
      return {ias: 25};
    },
  },
  pylon_casting: {
    category: "Pylons",
    name: "Dimensional Channeling",
    icon: 14,
    desc: ["Free casting and greatly reduced cooldowns.", "30 seconds left"],
    buffs: function(stats) {
      return {cdr: 75, rcr: 100};
    },
  },
  pylon_damage: {
    category: "Pylons",
    name: "Dimensional Power",
    icon: 15,
    desc: ["Greatly increased damage.", "30 seconds left"],
    buffs: function(stats) {
      return {damage: 300};
    },
  },
  /*pylon_electrified: {
    category: "Pylons",
    name: "Dimensional Conduit",
    icon: 16,
    desc: ["Electrocuting nearby enemies.", "15 seconds left"],
    buffs: function(stats) {
    },
  },*/
  /*pylon_invulnerable: {
    category: "Pylons",
    name: "Dimensional Shield",
    icon: 17,
    desc: ["Invulnerable to all damage and all control impairing effects. Incoming damage is redirected to nearby enemies.", "30 seconds left"],
    buffs: function(stats) {
      return {regen: 6437};
    },
  },*/
  pylon_running: {
    category: "Pylons",
    name: "Dimensional Speed",
    icon: 18,
    desc: ["Greatly increased movement speed. Can pass through enemies, damaging and knocking them up into the air. Can burst through walls summoned by Waller elites.", "60 seconds left"],
    buffs: function(stats) {
      return {extrams: 80, ias: 30};
    },
  },
};

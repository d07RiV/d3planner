DiabloCalc.minLevel = 70;
DiabloCalc.maxLevel = 70;

DiabloCalc.classes = {
  wizard: {
    name: "Wizard",
    primary: "int",
    imageSuffix: "wizard_male",
    resources: ["ap"],
  },
  demonhunter: {
    name: "Demon Hunter",
    primary: "dex",
    imageSuffix: "demonhunter_male",
    resources: ["hatred", "disc"],
  },
  barbarian: {
    name: "Barbarian",
    dualwield: true,
    primary: "str",
    imageSuffix: "barbarian_male",
    resources: ["fury"],
  },
  witchdoctor: {
    name: "Witch Doctor",
    primary: "int",
    imageSuffix: "witchdoctor_male",
    resources: ["mana"],
  },
  monk: {
    name: "Monk",
    dualwield: true,
    primary: "dex",
    imageSuffix: "monk_male",
    resources: ["spirit"],
  },
  crusader: {
    name: "Crusader",
    primary: "str",
    imageSuffix: "demonhunter_male",
    resources: ["wrath"],
  },
  templar: {
    name: "Templar",
    follower: true,
    primary: "str",
    imageSuffix: "demonhunter_male",
  },
  enchantress: {
    name: "Enchantress",
    follower: true,
    primary: "int",
    imageSuffix: "demonhunter_male",
  },
  scoundrel: {
    name: "Scoundrel",
    follower: true,
    primary: "dex",
    imageSuffix: "demonhunter_male",
  },
};


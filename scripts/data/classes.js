DiabloCalc.minLevel = 70;
DiabloCalc.maxLevel = 70;

DiabloCalc.classes = {
  wizard: {
    name: "Wizard",
    primary: "int",
    imageSuffix: "wizard_male",
    imageSuffixAlt: "wizard_female",
    resources: ["ap"],
  },
  demonhunter: {
    name: "Demon Hunter",
    primary: "dex",
    imageSuffix: "demonhunter_male",
    imageSuffixAlt: "demonhunter_female",
    resources: ["hatred", "disc"],
  },
  barbarian: {
    name: "Barbarian",
    dualwield: true,
    primary: "str",
    imageSuffix: "barbarian_male",
    imageSuffixAlt: "barbarian_female",
    resources: ["fury"],
  },
  witchdoctor: {
    name: "Witch Doctor",
    primary: "int",
    imageSuffix: "witchdoctor_male",
    imageSuffixAlt: "witchdoctor_female",
    resources: ["mana"],
  },
  monk: {
    name: "Monk",
    dualwield: true,
    primary: "dex",
    imageSuffix: "monk_male",
    imageSuffixAlt: "monk_female",
    resources: ["spirit"],
  },
  crusader: {
    name: "Crusader",
    primary: "str",
    imageSuffix: "demonhunter_male",
    imageSuffixAlt: "demonhunter_female",
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


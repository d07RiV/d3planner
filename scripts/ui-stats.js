(function() {

  var statList = [
    {
      name: "Attributes",
      stats: [
        {
          stat: "str",
          tooltip: "Strength: $1\n* Primary attribute for Barbarians and Crusaders.\n* Increases all damage for Barbarians and Crusaders by {$1;2%}.\n* Increases Armor by $1.",
        },
        {
          stat: "dex",
          tooltip: "Dexterity: $1\n* Primary attribute for Demon Hunters and Monks.\n* Increases all damage for Demon Hunters and Monks by {$1;2%}.\n* Increases Armor by $1.",
        },
        {
          stat: "int",
          tooltip: "Intelligence: $1\n* Primary attribute for Witch Doctors and Wizards.\n* Increases all damage for Witch Doctors and Wizards by {$1;2%}.\n* Increases resistances by {$1/10;1}.",
        },
        {
          stat: "vit",
          tooltip: "Vitality: $1\n* Increases Life, allowing more damage to be taken before dying.\n* Each point of Vitality increases Life by {info.hppervit}.",
        },
        {
          separator: true,
        },
        {
          name: "Damage",
          stat: "info.dps",
          tooltip: "Damage: {$1;2}\n* The amount of damage per second you can deal.\n* Damage is based on your weapons, attributes, attack speed, Critical Hit Chance,\nCritical Hit Damage, passive skills, and dual-wielding attack speed increase.",
        },
        {
          name: "Toughness",
          stat: "info.toughness",
          tooltip: "Toughness: $1\n* The total amount of raw damage you can take.\n* Toughness is based on your maximum Life, armor, dodge chance,\naverage resistances, and missile, melee, and elite damage reduction.",
        },
        {
          name: "Recovery",
          stat: "info.recovery",
          tooltip: "Recovery: $1\n* The amount of Toughness you can recover every second in combat.\n* Recovery is based on your Toughness and Healing.\n * Healing: {info.healing} Life healed per Second.\n * Healing is based on your Life per Hit, Life per Second, Life Steal, Life per\nFury/Spirit/Wrath Spent, Life per Kill, and Health Globe Healing Bonus.",
        },
      ],
    },
    {
      name: "Offense",
      stats: [
        {
          name: "Damage Increased by Skills",
          stat: "damage",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          tooltip: "All damage increased by: $1\n* Increased by your skills.",
        },
        {
          stat: "edmg",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "All damage to elites and other players increased by: $1\n* Increased by your items.",
        },
        {
          name: "Attacks per Second",
          stat: "info.mainhand.speed",
          decimal: 2,
          tooltip: "Attacks per Second: $1\n* Based on weapon speed.\n* Can be increased by skills and items.",
        },
        {
          name: "Off Hand Attacks per Second",
          stat: "info.offhand.speed",
          decimal: 2,
          collapse: true,
          tooltip: "Attacks per Second: $1\n* Based on weapon speed.\n* Can be increased by skills and items.",
        },
        {
          stat: "ias",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Attack Speed Increase: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "chc",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Critical Hit Chance: $1\n* Critical hits deal {chd;2%} bonus damage.\n* Can be increased by skills and items.",
        },
        {
          stat: "chd",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          plus: true,
          tooltip: "Critical Hit Damage Bonus: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "area",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Area Damage: $1\n* All attacks have a {20;%} chance to also deal $1 of the damage to enemies within {10} yards.\n* Damage dealt can be increased by items.",
        },
        {
          stat: "cdr",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Cooldown Reduction: $1\n* Reduces cooldowns of all active skills.",
        },
        {
          stat: "dmgphy",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Physical Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Physical Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmgfir",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Fire Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Fire Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmgcol",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Cold Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Cold Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmglit",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Lightning Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Lightning Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmgarc",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Arcane Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Arcane Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmgpsn",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Poison Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Poison Damage: {info.dps*(1+0.01*$1)}.",
        },
        {
          stat: "dmghol",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          collapse: true,
          tooltip: "Holy Damage Increase: $1\n* Increases Damage dealt by skills using this element.\n* Holy Damage: {info.dps*(1+0.01*$1)}.",
        },

        {
          separator: true,
        },
      
        {
          name: "Weapon Damage",
          stat: "info.mainhand.dph",
          tooltip: "Weapon Damage: $1\n* Average main hand weapon damage per hit.\n* White damage: {info.mainhand.wpnphy.min}-{info.mainhand.wpnphy.max}.\n* Critical damage: {info.mainhand.wpnphy.min*(1+0.01*chd)}-{info.mainhand.wpnphy.max*(1+0.01*chd)}\n* Elemental damage: {$1*(1+0.01*info.elemental)}.\n* Elite damage: {$1*(1+0.01*edmg)}.\n* Elemental elite damage: {$1*(1+0.01*info.elemental)*(1+0.01*edmg)}.",
        },
        {
          name: "Elemental DPS",
          stat: "info.elementaldps",
          tooltip: "Elemental Damage per Second: $1\n* Damage per Second with the highest elemental damage bonus.",
        },
        {
          name: "Elite DPS",
          stat: "info.edps",
          tooltip: "Elite Damage per Second: $1\n* Damage per Second against Elites and other players.\n* Elemental elite DPS: {$1*(1+0.01*info.elemental)}.",
        },
        {
          name: "DPS per 100 Intelligence",
          stat: "info.dpsperint",
          collapse: true,
          tooltip: "Damage per 100 Intelligence: $1\n* Elemental Damage per Second gained per 100 points of Intelligence.",
        },
        {
          name: "DPS per 100 Dexterity",
          stat: "info.dpsperdex",
          collapse: true,
          tooltip: "Damage per 100 Dexterity: $1\n* Elemental Damage per Second gained per 100 points of Dexterity.",
        },
        {
          name: "DPS per 100 Strength",
          stat: "info.dpsperstr",
          collapse: true,
          tooltip: "Damage per 100 Strength: $1\n* Elemental Damage per Second gained per 100 points of Strength.",
        },
        {
          name: "DPS per Crit Chance",
          stat: "info.dpsperchc",
          tooltip: "Damage per Crit Chance: $1\n* Elemental Damage per Second gained per one percent of Critical Hit Chance.",
        },
        {
          name: "DPS per Crit Damage",
          stat: "info.dpsperchd",
          tooltip: "Damage per Crit Damage: $1\n* Elemental Damage per Second gained per one percent of Critical Hit Damage.",
        },
        {
          name: "DPS per Attack Speed",
          stat: "info.dpsperias",
          tooltip: "Damage per Attack Speed: $1\n* Elemental Damage per Second gained per one percent of Attack Speed.",
        },
        {
          name: "DPS per Elemental Damage",
          stat: "info.dpsperelem",
          tooltip: "Damage per Elemental Damage: $1\n* Elemental Damage per Second gained per one percent of Elemental Damage.",
        },

        {
          separator: true,
        },

        {
          name: "Enemy Damage Taken",
          stat: "dmgtaken",
          decimal: 2,
          percent: true,
          collapse: true,
          tooltip: "Damage received by the enemies increased by: $1\n* Increased by skills and items.",
        },
        {
          name: "Damage Multiplier",
          stat: "info.dmgmul",
          decimal: 2,
          sourcestat: "dmgmul",
          percent: true,
          collapse: true,
          tooltip: "All damage done increased by: $1\n* Increased by skills and items.\n* Stacks multiplicatively with all other buffs.",
        },
        {
          name: "Effective DPS",
          stat: "final.dps",
          tooltip: "Effective Damage: $1\n* The amount of damage per second taken by the enemies after all damage bonuses.\n* Elemental damage: {$1*(1+0.01*info.elemental)}.\n* Elite damage: {$1*(1+0.01*edmg)}.\n* Elemental elite damage: {$1*(1+0.01*info.elemental)*(1+0.01*edmg)}.",
        },
        {
          name: "Effective DPH",
          stat: "final.dph",
          tooltip: "Effective Damage per Hit: $1\n* The amount of damage taken by the enemies by every basic attack after all damage bonuses.\n* Elemental damage: {$1*(1+0.01*info.elemental)}.\n* Elite damage: {$1*(1+0.01*edmg)}.\n* Elemental elite damage: {$1*(1+0.01*info.elemental)*(1+0.01*edmg)}.",
        },
      ],
    },

    {
      name: "Defense",
      stats: [
        {
          stat: "armor",
          tooltip: "Armor: $1\n* Reduces all damage from enemies of the same level as you by {100*(1-info.armor_factor);2%}.",
        },
        {
          stat: "blockamount",
          tooltip: "Block Amount: {blockamount}\n* The amount of damage prevented whenever an attack is blocked.\n* Block amount can be increased by skills and items.",
        },
        {
          stat: "block",
          decimal: 1,
          percent: true,
          tooltip: "Block Chance: $1\n* The chance to block incoming attacks.\n* Blocked attacks have their damage reduced by {blockamount}.\n* Block chance can be increased by skills and items.\n* You may have a maximum of {75;2%} Block Chance.",
        },
        {
          stat: "dodge",
          decimal: 1,
          percent: true,
          tooltip: "Block Chance: $1\n* The chance to dodge incoming attacks.\n* Dodged attacks do no damage.\n* Dodge chance can be increased by skills and items.",
        },
        {
          stat: "resphy",
          tooltip: "Physical Resistance: $1\n* Reduces Physical damage from level {info.level} enemies by {100*(1-info.resphy_factor);2%}.",
        },
        {
          stat: "rescol",
          tooltip: "Cold Resistance: $1\n* Reduces Cold damage from level {info.level} enemies by {100*(1-info.rescol_factor);2%}.",
        },
        {
          stat: "resfir",
          tooltip: "Fire Resistance: $1\n* Reduces Fire damage from level {info.level} enemies by {100*(1-info.resfir_factor);2%}.",
        },
        {
          stat: "reslit",
          tooltip: "Lightning Resistance: $1\n* Reduces Lightning damage from level {info.level} enemies by {100*(1-info.reslit_factor);2%}.",
        },
        {
          stat: "respsn",
          tooltip: "Poison Resistance: $1\n* Reduces Poison damage from level {info.level} enemies by {100*(1-info.respsn_factor);2%}.",
        },
        {
          stat: "resarc",
          tooltip: "Arcane/Holy Resistance: $1\n* Reduces Arcane and Holy damage from level {info.level} enemies by {100*(1-info.resarc_factor);2%}.",
        },
        {
          stat: "ccr",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Crowd Control Reduction: $1\n* Reduces the duration of control impairing effects, including Stun, Slow, Freeze, Fear and Charm.",
        },
        {
          stat: "rangedef",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Missile Damage Reduction: $1\n* Reduces damage from missile attacks.",
        },
        {
          stat: "meleedef",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Melee Damage Reduction: $1\n* Reduces damage from melee attacks.",
        },
        {
          stat: "edef",
          decimal: 2,
          sourcedecimal: 1,
          percent: true,
          tooltip: "Elite Damage Reduction: $1\n* Reduces damage from elite monsters and other players.",
        },
        {
          name: "Thorns",
          stat: "info.thorns",
          decimal: 2,
          sourcestat: "thorns",
          sourcedecimal: 0,
          tooltip: "Thorns: $1\n* Deals damage to attackers when hit by melee or ranged attacks.\n* Damage dealt is increased by a portion of your primary attribute.",
        },

        {
          separator: true,
        },

        {
          name: "Damage Reduction",
          stat: "dmgred",
          percent: true,
          collapse: true,
          tooltip: "Damage Reduction: $1\n* Increased by skills and items.",
        },
        {
          name: "Magic Damage Reduction",
          stat: "nonphys",
          percent: true,
          collapse: true,
          tooltip: "Non-Physical Damage Reduction: $1\n* Increased by skills and items.",
        },

        {
          name: "T. per 100 Vitality",
          stat: "info.toughpervit",
          tooltip: "Toughness per 100 Vitality: $1\n* Toughness gained per 100 points of Vitality.",
        },
        {
          name: "T. per Life Bonus",
          stat: "info.toughperlife",
          tooltip: "Toughness per Life Bonus: $1\n* Toughness gained per one percent of Total Life Bonus.",
        },
        {
          name: "T. per 100 Armor",
          stat: "info.toughperarmor",
          tooltip: "Toughness per 100 Armor: $1\n* Toughness gained per 100 points of Armor.\n* Toughness per one percent of Armor: {info.toughperarmor*(0.01*armor)/100}",
        },
        {
          name: "T. per 100 Resistances",
          stat: "info.toughperres",
          tooltip: "Toughness per 100 Resistances: $1\n* Toughness gained per 100 points of Resistance to All Elements.",
        },
      ],
    },

    {
      name: "Life",
      stats: [
        {
          name: "Maximum Life",
          stat: "info.hp",
          tooltip: "Maximum Life: $1\n* If you lose all your Life, you die.\n* Life can be increased by skills, items, and Vitality.",
        },
        {
          name: "Total Life Bonus",
          stat: "life",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          plus: true,
          tooltip: "Total Life Bonus: $1\n* In addition to Life from Vitality, your overall Life is increased by an additional $1.",
        },
        {
          stat: "regen",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life Regen per Second: $1\n* The amount of Life recovered each second.",
        },
        {
          stat: "lph",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life per Hit: $1\n* You will recover $1 Life for every enemy you hit.\n* Life per Hit can be increased by skills and items.",
        },
        {
          stat: "laek",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life per Kill: $1\n* You will recover $1 Life for every enemy you kill.\n* Life per Kill can be increased by skills and items.",
        },
        {
          stat: "lifespirit",
          classes: ["monk"],
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life per Spirit Spent: $1\n* You will recover $1 Life for every point of Spirit you spend.",
        },
        {
          stat: "lifefury",
          classes: ["barbarian"],
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life per Fury Spent: $1\n* You will recover $1 Life for every point of Fury you spend.",
        },
        {
          stat: "lifewrath",
          classes: ["crusader"],
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Life per Wrath Spent: $1\n* You will recover $1 Life for every point of Wrath you spend.",
        },
        {
          stat: "healbonus",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Health Globe Healing Bonus: $1\n* Picking up a health globe or using a potion heals you for additional Life.",
        },
        {
          stat: "pickup",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Bonus to Gold/Globe Radius: $1 yards\n* You will automatically pick up gold and health globes from farther away.",
        },
      ],
    },
    {
      name: "Resource",
      stats: [
        {
          stat: "maxap",
          classes: ["wizard"],
          tooltip: "Maximum Arcane Power: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Arcane Regeneration/Second",
          stat: "apregen",
          decimal: 1,
          classes: ["wizard"],
          tooltip: "Arcane Power Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_ap",
          classes: ["wizard"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Arcane Power Cost Reduction: $1\n* Can be increased by items.",
        },
        {
          stat: "apoc",
          classes: ["wizard"],
          tooltip: "Arcane Power on Critical Hit: $1\n* Can be increased by skills and items.",
        },

        {
          stat: "maxhatred",
          classes: ["demonhunter"],
          tooltip: "Maximum Hatred: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Hatred Regeneration/Second",
          stat: "hatredregen",
          decimal: 2,
          classes: ["demonhunter"],
          tooltip: "Hatred Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_hatred",
          classes: ["demonhunter"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Hatred Cost Reduction: $1\n* Can be increased by items.",
        },
        {
          stat: "maxdisc",
          classes: ["demonhunter"],
          tooltip: "Maximum Discipline: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_disc",
          classes: ["demonhunter"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Discipline Cost Reduction: $1\n* Can be increased by items.",
        },

        {
          stat: "maxmana",
          classes: ["witchdoctor"],
          tooltip: "Maximum Mana: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Mana Regeneration/Second",
          stat: "manaregen",
          decimal: 2,
          classes: ["witchdoctor"],
          tooltip: "Mana Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_mana",
          classes: ["witchdoctor"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Mana Cost Reduction: $1\n* Can be increased by items.",
        },

        {
          stat: "maxfury",
          classes: ["barbarian"],
          tooltip: "Maximum Fury: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Fury Regeneration/Second",
          stat: "furyregen",
          decimal: 2,
          classes: ["barbarian"],
          tooltip: "Fury Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_fury",
          classes: ["barbarian"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Fury Cost Reduction: $1\n* Can be increased by items.",
        },

        {
          stat: "maxspirit",
          classes: ["monk"],
          tooltip: "Maximum Spirit: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Spirit Regeneration/Second",
          stat: "spiritregen",
          decimal: 2,
          classes: ["monk"],
          tooltip: "Spirit Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_spirit",
          classes: ["monk"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Spirit Cost Reduction: $1\n* Can be increased by items.",
        },

        {
          stat: "maxwrath",
          classes: ["crusader"],
          tooltip: "Maximum Wrath: $1\n* Can be increased by skills and items.",
        },
        {
          name: "Wrath Regeneration/Second",
          stat: "wrathregen",
          decimal: 2,
          classes: ["crusader"],
          tooltip: "Wrath Regenerated per Second: $1\n* Can be increased by skills and items.",
        },
        {
          stat: "rcr_wrath",
          classes: ["crusader"],
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Wrath Cost Reduction: $1\n* Can be increased by items.",
        },
      ],
    },
    {
      name: "Adventure",
      stats: [
        {
          stat: "ms",
          decimal: 2,
          sourcedecimal: 0,
          percent: true,
          plus: true,
          tooltip: "Movement Speed: $1\n* You run at {100+$1;+2%} of base movement speed.\n* You may have a maximum of {25;+2%} movement speed from items.",
        },
        {
          stat: "gf",
          percent: true,
          plus: true,
          tooltip: "Gold Find: $1\n* Increases gold found on monsters.",
        },
        {
          stat: "mf",
          percent: true,
          plus: true,
          tooltip: "Magic Find: $1\n* Increases your chance to find higher-quality items.\n* This increase is diminished for rare and legendary and set items.\n* You may have a maximum of {300;+%} Magic Find.",
        },
        {
          stat: "expmul",
          decimal: 1,
          sourcedecimal: 0,
          percent: true,
          tooltip: "Bonus Experience: $1\n* Experience gains from killing monsters increased by $1.",
        },
        {
          stat: "expadd",
          decimal: 2,
          sourcedecimal: 0,
          tooltip: "Bonus Experience per Kill: $1\n* Every monster killed grants up to $1 additional experience.",
        },
      ],
    },
  ];

  function formatTip(stat, data) {
    var text = stat.tooltip;
    var values = data.getValue(stat.stat);
    text = text.replace(/{([^};]*)(?:;(\+)?([0-9])?(\%)?)?}/g, function(m, expr, plus, precision, percent) {
      expr = expr.replace(/\$([1-9])/g, function(m, index) {
        return (typeof values == "number" ? values : values[["min", "max"][parseInt(index) - 1]]);
      });
      expr = data.execString(expr);
      if (typeof expr === "number") {
        expr = DiabloCalc.formatNumber(expr, precision, 1000);
      } else {
        expr = DiabloCalc.formatNumber(expr.min, precision, 1000) + "-" + DiabloCalc.formatNumber(expr.max, precision, 1000);
      }
      return "<span class=\"d3-color-green\">" + (plus || "") + expr + (percent || "") + "</span>";
    });
    text = text.replace(/\$([1-9])/g, function(m, index) {
      return "<span class=\"d3-color-green\">" + (stat.plus ? "+" : "") + DiabloCalc.formatNumber(typeof values == "number" ?
        values : values[["min", "max"][parseInt(index) - 1]], stat.decimal, 1000) + (stat.percent ? "%" : "") + "</span>";
    });
    var first = "</span>";
    text = text.replace(/\n( ?\* )?/g, function(m, bullet) {
      var res = first + "<br/><span class=\"tooltip-icon-" + (bullet ? "bullet" : "nobullet") + "\"></span>";
      first = "";
      return res;
    });
    var srcstat = (stat.sourcestat || stat.stat);
    if (DiabloCalc.stats[srcstat]) {
      var sources = {};
      var limits = {};
      if (srcstat != "damage" && (!DiabloCalc.stats[srcstat].classes || DiabloCalc.stats[srcstat].classes.indexOf(DiabloCalc.charClass) >= 0) && DiabloCalc.getItemAffixes) {
        for (var slot in DiabloCalc.itemSlots) {
          var affixes = DiabloCalc.getItemAffixes(slot, true);
          if (affixes && affixes[srcstat] && affixes[srcstat].min && affixes[srcstat].max) {
            sources[slot] = 0;
            limits[slot] = affixes[srcstat];
          }
        }
      }
      if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].resist && data.sources.resall) {
        sources = $.extend(sources, data.sources.resall);
        for (var slot in data.sources.resall) {
          if (DiabloCalc.itemSlots[slot] && DiabloCalc.getItemAffixes) {
            var affixes = DiabloCalc.getItemAffixes(slot, true);
            if (affixes && affixes.resall && affixes.resall.min && affixes.resall.max) {
              limits[slot] = affixes.resall;
            }
          }
        }
      }
      if (data.sources[srcstat]) {
        sources = $.extend(sources, data.sources[srcstat]);
      }
      var exlist = [];
      if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].special) {
        exlist = data.getSpecial(srcstat, null, false, null);
      }

      if (!$.isEmptyObject(sources) || !$.isEmptyObject(exlist)) {
        text += first;
        text += "<br/><span class=\"tooltip-icon-bullet\"></span>" + (stat.sourcename || "Increased by") + ":";
        first = "";

        var decimal = (stat.sourcedecimal === undefined ? stat.decimal : stat.sourcedecimal);
        var percent = ((stat.sourcepercent === undefined ? stat.percent : stat.sourcepercent) ? "%" : "");
        function fmtNumber(amount) {
          return DiabloCalc.formatNumber(amount, decimal, 1000) + percent;
        }

        for (var src in sources) {
          if (DiabloCalc.sourceNames[src]) {
            text += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-" + (sources[src] ? "gold" : "gray") + "\">" + DiabloCalc.sourceNames[src] + "</span>: ";
            if (sources[src]) {
              text += "<span class=\"d3-color-green\">" + fmtNumber(sources[src]) + "</span>";
              if (limits[src]) {
                text += " <span class=\"d3-color-gray\">(" + fmtNumber(limits[src].min) + "-" + fmtNumber(limits[src].max) + ")</span>";
              }
            } else if (limits[src]) {
              text += "<span class=\"d3-color-gray\">" + fmtNumber(limits[src].min) + "-" + fmtNumber(limits[src].max) + "</span>";
            }
          }
        }
        for (var i = 0; i < exlist.length; ++i) {
          text += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-gold\">" + exlist[i][0] + "</span>: ";
          text += "<span class=\"d3-color-green\">" + fmtNumber(exlist[i][1]) + "</span>";
        }
      }
    }
    return "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + text + first + "</p></div>";
  }
  function highlightSlots(srcstat, data) {
    var sources = data.sources[srcstat] || {};
    if (DiabloCalc.onHighlight) DiabloCalc.onHighlight(true);
    if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].resist && data.sources.resall) {
      sources = $.extend(sources, data.sources.resall);
    }
    for (var slot in DiabloCalc.itemSlots) {
      if (sources[slot] || (DiabloCalc.itemSlots[slot].item && sources[DiabloCalc.itemSlots[slot].item.id])) {
        DiabloCalc.itemSlots[slot].dollFrame.addClass("highlight");
      }
    }
  }
  function highlightSlotsOff() {
    if (DiabloCalc.onHighlight) DiabloCalc.onHighlight(false);
    for (var slot in DiabloCalc.itemSlots) {
      if (DiabloCalc.itemSlots[slot].dollFrame) {
        DiabloCalc.itemSlots[slot].dollFrame.removeClass("highlight");
      }
    }
  }

  function onUpdateStats() {
    var data = DiabloCalc.getStats();
    var charClass = $(".char-class").val();
    for (var i = 0; i < statList.length; ++i) {
      for (var j = 0; j < statList[i].stats.length; ++j) {
        var info = statList[i].stats[j];
        if (info.separator) {
          continue;
        }
        if (info.classes && info.classes.indexOf(charClass) < 0) {
          info.line.hide();
          continue;
        }
        var value = data.getValue(info.stat);
        if (info.collapse && !value) {
          info.line.hide();
          continue;
        }
        if (typeof value === "number") {
          info.line.toggleClass("zero", !value);
          value = DiabloCalc.formatNumber(value, info.decimal, 1000);
        } else {
          info.line.toggleClass("zero", !value.min && !value.max);
          value = DiabloCalc.formatNumber(value.min, info.decimal, 1000) + "-" + DiabloCalc.formatNumber(value.max, info.decimal, 1000);
        }
        info.value.text((info.plus ? "+" : "") + value + (info.percent ? "%" : ""));
        info.line.show();
      }
    }
  }

  var tab = $(".col.statsframe");
  tab = DiabloCalc.addScroll(tab, "y");
  tab.append(DiabloCalc.account.makeLine());

  var offense = statList[1].stats;
  var sep = 0;
  while (sep < offense.length && !offense[sep].separator) {
    sep++;
  }
  for (var stat in DiabloCalc.stats) {
    if (DiabloCalc.stats[stat].skill) {
      offense.splice(sep, 0, {
        name: DiabloCalc.stats[stat].skill + " Damage Increase",
        stat: stat,
        decimal: 2,
        percent: true,
        classes: DiabloCalc.stats[stat].classes,
        collapse: true,
        tooltip: DiabloCalc.stats[stat].skill + " Damage Increase: $1\n* Increases Damage dealt by this skill.",
      });
    }
  }

  var container = $("<div class=\"col-container\"></div>");
  tab.append(container);
  var column = $("<div class=\"column\"></div>");
  container.append(column);
  var statMap = {};
  for (var i = 0; i < statList.length; ++i) {
    var section = $("<div class=\"stat-section\"></div>");
    column.append(section);
    section.append("<h3>" + statList[i].name + "</h3>");
    var ul = $("<ul class=\"flex\"></ul>");
    section.append(ul);
    for (var j = 0; j < statList[i].stats.length; ++j) {
      var info = statList[i].stats[j];
      info.line = $("<li></li>");
      statMap[info.stat] = info;
      ul.append(info.line);

      if (info.separator) {
        info.line.addClass("stat-separator");
        continue;
      }

      info.line.append("<span>" + (info.name || DiabloCalc.stats[info.stat].name) + "</span>");
      info.value = $("<span></span>");
      info.line.append(info.value);

      info.line.hover((function(info) {return function() {
        if (!DiabloCalc.getStats || !DiabloCalc.tooltip) {
          return;
        }
        var stats = DiabloCalc.getStats();
        DiabloCalc.tooltip.showHtml(this, formatTip(info, stats), "left");
        var srcstat = (info.sourcestat || info.stat);
        highlightSlots(srcstat, stats);
      };})(info), function() {
        if (!DiabloCalc.tooltip) {
          return;
        }
        DiabloCalc.tooltip.hide();
        highlightSlotsOff();
      });
    }
  }
  DiabloCalc.isKnownStat = function(stat) {
    return !!statMap[stat];
  };
  DiabloCalc.showStatTip = function(elem, stat) {
    if (statMap[stat]) {
      DiabloCalc.tooltip.showHtml(elem, formatTip(statMap[stat], DiabloCalc.getStats()));
    }
  };
  //column.append("<div class=\"stat-separator\"></div>");
  var second = $("<div class=\"column\"></div>");
  container.append(second);
  function recv() {
    tab.addClass("two-column");
  }
  function remv() {
    setTimeout(function() {
      if (second.is(":empty")) {
        tab.removeClass("two-column");
      }
    }, 0);
  }
  container.find(".column").sortable({
    containment: container,
    connectWith: ".col.statsframe .column",
    items: ".stat-section",
    handle: "h3",
    distance: 4,
    placeholder: "drop-ph",
    forcePlaceholderSize: true,
    start: recv,
    stop: remv,
  });
  /*second.sortable({
    over: recv,
    receive: recv,
    out: remv,
    remove: remv,
  });*/

  $(".col.statsframe h3").click(function() {
    $(this).next().slideToggle();
  });

  DiabloCalc.register("updateStats", onUpdateStats);
})();

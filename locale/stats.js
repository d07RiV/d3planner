_L.patch.add({
  elements: {
    arc: "UIToolTips/Damage_Arcane",
    col: "UIToolTips/Damage_Cold",
    fir: "UIToolTips/Damage_Fire",
    hol: "UIToolTips/Damage_Holy",
    lit: "UIToolTips/Damage_Lightning",
    phy: "UIToolTips/Damage_Physical",
    psn: "UIToolTips/Damage_Poison",
  },
  resources: {
    ap: "H2OLayout/Arcanum",
    disc: "H2OLayout/Discipline",
    fury: "H2OLayout/Fury",
    hatred: "H2OLayout/Hatred",
    mana: "H2OLayout/Mana",
    spirit: "H2OLayout/Spirit",
    wrath: "Tutorials/Resource_Faith_title",
  },
  statGroupNames: {
    weapon: "$StatGroups/Weapon Damage$",
    elemental: "$StatGroups/Elemental Damage$",
    resist: "$StatGroups/Elemental Resistance$",
    resistany: "$StatGroups/Resistance$",
    mainstat: "$StatGroups/Primary Attribute$",
    onhit: "$StatGroups/On Hit Effect$",
    resource: "$StatGroups/Resources$",
  },
  stats: {
    apoc: {
      format: "AttributeDescriptions/Resource_On_Crit#Arcanum@",
      name: "HeroDetails/ArcanePowerOnCrit",
    },
    apregen: {
      format: "AttributeDescriptions/Resource_Regen_Per_Second#Arcanum@",
      name: "$Stats/Hatred Regeneration$",
    },
    area: {
      format: "AttributeDescriptions/Splash_Damage_Effect_Percent@",
      name: "HeroDetails/SplashDamage",
    },
    armor: {
      format: "AttributeDescriptions/Armor_Bonus_Item@",
      name: "HeroDetails/Armor",
    },
    armor_percent: {
      name: "HeroDetails/Armor",
    },
    basearmor: {
      name: "$Stats/Base Armor$",
    },
    baseblock: {
      format: "AttributeDescriptions/Block_Chance_Bonus_Item@",
      name: "$Stats/Base Chance to Block$",
    },
    bleed: {
      format: "AttributeDescriptions/Weapon_On_Hit_Percent_Bleed_Proc_Chance@&VALUE3=5",
      name: "$Stats/Bleed$",
    },
    block: {
      format: "AttributeDescriptions/Block_Chance_Bonus_Item@",
      name: "HeroDetails/BlockChance",
    },
    block_percent: {
      name: "HeroDetails/BlockChance",
    },
    blockamount: {
      format: "AttributeDescriptions/Block_Amount_Item (pair)@",
      name: "HeroDetails/BlockAmount",
    },
    ccr: {
      format: "AttributeDescriptions/CrowdControl_Reduction@",
      name: "HeroDetails/CCReduction",
    },
    cdr: {
      format: "AttributeDescriptions/Power_Cooldown_Reduction_Percent_All@",
      name: "HeroDetails/CooldownReduction",
    },
    chc: {
      format: "AttributeDescriptions/Critical_Chance@",
      name: "HeroDetails/CritChanceBonus",
    },
    chctaken: {
      name: "$Stats/Enemy Critical Chance Bonus$",
    },
    chctaken_percent: {
      name: "$Stats/Enemy Critical Chance Bonus$",
    },
    chd: {
      format: "AttributeDescriptions/Crit_Damage_Percent@",
      name: "HeroDetails/CritDamageBonus",
    },
    colddef: {
      format: "AttributeDescriptions/Damage_Type_Percent_Reduction#Cold@",
      name: "$Stats/Cold Damage Reduction$",
    },
    damage: {
      format: "AttributeDescriptions/Damage_Weapon_Percent_All@",
      name: "HeroDetails/DamageIncrease",
    },
    damage_beasts: {
      format: "AttributeDescriptions/Damage_Percent_Bonus_Vs_Monster_Type#Beast@",
      name: "$Stats/Damage to Beasts$",
    },
    damage_demons: {
      format: "AttributeDescriptions/Damage_Percent_Bonus_Vs_Monster_Type#Demon@",
      name: "$Stats/Damage to Demons$",
    },
    damage_humans: {
      format: "AttributeDescriptions/Damage_Percent_Bonus_Vs_Monster_Type#Human@",
      name: "$Stats/Damage to Humans$",
    },
    damage_undead: {
      format: "AttributeDescriptions/Damage_Percent_Bonus_Vs_Monster_Type#Undead@",
      name: "$Stats/Damage to Undead$",
    },
    dex: {
      format: "AttributeDescriptions/Dexterity_Item@",
      name: "$Stats/Dexterity$",
    },
    dex_percent: {
      name: "$Stats/Dexterity$",
    },
    discregen: {
      format: "AttributeDescriptions/Resource_Regen_Per_Second#Discipline@",
      name: "$Stats/Discipline Regeneration$",
    },
    dmgarc: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Arcane@",
      name: "HeroDetails/DamageTypeBonusArcane",
    },
    dmgcol: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Cold@",
      name: "HeroDetails/DamageTypeBonusCold",
    },
    dmgfir: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Fire@",
      name: "HeroDetails/DamageTypeBonusFire",
    },
    dmghol: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Holy@",
      name: "HeroDetails/DamageTypeBonusHoly",
    },
    dmglit: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Lightning@",
      name: "HeroDetails/DamageTypeBonusLightning",
    },
    dmgmul: {
      name: "$Stats/Damage Multiplier$",
    },
    dmgphy: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Physical@",
      name: "HeroDetails/DamageTypeBonusPhysical",
    },
    dmgpsn: {
      format: "AttributeDescriptions/Damage_Dealt_Percent_Bonus#Poison@",
      name: "HeroDetails/DamageTypeBonusPoison",
    },
    dmgred: {
      name: "HeroDetails/DamageReduction",
    },
    dmgtaken: {
      name: "$Stats/Enemy Damage Taken$",
    },
    dodge: {
      name: "HeroDetails/DodgeChance",
    },
    dura: {
      format: "AttributeDescriptions/Item_Indestructible",
      name: "AttributeDescriptions/Item_Indestructible",
    },
    edef: {
      format: "AttributeDescriptions/Damage_Percent_Reduction_From_Elites@",
      name: "HeroDetails/EliteDamageReduction",
    },
    edmg: {
      format: "AttributeDescriptions/Damage_Percent_Bonus_Vs_Elites@",
      name: "HeroDetails/BonusDamageElites",
    },
    expadd: {
      format: "AttributeDescriptions/Experience_Bonus@",
      name: "HeroDetails/BonusXPPerKill",
    },
    expmul: {
      format: "AttributeDescriptions/Experience_Bonus_Percent@",
      name: "HeroDetails/BonusXP",
    },
    extra_block: {
      name: "HeroDetails/BlockChance",
    },
    extrachc: {
      name: "HeroDetails/CritChanceBonus",
    },
    extrams: {
      name: "HeroDetails/MovementSpeed",
    },
    firetaken: {
      format: "AttributeDescriptions/Amplify_Damage_Type_Percent#Fire@",
      name: "$Stats/Fire Damage Taken$",
    },
    firethorns: {
      format: "AttributeDescriptions/Thorns_Fixed#Fire@",
      name: "$Stats/Fire Thorns$",
    },
    furyregen: {
      format: "AttributeDescriptions/Resource_Regen_Per_Second#Fury@",
      name: "$Stats/Fury Regeneration$",
    },
    gf: {
      format: "AttributeDescriptions/Gold_Find@",
      name: "HeroDetails/GoldFind",
    },
    hatredregen: {
      format: "每秒恢复的憎恨值提高 %.2f 点",
      name: "憎恨恢复",
    },
    healbonus: {
      format: "生命球和药水可使你获得 +%d 点生命值",
      name: "生命球回复加成",
    },
    hitblind: {
      format: "有 %.1f%% 的几率可在命中时产生致盲效果",
      name: "击中致盲",
    },
    hitchill: {
      format: "有 %.1f%% 的几率可在命中时产生寒冷效果",
      name: "击中寒冷",
    },
    hitfear: {
      format: "有 %.1f%% 的几率可在命中时产生恐惧效果",
      name: "击中恐惧",
    },
    hitfreeze: {
      format: "有 %.1f%% 的几率可在命中时产生冰冻效果",
      name: "击中冰冻",
    },
    hitimmobilize: {
      format: "有 %.1f%% 的几率可在命中时产生定身效果",
      name: "击中定身",
    },
    hitknockback: {
      format: "有 %.1f%% 的几率可在命中时产生击退效果",
      name: "击中击退",
    },
    hitslow: {
      format: "有 %.1f%% 的几率可在命中时产生减速效果",
      name: "击中减速",
    },
    hitstun: {
      format: "有 %.1f%% 的几率可在命中时产生昏迷效果",
      name: "击中昏迷",
    },
    ias: {
      format: "攻击速度提高 %.1f%%",
      name: "攻速提高",
    },
    int: {
      format: "+%d 点智力",
      name: "智力",
    },
    int_percent: {
      name: "智力",
    },
    laek: {
      format: "每次消灭获得 +%d 点生命值",
      name: "每次消灭回复",
    },
    life: {
      format: "+%d%% 生命值",
      name: "生命值",
    },
    lifefury: {
      format: "每消耗%d点怒气获得  点生命值",
      name: "每点怒气消耗回复",
    },
    lifespirit: {
      format: "每消耗%d点内力获得  点生命值",
      name: "每点内力消耗回复",
    },
    lifewrath: {
      format: "每消耗%d点愤怒值获得  点生命值",
      name: "每点愤怒消耗回复",
    },
    lph: {
      format: "每次命中获得 +%d 点生命值",
      name: "每次命中回复",
    },
    lvlreq: {
      format: "等级需求降低 %d",
      name: "等级需求降低",
    },
    manaperkill: {
      format: "每次消灭获得 %d 点法力值",
      name: "击杀回复法力",
    },
    manaregen: {
      format: "每秒恢复的法力值提高 %.2f 点",
      name: "法力恢复",
    },
    manaregen_percent: {
      name: "法力恢复",
    },
    maxap: {
      format: "+%d 点奥能上限",
      name: "奥能上限",
    },
    maxdisc: {
      format: "+%d 点戒律值上限",
      name: "戒律上限",
    },
    maxfury: {
      format: "+%d 点怒气上限",
      name: "怒气上限",
    },
    maxhatred: {
      format: "+%d 点憎恨值上限",
      name: "憎恨上限",
    },
    maxmana: {
      format: "+%d 点法力值上限",
      name: "法力上限",
    },
    maxmana_percent: {
      name: "法力上限",
    },
    maxspirit: {
      format: "+%d 点内力上限",
      name: "内力上限",
    },
    maxwrath: {
      format: "+%d 点愤怒值上限",
      name: "愤怒上限",
    },
    meleedef: {
      format: "从近战攻击中受到的伤害降低 %.1f%%",
      name: "近战伤害减免",
    },
    mf: {
      format: "魔法物品掉落几率提高 %d%%",
      name: "魔宝寻获率",
    },
    ms: {
      format: "+%d%% 移动速度",
      name: "移动速度",
    },
    nonphys: {
      name: "非物理伤害减免",
    },
    petias: {
      name: "宠物攻速",
    },
    pickup: {
      format: "金币和生命球的拾取范围扩大 %d 码",
      name: "拾取范围",
    },
    rangedef: {
      format: "从远程攻击中受到的伤害降低 %.1f%% 。",
      name: "远程伤害减免",
    },
    rcr: {
      format: "所有能量的消耗降低 %d%% 。",
      name: "能耗降低",
    },
    rcr_ap: {
      name: "奥能消耗降低",
    },
    rcr_disc: {
      name: "戒律消耗降低",
    },
    rcr_fury: {
      name: "怒气消耗降低",
    },
    rcr_hatred: {
      name: "憎恨消耗降低",
    },
    rcr_mana: {
      name: "法力消耗降低",
    },
    rcr_spirit: {
      name: "内力消耗降低",
    },
    rcr_wrath: {
      name: "愤怒消耗降低",
    },
    rcrint: {
      name: "资源消耗降低",
    },
    regen: {
      format: "每秒恢复 %d 点生命值",
      name: "每秒生命回复",
    },
    regen_bonus: {
      name: "每秒生命回复",
    },
    regen_percent: {
      name: "回复",
    },
    resall: {
      format: "+%d 点全元素抗性",
      name: "全元素抗性",
    },
    resarc: {
      format: "+%d 点奥术抗性",
      name: "奥术抗性",
    },
    resarc_percent: {
      name: "奥术/神圣抗性",
    },
    rescol: {
      format: "+%d 点冰霜抗性",
      name: "冰霜抗性",
    },
    rescol_percent: {
      name: "冰霜抗性",
    },
    resfir: {
      format: "+%d 点火焰抗性",
      name: "火焰抗性",
    },
    resfir_percent: {
      name: "火焰抗性",
    },
    resist_percent: {
      name: "抗性",
    },
    reslit: {
      format: "+%d 点闪电抗性",
      name: "闪电抗性",
    },
    reslit_percent: {
      name: "闪电抗性",
    },
    resourcegen: {
      name: "资源回复",
    },
    resphy: {
      format: "+%d 点物理抗性",
      name: "物理抗性",
    },
    resphy_percent: {
      name: "物理抗性",
    },
    respsn: {
      format: "+%d 点毒性抗性",
      name: "毒性抗性",
    },
    respsn_percent: {
      name: "毒性抗性",
    },
    skill_monk_cyclonestrike_cost: {
      format: "使 飓风破 的 内力消耗降低 %d 点。",
      name: "飓风破内力消耗降低",
    },
    skill_monk_sweepingwind_cost: {
      format: "使 劲风煞 的 内力消耗降低 %d 点。",
      name: "劲风煞内力消耗降低",
    },
    skill_witchdoctor_massconfusion_cooldown: {
      format: "使 群体混乱 的冷却时间缩短 %d 秒。",
      name: "群体混乱冷却缩短",
    },
    skill_witchdoctor_wallofzombies_cooldown: {
      format: "使 僵尸之墙 的冷却时间缩短 %d 秒。",
      name: "僵尸之墙冷却缩短",
    },
    skill_wizard_teleport_cooldown: {
      format: "使 传送 的冷却时间缩短 %d 秒。",
      name: "传送冷却缩短",
    },
    sockets: {
      format: "镶孔 (%d)",
      name: "镶孔",
    },
    spiritregen: {
      format: "每秒恢复的内力提高 %.2f 点",
      name: "每秒内力恢复",
    },
    str: {
      format: "+%d 点力量",
      name: "力量",
    },
    str_percent: {
      name: "力量",
    },
    thorns: {
      format: "每次命中对远程和近战攻击者造成 %d 点伤害",
      name: "荆棘伤害",
    },
    vit: {
      format: "+%d 点体能",
      name: "体能",
    },
    weaponias: {
      format: "攻击速度提高 %d%%",
      name: "攻速提高",
    },
    wpnarc: {
      format: "+%d-%d 点奥术伤害",
      name: "奥术伤害",
    },
    wpncol: {
      format: "+%d-%d 点冰霜伤害",
      name: "冰霜伤害",
    },
    wpnfir: {
      format: "+%d-%d 点火焰伤害",
      name: "火焰伤害",
    },
    wpnhol: {
      format: "+%d-%d 点神圣伤害",
      name: "神圣伤害",
    },
    wpnlit: {
      format: "+%d-%d 点闪电伤害",
      name: "闪电伤害",
    },
    wpnphy: {
      format: "+%d-%d 点伤害",
      name: "物理伤害",
    },
    wpnpsn: {
      format: "+%d-%d 点毒性伤害",
      name: "毒性伤害",
    },
    wrathregen: {
      format: "每秒恢复的愤怒值提高 %.2f 点",
      name: "愤怒每秒生命回复",
    },
  },
});

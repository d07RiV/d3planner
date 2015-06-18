_L.patch.add({
  elements: {
    arc: "奥术",
    col: "冰霜",
    fir: "火焰",
    hol: "神圣",
    lit: "闪电",
    phy: "物理",
    psn: "毒性",
  },
  resources: {
    ap: "奥能",
    disc: "戒律值",
    fury: "怒气",
    hatred: "憎恨值",
    mana: "法力值",
    spirit: "内力",
    wrath: "愤怒",
  },
  statGroupNames: {
    elemental: "Elemental Damage",
    mainstat: "Primary Attribute",
    onhit: "On Hit Effect",
    resist: "Elemental Resistance",
    resistany: "Resistance",
    resource: "Resources",
    weapon: "Weapon Damage",
  },
  stats: {
    apoc: {
      format: "暴击可获得 %d 点奥能",
      name: "Arcane Power on Critical Hit",
    },
    apregen: {
      format: "每秒恢复的奥能提高 %.2f 点",
      name: "Arcane Power Regeneration",
    },
    area: {
      format: "有一定几率在命中时造成 %d%% 的范围伤害。",
      name: "Area Damage",
    },
    armor: {
      format: "+%d 点护甲值",
      name: "Armor",
    },
    armor_percent: {
      name: "Armor",
    },
    basearmor: {
      name: "Base Armor",
    },
    baseblock: {
      format: "+%.1f%% 格挡几率",
      name: "Base Chance to Block",
    },
    bleed: {
      format: "有 %.1f%% 的几率在 %d 秒内引发流血效果，造成 5%% 的武器伤害。",
      name: "Bleed",
    },
    block: {
      format: "+%d%% 格挡几率",
      name: "Block Chance",
    },
    block_percent: {
      name: "Block Chance",
    },
    blockamount: {
      format: "%d-%d  点格挡值",
      name: "Block Amount",
    },
    ccr: {
      format: "控制类限制效果的持续时间缩短 %d%% ",
      name: "Crowd Control Reduction",
    },
    cdr: {
      format: "所有技能的冷却时间缩短 %.1f%%",
      name: "Cooldown Reduction",
    },
    chc: {
      format: "暴击几率提高 %.1f%%",
      name: "Critical Hit Chance",
    },
    chctaken: {
      name: "Enemy Critical Chance Bonus",
    },
    chctaken_percent: {
      name: "Enemy Critical Chance Bonus",
    },
    chd: {
      format: "暴击伤害提高 %.1f%%",
      name: "Critical Hit Damage",
    },
    colddef: {
      format: "受到的冰霜伤害降低 %d%% 。",
      name: "Cold Damage Reduction",
    },
    custom: {
      name: "Legendary Affix",
    },
    damage: {
      format: "+%d%% 伤害",
      name: "Damage Increase",
    },
    damage_beasts: {
      format: "+%d%% 对野兽造成的伤害",
      name: "Damage to Beasts",
    },
    damage_demons: {
      format: "+%d%% 对恶魔造成的伤害",
      name: "Damage to Demons",
    },
    damage_humans: {
      format: "+%d%% 对人类造成的伤害",
      name: "Damage to Humans",
    },
    damage_undead: {
      format: "+%d%% 对亡灵造成的伤害",
      name: "Damage to Undead",
    },
    dex: {
      format: "+%d 点敏捷",
      name: "Dexterity",
    },
    dex_percent: {
      name: "Dexterity",
    },
    discregen: {
      format: "每秒恢复的戒律值提高 %.2f 点",
      name: "Discipline Regeneration",
    },
    dmgarc: {
      format: "奥术技能造成的伤害提高 %d%% 。",
      name: "Arcane Damage Increase",
    },
    dmgcol: {
      format: "冰霜技能造成的伤害提高 %d%% 。",
      name: "Cold Damage Increase",
    },
    dmgfir: {
      format: "火焰技能造成的伤害提高 %d%% 。",
      name: "Fire Damage Increase",
    },
    dmghol: {
      format: "神圣技能造成的伤害提高 %d%% 。",
      name: "Holy Damage Increase",
    },
    dmglit: {
      format: "闪电技能造成的伤害提高 %d%% 。",
      name: "Lightning Damage Increase",
    },
    dmgmul: {
      name: "Damage Multiplier",
    },
    dmgphy: {
      format: "物理技能造成的伤害提高 %d%% 。",
      name: "Physical Damage Increase",
    },
    dmgpsn: {
      format: "毒性技能造成的伤害提高 %d%% 。",
      name: "Poison Damage Increase",
    },
    dmgred: {
      name: "Damage Reduction",
    },
    dmgtaken: {
      name: "Enemy Damage Taken",
    },
    dodge: {
      name: "Dodge Chance",
    },
    dura: {
      format: "无视耐久度消耗",
      name: "Ignores Durability Loss",
    },
    edef: {
      format: "受到的精英怪物伤害降低 %.1f%%",
      name: "Elite Damage Reduction",
    },
    edmg: {
      format: "对精英敌人造成的伤害提高 %.1f%%",
      name: "Bonus Damage to Elites",
    },
    expadd: {
      format: "消灭敌人获得的经验值提高 +%d 点",
      name: "Bonus Experience per Kill",
    },
    expmul: {
      format: "经验值加成提高 %d%%",
      name: "Bonus Experience",
    },
    extra_block: {
      name: "Block Chance",
    },
    extrachc: {
      name: "Critical Hit Chance",
    },
    extrams: {
      name: "Movement Speed",
    },
    firetaken: {
      format: "受到的火焰伤害提高 %d%% 。",
      name: "Fire Damage Taken",
    },
    firethorns: {
      format: "每次命中对远程和近战攻击者造成 %d 点火焰伤害。",
      name: "Fire Thorns",
    },
    furyregen: {
      format: "生成的怒气提高 %d 点",
      name: "Fury Regeneration",
    },
    gf: {
      format: "+%d%% 怪物掉落额外金币",
      name: "Gold Find",
    },
    hatredregen: {
      format: "每秒恢复的憎恨值提高 %.2f 点",
      name: "Hatred Regeneration",
    },
    healbonus: {
      format: "生命球和药水可使你获得 +%d 点生命值",
      name: "Health Globe Healing Bonus",
    },
    hitblind: {
      format: "有 %.1f%% 的几率可在命中时产生致盲效果",
      name: "Blind on Hit",
    },
    hitchill: {
      format: "有 %.1f%% 的几率可在命中时产生寒冷效果",
      name: "Chill on Hit",
    },
    hitfear: {
      format: "有 %.1f%% 的几率可在命中时产生恐惧效果",
      name: "Fear on Hit",
    },
    hitfreeze: {
      format: "有 %.1f%% 的几率可在命中时产生冰冻效果",
      name: "Freeze on Hit",
    },
    hitimmobilize: {
      format: "有 %.1f%% 的几率可在命中时产生定身效果",
      name: "Immobilize on Hit",
    },
    hitknockback: {
      format: "有 %.1f%% 的几率可在命中时产生击退效果",
      name: "Knockback on Hit",
    },
    hitslow: {
      format: "有 %.1f%% 的几率可在命中时产生减速效果",
      name: "Slow on Hit",
    },
    hitstun: {
      format: "有 %.1f%% 的几率可在命中时产生昏迷效果",
      name: "Stun on Hit",
    },
    ias: {
      format: "攻击速度提高 %.1f%%",
      name: "Attack Speed Increase",
    },
    int: {
      format: "+%d 点智力",
      name: "Intelligence",
    },
    int_percent: {
      name: "Intelligence",
    },
    laek: {
      format: "每次消灭获得 +%d 点生命值",
      name: "Life per Kill",
    },
    life: {
      format: "+%d%% 生命值",
      name: "Life",
    },
    lifefury: {
      format: "每消耗%d点怒气获得  点生命值",
      name: "Life per Fury Spent",
    },
    lifespirit: {
      format: "每消耗%d点内力获得  点生命值",
      name: "Life per Spirit Spent",
    },
    lifewrath: {
      format: "每消耗%d点愤怒值获得  点生命值",
      name: "Life per Wrath Spent",
    },
    lph: {
      format: "每次命中获得 +%d 点生命值",
      name: "Life per Hit",
    },
    lvlreq: {
      format: "等级需求降低 %d",
      name: "Level Reduction",
    },
    manaperkill: {
      format: "每次消灭获得 %d 点法力值",
      name: "Mana per Kill",
    },
    manaregen: {
      format: "每秒恢复的法力值提高 %.2f 点",
      name: "Mana Regeneration",
    },
    manaregen_percent: {
      name: "Mana Regeneration",
    },
    maxap: {
      format: "+%d 点奥能上限",
      name: "Maximum Arcane Power",
    },
    maxdisc: {
      format: "+%d 点戒律值上限",
      name: "Maximum Discipline",
    },
    maxfury: {
      format: "+%d 点怒气上限",
      name: "Maximum Fury",
    },
    maxhatred: {
      format: "+%d 点憎恨值上限",
      name: "Maximum Hatred",
    },
    maxmana: {
      format: "+%d 点法力值上限",
      name: "Maximum Mana",
    },
    maxmana_percent: {
      name: "Maximum Mana",
    },
    maxspirit: {
      format: "+%d 点内力上限",
      name: "Maximum Spirit",
    },
    maxwrath: {
      format: "+%d 点愤怒值上限",
      name: "Maximum Wrath",
    },
    meleedef: {
      format: "从近战攻击中受到的伤害降低 %.1f%%",
      name: "Melee Damage Reduction",
    },
    mf: {
      format: "魔法物品掉落几率提高 %d%%",
      name: "Magic Find",
    },
    ms: {
      format: "+%d%% 移动速度",
      name: "Movement Speed",
    },
    nonphys: {
      name: "Non-Physical Damage Reduction",
    },
    petias: {
      name: "Pet Attack Speed",
    },
    pickup: {
      format: "金币和生命球的拾取范围扩大 %d 码",
      name: "Bonus to Gold/Globe Radius",
    },
    rangedef: {
      format: "从远程攻击中受到的伤害降低 %.1f%% 。",
      name: "Missile Damage Reduction",
    },
    rcr: {
      format: "所有能量的消耗降低 %d%% 。",
      name: "Resource Cost Reduction",
    },
    rcr_ap: {
      name: "Arcane Power Cost Reduction",
    },
    rcr_disc: {
      name: "Discipline Cost Reduction",
    },
    rcr_fury: {
      name: "Fury Cost Reduction",
    },
    rcr_hatred: {
      name: "Hatred Cost Reduction",
    },
    rcr_mana: {
      name: "Mana Cost Reduction",
    },
    rcr_spirit: {
      name: "Spirit Cost Reduction",
    },
    rcr_wrath: {
      name: "Wrath Cost Reduction",
    },
    rcrint: {
      name: "Resource Cost Reduction",
    },
    regen: {
      format: "每秒恢复 %d 点生命值",
      name: "Life per Second",
    },
    regen_bonus: {
      name: "Life per Second",
    },
    regen_percent: {
      name: "Regeneration",
    },
    resall: {
      format: "+%d 点全元素抗性",
      name: "Resistance to All Elements",
    },
    resarc: {
      format: "+%d 点奥术抗性",
      name: "Arcane/Holy Resistance",
    },
    resarc_percent: {
      name: "Arcane/Holy Resistance",
    },
    rescol: {
      format: "+%d 点冰霜抗性",
      name: "Cold Resistance",
    },
    rescol_percent: {
      name: "Cold Resistance",
    },
    resfir: {
      format: "+%d 点火焰抗性",
      name: "Fire Resistance",
    },
    resfir_percent: {
      name: "Fire Resistance",
    },
    resist_percent: {
      name: "Resistances",
    },
    reslit: {
      format: "+%d 点闪电抗性",
      name: "Lightning Resistance",
    },
    reslit_percent: {
      name: "Lightning Resistance",
    },
    resourcegen: {
      name: "Resource Generation",
    },
    resphy: {
      format: "+%d 点物理抗性",
      name: "Physical Resistance",
    },
    resphy_percent: {
      name: "Physical Resistance",
    },
    respsn: {
      format: "+%d 点毒性抗性",
      name: "Poison Resistance",
    },
    respsn_percent: {
      name: "Poison Resistance",
    },
    skill_monk_cyclonestrike_cost: {
      format: "使 飓风破 的 内力消耗降低 %d 点。",
      name: "Cyclone Strike Resource Cost",
    },
    skill_monk_sweepingwind_cost: {
      format: "使 劲风煞 的 内力消耗降低 %d 点。",
      name: "Sweeping Wind Resource Cost",
    },
    skill_witchdoctor_massconfusion_cooldown: {
      format: "使 群体混乱 的冷却时间缩短 %d 秒。",
      name: "Mass Confusion Cooldown",
    },
    skill_witchdoctor_wallofzombies_cooldown: {
      format: "使 僵尸之墙 的冷却时间缩短 %d 秒。",
      name: "Wall of Zombies Cooldown",
    },
    skill_wizard_teleport_cooldown: {
      format: "使 传送 的冷却时间缩短 %d 秒。",
      name: "Teleport Cooldown",
    },
    spiritregen: {
      format: "每秒恢复的内力提高 %.2f 点",
      name: "Spirit Regeneration",
    },
    str: {
      format: "+%d 点力量",
      name: "Strength",
    },
    str_percent: {
      name: "Strength",
    },
    thorns: {
      format: "每次命中对远程和近战攻击者造成 %d 点伤害",
      name: "Thorns",
    },
    vit: {
      format: "+%d 点体能",
      name: "Vitality",
    },
    weaponias: {
      format: "攻击速度提高 %d%%",
      name: "Attack Speed Increase",
    },
    wpnarc: {
      format: "+%d-%d 点奥术伤害",
      name: "Arcane Damage",
    },
    wpncol: {
      format: "+%d-%d 点冰霜伤害",
      name: "Cold Damage",
    },
    wpnfir: {
      format: "+%d-%d 点火焰伤害",
      name: "Fire Damage",
    },
    wpnhol: {
      format: "+%d-%d 点神圣伤害",
      name: "Holy Damage",
    },
    wpnlit: {
      format: "+%d-%d 点闪电伤害",
      name: "Lightning Damage",
    },
    wpnphy: {
      format: "+%d-%d 点伤害",
      name: "Physical Damage",
    },
    wpnpsn: {
      format: "+%d-%d 点毒性伤害",
      name: "Poison Damage",
    },
    wrathregen: {
      format: "每秒恢复的愤怒值提高 %.2f 点",
      name: "Wrath Regeneration",
    },
  },
});

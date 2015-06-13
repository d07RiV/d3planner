(function() {
  function SkillStat(skill, cls) {
    return {name: skill + " Damage", format: "Increases " + skill + " Damage by %d%%", class: cls, skill: skill};
  }
  DiabloCalc.elements = {
    arc: "Arcane",
    col: "Cold",
    fir: "Fire",
    hol: "Holy",
    lit: "Lightning",
    phy: "Physical",
    psn: "Poison",
  };
  DiabloCalc.stats = {
    basearmor: {name: "Base Armor", base: true},
    baseblock: {name: "Base Chance to Block", format: "+%.1f%% Chance to Block", base: true},
    blockamount: {name: "Block Amount", format: "%d-%d Block Amount", args: 2, base: true},

    wpnphy: {name: "Physical Damage", format: "+%d-%d Damage", args: 2, damage: true, elem: "phy"},
    wpnfir: {name: "Fire Damage", args: 2, elemental: "fire", damage: true, elem: "fir"},
    wpncol: {name: "Cold Damage", args: 2, elemental: "cold", damage: true, elem: "col"},
    wpnpsn: {name: "Poison Damage", args: 2, elemental: "poison", damage: true, elem: "psn"},
    wpnarc: {name: "Arcane Damage", args: 2, elemental: "arcane", damage: true, elem: "arc"},
    wpnlit: {name: "Lightning Damage", args: 2, elemental: "lightning", damage: true, elem: "lit"},
    wpnhol: {name: "Holy Damage", args: 2, elemental: "holy", damage: true, elem: "hol"},

    dmgphy: {name: "Physical Damage Increase", format: "Physical skills deal %d%% more damage.", classes: ["demonhunter", "monk", "witchdoctor", "crusader", "barbarian"], utility: true},
    dmgfir: {name: "Fire Damage Increase", format: "Fire skills deal %d%% more damage.", utility: true, elemental: "fire"},
    dmgcol: {name: "Cold Damage Increase", format: "Cold skills deal %d%% more damage.", classes: ["wizard", "demonhunter", "witchdoctor", "barbarian", "monk"], utility: true, elemental: "cold"},
    dmgpsn: {name: "Poison Damage Increase", format: "Poison skills deal %d%% more damage.", classes: ["witchdoctor"], utility: true, elemental: "poison"},
    dmgarc: {name: "Arcane Damage Increase", format: "Arcane skills deal %d%% more damage.", classes: ["wizard"], utility: true, elemental: "arcane"},
    dmglit: {name: "Lightning Damage Increase", format: "Lightning skills deal %d%% more damage.", classes: ["wizard", "demonhunter", "barbarian", "monk", "crusader"], utility: true, elemental: "lightning"},
    dmghol: {name: "Holy Damage Increase", format: "Holy skills deal %d%% more damage.", classes: ["monk", "crusader"], utility: true, elemental: "holy"},

    damage: {name: "Damage Increase", format: "+%d%% Damage", special: true},
    dmgmul: {name: "Damage Multiplier", special: true, mult: true},
    dmgtaken: {name: "Enemy Damage Taken", special: true},
    chctaken: {name: "Enemy Critical Chance Bonus"},
    chctaken_percent: {name: "Enemy Critical Chance Bonus"},

    str: {name: "Strength", classes: ["barbarian", "crusader", "templar"]},
    dex: {name: "Dexterity", classes: ["demonhunter", "monk", "scoundrel"]},
    int: {name: "Intelligence", classes: ["wizard", "witchdoctor", "enchantress"]},
    str_percent: {name: "Strength"},
    dex_percent: {name: "Dexterity"},
    int_percent: {name: "Intelligence"},
    vit: {name: "Vitality"},

    resall: {name: "Resistance to All Elements"},
    life: {name: "Life", format: "+%d%% Life"},

    weaponias: {name: "Attack Speed Increase", format: "Increases Attack Speed by %d%%"},
    ias: {name: "Attack Speed Increase", format: "Attack Speed Increased by %.1f%%"},
    chd: {name: "Critical Hit Damage", format: "Critical Hit Damage Increased by %.1f%%"},
    chc: {name: "Critical Hit Chance", format: "Critical Hit Chance Increased by %.1f%%"},
    edmg: {name: "Bonus Damage to Elites", format: "Increases damage against elites by %.1f%%", utility: true},
    area: {name: "Area Damage", format: "Chance to Deal %d%% Area Damage on Hit.", utility: true},
    extrachc: {name: "Critical Hit Chance"},

    armor: {name: "Armor"},
    armor_percent: {name: "Armor"},
    resist_percent: {name: "Resistances"},
    dmgred: {name: "Damage Reduction", dr: true},
    dodge: {name: "Dodge Chance", dr: true},

    block: {name: "Block Chance", format: "+%d%% Chance to Block", utility: true},
    block_percent: {name: "Block Chance"},
    extra_block: {name: "Block Chance"},
    edef: {name: "Elite Damage Reduction", format: "Reduces damage from elites by %.1f%%", dr: true, utility: true},
    regen: {name: "Life per Second", format: "Regenerates %d Life per Second"},
    regen_bonus: {name: "Life per Second"},
    regen_percent: {name: "Regeneration"},
    lph: {name: "Life per Hit"},

    cdr: {name: "Cooldown Reduction", dr: true, format: "Reduces cooldown of all skills by %.1f%%.", utility: true},
    rcr: {name: "Resource Cost Reduction", dr: true, format: "Reduces all resource costs by %d%%.", utility: true},
    rcr_ap: {name: "Arcane Power Cost Reduction", dr: true, class: "wizard"},
    rcr_hatred: {name: "Hatred Cost Reduction", dr: true, class: "demonhunter"},
    rcr_disc: {name: "Discipline Cost Reduction", dr: true, class: "demonhunter"},
    rcr_mana: {name: "Mana Cost Reduction", dr: true, class: "witchdoctor"},
    rcr_fury: {name: "Fury Cost Reduction", dr: true, class: "barbarian"},
    rcr_wrath: {name: "Wrath Cost Reduction", dr: true, class: "crusader"},
    rcr_spirit: {name: "Spirit Cost Reduction", dr: true, class: "monk"},

    firetaken: {name: "Fire Damage Taken", format: "%d%% more Fire damage taken."},
    colddef: {name: "Cold Damage Reduction", format: "Reduces damage from Cold attacks by %d%%.", dr: true},
    nonphys: {name: "Non-Physical Damage Reduction", dr: true},

    resourcegen: {name: "Resource Generation"},
    apregen: {name: "Arcane Power Regeneration", format: "Increases Arcane Power Regeneration by %.2f per Second", class: "wizard", utility: true},
    apoc: {name: "Arcane Power on Critical Hit", format: "Critical Hits grant %d Arcane Power", class: "wizard", utility: true},
    hatredregen: {name: "Hatred Regeneration", format: "Increases Hatred Regeneration by %.2f per Second", class: "demonhunter", utility: true},
    discregen: {name: "Discipline Regeneration", format: "Increases Discipline Regeneration by %.2f per Second", class: "demonhunter", utility: true},
    manaregen: {name: "Mana Regeneration", format: "Increases Mana Regeneration by %.2f per Second", class: "witchdoctor", utility: true},
    manaregen_percent: {name: "Mana Regeneration", class: "witchdoctor"},
    lifespirit: {name: "Life per Spirit Spent", format: "Gain %d Life per Spirit Spent", class: "monk", utility: true},
    spiritregen: {name: "Spirit Regeneration", format: "Increases Spirit Regeneration by %.2f per Second", class: "monk", utility: true},
    lifefury: {name: "Life per Fury Spent", format: "Gain %d Life per Fury Spent", class: "barbarian", utility: true},
    furyregen: {name: "Fury Regeneration", format: "Increases Fury Regeneration by %d", class: "barbarian"},
    lifewrath: {name: "Life per Wrath Spent", format: "Gain %d Life per Wrath Spent", class: "crusader", utility: true},
    wrathregen: {name: "Wrath Regeneration", format: "Increases Wrath Regeneration by %.2f per Second", class: "crusader", utility: true},
    manaperkill: {name: "Mana per Kill", format: "Grants %d Mana per Kill", class: "witchdoctor", utility: true},

    ms: {name: "Movement Speed", format: "+%d%% Movement Speed", utility: true},
    extrams: {name: "Movement Speed"},
    bleed: {name: "Bleed", format: "%.1f%% chance to inflict Bleed for %d%% weapon damage over 5 seconds.", args: 2, argnames: ["chance", "amount"], utility: true, dr: true},

    skill_wizard_disintegrate: SkillStat("Disintegrate", "wizard"),
    skill_wizard_arcanetorrent: SkillStat("Arcane Torrent", "wizard"),
    skill_wizard_arcaneorb: SkillStat("Arcane Orb", "wizard"),
    skill_wizard_rayoffrost: SkillStat("Ray of Frost", "wizard"),
    skill_wizard_energytwister: SkillStat("Energy Twister", "wizard"),
    skill_wizard_waveofforce: SkillStat("Wave of Force", "wizard"),
    skill_wizard_meteor: SkillStat("Meteor", "wizard"),

    skill_wizard_explosiveblast: SkillStat("Explosive Blast", "wizard"),
    skill_wizard_familiar: SkillStat("Familiar", "wizard"),
    skill_wizard_blackhole: SkillStat("Black Hole", "wizard"),
    skill_wizard_hydra: SkillStat("Hydra", "wizard"),
    skill_wizard_blizzard: SkillStat("Blizzard", "wizard"),

    skill_wizard_magicmissile: SkillStat("Magic Missile", "wizard"),
    skill_wizard_shockpulse: SkillStat("Shock Pulse", "wizard"),
    skill_wizard_electrocute: SkillStat("Electrocute", "wizard"),
    skill_wizard_spectralblade: SkillStat("Spectral Blade", "wizard"),

    skill_wizard_teleport_cooldown: {name: "Teleport Cooldown", format: "Reduces cooldown of Teleport by %d seconds.", class: "wizard"},

    skill_demonhunter_chakram: SkillStat("Chakram", "demonhunter"),
    skill_demonhunter_impale: SkillStat("Impale", "demonhunter"),
    skill_demonhunter_rapidfire: SkillStat("Rapid Fire", "demonhunter"),
    skill_demonhunter_elementalarrow: SkillStat("Elemental Arrow", "demonhunter"),
    skill_demonhunter_strafe: SkillStat("Strafe", "demonhunter"),
    skill_demonhunter_clusterarrow: SkillStat("Cluster Arrow", "demonhunter"),
    skill_demonhunter_multishot: SkillStat("Multishot", "demonhunter"),

    skill_demonhunter_fanofknives: SkillStat("Fan of Knives", "demonhunter"),
    skill_demonhunter_companion: SkillStat("Companion", "demonhunter"),
    skill_demonhunter_spiketrap: SkillStat("Spike Trap", "demonhunter"),
    skill_demonhunter_sentry: SkillStat("Sentry", "demonhunter"),
    skill_demonhunter_rainofvengeance: SkillStat("Rain of Vengeance", "demonhunter"),

    skill_demonhunter_hungeringarrow: SkillStat("Hungering Arrow", "demonhunter"),
    skill_demonhunter_bolas: SkillStat("Bolas", "demonhunter"),
    skill_demonhunter_entanglingshot: SkillStat("Entangling Shot", "demonhunter"),
    skill_demonhunter_grenade: SkillStat("Grenade", "demonhunter"),
    skill_demonhunter_evasivefire: SkillStat("Evasive Fire", "demonhunter"),

    skill_barbarian_ancientspear: SkillStat("Ancient Spear", "barbarian"),
    skill_barbarian_hammeroftheancients: SkillStat("Hammer of the Ancients", "barbarian"),
    skill_barbarian_whirlwind: SkillStat("Whirlwind", "barbarian"),
    skill_barbarian_seismicslam: SkillStat("Seismic Slam", "barbarian"),

    skill_barbarian_furiouscharge: SkillStat("Furious Charge", "barbarian"),
    skill_barbarian_avalanche: SkillStat("Avalanche", "barbarian"),
    skill_barbarian_earthquake: SkillStat("Earthquake", "barbarian"),
    skill_barbarian_rend: SkillStat("Rend", "barbarian"),
    skill_barbarian_revenge: SkillStat("Revenge", "barbarian"),
    skill_barbarian_overpower: SkillStat("Overpower", "barbarian"),
    skill_barbarian_calloftheancients: SkillStat("Call of the Ancients", "barbarian"),

    skill_barbarian_cleave: SkillStat("Cleave", "barbarian"),
    skill_barbarian_weaponthrow: SkillStat("Weapon Throw", "barbarian"),
    skill_barbarian_frenzy: SkillStat("Frenzy", "barbarian"),
    skill_barbarian_bash: SkillStat("Bash", "barbarian"),

    skill_witchdoctor_zombiecharger: SkillStat("Zombie Charger", "witchdoctor"),
    skill_witchdoctor_sacrifice: SkillStat("Sacrifice", "witchdoctor"),
    skill_witchdoctor_firebats: SkillStat("Firebats", "witchdoctor"),
    skill_witchdoctor_acidcloud: SkillStat("Acid Cloud", "witchdoctor"),
    skill_witchdoctor_spiritbarrage: SkillStat("Spirit Barrage", "witchdoctor"),

    skill_witchdoctor_locustswarm: SkillStat("Locust Swarm", "witchdoctor"),
    skill_witchdoctor_graspofthedead: SkillStat("Grasp of the Dead", "witchdoctor"),
    skill_witchdoctor_summonzombiedogs: SkillStat("Summon Zombie Dogs", "witchdoctor"),
    skill_witchdoctor_wallofzombies: SkillStat("Wall of Zombies", "witchdoctor"),
    skill_witchdoctor_gargantuan: SkillStat("Gargantuan", "witchdoctor"),
    skill_witchdoctor_haunt: SkillStat("Haunt", "witchdoctor"),
    skill_witchdoctor_piranhas: SkillStat("Piranhas", "witchdoctor"),
    skill_witchdoctor_fetisharmy: SkillStat("Fetish Army", "witchdoctor"),

    skill_witchdoctor_plagueoftoads: SkillStat("Plague of Toads", "witchdoctor"),
    skill_witchdoctor_firebomb: SkillStat("Firebomb", "witchdoctor"),
    skill_witchdoctor_poisondart: SkillStat("Poison Dart", "witchdoctor"),
    skill_witchdoctor_corpsespiders: SkillStat("Corpse Spiders", "witchdoctor"),

    skill_witchdoctor_wallofzombies_cooldown: {name: "Wall of Zombies Cooldown", format: "Reduces cooldown of Wall of Zombies by %d seconds.", class: "witchdoctor"},
    skill_witchdoctor_massconfusion_cooldown: {name: "Mass Confusion Cooldown", format: "Reduces cooldown of Mass Confusion by %d seconds.", class: "witchdoctor"},

    skill_monk_explodingpalm: SkillStat("Exploding Palm", "monk"),
    skill_monk_waveoflight: SkillStat("Wave of Light", "monk"),
    skill_monk_tempestrush: SkillStat("Tempest Rush", "monk"),
    skill_monk_lashingtailkick: SkillStat("Lashing Tail Kick", "monk"),

    skill_monk_sweepingwind: SkillStat("Sweeping Wind", "monk"),
    skill_monk_cyclonestrike: SkillStat("Cyclone Strike", "monk"),
    skill_monk_mystically: SkillStat("Mystic Ally", "monk"),
    skill_monk_dashingstrike: SkillStat("Dashing Strike", "monk"),
    skill_monk_sevensidedstrike: SkillStat("Seven-Sided Strike", "monk"),

    skill_monk_deadlyreach: SkillStat("Deadly Reach", "monk"),
    skill_monk_wayofthehundredfists: SkillStat("Way of the Hundred Fists", "monk"),
    skill_monk_fistsofthunder: SkillStat("Fists of Thunder", "monk"),
    skill_monk_cripplingwave: SkillStat("Crippling Wave", "monk"),

    skill_monk_sweepingwind_cost: {name: "Sweeping Wind Resource Cost", format: "Reduces resource cost of Sweeping Wind by %d Spirit", class: "monk"},
    skill_monk_cyclonestrike_cost: {name: "Cyclone Strike Resource Cost", format: "Reduces resource cost of Cyclone Strike by %d Spirit", class: "monk"},

    skill_crusader_blessedshield: SkillStat("Blessed Shield", "crusader"),
    skill_crusader_shieldbash: SkillStat("Shield Bash", "crusader"),
    skill_crusader_phalanx: SkillStat("Phalanx", "crusader"),
    skill_crusader_blessedhammer: SkillStat("Blessed Hammer", "crusader"),
    skill_crusader_fistoftheheavens: SkillStat("Fist of the Heavens", "crusader"),
    skill_crusader_sweepattack: SkillStat("Sweep Attack", "crusader"),

    skill_crusader_condemn: SkillStat("Condemn", "crusader"),
    skill_crusader_heavensfury: SkillStat("Heaven's Fury", "crusader"),
    skill_crusader_fallingsword: SkillStat("Falling Sword", "crusader"),
    skill_crusader_bombardment: SkillStat("Bombardment", "crusader"),

    skill_crusader_justice: SkillStat("Justice", "crusader"),
    skill_crusader_punish: SkillStat("Punish", "crusader"),
    skill_crusader_smite: SkillStat("Smite", "crusader"),
    skill_crusader_slash: SkillStat("Slash", "crusader"),

    resphy: {name: "Physical Resistance", secondary: true, resist: true},
    resfir: {name: "Fire Resistance", secondary: true, resist: true},
    rescol: {name: "Cold Resistance", secondary: true, resist: true},
    respsn: {name: "Poison Resistance", secondary: true, resist: true},
    resarc: {name: "Arcane/Holy Resistance", format: "+%d Arcane Resistance", secondary: true, resist: true},
    reslit: {name: "Lightning Resistance", secondary: true, resist: true},
    resphy_percent: {name: "Physical Resistance"},
    resfir_percent: {name: "Fire Resistance"},
    rescol_percent: {name: "Cold Resistance"},
    respsn_percent: {name: "Poison Resistance"},
    resarc_percent: {name: "Arcane/Holy Resistance"},
    reslit_percent: {name: "Lightning Resistance"},

    maxap: {name: "Maximum Arcane Power", class: "wizard", secondary: true, utility: true},
    maxhatred: {name: "Maximum Hatred", class: "demonhunter", secondary: true, utility: true},
    maxdisc: {name: "Maximum Discipline", class: "demonhunter", secondary: true, utility: true},
    maxmana: {name: "Maximum Mana", class: "witchdoctor", secondary: true, utility: true},
    maxmana_percent: {name: "Maximum Mana", class: "witchdoctor"},
    maxspirit: {name: "Maximum Spirit", class: "monk", secondary: true, utility: true},
    maxfury: {name: "Maximum Fury", class: "barbarian", secondary: true, utility: true},
    maxwrath: {name: "Maximum Wrath", class: "crusader", secondary: true, utility: true},

    damage_demons: {name: "Damage to Demons", format: "+%d%% Damage to Demons", secondary: true, utility: true},
    damage_beasts: {name: "Damage to Beasts", format: "+%d%% Damage to Beasts", secondary: true, utility: true},
    damage_humans: {name: "Damage to Humans", format: "+%d%% Damage to Humans", secondary: true, utility: true},
    damage_undead: {name: "Damage to Undead", format: "+%d%% Damage to Undead", secondary: true, utility: true},

    rangedef: {name: "Missile Damage Reduction", format: "Reduces damage from ranged attacks by %.1f%%.", dr: true, secondary: true},
    meleedef: {name: "Melee Damage Reduction", format: "Reduces damage from melee attacks by %.1f%%", dr: true, secondary: true},
    gf: {name: "Gold Find", format: "+%d%% Extra Gold from Monsters", secondary: true, utility: true},
    mf: {name: "Magic Find", format: "%d%% Better Chance of Finding Magical Items", secondary: true, utility: true},
    laek: {name: "Life per Kill", format: "+%d Life after Each Kill", secondary: true},
    healbonus: {name: "Health Globe Healing Bonus", format: "Health Globes and Potions Grant +%d Life.", secondary: true}, 
    firethorns: {name: "Fire Thorns", format: "Ranged and melee attackers take %d Fire damage per hit", secondary: true, utility: true},
    thorns: {name: "Thorns", format: "Ranged and melee attackers take %d damage per hit", secondary: true, utility: true},
    ccr: {name: "Crowd Control Reduction", format: "Reduces duration of control impairing effects by %d%%", dr: true, secondary: true, utility: true},
    expmul: {name: "Bonus Experience", format: "Increases Bonus Experience by %d%%", secondary: true, utility: true},
    expadd: {name: "Bonus Experience per Kill", format: "Monster kills grant +%d experience.", secondary: true, utility: true},
    pickup: {name: "Bonus to Gold/Globe Radius", format: "Increases Gold and Health Pickup by %d Yards.", secondary: true, utility: true},
    lvlreq: {name: "Level Reduction", format: "Level Requirement Reduced by %d", secondary: true, utility: true},
    dura: {name: "Ignores Durability Loss", format: "Ignores Durability Loss", args: 0, secondary: true, utility: true},

    hitfear: {name: "Fear on Hit", format: "%.1f%% Chance to Fear on Hit", secondary: true, utility: true, dr: true},
    hitstun: {name: "Stun on Hit", format: "%.1f%% Chance to Stun on Hit", secondary: true, utility: true, dr: true},
    hitblind: {name: "Blind on Hit", format: "%.1f%% Chance to Blind on Hit", secondary: true, utility: true, dr: true},
    hitfreeze: {name: "Freeze on Hit", format: "%.1f%% Chance to Freeze on Hit", secondary: true, utility: true, dr: true},
    hitchill: {name: "Chill on Hit", format: "%.1f%% Chance to Chill on Hit", secondary: true, utility: true, dr: true},
    hitslow: {name: "Slow on Hit", format: "%.1f%% Chance to Slow on Hit", secondary: true, utility: true, dr: true},
    hitimmobilize: {name: "Immobilize on Hit", format: "%.1f%% Chance to Immobilize on Hit", secondary: true, utility: true, dr: true},
    hitknockback: {name: "Knockback on Hit", format: "%.1f%% Chance to Knockback on Hit", secondary: true, utility: true, dr: true},

    petias: {name: "Pet Attack Speed"},
    rcrint: {name: "Resource Cost Reduction"},

    custom: {name: "Legendary Affix", args: 0, secondary: true},

    sockets: {name: "Sockets", format: "Sockets (%d)"},
  };
  DiabloCalc.resources = {
    ap: "Arcane Power",
    hatred: "Hatred",
    disc: "Discipline",
    mana: "Mana",
    fury: "Fury",
    spirit: "Spirit",
    wrath: "Wrath",
  };
  DiabloCalc.statGroupNames = {
    "weapon": "Weapon Damage",
    "elemental": "Elemental Damage",
    "resist": "Elemental Resistance",
    "resistany": "Resistance",
    "mainstat": "Primary Attribute",
    "onhit": "On Hit Effect",
    "resource": "Resources",
  };
  DiabloCalc.statGroups = {
    "weapon": ["wpnphy", "wpnfir", "wpncol", "wpnpsn", "wpnarc", "wpnlit", "wpnhol"],
    "elemental": ["dmgphy", "dmgfir", "dmgcol", "dmgpsn", "dmgarc", "dmglit", "dmghol"],
    "resist": ["resphy", "resfir", "rescol", "respsn", "resarc", "reslit"],
    "resistany": ["resall", "resist"],
    "mainstat": ["str", "dex", "int"],
    "lifeper": ["lph", "laek"],
    "onhit": ["hitfear", "hitstun", "hitblind", "hitfreeze", "hitchill", "hitslow", "hitimmobilize", "hitknockback"],
    "resource": ["apregen", "apoc", "hatredregen", "manaregen", "lifespirit", "spiritregen",
                 "lifefury", "furyregen", "lifewrath", "wrathregen", "manaperkill",
                 "maxap", "maxdisc", "maxmana", "maxspirit", "maxfury", "maxwrath"],
    "skill_wizard_head": [
      "skill_wizard_disintegrate",
      "skill_wizard_arcanetorrent",
      "skill_wizard_arcaneorb",
      "skill_wizard_rayoffrost",
      "skill_wizard_energytwister",
      "skill_wizard_waveofforce",
      "skill_wizard_meteor",
    ],
    "skill_wizard_torso": [
      "skill_wizard_explosiveblast",
      "skill_wizard_familiar",
      "skill_wizard_blackhole",
      "skill_wizard_hydra",
      "skill_wizard_blizzard",
    ],
    "skill_wizard_legs": [
      "skill_wizard_magicmissile",
      "skill_wizard_shockpulse",
      "skill_wizard_electrocute",
      "skill_wizard_spectralblade",
    ],
    "skill_demonhunter_head": [
      "skill_demonhunter_chakram",
      "skill_demonhunter_impale",
      "skill_demonhunter_rapidfire",
      "skill_demonhunter_elementalarrow",
      "skill_demonhunter_strafe",
      "skill_demonhunter_clusterarrow",
      "skill_demonhunter_multishot",
    ],
    "skill_demonhunter_torso": [
      "skill_demonhunter_fanofknives",
      "skill_demonhunter_companion",
      "skill_demonhunter_spiketrap",
      "skill_demonhunter_sentry",
      "skill_demonhunter_rainofvengeance",
    ],
    "skill_demonhunter_legs": [
      "skill_demonhunter_hungeringarrow",
      "skill_demonhunter_bolas",
      "skill_demonhunter_entanglingshot",
      "skill_demonhunter_grenade",
      "skill_demonhunter_evasivefire",
    ],
    "skill_barbarian_head": [
      "skill_barbarian_ancientspear",
      "skill_barbarian_hammeroftheancients",
      "skill_barbarian_whirlwind",
      "skill_barbarian_seismicslam",
    ],
    "skill_barbarian_torso": [
      "skill_barbarian_furiouscharge",
      "skill_barbarian_avalanche",
      "skill_barbarian_earthquake",
      "skill_barbarian_rend",
      "skill_barbarian_revenge",
      "skill_barbarian_overpower",
      "skill_barbarian_calloftheancients",
    ],
    "skill_barbarian_legs": [
      "skill_barbarian_cleave",
      "skill_barbarian_weaponthrow",
      "skill_barbarian_frenzy",
      "skill_barbarian_bash",
    ],
    "skill_witchdoctor_head": [
      "skill_witchdoctor_zombiecharger",
      "skill_witchdoctor_sacrifice",
      "skill_witchdoctor_firebats",
      "skill_witchdoctor_acidcloud",
      "skill_witchdoctor_spiritbarrage",
    ],
    "skill_witchdoctor_torso": [
      "skill_witchdoctor_locustswarm",
      "skill_witchdoctor_graspofthedead",
      "skill_witchdoctor_summonzombiedogs",
      "skill_witchdoctor_wallofzombies",
      "skill_witchdoctor_gargantuan",
      "skill_witchdoctor_haunt",
      "skill_witchdoctor_piranhas",
      "skill_witchdoctor_fetisharmy",
    ],
    "skill_witchdoctor_legs": [
      "skill_witchdoctor_plagueoftoads",
      "skill_witchdoctor_firebomb",
      "skill_witchdoctor_poisondart",
      "skill_witchdoctor_corpsespiders",
    ],
    "skill_monk_head": [
      "skill_monk_explodingpalm",
      "skill_monk_waveoflight",
      "skill_monk_tempestrush",
      "skill_monk_lashingtailkick",
    ],
    "skill_monk_torso": [
      "skill_monk_sweepingwind",
      "skill_monk_cyclonestrike",
      "skill_monk_mystically",
      "skill_monk_dashingstrike",
      "skill_monk_sevensidedstrike",
    ],
    "skill_monk_legs": [
      "skill_monk_deadlyreach",
      "skill_monk_wayofthehundredfists",
      "skill_monk_fistsofthunder",
      "skill_monk_cripplingwave",
    ],
    "skill_crusader_head": [
      "skill_crusader_blessedshield",
      "skill_crusader_shieldbash",
      "skill_crusader_phalanx",
      "skill_crusader_blessedhammer",
      "skill_crusader_fistoftheheavens",
      "skill_crusader_sweepattack",
    ],
    "skill_crusader_torso": [
      "skill_crusader_condemn",
      "skill_crusader_heavensfury",
      "skill_crusader_fallingsword",
      "skill_crusader_bombardment",
    ],
    "skill_crusader_legs": [
      "skill_crusader_justice",
      "skill_crusader_punish",
      "skill_crusader_smite",
      "skill_crusader_slash",
    ],
    "skill_wizard": ["skill_wizard_head", "skill_wizard_torso", "skill_wizard_legs"],
    "skill_demonhunter": ["skill_demonhunter_head", "skill_demonhunter_torso", "skill_demonhunter_legs"],
    "skill_barbarian": ["skill_barbarian_head", "skill_barbarian_torso", "skill_barbarian_legs"],
    "skill_witchdoctor": ["skill_witchdoctor_head", "skill_witchdoctor_torso", "skill_witchdoctor_legs"],
    "skill_monk": ["skill_monk_head", "skill_monk_torso", "skill_monk_legs"],
    "skill_crusader": ["skill_crusader_head", "skill_crusader_torso", "skill_crusader_legs"],
    "skill_head": ["skill_wizard_head", "skill_demonhunter_head", "skill_barbarian_head", "skill_monk_head", "skill_witchdoctor_head", "skill_crusader_head"],
    "skill_torso": ["skill_wizard_torso", "skill_demonhunter_torso", "skill_barbarian_torso", "skill_monk_torso", "skill_witchdoctor_torso", "skill_crusader_torso"],
    "skill_legs": ["skill_wizard_legs", "skill_demonhunter_legs", "skill_barbarian_legs", "skill_monk_legs", "skill_witchdoctor_legs", "skill_crusader_legs"],
    "skill": ["skill_wizard", "skill_demonhunter", "skill_barbarian", "skill_monk", "skill_witchdoctor", "skill_crusader"],

    "any": [
      "weapon", "damage", "elemental", "mainstat", "vit",
      "armor", "resall", "life", "ias", "chc", "chd", "edmg",
      "area", "block", "edef", "regen", "lph", "cdr", "rcr",
      "resource", "ms", "bleed", "skill", "resource", "resist", "laek",
      "healbonus", "thorns", "rangedef", "meleedef", "ccr",
      "gf", "mf", "expmul", "expadd", "pickup", "lvlreq",
      "dura", "onhit"
    ],
  };
  DiabloCalc.statExclusiveGroups = [
    "weapon", "elemental", "resistany", "mainstat", "skill", "onhit", "lifeper",
  ];
  DiabloCalc.statList = {
    primary: {
      "Sockets": ["sockets"],
      "Weapon Damage": ["weapon"],
      "Attributes": ["mainstat", "vit"],
      "Defensive": ["armor", "resall", "block", "edef"],
      "Life": ["life", "regen", "lph", "lifespirit", "lifewrath", "lifefury"],
      "Offensive": ["damage", "weaponias", "ias", "chc", "chd", "cdr", "edmg", "area", "bleed"],
      "Elemental": ["elemental"],
      "Resource": ["rcr", "apoc", "hatredregen", "manaregen", "spiritregen", "wrathregen"],
      "Skill Damage": ["skill"],
      "Misc": ["ms"],
    },
    secondary: {
      "Resistance": ["resist"],
      "Resource": ["maxap", "maxdisc", "maxmana", "maxspirit", "maxwrath", "maxfury"],
      "Defensive": ["rangedef", "meleedef", "ccr"],
      "Life": ["laek", "healbonus", "pickup"],
      "Chance on Hit": ["onhit"],
      "Misc": ["gf", "mf", "thorns", "expmul", "expadd", "lvlreq", "dura"],
    },
  };
  DiabloCalc.extendStats = function(dst, name) {
    if (typeof name != "string") {
      for (var i = 0; i < name.length; ++i) {
        DiabloCalc.extendStats(dst, name[i]);
      }
    } else if (DiabloCalc.statGroups[name]) {
      for (var i = 0; i < DiabloCalc.statGroups[name].length; ++i) {
        DiabloCalc.extendStats(dst, DiabloCalc.statGroups[name][i]);
      }
    } else if (DiabloCalc.stats[name]) {
      dst.push(name);
    }
    return dst;
  };

  if (!DiabloCalc.skills) DiabloCalc.skills = {};
  DiabloCalc.skills.attack = {
    hand: {
      id: "attack-hand",
      name: "Punch",
      info: {"Damage": {coeff: 1}},
      tip: "A good old-fashioned punch.",
    },
    melee: {
      id: "attack-melee",
      name: "Melee Attack",
      info: {"Damage": {coeff: 1}},
      tip: "Swing your melee weapon for <span class=\"d3-color-green\">100%</span> weapon damage.",
    },
    bow: {
      id: "attack-bow",
      name: "Ranged Attack",
      info: {"Damage": {coeff: 1}},
      tip: "Shoot your ranged weapon for <span class=\"d3-color-green\">100%</span> weapon damage.",
    },
    wand: {
      id: "attack-wand",
      name: "Shoot Wand",
      info: {"Damage": {coeff: 1}},
      tip: "Shoot your wand for <span class=\"d3-color-green\">100%</span> weapon damage.",
    },
  };
})();

if (!DiabloCalc.skillcat) DiabloCalc.skillcat = {};
if (!DiabloCalc.skills) DiabloCalc.skills = {};
if (!DiabloCalc.passives) DiabloCalc.passives = {};
if (!DiabloCalc.partybuffs) DiabloCalc.partybuffs = {};
DiabloCalc.skillcat.demonhunter = {
  primary: "Primary",
  secondary: "Secondary",
  defensive: "Defensive",
  hunting: "Hunting",
  devices: "Devices",
  archery: "Archery",
};
DiabloCalc.demonhunter = {
  varSpeed: function(stats) {
    switch (stats.info.weaponClass) {
    case "bow": return 57.777767;
    case "crossbow": return 57.391285;
    case "handcrossbow": return 56.842083;
    case "dualwield": return 56.842075;
    default: return 57.692299;
    }
  },
};
function hellcat_param(runes) {
  return {min: 0, max: "leg_hellcatwaistguard", val: 0, name: "Bounces", buffs: false, show: function(rune, stats) {
               return !!stats.leg_hellcatwaistguard && (!runes || runes.indexOf(rune) >= 0);
         }};
}
function hellcat_percent(stats, param) {
  if (stats.leg_hellcatwaistguard && param) {
    var pct = {};
    pct[DiabloCalc.itemById.P43_Unique_Belt_005_x1.name] = (param >= stats.leg_hellcatwaistguard ? 800 : 50 * param);
    return pct;
  }
}
DiabloCalc.skills.demonhunter = {
  hungeringarrow: {
    id: "hungering-arrow",
    name: "Hungering Arrow",
    category: "primary",
    row: 0,
    col: 0,
    runes: {
      d: "Puncturing Arrow",
      a: "Serrated Arrow",
      b: "Shatter Shot",
      c: "Devouring Arrow",
      e: "Spray of Teeth",
    },
    info: function(rune, stats) {
      var fpa = DiabloCalc.demonhunter.varSpeed(stats);
      var pierce = 35 + (stats.leg_theninthcirrisatchel || 0);
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 1.55}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 1.55}, "Pierce Chance": (pierce + 15) + "%"}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 1.55}}; break;
      case "b": res = {"Damage": {elem: "lit", coeff: 1.55}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 1.55}, "Damage Increase per Pierce": {sum: true, "Damage": {factor: 0.7}}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 1.55}}; break;
      }
      return $.extend({"DPS": {sum: true, "Damage": {speed: 1, ias: (stats.leg_hunterswrath ? 30 : 0), fpa: fpa, round: "up"}}, "Damage": {}, "Pierce Chance": pierce + "%"}, res);
    },
  },
  entanglingshot: {
    id: "entangling-shot",
    name: "Entangling Shot",
    category: "primary",
    row: 0,
    col: 1,
    runes: {
      b: "Chain Gang",
      c: "Shock Collar",
      a: "Heavy Burden",
      d: "Justice is Served",
      e: "Bounty Hunter",
    },
    info: function(rune, stats) {
      var fpa = DiabloCalc.demonhunter.varSpeed(stats);
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 2}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 2}}; break;
      case "c": res = {"Damage": {elem: "lit", coeff: 2}, "Entangle Damage": {elem: "lit", coeff: 0.8}}; break;
      case "a": res = {"Damage": {elem: "col", coeff: 2}}; break;
      case "d": res = {"Damage": {elem: "fir", coeff: 2}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 2}}; break;
      }
      return $.extend({"DPS": {sum: true, "Damage": {speed: 1, ias: (stats.leg_hunterswrath ? 30 : 0), fpa: fpa, round: "up"}}}, res);
    },
  },
  bolas: {
    id: "bolas",
    name: "Bolas",
    category: "primary",
    row: 0,
    col: 2,
    runes: {
      a: "Volatile Explosives",
      c: "Thunder Ball",
      b: "Freezing Strike",
      d: "Bitter Pill",
      e: "Imminent Doom",
    },
    info: {
      "*": {"DPS": {sum: true, "Damage": {speed: 1, ias: "leg_hunterswrath?30:0", fpa: 56.666666, round: "up"}}},
      x: {"Damage": {elem: "fir", coeff: 1.6}, "Secondary Damage": {elem: "fir", coeff: 1.1}},
      a: {"Damage": {elem: "fir", coeff: 1.6}, "Secondary Damage": {elem: "fir", coeff: 1.1}},
      c: {"Damage": {elem: "lit", coeff: 1.6}, "Secondary Damage": {elem: "lit", coeff: 1.1}},
      b: {"Damage": {elem: "col", coeff: 1.6}},
      d: {"Damage": {elem: "lit", coeff: 1.6}, "Secondary Damage": {elem: "lit", coeff: 1.1}},
      e: {"Damage": {elem: "fir", coeff: 2.16}, "Secondary Damage": {elem: "fir", coeff: 1.49}},
    },
  },
  evasivefire: {
    id: "evasive-fire",
    name: "Evasive Fire",
    category: "primary",
    row: 0,
    col: 3,
    runes: {
      a: "Hardened",
      c: "Parting Gift",
      b: "Covering Fire",
      e: "Focus",
      d: "Surge",
    },
    info: function(rune, stats) {
      var fpa = DiabloCalc.demonhunter.varSpeed(stats);
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 2}, "Secondary Damage": {elem: "phy", coeff: 1}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 2}, "Secondary Damage": {elem: "phy", coeff: 1}}; break;
      case "c": res = {"Damage": {elem: "phy", coeff: 2}, "Secondary Damage": {elem: "phy", coeff: 1}, "Bomb Damage": {elem: "phy", coeff: 1.5}}; break;
      case "b": res = {"Damage": {elem: "fir", coeff: 2}, "Secondary Damage": {elem: "fir", coeff: 2}}; break;
      case "e": res = {"Damage": {elem: "col", coeff: 2}, "Secondary Damage": {elem: "col", coeff: 1}}; break;
      case "d": res = {"Damage": {elem: "lit", coeff: 2}, "Secondary Damage": {elem: "lit", coeff: 1}}; break;
      }
      return $.extend({"DPS": {sum: true, "Damage": {speed: 1, ias: (stats.leg_hunterswrath ? 30 : 0), fpa: fpa, round: "up"}}}, res);
    },
    active: false,
    buffs: {
      a: {armor_percent: 25},
    },
  },
  grenade: {
    id: "grenade",
    name: "Grenade",
    category: "primary",
    row: 0,
    col: 4,
    runes: {
      d: "Tinkerer",
      b: "Cluster Grenades",
      c: "Grenade Cache",
      e: "Stun Grenade",
      a: "Cold Grenade",
    },
    params: [hellcat_param()],
    info: function(rune, stats) {
      var res = {"DPS": {sum: true, "Damage": {speed: 1, ias: "leg_hunterswrath?30:0", fpa: 56.470554}},
                 "Damage": {elem: "fir", coeff: 1.6, passives: {grenadier: 10}}};
      if (rune === "b") {
        res["Damage"].coeff = 2;
      } else if (rune === "e") {
        res["Damage"].elem = "lit";
      } else if (rune === "a") {
        res["Damage"].elem = "col";
        res["Cloud Damage"] = {elem: "col", coeff: 1.2, passives: {grenadier: 10}, total: true};
      }
      res["Damage"].percent = hellcat_percent(stats, this.params[0].val);
      return res;
    },
  },
  impale: {
    id: "impale",
    name: "Impale",
    category: "secondary",
    row: 1,
    col: 0,
    runes: {
      b: "Impact",
      c: "Chemical Burn",
      a: "Overpenetration",
      d: "Ricochet",
      e: "Grievous Wounds",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 7.5}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 7.5}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 7.5}, "Burn Damage": {elem: "fir", coeff: 5, total: true}}; break;
      case "a": res = {"Damage": {elem: "col", coeff: 7.5}}; break;
      case "d": res = {"Damage": {elem: "lit", coeff: 7.5}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 7.5, chd: 330}}; break;
      }
      res = $.extend({"Cost": {cost: 20}}, res);
      var sentries = (stats.skills.sentry || stats.leg_helltrapper ? DiabloCalc.skills.demonhunter.sentry.params[0].val : 0);
      if (stats.set_marauder_4pc && sentries) {
        var ext = {pet: true, weapon: "mainhand", percent: {"Sentry %": stats.skill_demonhunter_sentry}};
        ext.percent[DiabloCalc.itemSets.marauder.name] = 400;
        res["Sentry Damage"] = $.extend({}, res["Damage"], ext);
        DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Damage"], stats);
        if (res["Burn Damage"]) res["Sentry Burn Damage"] = $.extend({}, res["Burn Damage"], ext);
      }
      if (stats.set_shadow_6pc) {
        res["First Target Bonus"] = {elem: res["Damage"].elem, coeff: 750};
      }
      var total = {};
      if (res["Sentry Damage"]) total["Sentry Damage"] = {count: sentries};
      if (res["Burn Damage"]) total["Burn Damage"] = {};
      if (res["Sentry Burn Damage"]) total["Sentry Burn Damage"] = {count: sentries};
      if (!$.isEmptyObject(total) || stats.leg_holypointshot) {
        total["Damage"] = {};
        if (stats.leg_holypointshot) {
          for (var k in total) {
            total[k].count = (total[k].count || 1) * 3;
          }
        }
        total.sum = true;
        res["Total Damage"] = total;
        res["DPS"] = {sum: true, "Total Damage": {speed: 1, fpa: 58.064510, round: "up"}};
      } else {
        res["DPS"] = {sum: true, "Damage": {speed: 1, fpa: 58.064510, round: "up"}};
      }
      return res;
    },
  },
  rapidfire: {
    id: "rapid-fire",
    name: "Rapid Fire",
    category: "secondary",
    row: 1,
    col: 1,
    runes: {
      d: "Withering Fire",
      e: "Frost Shots",
      c: "Fire Support",
      b: "High Velocity",
      a: "Bombardment",
    },
    params: [{min: 0, max: 4, name: "Channeled for", buffs: false, show: function(rune, stats) {
               return stats.leg_wojahnniassaulter || stats.leg_wojahnniassaulter_p2;
             }},
             hellcat_param("a")],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Tick Damage": {elem: "phy", coeff: 6.85}}; break;
      case "d": res = {"Tick Damage": {elem: "fir", coeff: 6.85}}; break;
      case "e": res = {"Tick Damage": {elem: "col", coeff: 6.85}}; break;
      case "c": res = {"Tick Damage": {elem: "phy", coeff: 6.85}, "Rocket Damage": {elem: "phy", coeff: 1.45, passives: {ballistics: 100}}}; break;
      case "b": res = {"Tick Damage": {elem: "lit", coeff: 6.85}}; break;
      case "a": res = {"Tick Damage": {elem: "fir", coeff: 5.45, passives: {grenadier: 10}, percent: hellcat_percent(stats, this.params[1].val)}}; break;
      }
      if ((stats.leg_wojahnniassaulter || stats.leg_wojahnniassaulter_p2) && this.params[0].val) {
        var pct = {};
        pct[DiabloCalc.itemById.Unique_Xbow_102_x1.name] = this.params[0].val * (stats.leg_wojahnniassaulter || stats.leg_wojahnniassaulter_p2);
        res["Tick Damage"].percent = $.extend(res["Tick Damage"].percent || {}, pct);
        if (res["Rocket Damage"]) {
          res["Rocket Damage"].percent = pct;
        }
      }
      var cost = {"Cost": {cost: (rune === "d" ? 10 : 20)}};
      if (!stats.leg_sinseekers) cost["Channeling Cost"] = {cost: 6, slowest: true, fpa: (rune === "a" ? 20 : 10)};
      res = $.extend(cost, res);
      res["Tick Damage"].divide = {"Base Speed": (rune === "a" ? 3 : 6)};
      res["DPS"] = {sum: true, tip: ["Snapshots the speed of your current weapon", "Calculations are based on your slowest weapon"],
        "Tick Damage": {speed: 1, slowest: true, fpa: (rune === "a" ? 20 : 10)}};
      if (rune === "c") res["DPS"]["Rocket Damage"] = {aps: 1, count: 2};
      return res;
    },
  },
  chakram: {
    id: "chakram",
    name: "Chakram",
    category: "secondary",
    row: 1,
    col: 2,
    runes: {
      a: "Twin Chakrams",
      c: "Serpentine",
      d: "Razor Disk",
      b: "Boomerang",
      e: "Shuriken Cloud",
    },
    params: [{min: 0, max: "maxhatred", name: "Hatred", show: function(rune, stats) {
               return !!stats.leg_swordofillwill;
             }}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 3.8}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 2.2}}; break;
      case "c": res = {"Damage": {elem: "col", coeff: 5}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 3.8}}; break;
      case "b": res = {"Damage": {elem: "lit", coeff: 4}}; break;
      case "e": res = {"DPS": {elem: "phy", coeff: 2, total: true}}; break;
      }
      if (!stats.leg_spinesofseethinghatred) {
        res = $.extend({"Cost": {cost: 10}}, res);;
      }
      if (stats.leg_swordofillwill) {
        var pct = {};
        pct[DiabloCalc.itemById.P4_Unique_Sword_1H_01.name] = stats.leg_swordofillwill * this.params[0].val;
        if (res["Damage"]) res["Damage"].percent = pct;
        if (res["DPS"]) res["DPS"].percent = pct;
      }
      if (rune !== "e") {
        var sentries = (stats.skills.sentry || stats.leg_helltrapper ? DiabloCalc.skills.demonhunter.sentry.params[0].val : 0);
        if (stats.set_marauder_4pc && sentries) {
          var ext = {pet: true, weapon: "mainhand", percent: {"Sentry %": stats.skill_demonhunter_sentry}};
          ext.percent[DiabloCalc.itemSets.marauder.name] = 400;
          res["Sentry Damage"] = $.extend({}, res["Damage"], ext);
          DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Damage"], stats);
        }
        var total = {};
        if (res["Sentry Damage"]) total["Sentry Damage"] = {count: sentries};
        if (!$.isEmptyObject(total) || rune === "a") {
          total.sum = true;
          total["Damage"] = {};
          res["Total Damage"] = total;
        }
        if (rune == "a") {
          total["Damage"].factor = 2;
          if (total["Sentry Damage"]) total["Sentry Damage"].factor = 2;
        }
      }
      return res;
    },
  },
  elementalarrow: {
    id: "elemental-arrow",
    name: "Elemental Arrow",
    category: "secondary",
    row: 1,
    col: 3,
    runes: {
      b: "Ball Lightning",
      a: "Frost Arrow",
      c: "Immolation Arrow",
      e: "Lightning Bolts",
      d: "Nether Tentacles",
    },
    params: [{rune: "b", min: 2, max: 4, val: 3, name: "Target Size", buffs: false}],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "fir", coeff: 3}}; break;
      case "b": res = {"Damage": {elem: "lit", coeff: 1.5}, "Average Damage": {sum: true, "Damage": {factor: this.params[0].val * 100 / ((stats.leg_augustinespanacea && 30) || stats.leg_meticulousbolts || 100)}}}; break;
      case "a": res = {"Damage": {elem: "col", coeff: 3.3}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 3}, "Explosion Damage": {elem: "fir", coeff: 3.15, total: true}}; break;
      case "e": res = {"Damage": {elem: "lit", coeff: 3}}; break;
      case "d": res = {"Damage": {elem: "phy", coeff: 3}}; break;
      }
      if (stats.leg_augustinespanacea) {
        var pct = {};
        pct[DiabloCalc.itemById.P41_Unique_Quiver_001.name] = stats.leg_augustinespanacea;
        if (rune === "a") res["Damage"].percent = pct;
        if (rune === "c") res["Explosion Damage"].percent = pct;
        if (rune === "e") res["Damage"].percent = pct;
        if (rune === "d") res["Damage"].percent = pct;
      }
      if (!stats.leg_kridershot) {
        res = $.extend({"Cost": {cost: 10}}, res);
      }
      var sentries = (stats.skills.sentry || stats.leg_helltrapper ? DiabloCalc.skills.demonhunter.sentry.params[0].val : 0);
      if (stats.set_marauder_4pc && sentries) {
        var ext = {pet: true, weapon: "mainhand", percent: {"Sentry %": stats.skill_demonhunter_sentry}};
        ext.percent[DiabloCalc.itemSets.marauder.name] = 400;
        res["Sentry Damage"] = $.extend(true, {}, res["Damage"], ext);
        DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Damage"], stats);
        if (res["Explosion Damage"]) {
          res["Sentry Explosion Damage"] = $.extend(true, {}, res["Explosion Damage"], ext);
          DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Explosion Damage"], stats);
        }
        if (rune === "b") res["Average Sentry Damage"] = {sum: true, "Sentry Damage": {factor: res["Average Damage"]["Damage"].factor}};
      }
      var total = {};
      if (res["Average Sentry Damage"]) total["Average Sentry Damage"] = {count: sentries};
      else if (res["Sentry Damage"]) total["Sentry Damage"] = {count: sentries};
      if (res["Explosion Damage"]) total["Explosion Damage"] = {};
      if (res["Sentry Explosion Damage"]) total["Sentry Explosion Damage"] = {count: sentries};
      if (!$.isEmptyObject(total)) {
        total.sum = true;
        total[rune === "b" ? "Average Damage" : "Damage"] = {};
        res["Total Damage"] = total;
        if (stats.leg_kridershot) res["DPS"] = {sum: true, "Total Damage": {speed: 1, fpa: 56.666666, round: "up"}};
      } else if (stats.leg_kridershot) {
        res["DPS"] = {sum: true};
        res["DPS"][rune === "b" ? "Average Damage" : "Damage"] = {speed: 1, fpa: 56.666666, round: "up"};
      }
      return res;
    },
  },
  caltrops: {
    id: "caltrops",
    name: "Caltrops",
    category: "defensive",
    row: 2,
    col: 0,
    nolmb: true,
    runes: {
      b: "Hooked Spines",
      c: "Torturous Ground",
      a: "Jagged Spikes",
      d: "Carved Stakes",
      e: "Bait the Trap",
    },
    info: {
      "*": {"Cost": {cost: 6, resource: "disc"}},
      a: {"Damage": {elem: "phy", weapon: "mainhand", coeff: 2.7, total: true}, "Offhand Damage": {elem: "phy", weapon: "offhand", coeff: 2.7, total: true}},
      d: {"Cost": {cost: 3, resource: "disc"}},
    },
    active: true,
    buffs: {
      e: {chc: 10},
    },
  },
  smokescreen: {
    id: "smoke-screen",
    name: "Smoke Screen",
    category: "defensive",
    row: 2,
    col: 1,
    nolmb: true,
    runes: {
      e: "Displacement",
      b: "Lingering Fog",
      c: "Healing Vapors",
      d: "Special Recipe",
      a: "Vanishing Powder",
    },
    info: {
      x: {"Cost": {cost: 14, resource: "disc"}, "Uptime": {cooldown: 1.5, duration: 1, after: true}},
      e: {"Cost": {cost: 14, resource: "disc"}, "Uptime": {cooldown: 1.5, duration: 1, after: true}},
      b: {"Cost": {cost: 14, resource: "disc"}, "Uptime": {cooldown: 1.5, duration: 1.5, after: true}},
      c: {"Cost": {cost: 14, resource: "disc"}, "Uptime": {cooldown: 1.5, duration: 1, after: true}},
      d: {"Cost": {cost: 8, resource: "disc"}, "Uptime": {cooldown: 1.5, duration: 1, after: true}},
      a: {"Uptime": {cooldown: 6, duration: 1, after: true}},
    },
    active: false,
    buffs: {
      e: {extrams: 100},
    },
  },
  shadowpower: {
    id: "shadow-power",
    name: "Shadow Power",
    category: "defensive",
    row: 2,
    col: 2,
    nolmb: true,
    runes: {
      a: "Night Bane",
      e: "Blood Moon",
      d: "Well of Darkness",
      c: "Gloom",
      b: "Shadow Glide",
    },
    info: function(rune, stats) {
      if (!stats.set_shadow_4pc) {
        return {"Cost": {cost: (rune === "d" ? 8 : 14), resource: "disc"}};
      }
    },
    active: true,
    buffs: function(rune, stats) {
      var lph = 26821 + (stats.laek || 0) * 0.25;
      if (stats.set_shadow_4pc) {
        return {lph: lph * 2, dmgred: 35, extrams: 30};
      } else {
        switch (rune) {
        case "x": return {lph: lph};
        case "a": return {lph: lph};
        case "e": return {lph: lph * 2};
        case "d": return {lph: lph};
        case "c": return {lph: lph, dmgred: 35};
        case "b": return {lph: lph, extrams: 30};
        }
      }
    },
  },
  vault: {
    id: "vault",
    name: "Vault",
    category: "hunting",
    row: 3,
    col: 0,
    runes: {
      c: "Action Shot",
      e: "Rattling Roll",
      d: "Tumble",
      b: "Acrobatics",
      a: "Trail of Cinders",
    },
    info: function(rune, stats) {
      var res = {"Cost": {cost: 8, resource: (stats.set_danetta_2pc ? "hatred" : "disc")}};
      if (rune === "b") {
        delete res["Cost"];
        res["Cooldown"] = {cooldown: 6};
      }
      if (rune === "d") res["Tumble Cost"] = {cost: 4, resource: res["Cost"].resource};
      if (rune === "c") {
        res["Damage"] = {elem: "phy", weapon: "mainhand", coeff: 0.75, chc: 100/*, tip: ["Uses currently active weapon", "@Does not switch weapons"]*/};
        //res["Offhand Damage"] = {elem: "phy", weapon: "offhand", coeff: 0.75, chc: 100};
      }
      if (rune === "a") {
        res["Damage"] = {elem: "fir", weapon: "mainhand", coeff: 3, total: true/*, tip: ["Uses currently active weapon", "@Does not switch weapons"]*/};
        //res["Offhand Damage"] = {elem: "fir", weapon: "offhand", coeff: 3, total: true};
      }
      return res;
    },
  },
  preparation: {
    id: "preparation",
    name: "Preparation",
    category: "hunting",
    row: 3,
    col: 1,
    runes: {
      b: "Invigoration",
      a: "Punishment",
      d: "Battle Scars",
      c: "Focused Mind",
      e: "Backup Plan",
    },
    info: {
      x: {"Cooldown": {cooldown: 45}},
      b: {"Cooldown": {cooldown: 45}},
      a: {"Cooldown": {cooldown: 20}},
      d: {"Cooldown": {cooldown: 45}},
      c: {"Uptime": {cooldown: 45, duration: 15}},
      e: {"Cooldown": {cooldown: 45}},
    },
    passive: {
      b: {maxdisc: 20},
    },
  },
  companion: {
    id: "companion",
    name: "Companion",
    category: "hunting",
    row: 3,
    col: 2,
    runes: {
      a: "Spider Companion",
      d: "Bat Companion",
      b: "Boar Companion",
      e: "Ferret Companion",
      c: "Wolf Companion",
    },
    info: function(rune, stats) {
      var count = (rune == "e" ? 2 : 1);
      if (stats.set_marauder_2pc) {
        count = 7;
      }
      if (stats.leg_thecloakofgarwulf && (rune == "c" || stats.set_marauder_2pc)) {
        count += 2;
      }
      var res = {"DPS": {sum: true, "Damage": {pet: 60, count: count}},
                 "Damage": {elem: "phy", pet: true, aps: true, coeff: 1}};
      if (rune == "c" || stats.set_marauder_2pc) {
        res["Uptime"] = {duration: 10, cooldown: 30};
      } else {
        res["Cooldown"] = {cooldown: 30};
      }
      return res;
    },
    active: false,
    buffs: function(rune, stats) {
      if (rune == "c" || stats.set_marauder_2pc) {
        return {dmgmul: 15};
      }
    },
    passive: function(rune, stats) {
      if (stats.set_marauder_2pc) {
        return {hatredregen: 1, regen: 5364, resist_percent: 20, gf: 10, extrams: 10};
      } else {
        switch (rune) {
        case "d": return {hatredregen: 1};
        case "b": return {regen: 5364, resist_percent: 20};
        case "e": return {gf: 10, ms: 10};
        }
      }
    },
  },
  markedfordeath: {
    id: "marked-for-death",
    name: "Marked for Death",
    category: "hunting",
    row: 3,
    col: 3,
    runes: {
      b: "Contagion",
      c: "Valley of Death",
      a: "Grim Reaper",
      d: "Mortal Enemy",
      e: "Death Toll",
    },
    info: {
      "*": {"Cost": {cost: 3, resource: "disc"}},
    },
    active: true,
    buffs: {
      x: {dmgtaken: 15},
      b: {dmgtaken: 15},
      c: {dmgtaken: 15},
      a: {dmgtaken: 15},
      d: {dmgtaken: 15},
      e: {dmgtaken: 15},
    },
  },
  fanofknives: {
    id: "fan-of-knives",
    name: "Fan of Knives",
    category: "devices",
    row: 4,
    col: 0,
    nolmb: true,
    runes: {
      d: "Pinpoint Accuracy",
      e: "Bladed Armor",
      a: "Knives Expert",
      c: "Fan of Daggers",
      b: "Assassin's Knives",
    },
    range: 20,
    info: {
      x: {"Cooldown": {cooldown: 10}, "Damage": {weapon: "mainhand", elem: "phy", coeff: 6.2}},
      d: {"Cooldown": {cooldown: 15}, "Damage": {weapon: "mainhand", elem: "lit", coeff: 16}},
      e: {"Uptime": {cooldown: 10, duration: 6}, "Damage": {weapon: "mainhand", elem: "col", coeff: 6.2}},
      a: {"Cost": {cost: 30}, "Damage": {weapon: "mainhand", elem: "fir", coeff: 6.2}},
      c: {"Cooldown": {cooldown: 10}, "Damage": {weapon: "mainhand", elem: "fir", coeff: 6.2}},
      b: {"Cooldown": {cooldown: 10}, "Damage": {weapon: "mainhand", elem: "phy", coeff: 6.2}},
    },
    active: false,
    buffs: {
      e: {armor_percent: 40},
    },
  },
  spiketrap: {
    id: "spike-trap",
    name: "Spike Trap",
    category: "devices",
    row: 4,
    col: 1,
    runes: {
      b: "Echoing Blast",
      c: "Custom Trigger",
      a: "Impaling Spines",
      e: "Lightning Rod",
      d: "Scatter",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "fir", coeff: 11.6}}; break;
      case "b": res = {"Damage": {elem: "col", coeff: 20.2}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 19.0}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 19.3}}; break;
      case "e": res = {"Damage": {elem: "lit", coeff: 67.0}}; break;
      case "d": res = {"Damage": {elem: "fir", coeff: 11.6}}; break;
      }
      if (stats.leg_thedemonsdemise_p2 || rune === "d") {
        var count = (stats.leg_thedemonsdemise_p2 && rune === "d" ? 4 : 2);
        res["Total Damage"] = {sum: true, "Damage": {count: count}};
      }
      return $.extend({"Cost": {cost: 15}}, res);
    },
  },
  sentry: {
    id: "sentry",
    name: "Sentry",
    category: "devices",
    row: 4,
    col: 2,
    runes: {
      c: "Spitfire Turret",
      b: "Impaling Bolt",
      a: "Chain of Torment",
      d: "Polar Station",
      e: "Guardian Turret",
    },
    params: [{min: 0, max: "2+(passives.customengineering?1:0)+(leg_bombadiersrucksack?2:0)", name: "Count", buffs: false},
             {min: 0, max: 50, val: 30, name: "Distance", buffs: false, show: function(rune, stats) {
               return rune === "a" || (stats.gems.zei !== undefined);
             }}],
    fixdmg: function(dmg, stats) {
      if (stats.gems.zei !== undefined) {
        dmg.exclude = ["zei"];
        dmg.percent = (dmg.percent || {});
        dmg.percent[DiabloCalc.legendaryGems.zei.name] = this.params[1].val * (4 + 0.08 * stats.gems.zei) / 10;
      }
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", weapon: "mainhand", pet: true, coeff: 2.8}}; break;
      case "c": res = {"Damage": {elem: "fir", weapon: "mainhand", pet: true, coeff: 2.8}, "Rocket Damage": {elem: "fir", weapon: "mainhand", pet: true, coeff: 1.2, passives: {ballistics: 100}}}; break;
      case "b": res = {"Damage": {elem: "lit", weapon: "mainhand", pet: true, coeff: 2.8}}; break;
      case "a": res = {"Damage": {elem: "phy", weapon: "mainhand", pet: true, coeff: 2.8}}; break;
      case "d": res = {"Damage": {elem: "col", weapon: "mainhand", pet: true, coeff: 2.8}}; break;
      case "e": res = {"Damage": {elem: "phy", weapon: "mainhand", pet: true, coeff: 2.8}}; break;
      }
      for (var key in res) {
        this.fixdmg(res[key], stats);
      }
      res = $.extend({"Cost": {cost: 20}}, res);
      var count = this.params[0].val;
      res["DPS"] = {sum: true, "Damage": {pet: 54, speed: 1}};
      if (res["Rocket Damage"]) res["DPS"]["Rocket Damage"] = {pet: 54, speed: 1};
      res["Total DPS"] = {sum: true, "DPS": {count: count}};
      if (rune == "a") {
        res["Chain DPS"] = {elem: "phy", pet: true, aps: true, coeff: 3, total: true};
      }
      return res;
    },
    active: true,
    buffs: {
      e: {dmgred: 25},
    },
  },
  vengeance: {
    id: "vengeance",
    name: "Vengeance",
    category: "devices",
    row: 4,
    col: 3,
    runes: {
      c: "Personal Mortar",
      b: "Dark Heart",
      d: "Side Cannons",
      e: "Seethe",
      a: "From the Shadows",
    },
    info: {
      "*": {"Uptime": {duration: 20, cooldown: 90, cdr: "leg_dawn"}},
      x: {"Side Guns Damage": {elem: "phy", weapon: "mainhand", coeff: 0.6}, "Homing Rockets Damage": {elem: "phy", weapon: "mainhand", coeff: 0.4, passives: {ballistics: 100}}, "Total Damage per Attack": {sum: true, "Side Guns Damage": {count: 4}, "Homing Rockets Damage": {count: 4}}},
      c: {"Side Guns Damage": {elem: "fir", weapon: "mainhand", coeff: 0.6}, "Grenades Damage": {elem: "fir", weapon: "mainhand", coeff: 1.5, passives: {grenadier: 10}}, "Total Damage per Attack": {sum: true, "Side Guns Damage": {count: 4}, "Grenades Damage": {count: 2}}},
      b: {"Side Guns Damage": {elem: "lit", weapon: "mainhand", coeff: 0.6}, "Homing Rockets Damage": {elem: "lit", weapon: "mainhand", coeff: 0.4, passives: {ballistics: 100}}, "Total Damage per Attack": {sum: true, "Side Guns Damage": {count: 4}, "Homing Rockets Damage": {count: 4}}},
      d: {"Cannon Damage": {elem: "phy", weapon: "mainhand", coeff: 2.25}},
      e: {"Side Guns Damage": {elem: "phy", weapon: "mainhand", coeff: 0.6}, "Homing Rockets Damage": {elem: "phy", weapon: "mainhand", coeff: 0.4, passives: {ballistics: 100}}, "Total Damage per Attack": {sum: true, "Side Guns Damage": {count: 4}, "Homing Rockets Damage": {count: 4}}},
      a: {"Side Guns Damage": {elem: "col", weapon: "mainhand", coeff: 0.6}, "Shadow Clone Damage": {elem: "col", weapon: "mainhand", coeff: 1.2}, "Total Damage per Attack": {sum: true, "Side Guns Damage": {count: 4}, "Shadow Clone Damage": {}}},
    },
    active: false,
    buffs: function(rune, stats) {
      var res = {dmgmul: 40};
      if (rune === "b" || stats.leg_visageofgunes) res.dmgred = 50;
      if (rune === "e") res.hatredregen = 10;
      return res;
    },
  },
  strafe: {
    id: "strafe",
    name: "Strafe",
    category: "archery",
    row: 5,
    col: 0,
    runes: {
      b: "Icy Trail",
      d: "Drifting Shadow",
      e: "Stinging Steel",
      c: "Rocket Storm",
      a: "Demolition",
    },
    params: [hellcat_param("a")],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Tick Damage": {elem: "phy", coeff: 6.75}}; break;
      case "b": res = {"Tick Damage": {elem: "col", coeff: 6.75}, "Trail DPS": {elem: "col", coeff: 1, total: true}}; break;
      case "d": res = {"Tick Damage": {elem: "lit", coeff: 6.75}}; break;
      case "e": res = {"Tick Damage": {elem: "phy", coeff: 6.75, chd: 140}}; break;
      case "c": res = {"Tick Damage": {elem: "fir", coeff: 6.75}, "Rocket Damage": {elem: "fir", coeff: 1.3, passives: {ballistics: 100}}}; break;
      case "a": res = {"Grenade Damage": {elem: "fir", coeff: 4.6, passives: {grenadier: 10}, percent: hellcat_percent(stats, this.params[0].val)}}; break;
      }
      res = $.extend({"Cost": {cost: 12, slowest: true, fpa: (rune === "a" ? 30 : 15)}}, res);
      if (res["Tick Damage"]) res["Tick Damage"].divide = {"Base Speed": 4};
      res["DPS"] = {sum: true, tip: ["Snapshots the speed of your current weapon", "Calculations are based on your slowest weapon"]};
      if (res["Tick Damage"]) res["DPS"]["Tick Damage"] = {speed: 1, slowest: true, fpa: 15};
      if (res["Rocket Damage"]) res["DPS"]["Rocket Damage"] = {speed: 1, slowest: true, fpa: 30};
      if (res["Grenade Damage"]) res["DPS"]["Grenade Damage"] = {speed: 1, slowest: true, fpa: 30};
      return res;
    },
  },
  multishot: {
    id: "multishot",
    name: "Multishot",
    category: "archery",
    row: 5,
    col: 1,
    runes: {
      d: "Fire at Will",
      b: "Wind Chill",
      e: "Suppression Fire",
      a: "Full Broadside",
      c: "Arsenal",
    },
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", coeff: 3.6}}; break;
      case "d": res = {"Damage": {elem: "lit", coeff: 3.6}}; break;
      case "b": res = {"Damage": {elem: "col", coeff: 3.6}}; break;
      case "e": res = {"Damage": {elem: "phy", coeff: 3.6}}; break;
      case "a": res = {"Damage": {elem: "phy", coeff: 5}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 3.6}, "Rocket Damage": {elem: "fir", coeff: 3, passives: {ballistics: 100}}}; break;
      }
      res = $.extend({"Cost": {cost: (rune === "d" ? 18 : 25)}}, res);
      var sentries = (stats.skills.sentry || stats.leg_helltrapper ? DiabloCalc.skills.demonhunter.sentry.params[0].val : 0);
      if (stats.set_marauder_4pc && sentries) {
        var ext = {pet: true, weapon: "mainhand", percent: {"Sentry %": stats.skill_demonhunter_sentry}};
        ext.percent[DiabloCalc.itemSets.marauder.name] = 400;
        res["Sentry Damage"] = $.extend({}, res["Damage"], ext);
        DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Damage"], stats);
        if (res["Rocket Damage"]) {
          res["Sentry Rocket Damage"] = $.extend({}, res["Rocket Damage"], ext);
          DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Rocket Damage"], stats);
        }
      }
      var total = {};
      if (res["Sentry Damage"]) total["Sentry Damage"] = {count: sentries};
      if (res["Rocket Damage"]) total["Rocket Damage"] = {};
      if (res["Sentry Rocket Damage"]) total["Sentry Rocket Damage"] = {count: sentries};
      if (!$.isEmptyObject(total)) {
        total.sum = true;
        total["Damage"] = {};
        res["Total Damage"] = total;
        res["DPS"] = {sum: true, "Total Damage": {speed: 1, ias: ((stats.leg_yangsrecurve || stats.leg_yangsrecurve_p6) ? 50 : 0), fpa: 56.666664, round: "up"}};
      } else {
        res["DPS"] = {sum: true, "Damage": {speed: 1, ias: ((stats.leg_yangsrecurve || stats.leg_yangsrecurve_p6) ? 50 : 0), fpa: 56.666664, round: "up"}};
      }

      return res;
    },
    active: true,
    buffs: {
      b: {chc_taken: 8},
    },
  },
  clusterarrow: {
    id: "cluster-arrow",
    name: "Cluster Arrow",
    category: "archery",
    row: 5,
    col: 2,
    runes: {
      e: "Dazzling Arrow",
      b: "Shooting Stars",
      d: "Maelstrom",
      c: "Cluster Bombs",
      a: "Loaded for Bear",
    },
    params: [hellcat_param("xeca")],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "fir", coeff: 6.5}, "Grenade Damage": {elem: "fir", coeff: 2.5, passives: {grenadier: 10}}}; break;
      case "e": res = {"Damage": {elem: "lit", coeff: 6.5}, "Grenade Damage": {elem: "lit", coeff: 2.5, passives: {grenadier: 10}}}; break;
      case "b": res = {"Damage": {elem: "phy", coeff: 6.5}, "Rocket Damage": {elem: "phy", coeff: 6, passives: {ballistics: 100}}}; break;
      case "d": res = {"Damage": {elem: "col", coeff: 6.5}, "Rocket Damage": {elem: "col", coeff: 4.5, passives: {ballistics: 100}}}; break;
      case "c": res = {"Damage": {elem: "fir", coeff: 6.5}, "Grenade Damage": {elem: "fir", coeff: 6.5, passives: {grenadier:10}}}; break;
      case "a": res = {"Damage": {elem: "fir", coeff: 8.5}, "Grenade Damage": {elem: "fir", coeff: 2.5, passives: {grenadier:10}}}; break;
      }
      res = $.extend({"Cost": {cost: 40}}, res);
      if (stats.leg_manticore_p6) res["Cost"].rcr = {leg_manticore_p6: 50};
      if (stats.leg_manticore) res["Cost"].rcr = {leg_manticore: stats.leg_manticore};
      if (res["Grenade Damage"]) {
        res["Grenade Damage"].percent = hellcat_percent(stats, this.params[0].val);
      }
      var sentries = (stats.skills.sentry || stats.leg_helltrapper ? DiabloCalc.skills.demonhunter.sentry.params[0].val : 0);
      if (stats.set_marauder_4pc && sentries) {
        var ext = {pet: true, weapon: "mainhand", percent: {"Sentry %": stats.skill_demonhunter_sentry}};
        ext.percent[DiabloCalc.itemSets.marauder.name] = 400;
        res["Sentry Damage"] = $.extend({}, res["Damage"], ext);
        DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Damage"], stats);
        if (res["Grenade Damage"]) {
          res["Sentry Grenade Damage"] = $.extend(true, {}, res["Grenade Damage"], ext);
          DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Grenade Damage"], stats);
        }
        if (res["Rocket Damage"]) {
          res["Sentry Rocket Damage"] = $.extend({}, res["Rocket Damage"], ext);
          DiabloCalc.skills.demonhunter.sentry.fixdmg(res["Sentry Rocket Damage"], stats);
        }
      }
      var total = {
        sum: true,
        "Damage": {},
      };
      if (res["Sentry Damage"]) total["Sentry Damage"] = {count: sentries};
      if (res["Grenade Damage"]) total["Grenade Damage"] = {count: (rune == "c" ? 5 : 4)};
      if (res["Sentry Grenade Damage"]) total["Sentry Grenade Damage"] = {count: sentries * (rune == "c" ? 6 : 4)};
      if (res["Rocket Damage"]) total["Rocket Damage"] = {};
      if (res["Sentry Rocket Damage"]) total["Sentry Rocket Damage"] = {count: sentries};
      res["Total Damage"] = total;

      return res;
    },
  },
  rainofvengeance: {
    id: "rain-of-vengeance",
    name: "Rain of Vengeance",
    category: "archery",
    row: 5,
    col: 3,
    runes: {
      b: "Dark Cloud",
      a: "Shade",
      e: "Stampede",
      c: "Anathema",
      d: "Flying Strike",
    },
    params: [hellcat_param("c")],
    info: function(rune, stats) {
      var res;
      switch (rune) {
      case "x": res = {"Damage": {elem: "phy", weapon: "mainhand", coeff: 15, total: true}}; break;
      case "b": res = {"Damage": {elem: "phy", weapon: "mainhand", coeff: 35, total: true}}; break;
      case "a": res = {"Damage": {elem: "lit", weapon: "mainhand", coeff: 28, total: true}}; break;
      case "e": res = {"Damage": {elem: "fir", weapon: "mainhand", coeff: 46, total: true}}; break;
      case "c": res = {"Damage": {elem: "fir", weapon: "mainhand", coeff: 58, passives: {grenadier: 10}, total: true, percent: hellcat_percent(stats, this.params[0].val)}}; break;
      case "d": res = {"Damage": {elem: "col", weapon: "mainhand", coeff: 38, total: true}}; break;
      }
      res = $.extend({"Cooldown": {cooldown: 30}}, res);
      if (stats.leg_crashingrain) {
        res["Crashing Beast Damage"] = {elem: res["Damage"].elem, weapon: "mainhand", coeff: stats.leg_crashingrain / 100};
      }
      if (stats.set_natalya_2pc) {
        var ecd;
        if (stats.skills.strafe) {
          var reduction = 4;
          if (stats.skills.evasivefire) {
            var ef_fpa = DiabloCalc.demonhunter.varSpeed(stats);
            reduction += 4 * 60 / DiabloCalc.calcFrames(ef_fpa, undefined, undefined, "up");
          }
          var cooldown = 30 * (1 - 0.01 * (stats.cdr || 0)) / (reduction + 1);
          res["Effective Cooldown (Strafe)"] = parseFloat(cooldown.toFixed(2)) + " seconds";
          ecd = (ecd ? Math.min(ecd, cooldown) : cooldown);
        }
        if (stats.skills.rapidfire) {
          var fpa = stats.skills.rapidfire === "a" ? 20 : 10;
          var frames = DiabloCalc.calcFrames(fpa, undefined, true);
          var reduction = 4 * fpa / frames;
          var cooldown = 30 * (1 - 0.01 * (stats.cdr || 0)) / (reduction + 1);
          res["Effective Cooldown (Rapid Fire)"] = parseFloat(cooldown.toFixed(2)) + " seconds";
          ecd = (ecd ? Math.min(ecd, cooldown) : cooldown);
        }
        if (ecd) {
          res["Effective DPS"] = {sum: true, "Damage": {aps: 1 / ecd}};
          if (stats.leg_crashingrain) res["Effective DPS"]["Crashing Beast Damage"] = {aps: 1 / ecd};
        }
      }
      return res;
    },
  },
};
DiabloCalc.passives.demonhunter = {
  thrillofthehunt: {
    id: "thrill-of-the-hunt",
    name: "Thrill of the Hunt",
    index: 0,
  },
  tacticaladvantage: {
    id: "tactical-advantage",
    name: "Tactical Advantage",
    index: 1,
  },
  bloodvengeance: {
    id: "blood-vengeance",
    name: "Blood Vengeance",
    index: 2,
    buffs: {maxhatred: 25},
  },
  steadyaim: {
    id: "steady-aim",
    name: "Steady Aim",
    index: 3,
    active: true,
    buffs: {dmgmul: 20},
  },
  culltheweak: {
    id: "cull-the-weak",
    name: "Cull the Weak",
    index: 4,
    active: true,
    buffs: {dmgmul: 20},
  },
  nightstalker: {
    id: "night-stalker",
    name: "Night Stalker",
    index: 5,
  },
  brooding: {
    id: "brooding",
    name: "Brooding",
    index: 6,
    active: false,
    params: [{min: 0, max: 3, name: "Stacks"}],
    buffs: function(stats) {return {regen_percent: this.params[0].val * 3};},
  },
  hotpursuit: {
    id: "hot-pursuit",
    name: "Hot Pursuit",
    index: 7,
  },
  archery: {
    id: "archery",
    name: "Archery",
    index: 8,
    buffs: function(stats) {
      var res = {};
      switch (stats.info.mainhand.type) {
      case "bow": res.damage = 8; break;
      case "crossbow": res.chd = 50; break;
      case "handcrossbow": res.chc = 5; break;
      }
      if (stats.info.offhand && stats.info.offhand.type == "handcrossbow") {
        res.hatredregen = 1;
      }
      return res;
    },
  },
  numbingtraps: {
    id: "numbing-traps",
    name: "Numbing Traps",
    index: 9,
  },
  perfectionist: {
    id: "perfectionist",
    name: "Perfectionist",
    index: 10,
    buffs: {armor_percent: 10, resist_percent: 10, rcr_disc: 10},
  },
  customengineering: {
    id: "custom-engineering",
    name: "Custom Engineering",
    index: 11,
  },
  grenadier: {
    id: "grenadier",
    name: "Grenadier",
    index: 12,
    info: {"Grenade Damage": {elem: "fir", coeff: 10, passives: {grenadier: 10}}},
  },
  sharpshooter: {
    id: "sharpshooter",
    name: "Sharpshooter",
    index: 13,
    active: false,
    params: [{min: 0, max: 100, step: 4, name: "Bonus"}],
    buffs: function(stats) {return {extrachc: this.params[0].val};},
  },
  ballistics: {
    id: "ballistics",
    name: "Ballistics",
    index: 14,
    info: {"Rocket Damage": {elem: "phy", coeff: 1.5, passives: {ballistics: 100}}},
  },
  leech: {
    id: "leech",
    name: "Leech",
    index: 18,
    buffs: function(stats) {return {lph: 18506.5245 + 0.75 * (stats.laek || 0)};},
  },
  ambush: {
    id: "ambush",
    name: "Ambush",
    index: 15,
    active: false,
    buffs: {dmgmul: 40},
  },
  awareness: {
    id: "awareness",
    name: "Awareness",
    index: 16,
  },
  singleout: {
    id: "single-out",
    name: "Single Out",
    active: false,
    buffs: {chctaken: 25},
    index: 17,
  },
};
DiabloCalc.partybuffs.demonhunter = {
  companion: {
    runelist: "bc",
    multiple: true,
    buffs: function(stats) {
      var buffs = {};
      if (this.runevals.b) {
        buffs.regen = 5364;
        buffs.resist_percent = 20;
      }
      if (this.runevals.c) buffs.dmgmul = 15;
    },
  },
  sentry: {
    runelist: "e",
  },
  markedfordeath: {
    runelist: "*",
  },
};

(function() {
  var DC = DiabloCalc;

  DC.Optimizer = {
    perfection: 0.8,
    useGift: true,
  };

  function getValue(range) {
    var val = [];
    if (range.max) {
      var from = range.min, to = range.max;
      if (range.best === "min") {
        from = range.max;
        to = range.min;
      }
      var num = Math.round((from + (to - from) * DC.Optimizer.perfection) / (range.step || 1)) * (range.step || 1);
      if (num < range.min) num = range.min;
      if (num > range.max) num = range.max;
      val.push(num);
    }
    if (range.max2) {
      var num = Math.round(range.min2 + (range.max2 - range.min2) * DC.Optimizer.perfection);
      if (num < range.min2) num = range.min2;
      if (num > range.max2) num = range.max2;
      val.push(num);
    }
    if (range.args < 0) {
      for (var id in DC.passives[DC.charClass]) {
        val.push(id);
        break;
      }
    }
    return val;
  }

  function getItem(slot) {
    var item = DC.itemSlots[slot].item;
    if (!item) return;
    item = $.extend(true, {}, item);
    item.info = DC.itemById[item.id];

    var dropClass = DC.itemTypes[item.info.type].class;
    if (!dropClass && item.info.set) {
      dropClass = DC.itemSets[item.info.set].class;
    }

    function _stats(affixes) {
      var res = {};
      for (var id in affixes) {
        var stat = DC.stats[stat];
        if (stat && dropClass && stat.classes && stat.classes.indexOf(dropClass) < 0) continue;
        res[id] = (id === "sockets" ? [affixes[id].max] : getValue(affixes[id]));
      }
      return res;
    }

    var counts = DC.getStatCount(item.id);
    item.affixes = {
      primary: counts[0],
      secondary: counts[1],
      all: _stats(DC.getItemAffixesById(item.id, item.ancient, false)),
    };

    item.state = {
      primary: 0,
      secondary: 0,
      groups: {},
    };

    var preset = DC.getItemPreset(item.id);
    for (var i = 0; i < preset.length; ++i) {
      preset[i] = DC.smartListStats(preset[i], item.affixes.all, dropClass);
    }
    item.affixes.preset = preset;

    var required = DC.getItemAffixesById(item.id, item.ancient, "only");
    var srcstats = item.stats;
    item.stats = _stats(required);
    for (var id in required) {
      var stat = DC.stats[id];
      if (!stat) continue;
      if (stat.secondary) {
        item.state.secondary += 1;
      } else if (!stat.base) {
        item.state.primary += 1;
      }
      if (!required[id].noblock) {
        item.state.groups[stat.group || id] = true;
      }
    }
    for (var id in srcstats) {
      if (DC.stats[id].caldesanns) {
        item.stats[id] = srcstats[id];
      }
    }

    if (item.affixes.all.sockets) {
      item.gems = [];
      var slot = DC.itemTypes[item.info.type].slot;
      if (DC.Optimizer.useGift && (slot === "onehand" || slot === "twohand")) {
        item.stats.sockets = item.affixes.all.sockets;
        item.state.groups.sockets = true;
      }
    }

    return item;
  }
  function updateItem(slot, src) {
    var item = DC.itemSlots[slot].item;
    if (!item) return;
    item = $.extend(true, {}, item);
    item.stats = src.stats;
    if (item.gems && item.stats.sockets && item.stats.sockets[0]) {
      if (!src.gems) src.gems = [];
      for (var i = 0; i < item.gems.length && src.gems.length < item.stats.sockets[0]; ++i) {
        if (item.gems[i] && DC.legendaryGems[item.gems[i][0]]) {
          src.gems.push(item.gems[i]);
        }
      }
    }
    item.gems = src.gems;
    delete item.imported;
    DC.setSlot(slot, item);
  }

  function backupItem(item) {
    item = $.extend({}, item);
    item.stats = $.extend(true, {}, item.stats);
    item.state = $.extend(true, {}, item.state);
    if (item.gems) item.gems = $.extend(true, [], item.gems);
    return item;
  }
  function addStat(item, id) {
    if (!item.affixes.all[id]) return false;
    var stat = DC.stats[id];
    if (!stat) return false;
    if (stat.secondary && item.state.secondary >= item.affixes.secondary) return false;
    if (!stat.secondary && item.state.primary >= item.affixes.primary) return false;
    if (item.state.groups[stat.group || id]) return false;
    if (stat.secondary) item.state.secondary += 1;
    else item.state.primary += 1;
    item.state.groups[stat.group || id] = true;
    var src = item.affixes.all[id];
    if (item.stats[id]) {
      if (stat.dr) {
        for (var i = 0; i < src.length; ++i) item.stats[id][i] = 100 - (100 - (item.stats[id][i] || 0)) * (100 - src[i]) / 100;
      } else {
        for (var i = 0; i < src.length; ++i) item.stats[id][i] = (item.stats[id][i] || 0) + src[i];
      }
    } else {
      item.stats[id] = src;
    }
    return true;
  }
  function addPreset(item) {
    item = backupItem(item);
    var missing = 0;
    for (var i = 0; i < item.affixes.preset.length; ++i) {
      var list = item.affixes.preset[i];
      if (!list.length) continue;
      var has = false, best = undefined;
      for (var j = 0; j < list.length; ++j) {
        if (item.stats[list[j]]) {
          has = true;
          break;
        }
        if (!best && (!DC.stats[list[j]].classes || DC.stats[list[j]].classes.indexOf(DC.charClass) >= 0)) {
          best = list[j];
        }
      }
      if (!has) {
        if (!addStat(item, best || list[0]) && ++missing > 1) {
          return false;
        }
      }
    }
    return item;
  }

  var CompositeStats = {
    dps: {
      options: {
        speed: {type: "checkbox", name: _L("Attack speed")},
        elem: {type: "select", options: function() {
          var opt = {"": _L("No Element")};
          for (var id in {phy: 1, fir: 1, col: 1, psn: 1, arc: 1, lit: 1, hol: 1}) {
            if (!DC.stats["dmg" + id].classes || DC.stats["dmg" + id].classes.indexOf(DC.charClass) >= 0) {
              opt["dmg" + id] = DC.elements[id];
            }
          }
          return opt;
        }},
        skill: {type: "select", options: function() {
          var opt = {"": _L("No Skill")};
          var stats = DC.extendStats([], "skill_" + DC.charClass);
          for (var id in DC.skills[DC.charClass]) {
            if (stats["skill_" + DC.charClass + "_" + id]) {
              opt["skill_" + DC.charClass + "_" + id] = DC.skills[DC.charClass][id].name;
            }
          }
          return opt;
        }},
        elite: {type: "checkbox", name: _L("vs Elites")},
      },
      stats: function(options, item) {
        var list = ["wpnphy", "damage", DC.classes[DC.charClass].primary, "chc", "chd"];
        if (item) {
          var found = undefined;
          for (var i = 0; i < item.affixes.preset.length && !found; ++i) {
            for (var j = 0; j < item.affixes.preset[i].length; ++j) {
              var id = item.affixes.preset[i][j];
              if (DC.stats[id] && DC.stats[id].damage) {
                found = id;
                break;
              }
            }
          }
          if (found) list[0] = found;
        }
        var slot = (item && DC.itemTypes[item.info.type].slot);
        if (options.speed) list.push((slot === "onehand" || slot === "twohand") ? "weaponias" : "ias");
        if (options.elem) list.push(options.elem);
        if (options.skill) list.push(options.skill);
        if (options.elite) list.push("edmg");
        return list;
      },
      value: function(options, stats) {
        var res = (options.speed ? stats.info.dps : stats.info.dph);
        if (options.elem) res *= 1 + 0.01 * (stats[options.elem] || 0);
        if (options.elite) res *= 1 + 0.01 * (stats.edmg || 0);
        if (options.skill) res *= 1 + 0.01 * (stats[options.skill] || 0);
        return res;
      },
    },
    toughness: {
      options: {
      },
      stats: function(options, item) {
        return ["vit", "resall", "life", "armor", "resphy", "resfir", "rescol", "respsn", "resarc", "reslit", "edef", "meleedef", "rangedef"];
      },
      value: function(options, stats) {
        return stats.info.toughnessmin;
      },
    },
    healing: {
      options: {},
      stats: function(options, item) {
        var slot = (item && DC.itemTypes[item.info.type].slot);
        var list = ["regen", "lph", "laek", "healbonus"];
        if (options.speed) list.push((slot === "onehand" || slot === "twohand") ? "weaponias" : "ias");
        return list;
      },
      value: function(options, stats) {
        return stats.info.recoverymin;
      },
    },
  };

  function finishStats(stats) {
    stats.finishLoad();
    if (DC.addSkillBonuses) {
      DC.addSkillBonuses(stats);
    }
    stats.finalize();
    return stats;
  }

  function optimizeItemComplex(items, slot, stat, options) {
    var comp = CompositeStats[stat];
    var item = items[slot];
    var stats = comp.stats(options, item).filter(function(stat) {
      return addStat(backupItem(item), stat);
    });

    var baseStats = new DC.Stats(DC.charClass);
    baseStats.startLoad();
    for (var id in items) {
      if (id !== slot) baseStats.addItem(id, items[id]);
    }
    var cache = {"0": item};
    var bestValue = 0, bestMask = 0;
    for (var mask = 1; mask < (1 << stats.length); ++mask) {
      var prev = (mask & (mask - 1));
      if (!cache[prev]) continue;
      var curItem = backupItem(cache[prev]);
      var statIndex = 0;
      while (!(mask & (1 << statIndex))) {
        ++statIndex;
      }
      var stat = stats[statIndex];
      if (addStat(curItem, stat) && addPreset(curItem)) {
        cache[mask] = curItem;
        var tmpStats = baseStats.clone();
        tmpStats.addItem(slot, curItem);
        finishStats(tmpStats);
        var value = comp.value(options, tmpStats);
        if (value > bestValue) {
          bestValue = value;
          bestMask = mask;
        }
      }
    }

    item = items[slot] = cache[bestMask];

    if (item.stats.sockets && item.gems.length < item.stats.sockets[0]) {
      var slotType = DC.itemTypes[item.info.type].slot;
      var type = (slotType && (DC.itemSlots[slotType] || DC.metaSlots[slotType]) || {});
      if (type.socketType !== "jewelry") {
        var sockType = (type.socketType === "weapon" || type.socketType === "head" ? type.socketType : "other");
        var gem1 = item.gems.length, gem2 = item.stats.sockets[0];
        var bestColor = undefined;
        for (var clr in DC.gemColors) {
          for (var i = gem1; i < gem2; ++i) {
            item.gems[i] = [DC.gemColors[clr][sockType].amount.length - 1, clr];
          }
          var tmpStats = baseStats.clone();
          tmpStats.addItem(slot, item);
          finishStats(tmpStats);
          var value = comp.value(options, tmpStats);
          if (value > bestValue) {
            bestValue = value;
            bestColor = clr;
          }
        }
        if (bestColor) {
          for (var i = gem1; i < gem2; ++i) {
            item.gems[i] = [DC.gemColors[bestColor][sockType].amount.length - 1, bestColor];
          }
        } else {
          item.gems.length = gem1;
        }
      }
    }

    return item;
  }
  function optimizeItem(items, slot, stat, options) {
    if (CompositeStats[stat]) {
      return optimizeItemComplex(items, slot, stat, options);
    }
    var item = items[slot];
    var tmpItem = backupItem(items[slot]);
    if (addStat(tmpItem, stat) && addPreset(tmpItem)) {
      item = items[slot] = tmpItem;
    }

    if (item.stats.sockets && item.gems.length < item.stats.sockets[0]) {
      var slotType = DC.itemTypes[item.info.type].slot;
      var type = (slotType && (DC.itemSlots[slotType] || DC.metaSlots[slotType]) || {});
      if (type.socketType !== "jewelry") {
        var sockType = (type.socketType === "weapon" || type.socketType === "head" ? type.socketType : "other");
        var bestColor = undefined;
        for (var clr in DC.gemColors) {
          if (DC.gemColors[clr][sockType].stat === stat) {
            bestColor = clr;
            break;
          }
        }
        if (bestColor) {
          while (item.gems.length < item.stats.sockets[0]) {
            item.gems.push([DC.gemColors[bestColor][sockType].amount.length - 1, bestColor]);
          }
        }
      }
    }

    return item;
  }

  DC.Optimizer.getItem = getItem;
  DC.Optimizer.updateItem = updateItem;
  DC.Optimizer.addPreset = addPreset;
  DC.Optimizer.optimize = function(slot) {
    var items = {};
    for (var id in DC.itemSlots) {
      var item = getItem(id);
      if (item) items[id] = item;
    }
    console.time("optimize");
    var opt = optimizeItem(items, slot, "dps", {speed: true, elem: "fir", elite: false});
    console.timeEnd("optimize");
    updateItem(slot, opt);
  };
  DC.Optimizer.optimizeAll = function(stat, options) {
    var optList = [
      {stat: "sockets", options: {}},
      {stat: "cdr", options: {}},
      {stat: "dps", options: {speed: true, elem: "dmgfir", skill: "skill_wizard_meteor", elite: false}},
      {stat: "toughness", options: {}},
    ];

    console.time("optimize");
    var items = {};
    for (var id in DC.itemSlots) {
      var item = getItem(id);
      if (item) items[id] = item;
    }
    for (var i = 0; i < optList.length; ++i) {
      var tmp = $.extend({}, items);
      for (var pass = 0; pass < 2; ++pass) {
        for (var slot in items) {
          if (optList[i].stat === "sockets" && slot === "offhand") continue;
          tmp[slot] = items[slot];
          optimizeItem(tmp, slot, optList[i].stat, optList[i].options);
        }
      }
      items = tmp;
    }
    for (var slot in items) {
      items[slot] = (addPreset(items[slot]) || items[slot]);
    }
    for (var slot in items) {
      updateItem(slot, items[slot]);
    }
    console.timeEnd("optimize");
  };
  window.opt = DC.Optimizer;

})();
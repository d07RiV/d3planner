(function() {
  var DC = DiabloCalc;

  DC.Optimizer = {
    perfection: 1,
    useGift: true,
    unlock: false,
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

  function addStat(item, id, value) {
    if (!item.affixes.all[id]) return false;
    var stat = DC.stats[id];
    if (!stat) return false;
    if (stat.secondary && item.state.secondary >= item.affixes.secondary) return false;
    if (!stat.secondary && item.state.primary >= item.affixes.primary) return false;
    if (item.state.groups[stat.group || id]) return false;
    if (stat.secondary) item.state.secondary += 1;
    else item.state.primary += 1;
    item.state.groups[stat.group || id] = true;
    var src = (value || item.affixes.all[id]);
    if (item.imported && item.imported.stats && item.imported.stats[id]) {
      var better = false;
      for (var i = 0; i < src.length; ++i) {
        if (src[i] > item.imported.stats[id][i]) {
          better = true;
        }
      }
      if (!better) src = $.extend([], item.imported.stats[id]);
    }
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

  function getItem(slot) {
    var item = DC.getSlot(slot);
    if (!item) return;
    item = $.extend(true, {}, item);
    item.info = DC.itemById[item.id];

    var dropClass = DC.itemTypes[item.info.type].class;
    if (!dropClass && item.info.set) {
      dropClass = DC.itemSets[item.info.set].class;
    }

    function _stats(affixes, src) {
      var res = {};
      for (var id in affixes) {
        var stat = DC.stats[stat];
        if (stat && dropClass && stat.classes && stat.classes.indexOf(dropClass) < 0) continue;
        if (src && src[id]) {
          res[id] = src[id];
        } else if (id === "sockets") {
          res[id] = [affixes[id].max];
        } else {
          res[id] = getValue(affixes[id]);
        }
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
    item.stats = _stats(required, srcstats);
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

    if (DC.Optimizer.unlock) {
      delete item.enchant;
      delete item.imported;
    }

    if (item.affixes.all.sockets) {
      item.gems = [];
      var slot = DC.itemTypes[item.info.type].slot;
      if (slot === "onehand" || slot === "twohand") {
        var gift = DC.Optimizer.useGift;
        if (!gift && item.imported && srcstats.sockets) {
          var primary = 0;
          for (var id in srcstats) {
            if (DC.stats[id] && !DC.stats[id].secondary && !DC.stats[id].caldesanns && !DC.stats[id].base) {
              primary += 1;
            }
          }
          if (primary > item.affixes.primary) {
            gift = true;
          }
        }
        if (gift) {
          item.stats.sockets = item.affixes.all.sockets;
          item.state.groups.sockets = true;
        }
      }
    }

    if (item.imported) {
      if (item.enchant) {
        item.affixes.preset = [[item.enchant]];
      } else {
        item.affixes.preset = [];
      }
    }
    for (var id in srcstats) {
      var stat = DC.stats[id];
      if (!stat) continue;
      if (stat.caldesanns) {
        item.stats[id] = srcstats[id];
      } else if (item.imported && !stat.base && !required[id] && (id !== "sockets" || !item.stats.sockets)) {
        if (item.enchant && item.enchant !== id) {
          addStat(item, id, srcstats[id]);
        } else if (!item.enchant) {
          item.affixes.preset.push([id]);
        }
      }
    }

    return item;
  }
  function updateItem(slot, src) {
    var item = DC.getSlot(slot);
    if (!item) return;
    item = $.extend(true, {}, item);
    item.stats = {};
    Object.keys(src.stats).sort(function(a, b) {
      return (DC.stats[a] && DC.stats[a].prio || 0) - (DC.stats[b] && DC.stats[b].prio || 0);
    }).forEach(function(id) {
      item.stats[id] = src.stats[id];
    });
    if (item.gems && item.stats.sockets && item.stats.sockets[0]) {
      if (!src.gems) src.gems = [];
      for (var i = 0; i < item.gems.length && src.gems.length < item.stats.sockets[0]; ++i) {
        if (item.gems[i] && DC.legendaryGems[item.gems[i][0]]) {
          src.gems.push(item.gems[i]);
        }
      }
    }
    item.gems = src.gems;
    item.imported = src.imported;
    if (item.imported) {
      for (var id in item.stats) {
        if (!src.affixes.all[id]) continue;
        if (DC.stats[id] && DC.stats[id].caldesanns) continue;
        if (!(id in item.imported.stats)) {
          item.enchant = id;
          break;
        }
        if (item.imported.stats[id].length >= 1) {
          if (item.stats[id][0] !== item.imported.stats[id][0]) {
            item.enchant = id;
            break;
          }
        }
        if (item.imported.stats[id].length >= 2) {
          if (item.stats[id][1] !== item.imported.stats[id][1]) {
            item.enchant = id;
            break;
          }
        }
      }
      if (!item.enchant) {
        item.enchant = item.imported.enchant;
      }
    } else {
      delete item.enchant;
    }
    DC.setSlot(slot, item);
  }

  function backupItem(item) {
    item = $.extend({}, item);
    item.stats = $.extend(true, {}, item.stats);
    item.state = $.extend(true, {}, item.state);
    if (item.gems) item.gems = $.extend(true, [], item.gems);
    return item;
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
          if (item.imported && item.imported.stats && item.imported.stats[list[j]]) {
            has = true;
            for (var k = 0; k < item.stats[list[j]].length; ++k) {
              if (item.stats[list[j]][k] !== item.imported.stats[list[j]][k]) {
                has = false;
              }
            }
          } else {
            has = true;
          }
          if (has) break;
        }
        if (!best && (!DC.stats[list[j]].classes || DC.stats[list[j]].classes.indexOf(DC.charClass) >= 0)) {
          best = list[j];
        }
      }
      if (!has) {
        if (!addStat(item, best || list[0], item.imported && item.imported.stats && item.imported.stats[best || list[0]]) && ++missing > 1) {
          return false;
        }
      }
    }
    return item;
  }

  var CompositeStats = {
    dps: {
      name: _L("Damage"),
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
            if (stats.indexOf("skill_" + DC.charClass + "_" + id) >= 0) {
              opt["skill_" + DC.charClass + "_" + id] = DC.skills[DC.charClass][id].name;
            }
          }
          return opt;
        }},
        elite: {type: "checkbox", name: _L("vs Elites")},
      },
      stats: function(options, item) {
        var list = ["wpnphy", "damage", "chc", "chd", DC.classes[DC.charClass].primary];
        if (options.elem) list.push(options.elem);
        if (options.skill) list.push(options.skill);
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
        if (options.elite) list.push("edmg");
        return list;
      },
      value: function(options, stats) {
        var res = (options.speed ? stats.info.dps : stats.info.dph);
        if (options.elem) res *= 1 + 0.01 * (stats[options.elem] || 0);
        if (options.elite) res *= 1 + 0.01 * (stats.edmg || 0);
        if (options.skill) res *= (1 + 0.01 * ((stats.damage || 0) + (stats[options.skill] || 0))) / (1 + 0.01 * (stats.damage || 0));
        return res;
      },
    },
    toughness: {
      name: _L("Toughness"),
      options: {
      },
      stats: function(options, item) {
        return ["vit", "life", "resall", "armor", "resphy", "resfir", "rescol", "respsn", "resarc", "reslit", "edef", "meleedef", "rangedef"];
      },
      value: function(options, stats) {
        return stats.info.toughnessmin;
      },
    },
    healing: {
      name: _L("Healing"),
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

  var BasicCompositeStats = $.extend({}, CompositeStats);

  function SkillInfo(cls, skill) {
    var info = DC.skills[cls][skill];
    function process(stats) {
      var options = {
        stats: stats,
        skill: [skill, stats.skills[skill] || "x"],
        affix: info.affixid,
        params: info.params,
        getCurInfo_: DC.SkillBox.skill.prototype.getCurInfo_,
        notip: true,
      };
      var curInfo = DC.SkillBox.skill.prototype.getCurInfo.call(options, info, stats);
      var results = DC.skill_processInfo(curInfo, options);
      var ret = {};
      for (var id in results) {
        if (curInfo[id] && (typeof curInfo[id] !== "object" || curInfo[id].cooldown !== undefined || curInfo[id].cost !== undefined || curInfo[id].value !== undefined)) continue;
        if (results[id].value !== undefined) ret[id] = results[id].value;
      }
      return ret;
    }
    return {
      name: info.name,
      options: {
        value: {type: "select", options: function() {
          var results = process(DC.getStats());
          var opt = {};
          for (var name in results) {
            opt[name] = _L(name);
          }
          return opt;
        }},
      },
      stats: function(options, item) {
        if (!item) return [];
        var stats = DC.getStats();
        var callopt = {skill: [skill, stats.skills[skill] || "x"], affix: info.affixid, params: info.params, getCurInfo_: DC.SkillBox.skill.prototype.getCurInfo_, notip: true};
        var curInfo = DC.SkillBox.skill.prototype.getCurInfo.call(callopt, info, stats);
        var result = CompositeStats.dps.stats({speed: true, elite: true}, item);
        function _add(stat) { if (result.indexOf(stat) < 0) result.push(stat); }
        function _addline(line) {
          if (!line || typeof line !== "object") return;
          if (line.sum) {
            for (var id in line) {
              _addline(curInfo[id]);
            }
          } else {
            _add("skill_" + cls + "_" + (line && line.skill || skill));
            if (line && line.elem) {
              if (line.elem === "max") {
                _add("dmg" + (stats.info.maxelem || "fir"));
              } else {
                _add("dmg" + line.elem);
              }
            }
          }
        }
        _addline(curInfo[options.value]);
        result.push("cdr", "rcr");
        return result;
      },
      value: function(options, stats) {
        var results = process(stats);
        return (results[options.value] || 0);
      },
    };
  }

  function finishStats(stats) {
    stats.finishLoad();
    if (DC.addSkillBonuses) {
      DC.addSkillBonuses(stats);
    }
    stats.finalize();
    return stats;
  }

  function optimizeItemComplex(items, slot, stat, options, simple) {
    var comp = CompositeStats[stat];
    var item = items[slot];

    var baseStats = new DC.Stats(DC.charClass);
    baseStats.startLoad();
    for (var id in items) {
      if (id !== slot) baseStats.addItem(id, items[id]);
    }

    if (simple) {
      comp.stats(options, item).forEach(function(stat) {
        var next = backupItem(item);
        if (addStat(next, stat)) {
          item = next;
        }
      });
      items[slot] = item;
    } else {
      var stats = comp.stats(options, item).filter(function(stat) {
        return addStat(backupItem(item), stat);
      });

      var cache = {"0": item};
      var bestValue = 0, bestItem = item;
      for (var mask = 1; mask < (1 << stats.length); ++mask) {
        var statIndex = -1;
        if (item.imported && !item.enchant) {
          for (var i = 0; i < stats.length; ++i) {
            if ((mask & (1 << i)) && !item.imported.stats[stats[i]]) {
              statIndex = i;
            }
          }
        }
        if (statIndex < 0) {
          statIndex = 0;
          while (!(mask & (1 << statIndex))) {
            ++statIndex;
          }
        }
        var prev = mask - (1 << statIndex);
        if (!cache[prev]) continue;

        function tryStat(item, stat, value) {
          item = backupItem(item);
          if (addStat(item, stat, value) && addPreset(item)) {
            var tmpStats = baseStats.clone();
            tmpStats.addItem(slot, item);
            finishStats(tmpStats);
            var value = comp.value(options, tmpStats);
            if (value > bestValue) {
              bestValue = value;
              bestItem = item;
            }
            return item;
          }
        }
        if (item.imported && !item.enchant && item.imported.stats[stats[statIndex]]) {
          cache[mask] = tryStat(cache[prev], stats[statIndex], item.imported.stats[stats[statIndex]]);

          for (var i = 0; i < stats.length; ++i) {
            if (!(mask & (1 << i))) continue;
            prev = mask - (1 << i);
            if (!cache[prev]) continue;
            tryStat(cache[prev], stats[i]);
          }
        } else {
          var curItem = tryStat(cache[prev], stats[statIndex]);
          if (!item.imported || item.enchant) {
            cache[mask] = curItem;
          }
        }
      }

      item = items[slot] = bestItem;
    }

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

  DC.Optimizer.priority = [
    {stat: "sockets", options: {}},
    {stat: "dps", options: {}},
    {stat: "toughness", options: {}},
  ];
  DC.Optimizer.getOptions = function(stat) {
    for (var i = 0; i < this.priority.length; ++i) {
      if (this.priority[i].stat === stat) {
        return this.priority[i].options;
      }
    }
  };

  DC.Optimizer.optimizeAll = function() {
    DC.importStart();
    var items = {};
    for (var id in DC.itemSlots) {
      var item = getItem(id);
      if (item) items[id] = item;
    }
    DC.Optimizer.priority.forEach(function(prio) {
      var tmp = $.extend({}, items);
      if (CompositeStats[prio.stat]) {
        var tmp = $.extend({}, items);
        for (var iter = 0; iter < 2; ++iter) {
          for (var slot in items) {
            tmp[slot] = items[slot];
            optimizeItemComplex(tmp, slot, prio.stat, prio.options, iter == 0);
          }
        }
        items = tmp;
      } else {
        for (var slot in items) {
          if (prio.stat === "sockets" && DC.itemTypes[items[slot].info.type].slot === "offhand") continue;
          optimizeItem(items, slot, prio.stat, prio.options);
        }
      }
    });
    for (var slot in items) {
      items[slot] = (addPreset(items[slot]) || items[slot]);
    }
    for (var slot in items) {
      updateItem(slot, items[slot]);
    }
    DiabloCalc.importEnd("global");
  };

  DC.Optimizer.dialog = function() {
    var dlg = $("<div class=\"optimize-dialog\"><p><i>" + _L("For best results, assign paragon, Caldesanns enchants and skills/passives before using the optimizer.") + "</i></p></div>");
    var imported = false, affixes = {};
    for (var slot in DC.itemSlots) {
      var item = DC.getSlot(slot);
      if (!item) continue;
      $.extend(affixes, DC.getItemAffixesById(item.id, item.ancient, false));
      if (item.imported) imported = true;
    }
    if (imported) {
      dlg.append("<div><label class=\"option-box\"><input type=\"checkbox\" class=\"option-unlock\"></input>" + _L("Unlock imported items") + "</label></div>");
      dlg.find(".option-unlock").prop("checked", !!DC.Optimizer.unlock).click(function() {
        DC.Optimizer.unlock = !!$(this).prop("checked");
      });
    }
    dlg.append("<div><label class=\"option-box\"><input type=\"checkbox\" class=\"option-gift\"></input>" + _L("Use Ramaladni's Gift") + "</label></div>");
    dlg.find(".option-gift").prop("checked", !!DC.Optimizer.useGift).click(function() {
      DC.Optimizer.useGift = !!$(this).prop("checked");
    });
    dlg.append("<div>" + _L("Set stat values to {0}%").format("<input class=\"option-perfection\" type=\"number\" min=\"0\" max=\"100\"></input>") + "</label></div>");
    dlg.find(".option-perfection").val(Math.round(DC.Optimizer.perfection * 100)).change(function() {
      var value = (parseInt($(this).val()) || 0);
      if (value < 0) value = 0;
      if (value > 100) value = 100;
      $(this).val(value);
      DC.Optimizer.perfection = value * 0.01;
    });

    var priority = $("<div class=\"optimize-priority\"><ul class=\"optimize-priority-list\"></ul></div>");
    priority.append("<div class=\"btn-add\">" + _L("Add stat") + "</div>");
    dlg.append(priority);

    function updatePriority() {
      DC.Optimizer.priority = [];
      priority.find(".optimize-priority-item").each(function() {
        DC.Optimizer.priority.push($(this).data("item"));
      });
    }

    function addLine(prio) {
      var line = $("<li class=\"optimize-priority-item\"></li>");
      line.data("item", prio);
      priority.find(".optimize-priority-list").append(line);
      line.append("<div class=\"header\"><span class=\"btn-remove\"></span><select class=\"optimize-stat\"></select></div>");
      var opts = $("<div></div>");
      line.append(opts);
      var select = line.find("select");

      var group = "";
      $.each(BasicCompositeStats, function(stat, opt) {
        group += "<option value=\"" + stat + "\">" + opt.name + "</option>";
      });
      select.append("<optgroup label=\"" + _L("Composite Stats") + "\">" + group + "</optgroup>");

      group = "";
      DC.getSkills().skills.forEach(function(skill) {
        var id = "skillinfo_" + DC.charClass + "_" + skill[0];
        if (!CompositeStats[id]) CompositeStats[id] = SkillInfo(DC.charClass, skill[0]);
        group += "<option value=\"" + id + "\">" + CompositeStats[id].name + "</option>";
      });
      if (group.length) select.append("<optgroup label=\"" + _L("Skill Values") + "\">" + group + "</optgroup>");

      var filterClass = (DC.options.limitStats ? DC.charClass : null);
      $.each(DC.statList, function(catType, catList) {
        $.each(catList, function(catName, stats) {
          if (catType === "secondary") catName += _L(" (Secondary)");
          var group = "";
          DC.extendStats([], stats).forEach(function(stat) {
            if (DC.stats[stat].caldesanns) return;
            if (filterClass && DC.stats[stat].classes &&
                DC.stats[stat].classes.indexOf(filterClass) < 0 && stat !== prio.stat) {
              return;
            }
            if (affixes.hasOwnProperty(stat)) {
              group += "<option value=\"" + stat + "\">" + DC.stats[stat].name + "</option>";
            }
          });
          if (group) {
            select.append("<optgroup label=\"" + catName + "\">" + group + "</optgroup>");
          }
        });
      });
      select.val(prio.stat);

      select.change(function() {
        prio.stat = $(this).val();
        opts.empty();
        if (CompositeStats[prio.stat]) {
          $.each(CompositeStats[prio.stat].options, function(id, data) {
            if (data.type === "checkbox") {
              var box = $("<label class=\"option-box\"><input type=\"checkbox\"></input>" + data.name + "</label>");
              box.find("input").prop("checked", !!prio.options[id]).click(function() {
                prio.options[id] = !!$(this).prop("checked");
              });
              opts.append(box);
            } else {
              var box = $("<select class=\"option-drop\"></select>");
              var options = data.options();
              $.each(options, function(value, text) {
                box.append("<option value=\"" + value + "\">" + text + "</option>");
              });
              if (!((prio.options[id] || "") in options)) {
                prio.options[id] = (Object.keys(options)[0] || "");
              }
              box.val(prio.options[id]).change(function() {
                prio.options[id] = $(this).val();
              });
              opts.append(box);
            }
          });
        }
      }).change();
      select.chosen({
        width: "300px",
        disable_search_threshold: 10,
        inherit_select_classes: true,
        search_contains: true,
        placeholder_text_single: _L("Choose Stat"),
      });

      line.on("mouseenter", ".optimize-stat", function() {
        if (!DC.tooltip) return;
        if (!CompositeStats[prio.stat]) return;
        var stats = CompositeStats[prio.stat].stats(prio.options);
        if (!stats.length) return;
        var name = CompositeStats[prio.stat].name;
        var text = "<span class=\"d3-color-gold\">" + _L("Optimize {0} based on the following stats:").format(name) + "</span>";
        stats.forEach(function(stat) {
          text += "<br/><span class=\"tooltip-icon-bullet\"></span>" + DC.stats[stat].name;
        });
        DC.tooltip.showHtml(this, text);
      }).on("mouseleave", ".optimize-stat", function() {
        if (DC.tooltip) DC.tooltip.hide();
      });

      return select;
    }
    priority.find(".btn-add").click(function() {
      var select = addLine({stat: "", options: {}});
      updatePriority();
      setTimeout(function() {select.trigger("chosen:open");}, 0);
    });
    priority.on("click", ".btn-remove", function() {
      $(this).closest("li").remove();
      updatePriority();
    });
    priority.find(".optimize-priority-list").sortable({
      handle: ".header",
      distance: 4,
      axis: "y",
      placeholder: "drop-ph",
      forcePlaceholderSize: true,
      start: function() {
        priority.find("select").trigger("chosen:close");
      },
      stop: function(event, ui) {
        ui.item.css({position: "", left: "", top: ""});
        setTimeout(updatePriority, 0);
      },
    });

    var buttons = [
      {
        text: _L("Optimize"),
        click: function() {
          DC.Optimizer.optimizeAll();
          $(this).dialog("close");
        },
      },
    ];
    dlg.dialog({
      resizable: false,
      title: _L("Optimize Stats"),
      height: "auto",
      width: 450,
      modal: true,
      buttons: buttons,
      close: function() { dlg.remove(); },
      open: function() {
        dlg.parent().css("overflow", "visible");
        DC.Optimizer.priority.forEach(addLine);
      },
    });
  };

})();
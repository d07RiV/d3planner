(function() {
  function setInputHover(elem) {
    elem.hover(function() {
      var min = elem.attr("min");
      var max = elem.attr("max");
      if (min && max && DiabloCalc.tooltip) {
        var step = parseFloat(elem.attr("step") || 1) || 1;
        var decimal = 0;
        while (decimal < 2 && Math.floor(step - 1e-6) == Math.floor(step + 1e-6)) {
          decimal += 1;
          step *= 10;
        }
        var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p>" +
          "<span class=\"d3-color-green\">" + DiabloCalc.formatNumber(parseFloat(min), decimal, 1000) + "</span>-" +
          "<span class=\"d3-color-green\">" + DiabloCalc.formatNumber(parseFloat(max), decimal, 1000) + "</span></p><div>";
        DiabloCalc.tooltip.showHtml(elem[0], tip);
      }
    }, function() {
      DiabloCalc.tooltip.hide();
    });
  }
  function setValueRange(input, min, max, step, force) {
    if (min !== undefined) {
      input.attr("min", min);
    } else {
      input.removeAttr("min");
    }
    if (max !== undefined) {
      input.attr("max", max);
      if (force) {
        input.val(max);
      }
    } else {
      input.removeAttr("max");
    }
    input.attr("step", step || 1);
  }
  function smartListStats(src, affixes, charClass) {
    var list = DiabloCalc.extendStats([], src);
    if (list.length == 0) {
      return list;
    }
    var output = [];
    for (var i = 0; i < list.length; ++i) {
      if (!DiabloCalc.stats[list[i]] || !charClass || !DiabloCalc.stats[list[i]].classes || DiabloCalc.stats[list[i]].classes.indexOf(charClass) >= 0) {
        if (!affixes || affixes[list[i]]) {
          output.push(list[i]);
        }
      }
    }
    if (output.length == 0) {
      output.push(list[0]);
    }
    return output;
  }
  function mergeStats(dst, limits, src) {
    if (src) {
      for (var stat in src) {
        var limit = src[stat];
        if (typeof limit == "string") {
          limit = limits[limit];
        }
        $.each(DiabloCalc.extendStats([], stat), function(i, name) {
          dst[name] = limit;
        });
      }
    }
    return dst;
  }
  function mergeStatsSub(dst, limits, src, required) {
    if (!required) {
      return mergeStats(dst, limits, src.affixes);
    } else if (required === "only") {
      return mergeStats(dst, limits, src.required);
    } else {
      mergeStats(dst, limits, src.affixes);
      return mergeStats(dst, limits, src.required);
    }
  }
  function smartExtend(dst, src, blocked) {
    if (src) {
      for (var i = 0; i < src.length; ++i) {
        var group = src[i];
        while (DiabloCalc.statGroups[group]) {
          group = DiabloCalc.statGroups[group][0];
        }
        group = ((DiabloCalc.stats[group] && DiabloCalc.stats[group].group) || group);
        if (!blocked[group]) {
          dst[src[i]] = true;
          blocked[group] = true;
        }
      }
    }
  }
  function statCompare(a, b) {
    if (DiabloCalc.stats[a] && DiabloCalc.stats[b]) {
      return DiabloCalc.stats[a].prio - DiabloCalc.stats[b].prio;
    } else if (DiabloCalc.stats[a]) {
      return (DiabloCalc.stats[a].secondary || a == "sockets") ? 1 : -1;
    } else if (DiabloCalc.stats[b]) {
      return (DiabloCalc.stats[b].secondary || b == "sockets") ? -1 : 1;
    } else {
      return 0;
    }
  }
  function onChangeSocketType(sock) {
    var type = sock.type.val();
    if (DiabloCalc.legendaryGems[type]) {
      sock.level.show();
      sock.colorSpan.hide();
      return sock.level;
    } else if (DiabloCalc.gemQualities[type]) {
      sock.level.hide();
      sock.colorSpan.show();
      return sock.color;
    } else {
      sock.level.hide();
      sock.colorSpan.hide();
    }
  }

  function getLimits(id, ancient) {
    var limits = DiabloCalc.statLimits.legendary;
    if (id && DiabloCalc.itemById[id]) {
      if (DiabloCalc.itemById[id].quality === "rare") {
        limits = DiabloCalc.statLimits.rare;
      }
      if (DiabloCalc.qualities[DiabloCalc.itemById[id].quality].ancient && ancient) {
        limits = DiabloCalc.statLimits.ancient;
      }
    } else {
      limits = DiabloCalc.statLimits.rare;
    }
    return limits;
  };

  // returns number of [primary, secondary] stats on the selected item
  DiabloCalc.getStatCount = function(id) {
    var item = DiabloCalc.itemById[id];
    var primary = 4, secondary = 2;
    if (item.primary !== undefined) {
      primary = item.primary;
    } else if (["quiver", "source", "mojo"].indexOf(item.type) >= 0) {
      primary = 5;
    }
    if (item.secondary !== undefined) {
      secondary = item.secondary;
    }
    if (id === "Unique_Ring_021_x1" && (DiabloCalc.charClass === "monk" || DiabloCalc.charClass === "crusader")) {
      // manald heal
      ++primary;
      --secondary;
    }
    return [primary, secondary];
  };
  function getItemPreset(id) {
    if (!id || !DiabloCalc.itemById[id]) {
      return [];
    }
    var type = DiabloCalc.itemById[id].type;
    var itemSlot = DiabloCalc.itemTypes[type].slot;
    var preset = {};
    var blocked = {};
    smartExtend(preset, DiabloCalc.itemById[id].preset, blocked);
    smartExtend(preset, DiabloCalc.itemTypes[type].preset, blocked);
    if (DiabloCalc.metaSlots[itemSlot]) {
      smartExtend(preset, DiabloCalc.metaSlots[itemSlot].preset, blocked);
    } else {
      smartExtend(preset, DiabloCalc.itemSlots[itemSlot].preset, blocked);
    }
    return Object.keys(preset);
  };
  DiabloCalc.smartListStats = smartListStats;
  DiabloCalc.getItemPreset = getItemPreset;

  DiabloCalc.getItemAffixesById = function(id, ancient, required) {
    if (!id || !DiabloCalc.itemById[id]) {
      return {};
    }
    var type = DiabloCalc.itemById[id].type;
    var itemSlot = DiabloCalc.itemTypes[type].slot;
    var limits = getLimits(id, ancient);
    var stats = {};
    if (DiabloCalc.metaSlots[itemSlot]) {
      mergeStatsSub(stats, limits, DiabloCalc.metaSlots[itemSlot], required);
    } else {
      mergeStatsSub(stats, limits, DiabloCalc.itemSlots[itemSlot], required);
    }
    mergeStatsSub(stats, limits, DiabloCalc.itemTypes[type], required);
    mergeStatsSub(stats, limits, DiabloCalc.itemById[id], required);
    return stats;
  };

  DiabloCalc.makeItem = function(id, custom) {
    var data = {id: id, stats: {}, ancient: false};
    var preset = getItemPreset(id);
    var affixes = DiabloCalc.getItemAffixesById(id, false, true);
    var required = DiabloCalc.getItemAffixesById(id, false, "only");
    function mkval(stat) {
      if (!affixes[stat]) return [0];
      var val = [];
      if (affixes[stat].max) {
        val.push(affixes[stat].max);
      }
      if (affixes[stat].max2) {
        val.push(affixes[stat].max2);
      }
      if (affixes[stat].args < 0) {
        val.push("powerhungry");
      }
      return val;
    }
    for (var stat in required) {
      data.stats[stat] = (stat === "custom" && custom || mkval(stat));
    }
    for (var i = 0; i < preset.length; ++i) {
      var list = smartListStats(preset[i], affixes, DiabloCalc.charClass);
      if (list.length && !data.stats[list[0]]) {
        data.stats[list[0]] = mkval(list[0]);
      }
    }
    if (data.stats.sockets) {
      data.gems = [];
    }
    return data;
  };

  DiabloCalc.getOffhandTypes = function(mhtype) {
    var noDual = !DiabloCalc.classes[DiabloCalc.charClass].dualwield;
    var twohand = false;
    if (DiabloCalc.charClass !== "crusader" && (mhtype || (DiabloCalc.itemSlots.mainhand.item && DiabloCalc.itemById[DiabloCalc.itemSlots.mainhand.item.id]))) {
      var maintype = (mhtype || DiabloCalc.itemById[DiabloCalc.itemSlots.mainhand.item.id].type);
      if (DiabloCalc.itemTypes[maintype] && DiabloCalc.itemTypes[maintype].slot == "twohand") {
        twohand = true;
      }
    }
    var types = DiabloCalc.itemSlots.offhand.types;
    var result = {};
    for (var type in types) {
      var typeData = types[type];
      if (twohand && type !== "quiver") continue;
      if (noDual && typeData.slot === "onehand" && type !== "handcrossbow") continue;
      result[type] = typeData;
    }
    return result;
  };
  DiabloCalc.isItemAllowed = function(slot, id, mhtype) {
    if (!id || !DiabloCalc.itemById[id] || DiabloCalc.itemSlots[slot].drop.inactive) return false;

    var item = DiabloCalc.itemById[id];
    var itemType = item.type;
    var itemSlot = DiabloCalc.itemTypes[itemType].slot;

    if (item.classes && item.classes.indexOf(DiabloCalc.charClass) < 0) return false;

    var types = DiabloCalc.itemSlots[slot].types;
    if (slot === "offhand") types = DiabloCalc.getOffhandTypes(mhtype);
    if (!types[itemType] || (types[itemType].classes && types[itemType].classes.indexOf(DiabloCalc.charClass) < 0)) return false;

    return true;
  };
  DiabloCalc.trimItem = function(slot, data, mhtype) {
    if (!data || !DiabloCalc.itemById[data.id] || DiabloCalc.itemSlots[slot].drop.inactive) return;

    var item = DiabloCalc.itemById[data.id];
    var itemType = item.type;
    var generic = DiabloCalc.itemTypes[itemType].generic;
    if (!DiabloCalc.isItemAllowed(slot, generic, mhtype)) return;

    var newItem = {id: generic, stats: {}};
    var affixes = DiabloCalc.getItemAffixesById(generic, false, true);
    for (var stat in data.stats) {
      if (affixes[stat]) {
        var value = [];
        if (data.stats[stat].length >= 1) {
          value.push(data.stats[stat][0]);
          if (affixes[stat].min) value[0] = Math.max(value[0], affixes[stat].min);
          if (affixes[stat].max) value[0] = Math.min(value[0], affixes[stat].max);
        }
        if (data.stats[stat].length >= 2) {
          value.push(data.stats[stat][1]);
          if (affixes[stat].min2) value[0] = Math.max(value[0], affixes[stat].min2);
          if (affixes[stat].max2) value[0] = Math.min(value[0], affixes[stat].max2);
        }
        newItem.stats[stat] = value;
      }
    }
    if (data.gems && newItem.stats.sockets) {
      newItem.gems = [];
      for (var i = 0; i < data.gems.length && i < newItem.stats.sockets[0]; ++i) {
        newItem.gems.push(data.gems[i]);
      }
    }

    return newItem;
  };

  DiabloCalc.ItemBox = function(parent, options) {
    options = options || {};
    this.charClass = options.charClass;
    this.slot = options.slot;

    this.onUpdate = options.onUpdate || function(itemChanged, reason) {
      if (this.slot) {
        DiabloCalc.trigger(itemChanged ? "updateSlotItem" : "updateSlotStats", this.slot, reason);
      }
    };

    var self = this;
    function doUpdate() {
      self.upd_timeout = undefined;
      self.onUpdate(self.upd_itemChanged, self.upd_reason);
      self.upd_itemChanged = undefined;
      self.upd_reason = undefined;
    }
    this.updateItem = function(reason) {
      if (this.suppress) return;
      if (DiabloCalc.importActive) {
        this.onUpdate(true, reason);
        return;
      }
      this.upd_itemChanged = (this.upd_itemChanged || true);
      this.upd_reason = reason;
      if (!this.upd_timeout) {
        this.upd_timeout = setTimeout(doUpdate, 0);
      }
    };
    this.updateStats = options.updateStats || function(reason) {
      if (this.suppress) return;
      if (DiabloCalc.importActive) {
        this.onUpdate(false, reason);
        return;
      }
      this.upd_itemChanged = (this.upd_itemChanged || false);
      this.upd_reason = reason;
      if (!this.upd_timeout) {
        this.upd_timeout = setTimeout(doUpdate, 0);
      }
    };

    // this.type = type_id
    // this.item = item_id
    // this.ancient = checkbox

    // return stat => limits mapping for selected item quality
    this.getLimits = function() {
      return getLimits(this.item.val(), this.ancient.prop("checked"));
    };

    // return a dictionary of possible stats=>limits for selected item
    // required = (false | true | "only") to return only enchantable stats, both, or only fixed stats
    this.getItemAffixes = function(required) {
      return DiabloCalc.getItemAffixesById(this.item.val(), this.ancient.prop("checked"), required);
    };

    // fill select box with applicable item stats
    this.fillStatList = function(list, current) {
      var affixes = this.getItemAffixes();
      var value = (current || list.val());
      var filterClass = (DiabloCalc.options.limitStats ? this.charClass : null);
      if (!filterClass) {
        var id = this.item.val();
        if (id && DiabloCalc.itemById[id]) {
          filterClass = DiabloCalc.itemTypes[DiabloCalc.itemById[id].type].class;
          if (!filterClass && DiabloCalc.itemById[id].set) {
            filterClass = DiabloCalc.itemSets[DiabloCalc.itemById[id].set].class;
          }
        }
      }

      list.children().detach().remove();
      list.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Select a Stat" : "") + "</option>");

      for (var catType in DiabloCalc.statList) {
        for (var cat in DiabloCalc.statList[catType]) {
          var catName = cat;
          if (catType == "secondary") {
            catName += " (Secondary)";
          }
          var stats = DiabloCalc.statList[catType][cat];
          var group = "";
          $.each(DiabloCalc.extendStats([], DiabloCalc.statList[catType][cat]), function(i, stat) {
            if (filterClass && DiabloCalc.stats[stat].classes &&
                DiabloCalc.stats[stat].classes.indexOf(filterClass) < 0 && stat !== current) {
              return;
            }
            if (affixes.hasOwnProperty(stat)) {
              group += "<option value=\"" + stat + (stat == value ? "\" selected=\"selected" : "") + "\">" + DiabloCalc.stats[stat].name + "</option>";
            }
          });
          if (group) {
            list.append("<optgroup label=\"" + catName + "\">" + group + "</optgroup>");
          }
        }
      }
    };

    // update stat list; only inserts the selected item to save time
    this.updateStatList = function(statData, current) {
      if (statData.required) {
        statData.list.prop("disabled", true);
        statData.list.children().detach().remove();
        var option = "<option value=\"" + statData.required + "\">";
        if (statData.required == "custom") {
          var affixes = this.getItemAffixes(true);
          option += affixes.custom.name;
        } else {
          option += DiabloCalc.stats[statData.required].name;
        }
        statData.list.append(option + "</option>");
      } else {
        statData.list.prop("disabled", false);
        var stat = (current || statData.list.val());
        //var affixes = this.getItemAffixes();
        if (!DiabloCalc.noChosen) {
          statData.list.children().detach().remove();
          statData.list.append("<option></option>");
          if (DiabloCalc.stats[stat]) {
            statData.list.append("<option value=\"" + stat + "\" selected=\"selected\">" + DiabloCalc.stats[stat].name + "</option>");
          }
        } else {
          this.fillStatList(statData.list, current);
        }
      }
    };

    // triggered when X is clicked
    this.onRemoveStat = function(elem) {
      var index = $(elem).closest("li").index();
      if (!this.stats[index].required) {
        this.stats[index].line.remove();
        this.stats.splice(index, 1);
        this.updateEnabledStats();
        this.updateItem(true);
      }
    };

    // triggered when selected stats change - adds/removes separator, updates warnings
    this.updateEnabledStats = function() {
      var firstSecondary = true;
      for (var i = 0; i < this.stats.length; ++i) {
        var curStat = this.stats[i].list.val();
        if (DiabloCalc.stats[curStat]) {
          this.stats[i].line.removeClass("first-secondary");
          if (curStat == "sockets" || (DiabloCalc.stats[curStat].secondary && firstSecondary)) {
            firstSecondary = false;
            if (i != 0) {
              this.stats[i].line.addClass("first-secondary");
            }
          }
        }
      }
      this.updateWarning();
    };

    // generate list of stats when combo box is expanded
    // calls fillStatList and grays out conflicting stats
    this.generateStatList = function(statData) {
      var id = this.item.val();
      if (!id || !DiabloCalc.itemById[id]) {
        return;
      }
      if (statData.required) return;
      var affixes = this.getItemAffixes(true);
      var used = {};
      for (var i = 0; i < this.stats.length; ++i) {
        var curStat = this.stats[i].list.val();
        if (DiabloCalc.stats[curStat]) {
          if (affixes[curStat] && affixes[curStat].noblock) {
            //used[curStat] = curStat;
          } else {
            used[DiabloCalc.stats[curStat].group || curStat] = curStat;
          }
        }
      }
      var presets = getItemPreset(id);
      if (presets.indexOf("resall") >= 0) {
        var list = DiabloCalc.extendStats([], "resist");
        for (var i = 0; i < list.length; ++i) {
          if (!used[list[i]]) {
            used[list[i]] = "_resall";
          }
        }
      }

      var curStat = statData.list.val();
      this.fillStatList(statData.list, curStat);
      if (DiabloCalc.stats[curStat]) {
        curStat = (DiabloCalc.stats[curStat].group || curStat);
      }
      statData.conflicts = {};
      statData.list.find("option").each(function() {
        var subStat = $(this).val();
        if (DiabloCalc.stats[subStat]) {
          var orig = subStat;
          subStat = (DiabloCalc.stats[subStat].group || subStat);
          if (used[orig] === "_resall") {
            $(this).prop("disabled", true);
            statData.conflicts[orig] = "_resall";
          } else if (subStat == curStat || (!used[subStat] && !used[orig])) {
            $(this).removeAttr("disabled");
          } else {
            $(this).prop("disabled", true);
            statData.conflicts[orig] = (used[subStat] || used[orig]);
          }
        }
      });
    };

    this.generatePassiveList = function(statData, keep, pre) {
      var prevVal;
      if (keep) {
        prevVal = statData.passiveBox.val();
      }
      statData.passiveBox.children().detach().remove();
      var filterClass = (DiabloCalc.options.limitStats ? this.charClass : null);
      if (filterClass) {
        var passives = DiabloCalc.passives[filterClass];
        for (var id in passives) {
          statData.passiveBox.append("<option value=\"" + id + (id === prevVal ? "\" selected=\"selected" : "") + "\">" + passives[id].name + "</option>");
          if (id === prevVal) {
            prevVal = undefined;
          }
        }
      } else {
        for (var cls in DiabloCalc.classes) {
          if (DiabloCalc.passives[cls]) {
            var group = "<optgroup label=\"" + DiabloCalc.classes[cls].name + "\">";
            var passives = DiabloCalc.passives[cls];
            for (var id in passives) {
              group += "<option value=\"" + id + (id === prevVal ? "\" selected=\"selected" : "") + "\">" + passives[id].name + "</option>";
              if (id === prevVal) {
                prevVal = undefined;
              }
            }
            statData.passiveBox.append(group + "</optgroup>");
          }
        }
      }
      if (pre && prevVal && DiabloCalc.allPassives[prevVal]) {
        statData.passiveBox.append("<option value=\"" + prevVal + "\" selected=\"selected\">" + DiabloCalc.allPassives[prevVal].name + "</option>");
      }
    };


    // update the warning icon
    this.updateWarning = function() {
      var id = this.item.val();
      if (!id || !DiabloCalc.itemById[id]) {
        this.badstats.hide();
        return;
      }

      var affixes = this.getItemAffixes(true);
      var presets = getItemPreset(id);
      var numStats = DiabloCalc.getStatCount(id);

      var statList = {};
      var usedPrimary = 0, usedSecondary = 0, gift = 0, unused = 0;
      for (var i = 0; i < this.stats.length; ++i) {
        var stat = this.stats[i].list.val();
        if (!stat) unused += 1;
        else statList[stat] = true;
        if (!DiabloCalc.stats[stat] || DiabloCalc.stats[stat].base) continue;
        if (DiabloCalc.stats[stat].secondary) {
          usedSecondary += 1;
        } else {
          usedPrimary += 1;
        }
        if (stat == "sockets") {
          gift = 1;
        }
      }

      var slotType = this.type.val();
      slotType = (DiabloCalc.itemTypes[slotType] ? DiabloCalc.itemTypes[slotType].slot : null);
      if (slotType != "onehand" && slotType != "twohand") {
        gift = 0;
      }

      if (DiabloCalc.options.moreWarnings) {
        unused = 0;
      }

      var tip = "";
      if (usedPrimary + unused < numStats[0]) {
        tip += "</br><span class=\"tooltip-icon-bullet\"></span>Add more primary stats";
      } else if (usedPrimary - gift > numStats[0]) {
        tip += "</br><span class=\"tooltip-icon-bullet\"></span>Too many primary stats";
      }
      if (usedSecondary > numStats[1]) {
        tip += "</br><span class=\"tooltip-icon-bullet\"></span>Too many secondary stats";
      } else if (DiabloCalc.options.moreWarnings && usedSecondary < numStats[1]) {
        tip += "</br><span class=\"tooltip-icon-bullet\"></span>Add more secondary stats";
      }

      var missing = [];
      for (var i = 0; i < presets.length; ++i) {
        var list = smartListStats(presets[i], affixes);
        if (list.length) {
          var present = false;
          for (var j = 0; j < list.length; ++j) {
            if (statList[list[j]]) {
              present = true;
              break;
            }
          }
          if (!present) {
            missing.push(presets[i]);
          }
        }
      }
      if (missing.length > 1) {
        tip += "<br/><span class=\"tooltip-icon-bullet\"></span>More than one preset stat is missing";
        for (var i = 0; i < presets.length; ++i) {
          var name = presets[i];
          if (DiabloCalc.stats[presets[i]]) {
            name = DiabloCalc.stats[presets[i]].name;
          } else if (DiabloCalc.statGroupNames[presets[i]]) {
            name = DiabloCalc.statGroupNames[presets[i]];
          } else if (presets[i].indexOf("skill_") == 0) {
            name = "Skill Damage";
          }
          tip += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-white\">";
          if (missing.indexOf(presets[i]) >= 0) {
            tip += "<s>" + name + "</s>";
          } else {
            tip += name;
          }
          tip += "</span>";
        }
      }

      if (tip) {
        tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">Impossible stat combination</span>" +
          tip + "</p></div>";
        this.badstats.hover(function() {
          DiabloCalc.tooltip.showHtml(this, tip);
        }, function() {
          DiabloCalc.tooltip.hide();
        });
        this.badstats.show();
      } else {
        this.badstats.hide();
      }
    };

    // triggered when stat value changes
    this.onChangeValue = function(statData) {
      var self = this;
      var stat = statData.list.val();
      if (stat == "sockets") {
        if (!statData.socketList) {
          statData.socketList = $("<ul class=\"item-info-gemlist\"></ul>");
          statData.sockets = [];
          statData.line.append(statData.socketList);
        }
        var count = parseInt(statData.value.val());
        count = Math.max(count, 1);
        count = Math.min(count, 3);
        while (statData.sockets.length > count) {
          statData.sockets.pop().line.remove();
        }
        while (statData.sockets.length < count) {
          (function(index) {
            var sock = {
              line: $("<li></li>"),
              type: $("<select class=\"item-info-gem-type\"></select>"),
              colorSpan: $("<span></span>"),
              color: $("<select class=\"item-info-gem-color\"></select>"),
              level: $("<input class=\"item-info-gem-level\" type=\"number\" min=\"0\" max=\"100\"></input>"),
            };
            sock.type.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Empty Socket" : "") + "</option>");
            var slotType = self.type.val();
            slotType = (DiabloCalc.itemTypes[slotType] ? DiabloCalc.itemTypes[slotType].slot : null);
            var leggems = 0;
            for (var id in DiabloCalc.legendaryGems) {
              if (DiabloCalc.legendaryGems[id].types.indexOf(slotType) >= 0) {
                leggems += 1;
              }
            }
            if (leggems) {
              var optgroup = "<optgroup label=\"Legendary Gems\">";
              for (var id in DiabloCalc.legendaryGems) {
                if (DiabloCalc.legendaryGems[id].types.indexOf(slotType) >= 0) {
                  optgroup += "<option class=\"quality-legendary\" value=\"" + id + "\">" + DiabloCalc.legendaryGems[id].name + "</option>";
                }
              }
              optgroup += "</optgroup><optgroup label=\"Normal Gems\">";
              for (var i = DiabloCalc.gemQualities.length - 1; i >= 0; --i) {
                optgroup += "<option value=\"" + i + "\">" + DiabloCalc.gemQualities[i] + "</option>";
              }
              sock.type.append(optgroup + "</optgroup>");
            } else {
              for (var i = DiabloCalc.gemQualities.length - 1; i >= 0; --i) {
                sock.type.append("<option value=\"" + i + "\">" + DiabloCalc.gemQualities[i] + "</option>");
              }
            }
            for (var id in DiabloCalc.gemColors) {
              sock.color.append("<option value=\"" + id + "\">" + DiabloCalc.gemColors[id].name + "</option>");
            }
            sock.line.append(sock.type).append(sock.colorSpan.append(sock.color)).append(sock.level);
            statData.socketList.append(sock.line);
            sock.type.chosen({
              disable_search_threshold: 10,
              inherit_select_classes: true,
              search_contains: true,
              allow_single_deselect: true,
              placeholder_text_single: "Empty Socket",
            }).change(function() {
              var input = onChangeSocketType(sock);
              if (input === sock.level) {
                input.focus().select();
              } else if (input == sock.color) {
                setTimeout(function() {input.trigger("chosen:open");}, 0);
              }
            }).change(function() {self.updateItem(true);});
            DiabloCalc.chosenTips(sock.type, function(id) {
              if (DiabloCalc.tooltip && DiabloCalc.legendaryGems[id]) {
                DiabloCalc.tooltip.showGem(this, id);
              }
            });
            self.addIcons(sock.type, function(id) {
              if (isNaN(id)) {
                var gem = DiabloCalc.legendaryGems[id];
                if (gem && DiabloCalc.itemIcons.gemleg[gem.id] !== undefined) {
                  return "<span style=\"background: url(css/items/gemleg.png) 0 -" + (24 * DiabloCalc.itemIcons.gemleg[gem.id]) + "px no-repeat\"></span>";
                }
              } else {
                id = parseInt(id);
                if (id >= 0 && id < DiabloCalc.gemQualities.length) {
                  return "<span style=\"background: url(css/items/gems.png) -" + (24 * id) + "px 0 no-repeat\"></span>";
                }
              }
            });
            sock.color.chosen({
              disable_search: true,
              inherit_select_classes: true,
            }).change(function() {
              if (index === 0) {
                var allEmpty = true;
                for (var i = 1; i < statData.sockets.length; ++i) {
                  if (statData.sockets[i].type.val()) {
                    allEmpty = false;
                  }
                }
                if (allEmpty) {
                  var type = statData.sockets[0].type.val();
                  var color = $(this).val();
                  for (var i = 1; i < statData.sockets.length; ++i) {
                    statData.sockets[i].type.val(type);
                    statData.sockets[i].type.trigger("chosen:updated");
                    onChangeSocketType(statData.sockets[i]);
                    statData.sockets[i].color.val(color);
                    statData.sockets[i].color.trigger("chosen:updated");
                  }
                }
              }
              self.updateItem(true);
            });
            DiabloCalc.chosenTips(sock.color, function(id) {
              if (DiabloCalc.tooltip && DiabloCalc.gemColors[id]) {
                DiabloCalc.tooltip.showGem(this, [parseInt(sock.type.val()), id]);
              }
            });
            self.addIcons(sock.color, function(id) {
              var gem = DiabloCalc.gemColors[id];
              if (gem && DiabloCalc.itemIcons.gems[gem.id] !== undefined) {
                var level = parseInt(sock.type.val());
                return "<span style=\"background: url(css/items/gems.png) -" + (24 * level) + "px -" + (24 * DiabloCalc.itemIcons.gems[gem.id]) + "px no-repeat\"></span>";
              }
            });
            onChangeSocketType(sock);
            sock.level.blur(DiabloCalc.validateNumber).blur().on("input", function() {
              self.updateStats(true);
            });
            statData.sockets.push(sock);
          })(statData.sockets.length);
        }
      } else if (statData.socketList) {
        statData.socketList.remove();
        statData.socketList = undefined;
        statData.sockets = undefined;
      }
    };

    // triggered when stat changes
    this.onChangeStat = function(statData, nosetvalue) {
      var item = this.item.val();
      var stat = statData.list.val();
      var self = this;

      // reorder stats
      var index = this.stats.indexOf(statData);
      var newIndex = index;
      while (newIndex < this.stats.length && statCompare(stat, this.stats[newIndex].list.val()) >= 0) {
        newIndex++;
      }
      while (newIndex > 0 && statCompare(stat, this.stats[newIndex - 1].list.val()) <= 0) {
        newIndex--;
      }
      if (index != newIndex && index + 1 != newIndex) {
        if (newIndex == this.stats.length) {
          this.statsDiv.append(statData.line);
        } else {
          this.stats[newIndex].line.before(statData.line);
        }
        this.stats.splice(index, 1);
        if (newIndex > index) {
          newIndex -= 1;
        }
        this.stats.splice(newIndex, 0, statData);
      }

      // update separators/warnings
      this.updateEnabledStats();

      // update inputs
      var affixes = this.getItemAffixes(true);
      var limits = affixes[stat];
      if (typeof limits === "string") {
        // this shouldn't happen, but just in case
        var limitList = this.getLimits();
        limits = limitList[limits];
      }

      var args = 0;
      if (statData.required == "custom") {
        args = (affixes.custom.args === undefined ? 1 : affixes.custom.args);
      } else if (DiabloCalc.stats[stat]) {
        args = DiabloCalc.stats[stat].args;
      }

      if (args >= 1) {
        statData.value.show();
        setValueRange(statData.value,
          limits ? limits.min : undefined,
          limits ? limits.max : undefined,
          limits ? limits.step : 1,
          statData.prevStat !== limits && !nosetvalue);
        statData.value.blur();
      } else {
        statData.value.hide();
      }
      if (args >= 2) {
        statData.value2.show();
        setValueRange(statData.value2,
          limits ? limits.min2 : undefined,
          limits ? limits.max2 : undefined,
          limits ? limits.step2 : 1,
          statData.prevStat !== limits && !nosetvalue);
        statData.value2.blur();
      } else {
        statData.value2.hide();
      }
      if (args < 0) {
        if (!statData.passive) {
          statData.passiveBox = $("<select class=\"item-info-stat-passive\"><option value=\"\"></option></select>");
          if (DiabloCalc.noChosen) {
            statData.passiveBox.find("option").text("Select a Passive Skill");
          }
          statData.passive = $("<span></span>");
          statData.passive.append(statData.passiveBox);
          statData.inner.append(statData.passive);
          statData.passiveBox.chosen({
            inherit_select_classes: true,
            search_contains: true,
            placeholder_text_single: "Select a Passive Skill",
            populate_func: function() {self.generatePassiveList(statData, true);},
          }).change(function() {
            self.updateStats(true);
          });
        }
        this.generatePassiveList(statData, statData.prevStat === limits, true);
        statData.passiveBox.trigger("chosen:updated");
        statData.passive.show();
      } else if (statData.passive) {
        statData.passive.hide();
      }

      statData.prevStat = limits;

      this.onChangeValue(statData);
    };

    // triggered when item quality changes (ancient checkbox)
    this.updateLimits = function() {
      for (var i = 0; i < this.stats.length; ++i) {
        this.onChangeStat(this.stats[i]);
      }
    };

    // add stat line
    this.onAddStat = function(required, current) {
      var statData = {};
      var self = this;

      statData.required = required;
      statData.line = $("<li></li>");
      var inner = $("<div></div>");
      statData.remove = $("<span></span>").addClass("item-info-stat-remove").attr("title", "Remove stat")
        .click(function() {self.onRemoveStat(this);});
      if (required) {
        statData.remove.hide();
      }
      inner.append($("<span style=\"position: absolute\"></span>").append(statData.remove));
      statData.list = $("<select class=\"item-info-stat-list\"></select>");
      inner.append(statData.list);
      statData.value = $("<input class=\"item-info-stat-value\" type=\"number\"></input>").hide();
      setInputHover(statData.value);
      inner.append(statData.value);
      statData.value2 = $("<input class=\"item-info-stat-value\" type=\"number\"></input>").hide();
      setInputHover(statData.value2);
      inner.append(statData.value2);
      statData.inner = inner;
      statData.line.append(inner);

      this.statsDiv.append(statData.line);
      this.stats.push(statData);

      this.updateStatList(statData, current);
      statData.list.chosen({
        disable_search_threshold: 10,
        inherit_select_classes: true,
        search_contains: true,
        placeholder_text_single: "Select a Stat",
        populate_func: function() {self.generateStatList(statData);},
      }).change(function() {
        var hadSockets = !!statData.sockets;
        self.onChangeStat(statData);
        if (statData.value.is(":visible")) {
          statData.value.focus().select();
        }
        if (hadSockets || statData.sockets || (self.slot && DiabloCalc.itemSlots[self.slot].flourish)) {
          self.updateItem(true);
        } else {
          self.updateStats(true);
        }
      });
      DiabloCalc.chosenTips(statData.list, function(id) {
        var stat = (statData.conflicts && statData.conflicts[id]);
        if (stat && stat !== id && DiabloCalc.tooltip && DiabloCalc.stats[stat]) {
          var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">Conflicts with:</span>";
          tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + DiabloCalc.stats[stat].name + "</p></div>";
          DiabloCalc.tooltip.showHtml(this, tip);
        } else if (stat === id && DiabloCalc.tooltip) {
          var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">Already present on the item.</span></p></div>";
          DiabloCalc.tooltip.showHtml(this, tip);
        } else if (stat === "_resall" && DiabloCalc.tooltip) {
          var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">Conflicts with preset stat:</span>";
          tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + DiabloCalc.stats.resall.name + "</p></div>";
          DiabloCalc.tooltip.showHtml(this, tip);
        }
      });
      statData.value.blur(DiabloCalc.validateNumber);
      statData.value2.blur(DiabloCalc.validateNumber);
      statData.value.on("input", function() {
        var hadSockets = !!statData.sockets;
        self.onChangeValue(statData);
        if (hadSockets || statData.sockets) {
          self.updateItem(true);
        } else {
          self.updateStats(true);
        }
      });
      statData.value2.on("input", function() {
        self.updateStats(true);
      });
      this.onChangeStat(statData);

      return statData;
    };

    // big function
    this.onChangeItem = function() {
      var id = this.item.val();
      var self = this;
      if (this.slot === "mainhand" && DiabloCalc.itemSlots.offhand.item && DiabloCalc.itemById[DiabloCalc.itemSlots.offhand.item.id]) {
        var mhtype = this.type.val();
        var ohtype = DiabloCalc.itemById[DiabloCalc.itemSlots.offhand.item.id].type;
        if (DiabloCalc.itemTypes[mhtype] && DiabloCalc.itemTypes[mhtype].slot == "twohand" &&
            DiabloCalc.charClass != "crusader" && ohtype && ohtype != "quiver") {
          DiabloCalc.trigger("updateSlotItem", "offhand", "twohand");
        }
      }
      this.updateItem();
      if (!id) {
        this.statsDiv.children().detach().remove();
        this.stats = [];
        this.badstats.hide();
        this.ancientTip.hide();
        return;
      }
      var required = this.getItemAffixes("only");
      var affixes = this.getItemAffixes(true);
      var preset = [];
      $.each(getItemPreset(id), function(i, val) {
        preset.push({
          list: smartListStats(val, affixes, self.charClass),
        });
      });
      for (var stat in required) {
        preset.push({
          list: [stat],
          required: stat,
        });
      }
      var numStats = DiabloCalc.getStatCount(id);
      if (DiabloCalc.qualities[DiabloCalc.itemById[id].quality].ancient) {
        this.ancientTip.show();
      } else {
        this.ancientTip.hide();
      }
      var remaining = [];
      for (var i = 0; i < this.stats.length; ++i) {
        var found = false;
        var stat = (this.stats[i].required || this.stats[i].list.val());
        if (!affixes[stat]) {
          this.stats[i].line.remove();
          this.stats.splice(i--, 1);
          continue;
        }
        for (var j = 0; j < preset.length; ++j) {
          if (preset[j].list.indexOf(stat) >= 0) {
            if (preset[j].required) {
              this.stats[i].required = preset[j].required;
              this.stats[i].remove.hide();
            } else {
              this.stats[i].required = undefined;
              this.stats[i].remove.show();
            }
            this.updateStatList(this.stats[i]);
            this.stats[i].list.trigger("chosen:updated");
            preset.splice(j, 1);
            found = true;
            break;
          }
        }
        if (!found) {
          if (this.stats[i].required) {
            if (affixes[this.stats[i].required]) {
              this.stats[i].required = undefined;
              this.stats[i].remove.show();
              remaining.push(this.stats[i]);
            } else {
              this.stats[i].line.remove();
              this.stats.splice(i--, 1);
            }
          } else {
            remaining.push(this.stats[i]);
          }
        }
      }
      for (var i = 0; i < this.stats.length; ++i) {
        var stat = (this.stats[i].required || this.stats[i].list.val());
        if (DiabloCalc.stats[stat] && DiabloCalc.stats[stat].secondary) {
          numStats[1]--;
        } else if (!DiabloCalc.stats[stat] || !DiabloCalc.stats[stat].base) {
          numStats[0]--;
        }
      }
      remaining.sort(function(a, b) {
        return (a.list.val() || "").length - (b.list.val() || "").length;
      });
      for (var i = 0; i < preset.length; ++i) {
        if (preset[i].list.length == 0) {
          continue;
        }
        var stat = preset[i].list[0];
        var group = stat;
        if (!affixes[curStat] || !affixes[curStat].noblock) {
          group = (DiabloCalc.stats[stat].group || stat);
        }
        for (var j = 0; j < remaining.length; ++j) {
          var curStat = remaining[j].list.val();
          if (curStat == group || (DiabloCalc.stats[curStat] && DiabloCalc.stats[curStat].group == group)) {
            var index = this.stats.indexOf(remaining[j]);
            remaining[j].line.remove();
            remaining.splice(j--, 1);
            if (index >= 0) {
              this.stats.splice(index, 1);
            }
          }
        }
        if (DiabloCalc.stats[stat]) {
          var needRemove = undefined;
          if (DiabloCalc.stats[stat].secondary) {
            if (--numStats[1] < 0) {
              needRemove = true;
            }
          } else if (!DiabloCalc.stats[stat].base) {
            if (--numStats[0] < 0) {
              needRemove = false;
            }
          }
          if (needRemove !== undefined) {
            for (var j = 0; j < remaining.length; ++j) {
              var curStat = remaining[j].list.val();
              if (DiabloCalc.stats[curStat] && DiabloCalc.stats[curStat].base) {
                continue;
              }
              var statSecondary = !!(DiabloCalc.stats[curStat] && DiabloCalc.stats[curStat].secondary);
              if (statSecondary == needRemove) {
                var index = this.stats.indexOf(remaining[j]);
                remaining[j].line.remove();
                remaining.splice(j--, 1);
                if (index >= 0) {
                  this.stats.splice(index, 1);
                }
                break;
              }
            }
          }
        }
        var statData = this.onAddStat(preset[i].required, stat);
        statData.list.val(stat);
      }
      for (var i = 0; i < remaining.length; ++i) {
        this.updateStatList(remaining[i]);
        remaining[i].list.trigger("chosen:updated");
      }
      while (numStats[0]-- > 0) {
        this.onAddStat();
      }
      remaining = this.stats.slice();
      for (var i = 0; i < remaining.length; ++i) {
        this.onChangeStat(remaining[i]);
      }
    };

    // set item data
    this.setItem = function(data) {
      this.updateItem();
      if (!data || !DiabloCalc.itemById[data.id]) {
        this.type.val("");
        this.type.trigger("chosen:updated");
        this.onChangeType();
        return false;
      }
      var item = DiabloCalc.itemById[data.id];
      this.type.val(item.type);
      if (this.type.val() !== item.type) {
        return false;
      }
      this.type.trigger("chosen:updated");
      this.onChangeType();
      this.item.val(data.id);
      if (this.item.val() !== data.id) {
        return false;
      }
      this.ancient.prop("checked", !!data.ancient);
      if (DiabloCalc.qualities[item.quality].ancient) {
        this.ancientTip.show();
      } else {
        this.ancientTip.hide();
      }
      this.item.trigger("chosen:updated");
      this.statsDiv.children().detach().remove();
      this.stats = [];
      var affixes = this.getItemAffixes(true);
      var required = this.getItemAffixes("only");
      if (required.basearmor && !data.stats.basearmor) {
        data.stats.basearmor = [required.basearmor.max];
      }
      var empty = (data.empty || 0);
      for (var stat in data.stats) {
        if (!affixes[stat]) {
          ++empty;
          continue;
        }
        var statData = this.onAddStat(required[stat] ? stat : undefined, stat);
        statData.list.val(stat);
        var info = DiabloCalc.stats[stat];
        if (data.stats[stat].length >= 1 && typeof data.stats[stat][0] != "string") {
          statData.value.val(data.stats[stat][0]);
        }
        if (data.stats[stat].length >= 2) {
          statData.value2.val(data.stats[stat][1]);
        }
        this.onChangeStat(statData, true);
        if (data.stats[stat].length >= 1 && typeof data.stats[stat][0] == "string" && statData.passive) {
          statData.passiveBox.val(data.stats[stat][0]);
          statData.passiveBox.trigger("chosen:updated");
        }
        if (stat == "sockets" && data.gems && statData.sockets) {
          for (var i = 0; i < data.gems.length && i < statData.sockets.length; ++i) {
            statData.sockets[i].type.val(data.gems[i][0]);
            statData.sockets[i].type.trigger("chosen:updated");
            onChangeSocketType(statData.sockets[i]);
            if (DiabloCalc.legendaryGems[data.gems[i][0]]) {
              statData.sockets[i].level.val(data.gems[i][1]);
            } else {
              statData.sockets[i].color.val(data.gems[i][1]);
              statData.sockets[i].color.trigger("chosen:updated");
            }
          }
        }
      }
      for (var i = 0; i < empty; ++i) {
        this.onAddStat();
      }
      return true;
    };

    this.getId = function() {
      if (!DiabloCalc.itemTypes[this.type.val()]) {
        return;
      }
      var id = this.item.val();
      return (DiabloCalc.itemById[id] ? id : undefined);
    };

    this.getData = function() {
      if (!DiabloCalc.itemTypes[this.type.val()]) {
        return;
      }
      var id = this.item.val();
      var item = DiabloCalc.itemById[id];
      var empty = 0;
      if (!item) {
        return;
      }
      var data = {
        id: id,
        stats: {},
      };
      if (DiabloCalc.qualities[item.quality].ancient) {
        data.ancient = this.ancient.prop("checked");
      }
      for (var i = 0; i < this.stats.length; ++i) {
        var stat = this.stats[i].list.val();
        if (!stat) {
          ++empty;
        } else if (DiabloCalc.stats[stat]) {
          data.stats[stat] = [];
          var args = DiabloCalc.stats[stat].args;
          if (stat == "custom" && item.required && item.required.custom) {
            args = (item.required.custom.args === undefined ? 1 : item.required.custom.args);
          }
          if (args >= 1) {
            data.stats[stat].push(parseFloat(this.stats[i].value.val()) || 0);
          }
          if (args >= 2) {
            data.stats[stat].push(parseFloat(this.stats[i].value2.val()) || 0);
          }
          if (args < 0 && this.stats[i].passive) {
            data.stats[stat].push(this.stats[i].passiveBox.val());
          }

          if (stat == "sockets" && this.stats[i].sockets) {
            data.gems = [];
            for (var j = 0; j < this.stats[i].sockets.length; ++j) {
              var socket = this.stats[i].sockets[j];
              var gem = [socket.type.val(), 0];
              if (DiabloCalc.legendaryGems[gem[0]]) {
                gem[1] = parseInt(socket.level.val());
              } else if (DiabloCalc.gemQualities[gem[0]]) {
                gem[0] = parseInt(gem[0]);
                gem[1] = socket.color.val();
              } else {
                gem = null;
              }
              if (gem) {
                data.gems.push(gem);
              }
            }
          }
        }
      }
      if (empty) data.empty = empty;
      return data;
    };

    this.updateTypes = function(refresh) {
      var value = this.type.val();
      this.type.children().detach().remove();
      this.type.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Empty Slot" : "") + "</option>");

      var types = (this.slot ? DiabloCalc.itemSlots[this.slot].types : DiabloCalc.itemTypes);
      if (this.slot === "offhand") types = DiabloCalc.getOffhandTypes();
      var slots = {};
      for (var type in types) {
        var typeData = types[type];
        if (this.charClass && typeData.classes && typeData.classes.indexOf(this.charClass) < 0) {
          continue;
        }
        if (!slots[types[type].slot]) {
          slots[types[type].slot] = [];
        }
        slots[types[type].slot].push(type);
      }
      for (var slot in slots) {
        var group = this.type;
        if (Object.keys(slots).length > 1 && slots[slot].length > 1) {
          group = $("<optgroup></optgroup>");
          if (DiabloCalc.metaSlots[slot]) {
            group.attr("label", DiabloCalc.metaSlots[slot].name);
          } else {
            group.attr("label", DiabloCalc.itemSlots[slot].name);
          }
          this.type.append(group);
        }
        for (var i = 0; i < slots[slot].length; ++i) {
          var type = slots[slot][i];
          var option = "<option value=\"" + type + (value == type ? "\" selected=\"selected" : "") + "\">" + types[type].name + "</option>";
          group.append(option);
        }
      }
      if (this.type.children().length > 1) {
        this.type.removeAttr("disabled");
      } else {
        this.type.prop("disabled", true);
      }
      this.type.trigger("chosen:updated");
      if (refresh || this.type.val() !== value || !value) {
        this.onChangeType();
      }
    };

    this.onChangeType = function() {
      var type = this.type.val();
      var itemid = this.item.val();
      this.item.children().detach().remove();
      this.item.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Empty Slot" : "") + "</option>");
      if (DiabloCalc.itemTypes[type]) {
        this.itemSpan.show();
        this.statsDiv.show();
        this.add.show();
        for (var i = 0; i < DiabloCalc.itemTypes[type].items.length; ++i) {
          var item = DiabloCalc.itemTypes[type].items[i];
          if (this.charClass && item.classes && item.classes.indexOf(this.charClass) < 0) {
            continue;
          }
          var option = "<option value=\"" + item.id + "\" class=\"item-info-icon quality-" + (item.quality || "rare") + (itemid == item.id ? "\" selected=\"selected" : "") +
            "\">" + item.name + (item.suffix ? " (" + item.suffix + ")" : "") + "</option>";
          this.item.append(option);
        }
      } else {
        this.itemSpan.hide();
        this.statsDiv.hide();
        this.add.hide();
      }
      this.item.trigger("chosen:updated");
      this.onChangeItem();

      if (this.slot === "mainhand") {
        DiabloCalc.itemSlots.offhand.drop.updateTypes(undefined, type);
      }
    };

    this.setClass = function(charClass, slot) {
      this.charClass = charClass;
      if (slot !== undefined) this.slot = slot;
      this.updateTypes(true);
    };

    this.accept = function(id) {
      if (!id || !DiabloCalc.itemById[id]) return false;
      var type = DiabloCalc.itemById[id].type;
      var typeData = (this.slot ? DiabloCalc.itemSlots[this.slot].types : DiabloCalc.itemTypes)[type];
      if (!typeData) return false;

      var twohand = false;
      var noDual = (this.slot === "offhand" && this.charClass && !DiabloCalc.classes[this.charClass].dualwield);
      if (this.slot === "offhand" && this.charClass !== "crusader" && DiabloCalc.itemSlots.mainhand.item && DiabloCalc.itemById[DiabloCalc.itemSlots.mainhand.item.id]) {
        var maintype = DiabloCalc.itemById[DiabloCalc.itemSlots.mainhand.item.id].type;
        if (DiabloCalc.itemTypes[maintype] && DiabloCalc.itemTypes[maintype].slot == "twohand") {
          twohand = true;
        }
      }

      if (twohand && type != "quiver") return false;
      if (noDual && typeData.slot == "onehand" && type != "handcrossbow") return false;
      if (this.charClass && typeData.classes && typeData.classes.indexOf(this.charClass) < 0) return false;

      return true;
    };

    this.type = $("<select class=\"item-info-type\"></select>");
    this.item = $("<select class=\"item-info-item\"></select>");
    this.ancient = $("<input type=\"checkbox\"></input>");
    //FTFY
    this.ancientTip = $("<label class=\"item-info-ancient\"></label>").append(this.ancient).append("Ancient").hide();
    this.statsDiv = $("<ul class=\"item-info-statlist chosen-noframe\"></ul>");
    this.itemSpan = $("<span style=\"display: inline-block\"></span>");
    this.stats = [];

    this.div = $("<div class=\"item-info\"></div>");
    if (this.slot) {
      this.div.append("<h3>" + DiabloCalc.itemSlots[this.slot].name + "</h3>");
    }
    this.div.append($("<div></div>").append(this.type).append(this.itemSpan.append(this.item)));
    this.itemSpan.append(this.ancientTip);
    this.div.append(this.statsDiv);

    parent.append(this.div);

    this.add = $("<div class=\"item-info-add-stat\">Add stat</div>").click(function() {
      var statData = self.onAddStat();
      self.updateStats();
      setTimeout(function() {statData.list.trigger("chosen:open");}, 0);
    });
    this.div.append(this.add);

    this.badstats = $("<span class=\"item-info-badstats\"></span>").hide();
    this.div.append(this.badstats);

    this.ancient.change(function() {
      self.updateItem();
      self.updateLimits();
    });

    this.type.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Empty Slot" : "") + "</option>");
    this.type.change(function() {
      self.onChangeType();
      setTimeout(function() {self.item.trigger("chosen:open");}, 0);
    });
    this.type.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      placeholder_text_single: "Empty Slot",
    });
    this.item.append("<option value=\"\">" + (DiabloCalc.noChosen ? "Empty Slot" : "") + "</option>");
    this.item.change(function() {
      self.onChangeItem();
    });
    this.item.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      search_contains: true,
      placeholder_text_single: "Empty Slot",
    });
    this.addIcons = function(elem, callback) {
      var csn = elem.data("chosen");
      if (csn) {
        var obuild = csn.result_add_option;
        csn.result_add_option = function(option) {
          var add = callback.call(self, option.value);
          if (add) {
            option = $.extend({}, option);
            option.search_text = "<div class=\"icon-wrap\">" + add + "</div>" + option.search_text;
          }
          return obuild.call(this, option);
        };
      }
    };
    this.addIcons(this.item, function(id) {
      var type = this.type.val();
      var icons = (type && DiabloCalc.itemIcons[type]);
      var icon = (icons ? icons[id] : undefined);
      if (type === "custom" && this.slot) {
        var types = (DiabloCalc.getOffhandTypes && this.slot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[this.slot].types);
        for (var t in types) {
          if (types[t].classes && types[t].classes.indexOf(DiabloCalc.charClass) < 0) continue;
          type = t;
          icons = DiabloCalc.itemIcons[type];
          icon = (icons ? icons[DiabloCalc.itemTypes[type].generic] : undefined);
          break;
        }
      }
      if (icon !== undefined) {
        return "<span style=\"background: url(css/items/" + type + ".png) 0 -" + (24 * icon) + "px no-repeat\"></span>";
      }
    });
    DiabloCalc.chosenTips(this.item, function(id) {
      if (DiabloCalc.tooltip && DiabloCalc.itemById[id]) {
        DiabloCalc.tooltip.showItem(this, id, self.slot);
      }
    });
  };
})();






























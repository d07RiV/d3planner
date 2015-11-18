(function() {
  var _L = DiabloCalc.locale("ui-equipment.js");

  var DC = DiabloCalc;

  function setInputHover(elem) {
    elem.hover(function() {
      var min = elem.attr("min");
      var max = elem.attr("max");
      if (min && max && DC.tooltip) {
        var step = parseFloat(elem.attr("step") || 1) || 1;
        var decimal = 0;
        while (decimal < 2 && Math.floor(step - 1e-6) == Math.floor(step + 1e-6)) {
          decimal += 1;
          step *= 10;
        }
        var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p>" +
          "<span class=\"d3-color-green\">" + DC.formatNumber(parseFloat(min), decimal, 1000) + "</span>-" +
          "<span class=\"d3-color-green\">" + DC.formatNumber(parseFloat(max), decimal, 1000) + "</span></p><div>";
        DC.tooltip.showHtml(elem[0], tip);
      }
    }, function() {
      DC.tooltip.hide();
    });
  }
  function setValueRange(input, min, max, step, force) {
    if (min !== undefined) {
      input.attr("min", min);
      if (force === "min") {
        input.val(min);
      }
    } else {
      input.removeAttr("min");
    }
    if (max !== undefined) {
      input.attr("max", max);
      if (force && force !== "min") {
        input.val(max);
      }
    } else {
      input.removeAttr("max");
    }
    input.attr("step", step || 1);
  }
  function smartListStats(src, affixes, charClass) {
    var list = DC.extendStats([], src);
    if (list.length == 0) {
      return list;
    }
    var output = [];
    for (var i = 0; i < list.length; ++i) {
      if (!DC.stats[list[i]] || !charClass || !DC.stats[list[i]].classes || DC.stats[list[i]].classes.indexOf(charClass) >= 0) {
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
        $.each(DC.extendStats([], stat), function(i, name) {
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
        while (DC.statGroups[group]) {
          group = DC.statGroups[group][0];
        }
        group = ((DC.stats[group] && DC.stats[group].group) || group);
        if (!blocked[group]) {
          dst[src[i]] = true;
          blocked[group] = true;
        }
      }
    }
  }
  function onChangeSocketType(sock) {
    var type = sock.type.val();
    if (DC.legendaryGems[type]) {
      sock.level.show();
      sock.colorSpan.hide();
      return sock.level;
    } else if (DC.gemQualities[type]) {
      sock.level.hide();
      sock.colorSpan.show();
      return sock.color;
    } else {
      sock.level.hide();
      sock.colorSpan.hide();
    }
  }

  function getLimits(id, ancient) {
    var limits = DC.statLimits.legendary;
    if (id && DC.itemById[id]) {
      if (DC.itemById[id].quality === "rare") {
        limits = DC.statLimits.rare;
      }
      if (DC.qualities[DC.itemById[id].quality].ancient && ancient) {
        limits = DC.statLimits.ancient;
      }
    } else {
      limits = DC.statLimits.rare;
    }
    return limits;
  };

  // returns number of [primary, secondary] stats on the selected item
  DC.getStatCount = function(id, stats) {
    var item = DC.itemById[id];
    var primary = 4, secondary = 2;
    if (item.primary !== undefined) {
      primary = item.primary;
    } else if (["quiver", "source", "mojo"].indexOf(item.type) >= 0) {
      primary = 5;
    }
    if (item.secondary !== undefined) {
      secondary = item.secondary;
    }
    return [primary, secondary];
  };
  function getItemPreset(id) {
    if (!id || !DC.itemById[id]) {
      return [];
    }
    var type = DC.itemById[id].type;
    var itemSlot = DC.itemTypes[type].slot;
    var preset = {};
    var blocked = {};
    smartExtend(preset, DC.itemById[id].preset, blocked);
    smartExtend(preset, DC.itemTypes[type].preset, blocked);
    if (DC.metaSlots[itemSlot]) {
      smartExtend(preset, DC.metaSlots[itemSlot].preset, blocked);
    } else {
      smartExtend(preset, DC.itemSlots[itemSlot].preset, blocked);
    }
    return Object.keys(preset);
  };
  DC.smartListStats = smartListStats;
  DC.getItemPreset = getItemPreset;

  DC.getItemAffixesById = function(id, ancient, required) {
    if (!id || !DC.itemById[id]) {
      return {};
    }
    var type = DC.itemById[id].type;
    var itemSlot = DC.itemTypes[type].slot;
    var limits = getLimits(id, ancient);
    var stats = {};
    if (DC.metaSlots[itemSlot]) {
      mergeStatsSub(stats, limits, DC.metaSlots[itemSlot], required);
    } else {
      mergeStatsSub(stats, limits, DC.itemSlots[itemSlot], required);
    }
    mergeStatsSub(stats, limits, DC.itemTypes[type], required);
    mergeStatsSub(stats, limits, DC.itemById[id], required);
    return stats;
  };

  DC.makeItem = function(id, custom, ancient) {
    var data = {id: id, stats: {}, ancient: (ancient || false)};
    var preset = getItemPreset(id);
    var affixes = DC.getItemAffixesById(id, data.ancient, true);
    var required = DC.getItemAffixesById(id, data.ancient, "only");
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
      var list = smartListStats(preset[i], affixes, DC.charClass);
      if (list.length && !data.stats[list[0]]) {
        data.stats[list[0]] = mkval(list[0]);
      }
    }
    if (data.stats.sockets) {
      data.gems = [];
    }
    return data;
  };

  DC.getOffhandTypes = function(mhtype) {
    var noDual = !DC.classes[DC.charClass].dualwield;
    var twohand = false;
    if (DC.charClass !== "crusader" && (mhtype || (DC.itemSlots.mainhand.item && DC.itemById[DC.itemSlots.mainhand.item.id]))) {
      var maintype = (mhtype || DC.itemById[DC.itemSlots.mainhand.item.id].type);
      if (DC.itemTypes[maintype] && DC.itemTypes[maintype].slot == "twohand") {
        twohand = true;
      }
    }
    var types = DC.itemSlots.offhand.types;
    var result = {};
    for (var type in types) {
      var typeData = types[type];
      if (twohand && type !== "quiver") continue;
      if (noDual && typeData.slot === "onehand" && type !== "handcrossbow") continue;
      result[type] = typeData;
    }
    return result;
  };
  DC.isItemAllowed = function(slot, id, mhtype) {
    if (!id || !DC.itemById[id] || DC.itemSlots[slot].drop.inactive) return false;

    var item = DC.itemById[id];
    var itemType = item.type;
    var itemSlot = DC.itemTypes[itemType].slot;

    if (item.classes && item.classes.indexOf(DC.charClass) < 0) return false;

    var types = DC.itemSlots[slot].types;
    if (slot === "offhand") types = DC.getOffhandTypes(mhtype);
    if (!types[itemType] || (types[itemType].classes && types[itemType].classes.indexOf(DC.charClass) < 0)) return false;

    return true;
  };
  DC.trimItem = function(slot, data, mhtype) {
    if (!data || !DC.itemById[data.id] || DC.itemSlots[slot].drop.inactive) return;

    var item = DC.itemById[data.id];
    var itemType = item.type;
    var generic = DC.itemTypes[itemType].generic;
    if (!DC.isItemAllowed(slot, generic, mhtype)) return;

    var newItem = {id: generic, stats: {}};
    var affixes = DC.getItemAffixesById(generic, false, true);
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

  function chosen_addIcons(elem, callback, self) {
    var csn = elem.data("chosen");
    if (csn) {
      var obuild = csn.result_add_option;
      csn.result_add_option = function(option) {
        var add = callback.call(self || this, option.value);
        if (add) {
          option = $.extend({}, option);
          option.search_text = "<div class=\"icon-wrap\">" + add + "</div>" + option.search_text;
        }
        return obuild.call(this, option);
      };
    }
  };
  DiabloCalc.chosen_addIcons = chosen_addIcons;

  function StatLine(box, type, required, current) {
    this.box = box;
    this.type = type;
    this.required = required;
    this.line = $("<li></li>");
    this.inner = $("<div></div>");
    this.remove = $("<span class=\"item-info-stat-remove\" title=\"" + _L("Remove stat") + "\"></span>");
    this.list = $("<select class=\"item-info-stat-list\"></select>");
    this.value = $("<input class=\"item-info-stat-value\" type=\"number\"></input>").hide();
    this.value2 = $("<input class=\"item-info-stat-value\" type=\"number\"></input>").hide();
    this.inner.append($("<span style=\"position: absolute\"></span>").append(this.remove));
    this.inner.append(this.list, this.value, this.value2);
    this.line.append(this.inner);
    box.statsDiv.append(this.line);
    box.stats.push(this);

    var self = this;
    this.remove.click(function() {
      self.onRemove();
    });
    if (required) {
      this.remove.hide();
    }
    setInputHover(this.value);
    setInputHover(this.value2);

    this.updateList(current);
    this.list.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      search_contains: true,
      placeholder_text_single: _L("Select a Stat"),
      populate_func: function() {self.generateList();},
    }).change(function() {
      var hadSockets = !!self.sockets;
      self.onChangeStat();
      if (self.value.is(":visible")) {
        self.value.focus().select();
      }
      if (hadSockets || self.sockets || (self.box.slot && DC.itemSlots[self.box.slot].flourish)) {
        self.box.updateItem(true);
      } else {
        self.box.updateStats(true);
      }
    });
    DC.chosenTips(this.list, function(id) {
      if (!DC.tooltip) return;
      var stat = (self.conflicts && self.conflicts[id]);
      if (stat && stat !== id && DC.stats[stat]) {
        var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Conflicts with:") + "</span>";
        tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + DC.stats[stat].name + "</p></div>";
        DC.tooltip.showHtml(this, tip);
      } else if (stat === id) {
        var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Already present on the item.") +
          "</span></p></div>";
        DC.tooltip.showHtml(this, tip);
      } else if (stat === "_resall") {
        var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Conflicts with preset stat:") +
          "</span></br><span class=\"tooltip-icon-bullet\"></span>" + DC.stats.resall.name + "</p></div>";
        DC.tooltip.showHtml(this, tip);
      }
    });
    this.value.blur(DC.validateNumber);
    this.value2.blur(DC.validateNumber);
    this.value.on("input", function() {
      var hadSockets = !!self.sockets;
      self.onChangeValue();
      if (hadSockets || self.sockets) {
        self.box.updateItem(true);
      } else {
        self.box.updateStats(true);
      }
    });
    this.value2.on("input", function() {
      self.box.updateStats(true);
    });
    this.onChangeStat();
  }

  // update stat list; only inserts the selected item to save time
  StatLine.prototype.updateList = function(current) {
    if (this.required) {
      this.list.prop("disabled", true);
      this.list.empty();
      var option = "<option value=\"" + this.required + "\">";
      if (this.required == "custom") {
        var affixes = this.box.getItemAffixes(true);
        if (affixes.custom) {
          option += affixes.custom.name;
        }
      } else {
        option += DC.stats[this.required].name;
      }
      this.list.append(option + "</option>");
    } else {
      this.list.prop("disabled", false);
      var stat = (current || this.list.val());
      if (!DC.noChosen) {
        this.list.empty();
        this.list.append("<option></option>");
        if (DC.stats[stat]) {
          this.list.append("<option value=\"" + stat + "\" selected=\"selected\">" + DC.stats[stat].name + "</option>");
        }
      } else {
        this.fillList(current);
      }
    }
  };
  // fill select box with applicable item stats
  StatLine.prototype.fillList = function(current) {
    var affixes = this.box.getItemAffixes();
    var value = (current || this.list.val());
    var filterClass = (DC.options.limitStats ? this.box.charClass : null);
    if (!filterClass) {
      var id = this.box.getId();
      if (id) {
        filterClass = DC.itemTypes[DC.itemById[id].type].class;
        if (!filterClass && DC.itemById[id].set) {
          filterClass = DC.itemSets[DC.itemById[id].set].class;
        }
      }
    }

    this.list.empty();
    this.list.append("<option value=\"\">" + (DC.noChosen ? _L("Select a Stat") : "") + "</option>");

    if (this.type === "socket") {
      if (affixes.sockets) {
        this.list.append("<option value=\"sockets\"" + (value === "sockets" ? " selected=\"selected\"" : "") + ">" + DC.stats.sockets.name + "</option>");
      }
      return;
    }
    for (var catType in DC.statList) {
      if (this.type === "primary" && catType !== "primary") continue;
      if (this.type === "secondary" && catType !== "secondary") continue;
      for (var cat in DC.statList[catType]) {
        var catName = cat;
        if (catType === "secondary" && this.type !== "secondary") {
          catName += _L(" (Secondary)");
        }
        var stats = DC.statList[catType][cat];
        var group = "";
        $.each(DC.extendStats([], DC.statList[catType][cat]), function(i, stat) {
          if (filterClass && DC.stats[stat].classes &&
              DC.stats[stat].classes.indexOf(filterClass) < 0 && stat !== current) {
            return;
          }
          if (affixes.hasOwnProperty(stat)) {
            group += "<option value=\"" + stat + (stat == value ? "\" selected=\"selected" : "") + "\">" + DC.stats[stat].name + "</option>";
          }
        });
        if (group) {
          this.list.append("<optgroup label=\"" + catName + "\">" + group + "</optgroup>");
        }
      }
    }
  };
  // generate list of stats when combo box is expanded
  // calls fillStatList and grays out conflicting stats
  StatLine.prototype.generateList = function() {
    var id = this.box.getId();
    if (!id) return;
    if (this.required) return;
    var affixes = this.box.getItemAffixes(true);
    var used = {};
    for (var i = 0; i < this.box.stats.length; ++i) {
      var curStat = this.box.stats[i].list.val();
      if (DC.stats[curStat]) {
        if (affixes[curStat] && affixes[curStat].noblock) {
          //used[curStat] = curStat;
        } else {
          used[DC.stats[curStat].group || curStat] = curStat;
        }
      }
    }
    var presets = getItemPreset(id);
    if (presets.indexOf("resall") >= 0) {
      var list = DC.extendStats([], "resist");
      for (var i = 0; i < list.length; ++i) {
        if (!used[list[i]]) {
          used[list[i]] = "_resall";
        }
      }
    }

    var curStat = this.list.val();
    this.fillList(curStat);
    if (DC.stats[curStat]) {
      curStat = (DC.stats[curStat].group || curStat);
    }
    this.conflicts = {};
    var self = this;
    this.list.find("option").each(function() {
      var subStat = $(this).val();
      if (DC.stats[subStat]) {
        var orig = subStat;
        subStat = (DC.stats[subStat].group || subStat);
        if (used[orig] === "_resall") {
          $(this).prop("disabled", true);
          self.conflicts[orig] = "_resall";
        } else if (subStat == curStat || (!used[subStat] && !used[orig])) {
          $(this).removeAttr("disabled");
        } else {
          $(this).prop("disabled", true);
          self.conflicts[orig] = (used[subStat] || used[orig]);
        }
      }
    });
  };
  // triggered when X is clicked
  StatLine.prototype.onRemove = function() {
    if (!this.required) {
      var index = this.line.index();
      this.box.removeStat(index, this.merged);
    }
  };
  // generate list of passives for hellfire (auto fill)
  StatLine.prototype.generatePassives = function(keep, pre) {
    var prevVal;
    if (keep) prevVal = this.passiveBox.val();
    this.passiveBox.empty();
    var filterClass = (DC.options.limitStats ? this.box.charClass : null);
    if (filterClass) {
      var passives = DC.passives[filterClass];
      for (var id in passives) {
        this.passiveBox.append("<option value=\"" + id + (id === prevVal ? "\" selected=\"selected" : "") + "\">" + passives[id].name + "</option>");
        if (id === prevVal) {
          prevVal = undefined;
        }
      }
    } else {
      for (var cls in DC.classes) {
        if (DC.passives[cls]) {
          var group = "<optgroup label=\"" + DC.classes[cls].name + "\">";
          var passives = DC.passives[cls];
          for (var id in passives) {
            group += "<option value=\"" + id + (id === prevVal ? "\" selected=\"selected" : "") + "\">" + passives[id].name + "</option>";
            if (id === prevVal) {
              prevVal = undefined;
            }
          }
          this.passiveBox.append(group + "</optgroup>");
        }
      }
    }
    if (pre && prevVal && DC.allPassives[prevVal]) {
      this.passiveBox.append("<option value=\"" + prevVal + "\" selected=\"selected\">" + DC.allPassives[prevVal].name + "</option>");
    }
  };
  // triggered when stat value changes
  StatLine.prototype.onChangeValue = function() {
    var stat = this.list.val();
    if (stat == "sockets") {
      if (!this.socketList) {
        this.socketList = $("<ul class=\"item-info-gemlist\"></ul>");
        this.sockets = [];
        this.line.append(this.socketList);
      }
      var count = parseInt(this.value.val());
      count = Math.max(count, 1);
      count = Math.min(count, 3);
      while (this.sockets.length > count) {
        this.sockets.pop().line.remove();
      }
      while (this.sockets.length < count) {
        (function(index, self) {
          var sock = {
            line: $("<li></li>"),
            type: $("<select class=\"item-info-gem-type\"></select>"),
            colorSpan: $("<span></span>"),
            color: $("<select class=\"item-info-gem-color\"></select>"),
            level: $("<input class=\"item-info-gem-level\" type=\"number\" min=\"0\" max=\"100\"></input>"),
          };
          sock.type.append("<option value=\"\">" + (DC.noChosen ? _L("Empty Socket") : "") + "</option>");
          var slotType = self.box.type.val();
          slotType = (DC.itemTypes[slotType] ? DC.itemTypes[slotType].slot : null);
          var leggems = 0;
          for (var id in DC.legendaryGems) {
            if (DC.legendaryGems[id].types.indexOf(slotType) >= 0) {
              ++leggems;
            }
          }
          if (leggems) {
            var optgroup = "<optgroup label=\"" + _L("Legendary Gems") + "\">";
            for (var id in DC.legendaryGems) {
              if (DC.legendaryGems[id].types.indexOf(slotType) >= 0) {
                optgroup += "<option class=\"quality-legendary\" value=\"" + id + "\">" + DC.legendaryGems[id].name + "</option>";
              }
            }
            optgroup += "</optgroup><optgroup label=\"" + _L("Normal Gems") + "\">";
            for (var i = DC.gemQualities.length - 1; i >= 0; --i) {
              optgroup += "<option value=\"" + i + "\">" + DC.gemQualities[i] + "</option>";
            }
            sock.type.append(optgroup + "</optgroup>");
          } else {
            for (var i = DC.gemQualities.length - 1; i >= 0; --i) {
              sock.type.append("<option value=\"" + i + "\">" + DC.gemQualities[i] + "</option>");
            }
          }
          for (var id in DC.gemColors) {
            sock.color.append("<option value=\"" + id + "\">" + DC.gemColors[id].name + "</option>");
          }
          sock.line.append(sock.type).append(sock.colorSpan.append(sock.color)).append(sock.level);
          self.socketList.append(sock.line);
          sock.type.chosen({
            disable_search_threshold: 10,
            inherit_select_classes: true,
            search_contains: true,
            allow_single_deselect: true,
            placeholder_text_single: _L("Empty Socket"),
          }).change(function() {
            var input = onChangeSocketType(sock);
            if (input === sock.level) {
              input.focus().select();
            } else if (input == sock.color) {
              setTimeout(function() {input.trigger("chosen:open");}, 0);
            }
          }).change(function() {self.box.updateItem(true);});
          DC.chosenTips(sock.type, function(id) {
            if (DC.tooltip && DC.legendaryGems[id]) {
              DC.tooltip.showGem(this, id);
            }
          });
          chosen_addIcons(sock.type, function(id) {
            if (isNaN(id)) {
              var gem = DC.legendaryGems[id];
              if (gem && (gem.id in DC.itemIcons)) {
                return "<span style=\"background: url(css/items/gemleg.png) 0 -" + (24 * DC.itemIcons[gem.id][0]) + "px no-repeat\"></span>";
              }
            } else {
              id = parseInt(id);
              if (id >= 0 && id < DC.gemQualities.length) {
                return "<span style=\"background: url(css/items/gems.png) -" + (24 * id) + "px -120px no-repeat\"></span>";
              }
            }
          });
          sock.color.chosen({
            disable_search: true,
            inherit_select_classes: true,
          }).change(function() {
            if (index === 0) {
              var allEmpty = true;
              for (var i = 1; i < self.sockets.length; ++i) {
                if (self.sockets[i].type.val()) {
                  allEmpty = false;
                }
              }
              if (allEmpty) {
                var type = self.sockets[0].type.val();
                var color = $(this).val();
                for (var i = 1; i < self.sockets.length; ++i) {
                  self.sockets[i].type.val(type);
                  self.sockets[i].type.trigger("chosen:updated");
                  onChangeSocketType(self.sockets[i]);
                  self.sockets[i].color.val(color);
                  self.sockets[i].color.trigger("chosen:updated");
                }
              }
            }
            self.box.updateItem(true);
          });
          DC.chosenTips(sock.color, function(id) {
            if (DC.tooltip && DC.gemColors[id]) {
              var type = (slotType && (DC.itemSlots[slotType] || DC.metaSlots[slotType]) || {});
              DC.tooltip.showGem(this, [parseInt(sock.type.val()), id], undefined, type.socketType || "other");
            }
          });
          chosen_addIcons(sock.color, function(id) {
            var gem = DC.gemColors[id];
            if (gem && gem.id in DC.itemIcons) {
              var level = parseInt(sock.type.val());
              return "<span style=\"background: url(css/items/gems.png) -" + (24 * level) + "px -" + (24 * DC.itemIcons[gem.id][0]) + "px no-repeat\"></span>";
            }
          });
          onChangeSocketType(sock);
          sock.level.blur(DC.validateNumber).blur().on("input", function() {
            self.box.updateStats(true);
          });
          self.sockets.push(sock);
        })(this.sockets.length, this);
      }
    } else if (this.socketList) {
      this.socketList.remove();
      delete this.socketList;
      delete this.sockets;
    }
  };
  // when stat changes or ancient checkbox is clicked
  StatLine.prototype.updateLimits = function(nosetvalue) {
    var stat = this.list.val();
    var self = this;

    // update inputs
    var affixes = this.box.getItemAffixes(!!this.required);
    var limits = affixes[stat];
    if (typeof limits === "string") {
      // this shouldn't happen, but just in case
      var limitList = this.box.getLimits();
      limits = limitList[limits];
    }
    if (this.merged) {
      var required = this.box.getItemAffixes("only");
      var sublimits = required[stat];
      if (typeof sublimits === "string") {
        // this shouldn't happen, but just in case
        var limitList = this.box.getLimits();
        sublimits = limitList[sublimits];
      }
      limits = $.extend({}, limits);
      if (DC.stats[stat] && DC.stats[stat].dr) {
        limits.min = 100 - 0.01 * (100 - (limits.min || 0)) * (100 - (sublimits.min || 0));
        limits.max = 100 - 0.01 * (100 - (limits.max || 0)) * (100 - (sublimits.max || 0));
        limits.step = "any";
      } else {
        limits.min = (limits.min || 0) + (sublimits.min || 0);
        limits.max = (limits.max || 0) + (sublimits.max || 0);
      }
    }

    var args = 0;
    if (this.required === "custom") {
      args = (affixes.custom.args === undefined ? 1 : affixes.custom.args);
    } else if (DC.stats[stat]) {
      args = DC.stats[stat].args;
    }

    if (args >= 1) {
      this.value.show();
      setValueRange(this.value,
        limits ? limits.min : undefined,
        limits ? limits.max : undefined,
        limits ? limits.step : 1,
        this.prevStat !== limits && !nosetvalue && (limits.best || "max"));
      this.value.blur();
    } else {
      this.value.hide();
    }
    if (args >= 2) {
      this.value2.show();
      setValueRange(this.value2,
        limits ? limits.min2 : undefined,
        limits ? limits.max2 : undefined,
        limits ? limits.step2 : 1,
        this.prevStat !== limits && !nosetvalue && (limits.best || "max"));
      this.value2.blur();
    } else {
      this.value2.hide();
    }
    if (args < 0) {
      if (!this.passive) {
        this.passiveBox = $("<select class=\"item-info-stat-passive\"><option value=\"\"></option></select>");
        if (DC.noChosen) {
          this.passiveBox.find("option").text(_L("Select a Passive Skill"));
        }
        this.passive = $("<span></span>");
        this.passive.append(this.passiveBox);
        this.inner.append(this.passive);
        this.passiveBox.chosen({
          inherit_select_classes: true,
          search_contains: true,
          placeholder_text_single: _L("Select a Passive Skill"),
          populate_func: function() {self.generatePassives(true);},
        }).change(function() {
          self.box.updateStats(true);
        });
        DC.chosenTips(this.passiveBox, function(id) {
          if (DC.tooltip && DC.passives[DC.charClass][id]) {
            DC.tooltip.showSkill(this, DC.charClass, id);
          }
        });
        chosen_addIcons(this.passiveBox, function(id) {
          var passive = DC.passives[DC.charClass][id];
          if (passive) {
            return "<span style=\"background: url(css/images/class-" + DC.charClass + "-passive.png) " +
              (-20 * passive.index) + "px 0 / auto 40px no-repeat\"></div>";
          }
        });
      }
      this.generatePassives(this.prevStat === limits, true);
      this.passiveBox.trigger("chosen:updated");
      this.passive.show();
    } else if (this.passive) {
      this.passive.hide();
    }

    this.prevStat = limits;

    this.onChangeValue();
  };
  // triggered when stat changes
  StatLine.prototype.onChangeStat = function(nosetvalue) {
    var item = this.box.getId();
    var stat = this.list.val();
    var self = this;

    var cls = "";
    if (!DC.stats[stat]) {
      if (this.type === "primary") cls = "stat-primary";
      if (this.type === "secondary") cls = "stat-secondary";
      if (this.type === "socket") cls = "stat-socket";
    } else if (stat === "sockets") {
      cls = "stat-socket";
      if (!this.type) this.type = "primary";
    } else if (DC.stats[stat].secondary) {
      cls = "stat-secondary";
      if (!this.type) this.type = "secondary";
    } else {
      cls = "stat-primary";
      if (!this.type) this.type = "primary";
    }
    this.line.attr("class", cls);

    var required = this.box.getItemAffixes("only");
    if (!this.required && required[stat]) {
      this.merged = stat;
      for (var i = 0; i < this.box.stats.length; ++i) {
        if (this.box.stats[i].required === stat) {
          this.box.stats[i].line.remove();
          this.box.stats.splice(i--, 1);
        }
      }
    } else if (this.merged) {
      if (required[this.merged]) {
        var statData = this.box.onAddStat(this.merged, this.merged);
        statData.list.val(this.merged);
      }
      delete this.merged;
    }

    // update separators/warnings
    this.box.reorderStats(this.box.stats.indexOf(this));
    this.box.updateStatCounts();

    this.updateLimits();
  };

  DC.ItemBox = function(parent, options) {
    var self = this;
    this.doUpdate = function() {
      delete self.upd_timeout;
      self.onUpdate(self.upd_itemChanged, self.upd_reason);
      delete self.upd_itemChanged;
      delete self.upd_reason;
    };
    $.extend(this, options);

    this.type = $("<select class=\"item-info-type\"></select>");
    this.item = $("<select class=\"item-info-item\"></select>");
    this.transmogs = $("<select class=\"item-info-item\"></select>");
    this.dyes = $("<select class=\"item-info-item item-info-dye\"></select>");
    this.equipSet = $("<span class=\"item-info-equipset\">" + _L("Equip full set") + "</span>").hide();
    this.ancient = $("<input type=\"checkbox\"></input>");
    this.ancientTip = $("<label class=\"item-info-ancient\"></label>").append(this.ancient).append(_L("Ancient")).hide();
    this.statsDiv = $("<ul class=\"item-info-statlist chosen-noframe\"></ul>");
    this.typeSpan = $("<span style=\"display: inline-block; vertical-align: top\"></span>");
    this.itemSpan = $("<span style=\"display: inline-block; vertical-align: top\"></span>");
    this.itemMod = $("<div class=\"item-mod chosen-noframe\"></div>");
    this.stats = [];

    this.div = $("<div class=\"item-info\"></div>");
    if (this.slot) {
      this.div.append("<h3>" + DC.itemSlots[this.slot].name + "</h3>");
    }
    this.div.append($("<div></div>").append(this.typeSpan.append(this.type)).append(this.itemSpan.append(this.item)));
    this.typeSpan.append(this.equipSet);
    this.itemSpan.append(this.ancientTip);
    this.div.append(this.statsDiv);

    this.equipSet.click(function() {self.onEquipSet();});
    DC.register("updateSlotItem", function() {self.updateEquipSet();});
    DC.register("importEnd", function() {self.updateEquipSet();});

    parent.append(this.div);

    this.add = $("<div class=\"item-info-add-stat\">" + _L("Add stat") + "</div>").click(function() {
      var statData = self.onAddStat();
      self.updateStats();
      setTimeout(function() {statData.list.trigger("chosen:open");}, 0);
    });
    this.div.append(this.add);

    this.badstats = $("<span class=\"item-info-badstats\"></span>").hide();
    this.div.append(this.badstats);

    this.div.append(this.itemMod.append(this.transmogs, this.dyes));

    this.ancient.change(function() {
      self.updateItem();
      self.updateLimits();
    });

    this.type.append("<option value=\"\">" + (DC.noChosen ? _L("Empty Slot") : "") + "</option>");
    this.type.change(function() {
      self.onChangeType();
      setTimeout(function() {self.item.trigger("chosen:open");}, 0);
    });
    this.type.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      placeholder_text_single: _L("Empty Slot"),
    });
    this.item.append("<option value=\"\">" + (DC.noChosen ? _L("Empty Slot") : "") + "</option>");
    this.item.change(function() {
      self.onChangeItem();
    });
    this.item.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      search_contains: true,
      placeholder_text_single: _L("Empty Slot"),
    });
    this.transmogs.append("<option value=\"\">" + (DC.noChosen ? _L("Transmogrification") : "") + "</option>");
    this.transmogs.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      search_contains: true,
      placeholder_text_single: _L("Transmogrification"),
      populate_func: function() {self.fillTransmogs();},
    });
    this.transmogs.change(function() {
      self.onUpdate(true);
    });
    this.dyes.append("<option value=\"\">" + (DC.noChosen ? _L("Dye") : "") + "</option>");
    for (var id in DC.webglDyes) {
      this.dyes.append("<option value=\"" + id + "\" class=\"item-info-icon\">" + DC.webglDyes[id].name + "</option>");
    }
    this.dyes.chosen({
      disable_search_threshold: 10,
      inherit_select_classes: true,
      allow_single_deselect: true,
      search_contains: true,
      placeholder_text_single: _L("Dye"),
    });
    this.dyes.change(function() {
      self.onUpdate(true);
    });
    chosen_addIcons(this.item, function(id) {
      var type = this.type.val();
      var icon = DC.itemIcons[id];
      if (type === "custom" && this.slot) {
        var types = (DC.getOffhandTypes && this.slot === "offhand" ? DC.getOffhandTypes() : DC.itemSlots[this.slot].types);
        for (var t in types) {
          if (types[t].classes && types[t].classes.indexOf(DC.charClass) < 0) continue;
          type = t;
          icon = DC.itemIcons[DC.itemTypes[type].generic];
          break;
        }
      }
      if (icon !== undefined) {
        return "<span style=\"background: url(css/items/" + type + ".png) 0 -" + (24 * icon[0]) + "px no-repeat\"></span>";
      }
    }, this);
    chosen_addIcons(this.transmogs, function(id) {
      var icon = DC.itemIcons[id];
      var item = (DC.itemById[id] || DC.webglItems[id]);
      if (icon !== undefined && item && item.type) {
        return "<span style=\"background: url(css/items/" + item.type + ".png) 0 -" + (24 * icon[0]) + "px no-repeat\"></span>";
      }
    }, this);
    chosen_addIcons(this.dyes, function(id) {
      var icon = DC.itemIcons[id];
      if (icon !== undefined) {
        return "<span style=\"background: url(css/items/dyes.png) 0 -" + (24 * icon[0]) + "px no-repeat\"></span>";
      }
    }, this);
    DC.chosenTips(this.item, function(id) {
      if (DC.tooltip && DC.itemById[id]) {
        DC.tooltip.showItem(this, id, self.slot);
      }
    });
  };

  DC.ItemBox.prototype.removeStat = function(index, merged) {
    var stat = this.stats[index].list.val();
    this.stats[index].line.remove();
    this.stats.splice(index, 1);
    if (merged) {
      var statData = this.onAddStat(merged, merged);
      statData.list.val(merged);
    }
    if (DC.stats[stat]) {
      this.updateStatCounts();
    } else {
      this.updateWarning();
    }
    this.updateItem(true);
  };
  DC.ItemBox.prototype.updateItem = function(reason) {
    if (this.suppress) return;
    if (DC.importActive) {
      this.onUpdate(true, reason);
      return;
    }
    this.upd_itemChanged = (this.upd_itemChanged || true);
    this.upd_reason = reason;
    if (!this.upd_timeout) {
      this.upd_timeout = setTimeout(this.doUpdate, 0);
    }
  };
  DC.ItemBox.prototype.updateStats = function(reason) {
    if (this.suppress) return;
    if (DC.importActive) {
      this.onUpdate(false, reason);
      return;
    }
    this.upd_itemChanged = (this.upd_itemChanged || false);
    this.upd_reason = reason;
    if (!this.upd_timeout) {
      this.upd_timeout = setTimeout(this.doUpdate, 0);
    }
  };
  DC.ItemBox.prototype.onUpdate = function(itemChanged, reason) {
    if (this.slot) {
      DC.trigger(itemChanged ? "updateSlotItem" : "updateSlotStats", this.slot, reason);
    }
  };
  // return stat => limits mapping for selected item quality
  DC.ItemBox.prototype.getLimits = function() {
    return getLimits(this.item.val(), this.ancient.prop("checked"));
  };
  // return a dictionary of possible stats=>limits for selected item
  // required = (false | true | "only") to return only enchantable stats, both, or only fixed stats
  DC.ItemBox.prototype.getItemAffixes = function(required) {
    return DC.getItemAffixesById(this.item.val(), this.ancient.prop("checked"), required);
  };
  // add more boxes for primary/secondary stats
  DC.ItemBox.prototype.updateStatCounts = function() {
    if (this.nonRecursive) return;
    this.nonRecursive = true;
    var id = this.item.val();
    if (!id || !DC.itemById[id]) {
      return;
    }
    var numStats = DC.getStatCount(id);
    if (id === "Unique_Ring_021_x1") {
      // manald heal
      for (var i = 0; i < this.stats.length; ++i) {
        var stat = this.stats[i].list.val();
        if (stat === "spiritregen" || stat === "wrathregen") {
          ++numStats[0];
          --numStats[1];
        }
      }
    }
    var usedPrimary = 0, usedSecondary = 0, gift = 0;
    var emptyPrimary = [];
    var emptySecondary = [];
    var emptySocket = [];
    for (var i = 0; i < this.stats.length; ++i) {
      var stat = this.stats[i].list.val();
      if (DC.stats[stat] && DC.stats[stat].base) continue;
      var weight = 1;
      if (this.stats[i].merged) ++weight;
      if (DC.stats[stat] ? DC.stats[stat].secondary : this.stats[i].type === "secondary") {
        usedSecondary += weight;
      } else if (DC.stats[stat] || this.stats[i].type !== "socket") {
        usedPrimary += weight;
      }
      if (!DC.stats[stat]) {
        if (this.stats[i].type === "secondary") {
          emptySecondary.push(this.stats[i]);
        } else if (this.stats[i].type === "socket") {
          emptySocket.push(this.stats[i]);
        } else if (this.stats[i].type === "primary") {
          emptyPrimary.push(this.stats[i]);
        }
      }
      if (stat === "sockets") {
        ++gift;
      }
    }
    var slotType = this.type.val();
    slotType = (DC.itemTypes[slotType] ? DC.itemTypes[slotType].slot : null);
    if (slotType === "onehand" || slotType === "twohand") {
      if (!gift && emptySocket.length === 0) {
        this.onAddStat("socket");
      } else {
        usedPrimary -= gift;
      }
    } else if (emptySocket.length) {
      var index = this.stats.indexOf(emptySocket[0]);
      if (index >= 0) {
        this.stats[index].line.remove();
        this.stats.splice(index, 1);
      }
    }
    while (usedPrimary < numStats[0]) {
      this.onAddStat("primary");
      ++usedPrimary;
    }
    while (usedPrimary > numStats[0] && emptyPrimary.length) {
      var index = this.stats.indexOf(emptyPrimary.pop());
      if (index >= 0) {
        this.stats[index].line.remove();
        this.stats.splice(index, 1);
      }
      --usedPrimary;
    }
    while (usedSecondary < numStats[1]) {
      this.onAddStat("secondary");
      ++usedSecondary;
    }
    while (usedSecondary > numStats[0] && emptySecondary.length) {
      var index = this.stats.indexOf(emptySecondary.pop());
      if (index >= 0) {
        this.stats[index].line.remove();
        this.stats.splice(index, 1);
      }
      --usedSecondary;
    }
    this.updateWarning();
    delete this.nonRecursive;
  };
  // update the warning icon
  DC.ItemBox.prototype.updateWarning = function() {
    var id = this.item.val();
    if (!id || !DC.itemById[id]) {
      this.badstats.hide();
      return;
    }

    var affixes = this.getItemAffixes(true);
    var presets = getItemPreset(id);
    var numStats = DC.getStatCount(id);

    var statList = {};
    var usedPrimary = 0, usedSecondary = 0, gift = 0, unused = 0;
    for (var i = 0; i < this.stats.length; ++i) {
      var stat = this.stats[i].list.val();
      if (!stat) unused += 1;
      else statList[stat] = true;
      if (!DC.stats[stat] || DC.stats[stat].base) continue;
      var weight = 1;
      if (this.stats[i].merged) ++weight;
      if (DC.stats[stat].secondary) {
        usedSecondary += weight;
      } else {
        usedPrimary += weight;
      }
      if (stat == "sockets") {
        gift = 1;
      }
    }

    var slotType = this.type.val();
    slotType = (DC.itemTypes[slotType] ? DC.itemTypes[slotType].slot : null);
    if (slotType != "onehand" && slotType != "twohand") {
      gift = 0;
    }

    if (DC.options.moreWarnings) {
      unused = 0;
    }

    var tip = "";
    if (usedPrimary + unused < numStats[0]) {
      tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + _L("Add more primary stats");
    } else if (usedPrimary - gift > numStats[0]) {
      tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + _L("Too many primary stats");
    }
    if (usedSecondary > numStats[1]) {
      tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + _L("Too many secondary stats");
    } else if (DC.options.moreWarnings && usedSecondary < numStats[1]) {
      tip += "</br><span class=\"tooltip-icon-bullet\"></span>" + _L("Add more secondary stats");
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
      tip += "<br/><span class=\"tooltip-icon-bullet\"></span>" + _L("More than one preset stat is missing");
      for (var i = 0; i < presets.length; ++i) {
        var name = presets[i];
        if (DC.stats[presets[i]]) {
          name = DC.stats[presets[i]].name;
        } else if (DC.statGroupNames[presets[i]]) {
          name = DC.statGroupNames[presets[i]];
        } else if (presets[i].indexOf("skill_") == 0) {
          name = _L("Skill Damage");
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
      tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Impossible stat combination") + "</span>" +
        tip + "</p></div>";
      this.badstats.hover(function() {
        DC.tooltip.showHtml(this, tip);
      }, function() {
        DC.tooltip.hide();
      });
      this.badstats.show();
    } else {
      this.badstats.hide();
    }
  };
  // stat ordering
  function statCompare(abox, bbox) {
    var a = abox.list.val();
    var b = bbox.list.val();
    var acat = (DC.stats[a] ? (a === "sockets" ? 4 : (DC.stats[a].secondary ? 2 : 0))
                            : (abox.type === "secondary" ? 3 : (abox.type === "socket" ? 5 : 1)));
    var bcat = (DC.stats[b] ? (b === "sockets" ? 4 : (DC.stats[b].secondary ? 2 : 0))
                            : (bbox.type === "secondary" ? 3 : (bbox.type === "socket" ? 5 : 1)));
    if (acat != bcat) {
      return acat - bcat;
    } else if (DC.stats[a] && DC.stats[b]) {
      return DC.stats[a].prio - DC.stats[b].prio;
    } else {
      return 0;
    }
  }
  // reorder stats
  DC.ItemBox.prototype.reorderStats = function(index) {
    var newIndex = index;
    var statData = this.stats[index];
    while (newIndex < this.stats.length && statCompare(statData, this.stats[newIndex]) >= 0) {
      newIndex++;
    }
    while (newIndex > 0 && statCompare(statData, this.stats[newIndex - 1]) <= 0) {
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
  };
  // triggered when item quality changes (ancient checkbox)
  DC.ItemBox.prototype.updateLimits = function() {
    for (var i = 0; i < this.stats.length; ++i) {
      this.stats[i].updateLimits();
    }
  };
  // add stat line
  DC.ItemBox.prototype.onAddStat = function(type, required, current) {
    if (type !== "primary" && type !== "secondary" && type !== "socket" && (required || current)) {
      current = required;
      required = type;
      type = undefined;
      var stat = (required || current);
      if (DC.stats[stat]) {
        var slotType = this.type.val();
        slotType = (DC.itemTypes[slotType] ? DC.itemTypes[slotType].slot : null);
        if ((slotType === "onehand" || slotType === "twohand") && stat === "sockets") type = "socket";
        else if (DC.stats[stat].secondary) type = "secondary";
        else type = "primary";
      }
    }
    return new StatLine(this, type, required, current);
  };
  DC.ItemBox.prototype.onEquipSet = function(dry) {
    var id = this.item.val();
    if (!id || !DC.itemById[id] || !DC.itemById[id].set) return false;
    var item = DC.itemById[id];
    var set = DC.itemSets[item.set];
    var list = {};
    var equipped = {};
    var mhtype;
    if (DC.itemSlots.mainhand && DC.itemSlots.mainhand.item) {
      var mhid = DC.itemSlots.mainhand.item.id;
      if (mhid && DC.itemById[mhid]) mhtype = DC.itemById[mhid].type;
    }
    for (var slot in DC.itemSlots) {
      var id = DC.getSlotId(slot);
      if (id) equipped[id] = slot;
    }
    for (var i = 0; i < set.items.length; ++i) {
      var cur = set.items[i];
      if (equipped[cur.id]) continue;
      var type = cur.type;
      var slot = DC.itemTypes[type].slot;
      var slots = [slot];
      if (DC.metaSlots[slot]) slots = DC.metaSlots[slot].slots;
      for (var j = 0; j < slots.length; ++j) {
        if (!list[slots[j]] && !DC.getSlotId(slots[j]) && DC.isItemAllowed(slots[j], cur.id, mhtype)) {
          list[slots[j]] = cur.id;
          break;
        }
      }
    }
    if ($.isEmptyObject(list)) return false;
    if (dry) return true;
    var ancient = !!this.ancient.prop("checked");
    for (var slot in list) {
      DC.setSlot(slot, DC.makeItem(list[slot], undefined, ancient));
    }
    return true;
  };
  DC.ItemBox.prototype.updateEquipSet = function() {
    this.equipSet.toggle(this.onEquipSet(true));
  };
  // big function
  DC.ItemBox.prototype.onChangeItem = function() {
    delete this.enchant;
    var id = this.item.val();
    var self = this;
    if (this.slot === "mainhand" && DC.itemSlots.offhand.item && DC.itemById[DC.itemSlots.offhand.item.id]) {
      var mhtype = this.type.val();
      var ohtype = DC.itemById[DC.itemSlots.offhand.item.id].type;
      if (DC.itemTypes[mhtype] && DC.itemTypes[mhtype].slot == "twohand" &&
          DC.charClass != "crusader" && ohtype && ohtype != "quiver") {
        DC.trigger("updateSlotItem", "offhand", "twohand");
      }
    }
    this.updateItem();
    this.updateMods();
    this.updateEquipSet();
    if (!id) {
      this.statsDiv.empty();
      this.stats = [];
      this.badstats.hide();
      this.ancientTip.hide();
      return;
    }
    this.nonRecursive = true;
    var nonreq = this.getItemAffixes(false);
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
    var numStats = DC.getStatCount(id);
    if (DC.qualities[DC.itemById[id].quality].ancient) {
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
            delete this.stats[i].required;
            this.stats[i].remove.show();
          }
          this.stats[i].updateList();
          this.stats[i].list.trigger("chosen:updated");
          preset.splice(j, 1);
          found = true;
          break;
        }
      }
      if (!found) {
        if (this.stats[i].required) {
          if (affixes[this.stats[i].required]) {
            delete this.stats[i].required;
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
    var gift = 0;
    for (var i = 0; i < this.stats.length; ++i) {
      var stat = (this.stats[i].required || this.stats[i].list.val());
      if (DC.stats[stat] && DC.stats[stat].secondary) {
        numStats[1]--;
      } else if (!DC.stats[stat] || !DC.stats[stat].base) {
        numStats[0]--;
      }
      if (stat === "socket") {
        ++gift;
      }
    }
    var slotType = this.type.val();
    slotType = (DC.itemTypes[slotType] ? DC.itemTypes[slotType].slot : null);
    if (slotType != "onehand" && slotType != "twohand") {
      numStats[0] += gift;
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
        group = (DC.stats[stat].group || stat);
      }
      for (var j = 0; j < remaining.length; ++j) {
        var curStat = remaining[j].list.val();
        if (curStat === group || (DC.stats[curStat] && DC.stats[curStat].group === group)) {
          var index = this.stats.indexOf(remaining[j]);
          remaining[j].line.remove();
          remaining.splice(j--, 1);
          if (index >= 0) {
            this.stats.splice(index, 1);
          }
        }
      }
      if (DC.stats[stat]) {
        var needRemove = undefined;
        if (DC.stats[stat].secondary) {
          if (--numStats[1] < 0) {
            needRemove = true;
          }
        } else if (!DC.stats[stat].base) {
          if (--numStats[0] < 0) {
            needRemove = false;
          }
        }
        if (needRemove !== undefined) {
          for (var j = 0; j < remaining.length; ++j) {
            var curStat = remaining[j].list.val();
            if (DC.stats[curStat] && DC.stats[curStat].base) {
              continue;
            }
            var statSecondary = !!(DC.stats[curStat] && DC.stats[curStat].secondary);
            if (statSecondary === needRemove) {
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
      remaining[i].updateList();
      remaining[i].list.trigger("chosen:updated");
    }
    remaining = this.stats.slice();
    for (var i = 0; i < remaining.length; ++i) {
      remaining[i].onChangeStat();
    }
    delete this.nonRecursive;
    this.updateStatCounts();
  };
  // set item data
  DC.ItemBox.prototype.setItem = function(data) {
    this.updateItem();
    if (!data || !DC.itemById[data.id]) {
      this.type.val("");
      this.type.trigger("chosen:updated");
      this.onChangeType();
      return false;
    }
    var item = DC.itemById[data.id];
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
    if (DC.qualities[item.quality].ancient) {
      this.ancientTip.show();
    } else {
      this.ancientTip.hide();
    }
    this.item.trigger("chosen:updated");
    this.statsDiv.empty();
    this.stats = [];
    var nonreq = this.getItemAffixes(false);
    var affixes = this.getItemAffixes(true);
    var required = this.getItemAffixes("only");
    if (required.basearmor && !data.stats.basearmor) {
      data.stats.basearmor = [required.basearmor.max];
    }
    this.nonRecursive = true;
    var empty = (data.empty || 0);
    for (var stat in data.stats) {
      if (!affixes[stat]) {
        ++empty;
        continue;
      }
      var req = (required[stat] ? stat : undefined);
      if (req && required[stat].noblock && nonreq[stat] && data.stats[stat].length >= 1 &&
          typeof data.stats[stat][0] !== "string" && required[stat].max && data.stats[stat][0] > required[stat].max) {
        req = false;
      }
      var statData = this.onAddStat(req, stat);
      statData.list.val(stat);
      var info = DC.stats[stat];
      if (data.stats[stat].length >= 1 && typeof data.stats[stat][0] !== "string") {
        statData.value.val(data.stats[stat][0]);
      }
      if (data.stats[stat].length >= 2) {
        statData.value2.val(data.stats[stat][1]);
      }
      statData.onChangeStat(true);
      if (data.stats[stat].length >= 1 && typeof data.stats[stat][0] === "string" && statData.passive) {
        statData.passiveBox.val(data.stats[stat][0]);
        statData.passiveBox.trigger("chosen:updated");
      }
      if (stat === "sockets" && data.gems && statData.sockets) {
        for (var i = 0; i < data.gems.length && i < statData.sockets.length; ++i) {
          statData.sockets[i].type.val(data.gems[i][0]);
          statData.sockets[i].type.trigger("chosen:updated");
          onChangeSocketType(statData.sockets[i]);
          if (DC.legendaryGems[data.gems[i][0]]) {
            statData.sockets[i].level.val(data.gems[i][1]);
          } else {
            statData.sockets[i].color.val(data.gems[i][1]);
            statData.sockets[i].color.trigger("chosen:updated");
          }
        }
      }
    }
    delete this.nonRecursive;
    this.updateStatCounts();
    this.updateMods(data.transmog, data.dye);
    this.updateEquipSet();
    this.enchant = data.enchant;
    return true;
  };

  DC.ItemBox.prototype.getId = function() {
    if (!DC.itemTypes[this.type.val()]) {
      return;
    }
    var id = this.item.val();
    return (DC.itemById[id] ? id : undefined);
  };

  DC.ItemBox.prototype.getData = function() {
    if (!DC.itemTypes[this.type.val()]) {
      return;
    }
    var id = this.item.val();
    var item = DC.itemById[id];
    var empty = 0;
    if (!item) {
      return;
    }
    var data = {
      id: id,
      stats: {},
    };
    if (DC.qualities[item.quality].ancient) {
      data.ancient = this.ancient.prop("checked");
    }
    for (var i = 0; i < this.stats.length; ++i) {
      var stat = this.stats[i].list.val();
      if (!stat) {
        ++empty;
      } else if (DC.stats[stat]) {
        data.stats[stat] = [];
        var args = DC.stats[stat].args;
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

        if (stat === "sockets" && this.stats[i].sockets) {
          data.gems = [];
          for (var j = 0; j < this.stats[i].sockets.length; ++j) {
            var socket = this.stats[i].sockets[j];
            var gem = [socket.type.val(), 0];
            if (DC.legendaryGems[gem[0]]) {
              gem[1] = parseInt(socket.level.val());
            } else if (DC.gemQualities[gem[0]]) {
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
    if (this.enchant && data.stats[this.enchant]) {
      data.enchant = this.enchant;
    }
    var mods = this.getMods();
    if (mods[0] && this.transmogs.val()) data.transmog = this.transmogs.val();
    if (mods[1] && this.dyes.val()) data.dye = this.dyes.val();
    if (empty) data.empty = empty;
    return data;
  };

  DC.ItemBox.prototype.updateTypes = function(refresh) {
    var value = this.type.val();
    this.type.empty();
    this.type.append("<option value=\"\">" + (DC.noChosen ? _L("Empty Slot") : "") + "</option>");

    var types = (this.slot ? DC.itemSlots[this.slot].types : DC.itemTypes);
    if (this.slot === "offhand") types = DC.getOffhandTypes();
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
        if (DC.metaSlots[slot]) {
          group.attr("label", DC.metaSlots[slot].name);
        } else {
          group.attr("label", DC.itemSlots[slot].name);
        }
        this.type.append(group);
      }
      for (var i = 0; i < slots[slot].length; ++i) {
        var type = slots[slot][i];
        var option = "<option value=\"" + type + (value == type ? "\" selected=\"selected" : "") + "\">" + DC.GenderString(types[type].name) + "</option>";
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

  DC.ItemBox.prototype.getMods = function() {
    var canTransmog = false, canDye = false;
    var item = this.item.val();
    item = (item && DC.itemById[item]);
    var type = (item && DC.itemTypes[item.type]);
    if (item && type) {
      if (type.slot === "head" || type.slot === "shoulders" || type.slot === "torso" ||
          type.slot === "legs" || type.slot === "hands" || type.slot === "feet") {
        canTransmog = true;
        canDye = true;
      }
      if (type.slot === "mainhand" || type.slot === "offhand" || type.slot === "twohand" || type.slot === "onehand") {
        if (item.type !== "quiver") canTransmog = true;
      }
    }
    return [canTransmog, canDye];
  };
  DC.ItemBox.prototype.updateMods = function(transmog, dye) {
    var mods = this.getMods();
    this.itemMod.toggle(!!(mods[0] || mods[1]));
    var transmogs = this.transmogs;
    if (!DC.noChosen) transmogs = transmogs.next();
    transmogs.toggle(mods[0]);
    var dyes = this.dyes;
    if (!DC.noChosen) dyes = dyes.next();
    dyes.toggle(mods[1]);
    if (mods[0]) {
      if (DC.noChosen) {
        this.fillTransmogs(transmog);
      } else {
        this.transmogs.empty();
        var item = (transmog && (DC.itemById[transmog] || DC.webglItems[transmog]));
        this.transmogs.append("<option value=\"" + (transmog || "") + "\" selected=\"selected\">" + (item && item.name || "") + "</option>");
        this.transmogs.trigger("chosen:updated");
      }
    }
    if (mods[1]) {
      this.dyes.val(dye);
      this.dyes.trigger("chosen:updated");
    }
  };
  DC.ItemBox.prototype.fillTransmogs = function() {
    var list = this.transmogs;
    var itemid = list.val();
    if (arguments.length > 0) itemid = arguments[0];
    list.empty();
    list.append("<option value=\"\">" + (DC.noChosen ? _L("Transmogrification") : "") + "</option>");
    var curItem = this.item.val();
    curItem = (curItem && DC.itemById[curItem]);
    if (!curItem) return;
    var curType = DC.itemTypes[curItem.type];
    var group = $("<optgroup label=\"" + _L("Normal Items") + "\"></optgroup>");
    var groupPromo = $("<optgroup label=\"" + _L("Promotion Items") + "\"></optgroup>");
    list.append(group);
    var actorList = {};
    var charActor = ((DC.webglClasses[DC.charClass] || {})[DC.gender || "female"] || 0);
    function addItem(index, item) {
      if (!item.name) return;
      if (item.id && item.quality === "rare") return;
      var type = DC.itemTypes[item.type];
      if (!type) return;
      if (type.classes && type.classes.indexOf(DC.charClass) < 0) return;
      if (item.classes && item.classes.indexOf(DC.charClass) < 0) return;
      if (type.slot != curType.slot) return;
      if (type.slot === "offhand" && type !== curType) {
        if (type !== DC.itemTypes.shield && type !== DC.itemTypes.crusadershield) return;
        if (curType !== DC.itemTypes.shield && curType !== DC.itemTypes.crusadershield) return;
      }
      if (type.weapon && curType.weapon && type.weapon.type !== curType.weapon.type) return;
      if (item.actor) {
        var actor = item.actor;
        if (typeof actor === "object") actor = actor[charActor];
        if (actorList[actor] && itemid !== index) return;
        actorList[actor] = true;
      }
      if (item.armortype) {
        var actor = item.armortype + "_" + item.look;
        if (actorList[actor] && itemid !== index) return;
        actorList[actor] = true;
      }
      (item.promo ? groupPromo : group).append("<option value=\"" + (item.id || index) +
         "\" class=\"item-info-icon quality-" + (item.quality || (item.promo ? "legendary" : "normal")) +
        (itemid == (item.id || index) ? "\" selected=\"selected" : "") +
        "\">" + item.name + (item.suffix ? " (" + item.suffix + ")" : "") + "</option>");
    }
    $.each(DC.webglItems, addItem);
    group = $("<optgroup label=\"" + _L("Legendary Items") + "\"></optgroup>");
    list.append(group);
    $.each(DC.items, addItem);
    list.append(groupPromo);
  };

  DC.ItemBox.prototype.onChangeType = function() {
    var type = this.type.val();
    var itemid = this.item.val();
    this.item.empty();
    this.item.append("<option value=\"\">" + (DC.noChosen ? _L("Empty Slot") : "") + "</option>");
    if (DC.itemTypes[type]) {
      this.itemSpan.show();
      this.statsDiv.show();
      this.add.show();
      for (var i = 0; i < DC.itemTypes[type].items.length; ++i) {
        var item = DC.itemTypes[type].items[i];
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
      DC.itemSlots.offhand.drop.updateTypes(undefined, type);
    }
  };

  DC.ItemBox.prototype.setClass = function(charClass, slot) {
    this.charClass = charClass;
    if (slot !== undefined) this.slot = slot;
    this.updateTypes(true);
  };

  DC.ItemBox.prototype.accept = function(id) {
    if (!id || !DC.itemById[id]) return false;
    var type = DC.itemById[id].type;
    var typeData = (this.slot ? DC.itemSlots[this.slot].types : DC.itemTypes)[type];
    if (!typeData) return false;

    var twohand = false;
    var noDual = (this.slot === "offhand" && this.charClass && !DC.classes[this.charClass].dualwield);
    if (this.slot === "offhand" && this.charClass !== "crusader" && DC.itemSlots.mainhand.item && DC.itemById[DC.itemSlots.mainhand.item.id]) {
      var maintype = DC.itemById[DC.itemSlots.mainhand.item.id].type;
      if (DC.itemTypes[maintype] && DC.itemTypes[maintype].slot == "twohand") {
        twohand = true;
      }
    }

    if (twohand && type != "quiver") return false;
    if (noDual && typeData.slot == "onehand" && type != "handcrossbow") return false;
    if (this.charClass && typeData.classes && typeData.classes.indexOf(this.charClass) < 0) return false;

    return true;
  };

})();

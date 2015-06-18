(function() {
  var afterLoad;

  var eventHandlers = {};
  var eventTimeouts = {};
  DiabloCalc.register = function(evt, func) {
    if (!eventHandlers[evt]) {
      eventHandlers[evt] = [];
    }
    eventHandlers[evt].push(func);
  };
  DiabloCalc.unregister = function(evt, func) {
    if (eventHandlers[evt]) {
      for (var i = 0; i < eventHandlers[evt].length; ++i) {
        if (eventHandlers[evt][i] === func) {
          eventHandlers[evt].splice(i, 1);
          return;
        }
      }
    }
  };
  function realTrigger(args) {
    var evt = args.shift();
    var id = args[0];
    if (id === undefined) {
      id = null;
    }
    if (eventTimeouts[evt]) {
      eventTimeouts[evt][id] = undefined;
    }
    if (eventHandlers[evt]) {
      for (var i = 0; i < eventHandlers[evt].length; ++i) {
        eventHandlers[evt][i].apply(null, args);
      }
    }
  };
  DiabloCalc.importActive = 1;
  DiabloCalc.trigger = function(evt, id) {
    if (DiabloCalc.importActive) return;
    if (id === undefined) {
      id = null;
    }
    if (!eventTimeouts[evt]) {
      eventTimeouts[evt] = {};
    }
    if (!eventTimeouts[evt][id]) {
      var args = Array.prototype.slice.call(arguments);
      eventTimeouts[evt][id] = setTimeout(realTrigger, 0, args);
    }
  };
  DiabloCalc.triggerNow = function() {
    realTrigger(Array.prototype.slice.call(arguments));
  };
  DiabloCalc.importStart = function() {
    DiabloCalc.importActive++;
    DiabloCalc.spinStart();
  };
  DiabloCalc.importEnd = function(mode, data) {
    DiabloCalc.spinStop();
    DiabloCalc.importActive--;
    DiabloCalc.trigger("importEnd", mode, data);
  };

  var slotCache = {};
  DiabloCalc.register("updateSlotStats", function(slot) {
    slotCache[slot] = undefined;
  });
  DiabloCalc.register("updateSlotItem", function(slot) {
    slotCache[slot] = undefined;
    DiabloCalc.trigger("updateSlotStats", slot);
  });
  DiabloCalc.register("importEnd", function() {
    slotCache = {};
  });
  DiabloCalc.getSlot = function(slot) {
    if (DiabloCalc.importActive && DiabloCalc.getSlotData) {
      return DiabloCalc.getSlotData(slot);
    }
    if (slotCache[slot] === undefined && DiabloCalc.getSlotData) {
      slotCache[slot] = DiabloCalc.getSlotData(slot);
    }
    return slotCache[slot];
  };

  function isBlankProfile(data) {
    try {
      if (data.profiles.length !== 1) return false;
      var prof = data.profiles[0];
      for (var i = 0; i < prof.skills.length; ++i) {
        if (prof.skills[i]) return false;
      }
      for (var i = 0; i < prof.passives.length; ++i) {
        if (prof.passives[i]) return false;
      }
      if (prof.paragon.level) return false;
      if (!$.isEmptyObject(prof.items)) return false;
      if (prof.priority && prof.priority.length) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  var storeTimer;
  function storeProfile() {
    storeTimer = undefined;
    if (window.localStorage) {
      var profile = DiabloCalc.getAllProfiles();
      if (!isBlankProfile(profile)) {
        $(".restore-profile").remove();
        try {
          localStorage.setItem("profile", JSON.stringify(profile));
        } catch (e) {
        }
      }
    }
  }
  window.onbeforeunload = function(e) {
    if (storeTimer) {
      storeProfile();
    }
  };
  DiabloCalc.register("updateStats", function() {
    if (!storeTimer) {
      storeTimer = setTimeout(storeProfile, 10000);
    }
  });
  DiabloCalc.register("updatePriority", function() {
    if (!storeTimer) {
      storeTimer = setTimeout(storeProfile, 10000);
    }
  });
  DiabloCalc.getStorage = function(name) {
    var val;
    try {
      val = (window.localStorage ? localStorage.getItem(name) : $.cookie(name));
    } catch (e) {
      return;
    }
    if (!val) return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  };
  DiabloCalc.setStorage = function(name, obj) {
    try {
      obj = JSON.stringify(obj);
      if (window.localStorage) {
        localStorage.setItem(name, obj);
      } else {
        $.cookie(name, obj, {days: 365});
      }
    } catch (e) {
    }
  };

  var _scrollbars = [];
  DiabloCalc.addScroll = function(elem, axis) {
    /*var dir = "";
    var always = 0;
    var padding = elem.css("padding");
    elem.css("padding", 0);
    var oy = elem.css("overflow-y");
    if ((oy === "auto" || oy === "scroll") && (!axis || axis.indexOf("y") >= 0)) {
      dir += "y";
      if (oy === "scroll") always = 1;
      elem.css("overflow-y", "hidden");
    }
    var ox = elem.css("overflow-x");
    if ((ox === "auto" || ox === "scroll") && (!axis || axis.indexOf("x") >= 0)) {
      dir += "x";
      if (ox === "scroll") always = 1;
      elem.css("overflow-x", "hidden");
    }
    _scrollbars.push(elem);
    var theme = ($("body").hasClass("theme-light") ? "3d-thick-dark" : "3d-thick");
    elem.mCustomScrollbar({
      axis: dir || "y",
      theme: theme,
      scrollInertia: 0,
      alwaysShowScrollbar: (always ? 1 : 0),
      mouseWheel: {preventDefault: true},
      scrollButtons: {enable: true},
    });
    elem = elem.find(".mCSB_container");
    elem.css("padding", padding);*/
    return elem;
  };
  /*DiabloCalc.register("changeTheme", function() {
    var theme = "mCS-" + ($("body").hasClass("theme-light") ? "3d-thick-dark" : "3d-thick");
    var nontheme = "mCS-" + ($("body").hasClass("theme-light") ? "3d-thick" : "3d-thick-dark");
    for (var i = 0; i < _scrollbars.length; ++i) {
      _scrollbars[i].find("." + nontheme).each(function() {
        $(this).removeClass(nontheme).addClass(theme);
      });
    }
  });*/

  DiabloCalc.items = [];
  DiabloCalc.addItems = function(list) {
    DiabloCalc.items = DiabloCalc.items.concat(list);
  };
  DiabloCalc.skills = {};

  DiabloCalc.sourceNames = {gems: "Gems", paragon: "Paragon", dualwield: "Dual Wielding"};

  DiabloCalc.getProfile = function() {
    var data = DiabloCalc.getSkills();
    data.paragon = DiabloCalc.getParagonLevels();
    data.class = $(".char-class").val();
    data.items = {};
    for (var slot in DiabloCalc.itemSlots) {
      var item = DiabloCalc.getSlot(slot);
      if (item) {
        data.items[slot] = item;
      }
    }
    data.active = DiabloCalc.getActive("party");
    if (DiabloCalc.priority) {
      data.priority = DiabloCalc.priority.getData();
    }
    return data;
  };
  DiabloCalc.getAllProfiles = DiabloCalc.getProfile;
  DiabloCalc.setProfile = function(data, evt) {
    DiabloCalc.importStart();
    if (data.class && data.class != $(".char-class")) {
      $(".char-class").val(data.class).change().trigger("chosen:updated");
    }
    if (data.items) {
      for (var slot in DiabloCalc.itemSlots) {
        if (!data.items[slot]) {
          DiabloCalc.setSlot(slot, null);
        }
      }
      for (var slot in data.items) {
        DiabloCalc.setSlot(slot, data.items[slot]);
      }
    }
    DiabloCalc.setSkills(data);
    if (data.paragon) {
      DiabloCalc.setParagon(data.paragon);
    }
    if (data.active) {
      DiabloCalc.setActive("party", data.active);
    }/* else if (data.parent && data.parent.active) {
      DiabloCalc.setActive("party", data.parent.active);
    }*/
    if (DiabloCalc.priority && data.priority) {
      DiabloCalc.priority.setData(data.priority);
    }
    DiabloCalc.importEnd(evt, data.values);
  };
  DiabloCalc.setAllProfiles = DiabloCalc.setProfile;

  DiabloCalc.charClass = null;
  DiabloCalc.register("changeClass", function() {
    DiabloCalc.charClass = $(".char-class").val();
  });

  DiabloCalc.getItemIcon = function(id, size) {
    if (typeof id !== "string") {
      var tmp = id;
      id = DiabloCalc.gemColors[tmp[1]].id;
      if (tmp[0] < 9) {
        id += "0";
      }
      id += (tmp[0] + 1);
    }
    if (!DiabloCalc.itemById[id] && !DiabloCalc.legendaryGems[id] && !DiabloCalc.gemById[id]) {
      id = "custom";
    }
    if (DiabloCalc.itemById[id] && DiabloCalc.itemById[id].local) {
      if (DiabloCalc.itemById[id].local === true) {
        return location.protocol + "//" + location.hostname + "/external/bnet/items/" + id.toLowerCase() + ".png";
      } else {
        id = DiabloCalc.itemById[id].local;
      }
    }
    if (DiabloCalc.legendaryGems[id]) {
      if (DiabloCalc.legendaryGems[id].local === true) {
        return location.protocol + "//" + location.hostname + "/external/bnet/items/" + DiabloCalc.legendaryGems[id].id.toLowerCase() + ".png";
      } else {
        id = DiabloCalc.legendaryGems[id].id;
      }
    }
    if (location.hostname.indexOf("d3local") >= 0) {
      return location.protocol + "//" + location.hostname + "/external/bnet/local/" + id.toLowerCase() + ".png";
    } else {
      var external = "http://media.blizzard.com/d3/icons/items/" + (size || "large") + "/";
      return external + id.toLowerCase() + "_" + DiabloCalc.classes[DiabloCalc.charClass].imageSuffix + ".png";
    }
  };

  var actives = {
    global: {objects: {}, defaults: {}},
    party: {objects: {}, defaults: {}},
  };
  function arrayEqual(a, b) {
    if (a instanceof Array) {
      if (b instanceof Array) {
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; ++i) {
          if (!arrayEqual(a[i], b[i])) return false;
        }
      } else {
        return false;
      }
    } else if (typeof a === "object") {
      if (typeof b !== "object") return false;
      for (var x in a) {
        if (!arrayEqual(a[x], b[x])) return false
      }
      for (var x in b) {
        if (!a.hasOwnProperty(x)) return false;
      }
    } else {
      return a === b;
    }
    return true;
  }
  function getActiveValue(info) {
    var res = [];
    if (info.active !== undefined) res.push(info.active ? 1 : 0);
    if (info.params) {
      var p = [];
      for (var i = 0; i < info.params.length; ++i) {
        if (info.params[i]._val === undefined) {
          p.push(info.params[i].val);
        } else {
          p.push(info.params[i]._val);
        }
      }
      res.push(p);
    }
    if (info.boxvals) {
      var p = [];
      for (var i = 0; i < info.boxvals.length; ++i) {
        p.push(info.boxvals[i] ? 1 : 0);
      }
      res.push(p);
    } else if (info.boxnames) {
      var p = [];
      for (var i = 0; i < info.boxnames.length; ++i) {
        p.push(0);
      }
      res.push(p);
    }
    if (info.runevals) {
      if (info.multiple) {
        var p = {};
        for (var id in info.runevals) {
          p[id] = (info.runevals[id] ? 1 : 0);
        }
        res.push(p);
      } else {
        res.push(info.runevals);
      }
    } else if (info.runelist && (info.runelist === "*" || info.runelist.length > 1)) {
      if (info.multiple) {
        var p = {};
        for (var id in info.runes) {
          p[id] = 0;
        }
        res.push(p);
      } else {
        res.push(info.runelist === "*" ? "x" : info.runelist[0]);
      }
    }
    return res;
  }
  function setActiveValue(info, _res) {
    var res = _res.slice();
    if (info.active !== undefined && res.length) {
      info.active = !!(res.shift());
    }
    if (info.params && res.length) {
      var p = res.shift();
      if (typeof p === "object") {
        for (var i = 0; i < info.params.length && i < p.length; ++i) {
          if (info.params[i]._val === undefined) {
            info.params[i].val = p[i];
          } else {
            info.params[i]._val = p[i];
          }
        }
      }
    }
    if (info.boxvals && res.length) {
      var p = res.shift();
      if (typeof p === "object") {
        for (var i = 0; i < info.boxvals.length && i < p.length; ++i) {
          info.boxvals[i] = !!p[i];
        }
      }
    }
    if (info.runevals && res.length) {
      var p = res.shift();
      if (info.multiple) {
        if (typeof p === "object") {
          for (var id in info.runevals) {
            info.runevals[id] = !!p[id];
          }
        }
      } else if (typeof p === "string") {
        info.runevals = p;
      }
    }
  }
  function addActive(type, id, info) {
    if (info.params) {
      $.each(info.params, function(i, param) {
        if (typeof param.min === "string") {
          var min = param.min;
          Object.defineProperty(param, "min", {
            get: function() {return DiabloCalc.getStats().execString(min);},
          });
        }
        if (typeof param.max === "string") {
          var max = param.max;
          Object.defineProperty(param, "max", {
            get: function() {return DiabloCalc.getStats().execString(max);},
          });

          if (param.val === undefined) param.val = null;
          param._val = param.val;
          Object.defineProperty(param, "val", {
            get: function() {return (param._val === null ? param.max : param._val);},
            set: function(v) {param._val = (v >= param.max ? null : v);},
          });
        } else {
          if (param.val === undefined) param.val = param.max;
          if (param.inf) {
            var max = param.max;
            Object.defineProperty(param, "max", {
              get: function() {return Math.max(max, param.val * 1.33);},
            });
          }
        }
      });
    }
    if (info.boxnames) {
      info.boxvals = [];
      for (var i = 0; i < info.boxnames.length; ++i) {
        info.boxvals.push(false);
      }
    }
    if (info.runelist) {
      if (info.multiple) {
        var p = {};
        for (var id in info.runes) {
          p[id] = false;
        }
        info.runevals = p;
      } else {
        info.runevals = (info.runelist === "*" ? "x" : info.runelist[0]);
      }
    }
    var value = getActiveValue(info);
    if (value.length) {
      actives[type].objects[id] = info;
      actives[type].defaults[id] = value;
    }
  };
  DiabloCalc.getActive = function(type) {
    var gplus = false;
    if (type === "global+") {
      gplus = true;
      type = "global";
    }
    var res = {};
    $.each(actives[type].objects, function(id, data) {
      var value = getActiveValue(data);
      if (actives[type].defaults[id] !== undefined && !arrayEqual(value, actives[type].defaults[id])) {
        res[id] = value;
      }
    });
    if (type === "party") {
      for (var i = 0; i < DiabloCalc.partybuffs.length; ++i) {
        if (DiabloCalc.partybuffs[i].class) {
          res["buff" + i] = DiabloCalc.partybuffs[i].class;
        }
      }
      for (var opt in DiabloCalc.options) {
        if (DiabloCalc.optionPerProfile[opt]) {
          res[opt] = DiabloCalc.options[opt];
        }
      }
    } else {
      for (var opt in DiabloCalc.options) {
        if (!DiabloCalc.optionPerProfile[opt] || gplus) {
          res[opt] = DiabloCalc.options[opt];
        }
      }
    }
    return res;
  };
  DiabloCalc.setActive = function(type, list) {
    $.each(actives[type].objects, function(id, data) {
      if (typeof list[id] === "object") {
        setActiveValue(data, list[id]);
      } else if ((list.active && list.active[id] !== undefined) || (list.params && list.params[id])) {
        var value = [];
        if (list.active && list.active[id] !== undefined) value.push(list.active[id]);
        if (list.params && list.params[id]) value.push(list.params[id]);
        setActiveValue(data, value);
      } else if (list[id] !== undefined) {
        setActiveValue(data, [list[id]]);
      } else {
        setActiveValue(data, actives[type].defaults[id]);
      }
    });
    if (type === "party") {
      for (var i = 0; i < DiabloCalc.partybuffs.length; ++i) {
        DiabloCalc.partybuffs[i].class = list["buff" + i];
      }
      for (var opt in DiabloCalc.options) {
        if (DiabloCalc.optionPerProfile[opt]) {
          if (list[opt] !== undefined) {
            DiabloCalc.options[opt] = list[opt];
          }
        }
      }
    } else {
      for (var opt in DiabloCalc.options) {
        if (!DiabloCalc.optionPerProfile[opt]) {
          if (list[opt] !== undefined) {
            DiabloCalc.options[opt] = list[opt];
          }
        }
      }
    }
    DiabloCalc.trigger("updateStats");
    DiabloCalc.trigger("updateParams");
  };

  function exportData(obj, list, i) {
    if (i >= list.length) return obj;
    if (list[i] === "*") {
      var res = {};
      for (var key in obj) {
        var cur = exportData(obj[key], list, i + 1);
        if (cur !== undefined) {
          res[key] = cur;
        }
      }
      if (!$.isEmptyObject(res)) {
        return res;
      }
    } else {
      if (obj[list[i]] !== undefined) {
        var sub = exportData(obj[list[i]], list, i + 1);
        if (sub !== undefined) {
          var res = {};
          res[list[i]] = sub;
          return res;
        }
      }
    }
  }
  DiabloCalc.exportData = function(name) {
    return exportData(this, name.split('.'), 0);
  };

  function onDataLoaded() {
    DiabloCalc.itemById = {};
    for (var i = 0; i < DiabloCalc.items.length; ++i) {
      DiabloCalc.itemById[DiabloCalc.items[i].id] = DiabloCalc.items[i];
    }
    if (0) {
      var exportRes = {};
      var exportList = [
        "skills.*.*.name",
        "skills.*.*.tip",
        "skills.*.*.runes.*",
        "passives.*.*.name",
      ];
      for (var i = 0; i < exportList.length; ++i) {
        $.extend(true, exportRes, DiabloCalc.exportData(exportList[i]));
      }
      console.log(exportRes.toSource());
    }
    _L.patch.apply(DiabloCalc);

    var statId = 0;
    for (var cls in DiabloCalc.skills) {
      if (!DiabloCalc.classes[cls]) continue;
      for (var id in DiabloCalc.skills[cls]) {
        var skill = DiabloCalc.skills[cls][id].name;
        DiabloCalc.stats["skill_" + cls + "_" + id] = {
          name: _L("%s Damage").replace("%s", skill),
          format: _L("Increases %s Damage by %d%%").replace("%s", skill),
          cls: cls,
          skill: skill,
        };
      }
    }
    for (var stat in DiabloCalc.stats) {
      if (!DiabloCalc.stats[stat].skill) {
        statId += 10;
        DiabloCalc.stats[stat].prio = statId;
      }
      DiabloCalc.sourceNames[stat] = DiabloCalc.stats[stat].name;
      if (DiabloCalc.stats[stat].class) {
        DiabloCalc.stats[stat].classes = [DiabloCalc.stats[stat].class];
      }
      if (DiabloCalc.stats[stat].args === undefined) {
        DiabloCalc.stats[stat].args = 1;
      }
      if (!DiabloCalc.stats[stat].format) {
        var args = [];
        for (var i = 0; i < DiabloCalc.stats[stat].args; ++i) {
          args.push("%d");
        }
        DiabloCalc.stats[stat].format = "+" + args.join("-") + " " + DiabloCalc.stats[stat].name;
      }
    }
    for (var stat in DiabloCalc.stats) {
      if (DiabloCalc.stats[stat].skill) {
        DiabloCalc.stats[stat].prio = DiabloCalc.stats.skill_wizard_teleport_cooldown.prio - 5;
      }
    }
    for (var i = 0; i < DiabloCalc.statExclusiveGroups.length; ++i) {
      var group = DiabloCalc.statExclusiveGroups[i];
      $.each(DiabloCalc.extendStats([], group), function(i, stat) {
        DiabloCalc.stats[stat].group = group;
      });
    }

    for (var slot in DiabloCalc.itemSlots) {
      DiabloCalc.itemSlots[slot].types = {};
      DiabloCalc.sourceNames[slot] = DiabloCalc.itemSlots[slot].name;
    }
    for (var type in DiabloCalc.itemTypes) {
      var slot = DiabloCalc.itemTypes[type].slot;
      if (DiabloCalc.metaSlots[slot]) {
        for (var i = 0; i < DiabloCalc.metaSlots[slot].slots.length; ++i) {
          DiabloCalc.itemSlots[DiabloCalc.metaSlots[slot].slots[i]].types[type] = DiabloCalc.itemTypes[type];
        }
      } else {
        DiabloCalc.itemSlots[DiabloCalc.itemTypes[type].slot].types[type] = DiabloCalc.itemTypes[type];
      }

      if (DiabloCalc.itemTypes[type].class) {
        DiabloCalc.itemTypes[type].classes = [DiabloCalc.itemTypes[type].class];
      }

      DiabloCalc.itemTypes[type].items = [];
    }
    for (var set in DiabloCalc.itemSets) {
      DiabloCalc.itemSets[set].items = [];
      DiabloCalc.sourceNames[set] = DiabloCalc.itemSets[set].name;
    }
    DiabloCalc.items.sort(function(a, b) {
      if (a.quality != b.quality) return a.quality.localeCompare(b.quality);
      var an = a.name.toLowerCase().replace(/^(?:the|a) /, "");
      var bn = b.name.toLowerCase().replace(/^(?:the|a) /, "");
      return an.localeCompare(bn);
    });
    for (var i = 0; i < DiabloCalc.items.length; ++i) {
      if (DiabloCalc.items[i].ids) {
        for (var j = 0; j < DiabloCalc.items[i].ids.length; ++j) {
          DiabloCalc.itemById[DiabloCalc.items[i].ids[j]] = DiabloCalc.items[i];
        }
      }
      DiabloCalc.itemTypes[DiabloCalc.items[i].type].items.push(DiabloCalc.items[i]);
      DiabloCalc.sourceNames[DiabloCalc.items[i].id] = DiabloCalc.items[i].name;
      if (DiabloCalc.items[i].set) {
        var set = DiabloCalc.itemSets[DiabloCalc.items[i].set];
        set.items.push(DiabloCalc.items[i]);
        if (set.class) {
          DiabloCalc.items[i].class = set.class;
        }
        if (set.classes) {
          DiabloCalc.items[i].classes = set.classes;
        }
      }
      if (DiabloCalc.items[i].class) {
        DiabloCalc.items[i].classes = [DiabloCalc.items[i].class];
      }
    }
    for (var set in DiabloCalc.itemSets) {
      var setData = DiabloCalc.itemSets[set];
      DiabloCalc.sourceNames[set] = setData.name;
      if (setData.order) {
        setData.items.sort(function(a, b) {
          return setData.order.indexOf(a.type) - setData.order.indexOf(b.type);
        });
      }
    }
    for (var type in DiabloCalc.itemTypes) {
      var newit = {
        id: DiabloCalc.itemTypes[type].generic,
        name: "Rare " + DiabloCalc.itemTypes[type].name,
        type: type,
        quality: "rare",
      };
      if (newit.id == "custom") {
        newit.local = true;
      }
      DiabloCalc.items.push(newit);
      DiabloCalc.itemById[newit.id] = newit;
      DiabloCalc.itemTypes[type].items.unshift(newit);
    }

    DiabloCalc.gemById = {};
    for (var type in DiabloCalc.gemColors) {
      var gem = DiabloCalc.gemColors[type];
      for (var i = 0; i < DiabloCalc.gemQualities.length; ++i) {
        DiabloCalc.gemById[gem.id + (i < 9 ? "0" : "") + (i + 1)] = [i, type];
      }
    }
    for (var type in DiabloCalc.legendaryGems) {
      var leg = DiabloCalc.legendaryGems[type];
      DiabloCalc.gemById[leg.id] = [type, 0];
      DiabloCalc.sourceNames[type] = leg.name;
      if (leg.ids) {
        for (var i = 0; i < leg.ids.length; ++i) {
          DiabloCalc.gemById[leg.ids[i]] = [type, 0];
        }
      }
      for (var i = 0; i < leg.effects.length; ++i) {
        leg.effects[i].args = (leg.effects[i].value || []).length;
      }
    }

    DiabloCalc.skillById = {};
    for (var cls in DiabloCalc.skills) {
      var dst = {};
      var src = DiabloCalc.skills[cls];
      for (var skill in src) {
        dst[src[skill].id] = skill;
      }
      src = DiabloCalc.passives[cls];
      for (var skill in src) {
        dst[src[skill].id] = skill;
      }
      DiabloCalc.skillById[cls] = dst;
    }

    DiabloCalc.getSlotId = function() {};
    DiabloCalc.setSlot = function() {};
    DiabloCalc.getParagon = function() {};

    for (var id in DiabloCalc.legendaryGems) {
      addActive("global", id, DiabloCalc.legendaryGems[id]);
    }
    for (var id in DiabloCalc.itemaffixes) {
      addActive("global", id, DiabloCalc.itemaffixes[id]);
    }
    DiabloCalc.allSkills = {};
    for (var cls in DiabloCalc.skills) {
      for (var id in DiabloCalc.skills[cls]) {
        DiabloCalc.allSkills[id] = DiabloCalc.skills[cls][id];
        DiabloCalc.sourceNames[id] = DiabloCalc.skills[cls][id].name;
        addActive("global", id, DiabloCalc.skills[cls][id]);
      }
    }
    DiabloCalc.allPassives = {};
    for (var cls in DiabloCalc.passives) {
      for (var id in DiabloCalc.passives[cls]) {
        DiabloCalc.allPassives[id] = DiabloCalc.passives[cls][id];
        DiabloCalc.sourceNames[id] = DiabloCalc.passives[cls][id].name;
        addActive("global", id, DiabloCalc.passives[cls][id]);
      }
    }
    function addStats(dst, src) {
      for (var x in src) {
        if (typeof src[x] === "object") {
          dst[x] = src[x];
        } else if (DiabloCalc.stats[x] && DiabloCalc.stats[x].dr) {
          dst[x] = 100 * (1 - (1 - 0.01 * (dst[x] || 0)) * (1 - 0.01 * (src[x])));
        } else {
          dst[x] = (dst[x] || 0) + src[x];
        }
      }
    }
    for (var cls in DiabloCalc.classes) {
      if (!DiabloCalc.partybuffs[cls]) continue;

      $.each(DiabloCalc.partybuffs[cls], function(id, info) {
        var src = (DiabloCalc.skills[cls][id] || DiabloCalc.passives[cls][id]);
        if (!info.addpassive) {
          info.active = false;
        }
        info.charClass = cls;
        info.id = id;

        if (info.runelist) {
          info.type = "skill";
          info.runes = {};
          if (info.runelist === "*") {
            info.runes = $.extend({x: "No Rune"}, src.runes);
          } else {
            for (var i = 0; i < info.runelist.length; ++i) {
              info.runes[info.runelist[i]] = (info.runelist[i] === "x" ? "No Rune" : src.runes[info.runelist[i]]);
            }
          }

          if (!info.buffs || typeof info.buffs !== "function") {
            var buffs = (info.buffs || src.buffs);
            var passive = (info.passive || src.passive);
            var activebox = 0;
            var passivebox = -1;
            if (buffs && passive) {
              if (info.addpassive) {
                info.boxnames = ["Passive", "Active"];
                activebox = 1;
                passivebox = 0;
              } else {
                info.boxnames = ["Activated"];
              }
            } else {
              passive = (buffs || passive);
              buffs = undefined;
            }
            var passive_func = passive;
            var buffs_func = buffs;
            if (typeof passive === "object") {
              passive_func = function(rune, stats) {return passive[rune];};
            }
            if (typeof buffs === "object") {
              buffs_func = function(rune, stats) {return buffs[rune];};
            }

            info.buffs = function(stats) {
              var res = {};
              if (this.multiple) {
                for (var rune in this.runes) {
                  if (this.runevals[rune]) {
                    if (passivebox < 0 || !this.boxvals || this.boxvals[passivebox]) {
                      addStats(res, passive_func.call(this, rune, stats));
                    }
                    if (buffs && this.boxvals && this.boxvals[activebox]) {
                      addStats(res, buffs_func.call(this, rune, stats));
                    }
                  }
                }
              } else {
                var rune = (this.runevals || this.runelist);
                if (passivebox < 0 || !this.boxvals || this.boxvals[passivebox]) {
                  addStats(res, passive_func.call(this, rune, stats));
                }
                if (buffs && this.boxvals && this.boxvals[activebox]) {
                  addStats(res, buffs_func.call(this, rune, stats));
                }
              }
              return res;
            };
          } else if (!info.multiple) {
            var buffs = info.buffs;
            info.buffs = function(stats) {
              var rune = (this.runevals || this.runelist);
              return buffs.call(this, rune, stats);
            };
          }
        } else {
          info.type = "passive";
          if (!info.buffs || typeof info.buffs !== "function") {
            var buffs = (info.buffs || src.buffs);
            if (typeof buffs === "function") {
              info.buffs = buffs;
            } else {
              info.buffs = function() {return buffs;};
            }
          }
        }
      });
    }
    for (var id in DiabloCalc.itemById) {
      if (DiabloCalc.itemById[id].required && DiabloCalc.itemById[id].required.custom) {
        var custom = DiabloCalc.itemById[id].required.custom;
        if (DiabloCalc.partybuffs.items[custom.id]) {
          DiabloCalc.partybuffs.items[custom.id].item = id;
          if (custom.args !== 0) {
            DiabloCalc.partybuffs.items[custom.id].params = [
              {min: custom.min, max: custom.max, name: "Amount"},
            ];
          }
        }
      }
    }
    var orig = DiabloCalc.partybuffs.items;
    DiabloCalc.partybuffs.items = {};
    $.each(orig, function(id, info) {
      info.active = false;
      info.id = id;
      if (DiabloCalc.legendaryGems[id]) {
        info.type = "gem";
        DiabloCalc.partybuffs.items[id] = info;
        addActive("party", "buff_" + id, info);
      } else if (info.item) {
        info.type = "affix";
        if (info.stat) {
          info.buffs = function() {
            var res = {};
            res[this.stat] = this.params[0].val;
            return res;
          };
        } else {
          if (typeof DiabloCalc.itemaffixes[id].buffs === "function") {
            info.buffs = DiabloCalc.itemaffixes[id].buffs;
          } else {
            info.buffs = function() {return DiabloCalc.itemaffixes[id].buffs;};
          }
        }
        DiabloCalc.partybuffs.items[info.item] = info;
      }
    });

    DiabloCalc._partybuffs = DiabloCalc.partybuffs;
    DiabloCalc.partybuffs = [];
    for (var i = 0; i < 3; ++i) {
      DiabloCalc.partybuffs.push($.extend(true, {}, DiabloCalc._partybuffs));
      for (var cls in DiabloCalc.partybuffs[i]) {
        $.each(DiabloCalc.partybuffs[i][cls], function(id, info) {
          addActive("party", "buff" + i + "_" + id, info);
        });
      }
    }
    DiabloCalc.followerbuffs = DiabloCalc._partybuffs.followers;
    $.each(DiabloCalc.followerbuffs, function(id, info) {
      info.active = false;
      info.id = id;
      info.type = "custom";
      DiabloCalc.sourceNames[id] = info.name;
      addActive("party", id, info);
    });
    DiabloCalc.shrinebuffs = DiabloCalc._partybuffs.shrines;
    $.each(DiabloCalc.shrinebuffs, function(id, info) {
      info.active = false;
      info.id = id;
      info.type = "custom";
      DiabloCalc.sourceNames[id] = info.name;
      addActive("party", id, info);
    });

/*    var mega = {};
    for (var lvl = 0; lvl < DiabloCalc.gemQualities.length; ++lvl) {
      var type = "gem" + lvl;
      var suffix = (lvl < 9 ? "0" : "") + (lvl + 1);
      mega[type] = [];
      for (var id in DiabloCalc.gemColors) {
        mega[type].push(DiabloCalc.gemColors[id].id + suffix);
      }
    }
    mega.gemleg = [];
    for (var id in DiabloCalc.legendaryGems) {
      mega.gemleg.push(DiabloCalc.legendaryGems[id].id);
    }
    for (var type in DiabloCalc.itemTypes) {
      mega[type] = [];
      for (var i = 0; i < DiabloCalc.itemTypes[type].items.length; ++i) {
        var item = DiabloCalc.itemTypes[type].items[i];
        var cls = (item.class || (item.set && DiabloCalc.itemSets[item.set].tclass));
        if (cls) {
          cls += (item.id == "Unique_Chest_Set_02_p2" ? "_female" : "_male");
          mega[type].push([item.id, item.id + "_" + cls]);
        } else {
          mega[type].push(item.id);
        }
      }
    }
    $.ajax({
      url: "writer",
      data: JSON.stringify(mega, null, 2),
      type: "POST",
      processData: false,
      contentType: "application/json",
      dataType: "json",
    });*/

    afterLoad();
  }
  DiabloCalc.loadData = function(handler) {
    afterLoad = handler;
    $.getScripts(["locale"], function() {
      $.getScripts(["data"], onDataLoaded);
    });
  };
})();
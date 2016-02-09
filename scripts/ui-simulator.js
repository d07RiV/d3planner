(function() {
  var _L = DiabloCalc.locale("ui-simulator.js");

  var DC = DiabloCalc;
  var tab = $("#tab-simulator");
  //var Sections = $("<div></div>");
  //tab.append(Sections);
  var Sections = tab;

  function isItemUsable(item) {
    if (item.classes && item.classes.indexOf(DC.charClass) < 0) return false;
    var type = DC.itemTypes[item.type];
    if (type.classes && type.classes.indexOf(DC.charClass) < 0) return false;
    return true;
  }
  function maxSetPieces(set) {
    set = DC.itemSets[set];
    if (set.tclass && set.tclass !== DC.charClass) return 0;
    if (set.classes && set.classes.indexOf(DC.charClass) < 0) return 0;
    var count = 0;
    for (var i = 0; i < set.items.length; ++i) {
      if (isItemUsable(set.items[i])) {
        ++count;
      }
    }
    return count;
  }

  function fillBoxBuffs(box, dummy) {
    var value = box.val();
    box.children().detach().remove();
    var setCache = {};
    var catName, cat;
    var stats = DC.getStats();
    $.each(DC.simMapping.buffs, function(id, opts) {
      if (opts.classes && opts.classes.indexOf(DC.charClass) < 0) return;
      if (DC.options.filterBuffs && id !== value) {
        var total = 0, good = 0;
        if (opts.skill) {
          ++total;
          if (stats.skills[opts.skill[0]] && (opts.skill.length < 2 || opts.skill[1].indexOf(stats.skills[opts.skill[0]]) >= 0)) ++good;
        }
        if (opts.passive) {
          ++total;
          if (stats.passives[opts.passive]) ++good;
        }
        if (opts.gem) {
          ++total;
          if (stats.gems[opts.gem[0]] !== undefined && (opts.gem.length < 2 || stats.gems[opts.gem[0]] >= opts.gem[1])) ++good;
        }
        if (opts.set) {
          ++total;
          if (stats["set_" + opts.set[0] + "_" + opts.set[1] + "pc"]) ++good;
        }
        if (opts.stat) {
          ++total;
          if (opts.stat instanceof Array) {
            for (var i = 0; i < opts.stat.length; ++i) {
              if (stats[opts.stat[i]]) {
                ++good;
                break;
              }
            }
          } else {
            if (stats[opts.stat]) ++good;
          }
        }
        if (total && good < (opts.min || 1)) return;
      }
      if (opts.set) {
        if (setCache[opts.set[0]] === undefined) {
          setCache[opts.set[0]] = maxSetPieces(opts.set[0]);
        }
        if (setCache[opts.set[0]] < opts.set[1]) return;
      }
      if (opts.category !== catName) {
        catName = opts.category;
        cat = $("<optgroup label=\"" + catName + "\"></optgroup>");
        box.append(cat);
      }
      if (!value) value = id;
      if (dummy) return false;
      cat.append("<option value=\"" + id + (id === value ? "\" selected=\"selected" : "") + "\">" + opts.name + "</option>");
    });
    return value;
  }
  function buffTips(id) {
    var opts = DC.simMapping.buffs[id];
    if (!opts) return;
    if (opts.skill) {
      DiabloCalc.tooltip.showSkill(this, DC.charClass, opts.skill[0], opts.skill[1]);
    } else if (opts.passive) {
      DiabloCalc.tooltip.showSkill(this, DC.charClass, opts.passive);
    } else if (opts.gem) {
      DiabloCalc.tooltip.showGem(this, opts.gem[0], DC.getStats().gems[opts.gem[0]]);
    } else if (opts.set) {
      var stat = "set_" + opts.set[0] + "_" + opts.set[1] + "pc";
      var affix = DC.getStats().affixes[stat];
      if (affix && affix.slot) {
        DiabloCalc.tooltip.showItem(this, affix.slot);
      } else {
        var id = DiabloCalc.itemSets[opts.set[0]].items[0].id;
        DiabloCalc.tooltip.showItem(this, id);
      }
    }
  }

  function createBuffBox(parent, value) {
    var box = $("<select class=\"arg-buff\"></select>");
    if (!value || !DC.simMapping.buffs[value]) {
      value = fillBoxBuffs(box, true);
    }
    if (value && DC.simMapping.buffs[value]) {
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.simMapping.buffs[value].name + "</option>");
    }
    //fillBoxBuffs(box);
    parent.append(box);
    if (DC.noChosen) {
      fillBoxBuffs(box);
    } else {
      box.chosen({
        width: "200px",
        disable_search_threshold: 10,
        inherit_select_classes: true,
        search_contains: true,
        placeholder_text_single: _L("Choose Buff"),
        populate_func: function() {fillBoxBuffs(box);},
      });
      DC.chosenTips(box, buffTips);
    }
    DC.addTip(box, function() {
      if (DC.simMapping.buffs[this.val()]) {
        return DC.simMapping.buffs[this.val()].name;
      }
    });
    box.setval = function(value) {
      if (DC.noChosen) {
        box.val(value);
      } else {
        box.empty();
        if (value && DC.simMapping.buffs[value]) {
          box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.simMapping.buffs[value].name + "</option>");
        }
        box.trigger("chosen:updated");
      }
      return this;
    };
    return box;
  }

  function addIcons(elem, callback) {
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
  }
  function skillList() {
    var list = {};
    if (DC.options.filterBuffs) {
      var skills = DC.getSkills().skills;
      for (var i = 0; i < skills.length; ++i) {
        if (skills[i] && DC.skills[DC.charClass][skills[i][0]]) {
          list[skills[i][0]] = DC.skills[DC.charClass][skills[i][0]];
        }
      }
    } else {
      $.extend(list, DC.skills[DC.charClass]);
    }
    if (DC.extraskills && DC.extraskills[DC.charClass]) {
      var stats = DC.getStats();
      $.each(DC.extraskills[DC.charClass], function(id, skill) {
        if (DC.options.filterBuffs) {
          if (skill.required && !skill.required.call(skill, stats)) return;
        }
        skill.category = DC.skills[DC.charClass][skill.skill].name;
        list[id] = skill;
      });
    }
    return list;
  }
  function fillBoxSkills(box, dummy) {
    var value = box.val();
    box.children().detach().remove();
    var skills = skillList();
    if (DC.skills[DC.charClass][value] && !skills[value]) {
      skills[value] = DC.skills[DC.charClass][value];
    }
    var catName, cat = box;
    $.each(skills, function(id, skill) {
      if (!DC.options.filterBuffs && skill.category !== catName) {
        catName = skill.category;
        cat = $("<optgroup label=\"" + (DC.skillcat[DC.charClass][catName] || catName) + "\"></optgroup>");
        box.append(cat);
      }
      if (!value) value = id;
      if (dummy) return false;
      cat.append("<option value=\"" + id + (id === value ? "\" selected=\"selected" : "") + "\">" + skill.name + "</option>");
    });
    return value;
  }
  function makeSkillIcon(id, cls) {
    cls = (cls || DC.charClass);
    var skill = DC.skills[cls][id];
    if (!skill) skill = (DC.extraskills && DC.extraskills[cls] && DC.extraskills[cls][id]);
    if (!skill) return;
    return "<span style=\"background: url(css/images/class-" + cls + ".png) " +
      (-24 * skill.col) + "px " + (-48 * skill.row) + "px / 120px no-repeat\"></span>";
  }
  function skillTips(id) {
    var skill = DC.skills[DC.charClass][id];
    if (!skill) skill = (DC.extraskills && DC.extraskills[DC.charClass] && DC.extraskills[DC.charClass][id]);
    if (!skill) return;
    DiabloCalc.tooltip.showSkill(this, DC.charClass, id);
  }
  function createSkillBox(parent, value) {
    var box = $("<select class=\"arg-skill\"></select>");
    var extras = (DC.extraskills && DC.extraskills[DC.charClass]) || {};
    if (!value || (!DC.skills[DC.charClass][value] && !extras[value])) value = fillBoxSkills(box, true);
    if (value && (!DC.skills[DC.charClass][value] && !extras[value])) value = undefined;
    if (value && (DC.skills[DC.charClass][value] || extras[value])) {
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + (DC.skills[DC.charClass][value] || extras[value]).name + "</option>");
    } else {
      box.prop("disabled", true);
    }
    parent.append(box);
    if (DC.noChosen) {
      fillBoxSkills(box);
    } else {
      box.chosen({
        width: "200px",
        disable_search_threshold: 10,
        inherit_select_classes: true,
        search_contains: true,
        placeholder_text_single: _L("Choose Skill"),
        populate_func: function() {fillBoxSkills(box);},
      });
      DC.chosenTips(box, skillTips);
      addIcons(box, makeSkillIcon);
    }
    var orig = box;
    if (!DC.noChosen) orig = orig.next();
    orig.hover(function() {
      if (DC.tooltip && box.val()) {
        var rune = DC.getStats().skills[box.val()];
        DC.tooltip.showSkill(this, DC.charClass, box.val(), rune);
      }
    }, function() {
      if (DC.tooltip) DC.tooltip.hide();
    });
    box.setval = function(value) {
      if (DC.noChosen) {
        box.val(value);
      } else {
        box.empty();
        var extras = (DC.extraskills && DC.extraskills[DC.charClass]) || {};
        if (value && (DC.skills[DC.charClass][value] || extras[value])) {
          box.removeAttr("disabled");
          box.append("<option value=\"" + value + "\" selected=\"selected\">" + (DC.skills[DC.charClass][value] || extras[value]).name + "</option>");
        }
        box.trigger("chosen:updated");
      }
      return this;
    };
    return box;
  }
  function updateSkillBox(box) {
    var value = box.val();
    var extras = (DC.extraskills && DC.extraskills[DC.charClass]) || {};
    if (!value || (!DC.skills[DC.charClass][value] && !extras[value])) value = fillBoxSkills(box, true);
    if (value && !DC.skills[DC.charClass][value] && !extras[value]) value = undefined;
    box.empty();
    if (value && (DC.skills[DC.charClass][value] || extras[value])) {
      box.removeAttr("disabled");
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + (DC.skills[DC.charClass][value] || extras[value]).name + "</option>");
    } else {
      box.prop("disabled", true);
    }
    if (DC.noChosen) {
      fillBoxSkills(box);
    } else {
      box.trigger("chosen:updated").change();
    }
  }

  function fillBoxRes(box) {
    var value = box.val();
    box.children().detach().remove();
    $.each(DC.classes[DC.charClass].resources, function(index, id) {
      box.append("<option value=\"" + id + (id === value ? "\" selected=\"selected" : "") + "\">" + DC.resources[id] + "</option>");
    });
  }
  function createResBox(parent, value) {
    if (!value || DC.classes[DC.charClass].resources.indexOf(value) < 0) {
      value = DC.classes[DC.charClass].resources[0];
    }
    var box = $("<select class=\"arg-resource\"></select>");
    if (value && DC.resources[value]) {
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.resources[value] + "</option>");
    }
    parent.append(box);
    if (DC.noChosen) {
      fillBoxRes(box);
    } else {
      box.chosen({
        width: "200px",
        disable_search_threshold: 10,
        inherit_select_classes: true,
        search_contains: true,
        placeholder_text_single: _L("Choose Resource"),
        populate_func: function() {fillBoxRes(box);},
      });
    }
    box.setval = function(value) {
      if (DC.noChosen) {
        box.val(value);
      } else {
        box.empty();
        if (value && DC.resources[value]) {
          box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.resources[value] + "</option>");
        }
        box.trigger("chosen:updated");
      }
      return this;
    };
    return box;
  }

  var boxOps = {
    opts: {eq: "=", ne: "&#x2260;", lt: "<", le: "&#x2264;", gt: ">", ge: "&#x2265;"},
    class: "arg-op",
  };
  var boxType = {
    opts: DC.simMapping.opts,
    width: "150px",
    class: "arg-type",
  };
  var typeMap = {
    buff: "buff",
    buffmin: "buff",
    buffmax: "buff",
    ticks: "buff",
    resource: "resource",
    resourcepct: "resource",
    cooldown: "skill",
    charges: "skill",
    interval: "skill",
    health: "none",
    any: "sub",
    all: "sub",
    count: "subcount",
  };

  function createBox(parent, type, value) {
    var html = "";
    for (var id in type.opts) {
      html += "<option value=\"" + id + (value === id ? "\" selected=\"selected" : "") + "\">" + type.opts[id] + "</option>";
    }
    var box = $("<select class=\"" + type.class + "\">" + html + "</select>");
    parent.append(box);
    box.chosen({
      //width: type.width,
      disable_search: true,
      inherit_select_classes: true,
    });
    box.setval = function(val) {
      box.val(val);
      box.trigger("chosen:updated");
      return this;
    };
    return box;
  }

  function Condition(parent) {
    this.parent = parent;
    this.box = $("<li class=\"sim-condition\"></li>");
    this.box.data("condition", this);
    this.line = $("<div class=\"header chosen-noframe\"></div>");
    this.remove = $("<span class=\"btn-remove\"></span>");
    parent.list.append(this.box.append(this.line.append(this.remove)));
    this.type = createBox(this.line, boxType);
    var self = this;
    this.type.change(function() {
      self.onChangeType();
      if (self.lhs) {
        setTimeout(function() {self.lhs.trigger("chosen:open");}, 0);
      }
    });
    this.remove.click(function() {
      self.box.remove();
    });
    this.vardiv = $("<div class=\"arg-params\"></div>");
    this.line.append(this.vardiv);
    this.onChangeType();
  }
  Condition.prototype.onChangeType = function() {
    var tv = typeMap[this.type.val()];
    if (this.typeval !== tv) {
      var theop;
      if (this.op) {
        theop = this.op.val();
        if (!DC.noChosen) this.op.next().remove();
        this.op.remove();
        delete this.op;
      }
      this.vardiv.children().detach();
      this.typeval = tv;
      if (this.lhs) this.lhs.remove();
      switch (tv) {
      case "buff":
        this.lhs = createBuffBox(this.vardiv);
        this.vardiv.append("<span class=\"arg-ph\"></span>");
        break;
      case "skill":
        this.lhs = createSkillBox(this.vardiv);
        this.vardiv.append("<span class=\"arg-ph\"></span>");
        break;
      case "resource":
        this.lhs = createResBox(this.vardiv);
        this.vardiv.append("<span class=\"arg-ph\"></span>");
        break;
      }
      if (tv !== "sub") {
        this.op = createBox(this.vardiv, boxOps, theop);
        if (this.rhs) {
          this.vardiv.append(this.rhs);
        } else {
          this.rhs = $("<input class=\"arg-rhs\" type=\"number\" step=\"any\"></input>");
          this.vardiv.append(this.rhs);
        }
      } else {
        if (this.op) this.op.remove();
        if (this.rhs) this.rhs.remove();
      }
      if (tv === "sub" || tv === "subcount") {
        if (!this.clist) {
          this.clist = new ConditionList(this.box);
        }
      } else {
        if (this.clist) {
          this.clist.list.remove();
          delete this.clist;
        }
      }
    }
  };

  function ConditionList(parent) {
    this.list = $("<ul class=\"sim-condition-list\"></ul>");
    this.add = $("<div class=\"btn-add\">" + _L("Add condition") + "</div>");
    parent.append(this.list, this.add);
    var self = this;
    this.add.click(function() {
      var cnd = new Condition(self);
      setTimeout(function() {cnd.type.trigger("chosen:open");}, 0);
    });
    this.list.sortable({
      handle: ".header",
      distance: 4,
      //containment: tab,
      placeholder: "drop-ph",
      forcePlaceholderSize: true,
      connectWith: ".sim-condition-list",
      start: function() {
        self.list.find("select").trigger("chosen:close");
      },
      end: function() {
        DC.trigger("updatePriority");
      },
    });
  }

  function PriorityLine(parent) {
    this.parent = parent;
    this.box = $("<li class=\"sim-priority-line\"></li>");
    this.box.data("priority", this);
    this.line = $("<div class=\"header prio-header\"></div>");
    this.remove = $("<span class=\"btn-remove\"></span>");
    parent.list.append(this.box.append(this.line.append(this.remove)));
    this.skill = createSkillBox(this.line);
    var self = this;
    if (!DC.noChosen) {
      this.icon = $("<span class=\"drop-skill-icon\"></span>");
      this.skill.next().find("span").before(this.icon);
      this.skill.change(function() {
        var id = $(this).val();
        var skill = DC.skills[DC.charClass][id];
        if (!skill) skill = (DC.extraskills && DC.extraskills[DC.charClass] && DC.extraskills[DC.charClass][id]);
        if (skill) {
          self.icon.css("background", "url(css/images/class-" + DC.charClass + ".png) " +
            (-24 * skill.col) + "px " + (-48 * skill.row) + "px / 120px no-repeat");
          self.icon.show();
        } else {
          self.icon.hide();
        }
      }).change();
    }
    this.conditions = new ConditionList(this.box);
    this.remove.click(function() {
      self.box.remove();
    });
  }

  function PriorityList(parent) {
    this.box = $("<div class=\"sim-priority\"></div>");
    this.list = $("<ul class=\"sim-priority-list\"></ul>");
    this.add = $("<div class=\"btn-add\">" + _L("Add skill") + "</div>");
    this.box.append(this.list, this.add);
    parent.append(this.box);
    var self = this;
    this.add.click(function() {
      var pri = new PriorityLine(self);
      setTimeout(function() {pri.skill.trigger("chosen:open");}, 0);
    });
    this.list.sortable({
      handle: ".prio-header",
      distance: 4,
      //containment: tab,
      axis: "y",
      placeholder: "drop-ph",
      forcePlaceholderSize: true,
      start: function() {
        self.list.find("select").trigger("chosen:close");
      },
      end: function() {
        DC.trigger("updatePriority");
      },
    });
    this.box.on("click", ".btn-remove, .btn-add", function() {
      DC.trigger("updatePriority");
    });
    this.box.on("change", function() {
      DC.trigger("updatePriority");
    });

    DC.register("updateSkills", function() {
      self.list.find("select.arg-skill").each(function() {
        updateSkillBox($(this));
      });
    });
  }

  Condition.prototype.getData = function() {
    var data = {type: this.type.val()};
    if (this.lhs) data.lhs = this.lhs.val();
    if (this.op) data.op = this.op.val();
    if (this.rhs) data.rhs = parseFloat(this.rhs.val());
    if (this.clist) data.sub = this.clist.getData();
    return data;
  };
  ConditionList.prototype.getData = function() {
    var data = [];
    this.list.children("li").each(function() {
      var item = $(this).data("condition");
      if (item) data.push(item.getData());
    });
    return data;
  };
  PriorityLine.prototype.getData = function() {
    return {
      skill: this.skill.val(),
      conditions: this.conditions.getData(),
    };
  };
  PriorityList.prototype.getData = function() {
    var data = [];
    this.list.children("li").each(function() {
      var item = $(this).data("priority");
      if (item) data.push(item.getData());
    });
    return data;
  };

  Condition.prototype.setData = function(data) {
    this.type.val(data.type);
    this.type.trigger("chosen:updated");
    this.onChangeType();
    if (this.lhs) this.lhs.setval(data.lhs);
    if (this.op) this.op.setval(data.op);
    if (this.rhs) this.rhs.val(data.rhs);
    if (this.clist) {
      this.clist.setData(data.sub);
    }
  };
  ConditionList.prototype.setData = function(data) {
    this.list.empty();
    this.items = [];
    for (var i = 0; i < data.length; ++i) {
      var cnd = new Condition(this);
      cnd.setData(data[i]);
      this.items.push(cnd);
    }
  };
  PriorityLine.prototype.setData = function(data) {
    this.skill.setval(data.skill).change();
    this.conditions.setData(data.conditions);
  };
  PriorityList.prototype.setData = function(data) {
    this.list.empty();
    this.items = [];
    if (data) {
      var extras = (DC.extraskills && DC.extraskills[DC.charClass]) || {};
      for (var i = 0; i < data.length; ++i) {
        if (!DC.skills[DC.charClass][data[i].skill] && !extras[data[i].skill]) continue;
        var pri = new PriorityLine(this);
        pri.setData(data[i]);
        this.items.push(pri);
      }
    }
  };

  var Section = $("<div></div>");
  Sections.append("<h3>" + _L("Skill Priority") + "</h3>", Section);
  
  Section.append("<p><i>" + _L("The priority list is evaluated from top to bottom to determine the next skill to use. " +
    "Skill availability checks (cooldown and resources) are implicit.") + "</i></p>");

  var filterBuffs = $("<input></input>").attr("type", "checkbox").prop("checked", true).click(function() {
    DC.trigger("updateSkills");
  });
  DC.addOption("filterBuffs", function() {return filterBuffs.prop("checked");}, function(x) {
    filterBuffs.prop("checked", x);
    DC.trigger("updateSkills");
  });
  Section.append($("<label></label>").addClass("option-box").append(filterBuffs).append(_L("Only show applicable buffs/skills.")));
  DC.addTip(filterBuffs, _L("Only show buffs that can be activated with current skills and equipment."));

  DC.priority = new PriorityList(Section);

  function SavePrio(name, id) {
    var data = {
      name: name,
      class: DC.charClass,
      data: DC.priority.getData(),
    };
    if (id) data.id = id;
    $.ajax({
      url: "priority",
      data: JSON.stringify(data),
      type: "POST",
      processData: false,
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
        if (response.id) {
          ErrorBox.slideUp();
          UpdatePriorities();
        } else if (response.errors && response.errors.length) {
          ErrorBox.val(response.errors[0]);
          ErrorBox.slideDown();
        } else {
          ErrorBox.val(_L("Failed to save priority list."));
          ErrorBox.slideDown();
        }
      },
      error: function(e) {
        ErrorBox.text(_L("Failed to save priority list."));
        ErrorBox.slideDown();
      },
    });
  }

  function DoLoadPrio(id) {
    $.ajax({
      url: "priority",
      data: {load: id},
      type: "GET",
      dataType: "json",
      success: function(data) {
        if (data instanceof Array) {
          DC.priority.setData(data);
        }
      },
      error: function(e) {
      },
    });
  }
  function LoadPrio(evt, id) {
    if (evt && DC.priority.getData().length) {
      DiabloCalc.popupMenu(evt, _L.fixkey({
        "Discard current list?": function() {
          DoLoadPrio(id);
        },
      }));
    } else {
      DoLoadPrio(id);
    }
  }

  var MyPrio = new DC.SearchResults("priority", function(data, item) {
    var id = item.id;
    var li = $("<li></li>");
    li.append("<span class=\"class-icon class-" + item.class + "\">&nbsp;</span>");
    li.click(function(evt) {
      LoadPrio(evt, id);
    });
    li.append("<span class=\"profile-name" + (item.value ? "" : " unnamed") + "\">" + (item.value || _L("Unnamed list")) + "</span>");
    if (parseInt(item.user)) {
      li.append($("<span class=\"profile-overwrite\" title=\"" + _L("Update list") + "\"></span>").click(function(evt) {
        evt.stopPropagation();
        DC.popupMenu(evt, _L.fixkey({
          "Confirm overwrite": function() {
            SavePrio("", id);
          },
        }));
      }));
      li.append($("<span class=\"profile-delete\" title=\"" + _L("Delete list") + "\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, _L.fixkey({
          "Confirm delete?": function() {
            $.ajax({
              url: "priority",
              data: {delete: id},
              type: "GET",
              dataType: "json",
              success: function(response) {
                if (response.code === "OK") {
                  ErrorBox.slideUp();
                  UpdatePriorities();
                } else if (response.errors && response.errors.length) {
                  ErrorBox.val(response.errors[0]);
                  ErrorBox.slideDown();
                } else {
                  ErrorBox.val(_L("Failed to delete list."));
                  ErrorBox.slideDown();
                }
              },
              error: function(e) {
                ErrorBox.val(_L("Failed to delete list."));
                ErrorBox.slideDown();
              },
            });
          },
        }));
      }));
      li.append("<span class=\"date-saved\"><span>" + (new Date(1000 * item.date)).toLocaleString() + "</span></span>");
    }
    return li;
  }, _L("No preset lists found."));
  var PrioSave = $("<div class=\"prio-save\"><div><input></input></div></div>");
  var PrioBtn = $("<input type=\"button\" value=\"" + _L("Save") + "\" disabled=\"disabled\"></input>").click(function() {
    var name = PrioSave.find("div input").val();
    if (!name) return;
    SavePrio(name);
  });
  PrioSave.on("input", "div input", function() {
    PrioBtn.prop("disabled", !$(this).val());
  });
  var ErrorBox = $("<div></div>");

  function UpdatePriorities() {
    PrioSave.toggle(!!DC.account.userName());
    MyPrio.search({class: DC.charClass});
  }

  Section.append(DC.account.makeLine(_L(" to save skill priorities"), function(okay) {
    UpdatePriorities();
    this.toggle(!okay);
  }));
  Section.append(PrioSave.append(PrioBtn), ErrorBox);
  Section.append(MyPrio.div.css("margin-top", 6));

  ///////////////////////////////////////////////////

  Sections.append("<h3>" + _L("Simulate") + "</h3>");
  Section = $("<div></div>");
  Sections.append(Section);

  //if (location.hostname.toLowerCase().indexOf("ptr") >= 0) {
  //  Section.append("<div><p><b>" + _L("The simulator has not been updated for PTR yet!") + "</b></p></div>");
  //}

  var targetType = $("<select></select>");
  targetType.append("<option value=\"\">" + _L("Generic") + "</option>");
  targetType.append("<option value=\"demons\">" + _L("Demon") + "</option>");
  targetType.append("<option value=\"beasts\">" + _L("Beast") + "</option>");
  targetType.append("<option value=\"humans\">" + _L("Human") + "</option>");
  targetType.append("<option value=\"undead\">" + _L("Undead") + "</option>");
  targetType.change(function() {
    DC.options.targetType = $(this).val();
  });
  //var targetBoss = $("<input type=\"checkbox\"></input>").change(function() {
  //  DC.options.targetBoss = this.checked;
  //});
  //var bossLabel = $("<label style=\"margin-left: 8px\">" + _L("Boss") + "</label>").prepend(targetBoss);
  //var showElites = $("<input></input>").attr("type", "checkbox").change(function() {
  //  DC.options.showElites = this.checked;
  //});
  DC.register("updateStats", function() {
//    showElites.prop("checked", DC.options.showElites);
//    targetBoss.prop("checked", DC.options.targetBoss);
//    bossLabel.toggle(!!DC.options.showElites);
    targetType.val(DC.options.targetType);
    targetType.trigger("chosen:updated");
  });
  Section.append($("<span class=\"option-box\">" + _L("Target: ") + "</span>").append(targetType/*,
    $("<label style=\"margin-left: 8px\">" + _L("Elite") + "</label>").prepend(showElites), bossLabel*/));

  var statusBox = $("<select class=\"target-status\" multiple=\"multiple\"></select>");
  for (var id in DC.simMapping.status) {
    statusBox.append("<option value=\"" + id + "\">" + DC.simMapping.status[id] + "</option>");
  }
  Section.append(statusBox);
  statusBox.chosen({
    inherit_select_classes: true,
    placeholder_text_multiple: _L("Target status debuffs (from group)"),
  });
  DC.addOption("targetStatus", function() {return statusBox.val();}, function(x) {
    statusBox.val(x);
    statusBox.trigger("chosen:updated");
  });

  var targetOptions = DC.simMapping.targetOptions;

  var optDiv = $("<div class=\"target-options\"></div>");
  Section.append(optDiv);
  $.each(targetOptions, function(opt, info) {
    var line = $("<div class=\"option-row\"></div>");
    optDiv.append(line);
    line.append("<span class=\"option-name\">" + info.name + ":</span>");
    line.append("<span class=\"option-setting\"><span class=\"option-subtable\"></span></span>");
    var subline = line.find(".option-subtable");

    if (info.health) {
      var box = $("<span class=\"option-box\"><label><input type=\"checkbox\" checked=\"checked\"></input>" + _L("Adaptive") + "</label></span>");
      DC.addTip(box.find("label"), _L("Total health equals to 10 times the damage dealt in the first minute."));
      var input = $("<input type=\"text\" class=\"option-health\" value=\"1,000,000,000,000\"></input>").hide();
      var prevValue = "1,000,000,000,000";
      input.on("input", function() {
        var val = $(this).val();
        if (!val) {prevValue = val; return;}
        var num = parseInt(val.replace(/,/g, ""));
        if (isNaN(num)) {
          $(this).val(prevValue);
        } else {
          $(this).val(prevValue = DC.formatNumber(num, 0, 10000));
          info.val = num;
        }
      });
      DC.addTip(input, info.tip);
      subline.append(box, $("<span class=\"option-slider\"></span>").append(input));
      box.find("input").click(function() {
        input.toggle(!$(this).prop("checked"));
        if ($(this).prop("checked")) {
          info.val = -1;
        } else {
          info.val = parseInt(input.val().replace(/,/g, ""));
        }
      });
      DC.addOption(info.var, function() {return info.val;}, function(x) {
        info.val = x;
        if (x < 0) {
          box.find("input").prop("checked", true);
          input.hide();
        } else {
          box.find("input").prop("checked", false);
          input.show().val(prevVal = DC.formatNumber(x, 0, 10000));
        }
      }, info.profile);
    } else {
      var value = $("<span class=\"option-value\">" + info.val + "</span>");
      subline.append(value);
      var slider = $("<div></div>").slider({
        value: info.val,
        min: info.min,
        max: info.max,
        step: info.step || 1,
        slide: function(event, ui) {
          if (info.resource) {
            var resource = (info.resource === true ? DC.classes[DC.charClass].resources[0] : info.resource);
            var mx = (DC.getStats()["max" + resource] || 100);
            if (ui.value >= mx) {
              info.val = "max";
            } else {
              info.val = ui.value;
            }
          } else {
            info.val = ui.value;
          }
          info.val = ui.value;
          value.text(ui.value);
        },
      });
      DC.addTip(slider, info.tip);
      subline.append($("<span class=\"option-slider\"></span>").append(slider));
      DC.addOption(info.var, function() {return info.val;}, function(x) {
        if (info.resource) {
          var resource = (info.resource === true ? DC.classes[DC.charClass].resources[0] : info.resource);
          var mx = (DC.getStats()["max" + resource] || 100);
          if (x === "max" || x >= mx) {
            x = mx;
            info.val = "max";
          } else {
            info.val = x;
          }
        } else {
          info.val = x;
        }
        value.text(x);
        slider.slider("value", x);
      }, info.profile);
      if (info.resource) {
        DC.register("updateStats", function() {
          var resource = (info.resource === true ? DC.classes[DC.charClass].resources[0] : info.resource);
          var mx = (DC.getStats()["max" + resource] || 100);
          var data = {max: mx};
          if (info.val === "max" || info.val >= mx) {
            info.val = "max";
            data.value = mx;
            value.text(mx);
          }
          slider.slider(data);
        });
      }
    }
  });

  var nyiSection = $("<div><p>" + _L("The following equipped items are not implemented in the simulation:") + "</p></div>");
  var nyiList = $("<ul class=\"nyi-list\"></ul>");
  Section.append(nyiSection.append(nyiList));
  nyiSection.hide();
  function updateNYI() {
    nyiList.empty();
    $.each(DC.itemSlots, function(slot, info) {
      var id = DC.getSlotId(slot);
      if (id && DC.simMapping.nyi[id]) {
        var line = $("<li>" + DC.itemById[id].name + "</li>");
        line.addClass("quality-" + DC.itemById[id].quality);
        line.hover(function() {
          DC.tooltip.showItem(this, slot);
        }, function() {
          DC.tooltip.hide();
        });
        nyiList.append(line);
      }
    });
    nyiSection.toggle(!!nyiList.children().length);
  }

  var SimButton = $("<button class=\"button-start\">" + _L("Start") + "</button>").button({
    icons: {primary: "ui-icon-play"},
  });;
  Section.append(SimButton);

  var FmtNumber = DC.formatDamage;
  function FmtTime(val) {
    var sec = (val % 60).toFixed(0);
    while (sec.length < 2) sec = "0" + sec;
    return Math.floor(val / 60) + ":" + sec;
  }

  var Results = new function() {
    this.dps = $("<span class=\"dps-meter\">" + _L("DPS: ") + "<span></span></span>").hide();
    this.graph = $("<div class=\"sim-graph\"></div>").hide();
    this.section = $("<div class=\"sim-results statsframe\"></div>").hide();
    this.chartData = [];
    Section.append(this.dps, this.graph, this.section);

    this.sourceName = function(id) {
      if (DC.skills[this.charClass][id]) {
        return DC.skills[this.charClass][id].name;
      } else if (DC.extraskills && DC.extraskills[this.charClass] && DC.extraskills[this.charClass][id]) {
        return DC.extraskills[this.charClass][id].name;
      } else if (DC.passives[this.charClass][id]) {
        return DC.passives[this.charClass][id].name;
      } else if (DC.legendaryGems[id]) {
        return DC.legendaryGems[id].name;
      } else if (self.initData.stats.affixes[id]) {
        var affix = self.initData.stats.affixes[id];
        if (affix.set) {
          return "(" + affix.pieces + ") " + DC.itemSets[affix.set].name;
        } else {
          var item = DC.getSlotId(affix.slot);
          if (item && DC.itemById[item]) {
            return DC.itemById[item].name;
          }
        }
      } else if (DC.stats[id] && DC.stats[id].name) {
        return DC.stats[id].name;
      } else if (DC.itemFromAffix[id]) {
        return DC.itemFromAffix[id].name;
      } else {
        return id;
      }
    };

    this.sampleLines = {};
    this.updateSample = function() {
      if (!this.sectSample || !this.chart || !this.sampleData) return;
      var min = this.chart._chart.sessionVariables.axisX.internalMinimum;
      var max = this.chart._chart.sessionVariables.axisX.internalMaximum;
      if (!min) min = 0;
      var index0 = 0, prevl = undefined;
      var self = this;
      $.each(this.sampleData, function(index, value) {
        var shown = (value[0] * 1000 / 60 >= min);
        if (!shown) index0 = index;
        if (!max && index > index0 + 50) shown = false;
        if (index > index0 + 100) shown = false;
        if (max && value[0] * 1000 / 60 > max) shown = false;
        if (!shown) {
          if (self.sampleLines[index]) {
            self.sampleLines[index].remove();
            delete self.sampleLines[index];
          }
          return;
        }
        if (!self.sampleLines[index]) {
          var skill = DC.skills[self.charClass][value[1]];
          if (!skill) skill = (DC.extraskills && DC.extraskills[self.charClass] && DC.extraskills[self.charClass][value[1]]);
          if (skill) {
            var tmin = Math.floor(value[0] / 3600);
            var tsec = value[0] / 60 - tmin * 60;
            var time = (tmin ? tmin + ":" + (tsec < 10 ? "0" : ""): "") + tsec.toFixed(2);
            var icon = makeSkillIcon(value[1], self.charClass);
            var line = $("<li><span><span>" + time + "</span>" + icon + "<span>" + skill.name +
              "</span></span><span>" + value[2].toFixed(0) + "</span></li>");
            //self.sectSample.append(line);
            line.hover(function() {
              var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Damage") +
                 ": <span class=\"d3-color-green\">" + DC.formatNumber(value[3], 0, 10000) + "</span></span>";
              for (var id in value[4]) {
                var name = self.sourceName(id);
                if (name) {
                  tip += "<br/><span class=\"tooltip-icon-bullet\"></span>" + name + ": <span class=\"d3-color-green\">" + DC.formatNumber(value[4][id], 0, 10000) + "</span>";
                }
              }
              if (value.length > 5 && !$.isEmptyObject(value[5])) {
                tip += "<br/><span class=\"tooltip-icon-bullet\"></span>Buffs:";
                var ids = [];
                for (var id in value[5]) ids.push([id, DC.simMapping.buffs[id] && DC.simMapping.buffs[id].name || id]);
                ids.sort(function(x, y) {return x[1].localeCompare(y[1]);});
                for (var i = 0; i < ids.length; ++i) {
                  var id = ids[i][0];
                  var name = (DC.simMapping.buffs[id] && DC.simMapping.buffs[id].name);
                  tip += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-" + (name ? "gold" : "gray") + "\">" +
                    (name || id) + "</span>: <span class=\"d3-color-white\">" + value[5][id] + "</span>";
                }
              }
              tip += "</p></div>";

              DC.tooltip.showHtml(this, tip);
            }, function() {
              DC.tooltip.hide();
            });
            self.sampleLines[index] = line;
          }
          if (prevl) prevl.after(self.sampleLines[index]);
          else self.sectSample.prepend(self.sampleLines[index]);
        }
        if (self.sampleLines[index]) {
          prevl = self.sampleLines[index];
        }
      });
    };

    this.chartInit = function() {
      this.graph.empty();
      this.chart = new CanvasJS.Chart(this.graph[0], {
        backgroundColor: ($("body").hasClass("theme-light") ? "#fff" : "#121212"),
        height: 200,
        axisY: {
          valueFormatString: " ",
          lineThickness: 1,
          tickThickness: 0,
          gridThickness: 1,
        },
        axisX: {
          lineThickness: 1,
          gridThickness: 1,
          tickThickness: 1,
//          interval: 60,
          labelFormatter: function(e) {
            return FmtTime(e.value / 1000);
          },
        },
        data: [{
          type: "area",
          xValueType: "dateTime",
          dataPoints: this.chartData,
        }],
        zoomEnabled: true,
        toolTip: {
          contentFormatter: function(e) {
            var pt = e.entries[0].dataPoint;
            return "<b>" + FmtTime(pt.x / 1000) + "</b> - " + FmtNumber(pt.y);
          },
        },
      });
      this.graph.append("<div class=\"comment\">" + _L("Drag to zoom/pan (affects Sample output)") + "</div>");
      var _r = this.chart._chart.render;
      var _this = this;
      this.chart._chart.render = function() {
        _r.apply(this, arguments);
        _this.updateSample();
      };
      this.chart.render();
    };
    this.chartInit();

    var self = this;
    DC.register("changeTheme", function() {
      self.chartInit();
    });

    this.sectCounters = $("<ul class=\"flex\"></ul>");
    this.sectUptimes = $("<ul class=\"flex\"></ul>");
    this.sectSample = $("<ul class=\"flex2 flex\"></ul>");
    var col = $("<div class=\"column\"></div>");
    col.append($("<div></div>").append("<h3>" + _L("Breakdown") + "</h3>", this.sectCounters));
    col.append($("<div></div>").append("<h3>" + _L("Uptimes") + "</h3>", this.sectUptimes));
    this.section.append(col);
    col = $("<div class=\"column\"></div>");
    col.append($("<div></div>").append("<h3>" + _L("Sample") + "</h3>", this.sectSample));
    this.section.append(col);
    this.section.find(".column").sortable({
      //containment: this.section,
      connectWith: ".sim-results .column",
      handle: "h3",
      distance: 4,
      placeholder: "drop-ph",
      forcePlaceholderSize: true,
      start: function() {
        self.section.find(".column").addClass("dragging");
      },
      stop: function() {
        self.section.find(".column").removeClass("dragging");
      },
    });

    this.finish = function(data) {
      SimButton.button({
        icons: {primary: "ui-icon-play"},
        label: _L("Start"),
      });
      this.worker.terminate();
      delete this.worker;

      //console.log(this.results);
      DC.recordDPS(this.results.damage / this.results.time * 60);

      var charClass = this.initData.stats.charClass;
      this.charClass = charClass;

      var self = this;

      var lines = [];
      $.each(data.counters, function(id, value) {
        var name = self.sourceName(id);
        if (name) {
          lines.push([name, id, value]);
        }
      });
      lines.sort(function(lhs, rhs) {return lhs[0].toLowerCase().localeCompare(rhs[0].toLowerCase());});
      function itemIcon(id, type) {
        if (!type) {
          if (!DC.itemById[id]) return "";
          type = DC.itemById[id].type;
        }
        var index = DC.itemIcons[id];
        return "<div style=\"background: url(css/items/" + type + ".png) 0 " + (-24 * (index && index[0] || 0)) + "px no-repeat\"></div>";
      }
      this.sectCounters.empty();
      var extras = (DC.extraskills && DC.extraskills[charClass]) || {};
      $.each(lines, function(_index, _item) {
        var name = _item[0];
        var id = _item[1];
        var value = _item[2];

        var line = $("<li class=\"bigger\"><span>" + name + "</span></li>");
        if (DC.skills[charClass][id] || extras[id]) {
          var icon = makeSkillIcon(id, charClass).replace(/span/g, "div");
          line.prepend(icon);
          line.hover(function() {
            DC.tooltip.showSkill(this, charClass, id, self.initData.stats.skills[id]);
          }, function() {
            DC.tooltip.hide();
          });
        } else if (DC.passives[charClass][id]) {
          var passive = DC.passives[charClass][id];
          var icon = "<div style=\"background: url(css/images/class-" + charClass + "-passive.png) " +
            (-24 * passive.index) + "px 0 / auto 48px no-repeat\"></div>";
          line.prepend(icon);
          line.hover(function() {
            DC.tooltip.showSkill(this, charClass, id);
          }, function() {
            DC.tooltip.hide();
          });
        } else if (DC.legendaryGems[id]) {
          var gem = DC.legendaryGems[id];
          var icon = itemIcon(gem.id, "gemleg");
          line.prepend(icon);
          line.hover(function() {
            DC.tooltip.showGem(this, id, self.initData.stats.gems[id]);
          }, function() {
            DC.tooltip.hide();
          });
        } else if (self.initData.stats.affixes[id]) {
          var affix = self.initData.stats.affixes[id];
          var item = DC.getSlotId(affix.slot);
          if (item) {
            line.prepend(itemIcon(item));
          }
          line.hover(function() {
            DC.tooltip.showItem(this, affix.slot);
          }, function() {
            DC.tooltip.hide();
          });
        } else if (DC.isKnownStat(id)) {
          line.hover(function() {
            DC.showStatTip(this, id);
          }, function() {
            DC.tooltip.hide();
          });
        } else if (DC.itemFromAffix[id]) {
          line.prepend(itemIcon(DC.itemFromAffix[id].id));
          line.hover(function() {
            var values = [];
            var affix = DC.itemFromAffix[id].required.custom;
            if (affix.args === 1 || affix.args === undefined) {
              values.push((affix.best === "min" ? affix.min : affix.max) || 0);
            }
            DC.tooltip.showItem(this, DC.itemFromAffix[id].id, values);
          }, function() {
            DC.tooltip.hide();
          });
        }
        self.sectCounters.append(line);

        if (value.count) {
          self.sectCounters.append("<li><span>" + _L("Uses") + "</span><span>" + value.count + "</span></li>");
          var permin = value.count / self.results.time * 3600;
          if (permin > 60) {
            self.sectCounters.append("<li><span>" + _L("Uses/second") + "</span><span>" + DC.formatNumber(permin / 60, 2) + "</span></li>");
          } else {
            self.sectCounters.append("<li><span>" + _L("Uses/minute") + "</span><span>" + DC.formatNumber(permin, 2) + "</span></li>");
          }
        }
        if (value.damage) {
          self.sectCounters.append("<li><span>" + _L("Damage") + "</span><span>" + FmtNumber(value.damage) + "</span></li>");
          self.sectCounters.append("<li><span>" + _L("DPS") + "</span><span>" + FmtNumber(value.damage / self.results.time * 60) + "</span></li>");
          self.sectCounters.append("<li><span>" + _L("% Damage") + "</span><span>" + DC.formatNumber(100 * value.damage / self.results.damage, 2) + "%</span></li>");
        }
        if (value.rc) {
          for (var type in value.rc) {
            if (!DC.resources[type]) continue;
            self.sectCounters.append("<li><span>" + _L("Gained {0}").format(DC.resources[type]) + "</span><span>" + DC.formatNumber(value.rc[type], 0, 10000) + "</span></li>");
          }
        }
      });

      var lines = [];
      $.each(data.uptimes, function(id, value) {
        var name = (DC.simMapping.buffs[id] && DC.simMapping.buffs[id].name || id);
        lines.push([name, value]);
      });
      lines.sort(function(lhs, rhs) {return lhs[0].toLowerCase().localeCompare(rhs[0].toLowerCase());});
      this.sectUptimes.empty();
      for (var i = 0; i < lines.length; ++i) {
        var pct = DC.formatNumber(lines[i][1] * 100, 2) + "%";
        var line = $("<li><span>" + lines[i][0] + "</span><span>" + pct + "</span></li>");
        var tip = lines[i][0] + ": <span class=\"d3-color-green\">" + pct + "</span>";
        if (lines[i][1] > 1) {
          tip += "</span><br/><span class=\"tooltip-icon-bullet\"></span>Average stacks: <span class=\"d3-color-green\">" + DC.formatNumber(lines[i][1], 2);
        }
        DC.addTip(line, tip);
        this.sectUptimes.append(line);
      }

      this.sectSample.empty();
      this.sampleLines = {};
      this.sampleData = data.sample;
      this.updateSample();

      this.section.show();
    };

    this.section.on("click", "h3", function() {
      $(this).next().slideToggle();
    });

    this.onMessage = function(data) {
      if (!this.results) return;
      this.results.time = data.time;
      if (data.type === "report") {
        this.results.damage = data.damage;
        this.finish(data);
      } else {
        this.results.damage += data.damage;
        this.chartData.push({x: data.time * 1000 / 60, y: data.damage / 3});
        this.chart.render();
      }
      this.dps.find("span").text(FmtNumber(this.results.damage / this.results.time * 60));
    }

    this.start = function(data) {
      data.type = "start";
      delete this.sampleData;
      this.initData = data;
      this.worker = new Worker("sim");
      var self = this;
      this.worker.onmessage = function(e) {
        self.onMessage(e.data);
      };
      this.results = {damage: 0, time: 1};

      this.dps.show();
      this.dps.find("span").text("0");
      this.section.hide();
      this.chartData.length = 0;
      this.graph.show();
      this.chart.render();
      this.worker.postMessage(data);
      SimButton.button({
        icons: {primary: "ui-icon-stop"},
        label: _L("Stop"),
      });
    };

    this.abort = function() {
      this.dps.hide();
      this.section.hide();
      this.graph.hide();
      this.worker.terminate();
      delete this.worker;
      delete this.results;
      delete this.sampleData;
      SimButton.button({
        icons: {primary: "ui-icon-play"},
        label: _L("Start"),
      });
    };

    this.running = function() {
      return !!this.worker;
    };
  };
  DC.SimResults = Results;

  DC.exportStats = function() {
    var stats = new DC.Stats();
    stats.loadItems(undefined, true);
    DC.addSkillList(stats);
    DC.addPartyBuffs(stats);
    var status = statusBox.val();
    if (status) {
      for (var i = 0; i < status.length; ++i) {
        stats[status[i]] = 1;
      }
    }
    stats.flatten();
    return stats;
  };
  DC.exportProfile = function() {
    return {
      stats: DC.exportStats(),
      params: DC.getActive("global+"),
      priority: DC.priority.getData(),
    };
  };

  SimButton.click(function() {
    if (!Results.running()) {
      Results.start(DC.exportProfile());
    } else {
      Results.abort();
    }
  });

  var _m = location.pathname.match(/^\/e?([0-9]+)$/);
  Sections.accordion({
    active: (_m ? 1 : 0),
    collapsible: true,
    heightStyle: "content",
    activate: function(event, ui) {
      ui.newPanel.removeClass("sliding");
      ui.oldPanel.removeClass("sliding");
    },
    beforeActivate: function(event, ui) {
      ui.newPanel.addClass("sliding");
      ui.oldPanel.addClass("sliding");
    },
  });

  DC.register("changeClass", function() {
    DC.priority.setData(DC.priority.getData());
    UpdatePriorities();
  });
  DC.register("updateSlotItem", updateNYI);
  DC.register("importEnd", updateNYI);

})();

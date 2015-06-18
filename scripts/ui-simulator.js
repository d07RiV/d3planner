(function() {
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
          if (stats.skills[opts.skill[0]] && (opts.skill.length < 2 || stats.skills[opts.skill[0]] === opts.skill[1])) ++good;
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
          if (stats[opts.stat]) ++good;
        }
        if (total && !good) return;
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
        placeholder_text_single: "Choose Buff",
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
    if (DC.options.filterBuffs) {
      var list = {};
      var skills = DC.getSkills().skills;
      for (var i = 0; i < skills.length; ++i) {
        if (skills[i] && DC.skills[DC.charClass][skills[i][0]]) {
          list[skills[i][0]] = DC.skills[DC.charClass][skills[i][0]];
        }
      }
      return list;
    } else {
      return DC.skills[DC.charClass];
    }
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
        cat = $("<optgroup label=\"" + DC.skillcat[DC.charClass][catName] + "\"></optgroup>");
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
    if (!skill) return;
    return "<span style=\"background: url(css/images/class-" + cls + ".png) " +
      (-24 * skill.col) + "px " + (-48 * skill.row) + "px / 120px no-repeat\"></span>";
  }
  function skillTips(id) {
    var skill = DC.skills[DC.charClass][id];
    if (!skill) return;
    DiabloCalc.tooltip.showSkill(this, DC.charClass, id);
  }
  function createSkillBox(parent, value) {
    var box = $("<select class=\"arg-skill\"></select>");
    if (!value || !DC.skills[DC.charClass][value]) value = fillBoxSkills(box, true);
    if (value && !DC.skills[DC.charClass][value]) value = undefined;
    if (value && DC.skills[DC.charClass][value]) {
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.skills[DC.charClass][value].name + "</option>");
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
        placeholder_text_single: "Choose Skill",
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
        if (value && DC.skills[DC.charClass][value]) {
          box.removeAttr("disabled");
          box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.skills[DC.charClass][value].name + "</option>");
        }
        box.trigger("chosen:updated");
      }
      return this;
    };
    return box;
  }
  function updateSkillBox(box) {
    var value = box.val();
    if (!value || !DC.skills[DC.charClass][value]) value = fillBoxSkills(box, true);
    if (value && !DC.skills[DC.charClass][value]) value = undefined;
    box.empty();
    if (value && DC.skills[DC.charClass][value]) {
      box.removeAttr("disabled");
      box.append("<option value=\"" + value + "\" selected=\"selected\">" + DC.skills[DC.charClass][value].name + "</option>");
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
        placeholder_text_single: "Choose Resource",
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
    opts: {
      buff: "Buff stacks",
      buffmin: "Buff duration (min)",
      buffmax: "Buff duration",
      ticks: "Buff ticks",
      resource: "Resource",
      resourcepct: "Resource (percent)",
      cooldown: "Cooldown",
      charges: "Charges",
      interval: "Time since cast",
      health: "Target HP (percent)",
      any: "Any condition",
      all: "All conditions",
      count: "Number of conditions",
    },
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
    this.add = $("<div class=\"btn-add\">Add condition</div>");
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
    this.add = $("<div class=\"btn-add\">Add skill</div>");
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
      for (var i = 0; i < data.length; ++i) {
        if (!DC.skills[DC.charClass][data[i].skill]) continue;
        var pri = new PriorityLine(this);
        pri.setData(data[i]);
        this.items.push(pri);
      }
    }
  };

  var Section = $("<div></div>");
  Sections.append("<h3>Skill Priority</h3>", Section);
  
  Section.append("<p><i>The priority list is evaluated from top to bottom to determine the next skill to use. " +
    "Skill availability checks (cooldown and resources) are implicit.</i></p>");

  var filterBuffs = $("<input></input>").attr("type", "checkbox").prop("checked", true).click(function() {
    DC.trigger("updateSkills");
  });
  DC.addOption("filterBuffs", function() {return filterBuffs.prop("checked");}, function(x) {
    filterBuffs.prop("checked", x);
    DC.trigger("updateSkills");
  });
  Section.append($("<label></label>").addClass("option-box").append(filterBuffs).append("Only show applicable buffs/skills."));
  DC.addTip(filterBuffs, "Only show buffs that can be activated with current skills and equipment.");

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
          ErrorBox.val("Failed to save priority list.");
          ErrorBox.slideDown();
        }
      },
      error: function(e) {
        ErrorBox.text("Failed to save priority list.");
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
      DiabloCalc.popupMenu(evt, {
        "Discard current list?": function() {
          DoLoadPrio(id);
        },
      });
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
    li.append("<span class=\"profile-name" + (item.value ? "" : " unnamed") + "\">" + (item.value || "Unnamed list") + "</span>");
    if (parseInt(item.user)) {
      li.append($("<span class=\"profile-overwrite\" title=\"Update list\"></span>").click(function(evt) {
        evt.stopPropagation();
        DC.popupMenu(evt, {
          "Confirm overwrite": function() {
            SavePrio("", id);
          },
        });
      }));
      li.append($("<span class=\"profile-delete\" title=\"Delete list\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, {
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
                  ErrorBox.val("Failed to delete profile.");
                  ErrorBox.slideDown();
                }
              },
              error: function(e) {
                ErrorBox.val("Failed to delete profile.");
                ErrorBox.slideDown();
              },
            });
          },
        });
      }));
      li.append("<span class=\"date-saved\">" + (new Date(1000 * item.date)).toLocaleString() + "</span>");
    }
    return li;
  }, "No preset lists found.");
  var PrioSave = $("<div class=\"prio-save\"><div><input></input></div></div>");
  var PrioBtn = $("<input type=\"button\" value=\"Save\" disabled=\"disabled\"></input>").click(function() {
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

  Section.append(DC.account.makeLine(" to save skill priorities", function(okay) {
    UpdatePriorities();
    this.toggle(!okay);
  }));
  Section.append(PrioSave.append(PrioBtn), ErrorBox);
  Section.append(MyPrio.div.css("margin-top", 6));

  ///////////////////////////////////////////////////

  Sections.append("<h3>Simulate ( <span class=\"status-icon class-wizard class-icon\"></span> " +
                                "<span class=\"status-icon class-demonhunter class-icon\"></span> " +
                                "<span class=\"status-icon class-witchdoctor class-icon\"></span>)</h3>");
  Section = $("<div></div>");
  Sections.append(Section);

  var showElites = $("<input></input>").attr("type", "checkbox").change(function() {
    DC.options.showElites = this.checked;
  });
  var targetType = $("<select></select>");
  targetType.append("<option value=\"\">Generic</option>");
  targetType.append("<option value=\"demons\">Demon</option>");
  targetType.append("<option value=\"beasts\">Beast</option>");
  targetType.append("<option value=\"humans\">Human</option>");
  targetType.append("<option value=\"undead\">Undead</option>");
  targetType.change(function() {
    DC.options.targetType = $(this).val();
  });
  var targetBoss = $("<input type=\"checkbox\"></input>");
  var bossLabel = $("<label style=\"margin-left: 8px\">Boss</label>").prepend(targetBoss);
  DC.register("updateStats", function() {
    showElites.prop("checked", DC.options.showElites);
    bossLabel.toggle(!!DC.options.showElites);
    targetType.val(DC.options.targetType);
    targetType.trigger("chosen:updated");
  });
  DC.addOption("targetBoss", function() {return targetBoss.prop("checked");}, function(x) {
    targetBoss.prop("checked", !!x);
  });
  Section.append($("<span class=\"option-box\">Target: </span>").append(targetType,
    $("<label style=\"margin-left: 8px\">Elite</label>").prepend(showElites), bossLabel));

  var statusBox = $("<select class=\"target-status\" multiple=\"multiple\"></select>");
  for (var id in DC.simMapping.status) {
    statusBox.append("<option value=\"" + id + "\">" + DC.simMapping.status[id] + "</option>");
  }
  Section.append(statusBox);
  statusBox.chosen({
    inherit_select_classes: true,
    placeholder_text_multiple: "Target status debuffs (from group)",
  });
  DC.addOption("targetStatus", function() {return statusBox.val();}, function(x) {
    statusBox.val(x);
    statusBox.trigger("chosen:updated");
  });

  var targetOptions = {
    distance: {var: "targetDistance", name: "Distance", tip: "Player distance from the center of the monster cluster.", min: 0, max: 50, val: 40, profile: true},
    radius: {var: "targetRadius", name: "Spread", tip: "Maximum monster distance from the cluster center.", min: 0, max: 50, val: 0},
    size: {var: "targetSize", name: "Size", tip: "Monster hitbox radius.", min: 0, max: 10, val: 2.5, step: 0.1},
    count: {var: "targetCount", name: "Count", tip: "Number of monsters in the cluster.", min: 1, max: 50, val: 1},
    globes: {var: "globeRate", name: "Globes/min", tip: "Number of globes per minute generated by the party.", min: 0, max: 100, val: 0},
  };

  var optDiv = $("<div class=\"target-options\"></div>");
  Section.append(optDiv);
  $.each(targetOptions, function(opt, info) {
    var line = $("<div class=\"option-row\"></div>");
    optDiv.append(line);
    line.append("<span class=\"option-name\">" + info.name + ":</span>");
    var value = $("<span class=\"option-value\">" + info.val + "</span>");
    line.append(value);
    var slider = $("<div></div>").slider({
      value: info.val,
      min: info.min,
      max: info.max,
      step: info.step || 1,
      slide: function(event, ui) {
        info.val = ui.value;
        value.text(ui.value);
      },
    });
    DC.addTip(slider, info.tip);
    line.append($("<span class=\"option-slider\"></span>").append(slider));
    DC.addOption(info.var, function() {return info.val;}, function(x) {
      info.val = x;
      value.text(x);
      slider.slider("value", x);
    }, info.profile);
  });

  var SimButton = $("<button class=\"button-start\">Start</button>").button({
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
    this.dps = $("<span class=\"dps-meter\">DPS: <span></span></span>").hide();
    this.graph = $("<div class=\"sim-graph\"></div>").hide();
    this.section = $("<div class=\"sim-results statsframe\"></div>").hide();
    this.chartData = [];
    Section.append(this.dps, this.graph, this.section);

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
          interval: 60,
          labelFormatter: function(e) {
            return FmtTime(e.value);
          },
        },
        data: [{
          type: "area",
          dataPoints: this.chartData,
        }],
        zoomEnabled: true,
        toolTip: {
          contentFormatter: function(e) {
            var pt = e.entries[0].dataPoint;
            return "<b>" + FmtTime(pt.x) + "</b> - " + FmtNumber(pt.y);
          },
        },
      });
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
    col.append($("<div></div>").append("<h3>Breakdown</h3>", this.sectCounters));
    col.append($("<div></div>").append("<h3>Uptimes</h3>", this.sectUptimes));
    this.section.append(col);
    col = $("<div class=\"column\"></div>");
    col.append($("<div></div>").append("<h3>Sample</h3>", this.sectSample));
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
        label: "Start",
      });
      this.worker.terminate();
      delete this.worker;

      //console.log(this.results);
      DC.recordDPS(this.results.damage / this.results.time * 60);

      var charClass = this.initData.stats.charClass;

      var self = this;

      var lines = [];
      $.each(data.counters, function(id, value) {
        var name;
        if (DC.skills[charClass][id]) {
          name = DC.skills[charClass][id].name;
        } else if (DC.passives[charClass][id]) {
          name = DC.passives[charClass][id].name;
        } else if (DC.legendaryGems[id]) {
          name = DC.legendaryGems[id].name;
        } else if (self.initData.stats.affixes[id]) {
          var affix = self.initData.stats.affixes[id];
          if (affix.set) {
            name = "(" + affix.pieces + ") " + DC.itemSets[affix.set].name;
          } else {
            var item = DC.getSlotId(affix.slot);
            if (item && DC.itemById[item]) {
              name = DC.itemById[item].name;
            }
          }
        } else if (DC.stats[id] && DC.stats[id].name) {
          name = DC.stats[id].name;
        } else {
          name = id;
        }
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
        var index = DC.itemIcons[type][id];
        return "<div style=\"background: url(css/items/" + type + ".png) 0 " + (-24 * (index || 0)) + "px no-repeat\"></div>";
      }
      this.sectCounters.empty();
      $.each(lines, function(_index, _item) {
        var name = _item[0];
        var id = _item[1];
        var value = _item[2];

        var line = $("<li class=\"bigger\"><span>" + name + "</span></li>");
        if (DC.skills[charClass][id]) {
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
        }
        self.sectCounters.append(line);

        if (value.count) {
          self.sectCounters.append("<li><span>Uses</span><span>" + value.count + "</span></li>");
        }
        if (value.damage) {
          self.sectCounters.append("<li><span>Damage</span><span>" + FmtNumber(value.damage) + "</span></li>");
          self.sectCounters.append("<li><span>% Damage</span><span>" + DC.formatNumber(100 * value.damage / self.results.damage, 2) + "%</span></li>");
        }
        if (value.rc) {
          for (var type in value.rc) {
            if (!DC.resources[type]) continue;
            self.sectCounters.append("<li><span>Gained " + DC.resources[type] + "</span><span>" + DC.formatNumber(value.rc[type], 0, 10000) + "</span></li>");
          }
        }
      });

      var lines = [];
      $.each(data.uptimes, function(id, value) {
        var name = (DC.simMapping.buffs[id] && DC.simMapping.buffs[id].name || id);
        var amount = DC.formatNumber(value * 100, 2) + "%";
        lines.push([name, amount]);
      });
      lines.sort(function(lhs, rhs) {return lhs[0].toLowerCase().localeCompare(rhs[0].toLowerCase());});
      this.sectUptimes.empty();
      for (var i = 0; i < lines.length; ++i) {
        var line = $("<li><span>" + lines[i][0] + "</span><span>" + lines[i][1] + "</span></li>");
        DC.addTip(line, lines[i][0] + ": <span class=\"d3-color-green\">" + lines[i][1] + "</span>");
        this.sectUptimes.append(line);
      }

      this.sectSample.empty();
      $.each(data.sample, function(index, value) {
        var skill = DC.skills[charClass][value[1]];
        if (skill) {
          var time = DC.formatNumber(value[0] / 60, 2);
          var icon = makeSkillIcon(value[1], charClass);
          var line = $("<li><span><span>" + time + "</span>" + icon + "<span>" + skill.name +
            "</span></span><span>" + value[2].toFixed(0) + "</span></li>");
          self.sectSample.append(line);
          line.hover(function() {
            DC.tooltip.showSkill(this, charClass, value[1], self.initData.stats.skills[value[1]]);
          }, function() {
            DC.tooltip.hide();
          });
        }
      });

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
        this.chartData.push({x: data.time / 60, y: data.damage / 3});
        this.chart.render();
      }
      this.dps.find("span").text(FmtNumber(this.results.damage / this.results.time * 60));
    }

    this.start = function(data) {
      data.type = "start";
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
        label: "Stop",
      });
    };

    this.abort = function() {
      this.dps.hide();
      this.section.hide();
      this.graph.hide();
      this.worker.terminate();
      delete this.worker;
      delete this.results;
      SimButton.button({
        icons: {primary: "ui-icon-play"},
        label: "Start",
      });
    };

    this.running = function() {
      return !!this.worker;
    };
  };

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

})();

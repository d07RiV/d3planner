(function() {
  var DC = DiabloCalc;
  var _L = DC.locale("ui-skills.js", "skilldata");

  var kanaiTypes = {
    weapon: {
      name: _L("Weapon"),
      filter: function(type) {
        var slot = (DC.itemTypes[type] && DC.itemTypes[type].slot);
        return slot === "onehand" || slot === "twohand" || slot === "offhand";
      },
    },
    armor: {
      name: _L("Armor"),
      filter: function(type) {
        if (kanaiTypes.weapon.filter(type)) return false;
        if (kanaiTypes.jewelry.filter(type)) return false;
        return true;
      },
    },
    jewelry: {
      name: _L("Jewelry"),
      filter: function(type) {
        return type === "ring" || type === "amulet";
      },
    },
  };
  DC.getKanaiType = function(id) {
    var item = DC.itemById[id];
    if (!item) return;
    for (var id in kanaiTypes) {
      if (kanaiTypes[id].filter(item.type)) return id;
    }
  };

  var kanaiCache = {};

  function inherits(parent, funcs) {
    var obj = funcs.constructor;
    if (!obj) {
      obj = function() {
        this.parent.apply(this, arguments);
      };
    }
    delete funcs.constructor;
    var tmp = function() {};
    tmp.prototype = parent.prototype;
    obj.prototype = new tmp();
    obj.prototype.uber = parent;
    for (var name in funcs) {
      obj.prototype[name] = funcs[name];
    }
    return obj;
  };

  function SkillBoxBase(parent) {
    this.paramList = [];
    this.line = $("<div class=\"skill-line\"></div>");
    if (parent) parent.append(this.line);

    this.initHeader();

    if (this.readonly) {
      this.header.addClass("readonly");
    }
    if (this.level) {
      this.icon.append("<span class=\"skill-text\">" + this.level + "</span>");
    }
    this.desc = $("<span class=\"skill-description\"></span>");
    this.line.append(this.header.append(this.icon, this.desc));

    this.applybox = $("<input type=\"checkbox\"></input>");
    this.params = $("<ul class=\"skill-info\"></ul>").hide();
    this.initName();
    this.apply.prepend(this.applybox);

    if (this.init) this.init();

    this.header.mouseleave(function() {
      DC.tooltip.hide();
    });
    this.apply.click(function(evt) {
      evt.stopPropagation();
    });
    this.updateParams();

    if (!this.readonly) {
      var self = this;
      this.accept = function(skill) {
        if (!skill) return true;
        if (this.type === "skill" && this.index === 0) {
          var info = DC.skills[DC.charClass][skill[0]];
          if (!info || info.nolmb) return false;
        }
        return true;
      };
      function makeDraggable(elem1, elem2, helper, hide, tol) {
        elem1.data("box", self);
        var reverting = false;
        elem1.draggable({
          zIndex: 100,
          cursor: "-webkit-grabbing",
          appendTo: "body",
          tolerance: tol || "intersect",
          distance: 4,
          helper: helper,
          start: function(event, ui) {
            if (!self[self.type]) {
              setTimeout(function() {
                $("body").css("cursor", "");
              });
              return false;
            }
            hide(true);
            if (DC.tooltip) DC.tooltip.disable();
          },
          revert: function(valid) {
            if (DC.tooltip) DC.tooltip.enable();
            return !valid;
            if (!valid) {
              if (!window.event) return true;
              reverting = true;
              DC.popupMenu(window.event, _L.fixkey({
                "Delete": function() {
                  var obj = elem1.draggable("instance");
                  reverting = false;
                  if (obj && obj._trigger("stop", event) !== false) {
                    obj._clear();
                  }
                  self._set();
                  DC.trigger("updateSkills", true);
                },
              }), function() {
                var obj = elem1.draggable("instance");
                reverting = false;
                if (!obj) return;
                $(obj.helper).animate(obj.originalPosition, parseInt(obj.options.revertDuration, 10), function() {
                  if (obj._trigger("stop", event) !== false) {
                    obj._clear();
                  }
                });
              });
            }
            return false;
          },
          stop: function() {
            if (reverting) return false;
            setTimeout(function() {
              hide(false);
            }, 0);
          },
        });
        elem2.droppable({
          hoverClass: "selected",
          accept: function(other) {
            var box = other.data("box");
            if (!box || box.type !== self.type || !box[box.type] || box === self) return false;
            return self.accept(box[box.type]) && box.accept(self[self.type]);
          },
          drop: function(event, ui) {
            var box = ui.draggable.data("box");
            if (!box || box.type !== self.type || box === self) return false;
            var data = box[box.type];
            if (!data || !self.accept(data) || !box.accept(self[self.type])) return;
            box._set(self[self.type]);
            self._set(data);
            DC.trigger("updateSkills", true);
          },
        });
      }
      makeDraggable(this.header, this.line, function() {
        return self.header.clone().addClass("class-" + DC.charClass);
      }, function(flag) {
        self.header.css("visibility", flag ? "hidden" : "");
      });
      var doll = (this.type === "skill" ? DC.getDollSkill : DC.getDollPassive);
      if (doll) doll = doll(this.index);
      if (doll) {
        makeDraggable(doll, doll, function() {
          var outer = $("<div class=\"class-" + DC.charClass + "\" style=\"width: 42px; height: 42px; position: absolute\"></div>");
          return outer.append(doll.clone().css("left", 0));
        }, function(flag) {
          doll.toggleClass("empty", flag || !self[self.type]);
        }, "pointer");
      }
    }
    DC.enableTouch(this.header);
  }

  SkillBoxBase.prototype.initHeader = function() {
    this.header = $("<span class=\"passive-header readonly\"></span>");
    this.icon = $("<span class=\"item-icon\"></span>");
  };
  SkillBoxBase.prototype.initName = function() {
    this.name = $("<span class=\"skill-name\"></span>");
    this.desc.append(this.name, "<span class=\"skill-separator\"></span>");
    this.apply = $("<label class=\"passive-apply\">" + _L("Include in stats") + "</label>");
    this.desc.append(this.apply);
    this.desc.append(this.params);
  };

  SkillBoxBase.prototype.updateParams = function() {
    this.params.empty();
    this.paramList = [];
    var info = this.getInfo();
    if (!info || !info.params) return;
    var self = this;
    $.each(info.params, function(i, param) {
      var param = info.params[i];
      if (self.type === "skill" && param.rune && param.rune.indexOf(self.skill[1]) < 0) return;
      var value = $("<span class=\"param-value\"></span>").text(param.val + (param.percent ? "%" : ""));
      var slider = $("<div></div>").slider({
        value: param.val,
        min: param.min,
        max: param.max,
        step: param.step || 1,
        slide: function(event, ui) {
          param.val = ui.value;
          value.text(ui.value + (param.percent ? "%" : ""));
          DC.trigger("updateSkills");
          if (self.onChangeParam) self.onChangeParam();
        },
      }).click(function(evt) {
        evt.stopPropagation(true);
      });
      var len = (param.max - param.min) / (param.step || 1);
      if (len <= 5) {
        slider.css("width", len * 40);
      } else {
        slider.css("width", "");
      }
      var line = $("<li></li>");
      line.append("<span class=\"param-name\"><b>" + _L(param.name) + ":</b></span>", value, $("<div class=\"param-slider\"></div>").append(slider));
      self.paramList.push({
        param: param,
        value: value,
        slider: slider,
        line: line,
      });
      self.params.append(line);
    });
  };

  SkillBoxBase.prototype.getCurInfo = function(info, stats) {
    var curInfo = (this.getCurInfo_ && this.getCurInfo_(info, stats));
    var elites = (DC.options.showElites ? 1 + 0.01 * (stats.edmg || 0) : 1);
    if (typeof info.info === "function") {
      if (curInfo) {
        curInfo = $.extend({}, curInfo);
        for (var stat in curInfo) {
          if (typeof curInfo[stat] === "number") {
            curInfo[stat] = DC.formatNumber(curInfo[stat] * elites, 0, 10000);
          }
        }
      }
    } else if (info.info) {
      if (curInfo) {
        curInfo = $.extend({}, curInfo);
        for (var stat in curInfo) {
          if (typeof curInfo[stat] !== "string") continue;
          var expr = curInfo[stat];
          var unmod = undefined;
          if (expr[0] == '@' || expr[0] == '%') {
            unmod = expr[0];
            expr = expr.substring(1);
          }
          expr = DC.execString(expr, stats, info.affixid || this.affix, info.params);
          if (typeof expr === "number") {
            if (!unmod) expr *= elites;
            if (unmod == "%") {
              curInfo[stat] = Math.floor(expr) + "%";
            } else {
              curInfo[stat] = DC.formatNumber(expr, 0, 10000);
            }
          } else {
            curInfo[stat] = expr;
          }
        }
      }
    }
    return curInfo;
  };

  SkillBoxBase.prototype.update = function() {
    var info = this.getInfo();
    if (!info) {
      this.apply.hide();
      if (this.info) {
        this.info.remove();
        this.info = undefined;
      }
      return;
    }

    var stats = DC.getStats();
    var noBuffs = false;

    if (this.updateBox) {
      if (this.updateBox(info, stats) === true) {
        noBuffs = true;
      }
    }

    this.apply[0].lastChild.nodeValue = (_L(info.activetip) || _L("Include in stats"));

    var anyLines = false;
    var self = this;
    $.each(this.paramList, function(i, data) {
      var values = {min: data.param.min, max: data.param.max, val: data.param.val};
      data.value.text(values.val + (data.param.percent ? "%" : ""));
      data.slider.slider({
        value: values.val,
        min: values.min,
        max: values.max,
      });
      var len = (values.max - values.min) / (data.param.step || 1);
      if (len <= 5) {
        data.slider.css("width", len * 40);
      } else {
        data.slider.css("width", "");
      }
      var shown = values.min !== values.max && (info.active !== false || data.param.buffs === false) && !noBuffs;
      anyLines = anyLines || shown;
      if (shown && data.param.show) {
        if (self.type === "skill") {
          shown = data.param.show.call(info, self.skill[1], stats);
        } else {
          shown = data.param.show.call(info, stats);
        }
      }
      data.line.toggle(!!shown);
    });
    this.params.toggle(anyLines);

    var effects, curInfo;

    var curInfo = this.getCurInfo(info, stats);

    if (curInfo) {
      var results = DC.skill_processInfo(curInfo, {affix: (info.affixid || this.affix), params: info.params, skill: this.skill});
      this.skillData = results;
      if (!this.info) {
        this.info = $("<ul></ul>").addClass("skill-info");
        if (this.type !== "skill" || !this.skill) {
          this.desc.append(this.info);
        } else {
          this.line.append(this.info);
        }
        this.info.click(function() {
          return false;
        });
      }
      this.info.empty();
      $.each(results, function(stat, value) {
        var out = $("<span><b>" + _L(stat) + ":</b> " + value.text + "</span>");
        if (value.tip) {
          out.mouseover(function() {
            DC.tooltip.showHtml(this, value.tip);
            return false;
          }).mouseleave(function() {
            DC.tooltip.hide();
          });
        }
        self.info.append($("<li></li>").append(out));
      });
    } else if (this.info) {
      this.info.remove();
      delete this.info;
      delete this.skillData;
    }
  };

  DC.SkillBox = {};

  DC.SkillBox.skill = inherits(SkillBoxBase, {
    constructor: function(parent, index) {
      this.type = "skill";
      this.index = index;
      this.level = [1, 2, 4, 9, 14, 19][index];
      this.uber(parent);
    },
    initHeader: function() {
      if (this.index !== undefined) this.line.append("<span class=\"skill-key skill-key-" + this.index + "\"></span>");
      this.header = $("<span class=\"skill-header\"></span>");
      this.icon = $("<span class=\"skill-icon\"></span>");
      this.icon.append("<span class=\"skill-frame\"></span>");
    },
    initName: function() {
      this.apply = $("<label class=\"skill-bonus\">" + _L("Include in stats") + "</label>");
      this.header.after(this.apply);
      this.line.append(this.params);
    },
    init: function() {
      this.setSkill();
      var self = this;
      this.header.mouseover(function() {
        if (self.skill && DC.skills[DC.charClass][self.skill[0]]) {
          DC.tooltip.showSkill(this, DC.charClass, self.skill[0], self.skill[1]);
        } else {
          var info = self.getInfo();
          if (info) {
            DC.tooltip.showAttack(this, info);
          }
        }
      });
      this.applybox.change(function() {
        var info = (self.skill && DC.skills[DC.charClass][self.skill[0]]);
        if (info) {
          info.active = this.checked;
          DC.trigger("updateSkills");
        }
      });
    },
    getInfo: function() {
      if (!this.skill && this.index !== undefined && this.index <= 1) {
        var mh = DC.itemSlots.mainhand.item;
        mh = (mh && DC.itemById[mh.id] && DC.itemById[mh.id].type);
        mh = (mh && DC.itemTypes[mh].attack || "hand");
        return DC.skills.attack[mh];
      }
      return this.skill && DC.skills[DC.charClass][this.skill[0]];
    },
    setSkill: function(skill) {
      this.skill = skill;
      this.desc.empty();
      var info = this.getInfo();
      if (this.info) {
        this.line.append(this.info);
      }
      if (info) {
        this.icon.removeClass("empty");
        if (info.row !== undefined) {
          this.icon.removeClass("skill-icon-attack");
          this.icon.css("background-position", (-info.col * 42) + "px " + (-info.row * 84) + "px");
        } else {
          this.icon.addClass("skill-icon-attack").addClass(info.id);
          this.icon.css("background-position", "");
        }
        this.desc.append("<span class=\"skill-name\">" + info.name + "</span>");
        this.desc.append("<span class=\"skill-separator\"></span>");
        if (skill) {
          this.desc.append("<span class=\"skill-rune\"><span class=\"skill-rune-" + skill[1] + "\"></span> " + (skill[1] === "x" ? _L("No Rune") : info.runes[skill[1]]) + "</span>");
        } else {
          this.desc.append(this.info);
        }
      } else {
        this.icon.addClass("empty");
        this.icon.removeClass("skill-icon-attack");
        this.desc.append("<span class=\"skill-none\">" + _L("Choose Skill") + "</span>");
        this.desc.append("<span class=\"skill-separator\"></span>");
      }
      this.updateParams();
    },
    _set: function(skill) {
      this.setSkill(skill);
    },
    updateBox: function(info, stats) {
      this.applybox.prop("checked", info.active !== false);
      this.apply.toggle(!!(info.activeshow ? info.activeshow(this.skill[1], stats) : DC.getSkillBonus(this.skill, stats)));
    },
    getCurInfo_: function(info, stats) {
      if (typeof info.info === "function") {
        return info.info(this.skill[1], stats);
      } else if (info.info && this.skill) {
        var val = info.info[this.skill[1]];
        if (info.info["*"]) {
          val = $.extend({}, info.info["*"], val);
        }
        return val;
      } else if (info.info) {
        return info.info;
      }
    },
  });

  DC.SkillBox.passive = inherits(SkillBoxBase, {
    constructor: function(parent, index) {
      this.type = "passive";
      this.index = index;
      if (index >= 0) {
        this.level = [10, 20, 30, 70][index];
      } else {
        this.readonly = true;
      }
      this.uber(parent);
    },
    initHeader: function() {
      this.header = $("<span class=\"passive-header\"></span>");
      this.icon = $("<span class=\"passive-icon\"></span>");
      this.icon.append("<span class=\"passive-frame\"></span>");
    },
    init: function() {
      this.setPassive();
      var self = this;
      this.header.mouseover(function() {
        if (self.passive && DC.passives[DC.charClass][self.passive]) {
          DC.tooltip.showSkill(this, DC.charClass, self.passive);
        }
      });
      this.applybox.click(function(evt) {
        var info = (self.passive && DC.passives[DC.charClass][self.passive]);
        if (info) {
          info.active = this.checked;
          DC.trigger("updateSkills");
        }
        evt.stopPropagation();
      });
    },
    getInfo: function() {
      return this.passive && DC.passives[DC.charClass][this.passive];
    },
    setPassive: function(passive) {
      this.passive = passive;
      var info = (passive && DC.passives[DC.charClass][passive]);
      if (info) {
        this.applybox.prop("checked", info.active !== false);
        this.icon.removeClass("empty");
        this.icon.css("background-position", (-info.index * 42) + "px 0");
        this.name.removeClass().addClass("skill-name").text(info.name);
      } else {
        this.icon.addClass("empty");
        this.name.removeClass().addClass("skill-none").text(_L("Choose Skill"));
      }
      this.updateParams();
    },
    _set: function(passive) {
      this.setPassive(passive);
    },
    updateBox: function(info, stats) {
      var bonus = DC.getPassiveBonus(this.passive, stats);
      this.apply.toggleClass("always", info.active === undefined);
      this.applybox.prop("disabled", info.active === undefined);
      this.applybox.prop("checked", info.active !== false);
      this.apply.toggle(!!bonus);
    },
    getCurInfo_: function(info, stats) {
      if (typeof info.info === "function") {
        return info.info(stats);
      } else {
        return info.info;
      }
    },
  });

  DC.SkillBox.gem = inherits(SkillBoxBase, {
    constructor: function(parent, gem) {
      this.type = "gem";
      this.gem = gem;
      this.readonly = true;
      this.uber(parent);
    },
    getInfo: function() {
      return this.gem && DC.legendaryGems[this.gem];
    },
    init: function() {
      var info = DC.legendaryGems[this.gem];
      this.applybox.prop("disabled", !!info.always);
      this.apply.toggleClass("always", !!info.always);
      this.apply.toggle(info.always || info.active !== undefined);
      this.icon.css("background-image", "url(" + DC.getItemIcon(this.gem) + ")");

      var self = this;
      this.header.mouseover(function() {
        if (self.gem) {
          DC.tooltip.showGem(this, self.gem, DC.getStats().gems[self.gem]);
        }
      });
      this.applybox.click(function(evt) {
        var info = (self.gem && DC.legendaryGems[self.gem]);
        if (info) {
          info.active = this.checked;
          DC.trigger("updateSkills");
        }
        evt.stopPropagation();
      });
    },
    updateBox: function(info, stats) {
      var noBuffs = false;
      if (info.check && typeof info.buffs === "function") {
        var result = info.buffs(stats.gems[this.gem] || 0, stats);
        this.apply.toggle(!!result);
        if (!result) noBuffs = true;
      } else {
        var effect = !!info.effects[0].stat;
        if (stats.gems[this.gem] && stats.gems[this.gem] >= 25) {
          effect = (effect || !!info.effects[1].stat);
        }
        this.apply.toggle(effect);
      }
      this.applybox.prop("checked", !!(info.always || info.active));
      this.name.html(info.name + (stats.gems[this.gem] ? " <span class=\"gem-rank\">&#x2013; " + _L("Rank {0}").format(stats.gems[this.gem]) + "</span>" : ""));
      return noBuffs;
    },
    getCurInfo_: function(info, stats) {
      if (typeof info.info === "function") {
        return info.info(stats.gems[this.gem], stats);
      } else {
        return info.info;
      }
    },
  });

  DC.SkillBox.affix = inherits(SkillBoxBase, {
    constructor: function(parent, affix) {
      this.type = "affix";
      this.affix = affix;
      this.readonly = true;
      this.uber(parent);
    },
    init: function() {
      var info = DC.itemaffixes[this.affix];
      this.apply.toggle(info.active !== undefined);

      var self = this;
      this.header.mouseover(function() {
        var stats = DC.getStats();
        if (stats.affixes[self.affix]) {
          DC.tooltip.showItem(this, stats.affixes[self.affix].slot);
        }
      });
      this.applybox.click(function(evt) {
        var info = (self.affix && DC.itemaffixes[self.affix]);
        if (info) {
          info.active = this.checked;
          DC.trigger("updateSkills");
        }
        evt.stopPropagation();
      });

      if (info.boxnames) {
        this.boxes = [];
        this.boxlabels = [];
        for (var i = 0; i < info.boxnames.length; ++i) {
          var box = $("<input type=\"checkbox\"></input>");
          var boxlabel = $("<label class=\"passive-apply\">" + _L(info.boxnames[i]) + "</label>").prepend(box);
          this.boxes.push(box);
          this.boxlabels.push(boxlabel);
          this.params.before(boxlabel);
          boxlabel.toggle(info.active !== false);
          box.click((function(i) {return function() {
            info.boxvals[i] = $(this).prop("checked");
            DC.trigger("updateSkills");
          };})(i));
        }
      }
    },
    getInfo: function() {
      return this.affix && DC.itemaffixes[this.affix];
    },
    updateBox: function(info, stats) {
      this.applybox.prop("checked", info.active === true);

      var itemid = DC.getSlotId(stats.affixes[this.affix].slot);
      var item = DC.itemById[itemid];
      if (item) this.icon.css("background-image", "url(" + DC.getItemIcon(item.id) + ")");
      if (stats.affixes[this.affix].set) {
        var title = DC.itemSets[stats.affixes[this.affix].set].name;
        if (stats.affixes[this.affix].pieces) {
          title += " <span class=\"gem-rank\">&#x2013; " + _L("{0} pieces").format(stats.affixes[this.affix].pieces) + "</span>";
        }
        this.name.html(title);
      } else if (item) {
        this.name.text(item.name);
      }

      if (this.boxlabels) {
        for (var i = 0; i < this.boxlabels.length; ++i) {
          this.boxlabels[i].toggle(info.active !== false);
        }
      }
    },
    getCurInfo_: function(info, stats) {
      if (typeof info.info === "function") {
        return info.info(stats.affixes[this.affix].value, stats);
      } else {
        return info.info;
      }
    },
  });

  DC.SkillBox.kanai = inherits(SkillBoxBase, {
    constructor: function(parent, kanai) {
      this.type = "kanai";
      this.kanai = kanai;
      this.readonly = true;
      this.uber(parent);
    },
    init: function() {
      var self = this;

      this.onInner = false;
      this.namebox = $("<select class=\"skill-namelist empty\"></select>");
      this.fillnames();
      this.desc.addClass("chosen-noframe");
      this.name.replaceWith(this.namebox);
      this.namebox.chosen({
        disable_search_threshold: 10,
        inherit_select_classes: true,
        allow_single_deselect: true,
        search_contains: true,
        placeholder_text_single: _L("Choose {0}").format(kanaiTypes[this.kanai].name),
        populate_func: function() {self.fillnames();},
      }).change().change(function() {
        self.onChangeItem();
        DC.trigger("updateSkills");
      });
      DC.chosenTips(this.namebox, function(id) {
        if (DC.itemById[id]) {
          self.onInner = true;
          var item = DC.itemById[id];
          var args = item.required.custom.args;
          if (args === undefined) args = 1;
          if (args === 1) {
            if (item.required.custom.best === "min") {
              args = [item.required.custom.min || 1];
            } else {
              args = [item.required.custom.max || 1];
            }
          } else {
            args = undefined;
          }
          DC.tooltip.showItem(this, id, args);
        }
      });
      DC.chosen_addIcons(this.namebox, function(id) {
        var item = DC.itemById[id];
        if (!item) return;
        var icons = DC.itemIcons;
        var icon = (icons ? icons[id] : undefined);
        if (icon !== undefined) {
          return "<span style=\"background: url(css/items/" + item.type + ".png) 0 -" + (24 * icon[0]) + "px no-repeat\"></span>";
        }
      });
      DC.chosen_fixSearch(this.namebox, function(id, callback) {
        var item = DC.itemById[id];
        if (!item) return;
        if (callback(item.name)) return true;
        if (item.required && item.required.custom && callback(item.required.custom.format)) {
          return true;
        }
      });

      this.setItemEffect();
      this.header.mouseover(function() {
        if (self.onInner) {
          self.onInner = false;
          return true;
        }
        var id = self.namebox.val();
        if (DC.itemById[id]) {
          var item = DC.itemById[id];
          var args = item.required.custom.args;
          if (args === undefined) args = 1;
          if (args === 1) {
            if (item.required.custom.best === "min") {
              args = [item.required.custom.min || 1];
            } else {
              args = [item.required.custom.max || 1];
            }
          } else {
            args = undefined;
          }
          DC.tooltip.showItem(this, id, args);
        }
      });
      this.applybox.click(function(evt) {
        var info = self.getInfo();
        if (info) {
          info.active = this.checked;
          DC.trigger("updateSkills");
        }
        evt.stopPropagation();
      });
    },
    fillnames: function() {
      var self = this;
      var prev = this.namebox.val();
      this.namebox.empty();
      this.namebox.append("<option value=\"\">" + (DC.noChosen ?
        _L("Choose {0}").format(kanaiTypes[this.kanai].name) : "") + "</option>");
      var groups = {};
      $.each(DC.items, function(index, item) {
        if (!item.required || !item.required.custom || item.required.custom.cube === false) return;
        if (DC.options.hideLegacy && item.suffix === _L("Legacy")) return;
        var customId = item.required.custom.id;
        if (item.classes && item.classes.indexOf(DC.charClass) < 0) return;
        var type = DC.itemTypes[item.type];
        if (type.classes && type.classes.indexOf(DC.charClass) < 0) return;
        if (DC.itemPowerClasses && DC.itemPowerClasses[customId] &&
          DC.itemPowerClasses[customId] !== DC.charClass) return;
        if (!kanaiTypes[self.kanai].filter(item.type)) return;
        if (item.required.custom.args < 0) return;
        if (!groups[item.type]) {
          groups[item.type] = [];
        }
        groups[item.type].push(item)
      });
      for (var type in groups) {
        var grp = "<optgroup label=\"" + DC.itemTypes[type].name + "\">";
        groups[type].sort(function(a, b) {return a.name.localeCompare(b.name);});
        for (var i = 0; i < groups[type].length; ++i) {
          var item = groups[type][i];
          var selected = "";
          if (item.id === prev) {
            selected = "\" selected=\"selected";
          }
          grp += "<option class=\"item-info-icon quality-" + (item.quality || "rare") +
            "\" value=\"" + item.id + selected + "\">" + item.name + (item.suffix ? " (" + item.suffix + ")" : "") + "</option>";
        }
        this.namebox.append(grp + "</optgroup");
      }
    },
    getInfo: function() {
      return kanaiCache[this.namebox.val()];
    },
    onChangeItem: function() {
      if (this.boxlabels) {
        for (var i = 0; i < this.boxlabels.length; ++i) {
          this.boxlabels[i].remove();
        }
        delete this.boxlabels;
      }
      var id = this.namebox.val();
      var item = DC.itemById[id];
      var box = this.namebox;
      if (!DC.noChosen) box = box.next();
      box.toggleClass("empty", !item);
      if (item) {
        this.icon.css("background-image", "url(" + DC.getItemIcon(id) + ")");
        this.icon.show();
      } else {
        this.icon.hide();
        this.apply.hide();
        this.updateParams();
        return;
      }
      var affix = (item.required && item.required.custom);
      if (affix && DC.itemaffixes[affix.id]) {
        this.apply.toggle(DC.itemaffixes[affix.id].active !== undefined);
      }
      var info = kanaiCache[id];
      if (!info) {
        info = {};
        if (affix && DC.itemaffixes[affix.id]) {
          info = DC.itemaffixes[affix.id];
          info.affixid = affix.id;
        }
        kanaiCache[id] = info;
      }
      if (info.boxnames) {
        this.boxes = [];
        this.boxlabels = [];
        for (var i = 0; i < info.boxnames.length; ++i) {
          var box = $("<input type=\"checkbox\"></input>");
          var boxlabel = $("<label class=\"passive-apply\">" + _L(info.boxnames[i]) + "</label>").prepend(box);
          this.boxes.push(box);
          this.boxlabels.push(boxlabel);
          this.params.before(boxlabel);
          boxlabel.toggle(info.active !== false);
          box.click((function(i) {return function() {
            info.boxvals[i] = $(this).prop("checked");
            DC.trigger("updateSkills");
          };})(i));
        }
      }
      this.updateParams();
    },
    setItemEffect: function(id) {
      this.namebox.val(id);
      this.namebox.trigger("chosen:updated");
      this.onChangeItem();
    },
    getItemPair: function() {
      var id = this.namebox.val();
      if (!DC.itemById[id]) return;
      return id;
    },
    setItemPair: function(ip) {
      if (ip instanceof Array) {
        this.setItemEffect(ip[0]);
      } else {
        this.setItemEffect(ip);
      }
    },
    getItemAffix: function() {
      var item = DC.itemById[this.namebox.val()];
      return item && item.required && item.required.custom && item.required.custom.id;
    },
    getItemAffixValue: function() {
      var item = DC.itemById[this.namebox.val()];
      var args = item.required.custom.args;
      if (args === undefined) args = 1;
      if (args === 1) {
        if (item.required.custom.best === "min") {
          return item.required.custom.min || 1;
        } else {
          return item.required.custom.max || 1;
        }
      } else {
        return 1;
      }
    },
    updateBox: function(info, stats) {
      this.applybox.prop("checked", info.active === true);
      this.shown = true;
      if (!info.info && info.active === undefined && !info.params) this.shown = false;
      if (info.check) {
        this.shown = false;
        var value = [this.getItemAffixValue()];
        if (typeof info.info === "function") {
          if (info.info(value, stats)) this.shown = true;
        } else if (info.info) {
          this.shown = true;
        }
        if (info.active !== undefined || info.params) {
          if (typeof info.buffs === "function") {
            if (info.buffs(value, stats)) this.shown = true;
          } else if (info.buffs) {
            this.shown = true;
          }
        }
      }
      this.apply.toggle(this.shown && info.active !== undefined);
      if (!this.shown) {
        this.params.hide();
        if (this.info) {
          this.info.remove();
          delete this.info;
        }
        return;
      }
      if (this.boxlabels) {
        for (var i = 0; i < this.boxlabels.length; ++i) {
          this.boxlabels[i].toggle(info.active !== false);
        }
      }
    },
    getCurInfo_: function(info, stats) {
      if (typeof info.info === "function") {
        return info.info(stats[info.affixid], stats);
      } else {
        return info.info;
      }
    },
  });

  DC.SkillBox.buff = inherits(SkillBoxBase, {
    constructor: function(parent, buff) {
      this.type = "buff";
      this.buff = buff;
      this.readonly = true;
      this.uber(parent);
    },
    initHeader: function() {
      if (this.buff.type === "skill" || this.buff.type === "custom") {
        DC.SkillBox.skill.prototype.initHeader.call(this);
      } else if (this.buff.type === "passive") {
        DC.SkillBox.passive.prototype.initHeader.call(this);
      } else {
        this.uber.prototype.initHeader.call(this);
      }
    },
    initName: function() {
      if (this.buff.type === "skill") {
        DC.SkillBox.skill.prototype.initName.call(this);
      } else {
        this.uber.prototype.initName.call(this);
      }
    },
    init: function() {
      var onInner = false;
      var self = this;
      if (this.buff.type === "skill") {
        var skill = DC.skills[this.buff.charClass][this.buff.id];
        this.icon.removeClass("empty");
        this.icon.css("background-position", (-skill.col * 42) + "px " + (-skill.row * 84) + "px");
        this.desc.append("<span class=\"skill-name\">" + skill.name + "</span>");
        this.desc.append("<span class=\"skill-separator\"></span>");
        if (this.buff.multiple) {
          this.header.removeClass("skill-header").addClass("passive-header");
          this.runebox = {};
          for (var rune in this.buff.runes) {
            this.runebox[rune] = $("<input type=\"checkbox\"></input>").click((function(rune) {return function() {
              self.buff.runevals[rune] = $(this).prop("checked");
              DC.trigger("updateSkills");
            };})(rune));
            this.desc.append($("<label class=\"rune-box\"></label>").append(this.runebox[rune],
                "<span class=\"skill-rune\"><span class=\"skill-rune-" + this.buff.runelist + "\"></span> " + this.buff.runes[rune] + "</span>")
              .mouseover((function(rune) {return function() {
                DC.tooltip.showSkill(this, self.buff.charClass, self.buff.id, rune, true);
                return false;
              };})(rune)).mouseleave(function() {
                DC.tooltip.hide();
              })
            );
          }
          this.apply.hide();
        } else if (this.buff.runelist.length > 1 || this.buff.runelist === "*") {
          this.runebox = $("<select class=\"skill-runelist\"></select>");
          for (var rune in this.buff.runes) {
            this.runebox.append("<option class=\"skill-rune-option rune-" + rune + "\" value=\"" + rune + "\">" + this.buff.runes[rune] + "</option>");
          }
          this.desc.addClass("chosen-noframe");
          this.desc.append(this.runebox);
          var prevRune = undefined;
          this.runebox.chosen({
            disable_search: true,
            inherit_select_classes: true,
          }).change(function() {
            var span = $(this).next().find("span").first();
            if (prevRune) span.removeClass(prevRune);
            prevRune = "rune-" + $(this).val();
            span.addClass("skill-rune-option " + prevRune);
          }).change().change(function() {
            self.buff.runevals = $(this).val();
            DC.trigger("updateSkills");
          });
          DC.chosenTips(this.runebox, function(rune) {
            if (rune != "*") {
              onInner = true;
              DC.tooltip.showSkill(this, self.buff.charClass, self.buff.id, rune, true);
            }
          });
        } else if (1 || this.buff.runelist !== "x") {
          this.desc.append("<span class=\"skill-rune\"><span class=\"skill-rune-" + this.buff.runelist + "\"></span> " + this.buff.runes[this.buff.runelist] + "</span>");
        }
        this.header.mouseover(function() {
          if (!self.buff.multiple) {
            if (onInner) {
              onInner = false;
              return true;
            }
            DC.tooltip.showSkill(this, self.buff.charClass, self.buff.id, self.runebox ? self.runebox.val() : self.buff.runelist);
          } else {
            DC.tooltip.showSkill(this, self.buff.charClass, self.buff.id);
          }
        });
      } else if (this.buff.type === "passive") {
        var skill = DC.passives[this.buff.charClass][this.buff.id];
        this.icon.removeClass("empty");
        this.icon.css("background-position", (-skill.index * 42) + "px 0");
        this.name.removeClass().addClass("skill-name").text(skill.name);
        this.header.mouseover(function() {
          DC.tooltip.showSkill(this, self.buff.charClass, self.buff.id);
        });
      } else if (this.buff.type === "affix") {
        var item = DC.itemById[this.buff.item];
        if (item) {
          this.icon.css("background-image", "url(" + DC.getItemIcon(item.id) + ")");
          this.name.text(item.name);
          this.header.mouseover(function() {
            var custom = undefined;
            if (self.buff.params) {
              custom = [self.buff.params[0].val];
            }
            DC.tooltip.showItem(this, item.id, custom);
          });
        }
      } else if (this.buff.type === "gem") {
        this.icon.css("background-image", "url(" + DC.getItemIcon(this.buff.id) + ")");
        this.name.text(DC.legendaryGems[this.buff.id].name);
        this.header.mouseover(function() {
          DC.tooltip.showGem(this, self.buff.id, 25);
        });
      } else if (this.buff.type === "custom") {
        this.icon.removeClass("empty");
        this.icon.css("background-position", (-this.buff.icon * 42) + "px 0");
        this.name.removeClass().addClass("skill-name").text(this.buff.name);
        this.header.mouseover(function() {
          DC.tooltip.showCustomSkill(this, self.buff);
        });
      }
      this.applybox.prop("checked", this.buff.active);
      this.applybox.change(function() {
        self.buff.active = this.checked;
        if (self.boxlabels) {
          for (var i = 0; i < self.boxlabels.length; ++i) {
            self.boxlabels[i].toggle(this.checked);
          }
        }
        if (self.buff.params) {
          self.params.toggle(this.checked);
        }
        DC.trigger("updateSkills");
      });
      if (this.buff.boxnames) {
        this.boxes = [];
        this.boxlabels = [];
        for (var i = 0; i < this.buff.boxnames.length; ++i) {
          var box = $("<input type=\"checkbox\"></input>");
          var boxlabel = $("<label class=\"" + (this.buff.type === "skill" ? "skill-bonus" : "passive-apply") + "\">" + _L(this.buff.boxnames[i]) + "</label>").prepend(box);
          this.boxes.push(box);
          this.boxlabels.push(boxlabel);
          this.params.before(boxlabel);
          boxlabel.toggle(this.buff.active !== false || this.buff.multiple);
          box.click((function(i) {return function() {
            self.buff.boxvals[i] = $(this).prop("checked");
            DC.trigger("updateSkills");
          };})(i));
        }
      }
      //this.updateParams();
      //if (this.buff.params) {
      //  this.params.toggle(this.buff.active);
      //}
      this.updateBoxes();
    },
    updateBoxes: function() {
      this.apply.toggle(!this.buff.multiple && this.buff.active !== undefined);
      if (!this.buff.multiple) {
        this.applybox.prop("checked", !!this.buff.active);
        if (this.runebox) {
          this.runebox.val(this.buff.runevals).trigger("chosen:updated");
        }
      } else {
        for (var id in this.runebox) {
          this.runebox[id].prop("checked", !!this.buff.runevals[id]);
        }
      }
      if (this.boxlabels) {
        for (var i = 0; i < this.boxlabels.length; ++i) {
          this.boxlabels[i].toggle(this.buff.active !== false || !!this.buff.multiple);
        }
      }
      if (this.boxes) {
        for (var i = 0; i < this.boxes.length; ++i) {
          this.boxes[i].prop("checked", !!(this.buff.boxvals && this.buff.boxvals[i]));
        }
      }
      if (this.buff.params) {
        this.params.toggle(this.buff.active !== false || !!this.buff.multiple);
      }
      this.updateParams();
    },
    getInfo: function() {
      return this.buff;
    },
    onChangeParam: function() {
      if (this.buff && this.buff.type === "affix" && DC.tooltip.getNode() === this.header[0]) {
        DC.tooltip.showItem(this.header[0], this.buff.item, [this.buff.params[0].val]);
      }
    },
  });

})();
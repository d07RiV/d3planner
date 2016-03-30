(function() {
  var _L = DiabloCalc.locale("ui-skills.js");

  var tab = $("#tab-skills");
  tab = DiabloCalc.addScroll(tab, "y");

  var showElites = $("<input></input>").attr("type", "checkbox").change(function() {
    bossLabel.toggle(!!this.checked);
    DiabloCalc.trigger("updateStats");
  });
  var targetBoss = $("<input></input>").attr("type", "checkbox").change(function() {
    DiabloCalc.trigger("updateStats");
  });
  var targetType = $("<select></select>");
  targetType.append("<option value=\"\">" + _L("Generic") + "</option>");
  targetType.append("<option value=\"demons\">" + _L("Demon") + "</option>");
  targetType.append("<option value=\"beasts\">" + _L("Beast") + "</option>");
  targetType.append("<option value=\"humans\">" + _L("Human") + "</option>");
  targetType.append("<option value=\"undead\">" + _L("Undead") + "</option>");
  var bossLabel = $("<label style=\"margin-left: 8px\">" + _L("Boss") + "</label>").prepend(targetBoss).hide();
  DiabloCalc.addOption("showElites", function() {return showElites.prop("checked");}, function(x) {
    showElites.prop("checked", x);
    bossLabel.toggle(!!x);
  });
  DiabloCalc.addOption("targetBoss", function() {return targetBoss.prop("checked");}, function(x) {
    targetBoss.prop("checked", x);
    DiabloCalc.trigger("updateStats");
  });
  DiabloCalc.addOption("targetType", function() {return targetType.val();}, function(x) {
    targetType.val(x);
    targetType.trigger("chosen:updated");
    DiabloCalc.trigger("updateStats");
  });
  tab.append($("<span class=\"option-box\">" + _L("Target: ") + "</span>").append(
    targetType,
    $("<label style=\"margin-left: 8px\">" + _L("Elite") + "</label>").prepend(showElites),
    bossLabel
  ));
  targetType.change(function() {
    DiabloCalc.trigger("updateStats");
  });
/*  targetType.chosen({
    disable_search: true,
    width: 80,
  }).change(onUpdateStats);*/

  var skillSection;
  var kanaiSection;
  var buffSection;
  var skills = [];
  var passives = [];
  var buffTabs = [];
  var kanai = {};
  var extraPassive;
  var gemSection;
  var itemSection;

  function SkillPopup() {
    this.enable = function(skill, flag) {
      var info = DiabloCalc.skills[DiabloCalc.charClass][skill];
      this.skills[skill].css("background-position", (-42 * info.col) + "px " + (-84 * info.row - (flag ? 0 : 42)) + "px");
    };
    this.selectRune = function(rune) {
      if (this.rune) {
        this.runes[this.rune].removeClass("selected");
      }
      this.selRune = rune;
      if (this.rune) {
        this.runes[this.rune].addClass("selected");
      }
    };
    this.onRuneClicked = function(rune) {
      if (this.slot && this.rune !== rune) {
        this.slot.setSkill([this.skill, rune]);
        DiabloCalc.trigger("updateSkills", true);
      }
      this.hide();
    };
    this.selectSkill = function(skill) {
      //if (skill) asdfads.fasdf = 0;
      this.popup.toggleClass("expanded", !!skill);
      if (this.skill) {
        this.skills[this.skill].removeClass("selected");
        this.enable(this.skill, true);
      }
      this.skill = skill;
      if (this.skill) {
        this.skills[this.skill].addClass("selected");
        this.enable(this.skill, false);
      }

      if (!this.runeList) return;
      this.selectRune();
      this.runeList.empty();
      this.runes = {};
      if (!skill) return;
      var self = this;
      var info = DiabloCalc.skills[DiabloCalc.charClass][skill];
      this.runes.x = $("<span class=\"skill-popup-rune-line\"><span class=\"skill-popup-rune-x\"></span>" + _L("No Rune") + "</span>");
      this.runes.x.hover(function() {
        DiabloCalc.tooltip.showSkill(this, DiabloCalc.charClass, skill);
      }, function() {
        DiabloCalc.tooltip.hide();
      }).click(function() {
        self.onRuneClicked("x");
      });
      this.runeList.append(this.runes.x);
      $.each(info.runes, function(rune, name) {
        self.runes[rune] = $("<span class=\"skill-popup-rune-line\"><span class=\"skill-popup-rune-" + rune + "\"></span>" + name + "</span>");
        self.runes[rune].hover(function() {
          DiabloCalc.tooltip.showSkill(this, DiabloCalc.charClass, skill, rune, true);
        }, function() {
          DiabloCalc.tooltip.hide();
        }).click(function() {
          self.onRuneClicked(rune);
        });
        self.runeList.append(self.runes[rune]);
      });
      self.selectRune("x");
    };
    this.onSkillClicked = function(skill) {
      if (this.skill == skill) return;
      if (this.slot && !this.disabled[skill]) {
        this.selectSkill(skill);
        this.slot.setSkill([this.skill, "x"]);
        DiabloCalc.trigger("updateSkills", true);
      }
    };
    this.hide = function() {
      this.selectSkill();
      if (this.slot) {
        this.slot.line.removeClass("selected");
        this.prevSlot = this.slot;
        setTimeout(function(self) {
          setTimeout(function(self) {
            self.prevSlot = undefined;
          }, 0, self);
        }, 0, this);
      }
      this.slot = undefined;
      this.popup.removeClass("expanded");
      this.popup.hide();
      DiabloCalc.tooltip.hide();
      DiabloCalc.hidePopup(this);
    };
    this.show = function(slot, evt) {
      if (slot === this.prevSlot) {
        this.hide();
        return;
      }
      this.hide();
      this.slot = slot;
      slot.line.addClass("selected");
      if (evt) {
        this.popup.css("left", evt.pageX + 20);
        this.popup.css("top", Math.max(60, evt.pageY - 300));
      } else {
        var offs = slot.header.offset();
        this.popup.css("left", offs.left + slot.header.width() - 250);
        this.popup.css("top", Math.max(60, offs.top + slot.header.height() - 300));
      }
      this.disabled = {};
      for (var i = 0; i < skills.length; ++i) {
        if (skills[i] !== slot && skills[i].skill) {
          this.disabled[skills[i].skill[0]] = true;
        }
      }
      for (var sk in this.skills) {
        if (slot === skills[0] && DiabloCalc.skills[DiabloCalc.charClass][sk].nolmb) {
          this.disabled[sk] = true;
        }
        this.enable(sk, !this.disabled[sk]);
      }
      if (slot.skill) {
        this.selectSkill(slot.skill[0]);
        this.selectRune(slot.skill[1]);
      }
      this.popup.show();
      this.popup.focus();
      DiabloCalc.showPopup(this, true);
    };

    this.setClass = function(charClass) {
      this.popup.empty();
      this.skills = {};
      this.popup.removeClass().addClass("skill-popup class-" + charClass);
      var self = this;
      $.each(DiabloCalc.skills[charClass], function(id, skill) {
        self.skills[id] = $("<span class=\"skill-icon skill-button\"><span class=\"skill-frame\"></span></span>").css({
          "background-position": (-42 * skill.col) + "px " + (-84 * skill.row) + "px",
          "left": 10 + 48 * skill.col, "top": 10 + 48 * skill.row,
        }).click(function() {
          self.onSkillClicked(id);
        }).hover(function() {
          DiabloCalc.tooltip.showSkill(this, charClass, id);
        }, function() {
          DiabloCalc.tooltip.hide();
        });
        DiabloCalc.enableTouch(self.skills[id]);
        self.popup.append(self.skills[id]);
      });
      this.runeList = $("<div class=\"rune-list\"></div>");
      this.popup.append(this.runeList);
    };

    this.contains = function(t) {
      if (this.popup.is(t) || this.popup.has(t).length) return true;
      return false;
    };

    this.popup = $("<div class=\"skill-popup\" tabIndex=\"-1\"></div>").hide();
    this.skills = {};
    this.disabled = {};
    this.runes = {};
    $("body").append(this.popup);
  }

  function PassivePopup() {
    this.hide = function() {
      if (this.slot) {
        this.slot.line.removeClass("selected");
        this.prevSlot = this.slot;
        setTimeout(function(self) {
          setTimeout(function(self) {
            self.prevSlot = undefined;
          }, 0, self);
        }, 0, this);
      }
      this.slot = undefined;
      this.popup.hide();
      DiabloCalc.tooltip.hide();
      DiabloCalc.hidePopup(this);
    };
    this.show = function(slot, evt) {
      if (slot === this.prevSlot) {
        this.hide();
        return;
      }
      this.hide();
      this.slot = slot;
      slot.line.addClass("selected");
      if (evt) {
        this.popup.css("left", evt.pageX + 20);
        this.popup.css("top", Math.max(60, evt.pageY - this.height));
      } else {
        var offs = slot.header.offset();
        this.popup.css("left", offs.left + slot.header.width() - 185);
        this.popup.css("top", Math.max(60, offs.top + slot.header.height() - this.height));
      }
      this.disabled = {};
      for (var i = 0; i < passives.length; ++i) {
        if (passives[i].passive) {
          this.disabled[passives[i].passive] = true;
        }
      }
      for (var sk in this.passives) {
        var x = -42 * DiabloCalc.passives[DiabloCalc.charClass][sk].index;
        this.passives[sk].toggleClass("selected", !!this.disabled[sk]);
        this.passives[sk].css("background-position", x + "px " + (this.disabled[sk] ? -42 : 0) + "px");
      }
      this.popup.show();
      this.popup.focus();
      DiabloCalc.showPopup(this, true);
    };
    this.onClick = function(passive) {
      if (this.slot && !this.disabled[passive]) {
        this.slot.setPassive(passive);
        DiabloCalc.trigger("updateSkills", true);
        this.hide();
      }
    };

    this.setClass = function(charClass) {
      this.popup.empty();
      this.passives = {};
      this.popup.removeClass().addClass("passive-popup class-" + charClass);
      var count = Object.keys(DiabloCalc.passives[charClass]).length;
      this.height = 59 * Math.ceil(count / 3) + 12;
      this.popup.css("height", this.height);
      var self = this;
      $.each(DiabloCalc.passives[charClass], function(id, info) {
        var icon = $("<span class=\"passive-icon passive-button\"><span class=\"passive-frame\"></span></span>")
          .css("background-position", (-42 * info.index) + "px 0");
        if (info.index >= Math.floor(count / 3) * 3) {
          var last = count % 3;
          if (last == 1) {
            icon.css("left", 74);
          } else {
            icon.css("left", 45 + 59 * (info.index % 3));
          }
        } else {
          icon.css("left", 15 + 59 * (info.index % 3));
        }
        icon.css("top", 15 + 59 * Math.floor(info.index / 3));
        icon.click(function() {
          self.onClick(id);
        }).hover(function() {
          DiabloCalc.tooltip.showSkill(this, charClass, id);
        }, function() {
          DiabloCalc.tooltip.hide();
        });

        self.passives[id] = icon;
        DiabloCalc.enableTouch(icon);
        self.popup.append(icon);
      });
    };

    this.contains = function(t) {
      if (this.popup.is(t) || this.popup.has(t).length) return true;
      return false;
    };

    this.popup = $("<div class=\"passive-popup\" tabIndex=\"-1\"></div>").hide();
    this.passives = {};
    this.disabled = {};
    $("body").append(this.popup);
  }

  var skillPopup = new SkillPopup();
  var passivePopup = new PassivePopup();

  var _scrollTop;

  function onUpdateStats() {
    var stats = DiabloCalc.getStats();
    var charClass = DiabloCalc.charClass;

    for (var i = 0; i < skills.length; ++i) {
      skills[i].update();
    }
    for (var i = 0; i < passives.length; ++i) {
      passives[i].update();
    }
    var extra_passive = DiabloCalc.getStats().extra_passive;
    if (extra_passive && !DiabloCalc.passives[charClass][extra_passive]) {
      extra_passive = null;
    }
    if (extra_passive) {
      for (var i = 0; i < passives.length; i++) {
        if (extra_passive == passives[i].passive) {
          extra_passive = null;
          break;
        }
      }
    }
    extraPassive.setPassive(extra_passive);
    extraPassive.section.toggle(!!extra_passive);
    extraPassive.update();
    var kanaiFx = [];
    for (var type in kanai) {
      kanai[type].update();
      kanaiFx.push(kanai[type].getItemAffix());
    }

    for (var gem in DiabloCalc.legendaryGems) {
      if (DiabloCalc.legendaryGems[gem].line && !stats.gems.hasOwnProperty(gem)) {
        DiabloCalc.legendaryGems[gem].line.line.remove();
        delete DiabloCalc.legendaryGems[gem].line;
      }
    }
    for (var id in stats.gems) {
      var gem = DiabloCalc.legendaryGems[id];
      if (!gem.line) {
        gem.line = new DiabloCalc.SkillBox.gem(gemSection, id);
      }
      gem.line.update();
    }
    gemSection.toggle(!$.isEmptyObject(stats.gems));

    function isAffixShown(affix) {
      if (kanaiFx.indexOf(affix) >= 0) return false;
      if (!stats.affixes.hasOwnProperty(affix)) return false;
      var data = DiabloCalc.itemaffixes[affix];
      if (!data.info && data.active === undefined && !data.params) return false;
      if (!data.check) return true;
      if (typeof data.info === "function") {
        if (data.info(stats.affixes[affix].value, stats)) return true;
      } else if (data.info) {
        return true;
      }
      if (data.active !== undefined || data.params) {
        if (typeof data.buffs === "function") {
          if (data.buffs(stats.affixes[affix].value, stats)) return true;
        } else if (data.buffs) {
          return true;
        }
      }
      return false;
    }
    for (var affix in DiabloCalc.itemaffixes) {
      if (DiabloCalc.itemaffixes[affix].line && !isAffixShown(affix)) {
        DiabloCalc.itemaffixes[affix].line.line.remove();
        delete DiabloCalc.itemaffixes[affix].line;
      }
    }
    var hasAffixes = false;
    for (var id in stats.affixes) {
      var affix = DiabloCalc.itemaffixes[id];
      if (!affix) continue;
      if (!affix.line && isAffixShown(id)) {
        affix.line = new DiabloCalc.SkillBox.affix(itemSection, id);
      }
      if (affix.line) {
        hasAffixes = true;
        affix.line.update();
      }
    }
    itemSection.toggle(hasAffixes);

    if (_scrollTop !== undefined) {
      tab.scrollTop(_scrollTop);
      _scrollTop = undefined;
    }
  }

//  function scrollIntoView(elem) {
//    var tab = $("#tab-skills");
//    var offset = elem.offset()
//    tab.animate({scrollTop: (slotData.elems.div.offset().top - tab.offset().top + tab.scrollTop() - 20)+ "px"}, "fast");
//  }
  DiabloCalc.register("editSkill", function(index) {
    $(".editframe").tabs("option", "active", 2);
    skills[index].line.get(0).scrollIntoView();
    setTimeout(function() {skillPopup.show(skills[index]);}, 0);
  });
  DiabloCalc.register("editPassive", function(index) {
    $(".editframe").tabs("option", "active", 2);
    passives[index].line.get(0).scrollIntoView();
    setTimeout(function() {passivePopup.show(passives[index]);}, 0);
  });

  function onChangeClass() {
    skillPopup.hide();
    passivePopup.hide();

    _scrollTop = tab.scrollTop();

    var charClass = DiabloCalc.charClass;
    skillSection.empty();
    skillSection.removeClass().addClass("class-" + charClass);

    skills = [];
    passives = [];

    for (var gem in DiabloCalc.legendaryGems) {
      delete DiabloCalc.legendaryGems[gem].line;
    }
    for (var affix in DiabloCalc.itemaffixes) {
      delete DiabloCalc.itemaffixes[affix].line;
    }

    for (var i = 0; i < 6; ++i) {
      skills.push(new DiabloCalc.SkillBox.skill(skillSection, i));
      skills[i].header.click((function(line) {return function(evt) {
        skillPopup.show(line, evt);
      };})(skills[i])).contextmenu((function(line) {return function() {
        line.setSkill();
        DiabloCalc.trigger("updateSkills", true);
        return false;
      };})(skills[i]));
    }

    skillSection.append("<h3 class=\"skill-category\">" + _L("Passives") + "</h3>");

    for (var i = 0; i < 4; ++i) {
      passives.push(new DiabloCalc.SkillBox.passive(skillSection, i));
      passives[i].header.click((function(line) {return function(evt) {
        passivePopup.show(line, evt);
      };})(passives[i])).contextmenu((function(line) {return function() {
        line.setPassive();
        DiabloCalc.trigger("updateSkills", true);
        return false;
      };})(passives[i]));
    }

    var extraSection = $("<div><h3 class=\"skill-category\" style=\"margin-top: 10px\">" + _L("Granted by Hellfire Amulet") + "</h3></div>").hide();
    skillSection.append(extraSection);
    extraPassive = new DiabloCalc.SkillBox.passive(extraSection, -1);
    extraPassive.section = extraSection;

    gemSection = $("<div><h3 class=\"skill-category\">" + _L("Legendary Gems") + "</h3></div>").hide();
    skillSection.append(gemSection);

    itemSection = $("<div><h3 class=\"skill-category\">" + _L("Item Effects") + "</h3></div>").hide();
    skillSection.append(itemSection);

    kanaiSection.empty();

    kanaiSection.append("<h3 class=\"skill-category\">" + _L("Kanai's Cube") + "</h3>");

    kanai = {
      weapon: new DiabloCalc.SkillBox.kanai(kanaiSection, "weapon"),
      armor: new DiabloCalc.SkillBox.kanai(kanaiSection, "armor"),
      jewelry: new DiabloCalc.SkillBox.kanai(kanaiSection, "jewelry"),
    };

    skillPopup.setClass(charClass);
    passivePopup.setClass(charClass);

    DiabloCalc.trigger("updateSkills");
  }
  function onUpdateSlotItem(slot) {
    if (slot === "mainhand") {
      if (skills.length >= 1 && !skills[0].skill) {
        skills[0].setSkill();
      }
      if (skills.length >= 2 && !skills[1].skill) {
        skills[1].setSkill();
      }
    }
  }

  function fixSkill(skill) {
    if (skill && !DiabloCalc.skills[DiabloCalc.charClass][skill[0]]) {
      var list = DiabloCalc.skills[DiabloCalc.charClass];
      for (var id in list) {
        if (list[id].oldid === skill[0]) {
          return [id, skill[1]];
        }
      }
    } else {
      return skill;
    }
  }
  function fixPassive(passive) {
    if (passive && !DiabloCalc.passives[DiabloCalc.charClass][passive]) {
      var list = DiabloCalc.passives[DiabloCalc.charClass];
      for (var id in list) {
        if (list[id].oldid === passive) {
          return id;
        }
      }
    } else {
      return passive;
    }
  }
  DiabloCalc.setSkill = function(slot, skill) {
    if (slot >= 0 && slot < skills.length) {
      skills[slot].setSkill(fixSkill(skill));
      DiabloCalc.trigger("updateSkills");
    }
  };
  DiabloCalc.getSkill = function(slot) {
    if (slot >= 0 && slot < skills.length) {
      return skills[slot].skill;
    }
    return null;
  };
  DiabloCalc.setPassive = function(slot, skill) {
    if (slot >= 0 && slot < passives.length) {
      passives[slot].setPassive(fixPassive(skill));
      DiabloCalc.trigger("updateSkills");
    }
  };
  DiabloCalc.getPassive = function(slot) {
    if (slot >= 0 && slot < passives.length) {
      return passives[slot].passive;
    }
    return null;
  };
  DiabloCalc.getSkills = function() {
    var res = {};
    res.skills = [];
    for (var slot = 0; slot < skills.length; ++slot) {
      res.skills.push(skills[slot].skill);
    }
    res.passives = [];
    for (var slot = 0; slot < passives.length; ++slot) {
      res.passives.push(passives[slot].passive);
    }
    res.kanai = {};
    for (var type in kanai) {
      var id = kanai[type].getItemPair();
      if (id) {
        res.kanai[type] = id;
      }
    }
    return res;
  };
  DiabloCalc.setSkills = function(data) {
    if (data.skills) {
      for (var slot = 0; slot < skills.length && slot < data.skills.length; ++slot) {
        skills[slot].setSkill(fixSkill(data.skills[slot]));
      }
      for (var slot = data.skills.length; slot < skills.length; ++slot) {
        skills[slot].setSkill();
      }
    }
    if (data.passives) {
      for (var slot = 0; slot < passives.length && slot < data.passives.length; ++slot) {
        passives[slot].setPassive(fixPassive(data.passives[slot]));
      }
      for (var slot = data.passives.length; slot < passives.length; ++slot) {
        passives[slot].setPassive();
      }
    }
    if (data.kanai) {
      for (var type in data.kanai) {
        if (kanai[type]) {
          kanai[type].setItemPair(data.kanai[type]);
        }
      }
    }
  };
  function applySkill(list, stats, source) {
    if (list) {
      for (var stat in list) {
        stats.add(stat, list[stat], 1, source);
      }
    }
  }
  DiabloCalc.isSkillActive = function(skill) {
    for (var i = 0; i < skills.length; i++) {
      if (skills[i].skill && skills[i].skill[0] === skill) {
        return DiabloCalc.skills[DiabloCalc.charClass][skill].active;
      }
    }
    for (var i = 0; i < passives.length; i++) {
      if (skill === passives[i].passive) {
        return DiabloCalc.passives[DiabloCalc.charClass][skill].active !== false;
      }
    }
    if (skill === extraPassive.passive) {
      return DiabloCalc.passives[DiabloCalc.charClass][skill].active !== false;
    }
    return false;
  };
  DiabloCalc.addSkillList = function(stats) {
    for (var i = 0; i < skills.length; i++) {
      if (skills[i].skill) {
        stats.skills[skills[i].skill[0]] = skills[i].skill[1];
      }
    }
    for (var i = 0; i < passives.length; i++) {
      if (passives[i].passive) {
        stats.passives[passives[i].passive] = true;
      }
    }
    if (stats.extra_passive && DiabloCalc.passives[DiabloCalc.charClass][stats.extra_passive]) {
      stats.passives[stats.extra_passive] = true;
    }
  };
  DiabloCalc.addExtraAffixes = function(stats) {
    for (var type in kanai) {
      var affix = kanai[type].getItemAffix();
      if (affix) {
        stats[affix] = kanai[type].getItemAffixValue();
      }
    }
  };
  DiabloCalc.addSkillBonuses = function(stats) {
    DiabloCalc.addSkillList(stats);
    var mantras = ["mantraofsalvation", "mantraofretribution", "mantraofhealing", "mantraofconviction"];
    for (var i = 0; i < skills.length; ++i) {
      if (skills[i].skill) {
        if (DiabloCalc.skills[DiabloCalc.charClass][skills[i].skill[0]].active) {
          applySkill(DiabloCalc.getSkillBonus(skills[i].skill, stats), stats, skills[i].skill[0]);
        }
        if (mantras.indexOf(skills[i].skill[0]) < 0) {
          applySkill(DiabloCalc.getSkillBonus(skills[i].skill, stats, "passive"), stats, skills[i].skill[0]);
        }
      }
    }
    var _passives = {};
    for (var i = 0; i < passives.length; ++i) {
      if (passives[i].passive && DiabloCalc.passives[DiabloCalc.charClass][passives[i].passive].active !== false) {
        _passives[passives[i].passive] = true;
        applySkill(DiabloCalc.getPassiveBonus(passives[i].passive, stats), stats, passives[i].passive);
      }
    }
    if (DiabloCalc.charClass == "monk") {
      for (var index = 0; index < 4; index++) {
        var mantra = mantras[index];
        if (!stats.skills[mantra] && stats.set_inna_4pc) {
          stats.skills[mantra] = "x";
        }
        if (stats.skills[mantra]) {
          applySkill(DiabloCalc.getSkillBonus([mantra, stats.skills[mantra]], stats, "passive"), stats, mantra);
        }
      }
    }
    if (stats.extra_passive && !_passives[stats.extra_passive] && DiabloCalc.passives[DiabloCalc.charClass][stats.extra_passive]) {
      if (DiabloCalc.passives[DiabloCalc.charClass][stats.extra_passive].active !== false) {
        applySkill(DiabloCalc.getPassiveBonus(stats.extra_passive, stats), stats, stats.extra_passive);
      }
    }
    var kanaiFx = [];
    for (var type in kanai) {
      var affix = kanai[type].getItemAffix();
      if (!affix) continue;
      var info = kanai[type].getInfo();
      if (!info) continue;
      var func = "buffs";
      if (!info[func] || info.active === false) {
        func = "inactive";
      }
      if (func) {
        var list;
        if (typeof info[func] == "function") {
          var value = kanai[type].getItemAffixValue();
          var values = [];
          if (value !== undefined) values.push(value);
          list = info[func](values, stats);
        } else {
          list = info[func];
        }
        applySkill(list, stats, kanai[type].getItemPair());
        kanaiFx.push(affix);
      }
    }    
    for (var affix in stats.affixes) {
      if (kanaiFx.indexOf(affix) >= 0) continue;
      var info = DiabloCalc.itemaffixes[affix];
      if (!info) continue;
      var func = "buffs";
      if (!info[func] || info.active === false) {
        func = "inactive";
      }
      if (func) {
        var list;
        if (typeof info[func] == "function") {
          list = info[func](stats.affixes[affix].value, stats);
        } else {
          list = info[func];
        }
        applySkill(list, stats, stats.affixes[affix].set || DiabloCalc.getSlotId(stats.affixes[affix].slot));
      }
    }

    DiabloCalc.addPartyBuffs(stats);
  };
  DiabloCalc.addPartyBuffs = function(stats) {
    function applyBuff(id, info) {
      if (info.active !== false || info.multiple) {
        var list = info.buffs(stats);
        applySkill(list, stats, id);
      }
    }
    for (var i = 0; i < DiabloCalc.partybuffs.length; ++i) {
      $.each(DiabloCalc.partybuffs[i].items, applyBuff);
      if (DiabloCalc.partybuffs[i].class) {
        $.each(DiabloCalc.partybuffs[i][DiabloCalc.partybuffs[i].class], applyBuff);
      }
    }
    $.each(DiabloCalc.followerbuffs, applyBuff);
    $.each(DiabloCalc.shrinebuffs, applyBuff);
  };

  DiabloCalc.isGemActive = function(name) {
    var gem = DiabloCalc.legendaryGems[name];
    return gem.active !== false;
  };

  skillSection = $("<div></div>");
  tab.append(skillSection);

  kanaiSection = $("<div style=\"margin: 0 47px\"></div>");
  DiabloCalc.stashHeader.before(kanaiSection);

  $(".editframe").on("tabsactivate", function(event, ui) {
    var id = ui.newPanel.attr("id");
    if (id == "tab-skills") {
      skillSection.after(kanaiSection);
      kanaiSection.css("margin", "0");
    } else if (id == "tab-equipment") {
      DiabloCalc.stashHeader.before(kanaiSection);
      kanaiSection.css("margin", "0 47px");
    }
  });

  tab.append("<h3 class=\"skill-category\" style=\"margin-bottom: 5px\">" + _L("Group Buffs") + "</h3>");
  tab.append("<p class=\"change-note\"><i>" + _L("The calculator does not check for correct buff stacking.") + "</i></p>");
  var buffSection = $("<div class=\"buff-tabs ui-helper-clearfix\"></div>");
  tab.append(buffSection);
  var buffHeader = $("<ul></ul>");
  buffSection.append(buffHeader);

  function fillClassBuffs(tab) {
    if (tab.type === "followers" || tab.type === "shrines") {
      var prevCat;
      $.each(tab.type === "followers" ? DiabloCalc.followerbuffs : DiabloCalc.shrinebuffs, function(id, info) {
        if (!info.skillbox) {
          if (prevCat != info.category) {
            prevCat = info.category;
            tab.tab.append("<h3>" + prevCat + "</h3>");
          }
          info.skillbox = new DiabloCalc.SkillBox.buff(tab.tab, info);
        }
        info.skillbox.updateBoxes();
      });
      return;
    }

    var cls = DiabloCalc.partybuffs[tab.index].class;
    for (var oc in DiabloCalc.classes) {
      tab.header.toggleClass("class-" + oc, oc === cls);
      tab.tab.toggleClass("class-" + oc, oc === cls);
    }
    tab.header.toggleClass("class-icon", !!cls);
    tab.header.toggleClass("icon-coop", !cls);

    tab.tab.children().detach();
    if (!tab.class) {
      tab.class = $("<select class=\"buff-class\"><option value=\"\">" + (DiabloCalc.noChosen ? _L("Select Class") : "") + "</option></select>");
      for (var oc in DiabloCalc.classes) {
        if (!DiabloCalc.classes[oc].follower) {
          tab.class.append("<option value=\"" + oc + "\" class=\"class-icon class-" + oc + "\">" + DiabloCalc.classes[oc].name + "</option>");
        }
      }
      tab.tab.append(tab.class);
      tab.class.chosen({
        allow_single_deselect: true,
        disable_search: true,
        inherit_select_classes: true,
        placeholder_text_single: _L("Select Class"),
      }).change(function() {
        var oc = tab.class.val();
        if (!DiabloCalc.noChosen) {
          var span = tab.clsChosen.find("span").first();
          for (var uc in DiabloCalc.classes) {
            span.toggleClass("class-" + uc, uc === oc);
          }
          span.toggleClass("class-icon", !!oc);
        }
        DiabloCalc.partybuffs[tab.index].class = oc;
        fillClassBuffs(tab);
        DiabloCalc.trigger("updateSkills", true);
      });
      if (!DiabloCalc.noChosen) {
        tab.clsChosen = tab.class.next();
      }
    } else {
      tab.tab.append(tab.class, tab.clsChosen);
      if (!DiabloCalc.noChosen) {
        var span = tab.clsChosen.find("span").first();
        for (var oc in DiabloCalc.classes) {
          span.toggleClass("class-" + oc, oc === cls);
        }
        span.toggleClass("class-icon", !!cls);
      }
      tab.class.val(cls);
      tab.class.trigger("chosen:updated");
    }

    $.each(DiabloCalc.partybuffs[tab.index].items, function(id, info) {
      if (!info.classes || info.classes.indexOf(cls) >= 0) {
        if (!info.skillbox) {
          info.skillbox = new DiabloCalc.SkillBox.buff(tab.tab, info);
        } else {
          tab.tab.append(info.skillbox.line);
        }
        info.skillbox.updateBoxes();
      }
    });
    if (cls) {
      $.each(DiabloCalc.partybuffs[tab.index][cls], function(id, info) {
        if (!info.skillbox) {
          info.skillbox = new DiabloCalc.SkillBox.buff(tab.tab, info);
        } else {
          tab.tab.append(info.skillbox.line);
        }
        info.skillbox.updateBoxes();
      });
    }
  }
  function onUpdateParams() {
    for (var i = 0; i < buffTabs.length; ++i) {
      fillClassBuffs(buffTabs[i]);
    }
  }

  for (var i = 0; i < DiabloCalc.partybuffs.length; ++i) {
    var hdr = $("<a href=\"#buff-" + i + "\" class=\"icon-coop\"></a>");
    buffHeader.append($("<li></li>").append(hdr));
    var buffTab = $("<div id=\"buff-" + i + "\"></div>");
    buffSection.append(buffTab);
    buffTabs.push({index: i, header: hdr, tab: buffTab, type: "party"});
  }
  {
    var hdr = $("<a href=\"#buff-followers\" class=\"icon-followers\"></a>");
    buffHeader.append($("<li></li>").append(hdr));
    var buffTab = $("<div id=\"buff-followers\" class=\"class-miscbuffs\"></div>");
    buffSection.append(buffTab);
    buffTabs.push({header: hdr, tab: buffTab, type: "followers"});
  }
  {
    var hdr = $("<a href=\"#buff-shrines\" class=\"icon-shrines\"></a>");
    buffHeader.append($("<li></li>").append(hdr));
    var buffTab = $("<div id=\"buff-shrines\" class=\"class-miscbuffs\"></div>");
    buffSection.append(buffTab);
    buffTabs.push({header: hdr, tab: buffTab, type: "shrines"});
  }
  buffSection.tabs();
  buffSection.find("li").removeClass("ui-corner-top").addClass("ui-corner-left");
  for (var i = 0; i < buffTabs.length; ++i) {
    buffTabs[i].tab = DiabloCalc.addScroll(buffTabs[i].tab, "y");
  }
  buffSection.find(".ui-tabs-panel")
  onUpdateParams();
  onChangeClass();
  function mwIntent(e, d) {
    if (e.deltaY || e.deltaFactor) {
      var $this = $(this);
      var newPos = $this.scrollTop() - e.deltaY * e.deltaFactor;
      if (this.scrollHeight <= $this.outerHeight() + 1 || newPos > this.scrollHeight - $this.outerHeight()) return;
      if (tab.is(this) && newPos < 0) {
        return;
      }
      $this.scrollTop(newPos);
      e.stopPropagation();
      return false;
    }
  };
  tab.mwheelIntent(mwIntent);
  for (var i = 0; i < buffTabs.length; ++i) {
    buffTabs[i].tab.mwheelIntent(mwIntent);
  }

  DiabloCalc.register("changeClass", onChangeClass);
  DiabloCalc.register("updateStats", onUpdateStats);
  DiabloCalc.register("updateParams", onUpdateParams);
  DiabloCalc.register("importEnd", onUpdateParams);
  DiabloCalc.register("updateSlotItem", onUpdateSlotItem);
})();

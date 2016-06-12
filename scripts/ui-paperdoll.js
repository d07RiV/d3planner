(function() {
  function getItemIcon(slot, data) {
    if (data.id == "custom") {
      var types = (slot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[slot].types);
      for (var type in types) {
        if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
        return DiabloCalc.getItemIcon(DiabloCalc.itemTypes[type].generic);
      }
    }
    return DiabloCalc.getItemIcon(data.id);
  }
  var skills = [];
  var passives = [];
  var cube = {};
  var $btnMale, $btnFemale;
  DiabloCalc.getDollSkill = function(index) {
    return skills[index];
  };
  DiabloCalc.getDollPassive = function(index) {
    return passives[index];
  };
  function onUpdateSlotStats(slot) {
    if (DiabloCalc.tooltip && DiabloCalc.tooltip.getNode() == DiabloCalc.itemSlots[slot].dollFrame[0]) {
      DiabloCalc.tooltip.showItem(DiabloCalc.itemSlots[slot].dollFrame[0], slot);
    }
  }
  function onUpdateSkills() {
    var charClass = $(".char-class").val();
    var data = DiabloCalc.getSkills();
    for (var i = 0; i < 6; ++i) {
      var skill = data.skills[i];
      if (skill) {
        var info = DiabloCalc.skills[charClass][skill[0]];
        skills[i].removeClass("empty");
        skills[i].css("background-position", (-42 * info.col) + "px " + (-84 * info.row) + "px");
      } else {
        skills[i].addClass("empty");
      }
    }
    for (var i = 0; i < 4; ++i) {
      var passive = data.passives[i];
      if (passive) {
        var info = DiabloCalc.passives[charClass][passive];
        passives[i].removeClass("empty");
        passives[i].css("background-position", (-42 * info.index) + "px 0");
      } else {
        passives[i].addClass("empty");
      }
    }
    for (var type in cube) {
      if (data.kanai[type]) {
        cube[type].removeClass("empty");
        cube[type].find(".icon").css("background-image", "url(" + DiabloCalc.getItemIcon(data.kanai[type]) + ")");
      } else {
        cube[type].addClass("empty");
      }
    }
  }
  function removeCls(elem) {
    elem.removeClass("empty-slot disabled-offhand");
    for (var q in DiabloCalc.qualities) {
      elem.removeClass("quality-" + q);
    }
    return elem;
  }
  function onUpdateSlot(slot) {
    var charClass = $(".char-class").val();
    var slotData = DiabloCalc.itemSlots[slot];
    var data = DiabloCalc.getSlot(slot);
    if (slotData.flourish) {
      slotData.flourish.removeClass();
    }
    if (!data || !DiabloCalc.itemById[data.id]) {
      removeCls(slotData.dollFrame).addClass("doll-slot").addClass("slot-" + slot).addClass("empty-slot");
      slotData.dollImage.hide();
      if (slotData.dollSockets) {
        slotData.dollSockets.empty();
      }
      if (!data && slot == "offhand") {
        data = DiabloCalc.getSlot("mainhand");
        if (data && DiabloCalc.itemById[data.id] && DiabloCalc.itemTypes[DiabloCalc.itemById[data.id].type].slot == "twohand") {
          slotData.dollFrame.addClass("disabled-offhand");
          slotData.dollImage.attr("src", getItemIcon("mainhand", data)).show();
        }
      }
      return;
    }
    var item = DiabloCalc.itemById[data.id];
    removeCls(slotData.dollFrame).addClass("doll-slot").addClass("slot-" + slot).addClass("quality-" + item.quality);
    slotData.dollImage.attr("src", getItemIcon(slot, data)).show();
    slotData.dollImage.toggleClass("ancient", !!data.ancient);
    if (slotData.flourish) {
      var element = null;
      for (var stat in data.stats) {
        if (DiabloCalc.stats[stat].elemental) {
          element = DiabloCalc.stats[stat].elemental;
          break;
        }
      }
      if (element) {
        slotData.flourish.addClass("weapon-flourish").addClass(slot + "-flourish").addClass("elemental-" + element);
      }
    }
    if (slotData.dollSockets) {
      slotData.dollSockets.empty();
      var sockets = (data.stats.sockets && data.stats.sockets[0]) || 0;
      for (var i = 0; i < sockets; ++i) {
        var socket = $("<span></span>").addClass("socket");
        if (data.gems && i < data.gems.length) {
          var path;
          if (DiabloCalc.legendaryGems[data.gems[i][0]]) {
            path = DiabloCalc.getItemIcon(data.gems[i][0], "small");
          } else if (DiabloCalc.gemQualities[data.gems[i][0]]) {
            path = DiabloCalc.getItemIcon(data.gems[i], "small");
          }
          if (path) {
            socket.append($("<img></img>").attr("src", path));
          }
        }
        slotData.dollSockets.append(socket).append($("<br></br>"));
      }
    }

    if (slot == "mainhand" && DiabloCalc.itemTypes[item.type].slot == "twohand") {
      onUpdateSlot("offhand");
    }
  }

  function onChangeClass() {
    var charClass = $(".char-class").val();
    $(".paperdoll-background").parent().removeClass().addClass("paperdoll-container").addClass("class-" + charClass).addClass(DiabloCalc.gender || "female");
    $(".paperdoll-background").removeClass().addClass("paperdoll-background").addClass(DiabloCalc.classes[charClass].follower ? "class-follower" : "class-character");
    $btnMale.toggleClass("selected", DiabloCalc.gender === "male");
    $btnFemale.toggleClass("selected", DiabloCalc.gender !== "male");
  }
  function onChangeGender() {
    onChangeClass();
    for (var slot in DiabloCalc.itemSlots) {
      onUpdateSlot(slot);
    }
  }

  var outer = $(".paperdoll-background");
  DiabloCalc.itemSlots.mainhand.flourish = $("<span class=\"weapon-flourish mainhand-flourish\"></span>");
  DiabloCalc.itemSlots.offhand.flourish = $("<span class=\"weapon-flourish offhand-flourish\"></span>");
  outer.append(DiabloCalc.itemSlots.mainhand.flourish).append(DiabloCalc.itemSlots.offhand.flourish);
  for (var slot in DiabloCalc.itemSlots) {
    var slotData = DiabloCalc.itemSlots[slot];
    slotData.dollFrame = $("<div></div>").addClass("doll-slot").addClass("slot-" + slot).addClass("empty-slot")
      .append("<span class=\"item-gradient\"><span class=\"item-glow\"></span></span>");
    slotData.dollImage = $("<img></img>").hide();
    slotData.dollFrame.append(slotData.dollImage);
    if (slotData.sockets) {
      var socketsWrapper = $("<span></span>").addClass("sockets-wrapper");
      slotData.dollSockets = $("<span></span>").addClass("sockets-align");
      slotData.dollFrame.append(socketsWrapper.append(slotData.dollSockets));
    }
    (function(slot) {
      //slotData.dollFrame.click(function() {
      //  if ($(".editframe").tabs("option", "active") != 3) {
      //    DiabloCalc.trigger("editSlot", slot);
      //  }
      //});
      slotData.dollFrame.hover(function() {
        if (DiabloCalc.tooltip) {
          DiabloCalc.tooltip.showItem(this, slot);
        }
      }, function() {
        if (DiabloCalc.tooltip) {
          DiabloCalc.tooltip.hide();
        }
      });
    })(slot);
    outer.append(slotData.dollFrame);
  }

  var skillLine = $("<div></div>").addClass("paperdoll-skills");
  var passiveLine = $("<div></div>").addClass("paperdoll-skills");
  for (var i = 0; i < 6; ++i) {
    var icon = $("<span></span>").addClass("skill-icon").addClass("empty");
    icon.append("<span class=\"skill-frame\"></span>");
    icon.css("left", 14 + (i < 2 ? 42 * 4 + 50 + i * 52 : (i - 2) * 52));
    icon.append("<span class=\"skill-text\">" + [1, 2, 4, 9, 14, 19][i] + "</span>");
    (function(i) {
      icon.hover(function() {
        if (!DiabloCalc.getSkill || !DiabloCalc.tooltip) return;
        var skill = DiabloCalc.getSkill(i);
        if (skill) {
          DiabloCalc.tooltip.showSkill(this, $(".char-class").val(), skill[0], skill[1]);
        }
      }, function() {
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.hide()
      });
      icon.click(function() {
        var skill = DiabloCalc.getSkill(i);
        if (skill && DiabloCalc.d3gl && DiabloCalc.d3gl.character && DiabloCalc.d3gl.enabled()) {
          DiabloCalc.tooltip.hide();
          var info = (DiabloCalc.webglSkills && skill && DiabloCalc.webglSkills[skill[0]]);
          if (info && typeof info === "object" && "x" in info) info = info[skill[1]];
          if (info) DiabloCalc.d3gl.character.animate(info);
        } else {
          DiabloCalc.trigger("editSkill", i);
        }
      });
    })(i);
    skillLine.append(icon);
    skills.push(icon);
  }
  for (var i = 0; i < 4; ++i) {
    var icon = $("<span></span>").addClass("passive-icon").addClass("empty");
    icon.append("<span class=\"passive-frame fancy\"></span>");
    icon.css("left", 50 + i * 66);
    icon.append("<span class=\"skill-text\">" + [10, 20, 30, 70][i] + "</span>");
    (function(i) {
      icon.hover(function() {
        if (!DiabloCalc.getPassive || !DiabloCalc.tooltip) return;
        var skill = DiabloCalc.getPassive(i);
        if (skill) {
          DiabloCalc.tooltip.showSkill(this, $(".char-class").val(), skill);
        }
      }, function() {
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.hide()
      });
      icon.click(function() {
        DiabloCalc.trigger("editPassive", i);
      });
    })(i);
    passiveLine.append(icon);
    passives.push(icon);
  }
  outer.parent().append(skillLine).append(passiveLine);
  var cubeLine = $("<div></div>").addClass("paperdoll-cube");
  cube.weapon = $("<span class=\"cube-item weapon empty\"><span class=\"icon\"></span></span>");
  cube.armor = $("<span class=\"cube-item armor empty\"><span class=\"icon\"></span></span>");
  cube.jewelry = $("<span class=\"cube-item jewelry empty\"><span class=\"icon\"></span></span>");
  cubeLine.append(cube.weapon, cube.armor, cube.jewelry);
  outer.parent().append(cubeLine);
  $.each(cube, function(type, elem) {
    elem.hover(function() {
      var data = DiabloCalc.getSkills();
      if (data.kanai[type]) {
        DiabloCalc.tooltip.showItem(this, data.kanai[type]);
      }
    }, function() {
      DiabloCalc.tooltip.hide();
    });
    elem.click(function() {
      DiabloCalc.trigger("editKanai", type);
    });
  });

  $btnMale = $("<span class=\"d3gl-button-male\"></span>").click(function() {
    DiabloCalc.gender = "male";
    $btnMale.addClass("selected");
    $btnFemale.removeClass("selected");
    if (DiabloCalc.updateClassIcon) DiabloCalc.updateClassIcon();
    DiabloCalc.trigger("changeGender");
  });
  $btnFemale = $("<span class=\"d3gl-button-female selected\"></span>").click(function() {
    DiabloCalc.gender = "female";
    $btnMale.removeClass("selected");
    $btnFemale.addClass("selected");
    if (DiabloCalc.updateClassIcon) DiabloCalc.updateClassIcon();
    DiabloCalc.trigger("changeGender");
  });
  $(".paperdoll-container").append($btnMale, $btnFemale);

  DiabloCalc.register("changeClass", onChangeClass);
  DiabloCalc.register("changeGender", onChangeGender);
  onChangeClass();

  DiabloCalc.register("updateSlotStats", onUpdateSlotStats);
  DiabloCalc.register("updateSlotItem", onUpdateSlot);
  DiabloCalc.register("updateSkills", onUpdateSkills);
  DiabloCalc.register("importEnd", function() {
    for (var slot in DiabloCalc.itemSlots) {
      onUpdateSlot(slot);
    }
    onUpdateSkills();
  });
})();
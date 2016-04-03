(function() {
  var _L = DiabloCalc.locale("ui-equipment.js");

  var tab = $("#tab-equipment");
  tab = DiabloCalc.addScroll(tab, "y");
  
  var moreWarnings = $("<input></input>").attr("type", "checkbox").prop("checked", false).change(function() {
    currentSlot.itemBox.updateWarning();
    edit.itemBox.updateWarning();
  });
  DiabloCalc.addOption("moreWarnings", function() {return moreWarnings.prop("checked");}, function(x) {
    moreWarnings.prop("checked", x);
    currentSlot.itemBox.updateWarning();
    edit.itemBox.updateWarning();
  });
  var limitStats = $("<input></input>").attr("type", "checkbox").prop("checked", true);
  DiabloCalc.addOption("limitStats", function() {return limitStats.prop("checked");}, function(x) {
    limitStats.prop("checked", x);
  });
  var hideCrossClass = $("<input></input>").attr("type", "checkbox").prop("checked", true);
  DiabloCalc.addOption("hideCrossClass", function() {return hideCrossClass.prop("checked");}, function(x) {
    hideCrossClass.prop("checked", x);
    currentSlot.itemBox.populateItems();
    edit.itemBox.populateItems();
  });
  var hideLegacy = $("<input></input>").attr("type", "checkbox").prop("checked", true);
  DiabloCalc.addOption("hideLegacy", function() {return hideLegacy.prop("checked");}, function(x) {
    hideLegacy.prop("checked", x);
    currentSlot.itemBox.populateItems();
    edit.itemBox.populateItems();
  });

  tab.append($("<label class=\"option-box\"></label>").append(moreWarnings).append(_L("Show all warnings")));
  tab.append($("<label class=\"option-box\"></label>").append(hideCrossClass).append(_L("Hide items for other classes")));
  tab.append($("<label class=\"option-box\"></label>").append(limitStats).append(_L("Only list class-specific stats")));
  tab.append($("<label class=\"option-box\"></label>").append(hideLegacy).append(_L("Hide legacy items")));
  DiabloCalc.addTip(moreWarnings, _L("Show warnings for incomplete items and missing secondary stats."));
  DiabloCalc.addTip(hideCrossClass, _L("Do not list items with affixes that do not apply to your class."));
  DiabloCalc.addTip(limitStats, _L("Only list stats useful to your class."));
  DiabloCalc.addTip(hideLegacy, _L("Do not list legacy items."));

  //tab.append("<p class=\"change-note\">This is an experimental replacement for the old equipment editor. It should also be significantly faster when loading or switching between profiles. " +
  //  "If you prefer the old editor, please leave feedback in the <a href=\"/mantisbt/bug_report_page.php\">issue tracker</a>.</p>");

  var curDrag;
  $("body").keydown(function(e) {
    if (e.which == 16 && curDrag) {
      curDrag.show();
    }
  }).keyup(function(e) {
    if (e.which == 16 && curDrag) {
      curDrag.hide();
    }
  });

  function setCurSlot(slot) {
    currentSlot.setSlot(slot);
    DiabloCalc.tooltip.hide();
    setTimeout(function() {
      var curslot = currentSlot.slot;
      if (!DiabloCalc.itemSlots[curslot].item) {
        var types = (curslot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[curslot].types);
        var numtypes = 0, firsttype;
        for (var type in types) {
          if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
          if (type === "custom") continue;
          numtypes += 1;
          firsttype = type;
        }
        if (numtypes === 1) {
          currentSlot.itemBox.type.val(firsttype);
          currentSlot.itemBox.type.trigger("chosen:updated");
          currentSlot.itemBox.onChangeType();
          setTimeout(function() {currentSlot.itemBox.item.trigger("chosen:open");}, 0);
        } else {
          currentSlot.itemBox.type.trigger("chosen:open");
        }
      } else {
        currentSlot.itemBox.type.trigger("chosen:activate");
      }
    }, 0);
  }

  function DollSlot(slot) {
    var self = this;
    this.slot = slot;
    this.slotData = DiabloCalc.itemSlots[slot];

    this.accept = function(id) {
      if (!id || !DiabloCalc.itemById[id]) return false;
      if (this.inactive) return false;
      var type = DiabloCalc.itemById[id].type;
      var typeData = (this.slot ? DiabloCalc.itemSlots[this.slot].types : DiabloCalc.itemTypes)[type];
      if (!typeData) return false;

      var twohand = false;
      var noDual = (this.slot === "offhand" && !DiabloCalc.classes[DiabloCalc.charClass].dualwield);
      if (this.slot === "offhand" && DiabloCalc.charClass !== "crusader" && DiabloCalc.itemSlots.mainhand.item) {
        var mainitem = DiabloCalc.itemById[DiabloCalc.itemSlots.mainhand.item.id];
        var maintype = (mainitem && mainitem.type);
        if (DiabloCalc.itemTypes[maintype] && DiabloCalc.itemTypes[maintype].slot == "twohand") {
          twohand = true;
        }
      }

      if (twohand && type != "quiver") return false;
      if (noDual && typeData.slot == "onehand" && type != "handcrossbow") return false;
      if (typeData.classes && typeData.classes.indexOf(DiabloCalc.charClass) < 0) return false;

      return true;
    };
    this.setItem = function(data, mode) {
      if (this.inactive) return;
      if (this.slot === "mainhand" && data && DiabloCalc.itemById[data.id] &&
          DiabloCalc.itemSlots.offhand.item && DiabloCalc.itemById[DiabloCalc.itemSlots.offhand.item.id]) {
        var mhtype = DiabloCalc.itemById[data.id].type;
        var ohtype = DiabloCalc.itemById[DiabloCalc.itemSlots.offhand.item.id].type;
        if (DiabloCalc.itemTypes[mhtype] && DiabloCalc.itemTypes[mhtype].slot == "twohand" &&
            DiabloCalc.charClass != "crusader" && ohtype && ohtype != "quiver") {
          if (currentSlot.slot !== "mainhand") {
            DiabloCalc.trigger("updateSlotItem", "offhand", "twohand");
          }
          if (mode === "stash") {
            var to = getEmptySlot(DiabloCalc.itemSlots.offhand.item);
            if (to) {
              to.setItem(DiabloCalc.itemSlots.offhand.item);
            }
          }
        }
      }
      if (currentSlot.slot === this.slot) {
        currentSlot.setItem(data);
      } else {
        this.slotData.item = data;
        if (this.slot === "mainhand") {
          DiabloCalc.itemSlots.offhand.drop.updateTypes();
        }
        DiabloCalc.trigger("updateSlotItem", this.slot);
      }
    };
    this.getId = function() {
      return (this.slotData.item ? this.slotData.item.id : undefined);
    };
    this.getData = function() {
      return this.slotData.item;
    };

    this.updateTypes = function(refresh, mhtype) {
      if (this.inactive) return;
      if (currentSlot.slot === this.slot) {
        currentSlot.itemBox.updateTypes(refresh);
      } else if (DiabloCalc.itemSlots[this.slot].item && !DiabloCalc.isItemAllowed(this.slot, DiabloCalc.itemSlots[this.slot].item.id, mhtype)) {
        this.setItem(DiabloCalc.trimItem(this.slot, DiabloCalc.itemSlots[this.slot].item, mhtype));
//        this.setItem();
      }
    };

    var helper = "clone";
    if (slot === "neck") {
      helper = function() {
        return $("<img style=\"width: 52px; height: 52px;\"></img>").attr("src", DiabloCalc.itemSlots.neck.dollImage.attr("src"))
          .toggleClass("ancient", !!(DiabloCalc.itemSlots.neck.item && DiabloCalc.itemSlots.neck.item.ancient));
      };
    }
    this.slotData.dollImage.data("slot", this);
    this.reverting = false;
    this.slotData.dollImage.draggable({
      zIndex: 100,
      cursor: "-webkit-grabbing",//"-webkit-grabbing, -moz-grabbing, -ms-grabbing",
      appendTo: "body",
      distance: 4,
      //cursorAt: {},
      helper: helper,
      start: function(event, ui) {
        if (!self.slotData.item || $(".editframe").tabs("option", "active") != 0) {
          setTimeout(function() {
            $("body").css("cursor", "");
          });
          return false;
        }
        curDrag = self.slotData.dollImage;
        if (!event.shiftKey) {
          self.slotData.dollImage.hide();
          if (self.slotData.dollSockets) {
            self.slotData.dollSockets.hide();
          }
        }
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.disable();
      },
      revert: function(valid) {
        curDrag = undefined;
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.enable();
        if (!valid) {
          if (!window.event) return true;
          self.reverting = true;
          DiabloCalc.popupMenu(window.event, _L.fixkey({
            "Delete": function() {
              var obj = self.slotData.dollImage.draggable("instance");
              self.reverting = false;
              if (obj && obj._trigger("stop", event) !== false) {
                obj._clear();
              }
              self.setItem();
            },
          }), function() {
            var obj = self.slotData.dollImage.draggable("instance");
            self.reverting = false;
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
        if (self.reverting) return false;
        setTimeout(function() {
          if (self.slotData.item) {
            self.slotData.dollImage.show();
            if (self.slotData.dollSockets) {
              self.slotData.dollSockets.show();
            }
          }
        }, 0);
      },
    }).draggable("instance")._adjustOffsetFromHelper = function() {
      this.offset.click.left = this.margins.left + this.helper.width() / 2;
      this.offset.click.top = this.margins.top + this.helper.height() / 2;
    };
    self.slotData.dollFrame.droppable({
      hoverClass: "highlight",
      accept: function(elem) {
        var from = elem.data("slot");
        if (!from || from === self) return false;
        var id = from.getId();
        if (!self.accept(id)) {
          return false;
        }
        if (DiabloCalc.shiftKey) {//window.event && window.event.shiftKey) {
          return true;
        } else {
          var selfid = self.getId();
          return !selfid || from.accept(selfid);
        }
      },
      drop: function(event, ui) {
        if (self.inactive) return;
        var from = ui.draggable.data("slot");
        if (!from || from === self) return;
        var data = from.getData();
        if (!data || !self.accept(data.id)) return;
        var selfid = self.getId();
        if (event.shiftKey) {
          if (selfid) {
            DiabloCalc.popupMenu(event, _L.fixkey({
              "Replace": function() {
                self.setItem(data, "stash");
              },
              "Cancel": function() {},
            }));
          } else {
            self.setItem(data, "stash");
          }
        } else {
          if (selfid) {
            if (from.accept(selfid)) {
              from.setItem(self.getData(), "stash");
            } else {
              return;
            }
          } else {
            from.setItem();
          }
          self.setItem(data, "stash");
        }
      },
    });
    self.slotData.dollFrame.click(function() {
      $(".editframe").tabs("option", "active", 0);
      tab.animate({scrollTop: 0}, "fast");
      setCurSlot(slot);
    });
    self.slotData.dollFrame.contextmenu(function(evt) {
      if ($(".editframe").tabs("option", "active") == 0) {
        if (self.slotData.item) {
          var options = {};
          if (getEmptySlot()) {
            options[_L("Unequip")] = function() {
              var to = getEmptySlot();
              if (self.slotData.item && to) {
                to.setItem(self.slotData.item);
                self.setItem();
              }
            };
          }
          options[_L("Delete")] = function() {
            self.setItem();
          };
          DiabloCalc.tooltip.hide();
          DiabloCalc.popupMenu(evt, options);
        }
        return false;
      }
    });
    DiabloCalc.enableTouch(self.slotData.dollFrame);
  };

  function StashSlot(line) {
    this.setItem = function(data, mode) {
      this.box.removeClass().addClass("stash-slot").addClass("ui-droppable");
      if (edit.slot === this) {
        this.box.addClass("edit");
      }
      if (!this.dollSlot && mode !== "loading") saveStash();
      if (mode !== "editing" && edit.slot === self) edit.setItem(data, mode);
      if (!data || !data.id) {
        this.item = undefined;
        this.box.addClass("empty-slot");
        //this.icon.hide();
        return;
      }
      var item = (DiabloCalc.itemById[data.id] || DiabloCalc.itemById.custom);
      var itemType = item.type;
      var itemSlot = DiabloCalc.itemTypes[itemType].slot;
      var icon = item.id;
      if (itemSlot === "custom" && this.dollSlot) {
        var types = (this.dollSlot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[this.dollSlot].types);
        for (var type in types) {
          if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
          itemSlot = DiabloCalc.itemTypes[type].slot;
          icon = DiabloCalc.itemTypes[type].generic;
          break;
        }
      }
      this.item = data;
      this.box.addClass("quality-" + item.quality);
      this.icon.removeClass().addClass("stash-icon").addClass("slot-" + itemSlot);
      this.icon.css("background-image", "url(" + DiabloCalc.getItemIcon(icon) + ")").show();
      this.icon.toggleClass("ancient", !!data.ancient);

      if (DiabloCalc.tooltip && DiabloCalc.tooltip.getNode() == this.box[0]) {
        DiabloCalc.tooltip.showItem(this.box[0], this.item);
      }

      if (!this.dollSlot) checkRemainingSpace();
    };

    this.accept = function(id) {
      if (this.dollSlot) {
        return DiabloCalc.itemSlots[this.dollSlot].drop && DiabloCalc.itemSlots[this.dollSlot].drop.accept(id);
      }
      return !!id;
    };
    this.getId = function() {
      return this.item && this.item.id;
    };
    this.getData = function() {
      return this.item;
    };

    var self = this;

    this.box = $("<div class=\"stash-slot empty-slot\"></div>");
    this.icon = $("<div class=\"stash-icon\"></div>");//.hide();
    this.box.append("<div class=\"item-gradient\"><div class=\"item-glow\"></div></div><div class=\"hover-glow\"></div>").append(this.icon);
    this.box.append("<div class=\"edit-border\"><div class=\"edit-gradient\"></div></div>");
    this.box.droppable({
      hoverClass: "slot-hover",
      accept: function(elem) {
        var slot = elem.data("slot");
        if (!slot || slot === self) return false;
        if (DiabloCalc.shiftKey) {//window.event.shiftKey) {
          return true;
        } else {
          return !self.item || slot.accept(self.item.id);
        }
      },
      drop: function(event, ui) {
        var slot = ui.draggable.data("slot");
        if (!slot || slot === self) return;
        var data = slot.getData();
        if (!data || !self.accept(data.id)) return;
        if (event.shiftKey) {
          if (self.item) {
            DiabloCalc.popupMenu(event, _L.fixkey({
              "Replace": function() {
                self.setItem(data, "stash");
              },
              "Cancel": function() {},
            }));
          } else {
            self.setItem(data, "stash");
          }
        } else {
          if (self.item) {
            if (slot.accept(self.item.id)) {
              slot.setItem(self.item, "stash");
            } else {
              return;
            }
          } else {
            slot.setItem();
          }
          self.setItem(data, "stash");
        }
      },
    });
    this.box.hover(function() {
      if (self.dollSlot) {
        DiabloCalc.tooltip.showItem(this, self.dollSlot);
      } else if (self.item && DiabloCalc.tooltip) {
        if (DiabloCalc.itemById[self.item.id]) {
          DiabloCalc.tooltip.showItem(this, self.item);
        } else {
          var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + _L("Unknown Item") + "</span><br/>" +
            "<span class=\"d3-color-gray\">" + self.item.id + "</span></p></div>";
          DiabloCalc.tooltip.showHtml(this, tip);
        }
      }
    }, function() {
      if (DiabloCalc.tooltip) DiabloCalc.tooltip.hide();
    }).click(function() {
      if (!self.dollSlot) {
        edit.setSlot(edit.slot === self ? undefined : self);
      }
    }).contextmenu(function(evt) {
      DiabloCalc.tooltip.hide();
      var options = {};
      if (!self.dollSlot && edit.slot !== self && (!self.item || DiabloCalc.itemById[self.item])) {
        options[_L("Edit")] = function() {edit.setSlot(self);};
      }
      if (self.item) {
        if (self.dollSlot) {
          if (getEmptySlot()) {
            options[_L("Unequip")] = function() {
              var to = getEmptySlot();
              if (self.item && to) {
                to.setItem(self.item);
                self.setItem();
              }
            };
          }
        } else {
          $.each(DiabloCalc.itemSlots, function(slot, slotData) {
            if (slotData.drop.accept(self.item.id)) {
              options[_L("Equip {0}").format(slotData.name)] = function() {
                if (!slotData.drop.accept(self.item.id)) return;
                var temp = slotData.drop.getData();
                slotData.drop.setItem(self.item, "stash");
                self.setItem(temp, "stash");
              };
            }
          });
        }
        options[_L("Delete")] = function() {self.setItem();};
      }
      DiabloCalc.popupMenu(evt, options);
      return false;
    });

    this.icon.data("slot", this);
    this.reverting = false;
    this.icon.draggable({
      zIndex: 100,
      appendTo: "body",
      cursor: "-webkit-grabbing",//"-webkit-grabbing, -moz-grabbing, -ms-grabbing",
      distance: 4,
      cursorAt: {},
      helper: function() {
        var res = $("<img></img>").attr("src", self.item ? DiabloCalc.getItemIcon(self.item.id) : "");
        res.toggleClass("ancient", !!(self.item && self.item.ancient));
        if (self.item && DiabloCalc.itemById[self.item.id] && DiabloCalc.itemById[self.item.id].type === "amulet") {
          res.css("width", 52).css("height", 52);
        }
        return res;
      },
      start: function() {
        if (!self.item) {
          setTimeout(function() {
            $("body").css("cursor", "");
          });
          return false;
        }
        curDrag = self.icon;
        if (!DiabloCalc.shiftKey) {
          self.icon.hide();
        }
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.disable();
      },
      revert: function(valid) {
        curDrag = undefined;
        if (DiabloCalc.tooltip) DiabloCalc.tooltip.enable();
        if (!valid) {
          if (!window.event) return true;
          self.reverting = true;
          DiabloCalc.popupMenu(window.event, _L.fixkey({
            "Delete": function() {
              var obj = self.icon.draggable("instance");
              self.reverting = false;
              if (obj && obj._trigger("stop", event) !== false) {
                obj._clear();
              }
              self.setItem();
            },
          }), function() {
            var obj = self.icon.draggable("instance");
            self.reverting = false;
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
        if (self.reverting) return false;
        setTimeout(function() {
          self.icon.show();
        }, 0);
      },
    }).draggable("instance")._adjustOffsetFromHelper = function() {
      var offsX = 40 - this.helper.width() / 2;
      var offsY = 40 - this.helper.height() / 2;
      this.originalPosition.left += offsX;
      this.originalPosition.top += offsY;
      this.position.left += offsX;
      this.position.top += offsY;
      this.offset.click.left -= offsX;
      this.offset.click.top -= offsY;
    };
    DiabloCalc.enableTouch(this.icon);

    this.line = line;
    line.append(this.box);
  };

  function CurrentSlot() {
    this.div = $("<div class=\"current-slot\"></div>");
    tab.append(this.div);
    this.slotBox = new StashSlot(this.div);
    this.prevSlot = $("<span class=\"left\"></span>");
    this.nextSlot = $("<span class=\"right\"></span>");
    this.slotName = $("<span class=\"current-slot chosen-noframe\"></span>");
    this.slotDrop = $("<select class=\"current-slot-name\"></select>");
    this.slotItem = $("<span></span>");
    this.div.append($("<div class=\"current-header\"><span class=\"current-tip\">" + _L("Click on a paperdoll slot to edit items.") +
      "</span></div>").append(this.slotName, "<br/>", this.slotItem));

    var self = this;

    this.slotName.append(this.prevSlot, this.slotDrop, this.nextSlot);
    this.listSlots = function(curslot) {
      this.slotDrop.empty();
      for (var slot in DiabloCalc.itemSlots) {
        var so = DiabloCalc.itemSlots[slot];
        if (so.drop && so.drop.inactive) continue;
        this.slotDrop.append("<option value=\"" + slot + (slot === curslot ? "\" selected=\"selected" : "") + "\">" + so.name + "</option>");
      }
    };
    this.listSlots();
    this.slotDrop.chosen({
      disable_search: true,
      inherit_select_classes: true,
    }).change(function() {
      self.doSetSlot($(this).val());
    });

    this.slotBox.veryOldSetItem = this.slotBox.setItem;
    this.slotBox.oldSetItem = function(data, mode) {
      self.slotItem.removeClass();
      if (!data || !DiabloCalc.itemById[data.id]) {
        self.slotItem.addClass("empty-slot").text(_L("Empty Slot"));
      } else {
        var item = DiabloCalc.itemById[data.id];
        self.slotItem.addClass("quality-" + item.quality).text(item.name);
      }
      this.veryOldSetItem(data, mode);
    };
    this.slotBox.setItem = function(data, mode) {
      if (mode !== "editing") {
        self.itemBox.suppress = true;
        self.itemBox.setItem(data);
        self.itemBox.suppress = false;
      }
      self.slotBox.oldSetItem(data, mode);
      DiabloCalc.itemSlots[self.slot].item = data;
      DiabloCalc.trigger("updateSlotItem", self.slot);
    };
    this.setItem = function(data, mode) {
      this.slotBox.setItem(data, mode);
    };

    function onUpdate(itemChanged, reason) {
      if (DiabloCalc.itemSlots[self.slot].drop.inactive) return;
      var data = self.itemBox.getData();
      self.slotBox.oldSetItem(data, "editing");
      DiabloCalc.itemSlots[self.slot].item = data;
      DiabloCalc.trigger(itemChanged ? "updateSlotItem" : "updateSlotStats", self.slot, reason);
    }

    this.itemBox = new DiabloCalc.ItemBox(tab, {onUpdate: onUpdate});

    this.getPrevSlot = function() {
      var prev = undefined;
      for (var slot in DiabloCalc.itemSlots) {
        if (DiabloCalc.itemSlots[slot].drop.inactive) continue;
        if (slot === this.slot) break;
        prev = slot;
      }
      return prev;
    };
    this.getNextSlot = function() {
      var has = false;
      for (var slot in DiabloCalc.itemSlots) {
        if (DiabloCalc.itemSlots[slot].drop.inactive) continue;
        if (slot === this.slot) has = true;
        else if (has) return slot;
      }
    };

    $(".editframe").on("tabsactivate", function() {
      if (self.slot) {
        if ($(".editframe").tabs("option", "active") != 0) {
          DiabloCalc.itemSlots[self.slot].dollFrame.removeClass("editing");
        } else {
          DiabloCalc.itemSlots[self.slot].dollFrame.addClass("editing");
        }
      }
    });
    this.prevSlot.click(function() {
      var slot = self.getPrevSlot();
      if (slot) setCurSlot(slot);
    });
    this.nextSlot.click(function() {
      var slot = self.getNextSlot();
      if (slot) setCurSlot(slot);
    });

    this.setSlot = function(slot) {
      this.listSlots(slot);
      this.slotDrop.trigger("chosen:updated");
      this.doSetSlot(slot);
    };
    this.doSetSlot = function(slot) {
      if (this.slot) {
        DiabloCalc.itemSlots[this.slot].dollFrame.removeClass("editing");
      }
      this.slot = slot;
      if (this.slot && $(".editframe").tabs("option", "active") == 0) {
        DiabloCalc.itemSlots[this.slot].dollFrame.addClass("editing");
      }
      this.slotBox.dollSlot = slot;
      if (this.getPrevSlot()) {
        this.prevSlot.removeClass("disabled");
      } else {
        this.prevSlot.addClass("disabled");
      }
      if (this.getNextSlot()) {
        this.nextSlot.removeClass("disabled");
      } else {
        this.nextSlot.addClass("disabled");
      }
      this.itemBox.suppress = true;
      var data = DiabloCalc.itemSlots[slot].item;
      this.itemBox.setClass(DiabloCalc.charClass, slot);
      this.itemBox.setItem(data);
      this.itemBox.suppress = false;
      data = this.itemBox.getData();
      this.slotBox.oldSetItem(data, "editing");
      DiabloCalc.itemSlots[self.slot].item = data;
      DiabloCalc.trigger("updateSlotItem", self.slot);
    };
    this.updateIcon = function() {
      this.slotBox.oldSetItem(this.itemBox.getData(), "editing");
    };
  };

  var currentSlot = new CurrentSlot();
  DiabloCalc.onHighlight = function(on) {
    if (currentSlot.slot && $(".editframe").tabs("option", "active") == 0) {
      DiabloCalc.itemSlots[currentSlot.slot].dollFrame.toggleClass("editing", !on);
    }
  };

  var saveTimeout;
  function doSaveStash() {
    clearTimeout(saveTimeout);
    saveTimeout = undefined;
    if (!DiabloCalc.account.userName()) return;
    saveTip.addClass("loading").text(_L("Saving...")).show();
    var data = [];
    for (var i = 0; i < slots.length; ++i) {
      data.push(slots[i].item || null);
    }
    $.ajax({
      url: "savestash",
      data: JSON.stringify(data),
      type: "POST",
      global: false,
      processData: false,
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
        if (response.code === "OK") {
          saveTip.removeClass("loading").text(_L("Saved."));
        } else if (response.errors && response.errors.length) {
          saveTip.removeClass("loading").text(response.errors[0]);
        } else {
          saveTip.removeClass("loading").text(_L("Failed to save!"));
        }
      },
      error: function(e) {
        saveTip.removeClass("loading").text(_L("Failed to save!"));
      },
    });
  }
  window.onbeforeunload = function(e) {
    if (saveTimeout) {
      doSaveStash();
    }
  };
  function saveStash() {
    if (!saveTimeout) {
      saveTip.hide();
      saveTimeout = setTimeout(doSaveStash, 5000);
    }
  }
  function loadStash() {
    saveTip.addClass("loading").text(_L("Loading...")).show();
    $.ajax({
      url: "loadstash",
      data: {},
      type: "POST",
      dataType: "json",
      success: function(data) {
        saveTip.hide();
        while (data.length && !data[data.length - 1]) {
          data.pop();
        }
        addStashSlots(data.length);
        for (var i = 0; i < data.length && i < slots.length; ++i) {
          if (data[i] && DiabloCalc.itemById[data[i].id]) {
            data[i].id = DiabloCalc.itemById[data[i].id].id;
          }
          slots[i].setItem(data[i], "loading");
        }
      },
      error: function(e) {
        saveTip.removeClass("loading").text(_L("Failed to load!"));
      },
    });
  }

  var saveTip = $("<span class=\"status\"></span>").hide();
  var header = $("<div class=\"stash-header\">" + _L("Drag items between paperdoll and stash.<br/>Hold shift to clone items.") + "</div>");
  DiabloCalc.stashHeader = header;
  tab.append(header.prepend(saveTip));
  header.append(DiabloCalc.account.makeLine(_L(" to access your personal stash"), function(okay) {
    if (okay) {
      loadStash();
      this.hide();
    } else {
      this.show();
    }
  }));

  var edit = {};
  edit.line = $("<div class=\"stash-edit\"><div class=\"top-left\"></div><div class=\"top-right\"></div><div class=\"bottom\"></div></div>").hide();
  edit.line.append("<div class=\"left\"></div><div class=\"right\"></div>");
  edit.save = $("<button>" + _L("Save") + "</button>").button({icons: {primary: "ui-icon-check"}});
  edit.del = $("<button>" + _L("Delete") + "</button>").button({icons: {primary: "ui-icon-trash"}});
  edit.line.append(edit.save).append(edit.del);
  tab.append(edit.line);
  edit.updateItem = function(itemChanged, reason) {
    //if (!reason) return;
    var data = edit.itemBox.getData();
    if (edit.slot) edit.slot.setItem(data, "editing");
    edit.line.removeClass().addClass("stash-edit");
    if (data && data.id && DiabloCalc.itemById[data.id]) {
      edit.line.addClass("quality-" + DiabloCalc.itemById[data.id].quality);
    }
  };
  edit.itemBox = new DiabloCalc.ItemBox(edit.line, {
    onUpdate: edit.updateItem,
  });
  edit.itemBox.setClass();
  edit.setItem = function(data, mode) {
    this.itemBox.setItem(data, mode);
    this.line.removeClass().addClass("stash-edit");
    if (data && data.id && DiabloCalc.itemById[data.id]) {
      this.line.addClass("quality-" + DiabloCalc.itemById[data.id].quality);
    }
  };
  edit.setSlot = function(slot) {
    if (slot && slot.item && !DiabloCalc.itemById[slot.item.id]) {
      slot = undefined;
    }
    if (this.slot) this.slot.box.removeClass("edit");
    if (slot) slot.box.addClass("edit");
    this.slot = slot;
    if (!slot) {
      this.setItem();
      this.line.hide();
      DiabloCalc.hidePopup(this);
      return;
    }
    this.setItem(slot.item);
    slot.line.after(this.line);
    var index = slot.box.index();
    this.line.find(".top-left").css("width", 21 + 84 * index);
    this.line.find(".top-right").css("left", 122 + 84 * index);
    this.line.show();
    DiabloCalc.showPopup(this);
  };
  edit.hide = function() {
    this.setSlot();
  };
  edit.contains = function(t) {
    if (this.slot.box.is(t) || this.slot.box.has(t).length) return true;
    if (this.line.is(t) || this.line.has(t).length) return true;
    return false;
  };
  edit.save.click(function() {
    var data = edit.itemBox.getData();
    if (edit.slot) edit.slot.setItem(data, "editing");
    edit.setSlot();
    doSaveStash();
  });
  edit.del.click(function(evt) {
    DiabloCalc.popupMenu(evt, _L.fixkey({"Confirm delete?": function() {
      if (edit.slot) edit.slot.setItem(undefined, "editing");
      edit.setSlot();
    }}));
  });

  var slots = [];
  var lines = [];
  function addStashSlots(count) {
    while (slots.length < 50 && slots.length < count) {
      if (!(slots.length % 5)) {
        lines.push($("<div class=\"stash-row\"></div>"));
        tab.append(lines[lines.length - 1]);
      }
      slots.push(new StashSlot(lines[lines.length - 1]));
    }
  }
  addStashSlots(25);

  function getEmptySlot(data) {
/*    if (data) {
      for (var i = 0; i < slots.length; ++i) {
        if (slots[i].item && slots[i].item.id === data.id) {
          for (var 
        }
      }
    }*/
    for (var i = 0; i < slots.length; ++i) {
      if (!slots[i].item) return slots[i];
    }
  }
  function checkRemainingSpace() {
    if (slots.length == 100) return;
    var count = 0;
    for (var i = 0; i < slots.length; ++i) {
      if (!slots[i].item) ++count;
    }
    if (count < 3) {
      addStashSlots(5 * (Math.floor(slots.length / 5) + 1));
    }
  }

  function onChangeClass() {
    var firstSlot;
    $.each(DiabloCalc.itemSlots, function(slot, slotData) {
      if (slotData.classes && slotData.classes.indexOf(DiabloCalc.charClass) < 0) {
        slotData.drop.inactive = true;
        if (slotData.item) {
          slotData.item = undefined;
          DiabloCalc.trigger("updateSlotItem", slot);
        }
      } else {
        slotData.drop.inactive = false;
        if (!firstSlot) firstSlot = slot;
      }
    });
    if (!currentSlot.slot || DiabloCalc.itemSlots[currentSlot.slot].drop.inactive) {
      currentSlot.setSlot(firstSlot);
    } else {
      currentSlot.setSlot(currentSlot.slot);
    }
    for (var slot in DiabloCalc.itemSlots) {
      if (!DiabloCalc.itemSlots[slot].drop.inactive && slot !== currentSlot.slot) {
        DiabloCalc.itemSlots[slot].drop.updateTypes(true);
      }
    }
  }

  for (var slot in DiabloCalc.itemSlots) {
    DiabloCalc.itemSlots[slot].drop = new DollSlot(slot);
  }

  DiabloCalc.getItemAffixes = function(slot, required) {
    var item = DiabloCalc.itemSlots[slot].item;
    if (!item) return {};
    return DiabloCalc.getItemAffixesById(item.id, item.ancient, required);
  };
  DiabloCalc.setSlot = function(slot, data) {
    if (data) {
      if (!DiabloCalc.itemById[data.id]) {
        data = undefined;
      } else {
        data.id = DiabloCalc.itemById[data.id].id;
        if (data.gems && data.gems.length) {
          for (var i = 0; i < data.gems.length; ++i) {
            if (typeof data.gems[i][0] === "number" && data.gems[i][0] >= DiabloCalc.gemQualities.length) {
              data.gems[i][0] = DiabloCalc.oldGemQualities[data.gems[i][0]];
            }
          }
          if (!data.stats.sockets || data.stats.sockets[0] < data.gems.length) {
            data.stats.sockets = [data.gems.length];
          }
        }
      }
    }
    DiabloCalc.itemSlots[slot].drop.setItem(data);
  };
  DiabloCalc.getSlotId = function(slot) {
    var item = DiabloCalc.itemSlots[slot].item;
    return item ? item.id : undefined;
  };
  DiabloCalc.getSlotData = function(slot) {
    return DiabloCalc.itemSlots[slot].item;
  };

  DiabloCalc.register("changeClass", onChangeClass);
  DiabloCalc.register("changeGender", function() {
    currentSlot.updateIcon();
  });
  onChangeClass();
})();
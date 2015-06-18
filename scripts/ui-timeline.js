(function() {

  var tlLeft;
  var tlRight;
  var tlNewSet;
  var cFrame;
  var selSet;
  var selStat;

  var statList = {
    damage: {
      name: "Sheet Damage",
      stat: "info.dps",
      shortName: "Damage",
    },
    toughness: {
      name: "Sheet Toughness",
      stat: "info.toughness",
      shortName: "Toughness",
    },
    recovery: {
      name: "Sheet Recovery",
      stat: "info.recovery",
      shortName: "Recovery",
    },
    effdps: {
      name: "Elemental DPS",
      stat: "final.elemdps",
    },
    effdph: {
      name: "Elemental Damage/Hit",
      stat: "final.elemdph",
    },
    effedps: {
      name: "Elemental Elite DPS",
      stat: "final.elemedps",  
    },
    effedph: {
      name: "Elemental Elite Damage/Hit",
      stat: "final.elemedph",
    },
    simdps: {
      name: "Simulated DPS",
      func: "formatDamage",
    },
  };

  function getValue(stats, prev) {
    var res = {};
    if (stats) {
      for (var stat in statList) {
        res[stat] = (statList[stat].stat ? Math.floor(stats.getValue(statList[stat].stat)) : (prev && prev[stat] || 0));
      }
    } else {
      for (var stat in statList) {
        res[stat] = (prev && prev[stat] || 0);
      }
    }
    return res;
  }

  function newBlankState(name, last) {
    return {
      label: name,
      values: getValue(null, last && last.values),
    };
  }
  function newItemState(slot, prev, oh, last) {
    return {
      slot: slot,
      label: "Change " + DiabloCalc.itemSlots[slot].name,
      pre: prev,
      offhand: oh,
      undo: function() {
        this.post = DiabloCalc.getSlot(this.slot);
        DiabloCalc.setSlot(this.slot, this.pre);
        if (this.offhand) {
          DiabloCalc.setSlot("offhand", this.offhand);
        }
      },
      redo: function() {
        if (this.slot == "mainhand") {
          this.offhand = DiabloCalc.getSlot("offhand");
          DiabloCalc.setSlot(this.slot, this.post);
          if (DiabloCalc.getSlot("offhand")) {
            this.offhand = undefined;
          }
        } else {
          DiabloCalc.setSlot(this.slot, this.post);
        }
      },
      values: getValue(DiabloCalc.getStats(), last && last.values),
    };
  }
  function newSkillsState(prev, last) {
    return {
      skills: true,
      label: "Change Skills",
      pre: prev,
      undo: function() {
        this.post = DiabloCalc.getSkills();
        DiabloCalc.setSkills(this.pre);
      },
      redo: function() {
        this.pre = DiabloCalc.getSkills();
        DiabloCalc.setSkills(this.post);
      },
      values: getValue(DiabloCalc.getStats(), last && last.values),
    };
  }
  function newParagonState(prev, last) {
    return {
      paragon: true,
      label: "Change Paragon",
      pre: prev,
      undo: function() {
        this.post = DiabloCalc.getParagonLevels();
        DiabloCalc.setParagon(this.pre);
      },
      redo: function() {
        this.pre = DiabloCalc.getParagonLevels();
        DiabloCalc.setParagon(this.post);
      },
      values: getValue(DiabloCalc.getStats(), last && last.values),
    };
  }

  function createSet(index, evt, from) {
    var set = {
      index: index,
      name: "Set " + (index + 1),
      line: $("<li></li>").addClass("timeline-set"),
      label: $("<span></span>").addClass("label"),
      value: $("<span></span>").addClass("value"),
      edit: $("<span></span>").addClass("edit").attr("title", "Rename"),
      del: $("<span></span>").addClass("delete").attr("title", "Delete"),
      pos: 0,
      points: [newBlankState(evt, from)],
    };
    set.label.text(set.name);
    set.line.append(set.label).append(set.del).append(set.edit).append(set.value);
    set.line.attr("tabIndex", -1);

    set.rename = function(name) {
      set.name = name;
      if (set.label) set.label.text(set.name);
    };
    set.startedit = function() {
      if (set.label) {
        set.input = $("<input></input>");
        set.input.val(set.name);
        set.label.replaceWith(set.input);
        set.label = null;
        set.input.focus().select();
        set.input.focusout(function() {
          var val = set.input.val();
          if (val.length) set.name = val;
          set.label = $("<span></span>").addClass("label").text(set.name);
          set.input.replaceWith(set.label);
          set.input = null;
        });
        set.input.keyup(function(e) {
          if (e.keyCode != 13 && e.keyCode != 27) return;
          var val = set.input.val();
          if (e.keyCode == 13 && val.length) set.name = val;
          set.label = $("<span></span>").addClass("label").text(set.name);
          set.input.replaceWith(set.label);
          set.input = null;
        });
      }
    };

    set.line.click(function() {
      chart.changeset(set.index);
      set.line.focus();
    });
    set.edit.click(function() {
      set.startedit();
      return false;
    });
    set.del.click(function(evt) {
      if (!$(this).hasClass("disabled")) {
        DiabloCalc.popupMenu(evt, {
          "Confirm delete?": function() {
            chart.delset(set.index);
          },
        });
      }
      return false;
    });

    return set;
  }

  var chart = {
    dataOptionsLight: {
      strokeColor: "#66d",
      pointColor: "#66d",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "#66d",
      disabledColor: "#bbb",
    },
    dataOptionsDark: {
      strokeColor: "#aaf",
      pointColor: "#aaf",
      pointStrokeColor: "#121212",
      pointHighlightFill: "#121212",
      pointHighlightStroke: "#aaf",
      disabledColor: "#222",
    },
    setTheme: function() {
      this.dataOptions = this.dataOptionsLight;
      if (!$("body").hasClass("theme-light")) {
        this.dataOptions = this.dataOptionsDark;
      }
      if (!this.line) return;
      for (var opt in this.dataOptions) {
        this.line.datasets[0][opt] = this.dataOptions[opt];
      }
      for (var i = 0; i < this.line.datasets[0].points.length; ++i) {
        this.line.datasets[0].points[i].strokeColor = this.dataOptions.pointStrokeColor;
        this.line.datasets[0].points[i].highlightFill = this.dataOptions.pointHighlightFill;
        if (i <= this.curset.pos) {
          this.line.datasets[0].points[i].fillColor = this.dataOptions.pointColor;
          this.line.datasets[0].points[i].highlightStroke = this.dataOptions.pointHighlightStroke;
        } else {
          this.line.datasets[0].points[i].fillColor = this.dataOptions.disabledColor;
          this.line.datasets[0].points[i].highlightStroke = this.dataOptions.disabledColor;
        }
      }
      this.line.update();
    },
    globalOptions: {
      showScale: false,
      scaleShowLabels: false,
      datasetFill: false,
      responsive: true,
      maintainAspectRatio: false,
      pointHitDetectionRadius: 15,
      customTooltips: function(data) {
        if (data) {
          var index = chart.line.getIndexAtPoint(data.x, data.y);
          if (index.length > 0) {
            index = index[0];
            var label = chart.curset.points[index].label;
            var value = statList[chart.curstat].name + ": <span class=\"d3-color-green\">" +
              DiabloCalc[statList[chart.curstat].func || "formatNumber"](chart.curset.points[index].values[chart.curstat], 0, 1000) + "</span>";
            if (index != chart.curset.pos) {
              var was = chart.curset.points[index].values[chart.curstat];
              var now = chart.curset.points[chart.curset.pos].values[chart.curstat];
              if (now > 1) {
                var diff = 100 * ((was - now) / now);
                value += " (<span class=\"d3-color-green\">" + (diff >= 0 ? "+" : "") + DiabloCalc.formatNumber(diff, 2) + "%</span>)";
              }
            }
            var fmt = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + label + "</span><br/>" + value;
            if (index < chart.curset.pos) {
              fmt += "<br/><span class=\"d3-color-gray\">Click to undo</span>";
            } else if (index > chart.curset.pos) {
              fmt += "<br/><span class=\"d3-color-gray\">Click to redo</span>";
            }
            fmt += "</p></div>";
            DiabloCalc.tooltip.showHtml(chart.parent[0], fmt, data.x, data.y);
          }
        } else {
          DiabloCalc.tooltip.hide();
        }
      },
    },

    update: function() {
      if (this.line) {
        this.line.destroy();
      }
      var values = [], labels = [];
      this.parent.width(50 * (this.curset.points.length - 1) + 10);
      cFrame.scrollLeft(cFrame.get(0).scrollWidth);
      for (var i = 0; i < this.curset.points.length; ++i) {
        values.push(this.curset.points[i].values[this.curstat]);
        labels.push(this.curset.points[i].label);
      }
      this.line = this.chart.Line({
        labels: labels,
        datasets: [
          $.extend({data: values}, this.dataOptions),
        ],
      }, this.globalOptions);
      for (var i = 0; i < this.curset.points.length; ++i) {
        this.line.datasets[0].points[i].index = i;
      }
      for (var i = this.curset.pos + 1; i < this.curset.points.length; ++i) {
        this.line.datasets[0].points[i].fillColor = this.dataOptions.disabledColor;
        this.line.datasets[0].points[i].highlightStroke = this.dataOptions.disabledColor;
      }
      this.line.update();
    },

    init: function(parent, stat) {
      this.setTheme();
      this.parent = parent;
      this.canvas = $("<canvas></canvas>");
      parent.append(this.canvas);

      this.datasets = [createSet(0, "New Profile")];
      tlNewSet.before(this.datasets[0].line.addClass("selected"));
      this.datasets[0].del.addClass("disabled");
      this.curset = this.datasets[0];
      this.curstat = stat;

      this.ctx = this.canvas.get(0).getContext("2d");
      this.chart = new Chart(this.ctx);
      this.update();

      var self = this;
      parent.click(function(evt) {
        var pt = self.line.getIndexAtEvent(evt);
        if (pt.length) {
          self.undo(pt[0]);
        }
      });
    },

    add: function(point) {
      if (this.curset.pos < this.curset.points.length - 1) {
        this.curset.points = this.curset.points.slice(0, this.curset.pos + 1);
        this.update();
      }
      this.curset.pos = this.curset.points.length;
      this.curset.points.push(point);
      this.line.addData([point.values[this.curstat]], point.label);
      this.line.datasets[0].points[this.curset.pos].index = this.curset.pos;
      this.parent.width(50 * (this.curset.points.length - 1) + 10);
      cFrame.scrollLeft(cFrame.get(0).scrollWidth);
      this.line.resize(this.line.render, true);
    },
    addset: function(name, reset) {
      var newset = createSet(this.datasets.length, name, this.last());
      tlNewSet.before(newset.line);
      if (reset) {
        newset.profile = {
          items: {},
          skills: [],
          passives: [],
          paragon: {level: 0},
        };
        newset.points[0].values = getValue(DiabloCalc.getStats());
      }
      this.datasets.push(newset);
      for (var i = 0; i < this.datasets.length; ++i) {
        this.datasets[i].del.removeClass("disabled");
      }
      this.changeset(newset.index);
      setTimeout(this.curset.startedit, 0);
    },
    delset: function(index) {
      if (index < 0 || index >= this.datasets.length) return;
      if (this.datasets.length <= 1) return;
      if (this.curset == this.datasets[index]) {
        if (index < this.datasets.length - 1) {
          this.changeset(index + 1);
        } else {
          this.changeset(index - 1);
        }
      }
      this.datasets[index].line.remove();
      this.datasets.splice(index, 1);
      for (var i = index; i < this.datasets.length; ++i) {
        this.datasets[i].index = i;
      }
      if (this.datasets.length == 1) {
        this.datasets[0].del.addClass("disabled");
      }
    },
    clear: function() {
      for (var i = 0; i < this.datasets.length; ++i) {
        if (this.datasets[i] !== this.curset) {
          this.datasets[i].line.remove();
        }
      }
      this.datasets = [this.curset];
      this.curset.del.addClass("disabled");
    },
    addprofile: function(data) {
      var newset = createSet(this.datasets.length, "Load Profile", data);
      tlNewSet.before(newset.line);
      newset.profile = data;
      newset.values = data.values;
      newset.rename(data.name);
      newset.value.text(DiabloCalc[statList[this.curstat].func || "formatNumber"](newset.values[this.curstat] || 0, 0, 1000));
      this.datasets.push(newset);
      for (var i = 0; i < this.datasets.length; ++i) {
        this.datasets[i].del.removeClass("disabled");
      }
    },
    changeset: function(index) {
      if (this.curset == this.datasets[index]) return;
      this.curset.line.removeClass("selected");
      this.curset.profile = DiabloCalc.getProfile();
      this.curset = this.datasets[index];
      this.curset.line.addClass("selected");
      if (this.curset.profile) {
        DiabloCalc.setProfile(this.curset.profile, "set");
        this.curset.profile = undefined;
      }
      this.update();
      this.fixval();
    },
    changestat: function(stat) {
      this.curstat = stat;
      for (var i = 0; i < this.datasets.length; ++i) {
        if (this.datasets[i].values) {
          this.datasets[i].value.text(DiabloCalc[statList[stat].func || "formatNumber"](this.datasets[i].values[stat], 0, 1000));
        }
      }
      this.update();
    },
    fixval: function() {
      var index = this.curset.pos;
      this.curset.points[index].values = this.curset.values = getValue(DiabloCalc.getStats(), this.curset.points[index].values);
      var value = this.curset.values[this.curstat];
      this.curset.value.text(DiabloCalc[statList[this.curstat].func || "formatNumber"](value || 0, 0, 1000));
      this.line.datasets[0].points[index].value = value;
      this.line.update();
    },
    last: function() {
      return this.curset.points[this.curset.pos];
    },
    reset: function(name, data) {
      this.curset.points = [newBlankState(name, {values: data})];
      this.curset.values = data;
      this.curset.pos = 0;
      this.update();
    },
    undo: function(index) {
      DiabloCalc.importStart();
      this.line.update();
      while (this.curset.pos > index) {
        this.curset.points[this.curset.pos].undo();
        this.line.datasets[0].points[this.curset.pos].fillColor = this.dataOptions.disabledColor;
        this.line.datasets[0].points[this.curset.pos]._saved.fillColor = this.dataOptions.disabledColor;
        this.line.datasets[0].points[this.curset.pos].highlightStroke = this.dataOptions.disabledColor;
        --this.curset.pos;
      }
      while (this.curset.pos < index) {
        ++this.curset.pos;
        this.curset.points[this.curset.pos].redo();
        this.line.datasets[0].points[this.curset.pos].fillColor = this.dataOptions.pointColor;
        this.line.datasets[0].points[this.curset.pos]._saved.fillColor = this.dataOptions.pointColor;
        this.line.datasets[0].points[this.curset.pos].highlightStroke = this.dataOptions.pointHighlightStroke;
      }
      this.line.update();
      DiabloCalc.importEnd("undo", this.curset.points[this.curset.pos].values);
    },

    getProfiles: function() {
      var result = [];
      var datasets = $.extend([], this.datasets);
      datasets.sort(function(lhs, rhs) {
        return lhs.line.index() - rhs.line.index();
      });
      for (var i = 0; i < datasets.length; ++i) {
        if (datasets[i] === this.curset || datasets[i].profile) {
          var cur = {name: datasets[i].name};
          if (datasets[i] === this.curset) {
            cur = $.extend(cur, DiabloCalc.getProfile());
          } else {
            cur = $.extend(cur, datasets[i].profile);
          }
          cur.values = datasets[i].values;
          result.push(cur);
        }
      }
      return result;
    },
  };
  DiabloCalc.getAllProfiles = function() {
    var res = {};
    res.profiles = chart.getProfiles();
    if (!res.profiles.length) {
      return DiabloCalc.getProfile();
    }
    res.curstat = chart.curstat;
    res.class = res.profiles[0].class;
    res.active = DiabloCalc.getActive("global");
    return res;
  };
  DiabloCalc.setAllProfiles = function(data, evt) {
    if (!data.profiles) {
      DiabloCalc.setProfile(data, evt);
      return;
    }
    chart.clear();
    if (data.curstat) {
      selStat.val(data.curstat);
      selStat.trigger("chosen:updated");
      chart.curstat = data.curstat;
    }
    if (data.active) {
      DiabloCalc.setActive("global", data.active);
      for (var i = 0; i < data.profiles.length; ++i) {
        if (!data.profiles[i].active) {
          data.profiles[i].active = {};
          for (var k in data.active) {
            if (k.indexOf("buff") === 0) {
              if (data.active[k] instanceof Object) {
                data.profiles[i].active[k] = $.extend([], data.active[k]);
              } else {
                data.profiles[i].active[k] = data.active[k];
              }
            }
          }
        }
      }
    }
    chart.curset.rename(data.profiles[0].name);
    DiabloCalc.setProfile(data.profiles[0], evt);
    for (var i = 1; i < data.profiles.length; ++i) {
      chart.addprofile(data.profiles[i]);
    }
  };
  DiabloCalc.isModified = function() {
    return chart.curset.pos > 0;
  };
  DiabloCalc.recordDPS = function(dps) {
    chart.last().values.simdps = dps;
    chart.fixval();
  };

  var cacheSlots = {};
  var cacheSkills;
  var cacheParagon;
  function onImportEnd(mode, values) {
    cacheSlots = {};
    for (var slot in DiabloCalc.itemSlots) {
      cacheSlots[slot] = DiabloCalc.getSlot(slot);
    }
    cacheSkills = DiabloCalc.getSkills();
    cacheParagon = DiabloCalc.getParagonLevels();
    switch (mode) {
    case "import": chart.reset("Import Profile", values); break;
    case "class": chart.reset("Change Class"); break;
    case "load": chart.reset("Load Profile", values); break;
    }
  }
  function onUpdateSlot(slot, reason) {
    var prev = cacheSlots[slot];
    if (!prev) prev = null;
    cacheSlots[slot] = DiabloCalc.getSlot(slot);
    if (!prev && !cacheSlots[slot]) {
      return;
    }
    var last = chart.last();
    if (reason == "twohand" && /*!cacheSlots[slot] && */prev) {
      chart.add(newItemState("mainhand", undefined, prev, last));
      return;
    }
    if (slot === "offhand" && last.offhand && !cacheSlots[slot]) {
      return;
    }
    if (last.slot === slot) {
      if (last.pre === undefined) {
        last.pre = prev;
      }
      return;
    }
    chart.add(newItemState(slot, prev, undefined, last));
  }
  function onUpdateSkills(mode) {
    if (!mode) {
      return;
    }
    var prev = cacheSkills;
    cacheSkills = DiabloCalc.getSkills();
    var last = chart.last();
    if (last.skills === true) {
      return;
    }
    chart.add(newSkillsState(prev, last));
  }
  function onUpdateParagon() {
    var prev = cacheParagon;
    cacheParagon = DiabloCalc.getParagonLevels();
    var last = chart.last();
    if (last.paragon === true) {
      return;
    }
    chart.add(newParagonState(prev, last));
  }

  var frame = $(".timeline-frame");
  var tlLeftBox = $("<div class=\"timeline-left-box\"></div>");
  tlLeft = $("<ul></ul>").addClass("timeline-left");
  tlRight = $("<div></div>").addClass("timeline-right");
  frame.append(tlLeftBox.append(tlLeft)).append(tlRight);
  tlLeftBox.resizable({
    handles: "e",
    minWidth: 100,
    maxWidth: 280,
    resize: function(event, ui) {
      tlRight.css("left", ui.size.width + 4);
    },
  });
  //tlLeft = DiabloCalc.addScroll(tlLeft, "y");

  tlNewSet = $("<li class=\"timeline-set newset\"><b>New set</b></li>");
  tlNewSet.click(function(evt) {
    DiabloCalc.popupMenu(evt, {
      "Blank set": function() {
        chart.addset("New Set", true);
      },
      "Clone current set": function() {
        chart.addset("New Set");
      },
    });
  });
  tlLeft.append(tlNewSet);
  tlLeft.sortable({
    items: "li:not(.newset)",
    distance: 4,
    containment: "parent",
    axis: "y",
  });
  selStat = $("<select></select>").addClass("timeline-stat");
  for (var stat in statList) {
    selStat.append("<option value=\"" + stat + "\">" + statList[stat].name + "</option>");
  }
  tlRight.append(selStat);
  selStat.chosen({
    disable_search: true,
    inherit_select_classes: true,
  }).change(function() {
    chart.changestat($(this).val());
  });

  cFrame = $("<div></div>").addClass("canvas-frame");
  tlRight.append(cFrame);
  //cFrame = DiabloCalc.addScroll(cFrame, "x");

  var canvasBox = $("<div></div>").addClass("canvas-container");
  cFrame.append(canvasBox);
  chart.init(canvasBox, "damage");

  DiabloCalc.register("updateStats", function() {
    chart.fixval();
  });
  DiabloCalc.register("importEnd", onImportEnd);
  DiabloCalc.register("updateSlotItem", onUpdateSlot);
  DiabloCalc.register("updateSlotStats", onUpdateSlot);
  DiabloCalc.register("updateSkills", onUpdateSkills);
  DiabloCalc.register("updateParagon", onUpdateParagon);
  DiabloCalc.register("changeTheme", function() {
    chart.setTheme();
  });

  DiabloCalc.tipStatList = statList;

})();
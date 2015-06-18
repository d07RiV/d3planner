(function() {

  var level;
  var resetAll;
  var data = [
    {
      name: "Core",
      stats: [
        {
          stats: ["int", "str", "dex"],
          icons: [2, 0, 1],
          amount: 5,
        },
        {
          stat: "vit",
          icon: 3,
          amount: 5,
        },
        {
          stat: "ms",
          icon: 4,
          amount: 0.5,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stats: ["maxap", "maxhatred", "maxfury", "maxmana", "maxspirit", "maxwrath"],
          icons: [9, 7, 6, 5, 8, 10],
          amounts: [0.5, 0.5, 1, 4, 1, 0.5],
          decimal: 2,
          limit: 50,
        },
      ],
    },
    {
      name: "Offense",
      stats: [
        {
          stat: "ias",
          icon: 11,
          amount: 0.2,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "cdr",
          icon: 12,
          amount: 0.2,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "chc",
          icon: 13,
          amount: 0.1,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "chd",
          icon: 14,
          amount: 1,
          decimal: 2,
          limit: 50,
          percent: true,
        },
      ],
    },
    {
      name: "Defense",
      stats: [
        {
          stat: "life",
          icon: 15,
          amount: 0.5,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "armor_percent",
          icon: 16,
          amount: 0.5,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "resall",
          icon: 17,
          amount: 5,
          limit: 50,
        },
        {
          stat: "regen",
          icon: 18,
          amount: 214.5684,
          decimal: 1,
          limit: 50,
        },
      ],
    },
    {
      name: "Utility",
      stats: [
        {
          stat: "area",
          icon: 19,
          amount: 1,
          limit: 50,
          decimal: 2,
          percent: true,
        },
        {
          stat: "rcr",
          icon: 20,
          amount: 0.2,
          decimal: 2,
          limit: 50,
          percent: true,
        },
        {
          stat: "lph",
          icon: 21,
          amount: 160.926,
          decimal: 1,
          limit: 50,
        },
        {
          stat: "gf",
          icon: 22,
          amount: 1,
          decimal: 2,
          limit: 50,
          percent: true,
        },
      ],
    },
  ];

  var dataCache;
  DiabloCalc.getParagon = function() {
    if (dataCache !== undefined) {
      return dataCache;
    }
    dataCache = {};
    for (var i = 0; i < data.length; ++i) {
      for (var j = 0; j < data[i].stats.length; ++j) {
        var info = data[i].stats[j];

        dataCache[info.stat] = [info.amount * (parseInt(info.input.val()) || 0)];
      }
    }
    return dataCache;
  };
  var levelsCache;
  DiabloCalc.getParagonLevels = function() {
    if (levelsCache !== undefined) {
      return levelsCache;
    }
    var levels = {level: (parseInt(level.val()) || 0), data: []};
    for (var i = 0; i < data.length; ++i) {
      var list = [];
      for (var j = 0; j < data[i].stats.length; ++j) {
        var info = data[i].stats[j];
        list.push(parseInt(info.input.val()) || 0);
      }
      levels.data.push(list);
    }
    levelsCache = levels;
    return levels;
  };
  DiabloCalc.setParagon = function(levels) {
    level.val(levels.level);
    for (var i = 0; i < data.length; ++i) {
      for (var j = 0; j < data[i].stats.length; ++j) {
        var info = data[i].stats[j];
        info.input.val(levels.data ? levels.data[i][j] : 0);
        updateValue(info);
      }
    }

    onChangeLevel();
    dataCache = undefined;
    levelsCache = undefined;
    DiabloCalc.trigger("updateParagon");
  };

  function updateValue(info) {
    var value = (parseInt(info.input.val()) || 0);
    if (info.limit && value >= info.limit) {
      info.line.addClass("paragon-capped");
    } else {
      info.line.removeClass("paragon-capped");
    }
    info.tipvalue.text("+" + DiabloCalc.formatNumber(value * info.amount, info.decimal, 1000) + (info.percent ? "%" : ""));
  }
  function updateResets() {
    var sum = 0;
    for (var i = 0; i < data.length; ++i) {
      sum += data[i].spent;
    }
    if (sum == 0) {
      resetAll.hide();
    } else {
      resetAll.show();
    }
  }
  function updateCategory(i, unspent, spent) {
    data[i].unspent.text(unspent + " unspent points");
    if (unspent) {
      data[i].header.removeClass("paragon-spent");
    } else {
      data[i].header.addClass("paragon-spent");
    }
    if (spent == 0) {
      data[i].reset.hide();
    } else {
      data[i].reset.show();
    }
    data[i].spent = spent;
  }
  function getPoints(lvl, tab) {
    return Math.floor((Math.min(lvl, 800) - tab + 3) / 4) + (tab == 0 ? Math.max(0, lvl - 800) : 0);
  }
  function getLevelForPoints(pts, tab) {
    if (pts <= 200) {
      return pts * 4 + tab - 3;
    } else {
      return pts + 600;
    }
  }
  function onChangeLevel() {
    var plvl = (parseInt(level.val()) || 0);
    var totalSpent = 0;
    for (var i = 0; i < data.length; ++i) {
      var allowed = getPoints(plvl, i);
      var spent = 0;
      for (var j = 0; j < data[i].stats.length; ++j) {
        spent += (parseInt(data[i].stats[j].input.val()) || 0);
      }
      if (allowed < spent) {
        for (var j = data[i].stats.length - 1; j >= 0; --j) {
          var value = (parseInt(data[i].stats[j].input.val()) || 0);
          var delta = Math.min(value, spent - allowed);
          data[i].stats[j].input.val(value - delta);
          spent -= delta;
          updateValue(data[i].stats[j]);
        }
        dataCache = undefined;
        levelsCache = undefined;
        DiabloCalc.trigger("updateParagon");
      }
      updateCategory(i, allowed - spent, spent);
    }
    updateResets();
  }
  function resetLevels(tab) {
    if (tab === undefined) {
      for (var i = 0; i < data.length; ++i) {
        for (var j = 0; j < data[i].stats.length; ++j) {
          data[i].stats[j].input.val(0);
          updateValue(data[i].stats[j]);
        }
      }
    } else {
      for (var j = 0; j < data[tab].stats.length; ++j) {
        data[tab].stats[j].input.val(0);
        updateValue(data[tab].stats[j]);
      }
    }
    onChangeLevel();
    DiabloCalc.trigger("updateParagon");
  }
  function onChangeStat(i, j) {
    var info = data[i].stats[j];

    var sum = 0;
    for (var k = 0; k < data[i].stats.length; ++k) {
      sum += (parseInt(data[i].stats[k].input.val()) || 0);
    }
    var plvl = (parseInt(level.val()) || 0);
    var allowed = getPoints(plvl, i);
    if (sum > allowed) {
      if (i > 0 && sum > 200) {
        info.input.val(Math.max(0, (parseInt(info.input.val()) || 0) - (sum - allowed)));
      } else {
        level.val(getLevelForPoints(sum, i));
      }
      onChangeLevel();
    } else {
      updateCategory(i, allowed - sum, sum);
      updateResets();
    }

    updateValue(info);

    dataCache = undefined;
    levelsCache = undefined;
    DiabloCalc.trigger("updateParagon");
  }
  function addStat(i, j, amount) {
    var info = data[i].stats[j];

    var sum = 0;
    for (var k = 0; k < data[i].stats.length; ++k) {
      sum += (parseInt(data[i].stats[k].input.val()) || 0);
    }
    var plvl = (parseInt(level.val()) || 0);
    var allowed = getPoints(plvl, i);
    var value = (parseInt(info.input.val()) || 0);
    var delta = Math.min(amount, allowed - sum);
    if (info.limit) {
      delta = Math.min(delta, info.limit - value);
    }

    info.input.val(value + delta);
    updateCategory(i, allowed - sum - delta, sum + delta);
    updateResets();
    updateValue(info);

    dataCache = undefined;
    levelsCache = undefined;
    DiabloCalc.trigger("updateParagon");
  }

  function onChangeClass() {
    var charClass = $(".char-class").val();
    for (var i = 0; i < data.length; ++i) {
      for (var j = 0; j < data[i].stats.length; ++j) {
        var info = data[i].stats[j];
        if (info.stats) {
          for (var k = 0; k < info.stats.length; ++k) {
            var stat = info.stats[k];
            if (!DiabloCalc.stats[stat].classes || DiabloCalc.stats[stat].classes.indexOf(charClass) >= 0) {
              info.stat = stat;
              if (info.icons) {
                info.icon = info.icons[k];
              }
              info.tipicon.css("background-position", (-info.icon * 24) + "px 0");
              info.tipname.text(DiabloCalc.stats[stat].name);
              if (info.amounts) {
                info.amount = info.amounts[k];
              }
              updateValue(info);
              break;
            }
          }
        }
      }
    }

    dataCache = undefined;
    levelsCache = undefined;
    DiabloCalc.trigger("updateParagon");
  }

  var tab = $("#tab-paragon");
  tab = DiabloCalc.addScroll(tab, "y");
  resetAll = $("<span class=\"reset-link reset-all\">Reset all</span>").hide();
  resetAll.click(function() {
    resetLevels();
  });
  var header = $("<div class=\"paragon-header\"></div>");
  var title = $("<span class=\"paragon-level\"></span>").text("Paragon level");
  level = $("<input></input>").attr("type", "number").attr("min", "0").val(0);
  level.blur(DiabloCalc.validateNumber).change(onChangeLevel);
  title.append(level);
  header.append(resetAll).append(title);
  tab.append(header);
  for (var i = 0; i < data.length; ++i) {
    data[i].header = $("<h3></h3>").text(data[i].name + " ").addClass("paragon-spent");
    data[i].unspent = $("<span class=\"paragon-unspent\"></span>").text("0 unspent points");
    data[i].reset = $("<span class=\"reset-link reset-tab\">(reset)</span>").hide();
    tab.append(data[i].header.append(data[i].reset).append(data[i].unspent));
    data[i].category = $("<ul></ul>");
    tab.append(data[i].category);

    data[i].reset.click((function(i) {return function() {
      resetLevels(i);
    };})(i));

    for (var j = 0; j < data[i].stats.length; ++j) {
      var info = data[i].stats[j];
      if (info.stats) {
        info.stat = info.stats[0];
      }
      if (info.icons) {
        info.icon = info.icons[0];
      }
      if (info.amounts) {
        info.amount = info.amounts[0];
      }

      info.line = $("<li></li>");
      info.tipicon = $("<span class=\"icon\"></span>").css("background-position", (-info.icon * 24) + "px 0");
      info.tipname = $("<span></span>").text(DiabloCalc.stats[info.stat].name);
      info.tipvalue = $("<span class=\"paragon-effect\"></span>").text(0);
      info.add = $("<span class=\"paragon-add\">&nbsp;</span>");
      info.input = $("<input type=\"number\" min=\"0\"></input>").val(0);
      if (info.percent) {
        info.tipvalue.addClass("paragon-percent");
      }
      if (info.limit) {
        info.input.attr("max", info.limit);
      }
      info.input.blur(DiabloCalc.validateNumber);
      info.input.on("input", (function(i, j) {
        return function() {onChangeStat(i, j);};
      })(i, j));
      info.add.click((function(i, j) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          addStat(i, j, e.ctrlKey ? 100 : (e.shiftKey ? 10 : 1));
        };
      })(i, j));

      info.line.append(info.tipicon, info.tipname, info.input, info.add, info.tipvalue);
      data[i].category.append(info.line);

      updateValue(info);
    }
  }

  DiabloCalc.register("changeClass", onChangeClass);
  onChangeClass();

})();

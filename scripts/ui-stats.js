(function() {
  var _L = DiabloCalc.locale("ui-stats.js");

  var statList = DiabloCalc.localeTable.uiStats;

  function formatTip(stat, data) {
    var text = stat.tooltip;
    var values = data.getValue(stat.stat);
    text = text.replace(/{([^};]*)(?:;(\+)?([0-9])?(\%)?(x)?)?}/g, function(m, expr, plus, precision, percent, times) {
      expr = expr.replace(/\$([1-9])/g, function(m, index) {
        return (typeof values == "number" ? values : values[["min", "max"][parseInt(index) - 1]]);
      });
      expr = data.execString(expr);
      if (typeof expr === "number") {
        expr = DiabloCalc.formatNumber(expr, precision, 1000);
      } else {
        expr = DiabloCalc.formatNumber(expr.min, precision, 1000) + "-" + DiabloCalc.formatNumber(expr.max, precision, 1000);
      }
      return "<span class=\"d3-color-green\">" + (plus || "") + expr + (percent || "") + (times || "") + "</span>";
    });
    text = text.replace(/\$([1-9])/g, function(m, index) {
      return "<span class=\"d3-color-green\">" + (stat.plus ? "+" : "") + DiabloCalc.formatNumber(typeof values == "number" ?
        values : values[["min", "max"][parseInt(index) - 1]], stat.decimal, 1000) + (stat.percent ? "%" : "") + "</span>";
    });
    text = text.replace(/<\/span>-<span class="d3-color-green">/g, "-");
    var first = "</span>";
    text = text.replace(/\n( ?\* )?/g, function(m, bullet) {
      var res = first + "<br/><span class=\"tooltip-icon-" + (bullet ? "bullet" : "nobullet") + "\"></span>";
      first = "";
      return res;
    });
    var srcstat = (stat.sourcestat || stat.stat);
    if (DiabloCalc.stats[srcstat]) {
      var sources = {};
      var limits = {};
      if (srcstat != "damage" && (!DiabloCalc.stats[srcstat].classes || DiabloCalc.stats[srcstat].classes.indexOf(DiabloCalc.charClass) >= 0) && DiabloCalc.getItemAffixes) {
        for (var slot in DiabloCalc.itemSlots) {
          var affixes = DiabloCalc.getItemAffixes(slot, true);
          if (affixes && affixes[srcstat] && affixes[srcstat].min && affixes[srcstat].max) {
            sources[slot] = 0;
            limits[slot] = affixes[srcstat];
          }
        }
      }
      if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].resist && data.sources.resall) {
        sources = $.extend(sources, data.sources.resall);
        for (var slot in data.sources.resall) {
          if (DiabloCalc.itemSlots[slot] && DiabloCalc.getItemAffixes) {
            var affixes = DiabloCalc.getItemAffixes(slot, true);
            if (affixes && affixes.resall && affixes.resall.min && affixes.resall.max) {
              limits[slot] = affixes.resall;
            }
          }
        }
      }
      if (data.sources[srcstat]) {
        sources = $.extend(sources, data.sources[srcstat]);
      }
      var exlist = [];
      if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].special) {
        exlist = data.getSpecial(srcstat, null, false, null);
      }

      if (!$.isEmptyObject(sources) || !$.isEmptyObject(exlist)) {
        text += first;
        text += "<br/><span class=\"tooltip-icon-bullet\"></span>" + (stat.sourcename || _L("Increased by")) + ":";
        first = "";

        var decimal = (stat.sourcedecimal === undefined ? stat.decimal : stat.sourcedecimal);
        var percent = ((stat.sourcepercent === undefined ? stat.percent : stat.sourcepercent) ? "%" : "");
        function fmtNumber(amount) {
          return DiabloCalc.formatNumber(amount, decimal, 1000) + percent;
        }

        for (var src in sources) {
          if (DiabloCalc.sourceNames[src]) {
            text += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-" + (sources[src] ? "gold" : "gray") + "\">" + DiabloCalc.sourceNames[src] + "</span>: ";
            if (sources[src]) {
              text += "<span class=\"d3-color-green\">" + fmtNumber(sources[src]) + "</span>";
              if (limits[src]) {
                text += " <span class=\"d3-color-gray\">(" + fmtNumber(limits[src].min) + "-" + fmtNumber(limits[src].max) + ")</span>";
              }
            } else if (limits[src]) {
              text += "<span class=\"d3-color-gray\">" + fmtNumber(limits[src].min) + "-" + fmtNumber(limits[src].max) + "</span>";
            }
          }
        }
        for (var i = 0; i < exlist.length; ++i) {
          text += "<br/><span class=\"tooltip-icon-nobullet\"></span><span class=\"d3-color-gold\">" + exlist[i][0] + "</span>: ";
          text += "<span class=\"d3-color-green\">" + fmtNumber(exlist[i][1]) + "</span>";
        }
      }
    }
    return "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + text + first + "</p></div>";
  }
  function highlightSlots(srcstat, data) {
    var sources = data.sources[srcstat] || {};
    if (DiabloCalc.onHighlight) DiabloCalc.onHighlight(true);
    if (DiabloCalc.stats[srcstat] && DiabloCalc.stats[srcstat].resist && data.sources.resall) {
      sources = $.extend(sources, data.sources.resall);
    }
    for (var slot in DiabloCalc.itemSlots) {
      if (sources[slot] || (DiabloCalc.itemSlots[slot].item && sources[DiabloCalc.itemSlots[slot].item.id])) {
        DiabloCalc.itemSlots[slot].dollFrame.addClass("highlight");
      }
    }
  }
  function highlightSlotsOff() {
    if (DiabloCalc.onHighlight) DiabloCalc.onHighlight(false);
    for (var slot in DiabloCalc.itemSlots) {
      if (DiabloCalc.itemSlots[slot].dollFrame) {
        DiabloCalc.itemSlots[slot].dollFrame.removeClass("highlight");
      }
    }
  }

  function onUpdateStats() {
    var data = DiabloCalc.getStats();
    var charClass = $(".char-class").val();
    for (var i = 0; i < statList.length; ++i) {
      for (var j = 0; j < statList[i].stats.length; ++j) {
        var info = statList[i].stats[j];
        if (info.separator) {
          continue;
        }
        if (info.classes && info.classes.indexOf(charClass) < 0) {
          info.line.hide();
          continue;
        }
        var value = data.getValue(info.stat);
        if (info.collapse && !value) {
          info.line.hide();
          continue;
        }
        if (typeof value === "number") {
          info.line.toggleClass("zero", !value);
          value = DiabloCalc.formatNumber(value, info.decimal, 1000);
        } else {
          info.line.toggleClass("zero", !value.min && !value.max);
          value = DiabloCalc.formatNumber(value.min, info.decimal, 1000) + "-" + DiabloCalc.formatNumber(value.max, info.decimal, 1000);
        }
        info.value.text((info.plus ? "+" : "") + value + (info.percent ? "%" : ""));
        info.line.show();
      }
    }
  }

  var tab = $(".col.statsframe");
  tab = DiabloCalc.addScroll(tab, "y");
  tab.append(DiabloCalc.account.makeLine());

  var offense = statList[1].stats;
  var sep = 0;
  while (sep < offense.length && !offense[sep].separator) {
    sep++;
  }
  for (var stat in DiabloCalc.stats) {
    if (DiabloCalc.stats[stat].skill) {
      offense.splice(sep, 0, {
        name: _L("{0} Damage Increase").format(DiabloCalc.stats[stat].skill),
        stat: stat,
        decimal: 2,
        percent: true,
        classes: DiabloCalc.stats[stat].classes,
        collapse: true,
        tooltip: _L("{0} Damage Increase: $1\n* Increases Damage dealt by this skill.").format(DiabloCalc.stats[stat].skill),
      });
    }
  }

  var container = $("<div class=\"col-container\"></div>");
  tab.append(container);
  var column = $("<div class=\"column\"></div>");
  container.append(column);
  var statMap = {};
  for (var i = 0; i < statList.length; ++i) {
    var section = $("<div class=\"stat-section\"></div>");
    column.append(section);
    section.append("<h3>" + statList[i].name + "</h3>");
    var ul = $("<ul class=\"flex\"></ul>");
    section.append(ul);
    for (var j = 0; j < statList[i].stats.length; ++j) {
      var info = statList[i].stats[j];
      info.line = $("<li></li>");
      statMap[info.stat] = info;
      ul.append(info.line);

      if (info.separator) {
        info.line.addClass("stat-separator");
        continue;
      }

      info.line.append("<span>" + (info.name || DiabloCalc.stats[info.stat].name) + "</span>");
      info.value = $("<span></span>");
      info.line.append(info.value);

      info.line.hover((function(info) {return function() {
        if (!DiabloCalc.getStats || !DiabloCalc.tooltip) {
          return;
        }
        var stats = DiabloCalc.getStats();
        DiabloCalc.tooltip.showHtml(this, formatTip(info, stats), "left");
        var srcstat = (info.sourcestat || info.stat);
        highlightSlots(srcstat, stats);
      };})(info), function() {
        if (!DiabloCalc.tooltip) {
          return;
        }
        DiabloCalc.tooltip.hide();
        highlightSlotsOff();
      });
    }
  }
  DiabloCalc.isKnownStat = function(stat) {
    return !!statMap[stat];
  };
  DiabloCalc.showStatTip = function(elem, stat) {
    if (statMap[stat]) {
      DiabloCalc.tooltip.showHtml(elem, formatTip(statMap[stat], DiabloCalc.getStats()));
    }
  };
  //column.append("<div class=\"stat-separator\"></div>");
  var second = $("<div class=\"column\"></div>");
  container.append(second);
  function recv() {
    tab.addClass("two-column");
  }
  function remv() {
    setTimeout(function() {
      if (second.is(":empty")) {
        tab.removeClass("two-column");
      }
    }, 0);
  }
  container.find(".column").sortable({
    containment: container,
    connectWith: ".col.statsframe .column",
    items: ".stat-section",
    handle: "h3",
    distance: 4,
    placeholder: "drop-ph",
    forcePlaceholderSize: true,
    start: recv,
    stop: remv,
  });
  /*second.sortable({
    over: recv,
    receive: recv,
    out: remv,
    remove: remv,
  });*/

  $(".col.statsframe h3").click(function() {
    $(this).next().slideToggle();
  });

  DiabloCalc.register("updateStats", onUpdateStats);
})();

(function() {
  var _L = DiabloCalc.locale("bnet-tooltips.js");

  var d2font = new Image();
  var d2glyphs = [];
  var d2callback;
  var d2colors = [
    "#FFFFFF", // white
    "#FF4D4D", // broken
    "#00FF00", // set
    "#6969FF", // magic
    "#C7B377", // unique
    "#696969", // gray
    "#000000", // (runewords.. not really)
    "#D0C27D", // no idea
    "#FFA800", // crafted
    "#FFFF64", // rare
  ];
  DiabloCalc.enableD2 = function() {
    d2font.onload = function() {
      if (!window.ImageData) return;
      var glyph = document.createElement("canvas");
      glyph.width = this.width;
      glyph.height = this.height;
      var ctx = glyph.getContext("2d");
      ctx.drawImage(this, 0, 0);
      d2glyphs.push(glyph);
      var src = ctx.getImageData(0, 0, this.width, this.height);

      for (var i = 1; i < d2colors.length; ++i) {
        var glyph = document.createElement("canvas");
        glyph.width = this.width;
        glyph.height = this.height;
        var ctx = glyph.getContext("2d");
        var dst = ctx.createImageData(this.width, this.height);

        var mr = parseInt(d2colors[i].substr(1, 2), 16) / 255;
        var mg = parseInt(d2colors[i].substr(3, 2), 16) / 255;
        var mb = parseInt(d2colors[i].substr(5, 2), 16) / 255;
        for (var j = 0; j < src.data.length; j += 4) {
          dst.data[j] = Math.round(src.data[j] * mr);
          dst.data[j + 1] = Math.round(src.data[j + 1] * mg);
          dst.data[j + 2] = Math.round(src.data[j + 2] * mb);
          dst.data[j + 3] = src.data[j + 3];
        }

        ctx.putImageData(dst, 0, 0);
        d2glyphs.push(glyph);
      }

      this.loaded = true;
      if (d2callback) d2callback();
    };
    d2font.src = "/css/fonts/font16.png";
    DiabloCalc.d2tips = true;
  };
  var d2kerning = [
    12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
    12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
     8, 8, 7, 8, 8,13,12, 4, 5, 5, 6, 8, 5, 5, 5, 9,
    12, 5, 9, 8, 9, 9, 8, 8, 7, 8, 5, 5, 6, 7, 6, 8,
    11,12, 7, 9,10, 8, 8,10, 9, 5, 5, 9, 8,12,10,11,
     9,12,10, 7,11,12,13,16,12,12,10, 5, 9, 5, 5, 9,
     5,10, 7, 8, 8, 7, 7, 9, 7, 4, 4, 8, 7,10, 9,10,
     7,10, 9, 7, 9,10,10,13,10,10, 7, 6, 3, 6, 6,12,
    12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
    12, 5, 6,12,12,12,12,12,12,12,12,12,12,12,12,12,
     8, 8, 7, 8, 7,12, 3, 6, 6,11, 9, 7,10, 4,11, 9,
     7, 9, 7, 7, 5,13, 9, 7, 7, 3, 8, 8,11,13,12, 8,
    12,12,12,12,12,12,11,10, 8, 7, 8, 8, 5, 5, 5, 7,
    11,11,11,11,11,12,11,10,11,13,13,13,12,12, 8, 9,
    11,10,10,10,10,10,10, 8, 7, 6, 7, 7, 4, 5, 4, 5,
     8, 9,10, 9, 9,10,10, 8,10,10,10,10,10,10, 7,10
  ];

  function drawD2(lines) {
    for (var i = 0; i < lines.length; ++i) {
      var cw = 0, j;
      var si = undefined, sc = 0, cc = 0;
      for (j = 0; j < lines[i].length && (cw <= 800 || si === undefined); ++j) {
        if (lines[i][j] == "$" && d2colors[lines[i][j + 1]]) {
          cc = lines[i][++j];
        } else {
          if (lines[i][j] == " ") {
            si = j;
            sc = cc;
          }
          cw += d2kerning[lines[i].charCodeAt(j)];
        }
      }
      if (j < lines[i].length && si !== undefined) {
        lines.splice(i + 1, 0, (sc ? "$" + sc : "") + lines[i].substr(si + 1));
        lines[i] = lines[i].substr(0, si);
      }
    }

    if (!window.ImageData) {
      // IE fallback
      var res = $("<div></div>");
      for (var i = 0; i < lines.length; ++i) {
        if (!lines[i].length) {
          res.append("<br/>");
          continue;
        }
        var line = "";
        var clr = 0;
        for (var j = 0; j < lines[i].length; ++j) {
          if (lines[i][j] == "$" && d2colors[lines[i][j + 1]]) {
            if (clr) line += "</span>";
            clr = parseInt(lines[i][++j]);
            if (clr) line += "<span style=\"color: " + d2colors[clr] + "\">";
          } else {
            line += lines[i][j];
          }
        }
        if (clr) line += "</span>";
        res.append("<div>" + line + "</div>");
      }
      return res;
    }
    if (!d2font.loaded) {
      var dummy = $("<div>loading...</div>");
      d2callback = function() {
        dummy.replaceWith(drawD2(lines));
      };
      return dummy;
    }

    var width = 0;
    var height = 0;
    var linew = [];
    for (var i = 0; i < lines.length; ++i) {
      height += 16;
      var cw = 0;
      for (var j = 0; j < lines[i].length; ++j) {
        if (lines[i][j] == "$" && d2colors[lines[i][j + 1]]) {
          ++j;
        } else {
          cw += d2kerning[lines[i].charCodeAt(j)];
        }
      }
      linew.push(cw);
      if (cw > width) width = cw;
    }
    width += 8;

    var canvas = $("<canvas></canvas>");
    canvas[0].width = width;
    canvas[0].height = height;
    var ctx = canvas[0].getContext("2d");

    for (var i = 0; i < lines.length; ++i) {
      var y = i * 16;
      var x = Math.max(0, Math.floor((width - linew[i]) / 2));
      var src = d2glyphs[0];
      for (var j = 0; j < lines[i].length; ++j) {
        if (lines[i][j] == "$" && d2glyphs[lines[i][j + 1]]) {
          src = d2glyphs[lines[i][++j]];
        } else {
          var idx = lines[i].charCodeAt(j);
          ctx.drawImage(src, (idx % 2) * 14, Math.floor(idx / 2) * 16, 14, 16, x, y, 14, 16);
          x += d2kerning[idx];
        }
      }
    }

    return canvas;
  }

  DiabloCalc.itemPerfection = function(data) {
    var slot;
    if (typeof data === "string") {
      slot = data;
      data = DiabloCalc.getSlot(slot);
    } else if (data) {
      var slots = [];
      for (var cur in DiabloCalc.itemSlots) {
        if (DiabloCalc.itemSlots[cur].item && DiabloCalc.itemSlots[cur].item.id === data.id) {
          slots = [cur];
          break;
        }
        if (DiabloCalc.isItemAllowed(cur, data.id)) {
          slots.push(cur);
        }
      }
      if (!slots.length) return;
      slot = slots[0];
    }
    if (!data) return;
    var affixes = DiabloCalc.getItemAffixesById(data.id, data.ancient, false);
    var required = DiabloCalc.getItemAffixesById(data.id, data.ancient, "only");
    var info = {stats: {}, total: 0};
    var dataMin = $.extend(true, {}, data);
    var dataMax = $.extend(true, {}, data);
    var count = 0;
    for (var stat in data.stats) {
      var range = required[stat];
      if (!range) range = affixes[stat];
      if (!range || range.max === undefined || range.min === range.max) continue;
      if (range.noblock && affixes[stat] && data.stats[stat][0] > range.max) {
        range = $.extend({}, range);
        if (DiabloCalc.stats[stat] && DiabloCalc.stats[stat].dr) {
          range.min = 100 - 0.01 * (100 - range.min) * (100 - affixes[stat].min);
          range.max = 100 - 0.01 * (100 - range.max) * (100 - affixes[stat].max);
        } else {
          range.min += affixes[stat].min;
          range.max += affixes[stat].max;
        }
      }
      var ratio = (data.stats[stat][0] - range.min) / (range.max - range.min);
      if (range.best === "min") {
        ratio = 1 - ratio;
        dataMin.stats[stat][0] = range.max;
        dataMax.stats[stat][0] = range.min;
      } else {
        dataMin.stats[stat][0] = range.min;
        dataMax.stats[stat][0] = range.max;
      }
      if (range.max2 !== undefined && range.min2 !== range.max2) {
        ratio = 0.5 * (ratio + ((data.stats[stat][1] || 0) - range.min2) / (range.max2 - range.min2));
        dataMin.stats[stat][1] = range.min2;
        dataMax.stats[stat][2] = range.max2;
      }
      info.stats[stat] = ratio;
      var statInfo = DiabloCalc.stats[stat];
      if (!statInfo || (!statInfo.base && !statInfo.secondary) || stat === "custom") {
        info.total += ratio;
        ++count;
      }
    }
    if (count) info.total /= count;
    else info.total = 1;
    var stats = DiabloCalc.computeStats(function(id) {
      return (id === slot ? data : DiabloCalc.getSlot(id));
    });
    var statsMin = DiabloCalc.computeStats(function(id) {
      return (id === slot ? dataMin : DiabloCalc.getSlot(id));
    });
    var statsMax = DiabloCalc.computeStats(function(id) {
      return (id === slot ? dataMax : DiabloCalc.getSlot(id));
    });
    info.dps = (statsMax.info.dps > statsMin.info.dps + 1 ?
      (stats.info.dps - statsMin.info.dps) / (statsMax.info.dps - statsMin.info.dps) : 1);
    info.dpsDelta = Math.max(0, statsMax.info.dps - stats.info.dps);
    info.toughness = (statsMax.info.toughness > statsMin.info.toughness + 1 ?
      (stats.info.toughness - statsMin.info.toughness) / (statsMax.info.toughness - statsMin.info.toughness) : 1);
    info.toughnessDelta = Math.max(0, statsMax.info.toughness - stats.info.toughness);
    return info;
  };

  DiabloCalc.tooltip = new function() {
    var tooltipWrapper;
    var tooltipContent;
    var tooltipBody;
    var side_tooltipWrapper;
    var side_tooltipContent;
    var curNode;
    var curCompare;
    var enabled = true;
    var shiftKey = false, altKey = false;

    function initialize() {
      if (!tooltipBody) {
        tooltipBody = $("<div class=\"tooltip-body\"></div>");
        $("body").append(tooltipBody);
      }
      tooltipWrapper = $("<div></div>").addClass("d3-tooltip-wrapper").hide();
      tooltipContent = $("<div></div>");
      $(tooltipBody).append(tooltipWrapper.append(tooltipContent));
    }
    function side_initialize() {
      if (!tooltipBody) {
        tooltipBody = $("<div class=\"tooltip-body\"></div>");
        $("body").append(tooltipBody);
      }
      side_tooltipWrapper = $("<div></div>").addClass("d3-tooltip-wrapper").hide();
      side_tooltipContent = $("<div></div>");
      $(tooltipBody).append(side_tooltipWrapper.append(side_tooltipContent));
    }

    var tipRect, tipSide;
    function tipScroll(evt) {
      if (!tipRect || !enabled) {
        return;
      }
      var wnd = $(window);
      var wndRect = {
        left: 5, top: 5,
        right: wnd.width() - 5, bottom: wnd.height() - 5,
      };
      var oldLeft = tipRect.left;
      var oldTop = tipRect.top;
      var width = tipRect.right - tipRect.left;
      var height = tipRect.bottom - tipRect.top;
      var clipped = false;
      function clipBy(val, min, max) {
        if (val < min) {
          val = min;
          clipped = true;
        }
        if (val > max) {
          val = max;
          clipped = true;
        }
        return val;
      }
      if (width > wndRect.right - wndRect.left) {
        tipRect.left = clipBy(tipRect.left + evt.deltaX * evt.deltaFactor,
          wndRect.right - width, wndRect.left);
        tipRect.right = tipRect.left + width;
      }
      if (height > wndRect.bottom - wndRect.top) {
        tipRect.top = clipBy(tipRect.top + evt.deltaY * evt.deltaFactor,
          wndRect.bottom - height, wndRect.top);
        tipRect.bottom = tipRect.top + height;
      }
      tooltipWrapper.css({left: tipRect.left, top: tipRect.top, visibility: "visible"});
      if (!clipped) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }

    function show(node, ox, oy, _side) {
      if (!_side) {
        side_hide();
      }
      if (curNode) {
        $(curNode).unmousewheel(tipScroll);
      }
      curNode = node;
      clearTimeout(loadingTimeout);
      if(tooltipWrapper == null) {
        initialize();
      }

      tooltipWrapper.css({left: 0, top: 0, visibility: "hidden"}).show();

      node = $(node);
      var wnd = $(window);
      var offset = node.offset();
      var rect = {
        left: offset.left - wnd.scrollLeft(),
        top: offset.top - wnd.scrollTop(),
      };
      rect.right = rect.left + node.outerWidth();
      rect.bottom = rect.top + node.outerHeight();
      var wndRect = {
        left: 50, top: 5,
        right: wnd.width() - 50, bottom: wnd.height() - 5,
      };

      var order = ["right", "left", "top", "bottom"];
      if (typeof ox === "string") {
        var idx = order.indexOf(ox);
        if (idx > 0) {
          order[idx] = order[0];
          order[0] = ox;
        }
        ox = undefined;
      }

      if (ox !== undefined) {
        rect.left = rect.right = rect.left + ox;
      }
      if (oy !== undefined) {
        rect.top = rect.bottom = rect.top + oy;
      }

      if (ox === undefined && oy === undefined && window.touchEvent && window.touchEvent.touches.length) {
        rect.left = window.touchEvent.touches[0].pageX - wnd.scrollLeft() - 30;
        rect.top = window.touchEvent.touches[0].pageY - wnd.scrollTop() - 20;
        rect.right = rect.left + 60;
        rect.bottom = rect.top + 40;
      }

      var padX = Math.max(5, 20 - (rect.right - rect.left));
      var padY = 25;

      var x, y;
      var tipWidth = tooltipWrapper.outerWidth();
      var tipHeight = tooltipWrapper.outerHeight();

      if (_side) {
        wndRect.left += tipWidth - 40;
        wndRect.right -= tipWidth - 40;
      }

      var horzY = Math.max(wndRect.top, rect.top - tipHeight);
      var vertX = (rect.left + rect.right - tipWidth) / 2;
      vertX = Math.min(vertX, wndRect.right - tipWidth);
      vertX = Math.max(vertX, wndRect.left);

      var x, y;
      for (var i = 0; i < order.length; ++order) {
        if (order[i] === "right") {
          if (rect.right + padX + tipWidth <= wndRect.right) {
            x = rect.right + padX;
            y = horzY;
            tipSide = "right";
            break;
          }
        } else if (order[i] === "left") {
          if (rect.left - padX - tipWidth >= wndRect.left) {
            x = rect.left - padX - tipWidth;
            y = horzY;
            tipSide = "left";
            break;
          }
        } else if (order[i] === "top") {
          if (rect.top - padY - tipHeight >= wndRect.top) {
            x = vertX;
            y = rect.top - padY - tipHeight;
            tipSide = "top";
            break;
          }
        } else if (order[i] === "bottom") {
          if (rect.bottom + padY + tipHeight <= wndRect.bottom) {
            x = vertX;
            y = rect.bottom + padY;
            tipSide = "bottom";
            break;
          }
        }
      }
      if (x === undefined) {
        if (wndRect.right - rect.right > rect.left - wndRect.left) {
          x = rect.right + padX;
          y = horzY;
          tipSide = "right";
        } else {
          x = rect.left - padX - tipWidth;
          y = horzY;
          tipSide = "left";
        }
      }
      tipRect = {
        left: x,
        top: y,
        right: x + tipWidth,
        bottom: y + tipHeight
      };
      reveal(x, y);
      if (tipHeight > wndRect.bottom - wndRect.top) {
        node.mousewheel(tipScroll);
      }
    }
    function side_show() {
      if(side_tooltipWrapper == null) {
        side_initialize();
      }

      side_tooltipWrapper.css({left: 0, top: 0, visibility: "hidden"}).show();

      var wnd = $(window);
      var wndRect = {
        left: 50, top: 5,
        right: wnd.width() - 50, bottom: wnd.height() - 5,
      };

      var tipWidth = side_tooltipWrapper.outerWidth();
      var tipHeight = side_tooltipWrapper.outerHeight();

      var horzY = Math.max(Math.min(tipRect.top, wndRect.bottom - tipHeight), wndRect.top);
      var vertX = (wndRect.right - tipRect.right > tipRect.left - wndRect.left ? tipRect.right + 2 : tipRect.left - tipWidth - 2);

      var x, y;
      if (tipSide === "right") {
        x = tipRect.right + 2;
        y = horzY;
      } else if (tipSide === "left") {
        x = tipRect.left - tipWidth - 2;
        y = horzY;
      } else if (tipSide === "top") {
        x = vertX;
        y = Math.max(tipRect.bottom - tipHeight, wndRect.top);
      } else {
        x = vertX;
        y = vertY;
      }

      if (enabled) {
        side_tooltipWrapper.css({left: x, top: y, visibility: "visible"});
      }
    }

    var cache = {};
    var loadingTimeout;

    function side_hide() {
      if (side_tooltipWrapper) {
        side_tooltipWrapper.hide();
      }
    }
    function hide() {
      side_hide();
      if (curNode) {
        $(curNode).unmousewheel(tipScroll);
      }
      curNode = undefined;
      curCompare = undefined;
      tipRect = undefined;
      clearTimeout(loadingTimeout);
      if (tooltipWrapper) {
        tooltipWrapper.hide();
      }
    }

    function reveal(x, y) {
      if (enabled) {
        var wnd = $(window);
        tooltipWrapper.css({left: x, top: y, visibility: "visible"});
      }
    }

    function showHtml(node, html, x, y) {
      if(tooltipWrapper == null) {
        initialize();
      }
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "none");
      tooltipContent.removeClass().addClass("tooltip-content");
      tooltipContent.html(html);
      show(node, x, y);
    }
    function showSkill(node, cls, skill, rune, onlyrune) {
      if(tooltipWrapper == null) {
        initialize();
      }
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "");
      tooltipContent.removeClass().addClass("d3-tooltip-wrapper-inner");

      var info = DiabloCalc.skilltips[cls][skill];
      var html;
      if (info) {
        if (!rune || rune == "x") onlyrune = false;
        var element = (info.elements ? info.elements[rune ? rune : "x"] : "phy");
        html = "<div class=\"d3-tooltip d3-tooltip-" + (onlyrune ? "rune" : "skill") + "\">";
        html += "<div class=\"tooltip-skill-effect effect-" + element + "\"><div class=\"tooltip-head\"><h3>";
        if (onlyrune) {
          html += DiabloCalc.skills[cls][skill].runes[rune] + "</h3></div></div>";
          html += "<div class=\"tooltip-body\"><span class=\"d3-icon d3-icon-rune d3-icon-rune-medium\"><span class=\"rune-" + rune + "\"></span></span>";
          html += "<div class=\"description\">";
          var desc = info[rune];
          var pos = desc.indexOf("<p class=\"subtle\">");
          if (pos >= 0) {
            desc = desc.slice(0, pos) + "<p class=\"special\">" + DiabloCalc.skills[cls][skill].name + "</p>" + desc.slice(pos);
          }
          html += desc;
          html += "</div><span class=\"clear\"><!--   --></span></div>";
        } else {
          html += DiabloCalc.skills[cls][skill].name + "</h3></div></div>";
          html += info.x;
          if (rune && rune != "x") {
            html += "<div class=\"tooltip-extension rune-extension\"><span class=\"d3-icon d3-icon-rune d3-icon-rune-large\"><span class=\"rune-" + rune + "\"></span></span>";
            html += "<h3 class=\"header-3\">" + DiabloCalc.skills[cls][skill].runes[rune] + "</h3>";
            html += info[rune];
            html += "</div>";
          }
        }
        html += "</div>";
      } else if (DiabloCalc.passives[cls][skill]) {
        html = "<div class=\"d3-tooltip d3-tooltip-trait\"><div class=\"tooltip-head\"><h3>" + DiabloCalc.passives[cls][skill].name + "</h3></div>";
        html += DiabloCalc.passivetips[cls][skill];
        html += "</div>";
      } else if (DiabloCalc.extraskills && DiabloCalc.extraskills[cls][skill]) {
        var info = DiabloCalc.extraskills[cls][skill];
        html = "<div class=\"d3-tooltip d3-tooltip-skill\">";
        html += "<div class=\"tooltip-head\"><h3>" + info.name + "</h3></div>" + info.tip + "</div>";
      }

      tooltipContent.html(html);
      show(node);
    }
    function showCustomSkill(node, info) {
      if(tooltipWrapper == null) {
        initialize();
      }
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "");
      tooltipContent.removeClass().addClass("d3-tooltip-wrapper-inner");

      var html = "<div class=\"d3-tooltip d3-tooltip-skill\">";
      html += "<div class=\"tooltip-head\"><h3>" + info.name + "</h3></div>";
      html += "<div class=\"tooltip-body\">";
      html += "<span class=\"d3-icon d3-icon-skill d3-icon-skill-64 miscbuffs-icon\" style=\"background-position: -" +
        (info.icon * 64) + "px 0; width: 64px; height: 64px\"><span class=\"frame\"></span></span>";
      html += "<div class=\"description\">";
      if (info.desc instanceof Array) {
        for (var i = 0; i < info.desc.length; ++i) {
          html += "<p>" + info.desc[i].replace(/\+?[0-9]+(?:\.[0-9]+)?%?/g, "<span class=\"d3-color-green\">$&</span>") + "</p>";
        }
      } else {
        html += "<p>" + info.desc + "</p>";
      }
      if (info.level) {
        html += "<p class=\"subtle\">" + _L("Unlocked at level {0}.").format("<em>" + info.level + "</em>") + "</p>";
      }
      html += "</div></div></div>";
      tooltipContent.html(html);
      show(node);
    }
    function showAttack(node, info) {
      if(tooltipWrapper == null) {
        initialize();
      }
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "");
      tooltipContent.removeClass().addClass("d3-tooltip-wrapper-inner");

      var html = "<div class=\"d3-tooltip d3-tooltip-skill\">";
      html += "<div class=\"tooltip-skill-effect effect-phy\"><div class=\"tooltip-head\"><h3>" + info.name + "</h3></div></div>";
      html += "<div class=\"tooltip-body\"><span class=\"d3-icon d3-icon-skill d3-icon-skill-64 skill-icon-attack " + info.id + "\">";
      html += "<span class=\"frame\"></span></span> <div class=\"description\"><p>" + info.tip + "</p></div></div></div>";
      tooltipContent.html(html);
      show(node);
    }
    var slotSize = {
      head: "default",
      shoulders: "default",
      neck: "square",
      torso: "big",
      waist: "square",
      hands: "default",
      wrists: "default",
      legs: "default",
      feet: "default",
      finger: "square",
      onehand: "default",
      twohand: "default",
      offhand: "default",
      follower: "square",
      custom: "square",
      customwpn: "square",
    };
    function formatBonus(format, values, spans, stat) {
      if (!(values instanceof Array)) {
        tmp = values;
        values = [];
        if (tmp.min && tmp.max) {
          values.push({min: tmp.min, max: tmp.max});
        }
        if (tmp.min2 && tmp.max2) {
          values.push({min: tmp.min2, max: tmp.max2});
        }
      }
      if (values.length <= 1) {
        format = format.replace(/%d-%d/g, "%d");
      }
      var hasSpan = (format.indexOf("%d-%d") >= 0);
      if (spans) {
        format = format.replace(/%d-%d/g, "%d&#x2013;%d");
        format = format.replace(/\+?(?:%(?:\{[0-9]+\})?(?:d|\.[0-9]f))(?:%%)?/g,
          spans > 1 ? "<span class=\"d3-color-blue\"><span class=\"value\">$&</span></span>" : "<span class=\"value\">$&</span>");
        format = format.replace(/[0-9]+(?:\.[0-9]+)?(?:-[0-9]+)?%%/g, "<span class=\"value\">$&</span>");
        format = format.replace(/\n\*|\r\n/g, "<br/><span class=\"tooltip-icon-bullet\"/>");
      }
      var index = 0;
      function fmtValue(val, p) {
        if (typeof val === "number") {
          return DiabloCalc.formatNumber(val, p, 10000);
        } else if (val && val.min && val.max === val.min) {
          return DiabloCalc.formatNumber(val.min, p, 10000);
        } else if (val && val.min && val.max) {
          var res = DiabloCalc.formatNumber(val.min || 0, p, 10000) + (spans ? "&#x2013;" : "-") + DiabloCalc.formatNumber(val.max || 0, p, 10000);
          if (hasSpan) {
            res = "(" + res + ")";
          }
          return res;
        } else {
          return "0";
        }
      }
      format = format.replace(/%(\+?)(?:\{([0-9]+)\})?(d|p|\.[0-9]f|%)/g, function(m, plus, idx, arg) {
        if (arg == "%") {
          return "%";
        } else {
          if (!idx) idx = index++;
          else idx = parseInt(idx);
          var val = (idx >= values.length ? 0 : values[idx]);

          if (arg === "d") {
            return (plus && val >= 0 ? "+" : "") + fmtValue(val, 0);
          } else if (arg === "p") {
            var passive = DiabloCalc.allPassives[val];
            return (passive && passive.name || "unknown");
          } else {
            return (plus && val >= 0 ? "+" : "") + fmtValue(val, arg[1]);
          }
        }
      });
      if (spans) format = format.replace(/([0-9])-([0-9])/g, "$1&#x2013;$2");
      if (spans) {
        var reqClass;
        if (stat && DiabloCalc.stats[stat] && DiabloCalc.stats[stat].class) {
          reqClass = DiabloCalc.stats[stat].class;
        } else if (stat && DiabloCalc.itemPowerClasses[stat]) {
          reqClass = DiabloCalc.itemPowerClasses[stat];
        }
        if (reqClass && DiabloCalc.charClass !== reqClass) {
          format += " <span class=\"d3-color-red\">" + _L("({0} Only)").format(DiabloCalc.classes[reqClass].name) + "</span>";
        } else if (reqClass && DiabloCalc.stats[stat]) {
          format += " " + _L("({0} Only)").format(DiabloCalc.classes[reqClass].name);
        }
        if (stat && DiabloCalc.stats[stat] && DiabloCalc.stats[stat].caldesanns) {
          format += " <span class=\"d3-color-orange\">" + _L("(Caldesann's Despair Rank {0})").format((values[0] / 5).toFixed(0)) + "</span>";
        }
      }
      return format;
    }
    function haveRorg() {
      return !!DiabloCalc.getStats().leg_ringofroyalgrandeur;
      //return DiabloCalc.getSlotId("leftfinger") === "Unique_Ring_107_x1" ||
      //       DiabloCalc.getSlotId("rightfinger") === "Unique_Ring_107_x1";
    }
    function percentSpan(value, cls) {
      var red = Math.round(255 * (value > 0.5 ? 2 - 2 * value : 1));
      var green = Math.round(255 * (value > 0.5 ? 1 : 2 * value));
      red = Math.max(0, Math.min(255, red));
      green = Math.max(0, Math.min(255, green));
      var color = "#" + ("0" + red.toString(16)).slice(-2) + ("0" + green.toString(16)).slice(-2) + "00";
      var result = "<span style=\"color: " + color + "\"";
      if (cls) result += " class=\"" + cls + "\"> (";
      else result += ">";
      return result + parseFloat((value * 100).toFixed(1)) + "%" + (cls ? ")" : "") + "</span>";
    }
    function showExtraItem(node, id) {
      if(tooltipWrapper == null) {
        initialize();
      }
      var item = DiabloCalc.webglItems[id];
      if (!item) item = DiabloCalc.webglDyes[id];
      if (!item) return;
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "");
      tooltipContent.removeClass().addClass("d3-tooltip-wrapper-inner");

      var html = "<div class=\"d3-tooltip d3-tooltip-item\"><div class=\"d3-tooltip-item-wrapper\">";
      html += "<div class=\"tooltip-head tooltip-head-white\"><h3 class=\"d3-color-white\">" + (item.name || "Unknown item") + "</h3></div>";

      var iconType = "square";
      if (item.type && DiabloCalc.itemTypes[item.type]) {
        iconType = (slotSize[DiabloCalc.itemTypes[item.type].slot] || "square");
      }

      html += "<div class=\"tooltip-body\">";
      html +=   "<span class=\"d3-icon d3-icon-item d3-icon-item-large d3-icon-item-white\">";
      html +=     "<span class=\"icon-item-gradient\">";
      html +=       "<span class=\"icon-item-inner icon-item-" + iconType + "\" style=\"background-image: url(" + DiabloCalc.getItemIcon(id) + ");\"></span>";
      html +=     "</span>";
      html +=   "</span>";

      html += "<div class=\"d3-item-properties\">";
      if (DiabloCalc.webglDyes[id]) {
        html += "<ul class=\"item-type\"><li><span class=\"d3-color-default\">" + _L("Dye") + "</span></li></ul>";
        html += "<div class=\"item-description d3-color-white\"><p>" + _L("Changes the color of a single piece of armor. ") + "</p></div>";
        html += "<div class=\"item-before-effects\"></div>";
      } else if (item.type && DiabloCalc.itemTypes[item.type]) {
        var type = DiabloCalc.itemTypes[item.type];
        var slot = (DiabloCalc.itemSlots[type.slot] || DiabloCalc.metaSlots[type.slot]);
        var classSpecific = "";
        if (item.class || type.class) {
          classSpecific = "<li class=\"item-class-specific d3-color-white\">" + DiabloCalc.classes[item.class || type.class].name + "</li>";
        }
        html += "<ul class=\"item-type-right\"><li class=\"item-slot\">" + slot.name + "</li>" + classSpecific + "</ul>";
        html += "<ul class=\"item-type\"><li class=\"d3-color-white\">" + type.name + "</li></ul>";
      }
      html += "<span class=\"clear\"><!-- --></span>";
      html += "</div>";
      html += "</div>";
      if (item.flavor) {
        html += "<div class=\"tooltip-extension\"><div class=\"flavor\">" + item.flavor + "</div></div>";
      }
      html += "</div></div>";

      tooltipContent.html(html);
      show(node);
    }
    function showItem(node, slot, _side) {
      var data;
      var compare = false;
      var perfection;
      if (typeof slot === "string") {
        if (DiabloCalc.itemSlots[slot]) {
          data = DiabloCalc.getSlot(slot);
          var types = (DiabloCalc.getOffhandTypes && slot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[slot].types);
          for (var type in types) {
            if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
            slotSize.custom = slotSize.customwpn = slotSize[DiabloCalc.itemTypes[type].slot];
            break;
          }
          perfection = DiabloCalc.itemPerfection(slot);
        } else if (DiabloCalc.itemById[slot]) {
          data = {id: slot, template: true};
          slot = undefined;
          if (typeof _side === "string") {
            slot = _side;
            var types = (DiabloCalc.getOffhandTypes && slot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[slot].types);
            for (var type in types) {
              if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
              slotSize.custom = slotSize.customwpn = slotSize[DiabloCalc.itemTypes[type].slot];
              break;
            }
          } else {
            data.custom = _side;
            slotSize.custom = slotSize.customwpn = "square";
          }
          _side = undefined;
        }
      } else {
        compare = !_side;
        data = slot;
        slot = undefined;
        slotSize.custom = slotSize.customwpn = "square";
        perfection = DiabloCalc.itemPerfection(data);
      }
      if (!data || !DiabloCalc.itemById[data.id]) {
        return;
      }

      var sideSlot;
      if (compare && DiabloCalc.tipStatList) {
        curCompare = data;
        var slots = [];
        for (var _slot in DiabloCalc.itemSlots) {
          if (DiabloCalc.itemSlots[_slot].item && DiabloCalc.itemSlots[_slot].item.id === data.id) {
            slots = [_slot];
            break;
          }
          if (DiabloCalc.itemSlots[_slot].item && DiabloCalc.isItemAllowed(_slot, data.id)) {
            slots.push(_slot);
          }
        }
        if (slots.length) {
          sideSlot = slots[0];
          if (slots.length > 1 && altKey) {
            sideSlot = slots[1];
          }
        } else {
          compare = undefined;
        }
      } else {
        compare = undefined;
      }

      if (_side && !side_tooltipWrapper) {
        side_initialize();
      }
      if(!_side && !tooltipWrapper) {
        initialize();
      }

      var _content = (_side ? side_tooltipContent : tooltipContent);
      var _wrapper = (_side ? side_tooltipWrapper : tooltipWrapper);

      var item = DiabloCalc.itemById[data.id];
      var color = DiabloCalc.qualities[item.quality].color;
      var affixes = DiabloCalc.getItemAffixesById(data.id, data.ancient, true);

      _content.empty();
      var d2style = (!!DiabloCalc.d2tips);
      var d2text = [];
      _wrapper.toggleClass("d2tip", !!d2style);
      _wrapper.css("max-width", "");
      _content.removeClass().addClass("d3-tooltip-wrapper-inner");

      var charClass = $(".char-class").val();

      if (data.template) {
        data.stats = {};
        data.varies = [];
        var required = DiabloCalc.getItemAffixesById(data.id, data.ancient, "only");
        var remain = DiabloCalc.getStatCount(data.id);
        remain = remain[0] + remain[1];
        for (var stat in required) {
          data.stats[stat] = required[stat];
          if (!DiabloCalc.stats[stat].base) {
            --remain;
          }
        }
        var preset = DiabloCalc.getItemPreset(data.id);
        for (var i = 0; i < preset.length; ++i) {
          var list = DiabloCalc.smartListStats(preset[i], affixes);
          if (list.length === 1) {
            data.stats[list[0]] = affixes[list[0]];
            --remain;
          } else if (list.length > 1) {
            data.varies.push(list);
            --remain;
          }
        }
        if (data.stats.custom && data.custom) {
          data.stats.custom = data.custom;
        }
        if (data.stats.sockets) {
          data.stats.sockets = $.extend({}, data.stats.sockets);
          var sox = 3;
          if (stat === "sockets" && item.type !== "chestarmor" && item.type !== "cloak") {
            sox = 1;
          }
          data.stats.sockets.max = Math.min(data.stats.sockets.max, sox);
        }
        data.random = remain;
      }
      
      var icon = data.id;
      if ((icon == "custom" || icon == "customwpn") && slot) {
        var types = (DiabloCalc.getOffhandTypes && slot === "offhand" ? DiabloCalc.getOffhandTypes() : DiabloCalc.itemSlots[slot].types);
        for (var type in types) {
          if (types[type].classes && types[type].classes.indexOf(DiabloCalc.charClass) < 0) continue;
          if (icon !== "customwpn" && DiabloCalc.itemTypes[type].weapon) continue;
          if (icon === "customwpn" && !DiabloCalc.itemTypes[type].weapon) continue;
          icon = DiabloCalc.itemTypes[type].generic;
          break;
        }
      }
      icon = DiabloCalc.getItemIcon(icon);
      var itemType = DiabloCalc.itemTypes[item.type];
      var bgEffect = null;
      for (var stat in data.stats) {
        if (DiabloCalc.stats[stat].elemental) {
          bgEffect = DiabloCalc.stats[stat].elemental;
          break;
        }
      }
      var effectString = "";
      if (bgEffect && slotSize[itemType.slot] != "square") {
        effectString = " effect-bg effect-bg-" + bgEffect;
      } else if (data.stats.basearmor) {
        effectString = " effect-bg effect-bg-armor";
        if (slotSize[itemType.slot] != "default") {
          effectString += " effect-bg-armor-" + slotSize[itemType.slot];
        }
      }

      var outer;
      if (d2style) {
        var d2c = {"white": 0, "red": 1, "green": 2, "blue": 3, "orange": 4, "gray": 5, "yellow": 9};
        d2text.push("$" + (d2c[color] || 0) + item.name);
        if (data.rwbase) {
          var rwbase = DiabloCalc.itemById[data.rwbase.id];
          if (data.transmog) {
            rwbase = DiabloCalc.itemById[data.transmog] || DiabloCalc.webglItems[data.transmog] || rwbase;
          }
          if (rwbase) d2text.push("$5" + rwbase.name);
        } else if (item.d2base) {
          d2text.push("$5" + item.d2base);
        } else {
          var simpleType = (DiabloCalc.itemTypes[item.type.replace("2h", "")] || itemType);
          var qual = DiabloCalc.qualities[item.quality];
          d2text.push("$5" + DiabloCalc.GenderPair((data.ancient === "primal" && qual.primal || (data.ancient && qual.ancient)) || qual.prefix, simpleType.name));
        }
        var runes = "";
        if (data.gems && DiabloCalc.runes) {
          for (var i = 0; i < data.gems.length; ++i) {
            if (data.gems[i] && DiabloCalc.runes[data.gems[i][0]]) {
              runes += data.gems[i][0];
            }
          }
        }
        if (runes) {
          d2text.push("$4'" + runes + "'");
        }
      } else {
        outer = $("<div class=\"d3-tooltip d3-tooltip-item\"></div>");
        _content.append(outer);
        var ttClass = "d3-tooltip-item-wrapper";
        if (data.ancient === "primal") {
          ttClass += " d3-tooltip-item-wrapper-PrimalAncientLegendary";
        } else if (data.ancient) {
          ttClass += " d3-tooltip-item-wrapper-AncientLegendary";
        }
        var outerWrapper = $("<div class=\"" + ttClass + "\"></div>");
        outer.append(outerWrapper);
        outer = outerWrapper;

        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-left\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-right\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-top\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-bottom\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-top-left\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-top-right\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-bottom-left\"></div>");
        outer.append("<div class=\"d3-tooltip-item-border d3-tooltip-item-border-bottom-right\"></div>");

        outer.append("<div class=\"tooltip-head tooltip-head-" + color + "\"><h3 class=\"d3-color-" + color + "\">" + item.name + "</h3></div>");

        var ttbody = $("<div class=\"tooltip-body" + effectString + "\"></div>");
        outer.append(ttbody);

        ttbody.append("<span class=\"d3-icon d3-icon-item d3-icon-item-large d3-icon-item-" + color + "\">" +
                       "<span class=\"icon-item-gradient\">" +
                        "<span class=\"icon-item-inner icon-item-" + slotSize[itemType.slot] + (data.ancient ? " ancient" : "") + "\" style=\"background-image: url(" + icon + ");\"></span>" +
                       "</span>" +
                      "</span>");

        var props = $("<div class=\"d3-item-properties\"></div>");
        ttbody.append(props);

        var slotInfo = (DiabloCalc.metaSlots[itemType.slot] || DiabloCalc.itemSlots[itemType.slot]);
        var classSpecific = "";
        if (item.class || itemType.class) {
          classSpecific = "<li class=\"item-class-specific d3-color-white\">" + DiabloCalc.classes[item.class || itemType.class].name + "</li>";
        }
        props.append("<ul class=\"item-type-right\"><li class=\"item-slot\">" + slotInfo.name + "</li>" + classSpecific + "</ul>");
        var qual = DiabloCalc.qualities[item.quality];
        props.append("<ul class=\"item-type\"><li class=\"d3-color-" + color + "\">" +
          DiabloCalc.GenderPair((data.ancient === "primal" && qual.primal || (data.ancient && qual.ancient)) || qual.prefix, itemType.name) + "</li></ul>");
      }

      if (data.stats.basearmor) {
        var armor, armor_max;
        if (data.stats.basearmor instanceof Array) {
          armor = data.stats.basearmor[0];
        } else {
          armor = (data.stats.basearmor.min || 0);
          armor_max = (data.stats.basearmor.max || 0);
        }
        if (data.stats.armor) {
          if (data.stats.armor instanceof Array) {
            armor += data.stats.armor[0];
          } else {
            armor_max = (armor_max || armor) + (data.stats.armor.max || 0);
            armor += (data.stats.armor.min || 0);
          }
        }
        if (d2style) {
          var oarmor_min = armor, oarmor_max = (armor_max || armor);
          if (data.stats.d2stat0062) {
            if (data.stats.d2stat0062 instanceof Array) {
              armor += data.stats.d2stat0062[0];
              if (armor_max) armor_max += data.stats.d2stat0062[0];
            } else {
              armor_max = (armor_max || armor) + data.stats.d2stat0062.max;
              armor += data.stats.d2stat0062.min;
            }
          }
          if (data.stats.d2stat0000) {
            if (data.stats.d2stat0000 instanceof Array) {
              armor = Math.floor(armor * (1 + 0.01 * data.stats.d2stat0000[0]));
              if (armor_max) armor_max = Math.floor(armor_max * (1 + 0.01 * data.stats.d2stat0000[0]));
            } else {
              armor_max = Math.floor((armor_max || armor) * (1 + 0.01 * data.stats.d2stat0000.max));
              armor = Math.floor(armor * (1 + 0.01 * data.stats.d2stat0000.min));
            }
          }
          var blue = (armor > oarmor_min || (armor_max && armor_max > oarmor_max));
          if (armor_max) armor += "-" + armor_max;
          if (blue) armor = "$3" + armor + "$0";
          d2text.push("Defense: " + armor);
        } else {
          if (armor_max) {
            armor += "&#x2013;" + armor_max;
          }
          props.append("<ul class=\"item-armor-weapon item-armor-armor\"><li class=\"big\"><p><span class=\"value\">" + armor + "</span></p></li><li>" + _L("Armor") + "</li></ul>");
        }
      }
      if (itemType.weapon) {
        //TODO: fix quality
        var weapon = itemType.weapon;
        if (item.weapon) weapon = $.extend({}, weapon, item.weapon);
        var speed = weapon.speed;
        var dmgmin = weapon.min;
        var dmgmax = weapon.max;
        var dmgmin_max, dmgmax_max, speed_max;
        if (data.gems) {
          for (var i = 0; i < data.gems.length; ++i) {
            if (data.gems[i][1] === "ruby") {
              dmgmin += DiabloCalc.gemColors.ruby.weapon.amount[data.gems[i][0]];
              dmgmax += DiabloCalc.gemColors.ruby.weapon.amount[data.gems[i][0]];
            }
          }
        }
        for (var stat in data.stats) {
          if (DiabloCalc.stats[stat].damage) {
            if (data.stats[stat] instanceof Array) {
              dmgmin += data.stats[stat][0];
              dmgmax += data.stats[stat][1];
            } else {
              dmgmin_max = (dmgmin_max || dmgmin) + (data.stats[stat].max || 0);
              dmgmin += (data.stats[stat].min || 0);
              dmgmax_max = (dmgmax_max || dmgmax) + (data.stats[stat].max2 || 0);
              dmgmax += (data.stats[stat].min2 || 0);
            }
          }
        }
        if (data.stats.damage) {
          if (data.stats.damage instanceof Array) {
            dmgmin *= (1 + 0.01 * data.stats.damage[0]);
            dmgmax *= (1 + 0.01 * data.stats.damage[0]);
          } else {
            dmgmin_max = (dmgmin_max || dmgmin) * (1 + 0.01 * (data.stats.damage.max || 0));
            dmgmin *= (1 + 0.01 * (data.stats.damage.min || 0));
            dmgmax_max = (dmgmax_max || dmgmax) * (1 + 0.01 * (data.stats.damage.max2 || 0));
            dmgmax *= (1 + 0.01 * (data.stats.damage.min2 || 0));
          }
        }
        if (data.stats.weaponias) {
          if (data.stats.weaponias instanceof Array) {
            speed *= (1 + 0.01 * data.stats.weaponias[0]);
          } else {
            speed_max = (speed_max || speed) * (1 + 0.01 * (data.stats.weaponias.max || 0));
            speed *= (1 + 0.01 * (data.stats.weaponias.min || 0));
          }
        }
        var dps = ((dmgmin + dmgmax) * speed / 2).toFixed(1);
        var cls = "big";
        if (dmgmin_max || dmgmax_max || speed_max) {
          dps += "&#x2013;" + (((dmgmin_max || dmgmin) + (dmgmax_max || dmgmax)) * (speed_max || speed) / 2).toFixed(1);
          cls = "med";
        }
        dmgmin = Math.round(dmgmin);
        dmgmax = Math.round(dmgmax);
        speed = speed.toFixed(2);
        if (speed_max) {
          speed += "&#x2013;" + speed_max.toFixed(2);
        }
        if (d2style) {
          var odmgmin = dmgmin, odmgmin_max = (dmgmin_max || dmgmin);
          var odmgmax = dmgmax, odmgmax_max = (dmgmax_max || dmgmax);
          if (data.stats.d2stat0217) {
            if (data.stats.d2stat0217 instanceof Array) {
              dmgmin += data.stats.d2stat0217[0];
              dmgmax += data.stats.d2stat0217[0];
              if (dmgmin_max) dmgmin_max += data.stats.d2stat0217[0];
              if (dmgmax_max) dmgmax_max += data.stats.d2stat0217[0];
            } else {
              dmgmin_max = (dmgmin_max || dmgmin) + data.stats.d2stat0217.max;
              dmgmin += data.stats.d2stat0217.min;
              dmgmax_max = (dmgmax_max || dmgmax) + data.stats.d2stat0217.max;
              dmgmax += data.stats.d2stat0217.min;
            }
          }
          if (data.stats.d2stat0058) {
            if (data.stats.d2stat0058 instanceof Array) {
              dmgmin += data.stats.d2stat0058[0];
              if (dmgmin_max) dmgmin_max += data.stats.d2stat0058[0];
            } else {
              dmgmin_max = (dmgmin_max || dmgmin) + data.stats.d2stat0058.max;
              dmgmin += data.stats.d2stat0058.min;
            }
          }
          if (data.stats.d2stat0023) {
            if (data.stats.d2stat0023 instanceof Array) {
              dmgmax += data.stats.d2stat0023[0];
              if (dmgmax_max) dmgmax_max += data.stats.d2stat0023[0];
            } else {
              dmgmax_max = (dmgmax_max || dmgmax) + data.stats.d2stat0023.max;
              dmgmax += data.stats.d2stat0023.min;
            }
          }
          if (data.stats.d2stat0031) {
            if (data.stats.d2stat0031 instanceof Array) {
              dmgmin += data.stats.d2stat0031[0];
              dmgmax += data.stats.d2stat0031[1];
              if (dmgmin_max) dmgmin_max += data.stats.d2stat0031[0];
              if (dmgmax_max) dmgmax_max += data.stats.d2stat0031[1];
            } else {
              dmgmin_max = (dmgmin_max || dmgmin) + data.stats.d2stat0031.max;
              dmgmin += data.stats.d2stat0031.min;
              dmgmax_max = (dmgmax_max || dmgmax) + data.stats.d2stat0031.max2;
              dmgmax += data.stats.d2stat0031.min2;
            }
          }
          if (data.stats.d2stat0007) {
            if (data.stats.d2stat0007 instanceof Array) {
              dmgmin = Math.floor(dmgmin * (1 + 0.01 * data.stats.d2stat0007[0]));
              dmgmax = Math.floor(dmgmax * (1 + 0.01 * data.stats.d2stat0007[0]));
              if (dmgmin_max) dmgmin_max = Math.floor(dmgmin_max * (1 + 0.01 * data.stats.d2stat0007[0]));
              if (dmgmax_max) dmgmax_max = Math.floor(dmgmax_max * (1 + 0.01 * data.stats.d2stat0007[0]));
            } else {
              dmgmin_max = Math.floor((dmgmin_max || dmgmin) * (1 + 0.01 * data.stats.d2stat0007.max));
              dmgmin = Math.floor(dmgmin * (1 + 0.01 * data.stats.d2stat0007.min));
              dmgmax_max = Math.floor((dmgmax_max || dmgmax) * (1 + 0.01 * data.stats.d2stat0007.max));
              dmgmax = Math.floor(dmgmax * (1 + 0.01 * data.stats.d2stat0007.min));
            }
          }

          var blue1 = (dmgmin > odmgmin || (dmgmin_max && dmgmin_max > odmgmin_max));
          var blue2 = (dmgmax > odmgmax || (dmgmax_max && dmgmax_max > odmgmax_max));
          if (dmgmin_max) {
            dmgmin = "(" + dmgmin + "-" + Math.round(dmgmin_max) + ")";
          }
          if (dmgmax_max) {
            dmgmax = "(" + dmgmax + "-" + Math.round(dmgmax_max) + ")";
          }
          if (blue1) dmgmin = "$3" + dmgmin + "$0";
          if (blue2) dmgmax = "$3" + dmgmax + "$0";
          d2text.push((itemType.slot === "twohand" ? "Two-Hand " : "One-Hand ") + "Damage" + ": " +
            dmgmin + " to " + dmgmax);
          var simpleType = (DiabloCalc.itemTypes[item.type.replace("2h", "")] || itemType);
          d2text.push(simpleType.name + " Class - " + (data.stats.weaponias ? "$3" : "") + speed + " Attack Speed");
        } else {
          if (dmgmin_max) {
            dmgmin = "(" + dmgmin + "&#x2013;" + Math.round(dmgmin_max) + ")";
          }
          if (dmgmax_max) {
            dmgmax = "(" + dmgmax + "&#x2013;" + Math.round(dmgmax_max) + ")";
          }
          props.append("<ul class=\"item-armor-weapon item-weapon-dps\"><li class=\"" + cls + "\"><span class=\"value\">" + dps + "</span></li><li>" + _L("Damage Per Second") + "</li></ul>");
          props.append("<ul class=\"item-armor-weapon item-weapon-damage\">" +
            "<li><p><span class=\"value\">" + dmgmin + "</span>&#x2013;<span class=\"value\">" + dmgmax + "</span> <span class=\"d3-color-FF888888\">" + _L("Damage") + "</span></p></li>" +
            "<li><p><span class=\"value\">" + speed + "</span> <span class=\"d3-color-FF888888\">" + _L("Attacks per Second") + "</span></p></li></ul>");
        }
      }
      if (data.stats.baseblock && data.stats.blockamount) {
        var block, block_max;
        if (data.stats.baseblock instanceof Array) {
          block = data.stats.baseblock[0];
        } else {
          block = (data.stats.baseblock.min || 0);
          block_max = (data.stats.baseblock.max || 0);
        }
        if (data.stats.block) {
          if (data.stats.block instanceof Array) {
            block += data.stats.block[0];
          } else {
            block_max = (block_max || block) + (data.stats.block.max || 0);
            block += (data.stats.block.min || 0);
          }
        }
        if (d2style) {
          var oblock = block, oblock_max = (block_max || block);
          if (data.stats.d2stat0068) {
            if (data.stats.d2stat0068 instanceof Array) {
              block += data.stats.d2stat0068[0];
              if (block_max) block_max += data.stats.d2stat0068[0];
            } else {
              block_max = (block_max || block) + data.stats.d2stat0068.max;
              block += data.stats.d2stat0068.min;
            }
          }
          var blue = (block > oblock || (block_max && block_max > oblock_max));
          block = block.toFixed(1);
          if (block_max) {
            block += "-" + block_max.toFixed(1);
          }
          block += "%";
          if (blue) block = "$3" + block + "$0";
          d2text.push("Chance to Block: " + block);
        } else {
          block = block.toFixed(1);
          if (block_max) {
            block += "&#x2013;" + block_max.toFixed(1);
          }
          var blockamount;
          if (data.stats.blockamount instanceof Array) {
            blockamount = data.stats.blockamount[0].toFixed(0) + "</span>&#x2013;<span class=\"value\">" + data.stats.blockamount[1].toFixed(0);
          } else {
            blockamount = "(" + (data.stats.blockamount.min || 0).toFixed(0) + "&#x2013;" + (data.stats.blockamount.max || 0).toFixed(0) + ")";
            blockamount += "</span>&#x2013;<span class=\"value\">";
            blockamount += "(" + (data.stats.blockamount.min2 || 0).toFixed(0) + "&#x2013;" + (data.stats.blockamount.max2 || 0).toFixed(0) + ")";
          }
          props.append("<ul class=\"item-armor-weapon item-armor-shield\"><li><p><span class=\"value\">+" + block +
            "%</span> <span class=\"d3-color-FF888888\">" + _L("Chance to Block") + "</span></p></li><li><p><span class=\"value\">" + blockamount +
            "</span> <span class=\"d3-color-FF888888\">" + _L("Block Amount") + "</span></p></li></ul>");
        }
      }

      var classSpecific = "";
      if (d2style && (item.class || itemType.class)) {
        var cls = item.class || itemType.class;
        d2text.push((cls == DiabloCalc.charClass ? "" : "$1") +
          ("({0} Only)").format(DiabloCalc.classes[cls].name));
      }
      if (d2style) d2text.push("Required Level: 70");

      if (!d2style) props.append("<div class=\"item-before-effects\"></div>");

      var effects;
      if (d2style) {
        effects = outer;
      } else {
        effects = $("<ul class=\"item-effects\"></ul>");
        props.append(effects);
      }

      for (var catType = 0; catType < 2; ++catType) {
        var category = null;
        var sorted = Object.keys(data.stats).filter(function(stat) {
          if (stat === "sockets" || DiabloCalc.stats[stat].base) return false;
          if (catType == 0 && DiabloCalc.stats[stat].secondary) return false;
          if (catType == 1 && !DiabloCalc.stats[stat].secondary) return false;
          return true;
        });
        sorted.sort(function(a, b) { return DiabloCalc.stats[a].prio - DiabloCalc.stats[b].prio; });
        sorted.forEach(function(stat) {
          if (!category) {
            if (d2style) {
              category = effects;
            } else {
              category = $("<p class=\"item-property-category\">" + (catType == 0 ? _L("Primary") : _L("Secondary")) + "</p>");
              effects.append(category);
            }
          }

          var propType = "default";
          if (DiabloCalc.stats[stat].utility) {
            propType = "utility";
          }
          if (data.enchant === stat) {
            propType = "enchant";
          }
          var propColor = (stat == "custom" ? "orange" : "blue");

          var format = DiabloCalc.stats[stat].format;
          if (stat == "custom" && item.required && item.required.custom) {
            format = item.required.custom.format;
          }
          var range = "";
          if (!data.template && affixes[stat] && affixes[stat].min && affixes[stat].max) {
            var minval = affixes[stat].min, maxval = affixes[stat].max;
            if (affixes[stat].max2 && DiabloCalc.stats[stat].damage) {
              maxval = affixes[stat].max2;
            }
            var mintmp = minval, maxtmp = maxval;
            var decimal = 0;
            while (decimal < 2 && (Math.floor(mintmp - 1e-6) == Math.floor(mintmp + 1e-6) || Math.floor(maxtmp - 1e-6) == Math.floor(maxtmp + 1e-6))) {
              mintmp = mintmp * 10;
              maxtmp = maxtmp * 10;
              decimal += 1;
            }
            range = "<span class=\"d3-color-gray d3-tooltip-range\"> [" + DiabloCalc.formatNumber(minval, decimal, 10000) + " - " +
              DiabloCalc.formatNumber(maxval, decimal, 10000) + "]" + (format.match(/%(d|\.[0-9]f)%%/g) ? "%" : "") + "</span>";
          }
          if (!compare && perfection && perfection.stats[stat] !== undefined) {
            range += percentSpan(perfection.stats[stat], "d3-perfection-value");
          }
          if (d2style) {
            format = formatBonus(format, data.stats[stat], 0,
              stat == "custom" ? (item.required && item.required.custom && item.required.custom.id) : stat);
            d2text.push("$3" + format);
          } else {
            format = formatBonus(format, data.stats[stat], stat == "custom" ? 2 : 1,
              stat == "custom" ? (item.required && item.required.custom && item.required.custom.id) : stat);
            effects.append("<li class=\"d3-color-" + propColor + " d3-item-property-" + propType + "\"><p>" + format + range + "</p></li>");
          }
        });
      }

      if (!d2style && (data.varies || data.random)) {
        effects.append("<br/>");
        if (data.varies) {
          for (var i = 0; i < data.varies.length; ++i) {
            var list = data.varies[i];
            var choice_outer = $("<li class=\"item-effects-choice\"></li>");
            choice_outer.append("<span class=\"d3-color-blue\">" + _L("One of {0} Magic Properties (varies)").format("<span class=\"value\">" + list.length + "</span>") + "</span>");
            var choice = $("<ul></ul>");
            for (var j = 0; j < list.length; ++j) {
              var format = formatBonus(DiabloCalc.stats[list[j]].format, affixes[list[j]], 1, list[j]);
              choice.append("<li><span class=\"d3-color-blue\"><p>" + format + "</p></span></li>");
            }
            choice_outer.append(choice);
            effects.append(choice_outer);
          }
        }
        if (data.random) {
          effects.append("<li class=\"d3-color-blue\"><span class=\"value\">+" + data.random + "</span> " + _L("Random Magic Properties") + "</li>");
        }
      }

      if (!d2style) {
        if (data.transmog && DiabloCalc.itemById[data.transmog] && DiabloCalc.itemById[data.transmog].quality !== "rare") {
          effects.append("<p class=\"item-property-category d3-color-blue\">" + _L("Transmogrification") + ":</p>");
          var tmitem = DiabloCalc.itemById[data.transmog];
          effects.append("<li class=\"value d3-color-" + (tmitem.quality === "set" ? "green" : "orange") + "\">" + tmitem.name + "</li>");
        } else if (data.transmog && DiabloCalc.webglItems[data.transmog]) {
          effects.append("<p class=\"item-property-category d3-color-blue\">" + _L("Transmogrification") + ":</p>");
          var tmitem = DiabloCalc.webglItems[data.transmog];
          effects.append("<li class=\"value d3-color-" + (tmitem.promo ? "orange" : "white") + "\">" + (tmitem.name || data.transmog) + "</li>");
        }
        if (data.dye && DiabloCalc.webglDyes && DiabloCalc.webglDyes[data.dye]) {
          effects.append("<p class=\"item-property-category\">" + DiabloCalc.webglDyes[data.dye].name + "</p>");
        }
      }

      //FTFY
      //if (data.ancient) {
      //  effects.append("<li class=\"d3-color-blue d3-item-property-default\"><p>Ethereal (Cannot be Repaired)</p></li>");
      //}

      if (!d2style && data.stats.sockets) {
        var slotType = slotInfo.socketType;
        if (slotType != "weapon" && slotType != "head") {
          slotType = "other";
        }
        var numSockets = (data.stats.sockets.max || data.stats.sockets[0]);
        for (var gi = 0; gi < numSockets; ++gi) {
          if (data.gems && gi < data.gems.length) {
            var gem = data.gems[gi];
            if (DiabloCalc.legendaryGems[gem[0]] && DiabloCalc.legendaryGems[gem[0]].effects) {
              var info = DiabloCalc.legendaryGems[gem[0]];
              var icon = DiabloCalc.getItemIcon(gem[0], "small");
              var value = info.effects[0].value.slice();
              for (var i = 0; i < value.length; ++i) {
                value[i] += gem[1] * info.effects[0].delta[i];
              }
              var effect1 = formatBonus(info.effects[0].format || DiabloCalc.stats[info.effects[0].stat].format, value, 2, info.effects[0].stat);
              var effect2 = formatBonus(info.effects[1].format || DiabloCalc.stats[info.effects[1].stat].format, info.effects[1].value || [], gem[1] < 25 ? 1 : 2, info.effects[1].stat);
              if (gem[1] < 25) {
                effect2 += " <span class=\"d3-color-red\">" + _L("(Requires Rank {0})").format(25) + "</span>";
              }
              var sock = $("<li class=\"full-socket\"></li>");
              sock.append("<img class=\"gem\" src=\"" + icon + "\" />");
              sock.append("<span class=\"d3-color-orange\">" + info.name + "</span>");
              if (gem[1]) {
                sock.append(" <span class=\"item-jewel-rank\">&#x2013; " + _L("Rank {0}").format(gem[1]) + "</span>");
              }
              var ul = $("<ul></ul>");
              ul.append("<li class=\"jewel-effect d3-color-" + /*(info.effects[0].stat ? "blue" : "orange")*/"orange" + "\"><p>" + effect1 + "</p></li>");
              ul.append("<li class=\"jewel-effect d3-color-" + (gem[1] < 25 ? "gray" : /*(info.effects[1].stat ? "blue" : "orange")*/"orange") + "\"><p>" + effect2 + "</p></li>");
              effects.append(sock.append(ul));
            } else if (DiabloCalc.gemColors[gem[1]]) {
              var info = DiabloCalc.gemColors[gem[1]];
              var icon = DiabloCalc.getItemIcon(gem, "small");
              var effect = formatBonus(DiabloCalc.stats[info[slotType].stat].format, [info[slotType].amount[gem[0]]], info[slotType].stat);
              effects.append("<li class=\"d3-color-white full-socket\"><img class=\"gem\" src=\"" + icon + "\" /><span class=\"socket-effect\">" + effect + "</span></li>");
            }
          } else {
            effects.append("<li class=\"empty-socket d3-color-blue\">" + _L("Empty Socket") + "</li>");
          }
        }
      }
      if (d2style && data.stats.sockets) {
        d2text.push("$3Socketed (" + data.stats.sockets + ")");
      }

      if (item.set) {
        var ul;
        if (d2style) {
          d2text.push("");
          ul = outer;
        } else {
          ul = $("<ul class=\"item-itemset\"></ul>");
          props.append(ul);
        }

        var set = DiabloCalc.itemSets[item.set];
        var indexes = {};
        var colors = [];
        var count = 0;
        for (var i = 0; i < set.items.length; ++i) {
          indexes[set.items[i].id] = i;
          colors.push("gray");
        }
        for (var s in DiabloCalc.itemSlots) {
          var sid = DiabloCalc.getSlotId(s);
          if (sid && indexes[sid] !== undefined) {
            colors[indexes[sid]] = "white";
            count++;
          }
        }
        if (count > 1 && haveRorg()) {
          count++;
        }

        if (d2style) {
          var bonuses = 0;
          for (var amount in set.bonuses) {
            if (parseInt(amount) > count) continue;
            for (var i = 0; i < set.bonuses[amount].length; ++i) {
              var bonus = set.bonuses[amount][i];
              var effect = formatBonus(bonus.stat ? DiabloCalc.stats[bonus.stat].format : bonus.format, bonus.value || [], 0, bonus.stat);
              d2text.push("$4" + effect);
              ++bonuses;
            }
          }
          if (bonuses) d2text.push("");
          d2text.push("$4" + set.name);
          for (var i = 0; i < set.items.length; ++i) {
            var type = DiabloCalc.itemTypes[set.items[i].type];
            var slot = (DiabloCalc.itemSlots[type.slot] || DiabloCalc.metaSlots[type.slot]);
            d2text.push((colors[i] === "white" ? "$2" : "$1") + set.items[i].name);
          }
        } else {
          ul.append("<li class=\"item-itemset-name\"><span class=\"d3-color-green\">" + set.name + "</span></li>");
          for (var i = 0; i < set.items.length; ++i) {
            var type = DiabloCalc.itemTypes[set.items[i].type];
            var slot = (DiabloCalc.itemSlots[type.slot] || DiabloCalc.metaSlots[type.slot]);
            ul.append("<li class=\"item-itemset-piece indent\"><span class=\"d3-color-" + colors[i] + "\">" + set.items[i].name + " (" + slot.name + ")</span></li>");
          }
          for (var amount in set.bonuses) {
            var bonusColor = (parseInt(amount) <= count ? "green" : "gray");
            ul.append("<li class=\"d3-color-" + bonusColor + " item-itemset-bonus-amount\">" + _L("({0}) Set:").format("<span class=\"value\">" + amount + "</span>") + "</li>");
            for (var i = 0; i < set.bonuses[amount].length; ++i) {
              var bonus = set.bonuses[amount][i];
              var effect = formatBonus(bonus.stat ? DiabloCalc.stats[bonus.stat].format : bonus.format, bonus.value || [], 1, bonus.stat);
              ul.append("<li class=\"d3-color-" + bonusColor + " item-itemset-bonus-desc indent\">" + effect + "</li>");
            }
          }
        }
      }

      var perfText = "<span class=\"item-unique-equipped\">" + _L("Unique Equipped") + "</span>";
      if (perfection && perfection.total !== undefined) {
        perfText = "<span class=\"item-unique-equipped\">" + _L("Perfection: ") + percentSpan(perfection.total);
        if (!compare && !_side) {
          if (!shiftKey) perfText += " <span class=\"d3-perfection-tip\">" + _L("(hold shift for details)") + "</span>";
          perfText += "</span><span class=\"d3-perfection-section item-unique-equipped\">";
          perfText += _L(perfection.dpsDelta ? "Damage: {0} (max {1})" : "Damage: {0}").format(percentSpan(perfection.dps),
            "<span class=\"d3-color-white\">+" + DiabloCalc.formatNumber(perfection.dpsDelta, 0, 10000) + "</span>");
          perfText += "</span><span class=\"d3-perfection-section item-unique-equipped\">";
          perfText += _L(perfection.toughnessDelta ? "Toughness: {0} (max {1})" : "Toughness: {0}").format(percentSpan(perfection.toughness),
            "<span class=\"d3-color-white\">+" + DiabloCalc.formatNumber(perfection.toughnessDelta, 0, 10000) + "</span>");
          perfText += "</span>";
        }
      }
      if (!d2style) {
        props.append("<ul class=\"item-extras\"><li class=\"item-reqlevel\"><span class=\"d3-color-gold\">" + _L("Required Level: ") + "</span><span class=\"value\">70</span></li>" +
          "<li>" + _L("Account Bound") + "</li></ul>" + perfText + "<span class=\"clear\"><!--   --></span>");
      }

      if (compare && sideSlot) {
        var stats = DiabloCalc.getStats();
        if (shiftKey && DiabloCalc.itemSlots[sideSlot].item && DiabloCalc.itemSlots[sideSlot].item.gems) {
          stats = DiabloCalc.computeStats(function(id) {
            if (id === sideSlot) {
              var tmp = $.extend({}, DiabloCalc.itemSlots[sideSlot].item);
              tmp.gems = [];
              return tmp;
            } else {
              return DiabloCalc.getSlot(id);
            }
          });
        }
        var altStats = DiabloCalc.computeStats(function(id) {
          if (id === sideSlot) {
            if (shiftKey) {
              var tmp = $.extend({}, data);
              tmp.gems = [];
              return tmp;
            } else {
              return data;
            }
          }
          else return DiabloCalc.getSlot(id);
        });
        var out = [];
        for (var x in DiabloCalc.tipStatList) {
          if (!DiabloCalc.tipStatList[x].stat) continue;
          var value = stats.getValue(DiabloCalc.tipStatList[x].stat);
          var altValue = altStats.getValue(DiabloCalc.tipStatList[x].stat);
          if (1 || value !== altValue) {
            var delta = altValue - value;
            var percent = (value < 0.01 ? 100000 : 100 * delta / value);
            out.push([percent, "<li><span class=\"tooltip-icon-bullet\"></span> <span class=\"d3-color-white\">" + (DiabloCalc.tipStatList[x].shortName || DiabloCalc.tipStatList[x].name) + "</span>: " +
              "<span class=\"d3-color-" + (delta === 0 ? "gray" : (delta > 0 ? "green" : "red")) + "\">" + (value > 0.01 ? DiabloCalc.formatNumber(percent, 2) + "%" : "+&#8734;") +
              "</span></li>"]);
          }
        }
        out.sort(function(a, b) {return b[0] - a[0] + a[1].localeCompare(b[1]) * 0.001;});
        var outStr = "<div class=\"tooltip-extension\"><ul class=\"item-type\"><li><span class=\"d3-color-gold\">" + _L("Stat Changes if Equipped:") + "</span></li>";
        for (var i = 0; i < out.length; ++i) {
          outStr += out[i][1];
        }
        if (!d2style) outer.append(outStr + "</ul></div>");
      }
      if (!d2style && item.flavor && !compare) {
        outer.append("<div class=\"tooltip-extension\"><div class=\"flavor\">" + item.flavor + "</div></div>");
      }
      if (d2style) {
        _content.append(drawD2(d2text));
      }

      if (_side) {
        side_show();
      } else {
        show(node, undefined, undefined, compare);
        if (compare) {
          showItem(node, sideSlot, true);
        }
      }
    }

    function showGem(node, id, level, socketType) {
      var gem = (id instanceof Array ? undefined : DiabloCalc.legendaryGems[id]);
      var reg = (id instanceof Array ? DiabloCalc.gemColors[id[1]] : undefined);
      if (!gem && !reg) {
        return;
      }
      level = (level || 0);
      if(tooltipWrapper == null) {
        initialize();
      }

      tooltipContent.empty();
      tooltipWrapper.removeClass("d2tip");
      tooltipWrapper.css("max-width", "");
      tooltipContent.removeClass().addClass("d3-tooltip-wrapper-inner");

      var charClass = $(".char-class").val();
      var icon = DiabloCalc.getItemIcon(id);

      var outer = $("<div class=\"d3-tooltip d3-tooltip-item\"></div>");
      tooltipContent.append(outer);

      var quality = (gem ? "orange" : "blue");
      outer.append("<div class=\"tooltip-head tooltip-head-" + quality + "\"><h3 class=\"d3-color-" + quality + "\">" +
        (gem ? gem.name : reg.names[id[0]]) + "</h3></div>");

      var ttbody = $("<div class=\"tooltip-body\"></div>");
      outer.append(ttbody);

      ttbody.append("<span class=\"d3-icon d3-icon-item d3-icon-item-large d3-icon-item-" + quality + "\">" +
                     "<span class=\"icon-item-gradient\">" +
                      "<span class=\"icon-item-inner icon-item-square\" style=\"background-image: url(" + icon + ");\"></span>" +
                     "</span>" +
                    "</span>");

      var props = $("<div class=\"d3-item-properties\"></div>");
      ttbody.append(props);

      if (gem) {
        if (level) {
          props.append("<ul class=\"item-type-right\"><li class=\"item-jewel-rank\">" + _L("Rank {0}").format(level) + "</li></ul>");
        }
        props.append("<ul class=\"item-type\"><li><span class=\"d3-color-orange\">" + DiabloCalc.GenderPair(DiabloCalc.qualities.legendary.prefix, _L("Gem")) + "</span></li></ul>");
        props.append("<div class=\"item-description d3-color-white\"><p></p></div>");
      } else {
        props.append("<ul class=\"item-type\"><li><span class=\"d3-color-default\">" + DiabloCalc.GenderString(_L("Gem")) + "</span></li></ul>");
      }

      props.append("<div class=\"item-before-effects\"></div>");
      var effects = $("<ul class=\"item-effects\"></ul>");
      props.append(effects);

      if (gem) {
        var value = gem.effects[0].value.slice();
        for (var i = 0; i < value.length; ++i) {
          value[i] += level * gem.effects[0].delta[i];
        }
        var effect1 = formatBonus(gem.effects[0].format || DiabloCalc.stats[gem.effects[0].stat].format, value, 2, gem.effects[0].stat);
        var effect2 = formatBonus(gem.effects[1].format || DiabloCalc.stats[gem.effects[1].stat].format, gem.effects[1].value || [], level < 25 ? 1 : 2, gem.effects[1].stat);
        if (level < 25) {
          effect2 += " <span class=\"d3-color-red\">" + _L("(Requires Rank {0})").format(25) + "</span>";
        }

        effects.append("<li class=\"d3-color-orange d3-item-property-default\"><p>" + effect1 + "</p></li>");
        effects.append("<li class=\"d3-color-" + (level < 25 ? "gray" : "orange") + " d3-item-property-default\"><p>" + effect2 + "</p></li>");

        props.append("<ul class=\"item-extras\"><li>" + _L("Account Bound") + "</li></ul><span class=\"item-unique-equipped\">" +
                     _L("Unique Equipped") + "</span><span class=\"clear\"><!--   --></span>");
      } else {
        effects.append("<li class=\"d3-color-white\">" + _L("Can be inserted into equipment with sockets.") + "</li>");
        function fmtSlot(data, flag) {
          var fmt = formatBonus(DiabloCalc.stats[data.stat].format, [data.amount[id[0]]]);
          if (!flag) fmt = "<span class=\"d3-color-gray\">" + fmt + "</span>";
          return fmt;
        }
        effects.append("<li class=\"gem-effect\"><span class=\"d3-color-gray\">" + _L("Helm:") + "</span> " +
          fmtSlot(reg.head, !socketType || socketType === "head") + "</li>");
        effects.append("<li class=\"gem-effect\"><span class=\"d3-color-gray\">" + _L("Weapon:") + "</span> " +
          fmtSlot(reg.weapon, !socketType || socketType === "weapon") + "</li>");
        effects.append("<li class=\"gem-effect\"><span class=\"d3-color-gray\">" + _L("Other:") + "</span> " +
          fmtSlot(reg.other, socketType !== "head" && socketType !== "weapon") + "</li>");
        props.append("<ul class=\"item-extras\"><li>" + _L("Account Bound") + "</li></ul><span class=\"clear\"><!--   --></span>");
      }

      if (gem && gem.flavor) {
        outer.append("<div class=\"tooltip-extension\"><div class=\"flavor\">" + gem.flavor + "</div></div>");
      }

      show(node);
    }

    $(document).keydown(function(e) {
      if (e.which == 17 && tooltipWrapper) {
        tooltipWrapper.addClass("d3-tooltip-showrange");
      }
      if (e.which == 16 && tooltipWrapper) {
        tooltipWrapper.addClass("d3-tooltip-perfection");
      }
      if (e.which === 16 || e.which === 18) {
        if (e.which === 16) shiftKey = true;
        if (e.which === 18) altKey = true;
        if (curNode && curCompare) {
          showItem(curNode, curCompare);
          return false;
        }
      }
    }).keyup(function(e) {
      if (e.which == 17 && tooltipWrapper) {
        tooltipWrapper.removeClass("d3-tooltip-showrange");
      }
      if (e.which == 16 && tooltipWrapper) {
        tooltipWrapper.removeClass("d3-tooltip-perfection");
      }
      if (e.which === 16 || e.which === 18) {
        if (e.which === 16) shiftKey = false;
        if (e.which === 18) altKey = false;
        if (curNode && curCompare) {
          showItem(curNode, curCompare);
          return false;
        }
      }
    });

    this.show = show;
    this.hide = hide;
    this.showItem = showItem;
    this.showHtml = showHtml;
    this.showSkill = showSkill;
    this.showCustomSkill = showCustomSkill;
    this.showGem = showGem;
    this.showAttack = showAttack;
    this.showExtraItem = showExtraItem;
    this.getNode = function() {
      return curNode;
    };
    this.enable = function() {
      enabled = true;
    };
    this.disable = function() {
      enabled = false;
      hide();
    };
  };
})();
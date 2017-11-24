(function() {
  var DC = DiabloCalc;
  var _L = DC.locale("ui-skills.js", "skilldata");

  DC.getSkillBonus = function(skill, stats, type) {
    if (!skill) return;
    type = (type || "buffs");
    var info = DC.skills[DC.charClass][skill[0]];
    var cur = null;
    if (info && info[type]) {
      if (typeof info[type] == "function") {
        cur = info[type](skill[1], stats);
      } else {
        cur = info[type][skill[1]];
      }
    }
    return cur;
  };

  DC.getPassiveBonus = function(passive, stats) {
    var info = DC.passives[DC.charClass][passive];
    var cur = null;
    if (info && info.buffs) {
      if (typeof info.buffs == "function") {
        cur = info.buffs(stats);
      } else {
        cur = info.buffs;
      }
    }
    return cur;
  };

  function execString(expr, stats, affix, params) {
    if (!expr) return 0;
    if (typeof expr != "string") return expr;
    if (affix) {
      expr = expr.replace(/\$([1-9])/g, function(m, index) {
        if (stats.affixes[affix]) {
          return stats.affixes[affix].value[parseInt(index) - 1];
        } else if (parseInt(index) === 1) {
          return stats[affix];
        }
      });
    } else if (params) {
      expr = expr.replace(/\$([1-9])/g, function(m, index) {
        return params[parseInt(index) - 1].val;
      });
    }
    return stats.execString(expr);
  }
  DC.execString = execString;
  var glob_execString = execString;

  function formatObject(fmt, options) {
    options = options || {};
    var stats = (options.stats || DC.getStats());
    function execString(expr) {
      return glob_execString(expr, stats, options.affix, options.params);
    }

    var base, avg;
    if (fmt.thorns) {
      avg = (stats.thorns || 0);
      base = {min: avg, max: avg};
    } else if (fmt.weapon) {
      if (!stats.info[fmt.weapon]) return;
      base = $.extend({}, stats.info[fmt.weapon].wpnbase);
      avg = (base.min + base.max) * 0.5;
    } else {
      base = $.extend({}, stats.info.mainhand.wpnbase);
      avg = (base.min + base.max) * 0.5;
      if (stats.info.offhand) {
        base.min = Math.min(base.min, stats.info.offhand.wpnbase.min);
        base.max = Math.max(base.max, stats.info.offhand.wpnbase.max);
        avg = avg * 0.5 + (stats.info.offhand.wpnbase.min + stats.info.offhand.wpnbase.max) * 0.25;
      }
    }

    var total_coeff = 1;
    var extra_coeff = 0;

    var factors = [];
    // primary attribute
    factors.push({
      name: DC.stats[DC.classes[DC.charClass].primary].name,
      percent: (fmt.thorns === "bad" ? 0.25 : 1) * stats.info.primary,
    });
    // attack speed scaling
    if (fmt.aps) {
      factors.push({
        name: "Attack speed",
        factor: (fmt.weapon ? stats.info[fmt.weapon].speed : stats.info.aps) * (fmt.aps === true ? 1 : execString(fmt.aps)),
      });
    }
    // skill multiplier
    if (fmt.coeff || fmt.addcoeff) {
      var coeff = (fmt.coeff ? execString(fmt.coeff) : 0);
      var basec = coeff;
      var addcoeff = undefined;
      total_coeff = coeff;
      if (fmt.addcoeff) {
        addcoeff = [];
        for (var i = 0; i < fmt.addcoeff.length; ++i) {
          var cur = fmt.addcoeff[i];
          var curval;
          if (typeof cur === "object") {
            cur = [execString(cur[0]), execString(cur[1])];
            if (cur[0] && cur[1]) addcoeff.push([100 * cur[0], cur[1]]);
            curval = cur[0] * cur[1];
          } else {
            cur = execString(cur);
            if (cur) addcoeff.push(100 * cur);
            curval = cur;
          }
          if (typeof fmt.total !== "number" || i < fmt.total) {
            total_coeff += curval;
          } else {
            extra_coeff += curval;
          }
          coeff += curval;
        }
      }
      factors.push({
        name: "Skill multiplier",
        factor: coeff,
        percent: 100 * basec,
        extra: addcoeff,
        coeff: true,
      });
    }
    // multiplicative factors = x<Value>
    if (fmt.factors) {
      for (var f in fmt.factors) {
        var value = execString(fmt.factors[f]);
        if (value != 1) {
          factors.push({
            name: f,
            factor: value,
          });
        }
      }
    }
    // multiplicative factor = /<Value>
    if (fmt.divide) {
      for (var f in fmt.divide) {
        var value = execString(fmt.divide[f]);
        if (value != 1) {
          factors.push({
            name: f,
            factor: 1 / value,
            divide: value,
          });
        }
      }
    }
    // multiplicative factor = +<Value>%
    if (fmt.percent) {
      for (var f in fmt.percent) {
        var value = execString(fmt.percent[f]);
        if (value) {
          factors.push({
            name: f,
            percent: value,
          });
        }
      }
    }
    // multiplicative passive = +<Value>%
    if (fmt.passives) {
      for (var p in fmt.passives) {
        if (stats.passives[p]) {
          var value = execString(fmt.passives[p]);
          if (value) {
            factors.push({
              name: DC.passives[DC.charClass][p].name,
              percent: value,
            });
          }
        }
      }
    }

    // additive bonuses
    var bonuses = {};
    // skill damage
    var skillid = (fmt.skill || (options.skill && options.skill[0]));
    if (skillid && fmt.thorns !== "special" && !fmt.manald) {
      var bonus = stats["skill_" + DC.charClass + "_" + skillid];
      if (bonus) {
        bonuses["Skill %"] = bonus;
      }
    }
    // additive bonuses
    if (fmt.bonuses) {
      for (var b in fmt.bonuses) {
        var value = execString(fmt.bonuses[b]);
        if (value) {
          bonuses[b] = value;
        }
      }
    }
    // additive passives - those should apply directly to skill damage
    if (fmt.addpassives) {
      for (var p in fmt.addpassives) {
        if (stats.passives[p]) {
          var value = execString(fmt.addpassives[p]);
          if (value) {
            bonuses[DC.passives[DC.charClass][p].name] = value;
          }
        }
      }
    }
    // for pets, these bonuses apply as a separate factor from DIBS
    if (fmt.pet && !$.isEmptyObject(bonuses)) {
      factors.push({
        name: "Skill damage",
        percent: bonuses,
      });
      bonuses = {};
    }

    var elem = (fmt.elem == "max" ? stats.info.maxelem : fmt.elem);
    var srcelem = ((fmt.srcelem == "max" ? stats.info.maxelem : fmt.srcelem) || elem);
    //if (fmt.thorns === "normal") elem = "phy";
    // DIBS
    var tmp = stats.getTotalSpecial("damage", elem, fmt.pet, skillid, fmt.exclude);
    if (tmp) bonuses["Buffs"] = tmp;
    // debuffs
    var tmp = stats.getTotalSpecial("dmgtaken", elem, fmt.pet, skillid, fmt.exclude);
    if (tmp && (fmt.thorns !== "normal" && fmt.thorns !== "bad" && fmt.thorns !== "special")) {
      bonuses["Debuffs"] = tmp;
    }
    if (!$.isEmptyObject(bonuses)) {
      factors.push({
        name: (fmt.pet ? "Buffs/debuffs" : "Damage increased by skills"),
        percent: bonuses,
      });
    }

    if (tmp && (fmt.thorns === "normal" || fmt.thorns === "bad" || fmt.thorns === "special")) {
      factors.push({
        name: DC.stats.dmgtaken.name,
        percent: tmp,
      });
    }

    if ((fmt.thorns === "normal" || fmt.thorns === "bad"/*|| fmt.thorns === "special"*/) && stats.thorns_taken) {
      factors.push({
        name: DC.itemById.Unique_Shield_104_x1.name,
        percent: stats.thorns_taken,
      });
    }

    // elemental/pet damage
    if (((srcelem && stats["dmg" + srcelem]) || (fmt.pet && stats.petdamage)) && !fmt.manald/*&& fmt.thorns !== "special"*/) {
      var bonuses = {};
      if (srcelem && stats["dmg" + srcelem]) {
        bonuses[DC.elements[srcelem]] = stats["dmg" + srcelem];
      }
      if (fmt.pet && stats.petdamage) {
        bonuses["Pets"] = stats.petdamage;
      }
      factors.push({
        name: "Elemental damage",
        percent: bonuses,
      });
    }

    // elite damage
    if (DC.options.showElites && stats.edmg) {
      var edmg = stats.edmg;
      if (fmt.manald) {
        edmg -= (stats.leg_thefurnace || 0);
        if (stats.gem_powerful_25) edmg -= 15;
      }
      if (edmg) factors.push({
        name: DC.stats.edmg.name,
        percent: edmg,
      });
    }

    // boss damage
    if (DC.options.targetBoss && DC.options.showElites && stats.bossdmg) {
      factors.push({
        name: DC.stats.bossdmg.name,
        percent: stats.bossdmg,
      });
    }

    // special damage
    var targetType = DC.options.targetType;
    if (targetType && stats["damage_" + targetType]) {
      factors.push({
        name: DC.stats["damage_" + targetType].name,
        percent: stats["damage_" + targetType],
      });
    }

    // global multipliers
    $.each(stats.getSpecial("dmgmul", elem, fmt.pet, skillid, fmt.exclude), function(i, val) {
      factors.push({
        name: val[0],
        percent: val[1],
      });
    });

    var total_factor = 1;
    for (var i = 0; i < factors.length; ++i) {
      if (!factors[i].factor) {
        var percent = 0;
        if (typeof factors[i].percent === "number") {
          percent = factors[i].percent;
        } else {
          for (var k in factors[i].percent) {
            percent += factors[i].percent[k];
          }
        }
        factors[i].factor = 1 + 0.01 * percent;
      }
      total_factor *= factors[i].factor;
    }

    var bonus_chc = execString(fmt.chc);
    var bonus_chd = execString(fmt.chd);
    var chc = Math.min(1, 0.01 * (stats.final.chc + bonus_chc * (1 + 0.01 * (stats.chctaken_percent || 0))));
    var chd = 0.01 * (stats.chd + bonus_chd);
    if (fmt.thorns/* === "normal"*/) {
      chc = chd = bonus_chc = 0;
    }

    var value = avg * total_factor * (1 + chc * chd);

    return {
      factors: factors,
      total_factor: total_factor * total_coeff / (total_coeff + extra_coeff),
      extra_factor: total_factor * extra_coeff / (total_coeff + extra_coeff),
      value: value,
      base: base,
      chc: chc,
      chd: chd,
      bonus_chc: bonus_chc,
    };
  }

  DC.calcFramesFull = function(fpa, weapon, slowest, dspeed, method, stats) {
    if (slowest !== true) {
      method = dspeed;
      dspeed = slowest;
      slowest = undefined;
    }
    var delta = (method === "up" ? 1 : 0);
    var stats = (stats || DC.getStats());
    var options = {fpa: fpa, dspeed: (dspeed || 1), fpadelta: delta};
    if (!weapon && stats.info.offhand) {
      if (slowest) {
        options.basespeed = Math.min(stats.info.mainhand.speed, stats.info.offhand.speed);
        options.frames = Math.floor(fpa / (options.dspeed * options.basespeed)) + delta;
      } else {
        options.framesmh = Math.floor(fpa / (options.dspeed * stats.info.mainhand.speed));
        options.framesoh = Math.floor(fpa / (options.dspeed * stats.info.offhand.speed));
        options.frames = 0.5 * (options.framesmh + options.framesoh) + delta;
      }
    } else {
      options.basespeed = stats.info[weapon || "mainhand"].speed;
      options.frames = Math.floor(fpa / (options.dspeed * options.basespeed)) + delta;
    }
    return options;
  };
  DC.calcFrames = function(fpa, weapon, slowest, dspeed, method, stats) {
    return DC.calcFramesFull.apply(DC, arguments).frames;
  };

  function Tooltip(name, value) {
    this.header_ = "";
    this.body_ = "";
    if (name) this.header(name, value);
  }
  Tooltip.prototype.html = function() {
    return "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p>" + this.header_ + this.body_ + "</p></div>";
  };
  Tooltip.prototype.empty = function() {
    return this.body_.length == 0;
  };
  Tooltip.prototype.header = function(name, value) {
    name = _L(name);
    if (value !== undefined) name += ": <span class=\"d3-color-green\">" + value + "</span>";
    this.header_ = "<span class=\"d3-color-gold\">" + name + "</span>";
    return this;
  };
  Tooltip.prototype.line = function(bullet, text) {
    var args = 2, ctext = text;
    if (bullet !== true && bullet !== false) {
      ctext = bullet;
      bullet = true;
      args = 1;
    }
    this.body_ += "<br/><span class=\"tooltip-icon-" + (bullet === false ? "nobullet" : "bullet") + "\"></span>" +
      String.prototype.format.apply(_L(ctext), Array.prototype.slice.call(arguments, args));
    return this;
  };
  Tooltip.prototype.add = function(lines) {
    if (!lines) return this;
    if (typeof lines === "string") {
      var bullet = true;
      if (lines[0] === "@") {
        lines = lines.substring(1);
        bullet = false;
      }
      this.line(bullet, lines);
    } else if (lines instanceof Array) {
      for (var i = 0; i < lines.length; ++i) {
        this.add(lines[i]);
      }
    } else if (lines instanceof Tooltip) {
      this.body_ += lines.body_;
    }
    return this;
  };
  Tooltip.prototype.breakpoints = function(stats, options) {
    if (options.pet) {
      if (options.frames > 6) {
        var basemh = stats.info.mainhand.speed / (1 + 0.01 * (stats.ias || 0));
        var apsneed = options.fpa / (options.frames - 5) / options.speed;
        var iasneed = Math.ceil((100 * apsneed / basemh - 100 - (stats.ias || 0)) * 10) / 10;
        this.line(false, "IAS to next breakpoint: {0}", "<span class=\"d3-color-white\">" + iasneed + "%</span>");
      }
      this.body_ += "</p><table><tr><th>" + ["FPA", "APS", "Pet APS", "Delta"].map(_L).join("</th><th>") + "</th></tr>";
      for (var curfpa = Math.ceil(Math.floor(options.fpa) / 6) * 6; curfpa >= 6; curfpa -= 6) {
        var curaps = Math.max(1, options.fpa / (curfpa + 1) / options.speed + 0.000051);
        if (options.speed / (curfpa + 1) > 5) break;
        this.body_ += "<tr" + (curfpa === options.frames ? " class=\"current\"" : "") + "><td>" + curfpa + "</td>";
        this.body_ += "<td>" + curaps.toFixed(4) + "</td><td>" + Math.max(1, options.fpa / (curfpa + 1) + 0.000051).toFixed(4) + "</td>";
        var delta = 100 * (options.frames / curfpa - 1);
        this.body_ += "<td class=\"" + (delta < 0 ? "d3-color-red" : (delta > 0 ? "d3-color-green" : "d3-color-gray")) + "\">";
        this.body_ += (delta < 0 ? delta.toFixed(1) : "+" + delta.toFixed(1)) + "%</td></tr>";
      }
      this.body_ += "</table><p>";
    } else {
      function fpaDelta(nextmh, nextoh) {
        var fpa;
        if (options.framesmh && options.framesoh) {
          fpa = 0.5 * (Math.floor(options.fpa / (options.dspeed * nextmh)) + Math.floor(options.fpa / (options.dspeed * nextoh))) + options.fpadelta;
        } else {
          fpa = Math.floor(options.fpa / (options.dspeed * nextmh)) + options.fpadelta;
        }
        if (fpa < options.frames) {
          return "<span class=\"d3-color-green\">+" + DC.formatNumber(100 * (options.frames / fpa - 1), 1) + "%</span>";
        } else if (fpa > options.frames) {
          return "<span class=\"d3-color-red\">-" + DC.formatNumber(100 * (1 - options.frames / fpa), 1) + "%</span>";
        } else {
          return "<span class=\"d3-color-gray\">+0%</span>";
        }
      }

      if (options.framesmh && options.framesoh) {
        if (options.framesmh > 1 && options.framesoh > 1) {
          var nextmh = options.fpa / (options.framesmh - options.fpadelta) / options.dspeed + 0.000051;
          var nextoh = options.fpa / (options.framesoh - options.fpadelta) / options.dspeed + 0.000051;
          var next = Math.min(nextmh / stats.info.mainhand.speed, nextoh / stats.info.offhand.speed);
          nextmh = next * stats.info.mainhand.speed;
          nextoh = next * stats.info.offhand.speed;
          var iasneed = Math.ceil(10 * (next * (100 + (stats.ias || 0)) - 100 - (stats.ias || 0))) / 10;
          this.line(false, "Next breakpoint: {0} APS ({1} IAS)" + (options.dps !== false ? ", {2} DPS" : ""),
            "<span class=\"d3-color-white\">" + DC.formatNumber(nextmh, 4, 10000) + "</span>/" +
            "<span class=\"d3-color-white\">" + DC.formatNumber(nextoh, 4, 10000) + "</span>",
            "<span class=\"d3-color-white\">+" + iasneed + "%</span>",
            fpaDelta(nextmh, nextoh));
        }

        var prevmh = options.fpa / (options.framesmh + 1 - options.fpadelta) / options.dspeed - 0.000051;
        var prevoh = options.fpa / (options.framesoh + 1 - options.fpadelta) / options.dspeed - 0.000051;
        var prev = Math.max(prevmh / stats.info.mainhand.speed, prevoh / stats.info.offhand.speed);
        prevmh = prev * stats.info.mainhand.speed;
        prevoh = prev * stats.info.offhand.speed;
        var iasneed = Math.ceil(10 * (prev * (100 + (stats.ias || 0)) - 100 - (stats.ias || 0))) / 10;
        this.line(false, "Previous breakpoint: {0} APS ({1} IAS)" + (options.dps !== false ? ", {2} DPS" : ""),
          "<span class=\"d3-color-white\">" + DC.formatNumber(prevmh, 4, 10000) + "</span>/" +
          "<span class=\"d3-color-white\">" + DC.formatNumber(prevoh, 4, 10000) + "</span>",
          "<span class=\"d3-color-white\">" + iasneed + "%</span>",
          fpaDelta(prevmh, prevoh));
      } else {
        if (options.frames > 1) {
          var next = options.fpa / (options.frames - options.fpadelta) / options.dspeed + 0.000051;
          var basemh = options.basespeed / (1 + 0.01 * (stats.ias || 0));
          var iasneed = Math.ceil(10 * (100 * next / basemh - 100 - (stats.ias || 0))) / 10;
          this.line(false, "Next breakpoint: {0} APS ({1} IAS)" + (options.dps !== false ? ", {2} DPS" : ""),
            "<span class=\"d3-color-white\">" + DC.formatNumber(next, 4, 10000) + "</span>",
            "<span class=\"d3-color-white\">+" + iasneed + "%</span>",
            fpaDelta(next));
        }
        var prev = options.fpa / (options.frames + 1 - options.fpadelta) / options.dspeed - 0.000051;
        var basemh = options.basespeed / (1 + 0.01 * (stats.ias || 0));
        var iasneed = Math.ceil(10 * (100 * prev / basemh - 100 - (stats.ias || 0))) / 10;
        this.line(false, "Previous breakpoint: {0} APS ({1} IAS)" + (options.dps !== false ? ", {2} DPS" : ""),
          "<span class=\"d3-color-white\">" + DC.formatNumber(prev, 4, 10000) + "</span>",
          "<span class=\"d3-color-white\">" + iasneed + "%</span>",
          fpaDelta(prev));
      }
      if (!options.sequence) {
        var hdr = "<th>" + _L("FPA") + "</th><th>" + _L("APS") + "</th>";
        this.body_ += "</p><table class=\"col2\"><tr>" + hdr + "<th></th>" + hdr + "<th></th>" + hdr + "</tr>";
        var fpa0 = options.frames, fpa1 = options.frames;
        if (options.framesmh && options.framesoh) {
          fpa0 = options.framesmh;
          fpa1 = options.framesoh;
        }
        var list = [];
        var maxaps = Math.max(3, stats.info.mainhand.speed);
        if (options.framesoh) {
          maxaps = Math.max(maxaps, stats.info.offhand.speed);
        }
        maxaps = Math.max(maxaps * 1.2, maxaps + 0.5);
        for (var curfpa = Math.floor(options.fpa) + options.fpadelta; curfpa >= 1; curfpa -= 1) {
          var curaps = Math.max(1, options.fpa / (curfpa + 1 - options.fpadelta) / options.dspeed + 0.000051);
          if (curaps > maxaps && list.length % 3 == 0) break;
          /*if (fpa != Math.floor(data.fpa) + fpadelta && fpa != 1 && fpa != fpa0 && fpa != fpa1 &&
              fpa % 5 != 0 && Math.abs(fpa - fpa0) > 2 && Math.abs(fpa - fpa1) > 2) {
            continue;
          }*/
          list.push([curfpa, curaps.toFixed(4)]);
        }
        var fcol = Math.ceil(list.length / 3);
        for (var row = 0; row < fcol; ++row) {
          function cell_(data) {
            var cf = (data[0] === fpa0 || data[0] === fpa1 ? " class=\"current\"" : "");
            return "<td" + cf + ">" + data[0] + "</td><td" + cf + ">" + data[1] + "</td>";
          }
          this.body_ += "<tr>" + cell_(list[row]);
          if (row + fcol < list.length) {
            this.body_ += "<td></td>" + cell_(list[row + fcol]);
          }
          if (row + fcol + fcol < list.length) {
            this.body_ += "<td></td>" + cell_(list[row + fcol + fcol]);
          }
          this.body_ += "</tr>";
        }
        this.body_ += "</table><p>";
      }
    }
  };
  function _V(val, decimal, clr, per) {
    var parts = ("" + parseFloat(val.toFixed(decimal || 0))).split(".");
    if (parseFloat(val) >= 10000) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    val = parts.join(".");
    return "<span class=\"d3-color-" + (clr || "green") + "\">" + val + (per || "") + "</span>";
  }
  function _R(a, b, clr) {
    a = Math.floor(a);
    b = Math.floor(b);
    return _V(a, 0, clr) + (a == b ? "" : "-" + _V(b, 0, clr));
  }

  function processInfo(lines, options) {
    var result = {};
    var sumlines = [];
    options = options || {};
    var notip = options.notip;
    var stats = (options.stats || DC.getStats());

    function execString(expr) {
      return glob_execString(expr, stats, options.affix, options.params);
    }

    var breakpointTip = new Tooltip();
    var breakpointValues = [];

    $.each(lines, function(stat, fmt) {
      if (!fmt) return;
      result[stat] = {};
      if (typeof fmt !== "object") {
        // OPTION 1
        // plain text string
        if (typeof fmt === "number") {
          results[stat].value = fmt;
        } else {
          if (!notip) result[stat].text = fmt;
        }
      } else if (fmt.sum) {
        // OPTION 2
        // sum = true, queue for processing later
        sumlines.push(stat);
      } else if (fmt.cooldown !== undefined && fmt.duration !== undefined) {
        // OPTION 3
        // cooldown AND duration, skill, cdr, after, tip 
        var duration = execString(fmt.duration);
        var cooldown = execString(fmt.cooldown);
        var skill = fmt.skill || (options.skill && options.skill[0]);
        if (skill) {
          cooldown -= (stats["skill_" + DC.charClass + "_" + skill + "_cooldown"] || 0);
        }
        cooldown -= (stats.cdrint || 0);
        if (fmt.cdr) {
          cooldown *= 1 - 0.01 * execString(fmt.cdr);
        }
        cooldown = Math.max(0.5, cooldown * (1 - 0.01 * (stats.cdr || 0)));

        var value;
        if (cooldown <= 0.01) {
          value = 100;
        } else {
          value = Math.min(100, 100 * duration / (cooldown + (fmt.after ? duration : 0)));
        }
        result[stat].value = value;

        if (!notip) {
          result[stat].text = DC.formatNumber(value, 0, 10000) + "%";

          var tip = new Tooltip(stat, result[stat].text);
          tip.add(fmt.tip);
          tip.line("Duration: {0} seconds", _V(duration, 0, "white"));
          tip.line("Cooldown: {0} seconds", _V(cooldown, 2, "white"));
          if (fmt.after) {
            tip.line("Downtime: {0}", _V(100 - value, 2, "white", "%"));
            tip.line("Cooldown does not start until the effect expires.");
          } else {
            tip.line("Downtime: {0} ({1} seconds)", _V(100 - value, 2, "white", "%"), _V(Math.max(0, cooldown - duration), 2, "white"));
          }
          result[stat].tip = tip.html();
        }
      } else if (fmt.cooldown !== undefined) {
        // OPTION 4
        // cooldown, skill, cdr (no tip)
        var cooldown = execString(fmt.cooldown);
        if (!cooldown) {
          delete result[stat];
          return;
        }
        var skill = fmt.skill || (options.skill && options.skill[0]);
        if (skill) {
          cooldown -= (stats["skill_" + DC.charClass + "_" + skill + "_cooldown"] || 0);
        }
        cooldown -= (stats.cdrint || 0);
        if (fmt.cdr) {
          cooldown *= 1 - 0.01 * execString(fmt.cdr);
        }
        cooldown = Math.max(0.5, cooldown * (1 - 0.01 * (stats.cdr || 0)));
        result[stat].value = cooldown;
        if (!notip) result[stat].text = _L("{0} seconds").format(parseFloat(cooldown.toFixed(2)));
      } else if (fmt.cost !== undefined) {
        // OPTION 5
        // cost, rcr, skill, speed/fpa, weapon, round
        var resource = (fmt.resource || DC.classes[DC.charClass].resources[0]);
        var cost = execString(fmt.cost) * (1 - 0.01 * (stats["rcr_" + resource] || 0));
        if (fmt.rcr) {
          cost *= 1 - 0.01 * execString(fmt.rcr);
        }
        if (options.skill && options.skill[0]) {
          var skill = DC.skilltips[DC.charClass][options.skill[0]];
          if (skill && skill.elements[options.skill[1]] === "fir") {
            cost *= 1 - 0.01 * (stats.leg_cindercoat || 0);
          }
        }
        var skillid = fmt.skill || (options.skill && options.skill[0]);
        if (skillid) {
          cost = Math.max(0, cost - (stats["skill_" + DC.charClass + "_" + skillid + "_cost"] || 0));
        }
        cost = Math.max(0, cost - (stats.rcrint || 0));
        if (cost === 0) {
          delete result[stat];
          return;
        }

        if (fmt.speed || fmt.fpa) {
          var dspeed = (execString(fmt.speed) || 1) * (1 + 0.01 * execString(fmt.ias));
          var aps, fpadata;
          if (fmt.fpa) {
            if (fmt.slowest) {
              fpadata = DC.calcFramesFull(fmt.fpa, fmt.weapon, true, dspeed, fmt.round, stats);
            } else {
              fpadata = DC.calcFramesFull(fmt.fpa, fmt.weapon, dspeed, fmt.round, undefined, stats);
            }
            aps = 60 / fpadata.frames;
            cost *= fmt.fpa / 60;
          } else {
            aps = dspeed * (fmt.weapon ? stats.info[fmt.weapon].speed : stats.info.aps);
          }
          result[stat].value = cost * aps;
          if (!notip) {
            result[stat].text = _L("{0} {1} per second").format(parseFloat((cost * aps).toFixed(2)), DC.resources[resource]);
            if (fmt.fpa) {
              var tip = new Tooltip(stat, result[stat].text);
              tip.add(fmt.tip);
              tip.line("Cost per tick: {0} {1}", _V(cost, 2, "white"), DC.resources[resource]);
              tip.line("Breakpoint: {0} frames ({1} APS)", fpadata.frames, _V(aps, 2, "white"));
              result[stat].tip = tip.html();

              if (fmt.bp) {
                breakpointTip.line("{0}: {1} frames ({2} APS)", _L("Tick rate"), _V(fpadata.frames, 0, "white"), _V(aps, 2, "white"));
                fpadata.dps = false;
                breakpointTip.breakpoints(stats, fpadata);
                breakpointValues.push(fpadata.frames);
              }
            }
          }
        } else if (fmt.persecond) {
          result[stat].value = cost;
          if (!notip) result[stat].text = _L("{0} {1} per second").format(parseFloat(cost.toFixed(2)), DC.resources[resource]);
        } else {
          result[stat].value = cost;
          if (!notip) result[stat].text = parseFloat(cost.toFixed(2)) + " " + DC.resources[resource];
        }
      } else if (fmt.value !== undefined) {
        // OPTION 6
        // value (just value), tip
        if (typeof fmt.value === "number") {
          result[stat].value = fmt.value;
          if (!notip) result[stat].text = DC.formatNumber(fmt.value, 0, 10000);
        } else if (!notip) {
          result[stat].text = _L(fmt.value);
        }
        if (fmt.tip && !notip) {
          result[stat].tip = (new Tooltip(stat, result[stat].text)).add(fmt.tip).html();
        }
      } else {
        // OPTION 7
        // damage!

        var data = formatObject(fmt, options);
        if (!data) {
          delete result[stat];
          return;
        }
        result[stat].value = data.value;

        if (!notip) {
          result[stat].text = DC.formatNumber(data.value, 0, 10000);

          var tip = new Tooltip(fmt.total === true ? stat : _L("Average {0}").format(_L(stat)), result[stat].text);
          tip.add(fmt.tip);
          if (!fmt.weapon && stats.info.mainhand && stats.info.offhand) {
            tip.line("Alternates weapons");
          }
          if (!fmt.thorns && fmt.total !== true) {
            if (fmt.nocrit) {
              tip.line("Damage range: {0}", _R(data.base.min * data.total_factor * (1 + data.chc * data.chd),
                                               data.base.max * data.total_factor * (1 + data.chc * data.chd), "white"));
            } else {
              if (!fmt.weapon && stats.info.mainhand && stats.info.offhand) {
                tip.line("Mainhand white damage: {0}", _R(stats.info.mainhand.wpnbase.min * data.total_factor,
                                                          stats.info.mainhand.wpnbase.max * data.total_factor, "white"));
                tip.line("Offhand white damage: {0}", _R(stats.info.offhand.wpnbase.min * data.total_factor,
                                                         stats.info.offhand.wpnbase.max * data.total_factor, "white"));
                if (data.bonus_chc) {
                  tip.line("Critical chance: {0}", _V(data.chc * 100, 2, "green", "%"));
                }
                tip.line("Mainhand critical damage: {0}", _R(stats.info.mainhand.wpnbase.min * data.total_factor * (1 + data.chd),
                                                             stats.info.mainhand.wpnbase.max * data.total_factor * (1 + data.chd), "white"));
                tip.line("Offhand critical damage: {0}", _R(stats.info.offhand.wpnbase.min * data.total_factor * (1 + data.chd),
                                                            stats.info.offhand.wpnbase.max * data.total_factor * (1 + data.chd), "white"));
              } else {
                tip.line("White damage: {0}", _R(data.base.min * data.total_factor,
                                                 data.base.max * data.total_factor, "white"));
                if (data.bonus_chc) {
                  tip.line("Critical chance: {0}", _V(data.chc * 100, 2, "green", "%"));
                }
                tip.line("Critical damage: {0}", _R(data.base.min * data.total_factor * (1 + data.chd),
                                                    data.base.max * data.total_factor * (1 + data.chd), "white"));
              }
            }
          }
          if (typeof fmt.total === "number") {
            tip.line("Extra damage: {0}", _V(0.5 * (data.base.min + data.base.max) * data.extra_factor * (1 + data.chc * data.chd), 0, "white"));
          }
          tip.line(_L("Formula: ") +
            "<span class=\"d3-color-gray\">" + (fmt.thorns ? _L("[Thorns]") : _L("[Weapon]")) + "</span>" +
            (fmt.nocrit || fmt.total ? " &#215; " + _V(1 + data.chc * data.chd, 2) : "") +
            data.factors.map(function(factor) {
              return factor.divide ? " / " + _V(factor.divide) : " &#215; " + _V(factor.factor, 2);
            }).join(""));
          if (fmt.thorns) {
            tip.line(false, "Thorns damage: {0}", _V(stats.thorns || 0, 0, "white"));
          } else {
            if (fmt.weapon !== "offhand") {
              if (!fmt.avg) {
                tip.line(false, "Main hand damage: {0}", _R(stats.info.mainhand.wpnbase.min, stats.info.mainhand.wpnbase.max, "white"));
              } else {
                tip.line(false, "Average main hand damage: {0}", _V(0.5 * (stats.info.mainhand.wpnbase.min + stats.info.mainhand.wpnbase.max), 0, "white"));
              }
            }
            if (fmt.weapon !== "mainhand" && stats.info.offhand) {
              tip.line(false, "Off hand damage: {0}", _R(stats.info.offhand.wpnbase.min, stats.info.offhand.wpnbase.max, "white"));
            }
          }
          if (data.chd) {
            if (fmt.nocrit || fmt.total) {
              tip.line(false, "Critical multiplier: {0}", _V(1, 0, "white") + " + " + _V(data.chc, 2, "green") + " &#215; " + _V(data.chd, 2, "green"));
            } else {
              tip.line(false, "Critical damage: {0}", _V(100 * data.chd, 1, "white", "%"));
            }
          }
          data.factors.forEach(function(factor) {
            var entries = [];
            if (factor.divide) {
              entries.push(_V(1, 0, "white") + " / " + _V(factor.divide));
            } else if (factor.percent !== undefined) {
              if (typeof factor.percent === "number") {
                if (factor.percent) {
                  entries.push(_V(factor.percent, 2, "green", "%"));
                }
              } else {
                for (var f in factor.percent) {
                  entries.push(_V(factor.percent[f], 2, "green", "%") + " <span class=\"d3-color-gray\">(" + _L(f) + ")</span>");
                }
              }
            } else {
              entries.push(_V(factor.factor, 2));
            }
            if (factor.extra) {
              for (var j = 0; j < factor.extra.length; ++j) {
                if (typeof factor.extra[j] === "object") {
                  entries.push(_V(factor.extra[j][0], 2, "green", "%") + " &#215; " + _V(factor.extra[j][1], 2, "green"));
                } else {
                  entries.push(_V(factor.extra[j], 2, "green", "%"));
                }
              }
            }
            tip.line(false, _L(factor.name) + ": " + entries.join(" + "));
          });

          result[stat].tip = tip.html();
        }
      }
    });

    // process sum:true

    var speedCache = {};
    while (sumlines.length) {
      var next = [];
      for (var index = 0; index < sumlines.length; ++index) {
        var stat = sumlines[index];
        var okay = true;
        var sum = 0;
        var tip = new Tooltip();
        var bpTip = new Tooltip();
        var bpValues = [];
        var sequence = (lines[stat].sum === "sequence");
        var totalTime = 0;
        $.each(lines[stat], function(src, data) {
          if (result[src] || (typeof data === "object" && src != "tip")) {
            var key = src;
            if (typeof data === "object" && src != "tip") {
              key = (data.src || src);
            }
            if ((!result[key] || result[key].value === undefined) && (typeof data !== "object" || !data.value)) {
              okay = false;
            } else {
              if (typeof data === "object") {
                data = $.extend({}, data);
              } else {
                data = {speed: data};
              }
              var line = _L(data.name || src) + ": ";
              var mul = 1;
              if (data.count) {
                data.count = execString(data.count);
                if (data.count && data.count != 1) {
                  mul *= data.count;
                  line += parseFloat(data.count.toFixed(2)) + "x ";
                }
              }
              var theValue = (data.value ? execString(data.value) : result[key].value);
              line += _V(theValue, 0, "white");
              if (data.factor) {
                data.factor = execString(data.factor);
                if (data.factor != 1) {
                  mul *= data.factor;
                  line += " &#215; " + _V(data.factor, 2, "white");
                }
              }
              if (data.divide) {
                data.divide = execString(data.divide);
                if (data.divide != 1) {
                  mul /= data.divide;
                  line += " / " + _V(data.divide, 0, "white");
                }
              }
              tip.line(line);
              if (data.cd) {
                data.cd = execString(data.cd);
                if (data.cdr !== false) {
                  data.cd -= (stats.cdrint || 0);
                  data.cd *= (1 - 0.01 * (stats.cdr || 0));
                }
                data.cd = Math.max(0.5, data.cd);
                tip.line(false, "Cooldown: {0} seconds", _V(data.cd, 2, "white"));
                mul /= data.cd;
              }
              if (data.pet) {
                var frames = undefined;
                var aps = (data.speed ? execString(data.speed) * stats.info.mainhand.speed : (data.aps ? execString(data.aps) : 1));
                var petias = (stats.petias || 0);
                if (data.area === false) {
                  petias = (stats.leg_taskerandtheo || 0);
                }
                var tnt = 1 + 0.01 * execString(data.ias) + 0.01 * petias;
                aps *= tnt;
                if (typeof data.pet === "number") {
                  frames = Math.ceil(Math.floor(data.pet / aps) / 6) * 6;
                  aps = 60 / frames;
                }
                if (!notip) {
                  var _aps = "<span class=\"d3-color-white\">" + DC.formatNumber(aps, 2, 10000) + "</span>";
                  if (!frames) {
                    tip.line(false, "Speed: {0}", _aps);
                  } else {
                    tip.line(false, "Speed: {0} ({1} frames)", _aps, _V(frames, 0, "white"));
                    if (!data.nobp) {
                      bpValues.push(frames);
                      bpTip.line("{0}: {1} frames ({2} APS)", _L(data.name || src), _V(frames, 0, "white"), _aps);
                      if (data.speed) {
                        bpTip.breakpoints(stats, {
                          pet: true,
                          fpa: data.pet,
                          frames: frames,
                          speed: tnt * execString(data.speed),
                        });
                      }
                    }
                  }
                }
                if (sequence) {
                  totalTime += 1 / aps;
                } else {
                  if (data.cd) {
                    mul *= Math.min(1, data.cd * aps);
                  } else {
                    mul *= aps;
                  }
                }
              } else if (data.speed || data.aps || data.fpa) {
                var aps = 1;
                var weapon;
                if (data.speed) {
                  weapon = (typeof lines[key] === "object" && lines[key].weapon);
                  dspeed = execString(data.speed);
                  aps = dspeed * (weapon ? stats.info[weapon].speed : stats.info.aps);
                } else if (data.aps) {
                  aps = execString(data.aps);
                }
                if (data.ias) {
                  var ias = 1 + 0.01 * execString(data.ias);
                  aps *= ias;
                  if (dspeed) dspeed *= ias;
                }
                var fpadata = undefined;
                if (data.fpa) {
                  if (data.speed) {
                    fpadata = DC.calcFramesFull(data.fpa, weapon, data.slowest, dspeed, data.round, stats);
                  } else {
                    fpadata = {frames: Math.floor(data.fpa / aps) + (data.round === "up" ? 1 : 0)};
                  }
                  aps = 60 / fpadata.frames;
                }
                if (!notip) {
                  var _aps = "<span class=\"d3-color-white\">" + DC.formatNumber(aps, 2, 10000) + "</span>";
                  if (!fpadata) {
                    tip.line(false, "Speed: {0}", _aps);
                  } else {
                    tip.line(false, "Speed: {0} ({1} frames)", _aps, _V(fpadata.frames, 1, "white"));
                    if (!data.nobp) {
                      bpValues.push(fpadata.frames);
                      bpTip.line("{0}: {1} frames ({2} APS)", _L(data.name || src), _V(fpadata.frames, 0, "white"), _aps);
                      if (data.speed) {
                        fpadata.sequence = sequence;
                        bpTip.breakpoints(stats, fpadata);
                      }
                      if (data.total) {
                        var ticks;
                        if (fpadata.framesmh && fpadata.framesoh) {
                          var whole = Math.floor(data.total / (fpadata.framesmh + fpadata.framesoh));
                          var remain = data.total - whole * (fpadata.framesmh + fpadata.framesoh);
                          ticks = whole * 2;
                          if (remain) {
                            ticks += (remain > fpadata.framesmh ? 1 : 0.5) + (remain > fpadata.framesoh ? 1 : 0.5);
                          }
                        } else {
                          ticks = Math.ceil(data.total / fpadata.frames);
                        }
                        tip.line(false, "Total ticks: {0} ({1} damage)", _V(ticks, 1, "white"),
                          "<span class=\"d3-color-green\">" + DC.formatNumber(theValue * (mul * (data.cd || 1)) * ticks, 0, 10000) + "</span>");
                      }
                    }
                  }
                }
                if (sequence) {
                  totalTime += 1 / aps;
                } else {
                  if (data.cd) {
                    mul *= Math.min(1, data.cd * aps);
                  } else {
                    mul *= aps;
                  }
                }
              } else if (data.refspeed) {
                if (speedCache[data.refspeed] === undefined) {
                  okay = false;
                } else {
                  if (data.cd) {
                    mul *= Math.min(1, data.cd / speedCache[data.refspeed]);
                  } else {
                    mul /= speedCache[data.refspeed];
                  }
                  tip.line(false, "Speed: {0}", _V(1 / speedCache[data.refspeed], 2, "white"));
                }
              }
              sum += theValue * mul;
            }
          }
        });
        if (sequence && okay) {
          if (totalTime > 0.1) {
            sum /= totalTime;
            speedCache[stat] = totalTime;
            var tmptip = new Tooltip();
            tmptip.line("Sequence length: {0} seconds", _V(totalTime, 2, "white"));
            tip = tmptip.add(tip);
          } else {
            okay = false;
          }
        }
        if (okay) {
          result[stat].value = sum;
          if (!notip) {
            result[stat].text = DC.formatNumber(sum, 0, 10000);
            var tmptip = new Tooltip(_L(stat).replace("DPS", _L("Damage Per Second")), result[stat].text);
            tmptip.add(lines[stat].tip);
            tmptip.add(tip);
            result[stat].tip = tmptip.html();
            if (!lines[stat].nobp) {
              breakpointTip.add(bpTip);
              breakpointValues = breakpointValues.concat(bpValues);
            }
          }
        } else {
          next.push(stat);
        }
      }
      if (next.length >= sumlines.length) {
        break;
      }
      sumlines = next;
    }
    for (var index = 0; index < sumlines.length; ++index) {
      delete result[sumlines[index]];
    }
    if (breakpointValues.length && !notip) {
      var text = [];
      for (var i = 0; i < breakpointValues.length; ++i) {
        text.push(_L("{0} frames").format(breakpointValues[i]));
      }
      var title = "Breakpoint" + (text.length > 1 ? "s" : "");
      var text = text.join(" / ");
      breakpointTip.header(title, text);
      result[title] = {
        value: breakpointValues,
        text: text,
        tip: breakpointTip.html(),
      };
    }

    return result;
  }

  DC.skill_formatObject = formatObject;
  DC.skill_processInfo = processInfo;

})();
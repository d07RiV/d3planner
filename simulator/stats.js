(function() {

  var Sim = Simulator;

  var elementList = {
    arc: "Arcane",
    col: "Cold",
    fir: "Fire",
    hol: "Holy",
    lit: "Lightning",
    phy: "Physical",
    psn: "Poison",
  };
  var statInfo = {
    basearmor: {base: true},
    baseblock: {base: true},
    blockamount: {args: 2, base: true},

    wpnphy: {args: 2, damage: true},
    wpnfir: {args: 2, damage: true},
    wpncol: {args: 2, damage: true},
    wpnpsn: {args: 2, damage: true},
    wpnarc: {args: 2, damage: true},
    wpnlit: {args: 2, damage: true},
    wpnhol: {args: 2, damage: true},

    damage: {special: true},
    dmgmul: {special: true, mult: true},
    dmgtaken: {special: true},

    dmgred: {dr: true},
    dodge: {dr: true},

    edef: {dr: true},
    cdr: {dr: true},
    rcr: {dr: true},
    rcr_ap: {dr: true},
    rcr_hatred: {dr: true},
    rcr_disc: {dr: true},
    rcr_mana: {dr: true},
    rcr_fury: {dr: true},
    rcr_wrath: {dr: true},
    rcr_spirit: {dr: true},

    colddef: {dr: true},
    nonphys: {dr: true},

    bleed: {args: 2, argnames: ["chance", "amount"], dr: true},

    resphy: {resist: true},
    resfir: {resist: true},
    rescol: {resist: true},
    respsn: {resist: true},
    resarc: {resist: true},
    reslit: {resist: true},

    hitfear: {dr: true},
    hitstun: {dr: true},
    hitblind: {dr: true},
    hitfreeze: {dr: true},
    hitchill: {dr: true},
    hitslow: {dr: true},
    hitimmobilize: {dr: true},
    hitknockback: {dr: true},

    rangedef: {dr: true},
    meleedef: {dr: true},
    ccr: {dr: true},
    dura: {args: 0},

    custom: {args: 0},
    shift: {args: -1},
  };

  function addStat(dst, stat, amount, factor) {
    if (!amount) return;
    if (!factor) factor = 1;
    var info = statInfo[stat];
    if (info && info.special && dst.special) {
      if (!dst.special[stat]) {
        dst.special[stat] = [];
      }
      if (amount instanceof Array) {
        dst.special[stat].push({percent: amount[0] * factor});
        amount = amount[0];
      } else if (typeof amount === "number") {
        dst.special[stat].push({percent: amount * factor});
      } else {
        if (amount.list) {
          for (var i = 0; i < amount.list.length; ++i) {
            addStat(dst, stat, amount.list[i], factor);
          }
          return;
        }
        var obj = Sim.extend({}, amount);
        obj.percent *= factor;
        dst.special[stat].push(obj);
        if (amount.elems === undefined && amount.pet === undefined && amount.skills === undefined) {
          amount = amount.percent;
        } else {
          amount = undefined;
        }
      }
      if (amount) {
        if (info.mult) {
          dst[stat] = (dst[stat] || 1) * (1 + 0.01 * amount * factor);
        } else {
          dst[stat] = (dst[stat] || 0) + amount * factor;
        }
      }
      return;
    }
    if (info && info.args == 0) {
      dst[stat] = 1;
    } else if (!info || info.args === undefined || info.args == 1) {
      if (typeof amount !== "number") {
        amount = amount[0];
      }
      if (dst[stat] !== undefined && (!info || !info.nostack)) {
        if (info && info.dr) {
          dst[stat] = 100 - 0.01 * (100 - dst[stat]) * Math.max(0, 100 - amount * factor);
        } else {
          dst[stat] += amount * factor;
        }
      } else {
        dst[stat] = amount * factor;
      }
    } else if (info.args == -1) {
      dst[stat] = amount;
    } else {
      if (dst[stat] === undefined) {
        dst[stat] = {};
      }
      var argnames = (info.argnames || ["min", "max"]);
      if (info && info.dr) {
        dst[stat][argnames[0]] = 100 - 0.01 * (100 - (dst[stat][argnames[0]] || 0)) * Math.max(0, 100 - (amount[0] !== undefined ? amount[0] : amount[argnames[0]]) * factor);
        for (var i = 1; i < info.args; ++i) {
          dst[stat][argnames[i]] = Math.max(dst[stat][argnames[i]] || 0, (amount[i] !== undefined ? amount[i] : amount[argnames[i]]) * factor);
        }
      } else {
        for (var i = 0; i < info.args; ++i) {
          dst[stat][argnames[i]] = (!info.nostack && dst[stat][argnames[i]] || 0) + (amount[i] !== undefined ? amount[i] : amount[argnames[i]]) * factor;
        }
      }
    }
  }

  function Stats(base, buffs) {
    Sim.extend(true, this, base);
    for (var id in buffs) {
      var src = buffs[id].stats;
      var factor = (buffs[id].params.multiply ? buffs[id].stacks : 1);
      for (var s in src) {
        this.add(s, src[s], factor);
      }
    }
    Sim.trigger("updatestats", {stats: this});
    this.finalize(true);
  }

  Stats.prototype.addAbsolute = function(stat, from) {
    if (!this[from]) return;
    var info = statInfo[stat];
    if (this[stat] && info && info.dr) {
      this[stat] = 100 - 0.01 * (100 - this[stat]) * (100 - this[from]);
    } else {
      this[stat] = (this[stat] || 0) + this[from];
    }
  };
  Stats.prototype.addPercent = function(stat, from, base) {
    var total;
    if (typeof from === "string") {
      if (!this[from]) return;
      total = this[from];
    } else {
      total = 0;
      for (var i = 0; i < from.length; ++i) {
        if (this[from[i]]) {
          total += this[from[i]];
        }
      }
      if (!total) return;
    }
    if (base === undefined) {
      if (!this[stat]) return;
      base = this[stat];
    }
    this[stat] = (this[stat] || 0) + base * 0.01 * total;
  };
  Stats.prototype.add = function(stat, amount, factor, source) {
    addStat(this, stat, amount, factor, source);
  };
  Stats.prototype.getValue = function(stat) {
    var data = this;
    var list = stat.split(".");
    while (typeof data === "object" && list.length) {
      data = data[list.shift()];
    }
    return data || 0;
  };
  Stats.prototype.execString = function(expr) {
    var self = this;
    expr = expr.replace(/[a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*/g, function(stat) {
      var val = self.getValue(stat);
      if (typeof val !== "number") {
        return "(" + JSON.stringify(val) + ")";
      }
      return val;
    });
    return eval(expr);
  }
  Stats.prototype.getSpecial = function(stat, elem, pet, skill, excl) {
    var total = (statInfo[stat].mult ? 1 : 0);
    if (!this.special[stat]) return total;
    for (var i = 0; i < this.special[stat].length; ++i) {
      var info = this.special[stat][i];
      if (excl && excl.indexOf(src) >= 0) continue;
      if (info.elems && info.elems.indexOf(elem) < 0) continue;
      if (info.pet !== undefined && info.pet != (pet || false)) continue;
      if (info.skills && info.skills.indexOf(skill) < 0) continue;
      if (statInfo[stat].mult) {
        total *= 1 + 0.01 * info.percent;
      } else {
        total += info.percent;
      }
    }
    return total;
  };

  Stats.prototype.finalize = function() {
    this.chc = Math.min(75, this.chc);
    this.addAbsolute("chc", "extrachc");
    this.chc = Math.min(100, this.chc);

    this.addAbsolute("str", "caldesanns_str");
    this.addAbsolute("dex", "caldesanns_dex");
    this.addAbsolute("int", "caldesanns_int");
    this.addAbsolute("vit", "caldesanns_vit");
    this.addPercent("str", "str_percent");
    this.addPercent("dex", "dex_percent");
    this.addPercent("int", "int_percent");

    this.thorns = ((this.thorns || 0) + (this.firethorns || 0)) * (1 + this[this.primary] / 400);
    this.info.thorns = this.thorns * (1 + 0.01 * (this.thorns_multiply || 0));
    this.info.thorns = this.thorns * (1 + 0.01 * (this.thorns_percent || 0));

    this.calcWeapon = function(info) {
      info.speed += (this.weaponaps || 0);
      info.speed *= 1 + 0.01 * (this.weaponaps_percent || 0);
      var factor = (1 + 0.01 * (info.damage || 0));
      info.wpnphy.min *= factor;
      info.wpnphy.max *= factor;
      if (this.wpnphy) {
        info.wpnphy.min += this.wpnphy.min;
        info.wpnphy.max += this.wpnphy.max;
      }
      info.wpnbase = Sim.extend({}, info.wpnphy);
      factor = (1 + 0.01 * this[this.primary]) * (1 + 0.01 * (this.damage || 0));
      info.wpnphy.min *= factor;
      info.wpnphy.max *= factor;
      info.damage = (info.wpnphy.min + info.wpnphy.max) * 0.5;
      info.speed *= 1 + 0.01 * this.ias;
      info.speed = Math.min(info.speed, 5);
      info.dps = info.damage * this.info.critfactor * info.speed;
      info.dph = info.damage * this.info.critfactor;
    }

    if (this.info.offhand) {
      this.add("ias", 15, 1, "dualwield");
    }
    this.info.critfactor = 1 + (0.01 * this.chc) * (0.01 * this.chd);
    this.calcWeapon(this.info.mainhand);
    if (this.info.offhand) {
      this.calcWeapon(this.info.offhand);
      this.info.aps = 2 / (1 / this.info.mainhand.speed + 1 / this.info.offhand.speed);
      this.info.dps = (this.info.mainhand.dph + this.info.offhand.dph) * this.info.aps / 2;
    } else {
      this.info.dps = this.info.mainhand.dps;
      this.info.aps = this.info.mainhand.speed;
    }

    this.info.maxelem = "arc";
    this.info.elemental = (this.dmgarc || 0);
    for (var e in elementList) {
      var cur = (this["dmg" + e] || 0);
      if (cur > this.info.elemental) {
        this.info.maxelem = e;
        this.info.elemental = cur;
      }
    }

    this.info.edps = this.info.dps * (1 + 0.01 * (this.edmg || 0));
    this.info.elementaldps = this.info.dps * (1 + 0.01 * this.info.elemental);

    this.info.dph = this.info.dps / this.info.aps;

    this.info.primary = this[this.primary];

    var dmgprop = ["dps", "dpsphy", "dpsfir", "dpscol", "dpslit", "dpsarc", "dpspsn", "dpshol",
                   "dph", "dphphy", "dphfir", "dphcol", "dphlit", "dpharc", "dphpsn", "dphhol"];
    this.info.dmgmul = 100 * ((this.dmgmul || 1) - 1);
    this.final = {};
    this.final.addbase = 1 + 0.01 * (this.damage || 0) + 0.01 * (this.dmgtaken || 0);
    this.final.chc = this.chc + (this.chctaken || 0);
    var mult = (this.dmgmul || 1) * this.final.addbase / (1 + 0.01 * (this.damage || 0));
    mult *= (10000 + this.final.chc * this.chd) / (10000 + this.chc * this.chd);
    this.final.dps = this.info.dps * mult;
    this.final.dph = this.info.dph * mult;
    this.final.elemdps = this.final.dps * (1 + 0.01 * this.info.elemental);
    this.final.elemdph = this.final.dph * (1 + 0.01 * this.info.elemental);
    this.final.elemedps = this.final.elemdps * (1 + 0.01 * (this.edmg || 0));
    this.final.elemedph = this.final.elemdph * (1 + 0.01 * (this.edmg || 0));

    this.ms = Math.min(25, this.ms || 0) + (this.extrams || 0);

    switch (this.charClass) {
    case "wizard":
      this.addPercent("apregen", "resourcegen");
      this.addAbsolute("rcr_ap", "rcr");
      break;
    case "demonhunter":
      this.addPercent("hatredregen", "resourcegen");
      this.addPercent("discregen", "resourcegen");
      this.addAbsolute("rcr_hatred", "rcr");
      this.addAbsolute("rcr_disc", "rcr");
      break;
    case "witchdoctor":
      this.addPercent("maxmana", "maxmana_percent");
      this.addPercent("manaregen", "manaregen_percent", this.maxmana);
      this.addPercent("manaregen", "resourcegen");
      this.addAbsolute("rcr_mana", "rcr");
      break;
    case "barbarian":
      this.addPercent("furyregen", "resourcegen");
      this.addAbsolute("rcr_fury", "rcr");
      break;
    case "monk":
      if (this.spiritregen > 0) {
        this.addPercent("spiritregen", "resourcegen");
      }
      this.addAbsolute("rcr_spirit", "rcr");
      break;
    case "crusader":
      this.addPercent("wrathregen", "resourcegen");
      this.addAbsolute("rcr_wrath", "rcr");
      break;
    }
  };

  Sim.addBaseStats = function(stats) {
    for (var s in stats) {
      addStat(this.baseStats, s, stats[s]);
    }
    Sim.buffsModified = true;
  };

  Sim.Stats = Stats;
})();

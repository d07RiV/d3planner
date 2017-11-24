(function() {

  var DC = DiabloCalc;
  var statInfo = $.extend({}, DC.stats);

  function addStat(dst, stat, amount, factor, source) {
    if (!amount) {
      return;
    }
    if (amount.source) {
      return addStat(dst, stat, amount.value, factor, amount.source);
    }
    var info = statInfo[stat];
    if (!factor) {
      factor = 1;
    }
    if (info && info.special && dst.special && source) {
      if (!dst.special[stat]) {
        dst.special[stat] = {};
      }
      if (!dst.special[stat][source]) {
        dst.special[stat][source] = [];
      }
      if (amount instanceof Array) {
        dst.special[stat][source].push({percent: amount[0] * factor});
        amount = amount[0];
      } else if (typeof amount === "number") {
        dst.special[stat][source].push({percent: amount * factor});
      } else {
        if (amount.list) {
          for (var i = 0; i < amount.list.length; ++i) {
            addStat(dst, stat, amount.list[i], factor, source);
          }
          return;
        }
        var obj = $.extend({}, amount);
        obj.percent *= factor;
        dst.special[stat][source].push(obj);
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
    if (source && dst.sources) {
      var value = (typeof amount === "number" ? amount : amount[0]) * factor;
      if (value) {
        if (!dst.sources[stat]) {
          dst.sources[stat] = {};
        }
        dst.sources[stat][source] = (dst.sources[stat][source] || 0) + value;
      }
    }
    if (info && info.args == 0) {
      dst[stat] = 1;
    } else if (!info || info.args == 1) {
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
      dst[stat] = (amount.length > 0 ? amount[0] : "");
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

  function Stats(charClass) {
    this.info = {
      level: parseInt($(".char-level").val()),
      gems: 0,
      ancients: 0,
    };
    this.charClass = (charClass || DC.charClass);
    this.primary = DC.classes[this.charClass].primary;

    this.str = 7 + this.info.level;
    this.dex = 7 + this.info.level;
    this.int = 7 + this.info.level;
    this.vit = 7 + 2 * this.info.level;

    this.chc = 5;
    this.chd = 50;
    this.ias = 0;

    this.gems = {};
    this.sources = {};
    this.special = {};
    this.skills = {};
    this.passives = {};
    this[this.primary] += 2 * this.info.level;

    this.info.mainhand = {
      speed: 1,
      wpnphy: {min: 2, max: 3},
    };
    this.info.sets = {};
    this.info.itemregen = 0;
    this.affixes = {};

    switch (this.charClass) {
    case "wizard":
      this.maxap = 100;
      this.apregen = 10;
      break;
    case "demonhunter":
      this.maxhatred = 125;
      this.hatredregen = 5;
      this.maxdisc = 30;
      this.discregen = 1;
      break;
    case "witchdoctor":
      this.maxmana = 750;
      this.manaregen = 50;
      break;
    case "barbarian":
      this.maxfury = 100;
      break;
    case "monk":
      this.maxspirit = 250;
      break;
    case "crusader":
      this.maxwrath = 100;
      this.wrathregen = 2.5;
      break;
    case "necromancer":
      this.maxessence = 200;
      break;
    }
  }

  Stats.prototype.addAbsolute = function(stat, from) {
    if (!this[from]) return;
    var info = statInfo[stat];
    var sources = this.sources[from];
    var total = this[from];
    if (this.sources[from]) {
      if (!this.sources[stat]) {
        this.sources[stat] = {};
      }
      for (var src in this.sources[from]) {
        if (this.sources[stat][src] && info && info.dr) {
          this.sources[stat][src] = 100 - 0.01 * (100 - this.sources[stat][src]) * (100 - this.sources[from][src]);
        } else {
          this.sources[stat][src] = (this.sources[stat][src] || 0) + this.sources[from][src];
        }
      }
    }
    if (this[stat] && info && info.dr) {
      this[stat] = 100 - 0.01 * (100 - this[stat]) * (100 - this[from]);
    } else {
      this[stat] = (this[stat] || 0) + this[from];
    }
  };
  Stats.prototype.addPercent = function(stat, from, base) {
    var sources, total;
    if (typeof from === "string") {
      if (!this[from]) return;
      sources = this.sources[from];
      total = this[from];
    } else {
      sources = {};
      total = 0;
      for (var i = 0; i < from.length; ++i) {
        if (this[from[i]]) {
          total += this[from[i]];
          var from_sources = this.sources[from[i]];
          if (from_sources) {
            for (var src in from_sources) {
              sources[src] = (sources[src] || 0) + from_sources[src];
            }
          }
        }
      }
      if (!total) return;
    }
    if (base === undefined) {
      if (!this[stat]) return;
      base = this[stat];
    }
    if (sources) {
      if (!this.sources[stat]) {
        this.sources[stat] = {};
      }
      for (var src in sources) {
        if (typeof base === "number") {
          var value = base * 0.01 * sources[src];
          this.sources[stat][src] = (this.sources[stat][src] || 0) + value;
        } else {
          for (var key in base) {
            var value = base[key] * 0.01 * sources[src];
            this.sources[stat][src] = (this.sources[stat][src] || 0) + value;
            break;
          }
        }
      }
    }
    if (typeof base === "number") {
      this[stat] = (this[stat] || 0) + base * 0.01 * total;
    } else {
      if (!this[stat]) this[stat] = {};
      for (var key in base) {
        this[stat][key] = (this[stat][key] || 0) + base[key] * 0.01 * total;
      }
    }
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
  Stats.prototype.getAffixSource = function(id) {
    var affix = this.affixes[id];
    if (!affix) return;
    if (affix.set) return affix.set;
    if (affix.slot) return DC.getSlotId(affix.slot);
    if (affix.kanai) return DC.getSkills().kanai[affix.kanai];
  };
  Stats.prototype.getSpecial = function(stat, elem, pet, skill, excl) {
    if (!this.special[stat]) return {};
    var list = [];
    for (var src in this.special[stat]) {
      for (var i = 0; i < this.special[stat][src].length; ++i) {
        var info = this.special[stat][src][i];
        if (!info.percent) continue;
        if (excl && excl.indexOf(src) >= 0) continue;
        if (info.elems && info.elems.indexOf(elem) < 0) continue;
        if (info.pet !== undefined && info.pet != (pet || false)) continue;
        if (info.skills && info.skills.indexOf(skill) < 0) continue;
        var name;
        if (info.name) {
          name = info.name;
        } else {
          name = (DC.sourceNames[src] || src);
        }
        list.push([name, info.percent]);
      }
    }
    return list;
  };
  Stats.prototype.getTotalSpecial = function(stat, elem, pet, skill, excl) {
    var total = (statInfo[stat].mult ? 1 : 0);
    if (!this.special[stat]) return total;
    for (var src in this.special[stat]) {
      for (var i = 0; i < this.special[stat][src].length; ++i) {
        var info = this.special[stat][src][i];
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
    }
    return total;
  };

  Stats.prototype.startLoad = function() {
    this.extraFx = {};
    if (DiabloCalc.addExtraAffixes) {
      DiabloCalc.addExtraAffixes(this.extraFx);
    }
    this.setSlots = {};
  };
  Stats.prototype.addItem = function(slot, data, nogems) {
    if (!data || !DC.itemById[data.id]) return;
    var item = DC.itemById[data.id];
    var itemType = DC.itemTypes[item.type];
    if (slot === "offhand") {
      this.info.ohtype = item.type;
    }
    if (data.ancient) ++this.info.ancients;
    if (itemType.weapon) {
      var weapon = itemType.weapon;
      if (item.weapon) weapon = $.extend({}, weapon, item.weapon);
      this.info[slot] = {
        speed: weapon.speed * (1 + 0.01 * (data.stats.weaponias || [0])[0]),
        ias: (data.stats.weaponias || [0])[0],
        wpnphy: {min: weapon.min, max: weapon.max},
        damage: (data.stats.damage || [0])[0],
        type: item.type,
        slot: itemType.slot,
        weaponClass: weapon.type,
      };
    }
    if (item.set) {
      this.info.sets[item.set] = (this.info.sets[item.set] || 0) + 1;
      if (!this.setSlots[item.set]) {
        this.setSlots[item.set] = slot;
      }
    }
    for (var stat in data.stats) {
      var statid = stat;
      if (stat == "custom") {
        statid = item.required.custom.id;
        statInfo[statid] = item.required.custom;
        statInfo[statid].nostack = true;
        if (statInfo[statid].args === undefined) {
          statInfo[statid].args = 1;
        }
        this.affixes[statid] = {
          slot: slot,
          value: data.stats[stat],
        };
      }
      if (statInfo[statid].damage && itemType.weapon) {
        if (slot === "mainhand") {
          this.info.mhelement = DiabloCalc.stats[stat].elem;
        }
        addStat(this.info[slot], "wpnphy", data.stats[stat]);
      } else if ((statid != "damage" && statid != "weaponias") || !itemType.weapon) {
        addStat(this, statid, data.stats[stat], 1, slot);
      }
      if (stat == "regen") {
        this.info.itemregen += data.stats[stat][0];
      }
    }
    if (data.gems) {
      var factor = 1;
      if (data.stats.custom && item.required.custom.id == "leg_leoricscrown") {
        factor = 1 + 0.01 * data.stats.custom[0];
      }
      if (slot === "head" && this.extraFx.leg_leoricscrown) {
        factor = 1 + 0.01 * this.extraFx.leg_leoricscrown;
      }
      var slotInfo = (DC.metaSlots[itemType.slot] || DC.itemSlots[itemType.slot]);
      var slotType = slotInfo.socketType;
      if (slotType != "weapon" && slotType != "head") {
        slotType = "other";
      }
      this.info.gems += data.gems.length;
      for (var i = 0; i < data.gems.length; ++i) {
        if (DC.legendaryGems[data.gems[i][0]]) {
          function getGemValue(effect, level) {
            var value, delta;
            if (effect.realvalue) {
              value = effect.realvalue.slice();
              delta = effect.realdelta;
            } else if (effect.value) {
              value = effect.value.slice();
              delta = effect.delta;
            }
            if (!value) return [];
            if (delta) {
              for (var i = 0; i < delta.length; ++i) {
                value[i] += delta[i] * level;
              }
            }
            return value;
          }

          var leg = DC.legendaryGems[data.gems[i][0]];
          this.gems[data.gems[i][0]] = data.gems[i][1];

          if (!nogems) {
            var active = (DC.isGemActive && DC.isGemActive(data.gems[i][0]));
            if (active && leg.buffs) {
              var list = leg.buffs(data.gems[i][1], this);
              for (var stat in list) {
                this.add(stat, list[stat], /*factor*/1, data.gems[i][0]);
              }
            } else {
              if (active) {
                var id = leg.effects[0].stat;
                if (!id) {
                  id = "gem_" + data.gems[i][0];
                  statInfo[id] = leg.effects[0];
                }
                this.add(id, getGemValue(leg.effects[0], data.gems[i][1]), /*factor*/1, data.gems[i][0]);
              } else if (leg.inactive) {
                var list = leg.inactive(data.gems[i][1], this);
                for (var stat in list) {
                  this.add(stat, list[stat], /*factor*/1, data.gems[i][0]);
                }
              }

              if (data.gems[i][1] >= 25 && (active || data.gems[i][0] == "powerful")) {
                var id = leg.effects[1].stat;
                if (!id) {
                  id = "gem_" + data.gems[i][0] + "_25";
                  statInfo[id] = leg.effects[1];
                }
                this.add(id, getGemValue(leg.effects[1], data.gems[i][1]), /*factor*/1, data.gems[i][0]);
              }
            }
          }
        } else if (DC.gemColors[data.gems[i][1]]) {
          var gem = DC.gemColors[data.gems[i][1]][slotType];
          var value = [gem.amount[data.gems[i][0]]];
          if (gem.stat == "wpnphy") {
            value.push(value[0]);
          }
          if (statInfo[gem.stat].damage && itemType.weapon) {
            addStat(this.info[slot], "wpnphy", value, factor);
          } else {
            this.add(gem.stat, value, factor, "gems");
          }
        }
      }
    }
  };
  Stats.prototype.finishLoad = function() {
    for (var id in this.extraFx) {
      this.add(id, this.extraFx[id]);
    }
    delete this.extraFx;
    for (var set in this.info.sets) {
      var setInfo = DC.itemSets[set];
      var count = this.info.sets[set];
      if (count >= 2 && this.leg_ringofroyalgrandeur) {
        count += 1;
      }
      for (var req in setInfo.bonuses) {
        if (count >= parseInt(req)) {
          var stat = "set_" + set + "_" + req + "pc";
          statInfo[stat] = {args: 0},
          this.add(stat, true);
          for (var i = 0; i < setInfo.bonuses[req].length; ++i) {
            if (setInfo.bonuses[req][i].stat) {
              this.add(setInfo.bonuses[req][i].stat, setInfo.bonuses[req][i].value, 1, set);
            }
          }
//          if (DC.itemaffixes[stat]) {
            this.affixes[stat] = {
              slot: this.setSlots[set],
              set: set,
              pieces: req,
              value: [],
            };
//          }
        }
      }
    }
    delete this.setSlots;
    var paragon = DC.getParagon();
    if (paragon) {
      for (var stat in paragon) {
        this.add(stat, paragon[stat], 1, "paragon");
        if (stat === "regen") {
          this.info.itemregen += paragon[stat][0];
        }
      }
    }

    if (this.info.offhand) {
      if (this.info.offhand.weaponClass === "fist") {
        this.info.weaponClass = "dualwield" + (this.info.mainhand.weaponClass === "fist" ? "_ff" : "_sf");        
      } else {
        this.info.weaponClass = "dualwield";
      }
    } else {
      this.info.weaponClass = this.info.mainhand.weaponClass;
    }
  };
  Stats.prototype.loadItems = function(getSlot, nogems) {
    if (!getSlot) {
      getSlot = DC.getSlot;
    }

    this.startLoad();
    for (var slot in DC.itemSlots) {
      this.addItem(slot, getSlot(slot));
    }
    this.finishLoad();
  };

  Stats.prototype.finalize = function(minimal, resmin) {
    this.chc = Math.min(75, this.chc);
    this.addAbsolute("chc", "extrachc");
    this.chc = Math.min(100, this.chc);

    if (this.expmul) this.expmul *= 0.1;

    this.addAbsolute("str", "caldesanns_str");
    this.addAbsolute("dex", "caldesanns_dex");
    this.addAbsolute("int", "caldesanns_int");
    this.addAbsolute("vit", "caldesanns_vit");
    this.addPercent("str", "str_percent");
    this.addPercent("dex", "dex_percent");
    this.addPercent("int", "int_percent");

    if (!minimal) {
      addStat(this, "armor", this.str, 1, "str");
      addStat(this, "armor", this.dex, 1, "dex");
      addStat(this, "resall", this.int, 0.1, "int");
      this.armor += (this.basearmor || 0);
      this.addPercent("armor", "armor_percent");

      if (this.passives.holdyourground && this.dodge) {
        this.sources.dodge.holdyourground = -this.dodge;
        this.dodge = 0;
      }

      addStat(this, "blockamount", [0, 0]);
      this.addPercent("blockamount", "blockamount_percent");
      addStat(this, "block", this.baseblock, 1, "baseblock");
      this.block = Math.min(75, this.block || 0);
      this.addAbsolute("block", "extra_block");
      this.addPercent("block", "block_percent");
      this.block = Math.min(100, this.block);

      if (this.leg_justicelantern) {
        this.add("dmgred", this.block * this.leg_justicelantern * 0.01, 1, "P4_Unique_Ring_03");
      }

      var hpPerVit = 10;
      if (this.info.level == 70) {
        hpPerVit = 100;
      } else if (this.info.level > 65) {
        hpPerVit = 5 * this.info.level - 270;
      } else if (this.info.level > 60) {
        hpPerVit = 4 * this.info.level - 205;
      } else if (this.info.level > 35) {
        hpPerVit = this.info.level - 25;
      }
      this.info.hppervit = hpPerVit;
      this.info.hp = 36 + 4 * this.info.level + this.vit * hpPerVit;
      this.info.hp *= 1 + 0.01 * (this.life || 0);

      var resists = ["resphy", "resfir", "rescol", "reslit", "respsn", "resarc"];
      for (var i = 0; i < resists.length; ++i) addStat(this, resists[i], this.resall);
      for (var i = 0; i < resists.length; ++i) this.addPercent(resists[i], ["resist_percent", resists[i] + "_percent"]);
      this.info.resavg = 0;
      this.info.resmin = 0;
      for (var i = 0; i < resists.length; ++i) {
        this.info.resmin += (this[resists[i]] < 0 ? -1 : 1) * Math.sqrt(Math.abs(this[resists[i]]));
        this.info.resavg += this[resists[i]];
      }
      this.info.resavg /= 6;
      this.info.resmin = (this.info.resmin < 0 ? -1 : 1) * (this.info.resmin * this.info.resmin) / 36;
      this.info.defavg = 1 - 0.01 * ((this.meleedef || 0) + (this.rangedef || 0)) * 0.333333;
      var nonphys = (this.nonphys || 0) * 0.01;
      this.info.defavg *= 1 - 0.01 * (this.physdef || 0) * 0.16663;
      this.info.defavg *= 1 - (1 - (1 - nonphys) * (1 - 0.01 * (this.colddef || 0))) * 0.16663;
      this.info.defavg *= 1 - nonphys * 0.16663;
      this.info.defavg *= 1 - nonphys * 0.16663;
      this.info.defavg *= 1 - nonphys * 0.16663;
      this.info.defavg *= 1 - (1 - (1 - nonphys) * (1 + 0.01 * (this.firetaken || 0))) * 0.16663;
      this.info.defavg *= 1 - 0.01 * (this.dmgred || 0);
      this.info.armor_factor = 1 / (1 + this.armor / (this.info.level * 50));
      this.info.res_factor = 1 / (1 + this.info.resavg / (this.info.level * 5));
      this.info.resmin_factor = 1 / (1 + this.info.resmin / (this.info.level * 5));
      this.info.defense_factor = this.info.armor_factor * this.info.res_factor * (1 - 0.01 * (this.edef || 0) / 2) * this.info.defavg;
      this.info.defensemin_factor = this.info.armor_factor * this.info.resmin_factor * (1 - 0.01 * (this.edef || 0) / 2) * this.info.defavg;
      this.info.toughness = this.info.hp / this.info.defense_factor / (1 - 0.01 * (this.dodge || 0));
      this.info.toughnessmin = this.info.hp / this.info.defensemin_factor / (1 - 0.01 * (this.dodge || 0));

      this.info.toughpervit = this.info.toughness / this.info.hp * 100 * hpPerVit * (1 + 0.01 * (this.life || 0));
      this.info.toughperlife = this.info.toughness * 0.01 / (1 + 0.01 * (this.life || 0));
      this.info.toughperarmor = this.info.toughness * 100 / (this.info.level * 50) * this.info.armor_factor * (1 + 0.01 * (this.armor_percent || 0));
      var resMult = 1 + 0.01 * (this.resist_percent || 0) + 0.01 * (
        (this.resphy_percent || 0) + (this.resfir_percent || 0) + (this.rescol_percent || 0) +
        (this.reslit_percent || 0) + (this.respsn_percent || 0) + (this.resarc_percent || 0)) / 6;
      this.info.toughperres = this.info.toughness * 100 / (this.info.level * 5) * this.info.res_factor * resMult;

      this.info.toughper650vit = 100 * this.info.toughpervit * 6.50 / this.info.toughness;
      this.info.toughper15life = 100 * this.info.toughperlife * 15 / this.info.toughness;
      this.info.toughper775armor = 100 * this.info.toughperarmor * 7.75 / this.info.toughness;
      this.info.toughper130res = 100 * this.info.toughperres * 1.30 / this.info.toughness;

      this.info.resphy_factor = 1 / (1 + this.resphy / (this.info.level * 5));
      this.info.resfir_factor = 1 / (1 + this.resfir / (this.info.level * 5));
      this.info.rescol_factor = 1 / (1 + this.rescol / (this.info.level * 5));
      this.info.reslit_factor = 1 / (1 + this.reslit / (this.info.level * 5));
      this.info.respsn_factor = 1 / (1 + this.respsn / (this.info.level * 5));
      this.info.resarc_factor = 1 / (1 + this.resarc / (this.info.level * 5));
    }

    this.addAbsolute("thorns", "firethorns");
    this.addPercent("thorns", "vit_to_thorns", this.vit);
    this.addPercent("thorns", "thorns_multiply");
    this.addPercent("thorns", "thorns_percent");
    this.info.thorns = (this.thorns || 0) * (1 + this[this.primary] / 100);

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
      info.wpnbase = $.extend({}, info.wpnphy);
      factor = (1 + 0.01 * this[this.primary]) * (1 + 0.01 * (this.damage || 0));
      info.wpnphy.min *= factor;
      info.wpnphy.max *= factor;
      info.damage = (info.wpnphy.min + info.wpnphy.max) * 0.5;
      info.speed *= 1 + 0.01 * this.ias;
      info.speed = Math.min(5, info.speed);
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
    for (var e in DC.elements) {
      var cur = (this["dmg" + e] || 0);
      if (cur > this.info.elemental) {
        this.info.maxelem = e;
        this.info.elemental = cur;
      }
    }

    if (!minimal) {
      this.addAbsolute("regen", "post_regen");
      this.addPercent("regen", "post_regen_bonus", this.info.itemregen);
      this.addPercent("regen", "regen_bonus");
      this.info.healing = (this.regen || 0) + (this.regen_percent || 0) * 0.01 * this.info.hp + (this.lph || 0) * this.info.aps + (this.laek || 0) * 0.16 + (this.healbonus || 0) * 0.08;
      this.info.recovery = this.info.healing * this.info.toughness / this.info.hp;
      this.info.recoverymin = this.info.healing * this.info.toughnessmin / this.info.hp;
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
    this.final.chc *= 1 + 0.01 * (this.chctaken_percent || 0);
    var mult = (this.dmgmul || 1) * this.final.addbase / (1 + 0.01 * (this.damage || 0));
    mult *= (10000 + this.final.chc * this.chd) / (10000 + this.chc * this.chd);
    this.final.dps = this.info.dps * mult;
    this.final.dph = this.info.dph * mult;
    this.final.elemdps = this.final.dps * (1 + 0.01 * this.info.elemental);
    this.final.elemdph = this.final.dph * (1 + 0.01 * this.info.elemental);
    this.final.elemedps = this.final.elemdps * (1 + 0.01 * (this.edmg || 0));
    this.final.elemedph = this.final.elemdph * (1 + 0.01 * (this.edmg || 0));

    if (!minimal) {
      this.ms = Math.min(25, this.ms || 0);
      this.addAbsolute("ms", "extrams");
      this.mf = Math.min(300, this.mf || 0);

      this.info["dpsper" + this.primary] = this.info.elementaldps / (1 + 0.01 * this[this.primary]);
      this.info.dpsperchc = this.info.elementaldps * 0.0001 * this.chd / this.info.critfactor;
      this.info.dpsperchd = this.info.elementaldps * 0.0001 * this.chc / this.info.critfactor;
      this.info.dpsperias = this.info.elementaldps * 0.01 / (1 + 0.01 * this.ias);
      this.info.dpsperelem = this.info.elementaldps * 0.01 / (1 + 0.01 * this.info.elemental);

      this.info["dpsper650" + this.primary] = 100 * this.info["dpsper" + this.primary] * 6.50 / this.info.elementaldps;
      this.info.dpsper6chc = 100 * this.info.dpsperchc * 6 / this.info.elementaldps;
      this.info.dpsper50chd = 100 * this.info.dpsperchd * 50 / this.info.elementaldps;
      this.info.dpsper7ias = 100 * this.info.dpsperias * 7 / this.info.elementaldps;
      this.info.dpsper20elem = 100 * this.info.dpsperelem * 20 / this.info.elementaldps;

      var mhbase = (this.info.mainhand.wpnbase.min + this.info.mainhand.wpnbase.max) * 0.5;
      if (this.info.offhand) {
        var mhdph = this.info.mainhand.dph;
        var ohdph = this.info.offhand.dph;
        var ohbase = (this.info.offhand.wpnbase.min + this.info.offhand.wpnbase.max) * 0.5;
        this.info.dpsperdmg = this.info.elementaldps * (mhdph / mhbase + ohdph / ohbase) / (mhdph + ohdph);
      } else {
        this.info.dpsperdmg = this.info.elementaldps / mhbase;
      }

      this.info.dpsper105210dmg = 100 * this.info.dpsperdmg * (105 + 210) / 2 / this.info.elementaldps;
    }

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
      this.addPercent("lifefury", "lpfs_percent");
      this.addAbsolute("rcr_fury", "rcr");
      break;
    case "monk":
      this.addPercent("spiritregen", "resourcegen");
      this.addAbsolute("rcr_spirit", "rcr");
      break;
    case "crusader":
      this.addPercent("wrathregen", "resourcegen");
      this.addAbsolute("rcr_wrath", "rcr");
      break;
    case "necromancer":
      this.addPercent("maxessence", "maxessence_percent");
      this.addPercent("essenceregen", "resourcegen");
      this.addAbsolute("rcr_essence", "rcr");
      break;
    }
  };

  Stats.prototype.clone = function() {
    var res = new Stats(this.charClass);
    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        var val = this[key];
        if (val == null) {
        } else if (val instanceof Array) {
          res[key] = $.extend(true, [], val);
        } else if (val instanceof Object) {
          res[key] = $.extend(true, {}, val);
        } else if (val !== undefined) {
          res[key] = val;
        }
      }
    }
    return res;
  };

  Stats.prototype.flatten = function() {
    delete this.sources;
    //delete this.affixes;
    var special = {};
    for (var type in this.special) {
      var repl = [];
      for (var src in this.special[type]) {
        repl = repl.concat(this.special[type][src]);
      }
      special[type] = repl;
    }
    this.special = special;
  };
  
  var statCache = null;
  var finCache = null;
  function invalidate() {
    statCache = null;
    DC.trigger("updateStats");
  }
  function computeStats(getSlot, saveCache) {
    var stats = new Stats();
    if (saveCache) {
      statCache = stats;
    }
    stats.loadItems(getSlot);
    if (DC.addSkillBonuses) {
      DC.addSkillBonuses(stats);
    }
    stats.finalize();
    finCache = stats;
    return stats;
  }
  DC.getStats = function(complete) {
    if (complete && finCache) {
      return finCache;
    }
    if (statCache) {
      return statCache;
    }
    computeStats(undefined, true);
    computeStats(undefined, true);
    return statCache;
  };

  DC.computeStats = computeStats;
  DC.register("updateSlotStats", invalidate);
  DC.register("updateParagon", invalidate);
  DC.register("updateSkills", invalidate);
  DC.register("importEnd", invalidate);
  DC.register("updateSlotItem", function() {
    statCache = null;
  });
  DC.Stats = Stats;
})();

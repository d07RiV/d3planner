(function() {
  DiabloCalc.slotMap = {
    "mainHand": "mainhand",
    "offHand": "offhand",
    "leftFinger": "leftfinger",
    "rightFinger": "rightfinger",
    "bracers": "wrists",
    "special": "follower",
  };
  DiabloCalc.typeMap = {
    "legs": "pants",
    "ceremonialdagger": "ceremonialknife",
    "flail1H": "flail",
    "mightyweapon1h": "mightyweapon",
    "combatstaff": "daibo",
    "handxbow": "handcrossbow",
    "genericbelt": "belt",
    "belt_barbarian": "mightybelt",
    "orb": "source",
  };
  DiabloCalc.classMap = {
    "witch-doctor": "witchdoctor",
    "demon-hunter": "demonhunter",
  };
  DiabloCalc.parseItemData = function(data, charClass) {
    if (!data.type) {
      return;
    }

    var result = {
      id: data.id,
      stats: {},
    };
    if (data.transmog) {
      result.transmog = data.transmog.id;
    }
    if (data.dye) {
      result.dye = data.dye.id;
    }
    if (!DiabloCalc.itemById[data.id]) {
      var typeid = data.type.id.toLowerCase();
      typeid = (DiabloCalc.typeMap[typeid] || typeid);
      typeid = typeid.replace(/(generic|_.*)/g, "");
      typeid = (DiabloCalc.typeMap[typeid] || typeid);
      if (DiabloCalc.itemTypes[typeid]) {
        result.id = DiabloCalc.itemTypes[typeid].generic;
      }
    }
    //if (data.attributesRaw.Ancient_Rank && data.attributesRaw.Ancient_Rank.max) {
    //  result.ancient = (data.attributesRaw.Ancient_Rank.max === 2.0 ? "primal" : true);
    //}
    if (data.typeName.indexOf("Primal Ancient") >= 0) {
      result.ancient = "primal";
    } else if (data.typeName.indexOf("Ancient") >= 0) {
      result.ancient = true;
    }
    function _parse(str) {
      var res = parseFloat(str.replace(/,/g, ""));
      if (isNaN(res)) return 0;
      return res;
    }

    var item = DiabloCalc.itemById[result.id];

    var customStat;
    var itemRequired = {};
    if (item) {
      itemRequired = DiabloCalc.getItemAffixesById(result.id, result.ancient, "only") || {};
      if (itemRequired.custom) {
        customStat = $.extend({}, itemRequired.custom);
        if (customStat.args === undefined) {
          customStat.args = 1;
        }
      }
    }
    function parseAttribute(text) {
      function testStat(stat) {
        if (stat.base) return null;
        if (stat.caldesanns) return null;
        if (!stat.regex) {
          stat.regex = DiabloCalc.getStatRegex(stat);
        }
        var result = stat.regex.exec(text);
        if (!result) {
          if (stat.altformat) {
            if (!stat.altregex) {
              stat.altregex = DiabloCalc.getStatRegex(stat, stat.altformat);
            }
            result = stat.altregex.exec(text);
          }
          if (!result) return null;
        }
        var out = [];
        for (var i = 0; i < stat.args; i++) {
          out.push(_parse(result[i + 1]));
        }
        if (stat.args < 0) {
          var passives = DiabloCalc.allPassives;
          for (var id in passives) {
            if (result[1] == passives[id].origname) {
              out.push(id);
              break;
            }
          }
        }
        return out;
      }
      text = text.trim().replace(/\u2013|\u2014/g, "-");
      for (var stat in DiabloCalc.stats) {
        var tmp = testStat(DiabloCalc.stats[stat]);
        if (tmp) {
          result.stats[stat] = tmp;
          return stat;
        }
      }
      if (customStat) {
        var tmp = testStat(customStat);
        if (tmp) {
          result.stats.custom = tmp;
          return "custom";
        }
      }
    }

    if (data.attributes) {
      for (var type in data.attributes) {
        for (var i = 0; i < data.attributes[type].length; ++i) {
          var attr = parseAttribute(data.attributes[type][i]);
          if (data.attributesHtml && data.attributesHtml[type] && data.attributesHtml[type][i] && data.attributesHtml[type][i].indexOf("tooltip-icon-enchant") >= 0) {
            result.enchant = attr;
          }
        }
      }
    }
    result.gems = [];
    if (data.gems) {
      for (var i = 0; i < data.gems.length; ++i) {
        var gem = data.gems[i];
        if (gem.isGem || gem.isJewel) {
          var info = DiabloCalc.gemById[gem.item.id];
          if (info && gem.isJewel) {
            info[1] = gem.jewelRank;
          }
          if (info) {
            result.gems.push(info);
          }
        }
      }
      result.stats.sockets = [data.gems.length];
    }

    if (data.armor) {
      result.stats.basearmor = [Math.floor(data.armor)];
    } else if (itemRequired.basearmor) {
      result.stats.basearmor = [itemRequired.basearmor.max];
    }
    if (data.blockChance) {
      var bc = data.blockChance.match(/\+([\d,\.]+)% Chance to Block\n([\d,]+)-([\d,]+) Block Amount/);
      if (bc) {
        result.stats.blockamount = [_parse(bc[2]), _parse(bc[3])];
        result.stats.baseblock = [_parse(bc[1])];
        if (result.stats.block) result.stats.baseblock[0] -= result.stats.block[0];
      }
    } else if (itemRequired.blockamount && itemRequired.baseblock) {
      result.stats.blockamount = [itemRequired.blockamount.max, itemRequired.blockamount.max2];
      result.stats.blockamount = [itemRequired.baseblock.max];
    }
    //if (data.attributesRaw.Sockets) {
    //  result.stats.sockets = [data.attributesRaw.Sockets.max];
    //}
    //if (data.attributesRaw.ConsumableAddSockets) {
    //  result.stats.sockets = [data.attributesRaw.ConsumableAddSockets.max];
    //}
    //if (data.attributesRaw.Damage_Percent_Reduction_From_Ranged) {
    //  result.stats.rangedef = [data.attributesRaw.Damage_Percent_Reduction_From_Ranged.max * 100];
    //}
    if (data.augmentation) {
      var augs = {
        "caldesanns_vit": /\+(\d+) Vitality/,
        "caldesanns_dex": /\+(\d+) Dexterity/,
        "caldesanns_str": /\+(\d+) Strength/,
        "caldesanns_int": /\+(\d+) Intelligence/,
      };
      for (var type in augs) {
        var m = data.augmentation.match(augs[type]);
        if (m) {
          result.stats[type] = [_parse(m[1])];
        }
      }
    }

    result.imported = {
      enchant: result.enchant,
      stats: $.extend(true, {}, result.stats),
    };
    
    return result;
  };
})();

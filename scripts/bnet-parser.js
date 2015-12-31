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
    function buildRegEx(format, cls) {
      if (cls) {
        format += " (" + DiabloCalc.classes[cls].name + " Only)";
      }
      format = format.replace(/(%d|%.[0-9]f)/g, "@");
      format = format.replace(/%p/g, "#");
      format = format.replace(/%%/g, "%");
      format = format.replace(/[$-.]|[[-^]|[?|{}]/g, "\\$&");
      format = format.replace(/@/g, "([0-9]+(?:\\.[0-9]+)?)");
      format = format.replace(/#/g, "(.+)");
      return new RegExp("^" + format + "$", "i");
    }

    if (!data.type) {
      return;
    }

    var result = {
      id: data.id,
      stats: {},
    };
    if (data.transmogItem) {
      result.transmog = data.transmogItem.id;
    }
    if (data.dyeColor && data.dyeColor.item) {
      result.dye = data.dyeColor.item.id;
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
    if (data.attributesRaw.Ancient_Rank && data.attributesRaw.Ancient_Rank.max) {
      result.ancient = true;
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
          stat.regex = buildRegEx(stat.format, stat.class);
        }
        var result = text.match(stat.regex);
        if (!result) {
          if (stat.altformat) {
            if (!stat.altregex) {
              stat.altregex = buildRegEx(stat.altformat, stat.class);
            }
            result = text.match(stat.altregex);
          }
          if (!result) return null;
        }
        var out = [];
        for (var i = 0; i < stat.args; i++) {
          out.push(parseFloat(result[i + 1]));
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
          var attr = parseAttribute(data.attributes[type][i].text);
          if (attr && data.attributes[type][i].affixType === "enchant") {
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
    }
    if (data.attributesRaw.Armor_Item) {
      result.stats.basearmor = [Math.floor(data.attributesRaw.Armor_Item.max)];
    } else if (itemRequired.basearmor) {
      result.stats.basearmor = [itemRequired.basearmor.max];
    }
    if (data.attributesRaw.Block_Amount_Item_Min && data.attributesRaw.Block_Amount_Item_Delta) {
      result.stats.blockamount = [data.attributesRaw.Block_Amount_Item_Min.max,
        data.attributesRaw.Block_Amount_Item_Min.max + data.attributesRaw.Block_Amount_Item_Delta.max];
    } else if (itemRequired.blockamount) {
      result.stats.blockamount = [itemRequired.blockamount.max, itemRequired.blockamount.max2];
    }
    if (data.attributesRaw.Block_Chance_Item) {
      result.stats.baseblock = [data.attributesRaw.Block_Chance_Item.max * 100];
    } else if (itemRequired.baseblock) {
      result.stats.blockamount = [itemRequired.baseblock.max];
    }
    if (data.attributesRaw.Sockets) {
      result.stats.sockets = [data.attributesRaw.Sockets.max];
    }
    if (data.attributesRaw.ConsumableAddSockets) {
      result.stats.sockets = [data.attributesRaw.ConsumableAddSockets.max];
    }
    if (data.attributesRaw.Damage_Percent_Reduction_From_Ranged) {
      result.stats.rangedef = [data.attributesRaw.Damage_Percent_Reduction_From_Ranged.max * 100];
    }
    
    return result;
  };
})();

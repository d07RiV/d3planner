(function() {
  var DC = DiabloCalc;

  DC.Optimizer = {
    perfection: 1,
    useGift: true,
  };

  function getValue(range) {
    var res = [];
    if (range.max) {
      var from = range.min, to = range.max;
      if (range.best === "min") {
        from = range.max;
        to = range.min;
      }
      var num = Math.round((from + (to - from) * DC.Optimizer.perfection) / (range.step || 1)) * (range.step || 1);
      if (num < range.min) num = range.min;
      if (num > range.max) num = range.max;
      val.push(num);
    }
    if (range.max2) {
      var num = Math.round(range.min2 + (range.max2 - range.min2) * DC.Optimizer.perfection);
      if (num < range.min2) num = range.min2;
      if (num > range.max2) num = range.max2;
      val.push(num);
    }
    if (range.args < 0) {
      for (var id in DC.passives[DC.charClass]) {
        val.push(id);
        break;
      }
    }
    return val;
  }

  function getItem(slot) {
    var item = DC.itemSlots[slot].item;
    if (!item) return;
    item = $.extend(true, {}, item);
    item.info = DC.itemById[item.id];

    function _stats(affixes) {
      var res = {};
      for (var id in affixes) {
        var stat = DC.stats[stat];
        if (stat && stat.classes && stat.classes.indexOf(DC.charClass) < 0) continue;
        res[id] = getValue(affixes[id]);
      }
      return res;
    }

    var counts = DC.getStatCount(item.id);
    item.affixes = {
      primary: counts,
      secondary: counts,
      all: _stats(DC.getItemAffixesById(item.id, item.ancient, false)),
      required: _stats(DC.getItemAffixesById(item.id, item.ancient, "only")),
    };

    item.state = {
      primary: 0,
      secondary: 0,
      groups: {},
    };
  }




























})();
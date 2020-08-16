(function() {
  var order = [
    "/scripts/data/item_icons.js?1592722776621",
  ];
  
  var loadIdx = 0;
  function doLoad() {
    if (loadIdx >= order.length) {
      
    } else {
      var path = order[loadIdx++];
      DC_getScript(path, doLoad);
    }
  }
  doLoad();
})();
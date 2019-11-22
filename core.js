(function() {
  var order = [
    "/scripts/common.js?1564430867435",
    "/scripts/bnet-parser.js?1236911196000",
    "/scripts/bnet-tooltips.js?1559198313490",
    "/scripts/stats.js?1566590108627",
    "/scripts/itembox.js?1557619240641",
    "/scripts/skilldata.js?1236911196000",
    "/scripts/skillbox.js?1236911196000",
    "/scripts/account.js?1236911196000",
    "/scripts/optimizer.js?1566206865089",
    "/scripts/ui-paperdoll.js?1236911196000",
    "/scripts/ui-equipment.js?1542886521764",
    "/scripts/ui-import.js?1564428331072",
    "/scripts/ui-paragon.js?1236911196000",
    "/scripts/ui-stats.js?1236911196000",
    "/scripts/ui-skills.js?1566478910809",
    "/scripts/ui-timeline.js?1566479625178",
    "/scripts/ui-simulator.js?1566480499272",
    "/scripts/d3gl_physics.js?1236911196000",
    "/scripts/d3gl.js?1564432811337",
  ];
  
  var loadIdx = 0;
  function doLoad() {
    if (loadIdx >= order.length) {
      DiabloCalc.onLoaded();
    } else {
      var path = order[loadIdx++];
      DC_getScript(path, doLoad);
    }
  }
  doLoad();
})();
(function() {
  var order = [
    "/scripts/common.js?1574423440760",
    "/scripts/bnet-parser.js?1236911196000",
    "/scripts/bnet-tooltips.js?1585832460629",
    "/scripts/stats.js?1574423440843",
    "/scripts/itembox.js?1585832484872",
    "/scripts/skilldata.js?1574427744830",
    "/scripts/skillbox.js?1581106308249",
    "/scripts/account.js?1596621450074",
    "/scripts/optimizer.js?1574423440841",
    "/scripts/ui-paperdoll.js?1585832491725",
    "/scripts/ui-equipment.js?1596631717484",
    "/scripts/ui-import.js?1596635240987",
    "/scripts/ui-paragon.js?1236911196000",
    "/scripts/ui-stats.js?1236911196000",
    "/scripts/ui-skills.js?1596631814993",
    "/scripts/ui-timeline.js?1581105690224",
    "/scripts/ui-buildinfo.js?1596634718589",
    "/scripts/d3gl_physics.js?1236911196000",
    "/scripts/d3gl.js?1574423440761",
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
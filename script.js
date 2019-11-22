(function() {
  var order = [
    "/external/jquery-2.0.3.js?1236911224000",
    "/external/jquery-ui.js?1236911224000",
    "/external/spin.min.js?1236911224000",
    "/external/jquery.cookie.js?1236911224000",
    "/external/chosen.jquery.js?1236911224000",
    "/external/Chart.js?1236911224000",
    "/external/jquery.mousewheel.js?1236911224000",
    "/external/mwheelIntent.js?1236911224000",
    "/external/md5.js?1236911224000",
    "/external/canvasjs.js?1236911224000",
    "/external/jquery.ui.touch-punch.js?1574423440731",
    "/external/gl-matrix.js?1236911224000",
    "/scripts/main.js?1574423440839",
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
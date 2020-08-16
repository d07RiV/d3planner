(function() {
  var order = [
    "/scripts/data/buffs.js?1592724200715",
    "/scripts/data/classes.js?1236911196000",
    "/scripts/data/gems.js?1574423440770",
    "/scripts/data/itemsets.js?1592720939627",
    "/scripts/data/item_cache.js?1236911196000",
    "/scripts/data/item_classes.js?1592722080740",
    "/scripts/data/item_feet.js?1592719712256",
    "/scripts/data/item_finger.js?1592720575995",
    "/scripts/data/item_follower.js?1236911196000",
    "/scripts/data/item_hands.js?1592720134491",
    "/scripts/data/item_head.js?1592720212515",
    "/scripts/data/item_icons.js?1592722776621",
    "/scripts/data/item_legs.js?1592719615132",
    "/scripts/data/item_neck.js?1592719995341",
    "/scripts/data/item_offhand.js?1592723897110",
    "/scripts/data/item_onehand.js?1583485565568",
    "/scripts/data/item_ranged.js?1592720296932",
    "/scripts/data/item_shoulders.js?1592720364375",
    "/scripts/data/item_special.js?1592726143190",
    "/scripts/data/item_torso.js?1592721374284",
    "/scripts/data/item_twohand.js?1583485565605",
    "/scripts/data/item_waist.js?1592720107859",
    "/scripts/data/item_wrists.js?1592720396084",
    "/scripts/data/simbuffs.js?1236911196000",
    "/scripts/data/skilltip_barbarian.js?1592721987285",
    "/scripts/data/skilltip_crusader.js?1592721987503",
    "/scripts/data/skilltip_demonhunter.js?1592721987234",
    "/scripts/data/skilltip_monk.js?1592721987440",
    "/scripts/data/skilltip_necromancer.js?1592721987551",
    "/scripts/data/skilltip_witchdoctor.js?1592721987395",
    "/scripts/data/skilltip_wizard.js?1592721987346",
    "/scripts/data/skill_barbarian.js?1583485565658",
    "/scripts/data/skill_crusader.js?1574423440812",
    "/scripts/data/skill_demonhunter.js?1592726054574",
    "/scripts/data/skill_monk.js?1574423440814",
    "/scripts/data/skill_necromancer.js?1592728053892",
    "/scripts/data/skill_witchdoctor.js?1583485565660",
    "/scripts/data/skill_wizard.js?1583485565677",
    "/scripts/data/slots.js?1236911196000",
    "/scripts/data/stats.js?1236911196000",
    "/scripts/d3gl_data.js?1592723626922",
  ];
  
  var loadIdx = 0;
  function doLoad() {
    if (loadIdx >= order.length) {
      DiabloCalc.onDataLoaded();
    } else {
      var path = order[loadIdx++];
      DC_getScript(path, doLoad);
    }
  }
  doLoad();
})();
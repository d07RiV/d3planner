(function() {
  var order = [
    "/scripts/data/buffs.js?1236911196000",
    "/scripts/data/classes.js?1236911196000",
    "/scripts/data/gems.js?1564431274093",
    "/scripts/data/itemsets.js?1573641999914",
    "/scripts/data/item_cache.js?1236911196000",
    "/scripts/data/item_classes.js?1573646851054",
    "/scripts/data/item_feet.js?1573642616725",
    "/scripts/data/item_finger.js?1236911196000",
    "/scripts/data/item_follower.js?1236911196000",
    "/scripts/data/item_hands.js?1573640645437",
    "/scripts/data/item_head.js?1573640085658",
    "/scripts/data/item_icons.js?1573646877601",
    "/scripts/data/item_legs.js?1573641122494",
    "/scripts/data/item_neck.js?1566476078094",
    "/scripts/data/item_offhand.js?1574422242301",
    "/scripts/data/item_onehand.js?1573642727861",
    "/scripts/data/item_ranged.js?1557615657820",
    "/scripts/data/item_shoulders.js?1573642475091",
    "/scripts/data/item_special.js?1574422263159",
    "/scripts/data/item_torso.js?1573640709348",
    "/scripts/data/item_twohand.js?1564430038607",
    "/scripts/data/item_waist.js?1574422207758",
    "/scripts/data/item_wrists.js?1573639591427",
    "/scripts/data/simbuffs.js?1236911196000",
    "/scripts/data/skilltip_barbarian.js?1236911196000",
    "/scripts/data/skilltip_crusader.js?1236911196000",
    "/scripts/data/skilltip_demonhunter.js?1236911196000",
    "/scripts/data/skilltip_monk.js?1236911196000",
    "/scripts/data/skilltip_necromancer.js?1236911196000",
    "/scripts/data/skilltip_witchdoctor.js?1236911196000",
    "/scripts/data/skilltip_wizard.js?1236911196000",
    "/scripts/data/skill_barbarian.js?1573642288875",
    "/scripts/data/skill_crusader.js?1566479792798",
    "/scripts/data/skill_demonhunter.js?1558005726976",
    "/scripts/data/skill_monk.js?1573643200066",
    "/scripts/data/skill_necromancer.js?1573639724127",
    "/scripts/data/skill_witchdoctor.js?1566480305913",
    "/scripts/data/skill_wizard.js?1562094160130",
    "/scripts/data/slots.js?1236911196000",
    "/scripts/data/stats.js?1236911196000",
    "/scripts/d3gl_data.js?1573646835958",
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
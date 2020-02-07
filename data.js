(function() {
  var order = [
    "/scripts/data/buffs.js?1236911196000",
    "/scripts/data/classes.js?1236911196000",
    "/scripts/data/gems.js?1574423440770",
    "/scripts/data/itemsets.js?1574423440808",
    "/scripts/data/item_cache.js?1236911196000",
    "/scripts/data/item_classes.js?1574423440772",
    "/scripts/data/item_feet.js?1574423440775",
    "/scripts/data/item_finger.js?1236911196000",
    "/scripts/data/item_follower.js?1236911196000",
    "/scripts/data/item_hands.js?1574423440777",
    "/scripts/data/item_head.js?1574423440779",
    "/scripts/data/item_icons.js?1574423440784",
    "/scripts/data/item_legs.js?1574423440786",
    "/scripts/data/item_neck.js?1574423440789",
    "/scripts/data/item_offhand.js?1574423440791",
    "/scripts/data/item_onehand.js?1574423440793",
    "/scripts/data/item_ranged.js?1557615657820",
    "/scripts/data/item_shoulders.js?1574423440796",
    "/scripts/data/item_special.js?1574426362994",
    "/scripts/data/item_torso.js?1574423440800",
    "/scripts/data/item_twohand.js?1574423440802",
    "/scripts/data/item_waist.js?1574423440805",
    "/scripts/data/item_wrists.js?1574423440806",
    "/scripts/data/simbuffs.js?1236911196000",
    "/scripts/data/skilltip_barbarian.js?1236911196000",
    "/scripts/data/skilltip_crusader.js?1236911196000",
    "/scripts/data/skilltip_demonhunter.js?1236911196000",
    "/scripts/data/skilltip_monk.js?1236911196000",
    "/scripts/data/skilltip_necromancer.js?1236911196000",
    "/scripts/data/skilltip_witchdoctor.js?1236911196000",
    "/scripts/data/skilltip_wizard.js?1236911196000",
    "/scripts/data/skill_barbarian.js?1574423440810",
    "/scripts/data/skill_crusader.js?1574423440812",
    "/scripts/data/skill_demonhunter.js?1558005726976",
    "/scripts/data/skill_monk.js?1574423440814",
    "/scripts/data/skill_necromancer.js?1574423440817",
    "/scripts/data/skill_witchdoctor.js?1574423440819",
    "/scripts/data/skill_wizard.js?1574427238878",
    "/scripts/data/slots.js?1236911196000",
    "/scripts/data/stats.js?1236911196000",
    "/scripts/d3gl_data.js?1574423440765",
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
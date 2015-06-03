(function() {
  var Sim = Simulator;
  var affixes = Sim.affixes;

/*
danetta: built in vault
bulkathos: built in WW
nightmares: todo
manajuma: todo
shenlong: todo
asheara's: todo

natalya
shadow: built in shadow power
marauder: ./.
unhallowed

zunimassa
helltooth: ???
jadeharvester

immortalking
earth
raekor
wastes

inna
sunwuko
storms

akkhan
roland
*/

  affixes.set_bastionsofwill_2pc = function() {
    Sim.register("onhit", function(data) {
      if (data.castInfo && !data.castInfo.pet &&
          data.castInfo.user && !data.castInfo.user.bastionsofwill) {
        if (data.castInfo.cost) {
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("restraint", {dmgmul: 50}, {duration: 300});
        } else if (data.castInfo.generate !== undefined) {
          data.castInfo.user.bastionsofwill = true;
          Sim.addBuff("focus", {dmgmul: 50}, {duration: 300});
        }
      }
    });
  };

  affixes.set_istvan_2pc = function() {
    Sim.register("oncast", function(data) {
      if (data.cost && data.resource !== "disc") {
        Sim.addBuff("istvan", {ias: 6}, {duration: 5, maxstacks: 5});
      }
    });
  };

  affixes.set_talrasha_2pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_2pc_fire", "col": "tal_2pc_cold", "arc": "tal_2pc_arcane", "lit": "tal_2pc_lightning"};
    var runes = {"fir": "a", "col": "c", "arc": "d", "lit": "e"};
    Sim.register("onhit", function(data) {
      if (data.elem && elems[data.elem]) {
        if (!Sim.getBuff(elems[data.elem])) {
          Sim.addBuff(elems[data.elem], undefined, {duration: 480});
          Sim.cast("meteor", runes[data.elem]);
        }
      }
    });
  };

  affixes.set_talrasha_6pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    var elems = {"fir": "tal_6pc_fire", "col": "tal_6pc_cold", "arc": "tal_6pc_arcane", "lit": "tal_6pc_lightning"};
    Sim.register("oncast", function(data) {
      if (data.offensive && data.elem && elems[data.elem]) {
        if (!Sim.getBuff(elems[data.elem])) {
          Sim.addBuff(elems[data.elem], undefined, {duration: 360});
          for (var id in elems) {
            Sim.refreshBuff(elems[id], 360);
          }
          Sim.addBuff("tal_6pc", {dmgmul: 150}, {maxstacks: 4, duration: 360});
        }
      }
    });
  };

  affixes.set_firebird_4pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    Sim.register("onhit", function(data) {
      if (data.elem === "fir" && data.triggered !== "set_firebird_4pc" && data.castInfo && data.castInfo.user) {
        var counter = data.castInfo.user.firebird_4pc;
        if (!counter || counter < 3) {
          Sim.damage({type: "area", range: 10, elem: "fir", coeff: 4, count: Math.min(3 - (counter || 0), data.targets)});
          data.castInfo.user.firebird_4pc = Math.min(3, (counter || 0) + data.targets);
        }
      }
    });
  };

  affixes.set_firebird_6pc = function() {
    if (Sim.stats.charClass !== "wizard") return;
    function fb_ontick(data) {
      Sim.damage({targets: data.targets, elem: "fir", coeff: data.coeff / 4});
    }
    function fb_onapply(data) {
      if (data.coeff >= 30) {
        Sim.refreshBuff("firebird_6pc", "infinite");
      }
    }
    function fb_onrefresh(data, newdata) {
      data.coeff = Math.min(30, data.coeff + newdata.coeff);
      data.targets = Math.max(data.targets, Math.ceil(newdata.targets));
      fb_onapply(data);
    }
    Sim.register("onhit", function(data) {
      if (data.elem === "fir" && data.triggered !== "set_firebird_6pc") {
        var coeff = data.damage / Sim.stats.info.mainhand.wpnphy.max / Sim.stats.info.critfactor /
          (1 + 0.01 * (Sim.stats.dmgfir || 0)) / 3.03;
        Sim.addBuff("firebird_6pc", undefined, {data: {coeff: coeff, targets: data.targets},
          duration: 180, tickrate: 15, onapply: fb_onapply, onrefresh: fb_onrefresh, ontick: fb_ontick});
      }
    });
  };

  affixes.set_magnumopus_2pc = function() {
    var skills = ["arcaneorb", "energytwiser", "magicmissile", "shockpulse"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        if (Sim.getCooldown("slowtime")) {
          Sim.cooldowns.slowtime -= 120;
        }
      }
    });
  };

  affixes.set_magnumopus_6pc = function() {
    var skills = ["arcaneorb", "energytwiser", "magicmissile", "shockpulse"];
    Sim.register("oncast", function(data) {
      if (skills.indexOf(data.skill) >= 0) {
        if (Sim.getBuff("slowtime")) {
          return {percent: 750};
        }
      }
    });
  };

})();
(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  function PrimaryGenerate(rune) {
    return 5 + (Sim.stats.passives.righteousness ? 3 : 0);
  }
  function PrimarySpeed(rune, aps) {
    return aps * (Sim.stats.passives.fanaticism ? 1.15 : 1);
  }
  function PrimarySpeedInvoker(rune, aps) {
    return aps * (Sim.stats.passives.fanaticism ? 1.15 : 1) * (Sim.stats.set_invoker_6pc ? 1.5 : 1);
  }

  skills.punish = {
    signature: true,
    offensive: true,
    frames: 57.777767,
    generate: PrimaryGenerate,
    speed: PrimarySpeedInvoker,
    oncast: function(rune) {
      Sim.addBuff("hardenedsenses", {block: 15}, {duration: 300});
      return {coeff: 3.35};
    },
    oninit: function(rune) {
      Sim.register("onblock", function() {
        if (!Sim.getBuff("hardenedsenses")) return;
        if (rune === "d" || Sim.stats.leg_angelhairbraid) {
          Sim.damage({type: "area", self: true, coeff: 0.75});
        }
        if (rune === "b" || Sim.stats.leg_angelhairbraid) {
          Sim.addBuff("celerity", {ias: 15}, {duration: 180});
        }
        if (rune === "c" || Sim.stats.leg_angelhairbraid) {
          Sim.addBuff("rebirth", {regen: 12874}, {duration: 120});
        }
        if (rune === "a" || Sim.stats.leg_angelhairbraid) {
          Sim.damage({coeff: 1.4});
        }
        if (rune === "e" || Sim.stats.leg_angelhairbraid) {
          Sim.addBuff("fury");
        }
      });
      if (rune === "e" || Sim.stats.leg_angelhairbraid) {
        Sim.register("oncast", function() {
          if (Sim.getBuff("fury")) {
            Sim.removeBuff("fury");
            return {chc: 15};
          }
        });
      }
    },
    proctable: 1,
    elem: {x: "phy", d: "fir", b: "phy", c: "phy", a: "hol", e: "lit"},
  };

  function slash_zeal_onhit(event) {
    Sim.addBuff("zeal", {ias: 1}, {duration: 180, maxstacks: 10, stacks: Sim.random("zeal", 1, event.targets, true)});
  }
  function slash_guard_onhit(event) {
    Sim.addBuff("guard", {armor_percent: 5}, {duration: 180, maxstacks: 10, stacks: Sim.random("guard", 1, event.targets, true)});
  }
  skills.slash = {
    signature: true,
    offensive: true,
    frames: 57.777767,
    generate: PrimaryGenerate,
    speed: PrimarySpeedInvoker,
    oncast: function(rune) {
      var dmg = {type: "cone", width: 40, range: 12, coeff: 2.3};
      switch (rune) {
      case "b": dmg.onhit = Sim.apply_effect("stunned", 120, 0.25); break;
      case "d": dmg.width = 120; break;
      case "c": dmg.chc = 20; break;
      case "a": dmg.onhit = slash_zeal_onhit; break;
      case "e": dmg.onhit = slash_guard_onhit; break;
      }
      if (Sim.stats.leg_omnislash) {
        dmg.type = "area";
        dmg.self = true;
        delete dmg.width;
      }
      return dmg;
    },
    proctable: {x: 0.8, b: 0.8, d: 0.54, c: 0.8, a: 0.61, e: 0.8},
    elem: {x: "fir", b: "lit", d: "fir", c: "fir", a: "hol", e: "fir"},
  };

  skills.smite = {
    signature: true,
    offensive: true,
    frames: 57.777767,
    generate: PrimaryGenerate,
    speed: PrimarySpeed,
    oncast: function(rune) {
      var primary = 1, secondary = 3;
      if (rune === "e") secondary += 2;
      if (Sim.stats.leg_goldenscourge) secondary += 3;
      secondary = Math.min(Sim.target.count - 1, secondary);
      if (Sim.stats.leg_armorofthekindregent && Sim.target.count > 1) {
        primary *= 2;
        secondary *= 2;
      }
      if (rune === "c") {
        Sim.damage({delay: 30, type: "area", range: 3, count: primary + secondary, coeff: 0.6});
      }
      var onhit;
      if (rune === "b") onhit = Sim.apply_effect("immobilized", 60, 0.2);
      if (rune === "d") {
        Sim.addBuff("reaping", {regen: 6437}, {duration: 120, maxstacks: 4, stacks: primary + secondary});
      }
      if (secondary) Sim.damage({delay: 6, count: secondary, coeff: 1.5, onhit: onhit});
      return {count: primary, coeff: 1.75, onhit: onhit};
    },
    proctable: 0.333,
    elem: {x: "hol", c: "hol", b: "hol", e: "hol", d: "hol", a: "lit"},
  };

  function justice_soj_onhit(event) {
    Sim.addBuff("swordofjustice", {extrams: 5}, {duration: 180, maxstacks: 3});
  }
  skills.justice = {
    signature: true,
    offensive: true,
    frames: 57.777767,
    generate: PrimaryGenerate,
    speed: PrimarySpeed,
    oncast: function(rune) {
      var dmg = {type: "line", speed: 1.5, coeff: 2.45};
      switch (rune) {
      case "d":
        dmg.area = 10;
        dmg.areacoeff = 0.6;
        dmg.onhit = Sim.apply_effect("stunned", 60, 0.2);
        break;
      case "b":
        dmg.targets = 3;
        break;
      case "c":
        dmg.coeff = 3.35;
        break;
      case "a":
        dmg.onhit = justice_soj_onhit;
        break;
      }
      return dmg;
    },
    proctable: {x: 1, d: 0.6, b: 0.7, c: 1, a: 1, e: 1},
    elem: {x: "hol", d: "lit", b: "hol", c: "phy", a: "phy", e: "hol"},
  };

  function bash_drakons_fix() {
    if (this.targets <= 3) {
      this.factor = 1 + 0.01 * (Sim.stats.leg_drakonslesson || Sim.stats.leg_drakonslesson_p2 || 0);
      var cost = Sim.castInfo().cost;
      if (cost) Sim.addResource(cost * 0.25);
    }
  }
  skills.shieldbash = {
    offensive: true,
    frames: 55.3846,
    cost: function(rune) {
      return 30 * (1 - 0.01 * (Sim.stats.leg_piromarella || 0));
    },
    oncast: function(rune) {
      var dmg = {type: "cone", range: 17, width: 30, coeff: 7 + 0.03 * (Sim.stats.block || 0)};
      switch (rune) {
      case "a":
        dmg.coeff = 8.75 + 0.03 * (Sim.stats.block || 0);
        break;
      case "b":
        dmg.coeff = 7.4 + 0.0335 * (Sim.stats.block || 0);
        dmg.range += 10;
        dmg.width += 30;
        break;
      case "e":
        dmg.onhit = Sim.apply_effect("stunned", 90);
        break;
      case "c":
        // wut?
        dmg.coeff += 1.55 + 0.01 * (Sim.stats.block || 0);
        break;
      case "d":
        dmg.coeff = 13.2 + 0.05 * (Sim.stats.block || 0);
        dmg.range = 8;
        dmg.width = 5;
        break;
      }
      if (Sim.stats.leg_drakonslesson || Sim.stats.leg_drakonslesson_p2) dmg.fix = bash_drakons_fix;
      return dmg;
    },
    proctable: {x: 0.59, b: 0.333, e: 0.333, c: 0.333, a: 0.333, d: 1},
    elem: {x: "hol", b: "hol", e: "lit", c: "phy", a: "fir", d: "phy"},
  };

  function sweep_onhit(data) {
    switch (data.castInfo.rune) {
    case "b":
      Sim.addBuff(undefined, undefined, {
        duration: 121,
        tickrate: 30,
        ontick: {coeff: 0.3, count: data.targets},
      });
      break;
    case "d":
      if (Sim.random("tripattack", 0.5, data.targets / Sim.target.count)) {
        Sim.addBuff("stunned", null, 120);
      }
      break;
    }
    if (Sim.stats.leg_goldenflense) {
      Sim.addResource(Sim.stats.leg_goldenflense * data.targets);
    }
    if (Sim.stats.leg_goldenflense_p2) {
      Sim.addResource(Sim.stats.leg_goldenflense_p2 * data.targets);
    }
    if (Sim.stats.leg_denial) {
      Sim.addBuff("denial", undefined, {maxstacks: 5, stacks: Sim.random("denial", 1, data.targets, true)});
    }
  }
  skills.sweepattack = {
    offensive: true,
    frames: 57.777767,
    cost: 20,
    oncast: function(rune) {
      var dmg = {type: "cone", range: 18, width: 180, coeff: 4.8, onhit: sweep_onhit};
      var stacks = Sim.getBuff("denial");
      if (stacks && Sim.stats.leg_denial) {
        Sim.removeBuff("denial");
        dmg.coeff *= 1 + 0.01 * stacks * Sim.stats.leg_denial;
      }
      if (rune === "e") {
        Sim.addBuff("inspiringsweep", {armor_percent: 20}, {duration: 180, maxstacks: 100, refresh: false});
      }
      return dmg;
    },
    proctable: 0.25,
    elem: {x: "phy", b: "fir", d: "lit", c: "phy", a: "hol", e: "phy"},
  };

  function hammer_fix() {
    if (Sim.stats.leg_guardofjohanna) {
      this.factor = 1 + 0.01 * Sim.stats.leg_guardofjohanna * Math.min(3, this.targets) / this.targets;
    }
    if (Sim.stats.leg_gabrielsvambraces && this.targets <= 3) {
      var cost = Sim.castInfo().cost;
      if (cost) Sim.addResource(0.01 * cost * Sim.stats.leg_gabrielsvambraces);
    }
  }
  function hammer_bw_onhit(event) {
    var stacks = Math.min(4, Sim.random("burningwrath", 0.25, event.targets, true));
    Sim.addBuff("burningwrath", undefined, {
      maxstacks: 4,
      stacks: stacks,
      duration: 121,
      refresh: false,
      tickrate: 30,
      ontick: {type: "area", range: 8, coeff: 1.65, skill: "blessedhammer", elem: skills.blessedhammer.elem.a},
    });
  }
  function hammer_ts_ontick(data) {
    var angle = ((Sim.time - data.buff.start) * 6) % 360;
    var range = (Sim.time - data.buff.start) * 15 / 240 + 10;
    Sim.damage({type: "line", origin: (data.self ? Sim.target.distance : 0),
      range: range, angle: angle, coeff: 0.6, skill: "blessedhammer", elem: skills.blessedhammer.elem.b});
  }
  function hammer_ll_onhit(event) {
    if (Sim.random("limitless", 0.25, event.targets)) {
      Sim.cast_hammer(false, true);
    }
  }
  function hammer_ih_onhit(event) {
    var count = Sim.random("crushingblow", 0.35, event.targets, true);
    if (count) Sim.damage({type: "area", range: 6, coeff: 4.6,
      count: count, onhit: Sim.apply_effect("stunned", 60), skill: "blessedhammer", elem: skills.blessedhammer.elem.d});
  }
  Sim.cast_hammer = function(self, clone) {
    var rune = (Sim.stats.skills.blessedhammer || "x");
    var dmg = {type: "area", self: self, range: 25, coeff: 3.2, skill: "blessedhammer", elem: skills.blessedhammer.elem[rune]};
    switch (rune) {
    case "a": dmg.onhit = hammer_bw_onhit; break;
    case "b":
      Sim.addBuff(undefined, undefined, {
        duration: 241,
        tickrate: 30,
        ontick: hammer_ts_ontick,
        data: {self: self},
      });
      break;
    case "c":
      if (!clone) dmg.onhit = hammer_ll_onhit;
      break;
    case "d": dmg.onhit = hammer_ih_onhit; break;
    }
    if (Sim.stats.leg_guardofjohanna || Sim.stats.leg_gabrielsvambraces) {
      dmg.fix = hammer_fix;
    }
    Sim.damage(dmg);
  };

  skills.blessedhammer = {
    offensive: true,
    cost: 10,
    frames: 57.777767,
    speed: function(rune, aps) {
      return aps * 1.2 * (Sim.stats.leg_johannasargument ? 2 : 1);
    },
    oncast: function(rune) {
      Sim.cast_hammer(true);
    },
    proctable: 0.1,
    elem: {x: "hol", a: "fir", b: "lit", c: "hol", d: "phy", e: "hol"},
  };

  function bs_combust_onhit(event) {
    if (Sim.random("combust", 0.33)) {
      Sim.damage({type: "area", range: 10, coeff: 3.1});
    }
  }
  function bs_aegis_onhit(event) {
    Sim.addBuff("divineaegis", {armor_percent: 5, regen_bonus: 5}, {
      duration: 240,
      stacks: Sim.random("divineaegis", 1, event.targets, true),
    });
  }
  function bs_akkhans_fix() {
    this.factor = 1 + 0.01 * (Sim.stats.leg_akkhansmanacles || 0) / Math.min(this.targets, Sim.target.count);
  }
  skills.blessedshield = {
    offensive: true,
    frames: 58.06451,
    cost: function(rune) {
      return (Sim.stats.leg_gyrfalconsfoote ? 0 : 20);
    },
    oncast: function(rune) {
      var dmg = {delay: Math.floor(Sim.target.distance / 2), targets: 4, coeff: 4.3 + 0.025 * (Sim.stats.block || 0)};
      if (Sim.stats.leg_jekangbord) dmg.targets += Sim.stats.leg_jekangbord;
      switch (rune) {
      case "a": dmg.onhit = Sim.apply_effect("stunned", 120, 0.25); break;
      case "b": dmg.onhit = bs_combust_onhit; break;
      case "c":
        Sim.removeBuff("divineaegis");
        dmg.onhit = bs_aegis_onhit;
        break;
      case "d":
        dmg.targets = 1;
        Sim.damage({delay: dmg.delay, targets: Math.min(3 * (4 + (Sim.stats.leg_jekangbord || 0)), Sim.target.count - 1), coeff: 1.7});
        break;
      case "e":
        delete dmg.delay;
        delete dmg.targets;
        dmg.type = "line";
        dmg.pierce = true;
        dmg.speed = 2;
        dmg.onhit = Sim.apply_effect("knockback", 30, 0.5);
        break;
      }
      if (Sim.stats.leg_akkhansmanacles) dmg.fix = bs_akkhans_fix;
      return dmg;
    },
    proctable: {x: 0.333, a: 0.333, b: 0.333, c: 0.333, d: 0.1, e: 0.333},
    elem: {x: "hol", a: "lit", b: "fir", c: "phy", d: "hol", e: "hol"},
  };

  function foh_well_ontick(data) {
    var dist = 0.4 * (Sim.time - data.buff.start);
    var limit = Sim.target.radius + Sim.target.size;
    var count = 0;
    for (var i = 0; i < 6; ++i) {
      var angle = i * Math.PI / 3;
      var cdist = data.origin * data.origin + dist * dist - 2 * data.origin * dist * Math.cos(angle);
      if (cdist < limit * limit) {
        ++count;
      }
    }
    if (count) {
      Sim.damage({count: count, coeff: 0.4});
    }
  }
  function foh_fissure_ontick(data) {
    var count = Math.min(5, Sim.getBuff("fissure") - 1);
    Sim.damage({type: "area", origin: data.origin, range: 8, coeff: 0.41 + 0.675 * count});
  }
  function foh_cast(rune, origin) {
    var dmg = {type: "area", origin: origin, range: 8, coeff: 5.45};
    var secondary = {type: "line", origin: origin, pierce: true, skip: 7.2, coeff: 2.55};
    switch (rune) {
    case "d":
      Sim.addBuff(undefined, undefined, {
        duration: 180,
        tickrate: 60,
        tickinitial: 1,
        ontick: foh_well_ontick,
        data: {origin: origin},
      });
      break;
    case "a":
      Sim.addBuff("heavenstempest", undefined, {
        duration: 301,
        tickrate: 60,
        ontick: {type: "area", origin: origin, range: 8, coeff: 1},
      });
      break;
    case "c":
      Sim.addBuff("fissure", undefined, {
        maxstacks: 10,
        duration: 301,
        tickrate: 30,
        ontick: foh_fissure_ontick,
        data: {origin: origin},
        refresh: false,
      });
      break;
    case "b":
      dmg.onhit = Sim.apply_effect("slowed", 240);
      break;
    case "e":
      dmg.coeff = 4.35;
      secondary.coeff = 1.85;
      Sim.damage({type: "line", range: Sim.target.distance - origin, pierce: true, coeff: 2.7, speed: 1});
      break;
    }
    Sim.damage(dmg);
    for (var i = 0; i < 6; ++i) {
      Sim.damage(Sim.extend({angle: i * Math.PI / 3}, secondary));
    }
  }
  skills.fistoftheheavens = {
    offensive: true,
    frames: 58.181816,
    cost: 30,
    oncast: function(rune) {
      foh_cast(rune, 0);
      if (Sim.stats.leg_darklight && Sim.random("darklight", Sim.stats.leg_darklight * 0.01)) {
        foh_cast(rune, Sim.target.distance);
      }
    },
    proctable: 0.1,
    elem: {x: "lit", d: "hol", a: "fir", c: "lit", b: "lit", e: "hol"},
  };

  function glare_onhit(data) {
    switch (data.castInfo.rune) {
    case "a": Sim.addBuff("divineverdict", {dmgtaken: 20}, {duration: 240}); break;
    case "b": if (Sim.random("uncertainty", 0.5)) Sim.addBuff("charmed", undefined, {duration: 480}); break;
    case "d": Sim.addResource(9 * data.targets); break;
    case "c":
      if (Sim.targetHealth < 0.25) {
        var count = Sim.random("emblazonedshield", 0.5, data.targets, true);
        if (count) Sim.damage({type: "area", range: 8, coeff: 0.6, count: count});
      }
      break;
    case "e": Sim.addBuff("slowed", undefined, {duration: 360}); break;
    }
    if (Sim.stats.leg_flailoftheascended) {
      var stacks = Sim.getBuff("flailoftheascended");
      if (stacks) {
        var castInfo = Sim.extend({}, data.castInfo);
        castInfo.triggered = "shieldglare";
        castInfo.trigExplicit = true;
        Sim.pushCastInfo(castInfo);
        var dmg = skills.shieldbash.oncast(Sim.stats.skills.shieldbash || "x");
        dmg.coeff *= stacks;
        dmg.skill = "shieldbash";
        delete dmg.type;
        dmg.targets = data.targets;
        Sim.damage(dmg);
        Sim.popCastInfo();
        Sim.removeBuff("flailoftheascended");
      }
    }
    Sim.addBuff("blinded", undefined, {duration: 240});
  }
  skills.shieldglare = {
    offensive: true,
    frames: 57.49995,
    cooldown: function(rune) {
      return 12 * (Sim.stats.passives.toweringshield ? 0.7 : 1);
    },
    oncast: function(rune) {
      var dmg = {type: "cone", width: 120, range: 30, coeff: 0, onhit: glare_onhit};
      if (Sim.stats.leg_thefinalwitness) {
        delete dmg.width;
        dmg.type = "area";
        dmg.self = true;
      }
      return dmg;
    },
    proctable: 0.25,
    elem: {x: "hol", a: "hol", b: "hol", d: "hol", c: "phy", e: "hol"},
  };

  function ironskin_onexpire(data) {
    Sim.damage({type: "area", self: true, range: 12, coeff: 14});
  }
  skills.ironskin = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: 30,
    oncast: function(rune) {
      var params = {duration: 240};
      var buffs = {dmgred: 50};
      switch (rune) {
      case "d": buffs.thorns_percent = 300; break;
      case "b": params.duration = 420; break;
      case "c": params.onexpire = ironskin_onexpire; break;
      case "a":
        params.tickrate = 18;
        params.ontick = {type: "area", self: true, range: 10, coeff: 0, onhit: Sim.apply_effect("stunned", 120, 0.2)};
        break;
      }
      Sim.addBuff("ironskin", buffs, params);
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("ongethit", function() {
          if (Sim.getBuff("ironskin")) {
            Sim.addBuff("flash", {extrams: 60}, {duration: 300});
          }
        });
      }
    },
    proctable: {c: 0.1, a: 0.333},
    elem: {x: "phy", d: "phy", b: "phy", c: "phy", a: "lit", e: "lit"},
  };

  skills.consecration = {
    offensive: true,
    secondary: true,
    frames: 57.777767,
    cooldown: 30,
    oncast: function(rune) {
      var buffs = {regen: 32185};
      var params = {duration: 600};
      switch (rune) {
      case "c": buffs.regen = 48278; break;
      case "b":
        params.tickrate = 30;
        params.ontick = {type: "area", self: true, range: 20, coeff: 0.5, thorns: true};
        break;
      case "a": params.duration = 300; break;
      case "d":
        params.tickrate = 30;
        params.ontick = {type: "area", self: true, range: 20, coeff: 0.775};
        break;
      case "b":
        params.tickrate = 30;
        params.ontick = {type: "area", self: true, range: 20, coeff: 0, onhit: Sim.apply_effect("feared", 180)};
        break;
      }
      Sim.addBuff("consecration", buffs, params);
    },
    proctable: {b: 0.1, d: 0.1, e: 0.25},
    elem: {x: "hol", c: "hol", b: "phy", a: "hol", d: "fir", e: "hol"},
  };

  function judgment_onhit(data) {
    var duration = 360;
    switch (data.castInfo.rune) {
    case "a": Sim.addBuff("penitence", {regen: 2682}, {maxstacks: 999, refresh: false,
      stacks: Sim.random("penitence", 1, data.targets, true), duration: 180}); break;
    case "c": duration = 600; break;
    case "d": Sim.addBuff("resolved", {chctaken: 20}, {duration: 360}); break;
    }
    Sim.addBuff("immobilized", undefined, {duration: duration});
  }
  skills.judgment = {
    offensive: true,
    frames: 57.777767,
    cooldown: 20,
    oncast: function(rune) {
      return {type: "area", self: true, range: 20, coeff: 0, onhit: judgment_onhit};
    },
    elem: "phy",
  };

  function provoke_onhit(data) {
    Sim.addResource(5 * data.targets);
    var duration = (data.castInfo.rune === "b" ? 480 : 240);
    var buffs = {};
    if (Sim.stats.leg_votoyiasspiker) buffs.thorns_taken = 100;
    if (data.castInfo.rune === "e") buffs.block = 50;
    Sim.addBuff("provoke", buffs, {duration: duration});
    switch (data.castInfo.rune) {
    case "a": Sim.addBuff("cleanse", {lph: 1073}, {maxstacks: 999, refresh: false,
      stacks: Sim.random("cleanse", 1, data.targets, true), duration: 300}); break;
    case "b": Sim.addBuff("feared", undefined, {duration: 480}); break;
    case "c": Sim.addBuff("slowed", undefined, {duration: 240}); break;
    //case "d": Sim.addBuff("chargedup", undefined, {duration: 240}); break;
    //case "e": Sim.addBuff("hitme", {block: 50}, {duration: 240}); break;
    }
  }
  skills.provoke = {
    offensive: true,
    frames: 56.842068,
    cooldown: 20,
    generate: 30,
    oncast: function(rune) {
      return {type: "area", self: true, range: 15, coeff: 0, onhit: provoke_onhit};
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("onhit_proc", function(data) {
          if (Sim.getBuff("chargedup")) Sim.damage({count: data.proc * data.targets, coeff: 0.5});
        });
      }
    },
    elem: {x: "phy", a: "phy", b: "phy", c: "phy", d: "lit", e: "phy"},
  };

  skills.steedcharge = {
    offensive: true,
    secondary: true,
    frames: 60,
    cooldown: function(rune) {
      return 16 * (Sim.stats.passives.lordcommander ? 0.75 : 1);
    },
    oncast: function(rune) {
      var params = {duration: 120};
      switch (rune) {
      case "a":
        params.tickrate = 20;
        params.ontick = {type: "area", self: true, range: 6.5, coeff: 5/3, thorns: true};
        break;
      case "d":
        params.tickrate = 30;
        params.ontick = {type: "area", self: true, range: 6, coeff: 2.75};
        break;
      case "b":
        params.duration = 180;
        break;
      case "e":
        params.tickrate = 30;
        params.ontick = {targets: 5, coeff: 0.925};
        break;
      }
      if (Sim.stats.leg_swiftmount) params.duration *= 2;
      if (Sim.stats.set_norvald_2pc) {
        params.duration += 120;
        Sim.addBuff("norvald", {dmgmul: 100}, {duration: params.duration + 300});
      }
      Sim.addBuff("steedcharge", {extrams: 150}, params);
    },
    proctable: {x: 0.5, a: 0.1, d: 0.02, c: 0.5, b: 0.5, e: 0.04},
    elem: {x: "phy", a: "phy", d: "fir", c: "phy", b: "phy", e: "hol"},
  };

  function condemn_bop_onhit(data) {
    Sim.damage({type: "area", range: 15, coeff: 11.6, count: Math.min(2, data.targets)});
  }
  function condemn_retaliation_onhit(data) {
    if (Sim.stats.leg_bladeofprophecy) condemn_bop_onhit(data);
    Sim.reduceCooldown("condemn", 60 * data.targets);
  }
  skills.condemn = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: function(rune) {
      return (Sim.stats.leg_frydehrswrath ? 0 : 15);
    },
    cost: function(rune) {
      return (Sim.stats.leg_frydehrswrath ? 40 : 0);
    },
    oncast: function(rune) {
      var dmg = {delay: 180, type: "area", self: true, range: 15, coeff: 11.6};
      if (Sim.stats.leg_bladeofprophecy) {
        dmg.onhit = condemn_bop_onhit;
      }
      switch (rune) {
      case "e": delete dmg.delay; break;
      case "c": dmg.onhit = condemn_retaliation_onhit; break;
      case "d": dmg.range = 20; break;
      }
      return dmg;
    },
    proctable: {x: 0.833333, b: 0.5, e: 0.833333, c: 0.833333, d: 0.5, a: 0.833333},
    elem: {x: "hol", b: "hol", e: "hol", c: "hol", d: "phy", a: "fir"},
  };

  function phalanx_stampede_onhit(data) {
    Sim.addBuff("knockback", undefined, {duration: 30});
    if (Sim.random("stampede", 0.3, data.targets / Sim.target.count)) {
      Sim.addBuff("stunned", undefined, 120);
    }
  }
  skills.phalanx = {
    offensive: true,
    secondary: function(rune) {
      return rune === "a" || rune === "d" || rune === "e";
    },
    frames: 58.06451,
    cooldown: function(rune) {
      var base = 15 * (1 - 0.01 * (Sim.stats.leg_warhelmofkassar || 0));
      if (rune === "a" || rune === "d") return base;
      if (rune === "e") return base * 2;
    },
    cost: function(rune) {
      if (rune === "a" || rune === "d" || rune === "e") return 0;
      return 30;
    },
    pet: function(rune) {
      return (rune === "a" || rune === "e");
    },
    oncast: function(rune) {
      var dmg = {type: "line", pierce: true, range: 60, radius: 10, speed: 0.4, coeff: 4.9};
      if (Sim.stats.leg_unrelentingphalanx) {
        dmg.count = 2;
      }
      switch (rune) {
      case "a":
        Sim.removeBuff("phalanx");
        Sim.petattack("phalanx", undefined, {
          stacks: 4 * (Sim.stats.leg_unrelentingphalanx ? 2 : 1),
          duration: 300 * (Sim.stats.leg_eternalunion ? 3 : 1),
          refresh: false,
          tickrate: 50,
          speed: true,
          ontick: {type: "line", speed: 1, coeff: 1.8, pet: true},
        });
        return;
      case "b":
        dmg.coeff += 1.8;
        dmg.speed += 0.2;
        break;
      case "c":
        dmg.speed += 0.3;
        dmg.onhit = phalanx_stampede_onhit;
        break;
      case "d":
        dmg.type = "area";
        dmg.self = true;
        delete dmg.pierce;
        dmg.range = 10;
        delete dmg.radius;
        delete dmg.speed;
        break;
      case "e":
        Sim.removeBuff("phalanx");
        Sim.petattack("phalanx", undefined, {
          stacks: 2 * (Sim.stats.leg_unrelentingphalanx ? 2 : 1),
          duration: 600 * (Sim.stats.leg_eternalunion ? 3 : 1),
          refresh: false,
          tickrate: 58.064510,
          speed: true,
          ontick: {coeff: 5.6, pet: true},
        });
        return;
      }
      return dmg;
    },
    proctable: {x: 0.333, a: 0.0333, b: 0.333, c: 0.333, d: 0.333, e: 0.0333},
    elem: "phy",
  };

  skills.lawsofvalor = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: 30,
    oncast: function(rune) {
      var buffs = {ias: 7};
      switch (rune) {
      case "a": buffs.lph = 21457; break;
      case "b": Sim.damage({type: "area", self: true, range: 10, coeff: 0, onhit: Sim.apply_effect("stunned", 300)}); break;
      case "c": buffs.chd = 100; break;
      case "d": buffs.rcr_wrath = 50; break;
      }
      Sim.addBuff("lawsofvalor", buffs, {duration: 300 + (Sim.stats.passives.longarmofthelaw ? 300 : 0)});
    },
    oninit: function(rune) {
      Sim.addBaseStats({ias: 8});
    },
    proctable: 0.1,
    elem: "phy",
  };

  skills.lawsofjustice = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: 30,
    oncast: function(rune) {
      var buffs = {resall: 350};
      switch (rune) {
      case "b": buffs.armor = 7000; break;
      }
      Sim.addBuff("lawsofjustice", buffs, {duration: 300 + (Sim.stats.passives.longarmofthelaw ? 300 : 0)});
    },
    oninit: function(rune) {
      Sim.addBaseStats({resall: 140});
    },
    proctable: 0.1,
    elem: "phy",
  };

  function lawsofhope_hopefulcry_ontick(data) {
    var count = Sim.random("hopefulcry", 0.05, Sim.target.count, true);
    while (count--) Sim.trigger("onglobe");
  }
  skills.lawsofhope = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: 30,
    oncast: function(rune) {
      var buffs = {};
      var params = {duration: 300 + (Sim.stats.passives.longarmofthelaw ? 300 : 0)};
      switch (rune) {
      case "a": buffs.extrams = 50; break;
      case "b": buffs.life = 10; break;
      case "c":
        buffs.physdef = 25;
        //params.tickrate = 30;
        //params.ontick = lawsofhope_hopefulcry_ontick;
        break;
      case "d": buffs.lifewrath = 1073; break;
      case "e": buffs.nonphys = 25; break;
      }
      Sim.addBuff("lawsofhope", buffs, params);
    },
    oninit: function(rune) {
      Sim.addBaseStats({regen: 10728});
    },
    proctable: 0.1,
    elem: "phy",
  };

  function fs_superheated_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 361,
      tickrate: 18,
      ontick: {type: "area", self: true, range: 14, coeff: 0.93, proc: 0.00625},
    });
  }
  function fs_clouds_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 301,
      tickrate: 48,
      tickinitial: 12,
      ontick: {coeff: 6.05, proc: 0.08333, onhit: Sim.apply_effect("stunned", 120)},
    });
  }
  function fs_rise_onhit(data) {
    Sim.petattack(undefined, undefined, {
      stacks: 3,
      duration: 300,
      refresh: false,
      tickrate: 58.064510,
      speed: true,
      ontick: {coeff: 2.8, pet: true},
    });
  }
  function fs_rapid_onhit(data) {
    var cd = Sim.getCooldown("fallingsword");
    if (cd > 600) Sim.reduceCooldown("fallingsword", Math.min(data.targets * 60, cd - 600));
  }
  function fs_flurry_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 301,
      tickrate: 15,
      ontick: {type: "area", self: true, range: 15, coeff: 0.575, proc: 0.00625, onhit: Sim.apply_effect("knockback", 30)},
    });
  }
  skills.fallingsword = {
    offensive: true,
    //speed: 57.142834,
    frames: 78,
    duration: 78,
    cost: 25,
    speed: 1,
    cooldown: 30,
    grace: function(rune) {
      if (Sim.stats.leg_camsrebuttal) {
        return [240, 1];
      }
    },
    oncast: function(rune) {
      var dmg = {delay: 54, type: "area", self: true, range: 14, coeff: 17};
      switch (rune) {
      case "a": dmg.onhit = fs_superheated_onhit; break;
      case "b": dmg.onhit = fs_clouds_onhit; break;
      case "c": dmg.onhit = fs_rise_onhit; break;
      case "d": dmg.onhit = fs_rapid_onhit; break;
      case "e": dmg.onhit = fs_flurry_onhit; break;
      }
      return dmg;
    },
    proctable: {x: 1, a: 0.5, b: 0.5, c: 1, d: 1, e: 0.5},
    elem: {x: "phy", a: "fir", b: "lit", c: "phy", d: "lit", e: "hol"},
  };

  skills.akaratschampion = {
    offensive: true,
    secondary: true,
    frames: 36,
    cooldown: function(rune) {
      return 90 * (Sim.stats.set_akkhan_4pc ? 0.5 : 1);
    },
    oncast: function(rune) {
      var buffs = {dmgmul: 35, wrathregen: 5};
      if (Sim.stats.set_akkhan_2pc) buffs.rcr = 50;
      if (Sim.stats.set_akkhan_6pc) buffs.dmgmul = {list: [35, 450]};
      if (rune === "b" || Sim.stats.leg_akkhansaddendum) buffs.wrathregen = 10;
      if (rune === "c") {
        for (var id in skills) {
          if (id !== "akaratschampion" && skills[id].cooldown) {
            Sim.reduceCooldown(id, 12 * 60);
          }
        }
      }
      if (rune === "d" || Sim.stats.leg_akkhansaddendum) buffs.armor_percent = 150;
      if (rune === "e") buffs.ias = 15;
      Sim.addBuff("akaratschampion", buffs, {duration: 1200});
    },
    oninit: function(rune) {
      if (rune === "a") {
        Sim.register("onhit_proc", function(data) {
          if (Sim.getBuff("akaratschampion")) {
            Sim.addBuff(undefined, undefined, {
              duration: 180,
              tickrate: 30,
              tickinitial: 1,
              ontick: {count: data.proc * data.targets, coeff: 4.6 / 6, proc: 0},
            });
          }
        });
      }
    },
    proctable: 0.25,
    elem: {x: "fir", a: "fir", b: "phy", c: "lit", d: "hol", e: "hol"},
  };

  function hf_ontick(data) {
    var coeff = data.coeff;
    if (Sim.stats.leg_braceroffury && (Sim.stats.blinded || Sim.stats.immobilized || Sim.stats.stunned)) {
      coeff *= 1 + 0.01 * Sim.stats.leg_braceroffury;
    }
    Sim.damage({type: "area", range: data.range, coeff: coeff});
    if (data.count > 1) Sim.damage({type: "area", count: data.count - 1, origin: data.range * 2, range: data.range, coeff: coeff});
  }
  function hf_fix() {
    if (Sim.stats.leg_braceroffury && Sim.stats.blinded) {
      this.factor = 1 + 0.01 * Sim.stats.leg_braceroffury;
    }
  }
  skills.heavensfury = {
    offensive: true,
    frames: 57.777767,
    cooldown: function(rune) {
      if (rune !== "e") return 20 * (1 - 0.01 * (Sim.stats.leg_eberlicharo || 0));
    },
    cost: function(rune) {
      if (rune === "e") return 40;
    },
    oncast: function(rune) {
      var params = {
        duration: 360,
        tickrate: 30,
        tickinitial: 1,
        ontick: hf_ontick,
        data: {range: 8, coeff: 1.425, count: 1},
      };
      switch (rune) {
      case "b":
        Sim.addBuff("blessedground", undefined, {
          duration: 301,
          tickrate: 30,
          ontick: {type: "area", range: 8, coeff: 1.55, fix: hf_fix},
        });
        break;
      case "a":
        params.data.range = 12;
        params.data.coeff = 2.305;
        break;
      case "c":
        params.data.range = 4;
        params.data.coeff = 1.65;
        params.data.count = 3;
        break;
      case "e":
        var dmg = {type: "line", range: 55, radius: 3, pierce: true, coeff: 9.6};
        if (Sim.stats.leg_fateofthefell) {
          dmg.fan = 50;
          dmg.count = 3;
        }
        return dmg;
      }
      if (Sim.stats.leg_fateofthefell) {
        params.data.count += 2;
      }
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.05, b: 0.05, a: 0.05, c: 0.03333, d: 0.05, e: 0.5},
    elem: {x: "hol", b: "hol", a: "hol", c: "hol", d: "lit", e: "hol"},
  };

  function bombardment_ontick(data) {
    var dmg = {type: "area", range: 12, coeff: 5.7};
    switch (data.buff.castInfo.rune) {
    case "a":
      dmg.addthorns = 2;
      //dmg.onhit = function(data) {
      //  Sim.damage({targets: data.targets, coeff: 2, thorns: true});
      //};
      break;
    case "b": dmg.chc = 100; break;
    case "c": Sim.damage({delay: 30, type: "area", range: 10, spread: 30, count: 2, coeff: 1.6}); break;
    case "d":
      dmg.coeff = 33.2;
      dmg.range = 18;
      break;
    }
    if (data.extrahits && data.buff.castInfo.rune !== "e") {
      //dmg.spread = 30;
    } else {
      data.extrahits = true;
    }
    Sim.damage(dmg);
  }
  skills.bombardment = {
    offensive: true,
    frames: 57.777767,
    cooldown: function(rune) {
      return 60 * (Sim.stats.passives.lordcommander ? 0.65 : 1);
    },
    oncast: function(rune) {
      var params = {
        duration: 37,
        tickinitial: 36,
        tickrate: 21,
        ontick: bombardment_ontick,
      };
      var hits = 1;
      if (rune !== "d") hits = 5;
      if (Sim.stats.leg_themortaldrama) hits *= 2;
      params.duration += params.tickrate * (hits - 1);
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.48, a: 0.48, b: 0.48, c: 0.48, d: 1, e: 0.48},
    elem: {x: "phy", a: "phy", b: "fir", c: "fir", d: "phy", e: "hol"},
  };

  Sim.passives = {
    heavenlystrength: {damage: -20},
    fervor: function() {
      if (Sim.stats.info.mainhand.slot == "onehand") {
        Sim.addBaseStats({ias: 15, cdr: 15});
      }
    },
    vigilant: {regen: 2682, nonphys: 20},
    righteousness: {maxwrath: 30},
    insurmountable: function() {
      Sim.register("onblock", function() {
        Sim.addResource(6);
      });
    },
    fanaticism: function() {},
    indestructible: function() {},
    holycause: {damage: 10},
    wrathful: {lifewrath: 1341},
    divinefortress: function() {
      Sim.addBaseStats({armor_percent: Sim.stats.block});
    },
    lordcommander: {skill_crusader_phalanx: 20},
    holdyourground: {block: 30},
    longarmofthelaw: function() {},
    ironmaiden: {thorns_multiply: 50},
    renewal: function() {},
    finery: function() {
      Sim.addBaseStats({str_percent: Sim.stats.info.gems * 1.5});
    },
    blunt: {
      skill_crusader_justice: 20,
      skill_crusader_blessedhammer: 20,
    },
    toweringshield: {
      skill_crusader_punish: 20,
      skill_crusader_shieldbash: 20,
      skill_crusader_blessedshield: 20,
    },
  };

})();

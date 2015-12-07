(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  function VarSpeed(rune) {
    switch (Sim.stats.info.weaponClass) {
    case "swing": return 57.142834;
    case "thrust": return 56.842068;
    case "swing2h": return 57.272724;
    case "thrust2h": return 57.272724;
    case "staff": return 57.272724;
    case "dualwield": return 57.142834;
    default: return 56.470570;
    }
  }

  function OathKeeper(func) {
    return function(rune) {
      var base = func;
      if (typeof base === "function") base = func.call(this, rune);
      return base / (Sim.stats.leg_oathkeeper ? 1.5 : 1);
    };
  }

  var _fb_prev = 0;
  function bash_frostbite_onhit(data) {
    if (Sim.time >= _fb_prev) {
      Sim.addBuff("frozen", undefined, 90);
      _fb_prev = Sim.time + 300;
    }
  }
  function bash_onslaught_onhit(data) {
    Sim.addBuff("onslaught", {chctaken: 10}, {duration: 180});
  }
  skills.bash = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "d" ? 9 : 6);
    },
    cost: function(rune) {
      if (Sim.stats.leg_bladeofthewarlord) {
        return Math.min(40, Sim.getResource("fury"));
      }
    },
    speed: OathKeeper(VarSpeed),
    oncast: function(rune) {
      var dmg = {coeff: 3.2};
      switch (rune) {
      case "c": dmg.onhit = bash_frostbite_onhit; break;
      case "a": dmg.onhit = bash_onslaught_onhit; break;
      case "b":
        Sim.addBuff("punish", {damage: 4}, {maxstacks: 3, duration: 300});
        break;
      case "e":
        Sim.damage({type: "line", pierce: true, range: 28, radius: 8, cmod: -1, coeff: 1});
        break;
      }
      return dmg;
    },
    proctable: {x: 1, c: 1, a: 1, b: 1, d: 1, e: 0.333},
    elem: {x: "phy", c: "col", a: "lit", b: "phy", d: "fir", e: "fir"},
  };

  function cleave_reaping_onhit(data) {
    Sim.addResource(data.targets);
  }
  function cleave_scattering_onhit(data) {
    var coeff = 0.8;
    if (Sim.stats.leg_dishonoredlegacy) {
      coeff *= 1 + 0.01 * Sim.stats.leg_dishonoredlegacy * (Sim.stats.maxfury - (Sim.resources.fury || 0)) / Sim.stats.maxfury;
    }
    Sim.damage({type: "area", count: data.targets * data.chc, range: 12, coeff: coeff});
  }
  function cleave_gathering_onhit(data) {
    Sim.addBuff("gatheringstorm", {dmgtaken: 10}, {
      duration: 180,
      status: "chilled",
    });
  }
  skills.cleave = {
    signature: true,
    offensive: true,
    generate: 6,
    speed: OathKeeper(function(rune) {
      switch (Sim.stats.info.weaponClass) {
      case "swing": return 57.857117;
      case "thrust": return 57.857121;
      case "swing2h": return 57.857128;
      case "thrust2h": return 57.857128;
      case "staff": return 57.931034;
      case "dualwield": return 57.857124;
      default: return 57.857117;
      }
    }),
    oncast: function(rune) {
      var dmg = {type: "cone", angle: 180, range: 10, coeff: 2};
      if (Sim.stats.leg_dishonoredlegacy) {
        dmg.factor = 1 + 0.01 * Sim.stats.leg_dishonoredlegacy * (Sim.stats.maxfury - (Sim.resources.fury || 0)) / Sim.stats.maxfury;
      }
      switch (rune) {
      case "d": dmg.onhit = cleave_reaping_onhit;
      case "c": dmg.onhit = cleave_scattering_onhit;
      case "a":
        delete dmg.angle;
        dmg.type = "area";
        dmg.self = true;
        dmg.coeff = 2.35;
        break;
      case "b": dmg.onhit = cleave_gathering_onhit; break;
      }
      return dmg;
    },
    proctable: {x: 0.667, e: 0.667, d: 0.667, c: 0.667, a: 0.4, b: 0.667},
    elem: {x: "phy", e: "fir", d: "fir", c: "phy", a: "lit", b: "col"},
  };

  skills.frenzy = {
    signature: true,
    offensive: true,
    speed: OathKeeper(function(rune) {
      return VarSpeed(rune) / (1 + 0.15 * Sim.getBuff("frenzy"));
    }),
    generate: function(rune) {
      return (rune === "e" || Sim.stats.leg_theundisputedchampion ? 6 : 4);
    },
    oncast: function(rune) {
      var dmg = {coeff: 2.2};
      var buffs = {};
      if (rune === "b" || Sim.stats.leg_theundisputedchampion) {
        if (Sim.random("sidearm", 0.25)) {
          Sim.damage({type: "line", range: 35, pierce: true, coeff: 3});
        }
      }
      if (rune === "c" || Sim.stats.leg_theundisputedchampion) {
        buffs.extrams = 5;
      }
      if (rune === "d" || Sim.stats.leg_theundisputedchampion) {
        dmg.onhit = Sim.apply_effect("stunned", 90, 0.3);
      }
      if (rune === "a" || Sim.stats.leg_theundisputedchampion) {
        buffs.damage = 2.5;
      }
      Sim.addBuff("frenzy", buffs, {
        duration: 240,
        maxstacks: (Sim.stats.leg_bastionsrevered ? 10 : 5),
      });
      return dmg;
    },
    proctable: 0.75,
    elem: {x: "phy", b: "col", e: "col", c: "phy", d: "lit", a: "fir"},
  };

  function _chain() {
    var list = [];
    for (var i = 0; i < arguments.length; ++i) {
      if (arguments[i]) list.push(arguments[i]);
    }
    return function() {
      for (var i = 0; i < list.length; ++i) {
        list[i].apply(this, arguments);
      }
    };
  }

  function wt_ricochet_onhit(data) {
    var count = Math.min(Sim.target.count - 1, 2);
    if (count) Sim.damage({count: count * data.targets, coeff: 2.75});
  }
  function wt_arreats_onhit(data) {
    Sim.addResource((Sim.stats.leg_arreatslaw || 0) * Math.min(20, data.distance) / 20);
  }
  skills.weaponthrow = {
    signature: true,
    offensive: true,
    generate: {x: 6, a: 6, b: 6, c: 6, e: 6, d: 9},
    speed: OathKeeper(57.777767),
    oncast: function(rune) {
      var dmg = {type: "line", speed: 2, coeff: 2.75};
      if (Sim.stats.passives.noescape && Sim.target.distance > 15) {
        dmg.factor = 1.3;
      }
      switch (rune) {
      case "a": dmg.coeff = 4; break;
      case "b": dmg.onhit = wt_ricochet_onhit; break;
      case "c": dmg.onhit = Sim.apply_effect("stunned", 60, 0.4); break;
      case "e": dmg.onhit = Sim.apply_effect("charmed", 180, 0.15); break;
      }
      if (Sim.stats.leg_arreatslaw) {
        dmg.onhit = _chain(dmg.onhit, wt_arreats_onhit);
      }
      return dmg;
    },
    proctable: {x: 1, a: 1, b: 0.333, c: 1, e: 1, d: 1},
    elem: {x: "phy", a: "lit", b: "fir", c: "phy", e: "phy", d: "fir"},
  };

  function hota_birthright_onhit(data) {
    var count = Sim.random("birthright", 0.1, data.targets * data.chc, true);
    while (count--) Sim.trigger("onglobe");
  }
  function hota_gavel_onhit(data) {
    if (data.targets <= 3) {
      Sim.addResource(Sim.stats.leg_gavelofjudgment || 0);
    }
  }
  skills.hammeroftheancients = {
    offensive: true,
    speed: function(rune) {
      return 56.666664 / (1 + (Sim.stats.leg_bracersofthefirstmen ? 0.5 : 0));
    },
    cost: 20,
    oncast: function(rune) {
      var dmg = {type: "area", range: 7, front: true, coeff: 5.35, chc: (Sim.resources.fury || 0) / 5};
      switch (rune) {
      case "b": Sim.damage({type: "rollingthunder", range: 22, angle: 60, expos: Sim.target.distance - 7, exrange: 7, coeff: 5.05}); break;
      case "a": dmg.coeff = 6.4; break;
      case "c": dmg.onhit = Sim.apply_effect("chilled", 120); break;
      case "d": dmg.onhit = hota_birthright_onhit; break;
      }
      if (Sim.stats.leg_gavelofjudgment) {
        dmg.onhit = _chain(dmg.onhit, hota_gavel_onhit);
      }
      return dmg;
    },
    proctable: {x: 0.667, b: 0.4, a: 0.667, c: 0.667, e: 0.667, d: 0.667},
    elem: {x: "phy", b: "phy", a: "fir", c: "col", e: "lit", d: "phy"},
  };

  function rend_ontick(data) {
    Sim.damage({coeff: data.coeff, count: data.stacks, targets: data.targets});
  }
  function rend_onhit(data) {
    var params = {
      duration: 300,
      tickrate: 30,
      tickinitial: 1,
      ontick: rend_ontick,
      data: {coeff: 1.1, targets: data.targets},
    };
    if (Sim.stats.leg_lamentation) {
      params.maxstacks = 2;
    }
    if (Sim.stats.set_wastes_2pc) {
      params.duration = 900;
    }
    var buffs;
    switch (data.castInfo.rune) {
    case "a": params.data.coeff = 1.35; break;
    case "c":
      buffs = {dmgtaken: 10};
      params.status = "chilled";
      break;
    }
    Sim.addBuff("rend", buffs, params);
  }
  skills.rend = {
    offensive: true,
    speed: 57.931034,
    cost: 20,
    weapon: "mainhand",
    oncast: function(rune) {
      return {type: "area", self: true, range: rune === "b" ? 18 : 12, onhit: rend_onhit};
    },
    proctable: {x: 0.333, b: 0.25, d: 0.333, a: 0.333, c: 0.333, e: 0.333},
    elem: {x: "phy", b: "fir", d: "phy", a: "lit", c: "col", e: "phy"},
  };

  function ss_bod_fix() {
    if (Sim.stats.leg_bracersofdestruction) {
      this.factor = (this.factor || 1) * (1 + 0.01 * Sim.stats.leg_bracersofdestruction * Math.min(5, this.targets) / this.targets);
    }
  }
  skills.seismicslam = {
    offensive: true,
    speed: 58.666656,
    cost: function(rune) {
      return (rune === "c" ? 22 : 30) * (1 - 0.01 * (Sim.stats.leg_furyofthevanishedpeak || 0));
    },
    oncast: function(rune) {
      var dmg = {type: "cone", width: 50, range: 50, coeff: 6.2};
      switch (rune) {
      case "a": dmg.coeff = 7.35; dmg.onhit = Sim.apply_effect("knockback", 30); break;
      case "b":
        Sim.addBuff(undefined, undefined, {
          duration: 121,
          tickrate: 30,
          ontick: {type: "cone", width: 50, range: 50, coeff: 0.575},
        });
        break;
      case "e": dmg.coeff = 7.55; dmg.onhit = Sim.apply_effect("chilled", 60); break;
      }
      if (Sim.stats.passives.noescape && Sim.target.distance > 15) {
        dmg.factor = 1.3;
      }
      if (Sim.stats.leg_bracersofdestruction) {
        dmg.fix = ss_bod_fix;
      }
      return dmg;
    },
    proctable: {x: 0.333, c: 0.333, a: 0.333, b: 0.111, d: 0.333, e: 0.333},
    elem: {x: "phy", c: "lit", a: "fir", b: "phy", d: "phy", e: "col"},
  };

  var _devils_angle = 0;
  function ww_devils_ontick(data) {
    var info = Sim.castInfo();
    var coeff = (Sim.stats.set_wastes_6pc ? 25 : 1.2) * Sim.stats.info[info && info.weapon || "mainhand"].speed;
    Sim.damage({type: "line", range: 30, speed: 1, pierce: true, radius: 3, angle: _devils_angle, coeff: coeff});
    _devils_angle = (_devils_angle + 60) % 360;
    //data.buff.params.tickrate = Math.floor(30 / Sim.stats.info[info && info.weapon || "mainhand"].speed);
  }
  function ww_devils_onexpire(data) {
    if (data.buffid) Sim.removeBuff(data.buffid);
  }
  function ww_shear_onhit(data) {
    Sim.addResource(data.targets);
  }
  function ww_ontick(data) {
    var dmg = {type: "area", range: 9, self: true, coeff: 3.4 / 3};
    switch (data.rune) {
    case "d": dmg.onhit = ww_shear_onhit; break;
    case "a": dmg.coeff = 4 / 3; break;
    }
    if (Sim.stats.leg_skullgrasp) {
      dmg.coeff += Sim.stats.leg_skullgrasp / 3;
    }
    var info = Sim.castInfo();
    dmg.coeff *= Sim.stats.info[info && info.weapon || "mainhand"].speed;
    Sim.damage(dmg);
  }
  skills.whirlwind = {
    offensive: true,
    speed: 26.66666,
    noias: true,
    channeling: 20,
    cost: function(rune) {
      var info = Sim.castInfo();
      return 10 * Sim.stats.info[(info && info.skill === "whirlwind" && info.weapon) || Sim.curweapon || "mainhand"].speed;
    },
    oncast: function(rune) {
      var data = {rune: rune};
      var base = {buffs: {}};
      if (rune === "b" || Sim.stats.set_wastes_6pc) {
        var prev = Sim.getBuffData("whirlwind");
        data.buffid = Sim.addBuff(prev && prev.buffid, undefined, {
          ontick: ww_devils_ontick,
          tickrate: 30,
          tickinitial: 1,
        });
        base.onexpire = ww_devils_onexpire;
      }
      if (Sim.stats.set_bulkathos_2pc) {
        base.buffs.extrams = 30;
        base.buffs.ias = 30;
      }
      if (Sim.stats.set_wastes_4pc) {
        base.buffs.dmgred = 40;
      }
      Sim.channeling("whirlwind", this.channeling, ww_ontick, data, base);
    },
    proctable: 0.2,
    elem: {x: "phy", b: "phy", c: "col", e: "phy", d: "lit", a: "fir"},
  };

  function bouldertoss_fix(data) {
    if (Sim.stats.leg_skularssalvation) {
      if (this.targets <= 5) {
        this.factor = 1 + 0.01 * Sim.stats.leg_skularssalvation;
      } else {
        this.factor = 2;
      }
    }
  }
  skills.ancientspear = {
    offensive: true,
    speed: 57.777767,
    cost: 25,
    oncast: function(rune) {
      var dmg = {type: "line", range: 60, pierce: true, speed: 3, coeff: 5};
      switch (rune) {
      case "d": dmg.onhit = Sim.apply_effect("knockback", 30); break;
      case "a": dmg.onhit = Sim.apply_effect("slowed", 60); break;
      case "c": dmg.coeff = 6.4; break;
      case "b":
        dmg = {type: "area", range: 9, coeff: 5 + 0.2 * (Sim.resources.fury || 0)};
        if (Sim.stats.leg_skularssalvation) {
          dmg.fix = bouldertoss_fix;
        }
        if (!Sim.castInfo().triggered) {
          Sim.spendResource(Sim.resources.fury);
        }
        break;
      case "e": dmg.onhit = Sim.apply_effect("slowed", 60); break;
      }
      if (Sim.stats.passives.noescape && Sim.target.distance > 15) {
        dmg.factor = 1.3;
      }
      return dmg;
    },
    proctable: {x: 0.471, d: 0.471, a: 0.3925, c: 0.471, b: 0.471, e: 0.3925},
    elem: {x: "phy", d: "phy", a: "phy", c: "fir", b: "phy", e: "phy"},
  };

  function gs_onhit(data) {
    switch (data.castInfo.rune) {
    case "e":
      Sim.after(240, function() {
        Sim.addBuff("slowed", undefined, {duration: 480});
      });
      break;
    case "c":
      var count = Sim.random("jarringslam", 0.1, data.targets, true);
      while (count--) Sim.trigger("onglobe");
      break;
    }
    Sim.addBuff("stunned", undefined, {duration: 240});
  }
  skills.groundstomp = {
    offensive: true,
    weapon: "mainhand",
    generate: function(rune) {
      return (rune === "d" ? 30 : 15);
    },
    cooldown: {x: 12, e: 8, b: 12, a: 12, d: 12, c: 12},
    speed: 56.666664,
    oncast: function(rune) {
      var dmg = {type: "area", self: true, range: 14, coeff: 0, onhit: gs_onhit};
      if (rune === "b") dmg.range = 24;
      if (rune === "a") dmg.coeff = 5.75;
      return dmg;
    },
    proctable: {x: 0.25, e: 0.25, b: 0.2, a: 0.25, d: 0.25, c: 0.25},
    elem: {x: "phy", e: "col", b: "phy", a: "fir", d: "phy", c: "phy"},
  };

  function leap_onhit(data) {
    var status = "slowed";
    if (data.castInfo.rune === "d" || Sim.stats.set_earth_4pc) {
      Sim.addBuff("ironimpact", {armor_percent: 150 * (Sim.stats.set_earth_4pc ? 2.5 : 1)}, {duration: 240 * (Sim.stats.set_earth_4pc ? 2.5 : 1)});
    }
    if (data.castInfo.rune === "e") status = "stunned";
    Sim.addBuff(status, undefined, {duration: 180});
  }
  skills.leap = {
    offensive: true,
    weapon: "mainhand",
    generate: 15,
    cooldown: 10,                                                               
    grace: function(rune) {
      if (Sim.stats.leg_lutsocks) {
        return [120, 2];
      }
    },
    speed: 24.999998,
    oncast: function(rune) {
      var dmg = {type: "area", range: 8, self: true, coeff: 1.8, onhit: leap_onhit};
      switch (rune) {
      case "c":
        //Sim.damage(dmg);
        break;
      case "b": dmg.coeff = 4.5; break;
      case "a": dmg.range = 16; break;
      }
      return dmg;
    },
    proctable: {x: 0.333, d: 0.333, c: 0.333, b: 0.2, a: 0.2, e: 0.333},
    elem: "phy",
  };

  function sprint_rtlw_ontick(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 180,
      tickrate: 30,
      tickinitial: 1,
      ontick: {type: "area", self: true, range: 8, coeff: 0.1},
    });
    var info = Sim.castInfo();
    data.buff.params.tickrate = Math.floor(20 / Sim.stats.info[info && info.weapon || "mainhand"].speed);
  }
  skills.sprint = {
    secondary: true,
    weapon: "mainhand",
    cost: 20,
    oncast: function(rune) {
      var params = {duration: 180};
      var buffs = {extrams: 30};
      switch (rune) {
      case "b": buffs.dodge = 12; break;
      case "c":
        params.tickrate = 20;
        params.tickinitial = 1;
        params.ontick = sprint_rtlw_ontick;
        break;
      case "a": buffs.extrams = 40; break;
      case "e":
        params.tickrate = 12;
        params.tickinitial = 1;
        params.ontick = {type: "area", self: true, range: 8, coeff: 0.25};
        break;
      }
      Sim.addBuff("sprint", buffs, params);
    },
    proctable: {c: 0.0056, e: 0.0056},
    elem: "phy",
  };

  skills.ignorepain = {
    secondary: true,
    weapon: "mainhand",
    speed: 40,
    cooldown: 30,
    oncast: function(rune) {
      var buffs = {dmgred: 50};
      var params = {duration: 300};
      switch (rune) {
      case "d": buffs.extrams = 40; break;
      case "b": params.duration = 420; break;
      case "e": buffs.lifefury = 5364; break;
      }
      if (Sim.stats.leg_prideofcassius) {
        params.duration += Sim.stats.leg_prideofcassius * 60;
      }
      Sim.addBuff("ignorepain", buffs, params);
    },
    elem: "phy",
  };

  function op_momentum_onhit(data) {
    Sim.addResource(5 * data.targets);
  }
  skills.overpower = {
    offensive: true,
    secondary: true,
    weapon: "mainhand",
    speed: 32,
    cooldown: 12,
    oncast: function(rune) {
      var dmg = {type: "area", range: 9, self: true, coeff: 3.8};
      switch (rune) {
      case "b":
        Sim.damage({delay: Math.ceil(Sim.target.distance), targets: 3, coeff: 3.8});
        break;
      case "a":
        Sim.addBuff("killingspree", {chc: 8}, {duration: 300});
        break;
      case "e":
        Sim.addBuff("crushingadvance", undefined, {duration: 300});
        break;
      case "d":
        dmg.onhit = op_momentum_onhit;
        break;
      case "c":
        dmg.coeff = 7.6;
        break;
      }
      return dmg;
    },
    oninit: function(rune) {
      Sim.register("onhit_proc", function(data) {
        Sim.reduceCooldown("overpower", Sim.random("overpower", data.proc * data.chc, data.targets, true) * 60);
      });
    },
    proctable: {x: 0.333, b: 0.2, a: 0.333, e: 0.333, d: 0.333, c: 0.333},
    elem: {x: "phy", b: "phy", a: "lit", e: "col", d: "phy", c: "fir"},
  };

  skills.revenge = {
    offensive: true,
    secondary: true,
    weapon: "mainhand",
    speed: 56.470577,
    charges: 0,
    oncast: function(rune) {
      var dmg = {type: "area", range: 11, self: true, coeff: 3};
      switch (rune) {
      case "e":
        Sim.addBuff("bestservedcold", {chc: 8}, {duration: 360});
        break;
      case "a":
        dmg.coeff = 7;
        break;
      case "c":
        dmg.onhit = Sim.apply_effect("knockback", 30);
        break;
      }
      return dmg;
    },
    proctable: 0.333,
    elem: {x: "phy", d: "phy", e: "col", a: "fir", c: "lit", b: "phy"},
  };

  function fc_onhit(data) {
    if (Sim.stats.set_raekor_2pc && data.targets <= 1.1) {
      Sim.reduceCooldown("furiouscharge");
    }
    if (Sim.stats.set_raekor_4pc || data.castInfo.rune === "e") {
      var hits = Sim.random("furiouscharge", 1, data.targets, true);
      if (hits) Sim.reduceCooldown("furiouscharge", 120 * Math.min(hits, 10));
    }
    if (Sim.stats.set_raekor_4pc || data.castInfo.rune === "d") {
      Sim.addResource(10 * data.targets);
    }
    if (Sim.stats.set_raekor_4pc || data.castInfo.rune === "c") {
      Sim.addBuff("frozen", undefined, {duration: 150});
    }
  }
  function fc_fix() {
    if (!this.targets) return;
    this.factor = 1;
    if (Sim.stats.leg_vileward && this.targets > 1) {
      this.factor += 0.01 * Sim.stats.leg_vileward * this.targets;
    }
  }
  skills.furiouscharge = {
    offensive: true,
    weapon: "mainhand",
    generate: 15,
    speed: 15.48387,
    cooldown: 10,
    charges: function(rune) {
      return (rune === "b" || Sim.stats.set_raekor_4pc ? 3 : 1);
    },
    oncast: function(rune) {
      var dmg = {type: "line", pierce: true, range: 20, radius: 7, coeff: 6, onhit: fc_onhit};
      if (rune === "a" || Sim.stats.set_raekor_4pc) dmg.coeff = 10.5;
      if (Sim.stats.leg_vileward) dmg.fix = fc_fix;
      return dmg;
    },
    proctable: 0.5,
    elem: {x: "phy", a: "fir", e: "phy", d: "phy", c: "col", b: "lit"},
  };

  function avalanche_ontick(data) {
    var dmg = {type: "area", range: 15, coeff: 2.4};
    if (Sim.stats.passives.noescape && Sim.target.distance > 15) {
      dmg.factor = 1.3;
    }
    switch (data.rune) {
    case "c":
      dmg.coeff = 2.64;
      dmg.range = 5;
      if (Sim.random("volcano", 0.5)) {
        dmg.spread = 20;
      }
      break;
    case "b":
      dmg.range = 20;
      dmg.coeff = 28 / 3;
      dmg.onhit = Sim.apply_effect("chilled", 180);
      break;
    case "a":
      dmg.onhit = Sim.apply_effect("frozen", 60);
      break;
    }
    Sim.damage(dmg);
  }
  skills.avalanche = {
    offensive: true,
    weapon: "mainhand",
    speed: 56.666664,
    cooldown: 30,
    charges: function(rune) {
      return (rune === "e" ? 3 : undefined);
    },
    oncast: function(rune) {
      if (Sim.stats.passives.earthenmight) {
        Sim.addResource(30);
      }
      Sim.addBuff(undefined, undefined, {
        duration: (rune === "c" ? 300 : 180),
        tickrate: (rune === "c" ? 12 : (rune === "b" ? 60 : 18)),
        tickinitial: 1,
        ontick: avalanche_ontick,
        data: {rune: rune},
      });
    },
    oninit: function(rune) {
      Sim.register("resourceloss", function(data) {
        if (data.type === "fury") {
          var ticks = Sim.random("avalanche", 1, data.amount / (rune === "d" ? 15 : 25), true);
          if (ticks) Sim.reduceCooldown("avalanche", ticks * 60);
        }
      });
    },
    proctable: {x: 0.05, c: 0.08, d: 0.045, b: 0.14, e: 0.05, a: 0.05},
    elem: {x: "phy", c: "fir", d: "phy", b: "col", e: "phy", a: "col"},
  };

  skills.threateningshout = {
    secondary: true,
    weapon: "mainhand",
    speed: 40,
    cooldown: 10,
    generate: 15,
    oncast: function(rune) {
      var params = {duration: 900};
      switch (rune) {
      case "b": params.status = "slowed"; break;
      case "d":
        Sim.addBuff("falter", {dmgtaken: 25}, {duration: 360});
        return;
      case "c":
        var count = Sim.random("grimharvest", 0.15, Sim.getTargets(25, Sim.target.distance), true);
        while (count--) Sim.trigger("onglobe");
        break;
      case "a":
        Sim.addBuff("demoralize", undefined, {duration: 240});
        break;
      case "e":
        Sim.addBuff("feared", undefined, {duration: 180});
        break;
      }
      if (Sim.stats.passives.inspiringpresence) {
        params.duration *= 2;
      }
      Sim.addBuff("threateningshout", undefined, params);
    },
    proctable: {e: 1},
    elem: "phy",
  };

  function br_fray_ontick(data) {
    var count = Math.round(Sim.getTargets(10, Sim.target.distance));
    Sim.removeBuff("intothefray");
    Sim.addBuff("intothefray", {chc: 1}, {stacks: count, maxstacks: count, duration: 60});
  }
  skills.battlerage = {
    offensive: true,
    secondary: true,
    weapon: "mainhand",
    speed: 57.142845,
    cost: 20,
    oncast: function(rune) {
      var buffs = {damage: 10, chc: 3};
      var params = {duration: 120 * 60};
      switch (rune) {
      case "a": buffs.damage = 15; break;
      case "b": buffs.extrams = 15; break;
      case "d":
        buffs.tickrate = 60;
        buffs.tickinitial = 1;
        buffs.ontick = br_fray_ontick;
        break;
      }
      if (Sim.stats.passives.inspiringpresence) {
        params.duration *= 2;
      }
      Sim.addBuff("battlerage", buffs, params);
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onhit_proc", function(data) {
          if (Sim.getBuff("battlerage")) {
            var targets = Sim.getTargets(15, 0);
            Sim.trigger("onhit", {
              targets: targets,
              damage: data.damage * 0.2,
              elem: "phy",
              castInfo: Sim.castInfo(),
              triggered: "battlerage",
              chc: 0,
              distance: 0,
              dmgmul: data.dmgmul,
              hits: 1,
            });
          }
        });
      }
    },
    elem: "phy",
  };

  skills.warcry = {
    secondary: true,
    weapon: "mainhand",
    speed: 40,
    cooldown: 20,
    generate: function(rune) {
      return (rune === "d" ? 50 : 20);
    },
    oncast: function(rune) {
      var buffs = {armor_percent: 20};
      var params = {duration: 120 * 60};
      switch (rune) {
      case "a":
        Sim.addBuff("hardenedwrath", {armor_percent: 60}, {duration: 300});
        break;
      case "e": buffs.life = 10; buffs.regen = 13411; break;
      case "b": buffs.dodge = 30; break;
      case "c": buffs.resist_percent = 20; break;
      }
      if (Sim.stats.leg_chilanikschain) {
        Sim.addBuff("chilanikschain", {extrams: Sim.stats.leg_chilanikschain}, {duration: 600});
      }
      if (Sim.stats.passives.inspiringpresence) {
        params.duration *= 2;
      }
      Sim.addBuff("warcry", buffs, params);
    },
    elem: "phy",
  };

  function eq_ontick(data) {
    var dmg = {type: "area", range: 18, self: true, coeff: 2.4};
    if (data.rune === "a") dmg.coeff = 3;
    if (data.rune === "c") dmg.onhit = Sim.apply_effect("frozen", 90);
    Sim.damage(dmg);
    if (data.rune === "b") {
      Sim.damage({type: "area", range: 8, self: true, coeff: 3});
    }
  }
  skills.earthquake = {
    offensive: true,
    speed: 24.999998,
    weapon: "mainhand",
    cost: function(rune) {
      return (rune === "d" ? 0 : 25);
    },
    cooldown: function(rune) {
      return (rune === "d" ? 30 : 60) - (Sim.stats.passives.boonofbulkathos ? 15 : 0);
    },
    oncast: function(rune) {
      if (Sim.stats.passives.earthenmight) {
        Sim.addResource(30);
      }
      var params = {
        duration: 480,
        tickrate: 24,
        tickinitial: 1,
        ontick: eq_ontick,
        data: {rune: rune},
      };
      Sim.addBuff(undefined, undefined, params);
    },
    proctable: {x: 0.05, b: 0.05, c: 0.05, d: 0.04, a: 0.05, e: 0.05},
    elem: {x: "fir", b: "fir", c: "col", d: "lit", a: "fir", e: "phy"},
  };

  function ancient_ontick(data) {
    if ((data.castInfo && data.castInfo.rune === "c") || Sim.stats.leg_furyoftheancients) {
      Sim.addResource(4);
    }
    if (data.user && (!data.user.ability || data.user.ability <= Sim.time)) {
      Sim.damage({type: "area", range: 8, coeff: data.coeff, pet: true});
      data.user.ability = Sim.time + 240;
    } else {
      Sim.damage({coeff: data.coeff, pet: true});
    }
    if (data.castInfo && data.castInfo.rune === "c") {
      Sim.addBuff("dutytotheclan", {chctaken: 10}, {duration: 120, status: "chilled"});
    }
  }

  skills.calloftheancients = {
    offensive: true,
    cooldown: function(rune) {
      return 120 - (Sim.stats.passives.boonofbulkathos ? 30 : 0);
    },
    speed: 57.142845,
    weapon: "mainhand",
    oncast: function(rune) {
      Sim.removeBuff("calloftheancients");
      var duration = 1200;
      if (Sim.stats.set_immortalking_2pc) duration = undefined;
      var buffs = {};
      if (rune === "a") buffs.lifefury = 966;
      if (rune === "e") buffs.dmgred = 50;
      Sim.petattack("calloftheancients", buffs, {
        stacks: 3,
        duration: duration,
        refresh: false,
        tickrate: 57.142834,
        speed: true,
        ontick: ancient_ontick,
        data: {coeff: (rune === "b" ? 5.4 : 2.7)},
      });
    },
    proctable: 0.1,
    elem: {x: "phy", b: "fir", d: "col", a: "phy", c: "phy", e: "lit"},
  };

  skills.wrathoftheberserker = {
    offensive: true,
    secondary: true,
    weapon: "mainhand",
    speed: 57.142845,
    cooldown: function(rune) {
      return 120 - (Sim.stats.passives.boonofbulkathos ? 30 : 0);
    },
    oncast: function(rune) {
      var buffs = {chc: 10, ias: 25, dodge: 20, extrams: 20};
      var params = {duration: 1200};
      switch (rune) {
      case "b":
        Sim.damage({type: "area", range: 15, self: true, coeff: 15});
        break;
      case "a": buffs.dmgmul = 50; break;
      case "c": buffs.dmgred = 50; break;
      case "d": buffs.lifefury = 5364; break;
      }
      Sim.addBuff("wrathoftheberserker", buffs, params);
    },
    oninit: function(rune) {
      if (rune === "e") {
        Sim.register("onhit_proc", function(data) {
          if (data.chc && Sim.getBuff("wrathoftheberserker")) {
            Sim.damage({type: "area", range: 15, coeff: 3, count: data.targets * data.chc * data.proc, nocrit: true});
          }
        });
      }
    },
    proctable: {b: 1, e: 0.25},
    elem: {x: "phy", b: "fir", a: "phy", e: "phy", c: "phy", d: "phy"},
  };

  Sim.passives = {
    poundofflesh: function() {
      Sim.register("onglobe", function() {
        Sim.addBuff("poundofflesh", {regen_percent: 2, extrams: 4}, {duration: 900, refresh: false, maxstacks: 5});
      });
    },
    ruthless: function() {
      var id;
      Sim.register("update", function(data) {
        if (Sim.targetHealth < 0.3) {
          if (!id) {
            id = Sim.addBuff(undefined, {dmgmul: 40});
          }
        } else {
          if (id) {
            Sim.removeBuff(id);
            id = undefined;
          }
        }
      });
    },
    nervesofsteel: function() {},
    weaponsmaster: function() {
      switch (Sim.stats.info.mainhand.type) {
      case "sword":
      case "dagger":
      case "sword2h":
        Sim.addBaseStats({damage: 8});
        break;
      case "mace":
      case "axe":
      case "mace2h":
      case "axe2h":
        Sim.addBaseStats({chc: 5});
        break;
      case "polearm":
      case "spear":
        Sim.addBaseStats({ias: 8});
        break;
      case "mightyweapon":
      case "mightyweapon2h":
        Sim.register("onhit_proc", function(data) {
          Sim.addResource(data.targets * data.proc * 2);
        });
        break;
      }
    },
    inspiringpresence: function() {
      Sim.register("oncast", function(data) {
        if (data.skill === "battlerage" || data.skill === "threateningshout" || data.skill === "warcry") {
          Sim.addBuff("inspiringpresence", {regen_percent: 3}, {duration: 60});
        }
      });
    },
    berserkerrage: function() {
      Sim.after(30, function check() {
        if ((Sim.resources.fury || 0) >= 0.95 * (Sim.stats.maxfury || 0)) {
          Sim.addBuff("berserkerrage", {damage: 25});
        } else {
          Sim.removeBuff("berserkerrage");
        }
        Sim.after(30, check);
      });
    },
    bloodthirst: function() {
      Sim.addBaseStats({lifefury: 966 + (Sim.baseStats.healbonus || 0) * 0.01});
    },
    animosity: {resourcegen: 10, maxfury: 20},
    superstition: {nonphys: 20},
    toughasnails: {armor_percent: 25},
    noescape: function() {},
    relentless: function() {
      // todo?
    },
    brawler: function() {
      Sim.after(60, function check() {
        if (Sim.getTargets(12, Sim.target.distance) >= 3) {
          Sim.addBuff("brawler", {damage: 20});
        } else {
          Sim.removeBuff("brawler");
        }
        Sim.after(60, check);
      });
    },
    juggernaut: {ccr: 50},
    unforgiving: {furyregen: 2},
    boonofbulkathos: function() {},
    earthenmight: function() {},
    swordandboard: function() {
      if (Sim.stats.info.ohtype === "shield") {
        Sim.addBaseStats({dmgred: 30, rcr_fury: 20});
      }
    },
    rampage: function() {
      // todo
    },
  };

})();

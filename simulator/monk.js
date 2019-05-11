(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  function GenSequence(name) {
    this.name = name;
  }
  GenSequence.prototype.next = function() {
    return Sim.getBuff(this.name);
  };
  GenSequence.prototype.step = function() {
    var next = this.next();
    if (next < 2) {
      var dur = Math.ceil(72 / Sim.stats.info.aps);
      Sim.addBuff(this.name, undefined, {maxstacks: 2, duration: dur});
    } else {
      Sim.removeBuff(this.name);
    }
    return next;
  };

  function GenSpirit(amount) {
    if (Sim.getBuff("infusedwithlight")) {
      amount += 14;
    }
    return amount * (1 + 0.01 * (Sim.stats.leg_bandofruechambers || 0));
  }
  function GenSpeed(speed) {
    if (Sim.stats.passives.alacrity) speed *= 1.15;
    if (Sim.stats.set_storms_2pc) speed *= 1.25;
    return speed;
  }

  function fot_static_onhit(data) {
    if (data.castInfo && data.castInfo.rune === "c") {
      Sim.addBuff("staticcharge", undefined, {
        duration: 360,
        targets: data.targets,
        firsttarget: data.firsttarget,
      });
    }
  }
  skills.fistsofthunder = {
    signature: true,
    offensive: true,
    sequence: new GenSequence("fistsofthunder"),
    generate: function(rune) {
      return GenSpirit(rune === "d" ? 20 : 14);
    },
    frames: function(rune) {
      return [57, 57.391289, 58.064510][this.sequence.next()];
    },
    speed: function(rune, aps) {
      return GenSpeed(aps * [1.55, 1.55, 1][this.sequence.next()]);
    },
    oncast: function(rune) {
      var index = this.sequence.step();
      if (rune === "a") {
        Sim.damage({type: "area", range: 6, coeff: 1.2, onhit: (index === 2 && Sim.apply_effect("knockback", 30)), cmod: (index < 2 ? -1 : 0)});
      }
      var onhit;
      if (rune === "c") onhit = fot_static_onhit;
      if (rune === "e" && index === 2) onhit = Sim.apply_effect("frozen", 120);
      if (index < 2) {
        return {coeff: 2, onhit: onhit};
      } else {
        var targets = Sim.getTargets(6);
        if (rune === "b" && Sim.target.count > 1) {
          Sim.damage({targets: Math.min(Sim.target.count - 1, 3), coeff: 2.4, onhit: onhit});
        }
        return {coeff: 4 / targets, targets: targets, onhit: onhit};
      }
    },
    oninit: function(rune) {
      if (rune === "c") {
        Sim.register("onhit_proc", function(data) {
          var list = Sim.target.list(data);
          var count = 0, last;
          for (var i = 0; i < list.length; ++i) {
            if (Sim.getBuff("staticcharge", list[i])) {
              count += 1;
              last = list[i];
            }
          }
          if (count) {
            var tlist = Sim.getBuffTargetList("staticcharge");
            if (count === 1) {
              var idx = tlist.indexOf(last);
              if (idx >= 0) tlist.splice(idx, 1);
            } else {
              count *= (tlist.length - 1) / tlist.length;
            }
            var coeff = 0.3;
            if (Sim.stats.set_shenlong_2pc) {
              // dirty fix
              coeff *= 1 + 0.02 * (Sim.resources.spirit || 0);
            }
            Sim.damage({targets: tlist, count: data.proc * count, coeff: coeff, proc: 0});
          }
        });
      }
    },
    proctable: function(rune) {
      switch (rune) {
      case "x": return [0.855, 0.855, 0.616][this.sequence.next()];
      case "a": return [0.427, 0.427, 0.616][this.sequence.next()];
      case "e": return [0.855, 0.855, 0.616][this.sequence.next()];
      case "c": return [0.427, 0.427, 0.308][this.sequence.next()];
      case "d": return [0.855, 0.855, 0.616][this.sequence.next()];
      case "b": return [0.855, 0.855, 0.308][this.sequence.next()];
      }
    },
    elem: {x: "lit", a: "lit", e: "col", c: "lit", d: "phy", b: "hol"},
  };

  function dr_sfb_onhit(data) {
    Sim.removeBuff("strikefrombeyond");
    var stacks = Sim.random("strikefrombeyond", 1, data.targets, true);
    if (stacks) {
      Sim.addBuff("strikefrombeyond", {stacks: stacks});
    }
    if (Sim.random("deadlyreach", 0.5)) {
      Sim.addBuff("knockback", undefined, {duration: 30, targets: data.targets, firsttarget: data.firsttarget});
    }
  }
  function dr_foresight_onhit(data) {
    Sim.addBuff("foresight", {damage: 15}, {duration: 300});
    if (Sim.random("deadlyreach", 0.5)) {
      Sim.addBuff("knockback", undefined, {duration: 30, targets: data.targets, firsttarget: data.firsttarget});
    }
  }

  skills.deadlyreach = {
    signature: true,
    offensive: true,
    sequence: new GenSequence("deadlyreach"),
    generate: function(rune) {
      return GenSpirit(12);
    },
    frames: function(rune) {
      return [55.384609, 57.391300, (rune === "c" ? 57.857132 : 58.064510)][this.sequence.next()];
    },
    speed: function(rune, aps) {
      return GenSpeed(aps * [1.5, 1.5, 1][this.sequence.next()]);
    },
    oncast: function(rune) {
      var index = this.sequence.step();
      var onhit;
      if (rune === "c") onhit = fot_static_onhit;
      if (rune === "e" && index === 2) onhit = Sim.apply_effect("frozen", 120);
      var cone = (rune === "b" ? 50 : 20);
      if (index < 2) {
        return {type: "cone", range: 12, width: cone, coeff: (rune === "e" ? 2.6 : 1.5)};
      } else {
        if (rune === "c") {
          return {targets: 6, coeff: 2.15, onhit: Sim.apply_effect("knockback", 30, 0.5)};
        }
        var onhit;
        if (rune === "d") onhit = dr_sfb_onhit;
        if (rune === "a") onhit = dr_foresight_onhit;
        return {type: "cone", range: 25, width: cone, coeff: (rune === "e" ? 2.6 : 1.5),
          onhit: (onhit || Sim.apply_effect("knockback", 30, (rune === "b" ? 1 : 0.5)))};
      }
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("clearcast", function(data) {
          var stacks = Sim.getBuff("strikefrombeyond");
          if (stacks) {
            if (!data.dry) {
              Sim.removeBuff("strikefrombeyond");
            }
            return Math.max(0, 1 - 0.08 * stacks);
          }
        });
      }
    },
    proctable: function(rune) {
      switch (rune) {
      case "b": return [0.85, 0.75, 0.5][this.sequence.next()];
      case "c": return [0.85, 0.85, 0.35][this.sequence.next()];
      default: return [0.85, 0.85, 0.75][this.sequence.next()];
      }
    },
    elem: {x: "phy", b: "phy", e: "fir", c: "lit", d: "col", a: "phy"},
  };

  function cw_third_onhit(data) {
    Sim.addBuff("slowed", undefined, {duration: 180, targets: data.targets, firsttarget: data.firsttarget});
  }
  function cw_tide_onhit(data) {
    Sim.addResource(2.5 * data.targets * (1 + 0.01 * (Sim.stats.leg_bandofruechambers || 0)));
  }
  function cw_tide_third_onhit(data) {
    cw_tide_onhit(data);
    cw_third_onhit(data);
  }
  function cw_wave_onhit(data) {
    Sim.addBuff("breakingwave", {dmgtaken: 10}, {duration: 180, targets: data.targets, firsttarget: data.firsttarget});
  }
  function cw_wave_third_onhit(data) {
    cw_wave_onhit(data);
    cw_third_onhit(data);
  }
  function cw_tsunami_third_onhit(data) {
    Sim.addBuff("frozen", undefined, {duration: 60, targets: data.targets, firsttarget: data.firsttarget});
    cw_third_onhit(data);
  }
  skills.cripplingwave = {
    signature: true,
    offensive: true,
    sequence: new GenSequence("cripplingwave"),
    generate: function(rune) {
      return GenSpirit(12);
    },
    frames: function(rune) {
      return [56.842102, 56.842102, 58][this.sequence.next()];
    },
    speed: function(rune, aps) {
      return GenSpeed(aps * [1.45, 1.45, 1][this.sequence.next()]);
    },
    oncast: function(rune) {
      var index = this.sequence.step();
      var onhit;
      if (rune === "c") onhit = fot_static_onhit;
      if (rune === "e" && index === 2) onhit = Sim.apply_effect("frozen", 120);
      var cone = Math.sin(Math.PI * (index > 0 && rune === "b" ? 22.5 : 10) / 180);
      if (index < 2) {
        var onhit;
        if (rune === "d") onhit = cw_tide_onhit;
        if (rune === "e") onhit = cw_wave_onhit;
        return {type: "cone", width: 180, range: 11, coeff: (rune === "a" ? 2.55 : 1.55), onhit: onhit};
      } else {
        var onhit = cw_third_onhit;
        if (rune === "d") onhit = cw_tide_third_onhit;
        if (rune === "b") onhit = cw_tsunami_third_onhit;
        if (rune === "e") onhit = cw_wave_third_onhit;
        return {type: "area", range: (rune === "b" ? 17 : 11), self: true, coeff: (rune === "a" ? 2.55 : 1.55), onhit: onhit};
      }
    },
    proctable: function(rune) {
      switch (rune) {
      case "b": return [0.75, 0.75, 0.35][this.sequence.next()];
      default: return [0.75, 0.75, 0.5][this.sequence.next()];
      }
    },
    elem: {x: "phy", a: "fir", c: "phy", d: "hol", b: "col", e: "phy"},
  };

  function wothf_blazing_onhit(data) {
    var stacks = Sim.random("blazingfists", data.chc, data.targets, true);
    if (stacks) {
      Sim.addBuff("blazingfists", {ias: 5, extrams: 5}, {maxstacks: 3, stacks: stacks, duration: 300});
    }
  }
  function wothf_fury_onhit(data) {
    var limit = 9 * Sim.stats.info[data.castInfo.weapon || "mainhand"].speed;
    Sim.addBuff("fistsoffury", undefined, {
      duration: 179,
      tickrate: 12,
      stacks: data.hits,
      maxstacks: Math.ceil(limit),
      targets: data.targets,
      firsttarget: data.firsttarget,
      data: {proc: data.proc, limit: limit},
      ontick: function(data) {
        Sim.damage({coeff: 0.04 * Math.min(data.stacks, data.limit), proc: data.proc});
      },
    });
  }
  function wothf_assimilation_onhit(data) {
    Sim.removeBuff("assimilation");
    Sim.addBuff("assimilation", {damage: 5}, {
      stacks: Math.floor(data.targets + 0.5),
      duration: 300,
    });
  }
  skills.wayofthehundredfists = {
    signature: true,
    offensive: true,
    sequence: new GenSequence("wayofthehundredfists"),
    generate: function(rune) {
      return GenSpirit(12);
    },
    frames: function(rune) {
      return [57, 42, 57.599998][this.sequence.next()];
    },
    speed: function(rune, aps) {
      return GenSpeed(aps * [1.275, 1.175, 1][this.sequence.next()]);
    },
    oncast: function(rune) {
      var onhit = (rune === "c" && wothf_blazing_onhit);
      if (rune === "a") onhit = wothf_fury_onhit;
      switch (this.sequence.step()) {
      case 0:
        Sim.damage({coeff: 1.9, onhit: onhit});
        break;
      case 1:
        if (rune !== "b") {
          Sim.damage({type: "cone", range: 10, coeff: 1.9 / 7, count: 7, onhit: onhit});
        } else {
          Sim.damage({type: "cone", range: 10, coeff: 4.23 / 10, count: 10, onhit: onhit});
        }
        break;
      case 2:
        if (rune === "d") onhit = wothf_assimilation_onhit;
        if (rune === "e") {
          Sim.damage({type: "line", range: 40, radius: 10, speed: 0.6, pierce: true, coeff: 5, proc: 0});
        }
        Sim.damage({type: "area", origin: Math.abs(Sim.target.distance - 5), distance: 5, range: 10, coeff: 1.9, onhit: onhit});
        break;
      }
    },
    proctable: function(rune) {
      return [0.75, 0.09, 0.5][this.sequence.next()];
    },
    elem: {x: "phy", b: "lit", c: "fir", a: "hol", d: "phy", e: "col"},
  };

  function ltk_scar_fix() {
    if (Sim.stats.leg_scarbringer) {
      this.factor = (this.factor || 1) * (1 + 3 * Math.min(Sim.stats.leg_scarbringer, this.targets) / this.targets);
    }
    if (Sim.stats.leg_scarbringer_p6) {
      this.factor = (this.factor || 1) * (1 + 0.01 * Sim.stats.leg_scarbringer_p6 * Math.min(7, this.targets) / this.targets);
    }
  }
  function ltk_vulture_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 181,
      tickrate: 60,
      targets: data.targets,
      firsttarget: data.firsttarget,
      ontick: {coeff: 2.3 / 3, fix: ltk_scar_fix},
    });
  }
  var gnk_time = 0;
  skills.lashingtailkick = {
    offensive: true,
    cost: 50,
    frames: 57.391300,
    speed: function(rune, aps) {
      return aps * (Sim.stats.leg_riveradancers ? 1.5 : 1);
    },
    oncast: function(rune) {
      var dmg = {type: "cone", width: 180, range: 10, coeff: 7.55};
      switch (rune) {
      case "a": dmg.onhit = ltk_vulture_onhit; break;
      case "d":
        dmg = {type: "area", self: true, range: 15, coeff: 8.25};
        break;
      case "b":
        dmg = {type: "line", range: 50, speed: 0.8, radius: 5, pierce: true, coeff: 7.55};
        break;
      case "e":
        dmg.onhit = Sim.apply_effect("stunned", 120);
        break;
      case "c":
        dmg = {type: "area", range: 10, coeff: 7.55, onhit: Sim.apply_effect("chilled", 180)};
        break; 
      }
      if (Sim.stats.leg_scarbringer || Sim.stats.leg_scarbringer_p6) {
        dmg.fix = ltk_scar_fix;
      }
      if (Sim.stats.leg_gyananakashu && !Sim.castInfo().triggered) {
        Sim.pushCastInfo(Sim.extend({}, Sim.castInfo(), {triggered: "leg_gyananakashu", trigExplicit: true}));
        Sim.damage({type: "line", speed: 1, pierce: true, radius: 10, coeff: Sim.stats.leg_gyananakashu * 0.01});
        Sim.popCastInfo();
      }
      return dmg;
    },
    proctable: {x: 0.667, a: 0.5, d: 0.5, b: 0.5, e: 0.667, c: 0.8},
    elem: {x: "phy", a: "fir", d: "phy", b: "fir", e: "lit", c: "col"},
  };

  function tr_balance_fix() {
    if ((Sim.stats.leg_balance || Sim.stats.leg_balance_p6) && this.targets <= 3) {
      this.chc = 100;
    }
  }
  function tr_ontick(data) {
    var ci = Sim.castInfo();
    data.dmg.factor = Sim.stats.info[ci && ci.weapon || "mainhand"].speed * data.buff.params.tickrate / 60;
    Sim.damage(data.dmg);
  }
  function tr_flurry_onexpire(data) {
    var stacks = Sim.getBuff("flurry");
    if (stacks) {
      Sim.removeBuff("flurry");
      Sim.damage({type: "area", range: 15, self: true, coeff: 0.9 * Sim.stats.info.aps * stacks, fix: tr_balance_fix});
    }
  }
  skills.tempestrush = {
    offensive: true,
    channeling: 12,
    cost: function(rune) {
      return (rune === "d" ? 25 : 30) * Sim.stats.info[Sim.curweapon || "mainhand"].speed;
    },
    frames: 57.391300,
    speed: 1,
    oncast: function(rune) {
      var dmg = {type: "area", self: true, range: 7, coeff: 3.9};
      var params = {};
      if (rune === "b" || Sim.stats.leg_warstaffofgeneralquang) {
        params.buffs = {extrams: 25};
      }
      switch (rune) {
      case "d": dmg.coeff = 5; break;
      case "e": params.onexpire = tr_flurry_onexpire; break;
      case "a": dmg.onhit = Sim.apply_effect("knockback", 30); break;
      }
      if (rune === "e") {
        Sim.addBuff("flurry", undefined, {maxstacks: 100});
      }
      if (Sim.stats.leg_balance || Sim.stats.leg_balance_p6) dmg.fix = tr_balance_fix;
      return Sim.channeling("tempestrush", this.channeling, tr_ontick, {dmg: dmg}, params);
    },
    oninit: function(rune) {
      if (rune === "c") {
        Sim.after(15, function zap() {
          if (Sim.getBuff("tempestrush")) {
            Sim.damage({type: "area", range: 20, self: true, coeff: 1.35 / 4 * Sim.stats.info.aps, proc: 0, fix: tr_balance_fix});
          }
          Sim.after(15, zap);
        });
      }
    },
    proctable: 0.25,
    elem: {x: "phy", d: "hol", b: "phy", e: "col", c: "lit", a: "fir"},
  };

  skills.waveoflight = {
    offensive: true,
    cost: function(rune) {
      return 75 * (1 - 0.01 * ((Sim.stats.leg_incensetorchofthegrandtemple_p6 && 50) || Sim.stats.leg_incensetorchofthegrandtemple || 0));
    },
    frames: 58.823528,
    oncast: function(rune) {
      var origin = Math.max(0, Sim.target.distance - 10);
      if (Sim.stats.leg_tzokrinsgaze) {
        origin = 0;
      }
      var factor = 1;
      if (Sim.stats.leg_kyoshirosblade) {
        if (Sim.getTargets((rune === "c" ? 15 : 10), origin) <= 3) {
          factor = 1 + 0.01 * Sim.stats.leg_kyoshirosblade;
        } else {
          factor = 2.5;
        }
      }

      var dmg = {delay: 18, type: "area", origin: origin, range: 10, coeff: 8.35 / 3, count: 3, factor: factor};
      switch (rune) {
      case "a":
        dmg.onhit = Sim.apply_effect("stunned", 60);
        break;
      case "b":
        dmg.type = "line";
        dmg.speed = 2;
        dmg.coeff = 8.3;
        dmg.range = 50;
        dmg.count = 8;
        dmg.fan = 360 / 8;
        dmg.merged = true;
        dmg.angle = 360 / 16;
        delete dmg.delay;
        break;
      case "d":
        dmg.coeff = 10.45 / 3;
        break;
      case "e":
        Sim.damage({type: "waveoflight", range: 50, radius: 10, speed: 1.5, coeff: 8.2, factor: factor, expos: Sim.target.distance - 10, exrange: 10});
        break;
      case "c":
        dmg.coeff = 6.35;
        delete dmg.count;
        dmg.range = 15;
        Sim.addBuff(undefined, undefined, {
          duration: 199,
          tickrate: 30,
          tickinitial: 48,
          ontick: {type: "area", origin: origin, range: 15, coeff: 7.85 / 6, factor: factor},
        });
        break;
      }
      return dmg;
    },
    proctable: {x: 0.111, a: 0.111, b: 0.25, d: 0.111, e: 0.111, c: 0.2},
    elem: {x: "hol", a: "phy", b: "fir", d: "hol", e: "col", c: "lit"},
  };

  function bf_onhit(data) {
    var params = {duration: 180, targets: data.targets, firsttarget: data.firsttarget, status: "blinded"};
    switch (data.castInfo.rune) {
    case "d": params.duration *= 2; break;
    case "c":
      Sim.addBuff("slowed", undefined, {duration: 300, targets: data.targets, firsttarget: data.firsttarget});
      break;
    case "b":
      Sim.addResource(10 * data.targets);
      break;
    case "e":
      params.onexpire = function() {
        Sim.addBuff("cripplinglight", undefined, {
          duration: 300,
          targets: data.targets,
          firsttarget: data.firsttarget,
        });
      };
      break;
    }
    Sim.addBuff("blindingflash", undefined, params);
  }
  skills.blindingflash = {
    secondary: true,
    cooldown: 15,
    weapon: "mainhand",
    frames: 40,
    oncast: function(rune) {
      if (rune === "a") {
        Sim.addBuff("faithinthelight", {damage: 29}, {duration: 180});
      }
      Sim.damage({type: "area", range: 20, self: true, coeff: 0, onhit: bf_onhit});
    },
    elem: "hol",
  };

  skills.breathofheaven = {
    secondary: true,
    cooldown: function(rune) {
      return 15 * (1 - 0.01 * (Sim.stats.leg_eyeofpeshkov || 0));
    },
    frames: 30,
    oncast: function(rune) {
      var amount = (69735 + 91192) * 0.5 + 0.3 * (Sim.stats.healbonus || 0);
      switch (rune) {
      case "a":
        Sim.damage({type: "area", range: 12, self: true, coeff: 5.05});
        break;
      case "b":
        amount = (139469 + 182383) * 0.5 + 0.3 * (Sim.stats.healbonus || 0);
        break;
      case "c":
        Sim.addBuff("blazingwrath", {damage: 10}, {duration: 540});
        break;
      case "d":
        Sim.addBuff("infusedwithlight", undefined, {duration: 300});
        break;
      case "e":
        Sim.addBuff("zephyr", {extrams: 30}, {duration: 180});
        break;
      }
      Sim.healing({type: "area", range: 12, self: true, amount: amount});
    },
    proctable: {a: 0.25},
    elem: "hol",
  };

  skills.serenity = {
    secondary: true,
    cooldown: 16,
    duration: {x: 180, a: 180, e: 180, d: 180, c: 240, b: 180},
    frames: 57.857136,
    oncast: function(rune) {
      var params = {duration: this.duration[rune]};
      if (rune === "e") {
        params.tickrate = 60;
        params.tickinitial = 1;
        params.ontick = {type: "area", range: 20, self: true, coeff: 4.38};
      }
      if (rune === "a") {
        Sim.healing({amount: (93874 + 120695) * 0.5 + 0.4 * (Sim.stats.healbonus || 0)});
      }
      if (rune === "d") {
        Sim.healing({type: "area", range: 45, self: true, amount: 120158 + 0.4 * (Sim.stats.healbonus || 0)});
      }
      Sim.addBuff("serenity", undefined, params);
    },
    proctable: {e: 0.015},
    elem: {x: "hol", a: "hol", e: "phy", d: "hol", c: "hol", b: "hol"},
  };

  skills.innersanctuary = {
    cooldown: 20,
    frames: 57.599991,
    weapon: "mainhand",
    oncast: function(rune) {
      var buffs = {dmgred: 55};
      var params = {duration: 360};
      switch (rune) {
      case "b":
        params.duration = 480;
        break;
      case "e":
        Sim.addBuff("forbiddenpalace", undefined, {
          status: "slowed",
          targets: Sim.getTargets(11, Sim.target.distance),
          aura: true,
          duration: 360,
        });
        break;
      case "d":
        Sim.addBuff("safehaven", undefined, {
          duration: 360,
          tickrate: 60,
          tickinitial: 1,
          ontick: function() {
            Sim.healing({type: "area", range: 11, self: true, amount: 35779 + (Sim.stats.regen || 0) * 0.07});
          },
        });
        break;
      case "a":
        Sim.healing({type: "area", range: 11, self: true, amount: 107284 + 0.28 * (Sim.stats.healbonus || 0)});
        break;
      }
      if (Sim.stats.leg_themindseye) {
        buffs.spiritregen = Sim.stats.leg_themindseye;
      }
      Sim.addBuff("innersanctuary", buffs, params);
    },
    elem: "hol",
  };

  function ds_barrage_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      duration: 121,
      tickrate: 6,
      ontick: {coeff: 9.75 / 20},
    });
  }
  skills.dashingstrike = {
    offensive: true,
    cooldown: 8,
    charges: {x: 2, b: 2, c: 2, d: 3, e: 2, a: 2},
    frames: 20,
    cost: function(rune) {
      return (Sim.stats.set_storms_4pc ? 75 : 0);
    },
    precast: function(rune, dry) {
      if (!Sim.stats.set_storms_4pc) return true;
      var cost = Sim.trigCost("dashingstrike", rune, dry);
      if (cost !== false) return {cost: cost};
      var cd = Sim.trigCooldown("dashingstrike", rune, dry);
      return (cd === false ? false : {cooldown: cd});
    },
    oncast: function(rune) {
      var dmg = {type: "area", self: true, range: 10, coeff: 3.7};
      if (Sim.getBuff("storms_6pc_ds")) {
        dmg.coeff = 600;
      }
      switch (rune) {
      case "b":
        Sim.addBuff("wayofthefallingstar", {extrams: 20}, {duration: 240});
        break;
      case "c":
        Sim.addBuff("blindingspeed", {dodge: 40}, {duration: 240});
        break;
      case "e":
        Sim.addBuff("radiance", {ias: 15}, {duration: 240});
        break;
      case "a":
        dmg.onhit = ds_barrage_onhit;
        break;
      }
      return dmg;
    },
    proctable: 0.2,
    elem: {x: "phy", b: "hol", c: "col", d: "lit", e: "fir", a: "phy"},
  };

  function ep_onhit(data) {
    var params = {
      duration: 540,
      targets: data.targets,
      firsttarget: data.firsttarget,
      tickrate: 30,
      tickinitial: 1,
      ontick: {coeff: 12 / 18},
    };
    var buffs;
    switch (Sim.stats.skills.explodingpalm) {
    case "c":
      buffs = {dmgtaken: 15};
      break;
    case "b":
      delete params.ontick;
      delete params.tickrate;
      delete params.tickinitial;
      break;
    case "e":
      params.ontick.coeff = 18.75 / 18;
      break;
    }
    Sim.addBuff("explodingpalm", buffs, params);
  }
  Sim.apply_palm = function(count, firsttarget) {
    Sim.pushCastInfo({
      skill: "explodingpalm",
      rune: Sim.stats.skills.explodingpalm || "x",
      elem: skills.explodingpalm.elem[Sim.stats.skills.explodingpalm || "x"],
      weapon: Sim.curweapon,
      castId: Sim.getCastId(),
    });
    ep_onhit({targets: count || 1, firsttarget: (firsttarget === undefined ? "new" : firsttarget)});
    Sim.popCastInfo();
  };
  function ep_explode(data) {
    if (data.castInfo && data.castInfo.rune === "d") {
      Sim.addResource(15 * data.targets);
    }
    if (Sim.stats.leg_gungdogear && Sim.apply_palm) {
      Sim.apply_palm(data.targets);
    }
  }
  Sim.explode_palm = function(target) {
    var damage = {type: "area", range: 15, coeff: 27.7, onhit: ep_explode};
    switch (Sim.stats.skills.explodingpalm) {
    case "b": damage.coeff = 63.05; break;
    case "e": damage.coeff = 32.6 / 6; damage.count = 6; break;
    }
    if (Sim.stats.leg_thefistofazturrasq) {
      damage.coeff *= 1 + 0.01 * Sim.stats.leg_thefistofazturrasq;
    }
    if (Sim.stats.leg_thefistofazturrasq_p2) {
      damage.coeff *= 1 + 0.01 * Sim.stats.leg_thefistofazturrasq_p2;
    }
    if (Sim.stats.leg_thefistofazturrasq_p6) {
      damage.coeff *= 1 + 0.01 * Sim.stats.leg_thefistofazturrasq_p6;
    }
    Sim.pushCastInfo(Sim.getBuffCastInfo("explodingpalm", target));
    Sim.damage(damage);
    Sim.popCastInfo();
  };
  skills.explodingpalm = {
    offensive: true,
    cost: 40,
    frames: function(rune) {
      return (Sim.stats.info.weaponClass === "fist" ? 57.142849 : 57);
    },
    oncast: function(rune) {
      return {targets: (rune === "a" ? 2 : 1), firsttarget: "new", coeff: 0, onhit: ep_onhit};
    },
    oninit: function(rune) {
      Sim.register("onkill", function(data) {
        if (Sim.getBuff("explodingpalm", data.target)) {
          Sim.explode_palm(data.target);
        }
      });
    },
    proctable: 0.25,
    elem: {x: "phy", c: "phy", d: "hol", b: "col", a: "lit", e: "fir"},
  };

  function sw_ontick(data) {
    var dmg = {type: "area", self: true, range: 10, coeff: 1.05};
    switch (data.rune) {
    case "e":
      data.freeze = (data.freeze || 0) + 1;
      if (data.freeze >= 12) {
        dmg.onhit = Sim.apply_effect("frozen", 120);
        data.freeze = 0;
      }
      break;
    case "a":
      dmg.coeff = 1.45;
      break;
    case "b":
      dmg.range = 14;
      break;
    }
    dmg.coeff *= data.stacks;
    Sim.damage(dmg);
  }
  skills.sweepingwind = {
    offensive: true,
    secondary: true,
    cost: 75,
    frames: function(rune) {
      return (Sim.stats.info.weaponClass === "dualwield_sf" ? 54 : 58);
    },
    oncast: function(rune) {
      if (Sim.getBuff("sweepingwind")) {
        Sim.refreshBuff("sweepingwind");
        return;
      }
      var params = {
        duration: 480,
        tickrate: 15,
        tickinitial: 1,
        maxstacks: 3,
        data: {rune: rune},
        ontick: sw_ontick,
      };
      if (Sim.stats.leg_vengefulwind) params.maxstacks += 3;
      if (Sim.stats.leg_vengefulwind_p2) params.maxstacks += Sim.stats.leg_vengefulwind_p2;
      Sim.addBuff("sweepingwind", undefined, params);
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.watchBuff("sweepingwind", function(data) {
          if (data.stacks >= 3) {
            Sim.addBuff("innerstorm", {spiritregen: 8});
          } else {
            Sim.removeBuff("innerstorm");
          }
        });
      }
      var nextStack = 0;
      Sim.register("onhit_proc", function(data) {
        var stacks = Sim.getBuff("sweepingwind");
        if (!stacks) return;
        if (Sim.time >= nextStack && Sim.random("sweepingwind", data.proc * data.chc, data.targets * data.count)) {
          Sim.addBuff("sweepingwind", undefined, {stacks: 1});
          nextStack = Sim.time + 30;
        } else {
          Sim.refreshBuff("sweepingwind", 360);
        }
        if (rune === "c" && stacks >= 3) {
          for (var i = Sim.random("cyclone", data.proc * data.chc, data.targets * data.count, true); i > 0; --i) {
            Sim.addBuff(undefined, undefined, {
              duration: 180,
              tickrate: 36,
              tickinitial: 1,
              ontick: {coeff: 0.95},
            });
          }
        }
      });
    },
    elem: {x: "phy", e: "col", a: "phy", b: "fir", d: "hol", e: "lit"},
  };

  skills.cyclonestrike = {
    offensive: true,
    cost: {x: 50, d: 26, b: 50, a: 50, e: 50, c: 50},
    frames: 57.599995,
    oncast: function(rune) {
      var dmg = {delay: 3, type: "area", self: true, range: 24, cap: 16, coeff: 2.61, onhit: Sim.apply_effect("knockback", 30)};
      switch (rune) {
      case "b": dmg.range = 34; break;
      case "a": dmg.coeff = 4.54; break;
      case "e": dmg.onhit = Sim.apply_effect("frozen", 90); break;
      case "c":
        Sim.healing({type: "area", range: 24, self: true, amount: 31036 + 0.17 * (Sim.stats.healbonus || 0)});
        break;
      }
      return dmg;
    },
    proctable: 0.125,
    elem: {x: "hol", d: "lit", b: "hol", a: "fir", e: "col", c: "hol"},
  };

  function sss_onhit(data) {
    switch (data.castInfo.rune) {
    case "b":
      Sim.addBuff(undefined, undefined, {
        duration: 181,
        tickrate: 30,
        ontick: {coeff: 1.05},
        targets: data.targets,
        firsttarget: data.firsttarget,
      });
      break;
    case "c":
      Sim.addBuff("frozen", undefined, {duration: 420, targets: data.targets, firsttarget: data.firsttarget});
      break;
    }
    if (Sim.stats.leg_madstone) {
      Sim.apply_palm(data.targets, data.firsttarget);
    }
  }
  skills.sevensidedstrike = {
    offensive: true,
    frames: 78,
    duration: 78,
    speed: 1,
    cost: {x: 50, a: 50, b: 50, d: 50, e: 50},
    cooldown: function(rune) {
      return (rune === "d" ? 14 : 30) * (1 - 0.01 * (Sim.stats.leg_theflowofeternity_p2 || Sim.stats.leg_theflowofeternity || 0));
    },
    oncast: function(rune) {
      var triggered = Sim.castInfo().triggered;
      var params = {
        duration: (!triggered && Sim.stats.leg_lionsclaw ? 72 : 61),
        tickrate: (!triggered && Sim.stats.leg_lionsclaw ? 5 : 9),
        tickinitial: 6,
        data: {target: -1, rune: rune},
        ontick: function(data) {
          var list = Sim.target.list();
          var target = list[0];
          for (var i = 0; i < list.length; ++i) {
            if (list[i] > data.target) {
              target = list[i];
              break;
            }
          }
          data.target = target;
          var dmg = {coeff: 8.11, onhit: sss_onhit, firsttarget: data.target};
          if (data.rune === "a") {
            dmg.coeff = 82.85 / 7;
          } else if (data.rune === "e") {
            dmg.type = "area";
            dmg.range = 7;
            dmg.coeff = 8.77;
          }
          if (Sim.stats.set_uliana_4pc && !triggered) {
            dmg.coeff *= 7.77 * (7 + (Sim.stats.leg_lionsclaw ? 7 : 0));
          }
          Sim.damage(dmg);
        },
      };
      Sim.addBuff(Sim.castInfo().triggered ? undefined : "sevensidedstrike", undefined, params);
    },
    proctable: {x: 0.57, a: 0.57, b: 0.087, c: 0.57, d: 0.34, e: 0.285},
    elem: {x: "phy", a: "lit", b: "fir", c: "col", d: "phy", e: "hol"},
  };

  var ma_tick = {};
  ma_tick.x = function(data) {
    Sim.damage({coeff: 1.3 * Sim.stats.info.aps, pet: true, elem: data.elem});
  };
  ma_tick.b = function(data) {
    Sim.damage({coeff: 1.3 * Sim.stats.info.aps, pet: true, elem: data.elem, onhit: Sim.apply_effect("chilled", 180)});
  };
  ma_tick.a = function(data) {
    data.counter = (data.counter || 0) + 1;
    if (data.counter >= 8) {
      data.counter = 0;
      Sim.damage({type: "area", range: 5, elem: "fir", pet: true, coeff: 0.8 * Sim.stats.info.aps});
      Sim.addBuff(undefined, undefined, {
        duration: 121,
        tickrate: 60,
        ontick: {type: "area", range: 5, elem: "fir", pet: true, coeff: 0.4 * Sim.stats.info.aps},
      });
    } else {
      return ma_tick.x(data);
    }
  };
  ma_tick.d = function(data) {
    data.counter = (data.counter || 0) + 1;
    if (data.counter >= 8) {
      data.counter = 0;
      // whiff
    } else {
      return ma_tick.x(data);
    }
  };
  ma_tick.e = ma_tick.x;
  ma_tick.c = function(data) {
    data.counter = (data.counter || 0) + 1;
    if (data.counter >= 8) {
      data.counter = 0;
      Sim.damage({delay: 30, coeff: 0.6, elem: "phy", pet: true});
    } else {
      return ma_tick.x(data);
    }
  };
  skills.mystically = {
    offensive: true,
    weapon: "mainhand",
    frames: 40,
    pet: true,
    cooldown: {x: 30, b: 30, a: 30, d: 30, e: 50, c: 30},
    precast: function(rune) {
      return !!Sim.getBuff("mystically");
    },
    distance: 5,
    oncast: function(rune) {
      if (rune === "x" && !Sim.stats.set_inna_6pc) {
        // does that even work?
        Sim.addBuff("basically_active", {dmgmul: {skills: ["mystically"], percent: 50}}, {duration: 600});
      }
      if (rune === "b" || Sim.stats.set_inna_6pc) {
        Sim.addBuff("waterally_active", undefined, {
          duration: 90,
          tickrate: 12,
          ontick: {count: Sim.getBuff("waterally"), type: "line", origin: 5, range: 10, radius: 5,
            elem: this.elem.b, pierce: true, coeff: 6.25 * Sim.stats.info.aps, onhit: Sim.apply_effect("frozen", 180)},
        });
        Sim.delayBuff("waterally", 90);
      }
      if (rune === "a" || Sim.stats.set_inna_6pc) {
        Sim.addBuff("fireally_active", undefined, {
          duration: 301,
          tickrate: 30,
          ontick: {count: Sim.getBuff("fireally"), type: "area", range: 4, coeff: 2.9, elem: this.elem.a},
        });
        Sim.delayBuff("fireally", 330);
      }
      if (rune === "d" || Sim.stats.set_inna_6pc) {
        Sim.addResource(100 * Sim.getBuff("airally"));
      }
      if (rune === "e" || Sim.stats.set_inna_6pc) {
        Sim.removeBuff("enduringally", 1);
      }
      if (rune === "c" || Sim.stats.set_inna_6pc) {
        Sim.addBuff("earthally_active", undefined, {
          duration: 481,
          tickrate: 12,
          ontick: {count: Sim.getBuff("earthally"), type: "area", range: 7, coeff: 0.76,
            elem: this.elem.c, onhit: Sim.apply_effect("knockback", 30)},
        });
        Sim.delayBuff("earthally", 492);
      }
    },
    spawn: function(rune, count) {
      var name = {x: "basically", b: "waterally", a: "fireally", d: "airally", e: "enduringally", c: "earthally"}[rune];
      var stacks = Sim.getBuff(name);
      var buffs;
      var elem = this.elem[rune];
      var params = {
        maxstacks: (Sim.stats.leg_thecrudestboots ? 2 : 1),
        refresh: false,
        tickrate: 40,
        speed: true,
        data: {rune: rune, elem: this.elem[rune]},
        ontick: ma_tick[rune],
        onexpire: function(data) {
          Sim.after(300, function() {
            skills.mystically.spawn(rune, 1);
          });
        },
      };
      if (stacks >= params.maxstacks) return;
      params.stacks = params.maxstacks - stacks;
      if (count !== undefined) {
        params.stacks = Math.min(count, params.stacks);
      }
      var mul = (Sim.stats.set_inna_2pc ? 2 : 1);
      switch (rune) {
      case "c": buffs = {damage: 10 * mul}; break;
      case "d": buffs = {spiritregen: 4 * mul}; break;
      case "e": buffs = {regen: (10728 + (Sim.stats.regen || 0) * 0.07) * mul}; break;
      case "c": buffs = {life: 20 * mul}; break;
      }
      Sim.petattack(name, buffs, params);
    },
    oninit: function(rune) {
      if (rune === "x" && !Sim.stats.set_inna_6pc) this.spawn("x");
      if (rune === "b" || Sim.stats.set_inna_6pc) this.spawn("b");
      if (rune === "a" || Sim.stats.set_inna_6pc) this.spawn("a");
      if (rune === "d" || Sim.stats.set_inna_6pc) this.spawn("d");
      if (rune === "e" || Sim.stats.set_inna_6pc) this.spawn("e");
      if (rune === "c" || Sim.stats.set_inna_6pc) this.spawn("c");
      Sim.after(30, function checkair() {
        var stacks = Sim.getBuff("airally");
        if (stacks) Sim.damage({type: "area", range: 10, coeff: 0.1, pet: true, elem: "phy"});
        Sim.after(30, checkair);
      });
      Sim.metaBuff("mystically", ["basically", "waterally", "fireally", "airally", "enduringally", "earthally"]);
    },
    elem: {x: "phy", b: "col", a: "fir", d: "phy", e: "phy", c: "phy"},
  };

  skills.epiphany = {
    secondary: true,
    frames: 56.666664,
    cooldown: 60,
    oncast: function(rune) {
      var params = {duration: 900};
      var buffs = {spiritregen: 20};
      switch (rune) {
      case "a": buffs.dmgred = 50; break;
      case "c": buffs.spiritregen = 45; break;
      }
      Sim.addBuff("epiphany", buffs, params);
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("oncast", function(data) {
          if (!Sim.getBuff("epiphany")) return;
          if (data.generate) {
            Sim.damage({type: "line", speed: 1, pierce: true, radius: 8, coeff: 3.53, proc: 0.0931});
          } else {
            Sim.damage({targets: 6, coeff: 3.53, proc: 0.0831});
          }
        });
      }
      if (rune === "b") {
        Sim.register("oncast", function(data) {
          Sim.healing({type: "area", range: 30, self: true, amount: 16093 + 0.04 * (Sim.stats.healbonus || 0)});
        });
      }
    },
    elem: {x: "hol", a: "phy", e: "lit", b: "col", c: "hol", d: "fir"},
  };

  skills.mantraofsalvation = {
    secondary: true,
    weapon: "mainhand",
    frames: 40,
    cost: function(rune) {
      return 50 * (Sim.stats.passives.chantofresonance ? 0.5 : 1);
    },
    oncast: function(rune) {
      Sim.addBuff("mantraofsalvation_active", {resist_percent: 20}, {duration: 180});
    },
    oninit: function(rune) {
      var buffs = {resist_percent: 20};
      if (Sim.stats.set_inna_2pc) {
        buffs.resist_percent += 20;
      }
      switch (rune) {
      case "c": buffs.armor_percent = 20; break;
      case "d": buffs.extrams = 10; break;
      case "b": buffs.resist_percent += 20; break;
      case "a": buffs.dodge = 35; break;
      }
      Sim.addBuff("mantraofsalvation", buffs);
    },
    elem: "phy",
  };

  skills.mantraofretribution = {
    secondary: true,
    weapon: "mainhand",
    frames: 40,
    cost: function(rune) {
      return 50 * (Sim.stats.passives.chantofresonance ? 0.5 : 1);
    },
    oncast: function(rune) {
      Sim.addBuff("mantraofretribution_active", undefined, {duration: 180});
    },
    oninit: function(rune) {
      var buffs = {};
      switch (rune) {
      case "b": buffs.ias = 10/* * (Sim.stats.set_inna_2pc ? 2 : 1)*/; break;
      }
      Sim.addBuff("mantraofretribution", buffs);
      Sim.register("ongethit", function() {
        var amount = 1.01;
        if (Sim.getBuff("mantraofretribution_active")) amount += 1.01;
        if (Sim.stats.set_inna_2pc) amount += 1.01;
        if (rune === "a") amount += 1.01;

        Sim.damage({coeff: amount});
        if (rune === "c") {
          if (Sim.random("indignation", 0.2)) Sim.addBuff("stunned", undefined, {duration: 180});
        } else if (rune === "d") {
          Sim.addResource(3);
        } else if (rune === "d") {
          if (Sim.random("collateraldamage", 0.75)) Sim.damage({type: "area", range: 8, coeff: 1.01});
        }
      });
    },
    elem: {x: "hol", a: "fir", b: "hol", c: "hol", d: "hol", e: "hol"},
  };

  skills.mantraofhealing = {
    secondary: true,
    weapon: "mainhand",
    frames: 40,
    cost: function(rune) {
      return 50 * (Sim.stats.passives.chantofresonance ? 0.5 : 1);
    },
    oncast: function(rune) {
      Sim.addBuff("mantraofhealing_active", undefined, {duration: 180});
    },
    oninit: function(rune) {
      var buffs = {regen: 10728.42 + (Sim.stats.regen || 0) * 0.07};
      if (Sim.stats.set_inna_2pc) {
        buffs.regen *= 2;
      }
      switch (rune) {
      case "a": buffs.regen *= 2; break;
      case "d": buffs.spiritregen = 3; break;
      case "c": buffs.life = 20; break;
      }
      Sim.addBuff("mantraofhealing", buffs);
    },
    elem: "hol",
  };

  skills.mantraofconviction = {
    secondary: true,
    weapon: "mainhand",
    frames: 40,
    cost: function(rune) {
      return 50 * (Sim.stats.passives.chantofresonance ? 0.5 : 1);
    },
    oncast: function(rune) {
      Sim.addBuff("mantraofconviction_active", {dmgtaken: 8}, {duration: 180});
    },
    oninit: function(rune) {
      var buffs = {dmgtaken: 8};
      if (Sim.stats.set_inna_2pc) {
        buffs.dmgtaken += 8;
      }
      var params = undefined;
      switch (rune) {
      case "a": buffs.dmgtaken += 4; break;
      case "c": params = {status: "slowed"}; break;
      case "b":
        params = {
          tickrate: 30,
          ontick: {type: "area", self: true, range: 30, coeff: 0.19},
        };
        break;
      case "d":
        Sim.register("onkill", function(data) {
          Sim.addBuff("annihilation", {extrams: 30}, {duration: 180});
        });
        break;
      }
      Sim.addBuff("mantraofconviction", buffs, params);
    },
    elem: {x: "phy", a: "phy", e: "phy", c: "phy", d: "phy", b: "hol"},
  };

  Sim.passives = {
    resolve: function() {
      Sim.register("onhit", function(data) {
        Sim.addBuff("resolve", {edmgred: 20}, {
          duration: 240,
          targets: data.targets,
          firsttarget: data.firsttarget,
        });
      });
    },
    fleetfooted: {extrams: 10},
    exaltedsoul: {maxspirit: 50, spiritregen: 4},
    transcendence: {lifespirit: 429},
    chantofresonance: function() {
      if (Sim.stats.skills.mantraofsalvation ||
          Sim.stats.skills.mantraofretribution ||
          Sim.stats.skills.mantraofhealing ||
          Sim.stats.skills.mantraofconviction) {
        Sim.addBaseStats({spiritregen: 4});
      }
    },
    seizetheinitiative: function() {
      Sim.register("onhit", function(data) {
        if (Sim.countTargetsAbove(0.75, data)) {
          Sim.addBuff("seizetheinitiative", {ias: 30}, {duration: 240});
        }
      });
    },
    theguardianspath: function() {
      if (Sim.stats.info.mainhand.slot == "onehand" && Sim.stats.info.offhand && Sim.stats.info.offhand.slot == "onehand") {
        Sim.addBaseStats({dodge: 35});
      } else if (Sim.stats.info.mainhand.slot == "twohand") {
        Sim.addBaseStats({resourcegen: 15});
      }
    },
    sixthsense: {nonphys: 25},
    determination: function() {
      Sim.after(18, function update() {
        var targets = Math.round(Sim.getTargets(12, Sim.target.distance));
        Sim.setBuffStacks("determination", {damage: 4}, Math.min(5, targets));
        Sim.after(18, update);
      });
    },
    relentlessassault: function() {
      Sim.register("updatestats", function(data) {
        var count = data.stats.countStatus("blinded", "frozen", "stunned");
        if (count) data.stats.add("dmgmul", 20 * count / Sim.target.count);
      });
    },
    beaconofytar: {cdr: 20},
    alacrity: {},
    harmony: function() {
      Sim.register("updatestats", function(data) {
        var stats = data.stats;
        var single = (stats.resphy || 0) + (stats.resfir || 0) + (stats.rescol || 0) +
                     (stats.respsn || 0) + (stats.resarc || 0) + (stats.reslit || 0);
        single *= 0.4;
        stats.add("resphy", single - (stats.resphy || 0) * 0.4);
        stats.add("resfir", single - (stats.resfir || 0) * 0.4);
        stats.add("rescol", single - (stats.rescol || 0) * 0.4);
        stats.add("respsn", single - (stats.respsn || 0) * 0.4);
        stats.add("resarc", single - (stats.resarc || 0) * 0.4);
        stats.add("reslit", single - (stats.reslit || 0) * 0.4);
      });
    },
    combinationstrike: function() {
      Sim.register("oncast", function(data) {
        if (skills[data.skill] && skills[data.skill].signature) {
          Sim.addBuff("cs_" + data.skill, {damage: 10}, {duration: 180});
        }
      });
      Sim.metaBuff("combinationstrike", [
        "cs_fistsofthunder",
        "cs_deadlyreach",
        "cs_cripplingwave",
        "cs_wayofthehundredfists",
      ]);
    },
    neardeathexperience: {},
    unity: function() {
      var stacks = (Sim.params.unity && Sim.params.unity[0] && Sim.params.unity[0][0] || 1);
      if (stacks) {
        Sim.addBuff("unity", {damage: 5}, {stacks: stacks, maxstacks: 4});
      }
    },
    momentum: function() {
    },
    mythicrhythm: function() {
      Sim.register("oncast", function(data) {
        if (skills[data.skill] && skills[data.skill].sequence) {
          if (skills[data.skill].sequence.next() === 2) {
            Sim.addBuff("mythicrhythm");
          }
        } else if (data.offensive && data.cost && Sim.getBuff("mythicrhythm")) {
          Sim.removeBuff("mythicrhythm");
          return {percent: 40};
        }
      });
    },
  };

})();






















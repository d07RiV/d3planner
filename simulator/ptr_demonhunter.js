(function() {
  var Sim = Simulator;

  var skills = {};
  Sim.skills = skills;

  var buriza_next = 0;
  function _buriza() {
    if (Sim.time >= buriza_next) {
      buriza_next = Sim.time + 30;
      return Sim.stats.leg_burizadokyanon;
    }
  }

  // lots of code for something nobody will likely ever use, sigh
  var ha_cache = {};
  function ha_compute(rune) {
    var data = {rune: rune};
    data.distance = Sim.target.distance;
    data.radius = Sim.target.radius;
    data.count = Sim.target.count;
    data.size = Sim.target.size;
    data.cirri = 0.01 * (Sim.stats.leg_theninthcirrisatchel || 0);
    data.buriza = (rune !== "b" && _buriza() || 0);
    if (rune === "e") data.chc = 0.01 * Sim.stats.final.chc;
    var str = JSON.stringify(data);
    if (!ha_cache[str]) ha_cache[str] = do_compute(data);
    return ha_cache[str];

    function do_compute(data) {
      var rng = new Math.seedrandom("hungeringarrow");
      function trial(data) {
        var targets = [{x: 0, y: 0}];
        for (var i = 1; i < data.count; ++i) {
          var x, y;
          do {
            x = (rng() * 2 - 1) * data.radius;
            y = (rng() * 2 - 1) * data.radius;
          } while (x * x + y * y > data.radius * data.radius);
          targets.push({x: x, y: y});
        }
        function sim(data, targets, rune, pos, dir) {
          function get_impact(t0) {
            function impact_to(t) {
              var x = t.x - pos.x, y = t.y - pos.y;
              var cp = Math.abs(x * dir.y - y * dir.x);
              if (cp > data.size - 1e-6) return {first: 1e+12, second: 1e+12};
              var dp = x * dir.x + y * dir.y;
              var len = Math.sqrt(data.size * data.size - cp * cp);
              if (dp - len < 1e-6) return {first: 1e+12, second: 1e+12};
              return {first: (dp - len) / 1.3 + t0, second: (dp - len) / 1.3 + t0};
            }
            var best = impact_to(targets[0]);
            for (var i = 1; i < targets.length; ++i) {
              var cur = impact_to(targets[i]);
              if (cur.first < best.first) best = cur;
            }
            return best;
          }
          function get_closest() {
            var index = 0;
            var x = targets[0].x - pos.x, y = targets[0].y - pos.y;
            var d2 = x * x + y * y;
            for (var i = 1; i < targets.length; ++i) {
              x = targets[i].x - pos.x;
              y = targets[i].y - pos.y;
              var c2 = x * x + y * y;
              if (c2 < d2) {
                d2 = c2;
                index = i;
              }
            }
            return {pos: targets[index], d2: d2};
          }
          function get_aoe() {
            var count = 0;
            for (var i = 0; i < targets.length; ++i) {
              var x = targets[i].x - pos.x, y = targets[i].y - pos.y;
              if (x * x + y * y < 100) {
                ++count;
              }
            }
            return count;
          }

          var impact = get_impact(0);
          var finish = 120 / 1.3;
          var seek = (rng() + 1) * 18;
          var prev = 0;
          var range = 11;
          var index = 0;
          var damage = 1.55;
          var result = {count: 0, damage: 0, delay: 0, distance: 0};
          var chance = 0.35 + data.cirri + (rune === "d" ? 0.15 : 0);
          while (impact.first < finish || seek < finish) {
            if (impact.first < seek) {
              pos.x += dir.x * 1.3 * (impact.second - prev);
              pos.y += dir.y * 1.3 * (impact.second - prev);
              prev = impact.second;
              result.damage += damage;
              if (!index) {
                result.delay = Math.floor(impact.first);
                var to = get_closest();
                var x = to.pos.x + data.distance, y = to.pos.y;
                result.distance = Math.sqrt(x * x + y * y);
              }
              ++result.count;
              range = 20;
              if (rune === "e") {
                result.damage += get_aoe() * data.chc * 0.6;
              }
              if (!(rune && index < data.buriza) && rng() > chance) break;
              ++index;
              if (rune === "b" && index === 1) {
                var obj = sim(data, targets, false, {x: pos.x, y: pos.y}, {x: 0.642788 * dir.x - 0.766044 * dir.y, y: 0.766044 * dir.x + 0.642788 * dir.y});
                result.count += obj.count;
                result.damage += obj.damage;
              }
              if (rune === "c") {
                damage += 0.7 * 1.55;
              }
              impact = get_impact(prev);
            } else {
              pos.x += dir.x * 1.3 * (seek - prev);
              pos.y += dir.y * 1.3 * (seek - prev);
              prev = seek;
              var to = get_closest();
              if (to.d2 < range * range) {
                var len = Math.sqrt(to.d2);
                dir.x = (to.pos.x - pos.x) / len;
                dir.y = (to.pos.y - pos.y) / len;
                impact = get_impact(prev);
              }
              seek += (rng() + 1) * 18;
            }
          }
          return result;
        }
        return sim(data, targets, data.rune, {x: -data.distance, y: 0}, {x: 1, y: 0});
      }
      var avg = {};
      for (var i = 0; i < 5000; ++i) {
        var cur = trial(data);
        for (var k in cur) {
          avg[k] = (avg[k] || 0) + cur[k];
        }
      }
      for (var k in avg) avg[k] /= 5000;
      return avg;
    }
  }     

  function VarFrames(rune) {
    switch (Sim.stats.info.weaponClass) {
    case "bow": return 57.777767;
    case "crossbow": return 57.391285;
    case "handcrossbow": return 56.842083;
    case "dualwield": return 56.842075;
    default: return 57.692299;
    }
  }

  function GenSpeed(rune, aps) {
    return aps * (Sim.stats.leg_hunterswrath ? 1.3 : 1);
  }

  skills.hungeringarrow = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "a" ? 7 : 4) + (Sim.stats.set_unhallowed_2pc ? 2 : 0);
    },
    frames: VarFrames,
    speed: GenSpeed,
    oncast: function(rune) {
      var data = ha_compute(rune);
      if (data.count) {
        return {delay: data.delay, distance: data.distance, coeff: data.damage / data.count, count: data.count};
      }
    },
    proctable: {x: 0.65, d: 0.55, a: 0.65, b: 0.59, c: 0.65, e: 0.65},
    elem: {x: "phy", d: "phy", a: "fir", b: "lit", c: "col", e: "phy"},
  };

  var es_target = 0;
  function es_onhit(data) {
    var rune = (data.castInfo && data.castInfo.rune || "x");
    var targ = Sim.target.list();
    var tlist = [targ[0]];
    var tcount = (rune === "b" ? 4 : 2) * data.targets;
    if (targ.length > 1) for (var i = tcount; i >= 1; --i) {
      tlist.push(targ[1 + es_target]);
      es_target = (es_target + 1) % (targ.length - 1);
    }

    var buffs = (Sim.stats.leg_odysseysend && {dmgtaken: Sim.stats.leg_odysseysend});
    var params = {
      status: "slowed",
      duration: (rune === "a" ? 240 : 120),
      targets: tlist,
    };
    if (rune === "c") {
      params.tickrate = 60;
      params.ontick = {coeff: 0.4};
    }
    Sim.addBuff("entanglingshot", buffs, params);
    Sim.refreshBuff("entanglingshot", params.duration);
  }
  skills.entanglingshot = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "d" ? 7 : 4) + (Sim.stats.set_unhallowed_2pc ? 2 : 0);
    },
    frames: VarFrames,
    speed: GenSpeed,
    oncast: function(rune) {
      return {pierce: _buriza(), type: "line", speed: 1.6, coeff: 2, onhit: es_onhit};
    },
    proctable: {x: 1, b: 1, c: 0.4, a: 1, d: 1, e: 1},
    elem: {x: "phy", b: "phy", c: "lit", a: "col", d: "fir", e: "phy"},
  };

  function bolas_bp_onhit(data) {
    if (Sim.random("bitterpill", 0.15)) {
      Sim.addResource(2, "disc");
    }
  }
  skills.bolas = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "c" ? 7 : 4) + (Sim.stats.set_unhallowed_2pc ? 2 : 0);
    },
    frames: 56.666666,
    speed: GenSpeed,
    oncast: function(rune) {
      var delay = (Sim.stats.leg_emimeisduffel ? 0 : 60);
      var pierce = _buriza();
      switch (rune) {
      case "x": return {delay: delay, pierce: pierce, type: "line", speed: 1.6, coeff: 1.6, area: 14, areacoeff: 1.1};
      case "a": return {delay: delay, pierce: pierce, type: "line", speed: 1.6, coeff: 1.6, area: 20, areacoeff: 1.1};
      case "c": return {delay: delay, pierce: pierce, type: "line", speed: 1.6, coeff: 1.6, area: 14, areacoeff: 1.1};
      case "b": return {delay: delay, pierce: pierce, type: "line", speed: 1.6, coeff: 1.6, count: 3, fan: 20, onhit: Sim.apply_effect("frozen", 60, 0.5)};
      case "d": return {delay: delay, pierce: pierce, type: "line", speed: 1.6, coeff: 1.6, area: 14, areacoeff: 1.1, onhit: bolas_bp_onhit};
      case "e": return {delay: delay * 2, pierce: pierce, type: "line", speed: 1.6, coeff: 2.16, area: 14, areacoeff: 1.49};
      }
    },
    proctable: {x: 0.4, a: 0.333, c: 0.4, b: 0.4, d: 0.4, e: 0.4},
    elem: {x: "fir", a: "fir", c: "lit", b: "col", d: "lit", e: "fir"},
  };

  skills.evasivefire = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "e" ? 7 : 4) + (Sim.stats.set_unhallowed_2pc ? 2 : 0);
    },
    frames: VarFrames,
    speed: GenSpeed,
    oncast: function(rune) {
      if (Sim.getTargets(25, Sim.target.distance)) {
        if (rune === "a") {
          Sim.addBuff("hardened", {armor_percent: 25}, {duration: 180});
        }
        if (rune === "c") {
          Sim.damage({delay: 36, type: "area", range: 12, self: true, coeff: 1.5});
        }
      }
      Sim.damage({coeff: 2});
      if (Sim.target.count > 1) {
        Sim.damage({coeff: (rune === "b" ? 2 : 1), targets: Math.min(2, Sim.target.count - 1)});
      }
    },
    proctable: {x: 0.333, a: 0.333, c: 0.277, b: 0.333, e: 0.333, d: 0.333},
    elem: {x: "phy", a: "phy", c: "phy", b: "fir", e: "col", d: "lit"},
  };

  function grenade_cold_onhit(data) {
    Sim.addBuff("coldgrenade", undefined, {
      duration: 180,
      tickrate: 30,
      ontick: {type: "area", range: 6, coeff: 0.2 * (Sim.stats.passives.grenadier ? 1.1 : 1), onhit: Sim.apply_effect("chilled", 30), tags: ["grenade"]},
    });
  }
  skills.grenade = {
    signature: true,
    offensive: true,
    generate: function(rune) {
      return (rune === "d" ? 7 : 4) + (Sim.stats.set_unhallowed_2pc ? 2 : 0);
    },
    frames: 56.470554,
    speed: GenSpeed,
    oncast: function(rune) {
      var mod_damage = (Sim.stats.passives.grenadier ? 1.1 : 1);
      var mod_range = (Sim.stats.passives.grenadier ? 1.2 : 1);
      var pierce = _buriza();
      switch (rune) {
      case "x": return {type: "line", pierce: pierce, speed: 1, area: 6 * mod_range, coeff: 1.6 * mod_damage, tags: ["grenade"]};
      case "d": return {type: "line", pierce: pierce, speed: 1, area: 6 * mod_range, coeff: 1.6 * mod_damage, tags: ["grenade"]};
      case "b": return {type: "line", pierce: pierce, speed: 1, area: 9 * mod_range, coeff: 2 / 3 * mod_damage, count: 3, tags: ["grenade"]};
      case "c": return {type: "line", pierce: pierce, speed: 1, area: 6 * mod_range, coeff: 1.6 * mod_damage, count: 3, fan: 30, tags: ["grenade"]};
      case "e": return {type: "line", pierce: pierce, speed: 1, area: 6 * mod_range, coeff: 1.6 * mod_damage, onhit: Sim.apply_effect("stunned", 90, 0.2), tags: ["grenade"]};
      case "a": return {type: "line", pierce: pierce, speed: 1, area: 6 * mod_range, coeff: 1.6 * mod_damage, onhit: grenade_cold_onhit, tags: ["grenade"]};
      }
    },
    proctable: {x: 0.667, d: 0.667, b: 0.25, c: 0.4, e: 0.667, a: 0.165},
    elem: {x: "fir", d: "fir", b: "fir", c: "fir", e: "lit", a: "col"},
  };

  function impale_impact_onhit(data) {
    if (!Sim.target.boss) Sim.addBuff("knockback", undefined, 30);
    Sim.addBuff("stunned", undefined, 90);
  }
  function impale_burn_onhit(data) {
    Sim.addBuff(undefined, undefined, {
      targets: data.targets,
      duration: 120,
      tickrate: 60,
      ontick: {coeff: 2.5},
    });
  }
  skills.impale = {
    offensive: true,
    cost: 20,
    frames: 58.064510,
    oncast: function(rune) {
      var pierce = (rune !== "a" && _buriza());
      if (Sim.stats.set_shadow_6pc) {
        Sim.damage({type: "line", speed: 2, coeff: 750, proc: 0});
      }
      var count = (Sim.stats.leg_holypointshot ? 3 : 1);
      switch (rune) {
      case "x": return {pierce: pierce, type: "line", speed: 2, coeff: 7.5, fan: 20, count: count};
      case "b": return {pierce: pierce, type: "line", speed: 2, coeff: 7.5, onhit: impale_impact_onhit, fan: 20, count: count};
      case "c": return {pierce: pierce, type: "line", speed: 2, coeff: 7.5, onhit: impale_burn_onhit, fan: 20, count: count};
      case "a": return {pierce: true, type: "line", speed: 2, coeff: 7.5, fan: 20, count: count};
      case "d": return {delay: Sim.target.distance / 2, targets: 3 * (1 + (pierce || 0)), coeff: 7.5, fan: 20, count: count};
      case "e": return {pierce: pierce, type: "line", speed: 2, coeff: 7.5, chd: 330 / 7.5, fan: 20, count: count};
      }
    },
    proctable: {x: 1, b: 1, c: 0.5, a: 0.4, d: 0.4, e: 1},
    elem: {x: "phy", b: "phy", c: "fir", a: "col", d: "lit", e: "phy"},
  };

  function rf_ontick(data) {
    var dmg;
    switch (data.rune) {
    case "x": dmg = {type: "line", speed: 1.6, coeff: 1.14167}; break;
    case "d": dmg = {type: "line", speed: 1.6, coeff: 1.14167}; break;
    case "e": dmg = {type: "line", speed: 1.6, coeff: 1.14167, onhit: Sim.apply_effect("chilled", 120)}; break;
    case "c": dmg = {type: "line", speed: 1.6, coeff: 1.14167}; break;
    case "b": dmg = {type: "line", speed: 1.6, coeff: 1.14167}; break;
    case "a": dmg = {type: "line", speed: 1.6, coeff: 1.81667, area: 8}; break;
    }
    if (Sim.stats.leg_wojahnniassaulter) {
      var bonus = Math.min(4, Math.floor((Sim.time - data.buff.start) / 60));
      dmg.coeff *= 1 + bonus * 0.01 * Sim.stats.leg_wojahnniassaulter;
    }
    if (Sim.stats.leg_wojahnniassaulter_p2) {
      var bonus = Math.min(4, Math.floor((Sim.time - data.buff.start) / 30 + 1));
      dmg.coeff *= 1 + bonus * 0.01 * Sim.stats.leg_wojahnniassaulter_p2;
    }
    if (data.rune === "a") {
      if (Sim.stats.passives.grenadier) {
        dmg.coeff *= 1.1;
        dmg.area *= 1.2;
      }
      dmg.tags = ["grenade"];
    } else {
      dmg.pierce = (_buriza() || 0) + (data.rune === "b" ? 1 : 0);
    }
    Sim.damage(dmg);
  }
  skills.rapidfire = {
    offensive: true,
    initialcost: {x: 20, d: 10, e: 20, c: 20, b: 20, a: 20},
    cost: function(rune) {
      if (!Sim.stats.leg_sinseekers) return 6;
    },
    channeling: {x: 10, d: 10, e: 10, c: 10, b: 10, a: 20},
    frames: 8,
    oncast: function(rune) {
      var fs;
      if (rune === "c") {
        fs = {
          onapply: function(data) {
            Sim.addBuff("firesupport", undefined, {
              tickrate: 30,
              tickinitial: 1,
              ontick: {delay: 42, coeff: 1.45 * (Sim.stats.passives.ballistics ? 2 : 1), proc: 0},
            });
          },
          onexpire: function(data) {
            Sim.removeBuff("firesupport");
          },
        };
      }
      Sim.channeling("rapidfire", this.channeling[rune], rf_ontick, {rune: rune}, fs);
    },
    proctable: {x: 0.1667, d: 0.1667, e: 0.1667, c: 0.1667, b: 0.0556, a: 0.111},
    elem: {x: "phy", d: "fir", e: "col", c: "phy", b: "lit", a: "fir"},
  };

  skills.chakram = {
    offensive: true,
    secondary: function(rune) {
      return rune === "e";
    },
    cost: function(rune) {
      if (!Sim.stats.leg_spinesofseethinghatred) return 10;
    },
    generate: function(rune) {
      return Sim.stats.leg_spinesofseethinghatred;
    },
    cooldown: {e: 10},
    frames: 56.470554,
    oncast: function(rune) {
      switch (rune) {
      case "x": return {type: "line", speed: 1, coeff: 3.8, radius: 5};
      case "a": return {type: "line", speed: 1, coeff: 2.2, radius: 5, count: 2};
      case "c": return {type: "line", speed: 0.5, coeff: 5, radius: 5};
      case "d": return {type: "area", coeff: 3.8, range: 20};
      case "b": return {type: "line", speed: 1, coeff: 4, radius: 5};
      case "e":
        Sim.addBuff("shurikencloud", undefined, {
          duration: 600 * 60,
          tickrate: 30,
          ontick: {type: "area", range: 8, self: true, coeff: 1},
        });
        return;
      }
    },
    proctable: {x: 0.5, a: 0.333, c: 0.5, d: 0.4, b: 0.5, e: 0.05},
    elem: {x: "phy", a: "fir", c: "col", d: "phy", b: "lit", e: "phy"},
  };

  var fa_chill = Sim.apply_effect("chilled", 60);
  function ea_fa_onhit(data) {
    fa_chill(data);
    Sim.damage({
      delay: 10,
      type: "cone",
      origin: Sim.target.distance - data.distance,
      range: 35,
      cmod: -1,
      cap: 10 * data.targets,
      coeff: 3.3,
      proc: 0.5,
      width: 120,
      onhit: fa_chill,
    });
  }
  function ea_ia_onhit(data) {
    for (var i = 0; i < data.targets; ++i) {
      var aug = 1 + 0.01 * (Sim.stats.leg_augustinespanacea || 0);
      Sim.addBuff(undefined, undefined, {
        duration: 120,
        tickrate: 30,
        ontick: {type: "area", range: 10, coeff: 3.15 / 4 * aug, proc: 0.4},
      });
    }
  }
  function ea_lb_onhit(data) {
    var targets = Sim.target.random("lightningbolts", data.chc, data);
    if (targets.length) {
      Sim.addBuff("stunned", undefined, {
        duration: 180,
        targets: targets,
      });
    }
  }
  skills.elementalarrow = {
    offensive: true,
    cost: function(rune) {
      if (!Sim.stats.leg_kridershot) return 10;
    },
    generate: function(rune) {
      return Sim.stats.leg_kridershot;
    },
    frames: 56.666664,
    oncast: function(rune) {
      var aug = 1 + 0.01 * (Sim.stats.leg_augustinespanacea || 0);
      switch (rune) {
      case "x": return {type: "line", pierce: true, speed: 1.3, coeff: 3};
      case "b": return {type: "ball", speed: 0.4 * 0.01 * ((Sim.stats.leg_augustinespanacea && 30) || Sim.stats.leg_meticulousbolts || 100), coeff: 1.5, rate: 42, radius: 15};
      case "a": return {type: "line", pierce: _buriza(), speed: 1.3, coeff: 3.3 * aug, onhit: ea_fa_onhit};
      case "c": return {type: "line", pierce: _buriza(), speed: 1.3, coeff: 3, onhit: ea_ia_onhit};
      case "e": return {type: "line", pierce: true, speed: 1.3, coeff: 3 * aug, onhit: ea_lb_onhit};
      case "d": return {type: "line", pierce: true, speed: 0.4, coeff: 3 * aug};
      }
    },
    proctable: {x: 0.5, b: 0.333, a: 0.25, c: 0.1, e: 0.4, d: 0.3},
    elem: {x: "fir", b: "lit", a: "col", c: "fir", e: "lit", d: "phy"},
  };

  skills.caltrops = {
    secondary: true,
    weapon: "mainhand",
    frames: 52.499996,
    cost: {x: 6, b: 6, c: 6, a: 6, d: 3, e: 6},
    resource: "disc",
    oncast: function(rune) {
      var buff = (rune === "e" && {chc: 10});
      if (Sim.getTargets(12, Sim.target.distance)) {
        var data = {
          duration: 360 * (Sim.stats.passives.customengineering ? 2 : 1),
          tickrate: 15,
          ontick: {type: "area", range: 12, self: true, coeff: 0, onhit: Sim.apply_effect("slowed", 16)},
        };
        if (rune === "a") {
          data.ontick.coeff = 0.45 / 4;
        }
        Sim.addBuff("caltrops", buff, data);
        if (rune === "c") {
          Sim.damage({type: "area", range: 12, self: true, coeff: 0, onhit: Sim.apply_effect("rooted", 120)});
        }
      } else {
        Sim.addBuff("caltrops", buff, {duration: 1800});
      }
    },
    elem: "phy",
  };

  skills.smokescreen = {
    secondary: true,
    weapon: "mainhand",
    frames: 34,
    cost: {x: 14, e: 14, b: 14, c: 14, d: 8},
    resource: "disc",
    cooldown: {x: 1.5, e: 1.5, b: 1.5, c: 1.5, d: 1.5, a: 6},
    duration: {x: 60, e: 60, b: 90, c: 60, d: 60, a: 60},
    oncast: function(rune) {
      Sim.addBuff("smokescreen", rune === "e" && {extrams: 100}, {duration: this.duration[rune]});
    },
    elem: "phy",
  };

  skills.shadowpower = {
    secondary: true,
    weapon: "mainhand",
    frames: 34,
    cost: {x: 14, a: 14, e: 14, d: 8, c: 14, b: 14},
    resource: "disc",
    cooldown: function(rune) {
      if (Sim.stats.leg_liannaswings) return 1.5;
    },
    duration: function(rune) {
      if (Sim.stats.leg_liannaswings) {
        return skills.smokescreen.duration[Sim.stats.skills.smokescreen || "x"];
      }
    },
    oncast: function(rune) {
      var buff = {lph: 26821 + (Sim.stats.laek || 0) * 0.25};
      var params = {duration: 300};
      if (rune === "a" || Sim.stats.set_shadow_4pc) {
        if (Sim.getTargets(30, Sim.target.distance)) buff.status = "slowed";
      }
      if (rune === "e" || Sim.stats.set_shadow_4pc) buff.lph *= 2;
      if (rune === "c" || Sim.stats.set_shadow_4pc) buff.dmgred = 35;
      if (rune === "b" || Sim.stats.set_shadow_4pc) buff.extrams = 30;
      if (Sim.stats.set_shadow_4pc) delete params.duration;
      Sim.addBuff("shadowpower", buff, params);
    },
    oninit: function(rune) {
      if (Sim.stats.set_shadow_4pc) {
        this.oncast(rune);
      }
    },
    elem: "phy",
  };

  skills.vault = {
    weapon: "mainhand",
    frames: 17.999996,
    cost: function(rune) {
      if (Sim.getBuff("chainofshadows")) return;
      if (rune === "b") return;
      return (rune === "d" && Sim.getBuff("tumble") ? 4 : 8);
    },
    resource: function(rune) {
      return (Sim.stats.set_danetta_2pc ? "hatred" : "disc");
    },
    cooldown: {b: 6},
    oncast: function(rune) {
      if (rune === "e" || Sim.stats.leg_danettasrevenge) {
        Sim.damage({type: "area", range: 8, self: true, coeff: 0, onhit: Sim.apply_effect("knockback", 30)});
        Sim.damage({type: "area", range: 8, self: true, coeff: 0, onhit: Sim.apply_effect("stunned", 90)});
      }
      if (rune === "c") {
        Sim.damage({targets: 4, chc: 100, coeff: 0.75, chc: 100});
      }
      if (rune === "d") {
        if (Sim.getBuff("tumble")) {
          Sim.removeBuff("tumble");
        } else {
          Sim.addBuff("tumble", undefined, {duration: 360});
        }
      }
      if (rune === "a") {
        Sim.addBuff("trailofcinders", undefined, {
          duration: 180,
          tickrate: 12,
          ontick: {type: "area", range: 5, self: true, coeff: 0.2},
        });
      }
    },
    proctable: {c: 0.25, a: 0.04},
    elem: {x: "phy", c: "phy", e: "phy", d: "phy", b: "phy", a: "fir"},
  };

  skills.preparation = {
    weapon: "mainhand",
    frames: 34,
    cooldown: {x: 45, b: 45, a: 20, d: 45, c: 45, e: 45},
    oncast: function(rune) {
      switch (rune) {
      case "x": Sim.addResource(30, "disc"); break;
      case "b": Sim.addResource(30, "disc"); break;
      case "a": Sim.addResource(75, "hatred"); break;
      case "d": Sim.addResource(30, "disc"); break;
      case "c": Sim.addBuff("focusedmind", {discregen: 3}, {duration: 900}); break;
      case "e":
        if (Sim.random("backupplan", 0.3)) Sim.reduceCooldown("preparation");
        Sim.addResource(30, "disc");
        break;
      }
    },
    oninit: function(rune) {
      if (rune === "b") {
        Sim.addBaseStats({maxdisc: 20});
      }
    },
    elem: "phy",
  };

  var raven_buff = false;
  skills.companion = {
    secondary: true,
    weapon: "mainhand",
    pet: true,
    frames: 52,
    cooldown: 30,
    oncast: function(rune) {
      if (rune === "x" || Sim.stats.set_marauder_2pc) {
        raven_buff = true;
      }
      if (rune === "a" || Sim.stats.set_marauder_2pc) {
        Sim.damage({type: "area", range: 25, coeff: 0, onhit: Sim.apply_effect("slowed", 300)});
      }
      if (rune === "d" || Sim.stats.set_marauder_2pc) {
        Sim.addResource(50, "hatred");
      }
      if (rune === "c" || Sim.stats.set_marauder_2pc) {
        Sim.addBuff("wolfcompanion", {dmgmul: 15}, {duration: 600});
      }
    },
    oninit: function(rune) {
      if (rune === "x" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_raven", undefined, {
          tickrate: 57.499996,
          ontick: function(data) {
            Sim.damage({pet: true, distance: 5, coeff: Sim.stats.info.aps * (raven_buff ? 5 : 1)});
            raven_buff = false;
          },
        });
      }
      if (rune === "a" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_spider", undefined, {
          tickrate: 58,
          ontick: function(data) {
            Sim.damage({pet: true, type: "area", front: true, range: 5, origin: 5, coeff: Sim.stats.info.aps * 1.4});
            Sim.addBuff("slowed", undefined, 180);
          },
        });
      }
      if (rune === "d" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_bat", {hatredregen: 1}, {
          tickrate: 53.333332,
          ontick: function(data) {
            Sim.damage({distance: 5, pet: true, coeff: Sim.stats.info.aps * 0.6});
          },
        });
      }
      if (rune === "b" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_boar", {regen: 5364, resist_percent: 20}, {
          tickrate: 57,
          ontick: function(data) {
            Sim.damage({distance: 5, pet: true, coeff: Sim.stats.info.aps * 0.5});
          },
        });
      }
      if (rune === "e" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_ferret", {ms: 10, gf: 10}, {
          stacks: 2,
          tickrate: 40,
          ontick: function(data) {
            Sim.damage({distance: 5, pet: true, count: data.stacks, coeff: Sim.stats.info.aps * 0.5});
          },
        });
      }
      if (rune === "c" || Sim.stats.set_marauder_2pc) {
        Sim.petattack("companion_wolf", {ms: 10, gf: 10}, {
          stacks: (Sim.stats.leg_thecloakofgarwulf ? 3 : 1),
          tickrate: 58.378376,
          ontick: function(data) {
            Sim.damage({pet: true, type: "cone", range: 10, width: 120, origin: 5, count: data.stacks, coeff: Sim.stats.info.aps * 1.5});
          },
        });
      }
      Sim.metaBuff("companion", ["companion_raven", "companion_spider", "companion_bat", "companion_boar", "companion_ferret", "companion_wolf"]);
    },
    elem: "phy",
  };

  skills.markedfordeath = {
    weapon: "mainhand",
    frames: 57.857140,
    cost: 3,
    resource: "disc",
    oncast: function(rune) {
      var dm = (Sim.stats.passives.customengineering ? 2 : 1);
      if (rune === "c") {
        Sim.addBuff("markedfordeath", {dmgtaken: 15}, {duration: 800 * dm, targets: Sim.getTargets(15)});
      } else {
        Sim.addBuff("markedfordeath", {dmgtaken: 15}, {duration: 1800 * dm, targets: 1});
      }
    },
    oninit: function(rune) {
      if (rune === "d") {
        Sim.register("onhit_proc", function(data) {
          if (Sim.getBuff("markedfordeath", data.firsttarget)) {
            Sim.addResource(4 * data.proc * data.count, "hatred");
          }
        });
      }
      if (rune === "a") {
        Sim.register("onhit", function(data) {
          if (data.triggered === "markedfordeath") return;
          if (Sim.getBuff("markedfordeath", data.firsttarget)) {
            var tgt = Sim.getTargets(20);
            if (tgt <= 1) return;
            Sim.dealDamage({
              targets: tgt - 1,
              firsttarget: Sim.target.next(data),
              count: data.count,
              skill: data.skill,
              triggered: "markedfordeath",
              damage: data.damage * 0.2,
              elem: elem,
              chc: 0,
            });
          }
        });
      }
      if (rune === "b") {
        Sim.register("onkill", function(data) {
          if (Sim.getBuff("markedfordeath", data.target)) {
            var dm = (Sim.stats.passives.customengineering ? 2 : 1);
            Sim.addBuff("markedfordeath", {dmgtaken: 15}, {duration: 1800 * dm, targets: 3, firsttarget: "new"});
          }
        });
      }
    },
    elem: "phy",
  };

  skills.fanofknives = {
    secondary: true,
    offensive: true,
    weapon: "mainhand",
    frames: 56,
    cost: {a: 30},
    cooldown: {x: 10, d: 15, e: 10, a: 0.1, c: 10, b: 10},
    oncast: function(rune) {
      switch (rune) {
      case "x": return {type: "area", range: 20, self: true, coeff: 6.2, onhit: Sim.apply_effect("slowed", 60)};
      case "d": return {type: "area", range: 20, self: true, coeff: 16, onhit: Sim.apply_effect("slowed", 60)};
      case "e":
        Sim.addBuff("bladedarmor", {armor_percent: 40}, {duration: 360});
        return {type: "area", range: 20, self: true, coeff: 6.2, onhit: Sim.apply_effect("slowed", 60)};
      case "a": return {type: "area", range: 20, self: true, coeff: 6.2, onhit: Sim.apply_effect("slowed", 60)};
      case "c": return {type: "area", range: 20, self: true, coeff: 6.2, onhit: Sim.apply_effect("stunned", 180)};
      case "b":
        Sim.damage({targets: 5, delay: Math.floor(Sim.target.distance / 2), coeff: 6.2});
        return {type: "area", range: 20, self: true, coeff: 6.2, onhit: Sim.apply_effect("slowed", 60)};
      }
    },
    elem: {x: "phy", d: "lit", e: "col", a: "fir", c: "fir", b: "phy"},
    proctable: {x: 0.333, d: 0.5, e: 0.333, a: 0.3, c: 0.333, b: 0.2},
  };

  function st_echoing_onhit(data) {
    Sim.addBuff("echoingblast", {dmgtaken: 20}, {status: "frozen", duration: 180, targets: data.targets, firsttarget: data.firsttarget});
  }
  skills.spiketrap = {
    offensive: true,
    //weapon: "mainhand",
    frames: 57.142845,
    speed: function(rune, aps) {
      return aps * (Sim.stats.leg_tragoulcoils_p2 ? 2 : 1);
    },
    cost: 15,
    oncast: function(rune) {
      var params = {
        maxstacks: 4 + (Sim.stats.passives.customengineering ? 1 : 0),
      };
      if (rune === "a" || Sim.stats.leg_tragoulcoils_p2) {
        Sim.damage({type: "area", range: 8, coeff: 0, proc: 0, onhit: Sim.apply_effect("rooted", 180)});
      }
      if (rune === "d") {
        params.stacks = 2;
        //params.maxstacks *= 2;
      }
      Sim.addBuff("spiketrap", undefined, params);
    },
    oninit: function(rune) {
      Sim.register("oncast", function(data) {
        if ((rune !== "c" && data.cost && data.skill !== "spiketrap") || (rune === "c" && data.generate)) {
          var stacks = Sim.getBuff("spiketrap");
          if (!stacks) return;
          Sim.removeBuff("spiketrap");
          var dmg = {type: "area", range: 8, coeff: 11.6, count: stacks};
          switch (rune) {
          case "b":
            dmg.coeff = 20.2;
            dmg.onhit = Sim.apply_effect("slowed", 180);
            break;
          case "c": dmg.coeff = 19.0; break;
          case "a": dmg.coeff = 19.3; break;
          case "e":
            delete dmg.type;
            dmg.targets = 3;
            dmg.range = 10;
            dmg.coeff = 67.0 / 3;
            Sim.damage(Sim.extend({delay: 3}, dmg));
            Sim.damage(Sim.extend({delay: 6}, dmg));
            break;
          //case "d": dmg.coeff = 9.6; break;
          }
          if (Sim.stats.leg_thedemonsdemise_p2) {
            Sim.damage(Sim.extend({delay: 60}, dmg));
          }
          Sim.damage(dmg);
        }
      });
    },
    elem: {x: "fir", b: "col", c: "fir", a: "phy", e: "lit", d: "fir"},
    proctable: {x: 0.15, b: 0.15, c: 0.333, a: 0.15, e: 0.15, d: 0.05},
  };

  skills.sentry = {
    offensive: true,
    weapon: "mainhand",
    pet: true,
    frames: 28,
    cost: 20,
    cooldown: 8,
    charges: function(rune) {
      return 2 + (Sim.stats.passives.customengineering ? 1 : 0);
    },
    distance: function(rune) {
      var origin = Sim.target.distance;
      if (Sim.params.sentry) {
        origin = Sim.params.sentry[0][1] || origin;
      }
      return origin;
    },
    oncast: function(rune) {
      var origin = Sim.target.distance;
      if (Sim.params.sentry) {
        origin = Sim.params.sentry[0][1] || origin;
      }
      var buffs;
      var params = {
        maxstacks: 2 + (Sim.stats.passives.customengineering ? 1 : 0) + (Sim.stats.leg_bombadiersrucksack ? 2 : 0),
        duration: 1800 * (Sim.stats.passives.customengineering ? 2 : 1),
        refresh: false,
        tickrate: 54,
        speed: true,
        ontick: {type: "line", speed: 1, coeff: 2.8, pet: true},
      };
      switch (rune) {
      case "c":
        params.ontick = function(data) {
          Sim.damage({type: "line", speed: 1, coeff: 2.8, pet: true});
          Sim.damage({delay: Math.floor(24 + Sim.target.distance * 0.6), coeff: 1.2 * (Sim.stats.passives.ballistics ? 2 : 1)});
        };
        break;
      case "b":
        params.ontick.pierce = true;
        break;
      case "a":
        var from = Math.max(Sim.target.distance, origin);
        var len = from - Math.min(Sim.target.distance, origin);
        Sim.addBuff("chainsoftorment", undefined, {
          tickrate: 30,
          duration: params.duration,
          ontick: {type: "line", pierce: true, origin: from, radius: 3, range: len, coeff: 1.5},
        });
        break;
      case "d":
        if (Sim.getTargets(16, origin)) {
          params.status = "chilled";
        }
        break;
      case "e":
        params.dmgred = 25;
        break;
      }
      Sim.petattack("sentry", buffs, params);
    },
    elem: {x: "phy", c: "fir", b: "lit", a: "phy", d: "col", e: "phy"},
  };

  skills.vengeance = {
    weapon: "mainhand",
    secondary: true,
    frames: 34,
    cooldown: function(rune) {
      return 90 * (1 - 0.01 * (Sim.stats.leg_dawn || 0));
    },
    oncast: function(rune) {
      var params = {duration: 1200};
      /*if (rune === "b") {
        params.tickrate = 15;
        params.ontick = {type: "area", range: 10, self: true, coeff: 3.25 / 4};
      }*/
      var buffs = {dmgmul: 40};
      if (rune === "e") buffs.hatredregen = 10;
      if (rune === "b" || Sim.stats.leg_visageofgunes) buffs.dmgred = 50;
      Sim.addBuff("vengeance", buffs, params);
    },
    oninit: function(rune) {
      var next = 0;
      Sim.trigger("oncast", function(data) {
        if (Sim.time >= next && data.offensive && Sim.getBuff("vengeance")) {
          var factor = 1;
          if (Sim.stats.set_unhallowed_6pc) factor *= 1 + 0.15 * (Sim.resources.disc || 0);
          if (rune !== "d") {
            Sim.damage({type: "line", pierce: true, coeff: 0.6 * factor, count: 4});
            if (rune === "c") {
              Sim.damage({type: "line", speed: 1, coeff: 1.5 * (Sim.stats.passives.grenadier ? 1.1 : 1) * factor,
                area: 6 * (Sim.stats.passives.grenadier ? 1.2 : 1), count: 2, tags: ["grenade"]});
            } else if (rune === "a") {
              Sim.damage({delay: 15, coeff: 1.2 * factor, onhit: Sim.apply_effect("frozen", 180)});
            } else {
              Sim.damage({delay: Math.floor(18 + 0.6 * Sim.target.distance), targets: 2,
                coeff: 0.8 * (Sim.stats.passives.ballistics ? 2 : 1) * factor});
            }
          } else {
            Sim.damage({type: "line", pierce: true, coeff: 2.25 * factor, count: 2});
          }
          next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
        }
      });
    },
    elem: {x: "phy", c: "fir", b: "lit", d: "phy", e: "phy", a: "col"},
    proctable: {x: 0.05, c: 0.05, b: 0.05, d: 0.2, e: 0.05, a: 0.1},
  };

  function strafe_ontick(data) {
    var dmg = {type: "line", pierce: _buriza(), coeff: 6.75 / 4};
    switch (data.rune) {
    case "e": dmg.chd = 1.4; break;
    case "a":
      dmg.speed = 1;
      dmg.coeff = 4.6 * (Sim.stats.passives.grenadier ? 1.1 : 1);
      dmg.area = 9 * (Sim.stats.passives.grenadier ? 1.2 : 1);
      dmg.tags = ["grenade"];
      break;
    case "c":
      if (data.rocket) {
        delete data.rocket;
      } else {
        Sim.damage({delay: Math.floor(21 + 0.06 * Sim.target.distance), coeff: 0.65 * (Sim.stats.passives.ballistics ? 2 : 1)});
        data.rocket = true;
      }
      break;
    }
    if (Sim.stats.leg_vallasbequest) {
      dmg.pierce = true;
    }
    Sim.damage(dmg);
  }
  skills.strafe = {
    offensive: true,
    cost: 12,
    channeling: {x: 15, b: 15, d: 15, e: 15, c: 15, a: 30},
    frames: 59.999996,
//    speed: 1,
    oncast: function(rune) {
      if (rune === "b") {
        Sim.addBuff("icytrail", undefined, {
          duration: 180,
          tickrate: 60,
          tickinitial: 1,
          ontick: {type: "area", range: 7, self: true, coeff: 1, onhit: Sim.apply_effect("chilled", 180)},
        });
      }
      Sim.channeling("strafe", this.channeling[rune], strafe_ontick, {rune: rune});
    },
    proctable: {x: 0.25, b: 0.25, d: 0.25, e: 0.25, c: 0.25, a: 0.2},
    elem: {x: "phy", b: "col", d: "lit", e: "phy", c: "fir", a: "fir"},
  };

  function ms_dml_fix() {
    if (Sim.stats.leg_deadmanslegacy || Sim.stats.leg_deadmanslegacy_p6) {
      var count = Sim.countTargetsBelow((Sim.stats.leg_deadmanslegacy_p6 && 60 || Sim.stats.leg_deadmanslegacy) * 0.01, this);
      if (count) {
        this.count = 1 + count / this.targets;
      }
    }
  }
  skills.multishot = {
    offensive: true,
    cost: {x: 25, d: 18, b: 25, e: 25, a: 25, c: 25},
    frames: 56.666664,
    speed: function(rune, aps) {
      return aps * (Sim.stats.leg_yangsrecurve || Sim.stats.leg_yangsrecurve_p6 ? 1.5 : 1);
    },
    oncast: function(rune) {
      var dmg = {delay: Math.floor(Sim.target.distance / 2), type: "cone", width: 80, range: 75, coeff: 3.6};
      switch (rune) {
      case "b":
        dmg.onhit = function(data) {
          Sim.addBuff("windchill", {chctaken: 8}, {duration: 180, targets: data.targets, firsttarget: data.firsttarget});
        };
        break;
      case "e":
        if (!Sim.target.boss) dmg.onhit = Sim.apply_effect("knockback", 30);
        break;
      case "a":
        dmg.coeff = 5;
        break;
      case "c":
        Sim.damage({targets: 3, coeff: 3 * (Sim.stats.passives.ballistics ? 2 : 1), fix: ms_dml_fix});
        break;
      }
      if (Sim.stats.leg_deadmanslegacy || Sim.stats.leg_deadmanslegacy_p6) {
        dmg.fix = ms_dml_fix;
      }
      return dmg;
    },
    proctable: {x: 0.25, d: 0.25, b: 0.2, e: 0.25, a: 0.25, c: 0.18},
    elem: {x: "phy", d: "lit", b: "col", e: "phy", a: "phy", c: "fir"},
  };

  skills.clusterarrow = {
    offensive: true,
    cost: function(rune) {
      return 40 * (1 - 0.01 * ((Sim.stats.leg_manticore_p6 && 50) || Sim.stats.leg_manticore || 0));
    },
    frames: 58.064510,
    oncast: function(rune) {
      var dmg = {type: "area", range: 15, coeff: 6.5};
      var gr_dmg = (Sim.stats.passives.grenadier ? 1.1 : 1);
      var gr_aoe = (Sim.stats.passives.greandier ? 1.2 : 1);
      var rk_dmg = (Sim.stats.passives.ballistics ? 2 : 1);
      switch (rune) {
      case "x":
        Sim.damage({type: "area", radius: 8, inner: 4, range: 5 * gr_aoe, coeff: 2.5 * gr_dmg, count: 4, tags: ["grenade"]});
        break;
      case "e":
        Sim.damage({type: "area", radius: 8, inner: 4, range: 5 * gr_aoe, coeff: 2.5 * gr_dmg, count: 4, tags: ["grenade"]});
        dmg.onhit = Sim.apply_effect("stunned", 90);
        break;
      case "b":
        Sim.damage({delay: 48, targets: 2, coeff: 6 * rk_dmg});
        break;
      case "d":
        Sim.damage({delay: 48, targets: 3, coeff: 4.5 * rk_dmg});
        break;
      case "c":
        Sim.damage({delay: 10, type: "area", origin: Sim.target.distance - 15, range: 5 * gr_aoe, coeff: 6.5 * gr_dmg, tags: ["grenade"]});
        Sim.damage({delay: 20, type: "area", origin: Sim.target.distance - 20, range: 5 * gr_aoe, coeff: 6.5 * gr_dmg, tags: ["grenade"]});
        Sim.damage({delay: 30, type: "area", origin: Sim.target.distance - 24, range: 5 * gr_aoe, coeff: 6.5 * gr_dmg, tags: ["grenade"]});
        Sim.damage({delay: 40, type: "area", origin: Sim.target.distance - 26.5, range: 5 * gr_aoe, coeff: 6.5 * gr_dmg, tags: ["grenade"]});
        Sim.damage({delay: 50, type: "area", origin: Sim.target.distance - 27.5, range: 5 * gr_aoe, coeff: 6.5 * gr_dmg, tags: ["grenade"]});
        dmg.delay = 60;
        dmg.origin = Sim.target.distance - 35;
        break;
      case "a":
        Sim.damage({type: "area", radius: 8, inner: 4, range: 5 * gr_aoe, coeff: 2.5 * gr_dmg, count: 4, tags: ["grenade"]});
        dmg.coeff = 8.5;
        break;
      }
      return dmg;
    },
    proctable: {x: 0.15, e: 0.2, b: 0.2, d: 0.2, c: 0.15, a: 0.15},
    elem: {x: "fir", e: "lit", b: "phy", d: "col", c: "fir", a: "fir"},
  };

  skills.rainofvengeance = {
    weapon: "mainhand",
    offensive: true,
    cooldown: 30,
    frames: 57.391293,
    oncast: function(rune) {
      if (Sim.stats.leg_crashingrain) {
        Sim.damage({type: "area", range: 30, coeff: 0.01 * Sim.stats.leg_crashingrain});
      }
      var name, dmg, duration = 300, tickrate = 30;
      switch (rune) {
      case "x":
        name = "rainofvengeance";
        dmg = {type: "area", range: 30, coeff: 1.5};
        break;
      case "b":
        name = "rainofvengeance";
        dmg = {type: "area", range: 10, coeff: 35 / 16};
        duration = 480;
        break;
      case "a":
        name = "rainofvengeance";
        dmg = {type: "area", range: 30, coeff: 2.8};
        break;
      case "e":
        dmg = {type: "area", range: 30, coeff: 4.6, onhit: Sim.apply_effect("knockback", 30)};
        tickrate = 18;
        duration = 180;
        break;
      case "c":
        dmg = {type: "area", range: 7 * (Sim.stats.passives.grenadier ? 1.2 : 1), coeff: 2.9 * (Sim.stats.passives.grenadier ? 1.1 : 1), tags: ["grenade"]};
        tickrate = 6;
        duration = 120;
        break;
      case "d":
        dmg = {type: "area", range: 30, coeff: 3.8, onhit: Sim.apply_effect("frozen", 120)};
        tickrate = 30;
        duration = 300;
        break;
      }
      Sim.addBuff(name, undefined, {
        duration: duration,
        tickrate: tickrate,
        tickinitial: 1,
        ontick: dmg,
      });
    },
    proctable: {x: 0.04, b: 0.06, a: 0.04, e: 0.15, c: 0.12, d: 0.15},
    elem: {x: "phy", b: "phy", a: "lit", e: "fir", c: "fir", d: "col"},
  };

  Sim.passives = {
    thrillofthehunt: function() {
      var next = 0;
      Sim.register("onhit", function(data) {
        if (data.castInfo && data.castInfo.cost && data.castInfo.resource === "hatred") {
          Sim.addBuff("slowed", undefined, {duration: 120, targets: data.targets, firsttarget: data.firsttarget});
        }
      });
    },
    tacticaladvantage: function() {
      Sim.register("oncast", function(data) {
        if (data.skill === "vault" || data.skill === "smokescreen" || data.skill === "shadowpower") {
          Sim.addBuff("tacticaladvantage", {extrams: 60}, {duration: 120});
        }
      });
    },
    bloodvengeance: function() {
      Sim.addBaseStats({maxhatred: 25});
      Sim.register("onglobe", function() {
        Sim.addResource(30, "hatred");
        Sim.addResource(3, "disc");
      });
    },
    steadyaim: function() {
      Sim.after(30, function check() {
        if (!Sim.getTargets(10, Sim.target.distance)) {
          Sim.addBuff("steadyaim", {dmgmul: 20}, {duration: 42});
        }
        Sim.after(30, check);
      });
    },
    culltheweak: function() {
      Sim.register("updatestats", function(data) {
        var count = data.stats.countStatus("chilled", "slowed");
        if (count) data.stats.add("dmgmul", 20 * count / Sim.target.count);
      });
    },
    nightstalker: function() {
      Sim.register("oncast", function(data) {
        if (skills[data.skill] && skills[data.skill].signature) {
          Sim.addResource(4);
        }
      });
    },
    brooding: function() {
      Sim.addBuff("brooding", {regen_percent: 3}, {stacks: 3});
    },
    hotpursuit: function() {
      Sim.register("onhit", function() {
        Sim.addBuff("hotpursuit", {extrams: 20}, {duration: 240});
      });
    },
    archery: function() {
      switch (Sim.stats.info.mainhand.type) {
      case "bow": Sim.addBaseStats({damage: 8}); break;
      case "crossbow": Sim.addBaseStats({chd: 50}); break;
      case "handcrossbow": Sim.addBaseStats({chc: 5}); break;
      }
      if (Sim.stats.info.offhand && Sim.stats.info.offhand.type === "handcrossbow") {
        Sim.addBaseStats({hatredregen: 1});
      }
    },
    numbingtraps: function() {
    },
    perfectionist: {rcr_disc: 10, armor_percent: 10, resist_percent: 10},
    customengineering: function() {
    },
    grenadier: function() {
    },
    sharpshooter: function() {
      Sim.after(60, function addstack() {
        Sim.addBuff("sharpshooter", {chc: 4}, {maxstacks: 25});
      });
      Sim.register("onhit", function(data) {
        if (Sim.random("sharpshooter", data.chc)) {
          Sim.after(60, function() {
            Sim.removeBuff("sharpshooter");
          });
        }
      });
    },
    ballistics: function() {
      var next = 0;
      Sim.register("oncast", function(data) {
        if (data.offensive && Sim.time >= next) {
          if (Sim.random("ballistics", 0.2)) {
            Sim.damage({delay: 42, elem: "phy", coeff: 3});
          }
          next = Sim.time + Math.floor(54 / Sim.stats.info.aps);
        }
      });
    },
    leech: function() {
      Sim.addBaseStats({lph: 18506.5245 + 0.75 * (Sim.baseStats.laek || 0)});
    },
    ambush: function() {
      var id;
      Sim.register("update", function(data) {
        if (id) Sim.removeBuff(id);
        var list = Sim.listTargetsAbove(0.75);
        if (list.length) id = Sim.addBuff(id, {dmgmul: 40}, {targets: list});
      });
    },
    awareness: function() {
    },
    singleout: function() {
      if (Sim.getTargets(20) < 1.2) {
        Sim.addBaseStats({chctaken: 25});
      }
    },
  };
  
})();
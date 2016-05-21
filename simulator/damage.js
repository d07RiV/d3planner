(function() {
  var Sim = Simulator;

  Sim.curweapon = "mainhand";

  Sim.calcDamage = function(data) {
    var stats = Sim.stats;
    var triggered = (data.castInfo && data.castInfo.triggered);

    var base = stats.info[data.weapon || "mainhand"].wpnbase;
    var avg;
    if (data.thorns) {
      avg = (0 || Sim.stats.thorns);
    } else if (data.castInfo && data.castInfo.pet === "min") {
      avg = base.min;
    } else {
      avg = (base.min + base.max) * 0.5;
    }
    avg *= (data.coeff === undefined ? 1 : data.coeff);
    if (data.addthorns) {
      avg += data.addthorns * (0 || Sim.stats.thorns);
    }

    var factor = 1 + 0.01 * stats.info.primary * (data.thorns === "bad" ? 0.25 : 1);
    if (data.fix) data.fix.call(data);
    factor *= (data.factor || 1);

    var dibs = (data.dibs || 0);
    var chc = stats.final.chc + (data.chc || 0);
    var chd = stats.chd + (data.chd || 0);
    var orphan = data.orphan;
    if (data.castInfo && data.castInfo.buffs) {
      for (var i = 0; i < data.castInfo.buffs.length; ++i) {
        var ex = data.castInfo.buffs[i];
        if (ex.dibs) dibs += ex.dibs;
        if (ex.factor) factor *= ex.factor;
        if (ex.percent) factor *= 1 + 0.01 * ex.percent;
        if (ex.chc) chc += ex.chc;
        if (ex.chd) chd += ex.chd;
      }
    }
    if (data.castInfo && data.castInfo.orphan) {
      orphan = true;
    }
    chc = Math.min(1, 0.01 * chc);
    chd *= 0.01;

    var ispet = data.pet || (data.castInfo && data.castInfo.pet);
    var prefix = "skill_" + Sim.stats.charClass + "_";
    if (ispet) {
      factor *= 1 + 0.01 * (stats[prefix + data.skill] || 0);
      if (triggered && triggered !== data.skill) {
        factor *= 1 + 0.01 * (stats[prefix + triggered] || 0);
      }
    } else {
      dibs += (stats[prefix + (data.skill || triggered)] || 0);
    }

    var elem = (data.elem === "max" ? stats.info.maxelem : data.elem);
    var srcelem = ((data.srcelem === "max" ? stats.info.maxelem : data.srcelem) || data.elem);
    //if (data.thorns === "normal") elem = "phy";
    if (!orphan) dibs += stats.getSpecial("damage", elem, ispet, data.skill, data.exclude);
    var dmgtaken = stats.getSpecial("dmgtaken", elem, ispet, data.skill, data.exclude);
    if (data.thorns === "normal" || data.thorns === "bad" || data.thorns === "special") {
      factor *= 1 + 0.01 * dmgtaken;
      factor *= 1 + 0.01 * (stats.thorns_taken || 0);
    } else {
      dibs += dmgtaken;
    }

    factor *= 1 + 0.01 * dibs;

    var elemental = (data.thorns !== "special" && srcelem && stats["dmg" + srcelem] || 0);
    if (ispet) elemental += (stats.petdamage || 0);
    factor *= 1 + 0.01 * elemental;

    var edmg = 0.01 * (stats.edmg || 0);
    var bossdmg = 0.01 * (stats.bossdmg || 0);
    factor *= 1 + Sim.target.elite * edmg + Sim.target.boss * (1 + edmg) * bossdmg;
    if (Sim.target.type) {
      factor *= 1 + 0.01 * (stats["damage_" + Sim.target.type] || 0);
    }

    var dmgmul = 1;
    if (!orphan) {
      dmgmul = stats.getSpecial("dmgmul", elem, ispet, data.skill, data.exclude);
      if (stats.gems.zei) {
        var dist = ((data.castInfo && data.castInfo.distance) || data.distance || data.origin || Sim.target.distance);
        dmgmul *= 1 + 0.01 * dist * (4 + 0.08 * stats.gems.zei) / 10;
      }
    }
    factor *= dmgmul;

    var value = avg * factor;
    if (!orphan && !data.thorns/* !== "normal"*/ && !data.addthorns) {
      value *= 1 + chc * chd;
    }
    if (data.nocrit || orphan || data.thorns/* === "normal"*/ || data.addthorns) chc = 0;

    //var count = (data.count || 1);
    //if (data.targets) {
    //  count *= Math.min(data.targets, Sim.target.count);
    //}

    return {
      targets: Math.min(data.targets || 1, Sim.target.count),
      firsttarget: data.firsttarget,
      count: (data.count || 1),
      //targets: count,
      skill: data.skill,
      proc: (ispet ? 0 : data.proc),
      damage: value,
      elem: /*data.*/elem,
      pet: ispet,
      castInfo: data.castInfo,
      triggered: triggered,
      thorns: data.thorns,
      chc: chc,
      distance: data.distance,
      dmgmul: dmgmul,
      castId: data.castId,
    };
  };
  Sim.dealDamage = function(event) {
    if (event.proc && !event.pet) {
      Sim.trigger("onhit_proc", event);
    }
    Sim.trigger("onhit", event);

    if (event.proc || event.pet) {
      if (Sim.target.area_coeff === undefined) {
        var area = Math.PI * Math.pow(Sim.target.size + 10, 2);
        Sim.target.area_coeff = (Sim.target.count - 1) * Math.min(1, area / Sim.target.area);
      }
      if (Sim.target.area_coeff && Sim.stats.area) {
        Sim.trigger("onhit", {
          targets: event.targets * Sim.target.area_coeff,
          firsttarget: (event.targets === 1 ?
            (event.firsttarget ? event.firsttarget + 1 : (Sim.target.boss ? Sim.target.index : Sim.target.index + 1)) : undefined),
          count: event.count * 0.2,
          skill: event.skill,
          damage: event.damage * 0.01 * Sim.stats.area/* / (event.dmgmul || 1)*/,
          elem: event.elem,
          triggered: "area",
          chc: 0,
        });
      }
    }
  };

  function _target(data) {
    if (data.count === 0 || data.targets === 0) return;
    var event = Sim.calcDamage(data);
    if (data.onhit) {
      data.onhit(event);
    }
    Sim.dealDamage(event);
  }

  function _line(data) {
    var tcount = Sim.target.count + (data.cmod || 0);
    if (!tcount) return;
    var origin = (data.origin || Sim.target.distance);
    var size = Sim.target.size + (data.radius || 0);
    if (data.fan && data.count && data.count > 1 && !data.merged) {
      var tmp = Sim.extend({}, data);
      tmp.count -= 1;
      tmp.angle = data.fan * 0.5;
      delete tmp.fan;
      _line(tmp);
      data.count = 1;
    }
    var fanCount = (data.fan ? (data.count || 1) : 1);
    var hitCount = (data.fan ? 1 : (data.count || 1));
    var area = Sim.math.lineArea(Sim.target.radius, size, origin, data.range, data.angle, data.fan, fanCount, data.skip);
    if (area < 1e-9) return;
    area = Math.min(area, Sim.target.area) / Sim.target.area;
    var distance;
    if (!data.pierce || data.speed) {
      distance = Sim.math.lineDistance(tcount, Sim.target.radius, size, origin, data.range, data.angle, data.fan, fanCount, data.skip);
      if (distance === undefined) return;
    }
    var secondary;
    if (data.pierce) {
      var hits = tcount * area;
      if (data.pierce !== true) {
        hits = Sim.math.limitedAverage(area, tcount, data.pierce);
      }
      data.count = hitCount;
      data.targets = hits;
      data.distance = origin;
    } else {
      data.count = hitCount;
      data.targets = 1 - Math.pow(1 - area, tcount);
      if (data.area && tcount > 1) {
        var ta = Math.PI * Math.pow(data.area + Sim.target.size, 2);
        ta = Math.min(ta, Sim.target.area) / Sim.target.area;
        var targets = (tcount - 1) * ta;
        if (data.areamax) {
          targets = Sim.math.limitedAverage(ta, tcount - 1, data.areamax);
        }
        if (data.areacoeff || data.areadelay) {
          secondary = Sim.extend({}, data);
          secondary.targets *= targets;
          secondary.coeff = (data.areacoeff || data.coeff);
          secondary.delay = data.areadelay;
          delete secondary.onhit;
        } else {
          data.targets *= 1 + targets;
        }
      }
      data.distance = distance + size;
    }
    if (data.speed) {
      var delay = distance / data.speed;
      Sim.after(delay, _target, data);
      if (secondary) {
        Sim.after(delay + (secondary.delay || 0), _target, secondary);
      }
    } else {
      _target(data);
      if (secondary) {
        _target(secondary);
      }
    }
  }

  function _ball(data) {
    var size = (data.radius || 0) + Sim.target.size;
    var origin = (data.origin || Sim.target.distance);
    var range = (data.range || Sim.target.radius + origin + size);

    var distance = Sim.math.lineDistance(Sim.target.count, Sim.target.radius, size, origin, range);
    if (distance === undefined) return;
    var delay = distance / data.speed;
    data.distance = origin;

    var total = Sim.math.slowball(Sim.target.radius, size, -origin, -origin + range) / data.speed;
    data.count = (data.count || 1) * Sim.target.density * total / data.rate;

    if (delay) {
      Sim.after(delay, _target, data);
    } else {
      _target(data);
    }
  }

  Sim.getTargets = function(range, origin) {
    var area = Sim.math.circleIntersection(origin || 0, Sim.target.size + range, Sim.target.radius);
    return Math.min(area, Sim.target.area) * Sim.target.density;
  };

  function _area(data) {
    var area;
    if (data.self) {
      data.distance = data.range / 2;
    }
    if (data.front) {
      data.origin = Math.abs((data.origin || Sim.target.distance) - data.range);
      data.distance = data.range;
    }
    if (data.spread) {
      area = Sim.math.circleArea(Sim.target.radius, Sim.target.size + data.range, data.spread,
        data.origin || (data.self && Sim.target.distance) || 0, data.inner);
    } else if (data.self || data.origin) {
      area = Sim.math.circleIntersection(data.origin || Sim.target.distance,
        Sim.target.size + data.range, Sim.target.radius);
    } else {
      area = Math.PI * Math.pow(Math.min(Sim.target.radius, Sim.target.size + data.range), 2);
    }
    var tcount = Sim.target.count + (data.cmod || 0);
    var prob = Math.min(area, Sim.target.area) / Sim.target.area;
    if (data.cap) {
      data.targets = Sim.math.limitedAverage(prob, tcount, data.cap);
    } else {
      data.targets = tcount * prob;
    }
    if (data.targets) {
      _target(data);
    }
  }

  function _cone(data) {
    data.distance = data.range / 2;
    var area = Sim.math.coneArea(Sim.target.radius, Sim.target.size,
      data.origin || Sim.target.distance, data.width || 90, data.range, data.angle);
    var tcount = Sim.target.count + (data.cmod || 0);
    var prob = Math.min(area, Sim.target.area) / Sim.target.area;
    if (data.cap) {
      data.targets = Sim.math.limitedAverage(prob, tcount, data.cap);
    } else {
      data.targets = tcount * prob;
    }
    if (data.targets) {
      _target(data);
    }
  }

  function _waveoflight(data) {
    var res = Sim.math.waveOfLight(Sim.target.count, Sim.target.radius,
      (data.radius || 0) + Sim.target.size, Sim.target.distance, data.range,
      data.expos, data.exrange);
    if (!res) return;
    data.targets = Math.min(res.area, Sim.target.area) / Sim.target.area * Sim.target.count;
    data.distance = res.distance;
    Sim.after(res.distance / data.speed, _target, data);
  }

  function _rollingthunder(data) {
    var res = Sim.math.rollingThunder(Sim.target.count, Sim.target.radius,
      Sim.target.size, Sim.target.distance, data.range, data.angle,
      data.expos, data.exrange);
    if (!res) return;
    data.targets = Math.min(res.area, Sim.target.area) / Sim.target.area * Sim.target.count;
    data.distance = res.distance;
    _target(data);
  }

  function _damage(data) {
    switch (data.type) {
    case "line":
      _line(data);
      break;
    case "ball":
      _ball(data);
      break;
    case "area":
      _area(data);
      break;
    case "cone":
      _cone(data);
      break;
    case "waveoflight":
      _waveoflight(data);
      break;
    case "rollingthunder":
      _rollingthunder(data);
      break;
    default:
      _target(data);
    }
  }

  Sim.damage = function(data) {
    data.castInfo = this.castInfo();
    if (data.castInfo && !data.skill) {
      data.skill = data.castInfo.skill;
    }
    if (data.castInfo && data.castInfo.proc && data.proc === undefined) {
      data.proc = data.castInfo.proc;
      data.castInfo = this.extend({}, data.castInfo);
      delete data.castInfo.proc;
    }
    if (data.castInfo && data.elem === undefined) {
      data.elem = data.castInfo.elem;
    }
    data.castId = this.getCastId();

    data.weapon = (data.castInfo && data.castInfo.weapon || this.curweapon);

    this.pushCastInfo(data.castInfo);

    if (data.delay) {
      var delay = data.delay;
      delete data.delay;
      this.after(delay, _damage, data);
    } else {
      _damage(data);
    }

    this.popCastInfo();
  };

})();
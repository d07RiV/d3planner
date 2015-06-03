(function() {
  var Sim = Simulator;

  // SERIOUS MATH SECTION //

  function _wrap(func) {
    var storage = {};
    return function() {
      var obj = JSON.stringify(Array.prototype.slice.apply(arguments));
      if (storage[obj] === undefined) {
        storage[obj] = func.apply(this, arguments);
      }
      return storage[obj];
    }
  }

  function _integrate(func, x0, x1) {
    var area = 0;
    var sign = 1;
    if (x1 < x0) {
      var tmp = x0;
      x0 = x1;
      x1 = tmp;
      sign = -1;
    }
    var step = (x1 - x0) * 0.001;
    var prev = func(x0);
    for (var x = x0; x < x1; x += step) {
      var nx = Math.min(x + step, x1);
      var next = func(nx);
      area += 0.5 * (next + prev) * (nx - x);
      prev = next;
    }
    return sign * area;
  }

  function _circle_intersection_sub(d, r, R) {
    return r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r)) +
           R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R)) -
           0.5 * Math.sqrt((-d + r + R) * (d - r + R) * (d + r - R) * (d + r + R));
  }
  function _circle_intersection(d, r, R) {
    if (r > R) {
      var tmp = r;
      r = R;
      R = tmp;
    }
    d = Math.abs(d);
    if (d < R - r) {
      return r * r * Math.PI;
    }
    if (d > R + r) {
      return 0;
    }
    return _circle_intersection_sub(d, r, R);
  }

  var _calc_area = _wrap(function(r0, s0, r1, s1) {
    var r = r0, R = s0 + s1;
    if (r > R) {
      var tmp = r;
      r = R;
      R = tmp;
    }
    var t = R - r;
    if (r1 < t) {
      return r * r * Math.PI;
    }
    var area = r * r * Math.PI * t * t;
    area += _integrate(function(x) {
      return 2 * x * _circle_intersection_sub(x, r, R);
    }, t, Math.min(r1, R + r));
    return area / (r1 * r1);
  });

  var _calc_area_d = _wrap(function(r0, s0, r1, s1, dist) {
    var r = r0, R = s0 + s1;
    if (r > R) {
      var tmp = r;
      r = R;
      R = tmp;
    }
    var area = 0;
    area += _integrate(function(x) {
      return Math.acos((dist * dist + x * x - r1 * r1) / (2 * dist * x)) * _circle_intersection(x, r, R);
    }, Math.max(0, dist - r1), Math.min(dist + r1, R + r));
    return area / (Math.PI * r1 * r1);
  });
  var _calc_area_di = _wrap(function(r0, s0, r1, s1, dist, inner) {
    var r = r0, R = s0 + s1;
    if (r > R) {
      var tmp = r;
      r = R;
      R = tmp;
    }
    var area = 0;
    area += _integrate(function(x) {
      var len = Math.acos((dist * dist + x * x - r1 * r1) / (2 * dist * x));
      if (x > dist - inner && x < dist + inner) {
        len -= Math.acos((dist * dist + x * x - inner * inner) / (2 * dist * x));
      }
      return len * _circle_intersection(x, r, R);
    }, Math.max(0, dist - r1), Math.min(dist + r1, R + r));
    return area / (Math.PI * (r1 * r1 - inner * inner));
  });

  var _calc_slowball = _wrap(function(radius, size, t0, t1) {
    return _integrate(function(x) {
      return _circle_intersection(x, radius, size);
    }, t0, t1);
  });

  //////////////////////////

  Sim.curweapon = "mainhand";

  function _target(data) {
    var stats = Sim.stats;
    var triggered = (data.castInfo && data.castInfo.triggered);

    var base = stats.info[data.weapon].wpnbase;
    var avg = (base.min + base.max) * 0.5;

    var factor = 1 + 0.01 * stats.info.primary;
    if (data.fix) {
      data.fix.call(data);
    }
    factor *= (data.coeff === undefined ? 1 : data.coeff);
    factor *= (data.factor || 1);

    var dibs = (data.dibs || 0);
    var chc = stats.final.chc + (data.chc || 0);
    var chd = stats.chd + (data.chd || 0);
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
      dibs += (stats[prefix + triggered] || stats[prefix + data.skill] || 0);
    }

    var elem = (data.elem === "max" ? stats.info.maxelem : data.elem);
    dibs += stats.getSpecial("damage", elem, ispet, data.skill, data.exclude);
    dibs += stats.getSpecial("dmgtaken", elem, ispet, data.skill, data.exclude);

    factor *= 1 + 0.01 * dibs;

    var elemental = (elem && stats["dmg" + elem] || 0);
    if (ispet) elemental += (stats.info.petdamage || 0);
    factor *= 1 + 0.01 * elemental;

    if (Sim.target.elite) {
      factor *= 1 + 0.01 * (stats.edmg || 0);
    }
    if (Sim.target.type) {
      factor *= 1 + 0.01 * (stats["damage_" + Sim.target.type] || 0);
    }

    var dmgmul = stats.getSpecial("dmgmul", elem, ispet, data.skill, data.exclude);
    factor *= dmgmul;

    if (stats.gems.zei) {
      var dist = (data.distance || data.origin || Sim.target.distance);
      factor *= 1 + 0.01 * dist * (4 + 0.05 * stats.gems.zei) / 10;
    }

    var value = avg * factor;
    if (!data.nocrit) {
      value *= 1 + chc * chd;
    }

    var count = (data.count || 1);
    if (data.targets) {
      count *= Math.min(data.targets, Sim.target.count);
    }

    var event = {
      targets: count,
      skill: data.skill,
      proc: data.proc,
      damage: value,
      elem: data.elem,
      pet: ispet,
      castInfo: data.castInfo,
      triggered: triggered,
      chc: chc,
    };

    if (event.proc && !event.pet) {
      Sim.trigger("onhit_proc", event);
    }
    Sim.trigger("onhit", event);
    if (data.onhit) {
      data.onhit(event);
    }

    if (!ispet) {
      if (Sim.target.area_coeff === undefined) {
        var area = Math.PI * Math.pow(Sim.target.size + 10, 2);
        Sim.target.area_coeff = (Sim.target.count - 1) * area / Sim.target.area;
      }
      if (Sim.target.area_coeff && stats.area) {
        // area dmg unaffected by multiplicative buffs?
        Sim.record("area", value * count * 0.01 * stats.area * 0.2 * Sim.target.area_coeff / dmgmul);
      }
    }
  }

  function _line(data) {
    var tcount = Sim.target.count + (data.cmod || 0);
    if (!tcount) return;
    var origin = (data.origin || Sim.target.distance);
    var ldist = 0;
    var edist = origin;
    var width = Sim.target.size + (data.radius || 0);
    if (data.fan && data.count && data.count > 1) {
      var tmp = Sim.extend({}, data);
      tmp.count -= 1;
      tmp.angle = data.fan * 0.5;
      delete tmp.fan;
      _line(tmp);
      data.count = 1;
    }
    if (data.angle) {
      var angle = Math.PI * data.angle / 180;
      ldist = Math.abs(origin * Math.sin(angle));
      edist = origin * Math.cos(angle);
    }
    var mdist = Math.max(Math.min(ldist, ldist - width), 0);
    var ewidth = Math.min(Sim.target.radius, ldist + width) - Math.max(-Sim.target.radius, ldist - width);
    if (ewidth < 1e-4 || mdist > Sim.target.radius - 1e-4) {
      return;
    }
    var mlen = Math.sqrt(Sim.target.radius * Sim.target.radius - mdist * mdist);
    var t0 = Math.max(0, edist - mlen);
    var t1 = edist + mlen;
    if (data.range) {
      t1 = Math.min(data.range, t1);
    }
    var elength = t1 - t0;
    if (elength < 0) {
      return;
    }
    var area = Math.min(elength * ewidth, Sim.target.area);
    var fail = 1 - area / Sim.target.area;
    var prob = Math.pow(fail, Sim.target.count + tcount);
    var first = t0 + Sim.target.area / ewidth * (
      tcount / (tcount + 1) * (prob * fail - 1) - prob + 1
    );
    if (data.pierce) {
      data.count = (data.count || 1) * tcount * area / Sim.target.area;
      data.distance = (t0 + t1) / 2;
    } else {
      data.count = (data.count || 1) * (1 - prob);
      if (data.area) {
        var ta = Math.PI * Math.pow(data.area + Sim.target.size, 2);
        data.count *= 1 + (tcount - 1) * Math.min(ta, Sim.target.area) / Sim.target.area;
      }
      data.distance = first;
    }
    if (data.speed) {
      var delay = (first - width) / data.speed;
      Sim.after(delay, _target, data);
    } else {
      _target(data);
    }
  }

  function _ball(data) {
    var size = (data.radius || 0) + Sim.target.size;
    var origin = -(data.origin || Sim.target.distance);
    var range = (data.range || Sim.target.radius - origin + size);

    var t0 = Math.max(origin - size, -Sim.target.radius);
    var t1 = Math.min(origin + range + size, Sim.target.radius);
    var length = t1 - t0;
    var width = 2 * Math.min(size, Sim.target.radius);
    var area = Math.min(length * width, Sim.target.area);
    var fail = 1 - area / Sim.target.area;
    var prob = Math.pow(fail, Sim.target.count);
    var first = t0 + Sim.target.area / width * (
      Sim.target.count / (Sim.target.count + 1) * (prob * fail - 1) - prob + 1
    );
    var delay = Math.max(0, first - origin - size) / data.speed;
    data.distance = Math.max(0, (t0 + t1) / 2 - origin);

    var total = _calc_slowball(Sim.target.radius, size, origin, origin + range) / data.speed;
    data.count = (data.count || 1) * Sim.target.density * total / data.rate;

    if (delay) {
      Sim.after(delay, _target, data);
    } else {
      _target(data);
    }
  }

  function _area(data) {
    var area;
    if (data.self || data.origin || data.inner) {
      if (data.spread) {
        area = _calc_area_d(Sim.target.radius, Sim.target.size, data.spread, data.range,
          data.origin || (data.self && Sim.target.distance) || 0, data.inner);
      } else {
        area = _circle_intersection(data.origin || Sim.target.distance,
          Sim.target.size + data.range, Sim.target.radius);
      }
    } else if (data.spread) {
      area = _calc_area(Sim.target.radius, Sim.target.size, data.spread, data.range);
    } else {
      area = Math.PI * Math.pow(Math.min(Sim.target.radius, Sim.target.size + data.range), 2);
    }
    data.targets = Math.min(area, Sim.target.area) * Sim.target.density;
    _target(data);
  }

  function _cone(data) {
    data.range /= 2;
    data.origin = Math.abs((data.origin || Sim.target.distance) - data.range);
    _area(data);
  };

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
    default:
      _target(data);
    }
  }

  Sim.damage = function(data) {
    data.castInfo = this.castInfo();
    if (data.castInfo && !data.skill) {
      data.skill = data.castInfo.skill;
      if (data.castInfo.proc && data.proc === undefined) {
        data.proc = data.castInfo.proc;
        data.castInfo = this.extend({}, data.castInfo);
        delete data.castInfo.proc;
      }
    }
    if (data.castInfo && data.elem === undefined) {
      data.elem = data.castInfo.elem;
    }

    switch (data.weapon) {
    case "mainhand":
    case "offhand":
      if (!this.stats.info[data.weapon]) {
        return;
      }
      this.curweapon = data.weapon;
      break;
    case "current":
      data.weapon = this.curweapon;
      break;
    default:
      data.weapon = this.curweapon;
      if (this.stats.info.offhand) {
        this.curweapon = (this.curweapon === "mainhand" ? "offhand" : "mainhand");
      }
    }

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
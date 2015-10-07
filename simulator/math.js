(function() {
  var Sim = Simulator;

  function _norm(x, y) {
    return Math.sqrt(x * x + y * y);
  }
  function _norm2(x, y) {
    return x * x + y * y;
  }

  function PolyShape() {
    this.edges = [];
    this.pos = {x: 0, y: 0};
  }
  PolyShape.prototype.moveTo = function(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  };
  PolyShape.prototype.lineTo = function(x, y) {
    this.edges.push({x0: this.pos.x, y0: this.pos.y, x1: x, y1: y});
    this.pos.x = x;
    this.pos.y = y;
  };
  PolyShape.prototype.circleTo = function(x, y, cx, cy, dir) {
    this.edges.push({
      x0: this.pos.x, y0: this.pos.y,
      x1: x, y1: y,
      cx: cx, cy: cy,
      r: _norm(cx - this.pos.x, cy - this.pos.y),
      circle: (dir || 1),
    });
    this.pos.x = x;
    this.pos.y = y;
  };
  PolyShape.prototype.copy = function(dst) {
    if (!this.edges.length) return;
    dst.moveTo(this.edges[0].x0, this.edges[0].y0);
    for (var i = 0; i < this.edges.length; ++i) {
      var e = this.edges[i];
      if (e.circle) {
        dst.circleTo(e.x1, e.y1, e.cx, e.cy, e.circle);
      } else {
        dst.lineTo(e.x1, e.y1);
      }
    }
    return dst;
  };
  function PolyShapeArea() {
    this.pos = {x: 0, y: 0};
    this.area = 0;
  }
  PolyShapeArea.prototype.moveTo = function(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  };
  PolyShapeArea.prototype.lineTo = function(x, y) {
    this.area += 0.5 * (this.pos.x * y - this.pos.y * x);
    this.pos.x = x;
    this.pos.y = y;
  };
  PolyShapeArea.prototype.circleTo = function(x, y, cx, cy, dir) {
    this.area += 0.5 * (this.pos.x * y - this.pos.y * x);
    var r2 = _norm2(cx - this.pos.x, cy - this.pos.y);
    var cp = (this.pos.x - cx) * (y - cy) - (this.pos.y - cy) * (x - cx);
    var dp = (this.pos.x - cx) * (x - cx) + (this.pos.y - cy) * (y - cy);
    var angle = Math.atan2(cp / r2, dp / r2);
    if ((dir || 1) > 0) {
      if (angle < 0) angle += Math.PI * 2;
    } else {
      if (angle > 0) angle -= Math.PI * 2;
    }
    this.area += (angle * r2 - cp) * 0.5;
    this.pos.x = x;
    this.pos.y = y;
  };

  function Tracker(x, y) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
      this.value = x.value;
    } else {
      this.x = x;
      this.y = y;
      this.value = 0;
    }
  }
  Tracker.prototype.line = function(x0, y0, x1, y1) {
    var a0 = Math.atan2(y0 - this.y, x0 - this.x);
    var a1 = Math.atan2(y1 - this.y, x1 - this.x);
    var delta = a1 - a0;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    this.value += delta;
  };
  Tracker.prototype.circle = function(x0, y0, x1, y1, cx, cy, dir) {
    var r = _norm2(x0 - cx, y0 - cy);
    var a0 = Math.atan2(y0 - this.y, x0 - this.x);
    var a1 = Math.atan2(y1 - this.y, x1 - this.x);
    var delta = a1 - a0;
    if (delta < 0) delta += Math.PI * 2;
    if (_norm2(cx - this.x, cy - this.y) < r) {
      if (dir < 0) delta -= Math.PI * 2;
    } else {
      if (delta > Math.PI) delta -= Math.PI * 2;
    }
    this.value += delta;
  };

  PolyShape.prototype.intersect = function(cx, cy, r, dst) {
    if (!dst) dst = new PolyShapeArea();
    var first;
    var last;
    var tracker = new Tracker(cx, cy);
    function _start(x, y, trk) {
      if (first) {
        if (_norm2(x - dst.pos.x, y - dst.pos.y) > 1e-9) {
          dst.circleTo(x, y, cx, cy, (trk.value > last ? 1 : -1));
        }
      } else {
        dst.moveTo(x, y);
        first = {x: x, y: y, a: trk.value};
      }
    }
    for (var i = 0; i < this.edges.length; ++i) {
      var e = this.edges[i];
      var trk = new Tracker(tracker);
      if (e.circle) {
        tracker.circle(e.x0, e.y0, e.x1, e.y1, e.cx, e.cy, e.circle);
        var dist = _norm(e.cx - cx, e.cy - cy);
        if (dist < r - e.r) {
          _start(e.x0, e.y0, trk);
          dst.circleTo(e.x1, e.y1, e.cx, e.cy, e.circle);
          last = tracker.value;
          continue;
        }
        if (dist > r + e.r || dist < e.r - e) continue;
        var p = 0.5 * (dist * dist - r * r + e.r * e.r) / dist;
        var da = Math.acos(p / e.r);
        var amid = Math.atan2(cy - e.cy, cx - e.cx);
        var a0 = Math.atan2(e.y0 - e.cy, e.x0 - e.cx);
        var a1 = Math.atan2(e.y1 - e.cy, e.x1 - e.cx);
        if (a1 < a0) a1 += Math.PI * 2;
        while (amid + da > a0) amid -= Math.PI * 2;
        while (amid + da < a0) amid += Math.PI * 2;
        var px = e.x0, py = e.y0;
        while (amid - da < a1) {
          var ca0 = Math.max(a0, amid - da);
          var ca1 = Math.min(a1, amid + da);
          var x0 = e.cx + Math.cos(ca0) * e.r, y0 = e.cy + Math.sin(ca0) * e.r;
          var x1 = e.cx + Math.cos(ca1) * e.r, y1 = e.cy + Math.sin(ca1) * e.r;
          trk.circle(px, py, x0, y0, e.cx, e.cy, e.circle);
          _start(x0, y0, trk);
          dst.circleTo(x1, y1, e.cx, e.cy, e.circle);
          trk.circle(x0, y0, x1, y1, e.cx, e.cy, e.circle);
          last = trk.value;
          amid += Math.PI * 2;
          px = x1; py = y1;
        }
      } else {
        tracker.line(e.x0, e.y0, e.x1, e.y1);
        var norm = _norm(e.x1 - e.x0, e.y1 - e.y0);
        var cp = (cx - e.x0) * (e.y1 - e.y0) - (cy - e.y0) * (e.x1 - e.x0);
        var dp = (cx - e.x0) * (e.x1 - e.x0) + (cy - e.y0) * (e.y1 - e.y0);
        var pdist = Math.abs(cp) / norm;
        if (pdist > r) continue;
        pdist = Math.sqrt(r * r - pdist * pdist);
        var tm = dp / norm;
        var t0 = (tm - pdist) / norm;
        var t1 = (tm + pdist) / norm;
        if (t0 > 1 || t1 < 0) continue;
        t0 = Math.max(0, t0);
        t1 = Math.min(1, t1);
        var x0 = e.x0 + (e.x1 - e.x0) * t0, y0 = e.y0 + (e.y1 - e.y0) * t0;
        var x1 = e.x0 + (e.x1 - e.x0) * t1, y1 = e.y0 + (e.y1 - e.y0) * t1;
        trk.line(e.x0, e.y0, x0, y0);
        _start(x0, y0, trk);
        dst.lineTo(x1, y1);
        trk.line(x0, y0, x1, y1);
        last = trk.value;
      }
    }
    if (first) {
      tracker.value += first.a;
      _start(first.x, first.y, tracker);
    } else {
      if (this.contains(cx, cy)) {
        dst.moveTo(cx - r, cy);
        dst.circleTo(cx + r, cy, cx, cy);
        dst.circleTo(cx - r, cy, cx, cy);
      }
    }
    return dst;
  };
  PolyShape.prototype.contains = function(x, y) {
    var count = 0;
    for (var i = 0; i < this.edges.length; ++i) {
      var e = this.edges[i];
      if (e.circle) {
        var a0 = Math.atan2(e.y0 - e.cy, e.x0 - e.cx);
        var a1 = Math.atan2(e.y1 - e.cy, e.x1 - e.cx);
        if (e.circle < 0) {
          var tmp = a0; a0 = a1; a1 = tmp;
        }
        if (a1 < a0) a1 += Math.PI * 2;
        var dc = Math.abs(e.cy - y);
        if (dc > e.r) continue;
        var dx = Math.sqrt(e.r * e.r - dc * dc);
        if (e.cx - dx > x) {
          var a = Math.atan2(y - e.cy, -dx);
          while (a < a0 + 1e-9) a += Math.PI * 2;
          while (a > a1 + 1e-9) a -= Math.PI * 2;
          if (a > a0 + 1e-9) ++count;
        }
        if (e.cx + dx > x) {
          var a = Math.atan2(y - e.cy, dx);
          while (a < a0 - 1e-9) a += Math.PI * 2;
          while (a > a1 - 1e-9) a -= Math.PI * 2;
          if (a > a0 - 1e-9) ++count;
        }
      } else {
        var x0 = e.x0, x1 = e.x1, y0 = e.y0, y1 = e.y1;
        if (y0 > y1) {
          var tmp = y0; y0 = y1; y1 = tmp;
          tmp = x0; x0 = x1; x1 = tmp;
        }
        if (y0 > y + 1e-9 || y1 < y + 1e-9) continue;
        if (y0 > y - 1e-9) {
          if (x0 > x) ++count;
        } else {
          var px = x0 + (x1 - x0) * (y - y0) / (y1 - y0);
          if (px > x) ++count;
        }
      }
    }
    return !!(count & 1);
  };

  PolyShape.prototype.area = function() {
    var tmp = new PolyShapeArea();
    this.copy(tmp);
    return tmp.area;
  };

  PolyShape.prototype.capsule = function(x0, y0, x1, y1, r) {
    var dx = y0 - y1, dy = x1 - x0;
    var norm = _norm(dx, dy);
    if (norm < 1e-6) {
      this.moveTo(x0 - r, y0);
      this.circleTo(x0 + r, y0, x0, y0);
      this.circleTo(x0 - r, y0, x0, y0);
      return;
    }
    var dn = r / norm;
    dx *= dn; dy *= dn;
    this.moveTo(x0 - dx, y0 - dy);
    this.lineTo(x1 - dx, y1 - dy);
    this.circleTo(x1 + dx, y1 + dy, x1, y1);
    this.lineTo(x0 + dx, y0 + dy);
    this.circleTo(x0 - dx, y0 - dy, x0, y0);
  };
  PolyShape.prototype.cone = function(x, y, dir, angle, radius, size) {
    //dir *= Math.PI / 180;
    //angle *= Math.PI / 180;
    var v0x = Math.cos(dir - 0.5 * angle), v0y = Math.sin(dir - 0.5 * angle);
    var v1x = Math.cos(dir + 0.5 * angle), v1y = Math.sin(dir + 0.5 * angle);
    var p0x = v0y * size, p0y = -v0x * size;
    var p1x = -v1y * size, p1y = v1x * size;
    var x0 = x + v0x * radius, y0 = y + v0y * radius;
    var x1 = x + v1x * radius, y1 = y + v1y * radius;
    this.moveTo(x + p0x, y + p0y);
    this.lineTo(x0 + p0x, y0 + p0y);
    if (size > 1e-9) this.circleTo(x0 + v0x * size, y0 + v0y * size, x0, y0);
    this.circleTo(x1 + v1x * size, y1 + v1y * size, x, y);
    if (size > 1e-9) this.circleTo(x1 + p1x, y1 + p1y, x1, y1);
    this.lineTo(x + p1x, y + p1y);
    if (size > 1e-9 && angle < Math.PI - 1e-6) {
      this.circleTo(x + p0x, y + p0y, x, y);
    }
  };
  PolyShape.prototype.lines = function(x, y, dir, fan, range, radius, count) {
    //fan *= Math.PI / 180;
    //dir *= Math.PI / 180;
    var total = fan * (count - 1);
    var first = dir - total * 0.5;
    var critical = (radius < range ? 2 * Math.asin(radius / range) : 2 * Math.PI);
    var tfx = x + Math.cos(first) * (range + radius), tfy = y + Math.sin(first) * (range + radius);
    this.moveTo(tfx, tfy);
    for (var index = 0; index < count; ++index) {
      var cur = first + fan * index;
      var next = (index < count - 1 ? cur + fan : first + 2 * Math.PI);
      var mid = 0.5 * (next + cur);
      var delta = next - cur;
      var cx = x + Math.cos(cur) * range, cy = y + Math.sin(cur) * range;
      if (delta < critical) {
        var p = range * Math.sin(delta * 0.5);
        var dist = range * Math.cos(delta * 0.5) + Math.sqrt(radius * radius - p * p);
        this.circleTo(x + Math.cos(mid) * dist, y + Math.sin(mid) * dist, cx, cy);
      } else if (next - cur <= Math.PI + 1e-9) {
        var dist = 2 * radius * Math.cos(delta * 0.5) / Math.sin(delta);
        var cp = cur + 0.5 * Math.PI, np = next - 0.5 * Math.PI;
        var nx = x + Math.cos(next) * range, ny = y + Math.sin(next) * range;
        this.circleTo(cx + Math.cos(cp) * radius, cy + Math.sin(cp) * radius, cx, cy);
        this.lineTo(x + Math.cos(mid) * dist, y + Math.sin(mid) * dist);
        this.lineTo(nx + Math.cos(np) * radius, ny + Math.sin(np) * radius);
      } else {
        var cp = cur + 0.5 * Math.PI, np = next - 0.5 * Math.PI;
        var cdx = Math.cos(cp) * radius, cdy = Math.sin(cp) * radius;
        var ndx = Math.cos(np) * radius, ndy = Math.sin(np) * radius;
        var nx = x + Math.cos(next) * range, ny = y + Math.sin(next) * range;
        this.circleTo(cx + cdx, cy + cdy, cx, cy);
        this.lineTo(x + cdx, y + cdy);
        this.circleTo(x + ndx, y + ndy, x, y);
        this.lineTo(nx + ndx, ny + ndy);
      }
    }
    this.circleTo(tfx, tfy, x + Math.cos(first) * range, y + Math.sin(first) * range);
  };

  function _wrap(func) {
    var storage = {};
    return function() {
      var obj = JSON.stringify(Array.prototype.slice.apply(arguments));
      if (!(obj in storage)) {
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

  Sim.math = {};

  Sim.math.circleIntersection = _circle_intersection;
  Sim.math.circleArea = _wrap(function(radius, size, spread, origin, inner) {
    var r = radius, R = size;
    if (r > R) {
      var tmp = r;
      r = R;
      R = tmp;
    }
    if (!origin && !inner) {
      var t = R - r;
      if (spread < t) {
        return r * r * Math.PI;
      }
      var area = r * r * Math.PI * t * t;
      area += _integrate(function(x) {
        return 2 * x * _circle_intersection_sub(x, r, R);
      }, t, Math.min(spread, R + r));
      return area / (spread * spread);
    } else if (!inner) {
      var area = _integrate(function(x) {
        return Math.acos((origin * origin + x * x - spread * spread) / (2 * origin * x)) * _circle_intersection(x, r, R);
      }, Math.max(0, origin - spread), Math.min(origin + spread, R + r));
      return area / (Math.PI * spread * spread);
    } else {
      var area = _integrate(function(x) {
        var len = Math.acos((origin * origin + x * x - spread * spread) / (2 * origin * x));
        if (x > origin - inner && x < origin + inner) {
          len -= Math.acos((origin * origin + x * x - inner * inner) / (2 * origin * x));
        }
        return len * _circle_intersection(x, r, R);
      }, Math.max(0, origin - spread), Math.min(origin + spread, R + r));
      return area / (Math.PI * (spread * spread - inner * inner));
    }
  });
  Sim.math.slowball = _wrap(function(radius, size, t0, t1) {
    return _integrate(function(x) {
      return _circle_intersection(x, radius, size);
    }, t0, t1);
  });

  Sim.math.lineArea = _wrap(function(spread, size, origin, range, angle, fan, count, skip) {
    var shape = new PolyShape();
    angle = (angle || 0) * Math.PI / 180;
    if (origin === undefined) origin = 0;
    if (range === undefined) range = origin + spread + size;
    if (!count || count <= 1) {
      var ca = Math.cos(angle), sa = Math.sin(angle);
      skip = (skip || 0); range += skip;
      shape.capsule(-origin + ca * skip, sa * skip, -origin + ca * range, sa * range, size);
    } else {
      shape.lines(-origin, 0, angle, fan * Math.PI / 180, range, size, count);
    }
    return shape.intersect(0, 0, spread).area;
  });
  Sim.math.lineDistance = _wrap(function(targets, spread, size, origin, range, angle, fan, count, skip) {
    angle = (angle || 0) * Math.PI / 180;
    if (origin === undefined) origin = 0;
    if (range === undefined) range = origin + spread + size;
    range = Math.min(range, origin + spread + size);
    var cosa = Math.cos(angle), sina = Math.sin(angle);
    skip = (skip || 0);
    function f(t) {
      var shape = new PolyShape();
      if (!count || count <= 1) {
        shape.capsule(-origin + cosa * skip, sina * skip, -origin + cosa * (t + skip), sina * (t + skip), size);
      } else {
        shape.lines(-origin, 0, angle, fan * Math.PI / 180, t, size, count);
      }
      return shape.intersect(0, 0, spread).area;
    }
    var area = Math.PI * spread * spread;
    function p(t) {
      return 1 - Math.pow(1 - f(t) / area, targets);
    }
    var final = p(range);
    if (final < 1e-6) return undefined;
    return range - _integrate(p, 0, range) / final;
  });
  Sim.math.waveOfLight = _wrap(function(targets, spread, size, origin, range, expos, exrange) {
    function f(t) {
      var shape = new PolyShape();
      shape.capsule(-origin, 0, -origin + t, 0, size);
      var inter = new PolyShape();
      shape.intersect(0, 0, spread, inter);
      return Math.max(0, inter.area() - inter.intersect(-expos, 0, exrange).area);
    }
    var area = Math.PI * spread * spread;
    function p(t) {
      return 1 - Math.pow(1 - f(t) / area, targets);
    }
    var final = p(range);
    if (final < 1e-6) return undefined;
    return {area: f(range), distance: range - _integrate(p, 0, range) / final};
  });
  Sim.math.rollingThunder = _wrap(function(targets, spread, size, origin, range, angle, expos, exrange) {
    angle = (angle || 0) * Math.PI / 180;
    var shape = new PolyShape();
    shape.cone(-origin, 0, 0, angle, range, size);
    var inter = new PolyShape();
    shape.intersect(0, 0, spread, inter);
    var area = Math.max(0, inter.area() - inter.intersect(-expos, 0, exrange + size).area);
    if (area < 1e-6) return undefined;
    return {area: area, distance: range / 2};
  });

  Sim.math.coneArea = _wrap(function(spread, size, origin, width, range, angle) {
    var shape = new PolyShape();
    angle = (angle || 0) * Math.PI / 180;
    if (origin === undefined) origin = 0;
    if (range === undefined) range = origin + spread;
    shape.cone(-origin, 0, angle, (width || 90) * Math.PI / 180, range, size);
    return shape.intersect(0, 0, spread).area;
  });

  Sim.math.limitedAverage = _wrap(function(p, total, limit) {
    if (p > 0.999) return limit;
    var prob = Math.pow(1 - p, total);
    var sum = 0;
    for (var n = 1; n <= total; ++n) {
      prob *= (total - n + 1) / n * p / (1 - p);
      sum += prob * Math.min(n, limit);
    }
    return sum;
  });

})();

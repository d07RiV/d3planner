(function() {
  var Sim = Simulator;

  Sim.statusBuffs = {
    chilled: {},
    frozen: {dr: true},
    blinded: {dr: true},
    stunned: {dr: true},
    slowed: {},
    knockback: {},
    charmed: {dr: true},
    feared: {dr: true},
    rooted: {dr: true},
  };

  var buffQueue = new Sim.Heap(function(e) {
    return e.time;
  });
  function _after(frames, func, data) {
    frames = Math.ceil(frames);
    var e = {
      time: Sim.time + frames,
      func: func,
      data: data,
      castInfo: Sim.castInfo(),
    };
    buffQueue.push(e);
    return e;
  };
  function _removeEvent(e) {
    buffQueue.remove(e);
  };

  Sim.buffsModified = true;
  Sim.register("update", function(evt) {
    var time = evt.time;
    while (!buffQueue.empty() && buffQueue.top().time <= time) {
      var e = buffQueue.pop();
      this.time = e.time;
      this.pushCastInfo(e.castInfo);
      e.data = (e.data || {});
      e.data.time = e.time;
      e.func(e.data);
      this.popCastInfo();
    }
    this.time = time;
    if (this.buffsModified) {
      this.stats = new this.Stats(this.baseStats, this.buffs);
      this.buffsModified = false;
    }
  });

  Sim.buffs = {};
  Sim.metaBuffs = {};
  Sim.uptimes = {};
  var lastUpdate = {};
  function updateUptime(id) {
    var stacks = (Sim.buffs[id] && Sim.buffs[id].stacks || 0);
    var delta = Sim.time - (lastUpdate[id] || 0);
    Sim.uptimes[id] = (Sim.uptimes[id] || 0) + delta * stacks;
    lastUpdate[id] = Sim.time;
  }
  Sim.register("finish", function() {
    for (var id in this.buffs) {
      updateUptime(id);
    }
    var tmp = {};
    for (var id in this.uptimes) {
      if (id.indexOf("uniq_") === 0) continue;
      tmp[id] = this.uptimes[id] / this.time;
    }
    this.uptimes = tmp;
  });

  function deepEquals(a, b) {
    if (a === b) return true;
    if (!(a instanceof Object && b instanceof Object)) return false;
    for (var key in a) {
      if (a.hasOwnProperty(key) !== b.hasOwnProperty(key)) {
        return false;
      } else if (typeof a[key] !== typeof b[key]) {
        return false;
      }
    }
    for (var key in b) {
      if (a.hasOwnProperty(key) !== b.hasOwnProperty(key)) {
        return false;
      } else if (typeof a[key] !== typeof b[key]) {
        return false;
      }
      if (a[key] instanceof Object) {
        if (!deepEquals(a[key], b[key])) {
          return false;
        }
      } else if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }

  Sim.setBuffStats = function(id, stats, stacks) {
    var buff = this.buffs[id];
    if (!buff) return;
    if (stats === null) stats = buff.stats;
    var prev = (buff.stats || {});
    stacks = Math.min(stacks, buff.params.maxstacks);
    if (!deepEquals(prev, stats) || (buff.params.multiply && stacks != buff.stacks && !deepEquals({}, stats))) {
      this.buffsModified = true;
    }
    buff.stats = stats;
    buff.stacks = stacks;
  };

  var dr_accum = 0;
  var dr_start, dr_end;
  function drUpdate() {
    if (dr_start !== undefined) {
      dr_accum = Math.min(6 * (Sim.target.maxdr || 0), dr_accum + Sim.time - dr_start);
      dr_start = undefined;
    }
    if (dr_end !== undefined) {
      dr_accum = Math.max(0, dr_accum - (Sim.time - dr_end));
      dr_end = undefined;
    }
    return 1 - dr_accum / 600;
  }

  function onBuffExpired(e) {
    updateUptime(e.id);
    var buff = Sim.buffs[e.id];
    if (buff) {
      if (buff.stats && !deepEquals(buff.stats, {})) {
        Sim.buffsModified = true;
      }
      if (buff.params.refresh && buff.params.onexpire) {
        Sim.pushCastInfo(buff.castInfo);
        buff.params.onexpire(buff.data);
        Sim.popCastInfo();
      }
      for (var evt in buff.events) {
        if (evt === "expire") {
          _removeEvent(buff.events[evt]);
        } else {
          Sim.removeEvent(buff.events[evt]);
        }
      }
      if (buff.params.status && Sim.statusBuffs[buff.params.status].dr) {
        drUpdate();
        dr_end = e.time;
      }
      buff.expired = true;
      delete Sim.buffs[e.id];
    }
  }
  function removeStack(buff) {
    var stack = buff.stacklist[buff.stackstart];
    if (buff.params.onexpire) {
      Sim.pushCastInfo(stack.castInfo);
      buff.params.onexpire(stack.data);
      Sim.popCastInfo();
    }
    for (var evt in stack.events) {
      if (evt === "expire") {
        _removeEvent(stack.events[evt]);
      } else {
        Sim.removeEvent(stack.events[evt]);
      }
    }
    stack.expired = true;
    buff.stacklist[buff.stackstart] = undefined;
    buff.stackstart = (buff.stackstart + 1) % buff.params.maxstacks;
    return stack;
  }
  Sim.reduceStackDuration = function(id, stack, amount) {
    var buff = this.buffs[id];
    if (!buff) return 0;
    if (stack.time - this.time <= amount) {
      var remains = stack.time - this.time;
      removeStack(buff);
      --buff.stacks;
      if (buff.stacks) {
        if (buff.params.multiply) {
          Sim.buffsModified = true;
        }
      } else {
        onBuffExpired({id: id});
      }
      return remains;
    } else {
      stack.time -= amount;
      if (stack.events.expire) _removeEvent(stack.events.expire);
      stack.events.expire = _after(stack.time - this.time, onStackExpired, {id: id});
      return amount;
    }
  };
  function onStackExpired(e) {
    updateUptime(e.id);
    var buff = Sim.buffs[e.id];
    if (buff) {
      while (buff.stacks && buff.stacklist[buff.stackstart].time <= e.time) {
        removeStack(buff);
        --buff.stacks;
      }
      if (buff.stacks) {
        if (buff.params.multiply) {
          Sim.buffsModified = true;
        }
      } else {
        onBuffExpired(e);
      }
    }
  }
  function onBuffTick(e) {
    var obj = (e.stack || e.buff);
    ++e.buff.ticks;
    delete obj.events.tick;
    if (obj.time !== undefined && obj.time <= e.time) {
      return;
    }
    if (e.buff.params.ontick) {
      obj.data.stacks = e.buff.stacks;
      obj.data.time = e.time;
      Sim.pushCastInfo(obj.castInfo);
      if (typeof e.buff.params.ontick === "function") {
        e.buff.params.ontick(obj.data);
      } else {
        Sim.damage(Sim.extend({}, e.buff.params.ontick));
      }
      Sim.popCastInfo();
    }
    if (!obj.expired && !obj.events.tick) {
      obj.events.tick = Sim.after(e.buff.params.tickrate, onBuffTick, e);
    }
  }
  Sim.delayBuff = function(id, delay) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return;
      for (var i = 0; i < meta.length; ++i) {
        Sim.delayBuff(meta[i], delay);
      }
      return;
    }
    if (buff.params.refresh) {
      if (buff.events.tick && buff.events.tick.time < this.time + delay) {
        this.removeEvent(buff.events.tick);
        buff.events.tick = this.after(delay, onBuffTick, {buff: buff});
      }
    } else {
      for (var i = 0; i < buff.stacklist.length; ++i) {
        var stack = buff.stacklist[i];
        if (stack && stack.events.tick && stack.events.tick.time < this.time + delay) {
          this.removeEvent(stack.events.tick);
          stack.events.tick = this.after(delay, onBuffTick, {buff: buff, stack: stack});
        }
      }
    }
  };

  Sim.refreshBuff = function(id, duration) {
    var buff = this.buffs[id];
    if (buff && buff.params.refresh && (duration === "infinite" || (buff.time !== undefined && this.time + duration > buff.time))) {
      if (buff.events.expire) {
        _removeEvent(buff.events.expire);
      }
      if (duration !== "infinite") {
        buff.time = this.time + duration;
        buff.events.expire = _after(duration, onBuffExpired, {id: id});
      } else {
        delete buff.time;
      }
    }
  };
  var uniqId = 0;
  Sim.addBuff = function(id, stats, params) {
    if (!id) {
      id = "uniq_" + (uniqId++);
    }
    updateUptime(id);
    if (typeof params === "number") {
      params = {duration: params};
    }
    params = this.extend({
      stacks: 1,
      refresh: true,
      multiply: true,
    }, params);
    if (!params.maxstacks) {
      params.maxstacks = params.stacks;
    }
    if (this.statusBuffs[id]) {
      params.status = id;
    }
    if (params.status) {
      stats = (stats || {});
      stats[params.status] = 1;
      if (params.status === "stunned" && this.stats.leg_dovuenergytrap && params.duration) {
        params.duration *= 1 + 0.01 * this.stats.leg_dovuenergytrap;
      }
      if (this.statusBuffs[params.status].dr) {
        if (params.nodr) {
          drUpdate();
        } else {
          params.duration = Math.floor((params.duration || 60) * drUpdate());
          if (Sim.target.mincc && params.duration < Sim.target.mincc * 60) {
            return;
          }
        }
        dr_start = this.time;
      }
    }

    //if (params.maxstacks === 1) {
    //  params.refresh = true;
    //}
    params.stacks = Math.min(params.stacks, params.maxstacks);

    var buff = this.buffs[id];
    if (!buff && !params.stacks) {
      return;
    }
    var existed = !!buff;
    if (!buff) {
      this.buffs[id] = buff = {
        params: params,
        stacks: 0,
        ticks: 0,
        events: {},
        start: this.time,
        userStart: this.time,
        castInfo: this.castInfo(),
      };
      if (!params.refresh) {
        buff.stacklist = new Array(params.maxstacks);
        buff.stackstart = 0;
      }

      buff.data = this.extend({buff: buff}, params.data);
    } else {
      var castInfo = this.castInfo();
      if (castInfo) {
        var castRefresh = 48 / this.stats.info.aps;
        if (this.time >= buff.userStart + castRefresh) {
          buff.castInfo.user = castInfo.user;
          buff.userStart = this.time;
        }
        buff.castInfo.weapon = castInfo.weapon;
      }
    }

    var oldstacks = buff.stacks;
    this.setBuffStats(id, stats, buff.stacks + params.stacks);

    if (params.refresh) {
      if (params.duration && (!buff.time || buff.time < this.time + params.duration)) {
        buff.time = this.time + params.duration;
        if (buff.events.expire) {
          _removeEvent(buff.events.expire);
        }
        buff.events.expire = _after(params.duration, onBuffExpired, {id: id});
      }
      if (params.tickrate && !buff.events.tick) {
        buff.events.tick = this.after(params.tickinitial || params.tickrate, onBuffTick, {buff: buff});
      }
      if (existed) {
        if (params.onrefresh) {
          params.onrefresh(buff.data, params.data);
        } else {
          this.extend(buff.data, params.data);
        }
      } else {
        if (params.onapply) {
          params.onapply(buff.data);
        }
      }
    } else {
      /*while (buff.stacks < oldstacks + params.stacks) {
        if (params.onrefresh) {
          var stack = buff.stacklist[buff.stackstart];
          Sim.pushCastInfo(stack.castInfo);
          params.onrefresh(stack.data);
          Sim.popCastInfo();
        }
        removeStack(buff);
        --oldstacks;
      }*/
      var pos = (buff.stackstart + oldstacks) % buff.params.maxstacks;
      for (var i = 0; i < params.stacks; ++i) {
        var tickinitial = undefined;
        if (buff.stacklist[pos]) {
          var stack = buff.stacklist[pos];
          if (params.tickrate && params.tickkeep && stack.events.tick) {
            tickinitial = stack.events.tick.time - this.time;
          }
          if (params.onrefresh) {
            Sim.pushCastInfo(stack.castInfo);
            params.onrefresh(stack.data);
            Sim.popCastInfo();
          }
          removeStack(buff);
        }
        var stack = {
          events: {},
          castInfo: this.castInfo(),
          start: this.time,
        };
        if (params.duration) {
          stack.time = this.time + params.duration;
          stack.events.expire = _after(params.duration, onStackExpired, {id: id});
        }
        stack.data = this.extend({buff: buff, stack: stack}, params.data);
        if (params.onapply) {
          params.onapply(stack.data);
        }
        if (params.tickrate) {
          stack.events.tick = this.after(tickinitial || params.tickinitial || params.tickrate,
            onBuffTick, {buff: buff, stack: stack});
        }
        buff.stacklist[pos] = stack;
        pos = (pos + 1) % buff.params.maxstacks;
      }
    }
    return id;
  };
  Sim.removeBuff = function(id, stacks) {
    var buff = this.buffs[id];
    if (buff) {
      if (stacks === undefined || stacks >= buff.stacks) {
        var stack;
        if (buff.stacklist) {
          while (buff.stacks) {
            stack = removeStack(buff);
            --buff.stacks;
          }
        }
        onBuffExpired({id: id});
        return stack;
      }
      var oldstacks = buff.stacks;
      if (buff.params.multiply) {
        this.setBuffStats(id, buff.stats, buff.stacks - stacks);
      } else {
        this.buff.stacks -= stacks;
      }
      if (buff.stacklist) {
        var stack;
        for (var i = 0; i < stacks; ++i) {
          stack = removeStack(buff);
        }
        return stack;
      }
    }
  };
  Sim.metaBuff = function(id, list) {
    Sim.metaBuffs[id] = list;
  };
  Sim.getBuff = function(id) {
    if (this.statusBuffs[id]) {
      return this.stats[id];
    }
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var count = 0;
      for (var i = 0; i < meta.length; ++i) {
        count += Sim.getBuff(meta[i]);
      }
      return count;
    }
    return buff.stacks;
  };
  Sim.getBuffDuration = function(id) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var dura = Sim.getBuffDuration(meta[0]);
      for (var i = 1; i < meta.length; ++i) {
        dura = Math.max(dura, Sim.getBuffDuration(meta[i]));
      }
      return dura;
    }
    if (buff.params.refresh) {
      return (buff.time ? buff.time - this.time : 1e+10);
    } else {
      if (!buff.stacks) return 0;
      var stack = buff.stacklist[(buff.stackstart + buff.stacks - 1) % buff.params.maxstacks];
      return (stack.time ? stack.time - this.time : 1e+10);
    }
  };
  Sim.getBuffDurationLast = function(id) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var dura = Sim.getBuffDuration(meta[0]);;
      for (var i = 1; i < meta.length; ++i) {
        dura = Math.min(dura, Sim.getBuffDuration(meta[i]));
      }
      return dura;
    }
    if (buff.stacks < buff.params.maxstacks) return 0;
    if (buff.params.refresh) {
      return (buff.time ? buff.time - this.time : 1e+10);
    } else {
      if (!buff.stacks) return 0;
      var stack = buff.stacklist[buff.stackstart];
      return (stack.time ? stack.time - this.time : 1e+10);
    }
  };
  Sim.getBuffTicks = function(id) {
    var buff = this.buffs[id];
    return (buff ? buff.ticks : 0);
  };
  Sim.getBuffData = function(id) {
    var buff = this.buffs[id];
    return buff && buff.data;
  };
})();
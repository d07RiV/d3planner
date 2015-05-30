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
  };

  Sim.buffsModified = true;
  Sim.register("update", function() {
    if (this.buffsModified) {
      this.stats = new this.Stats(this.baseStats, this.buffs);
      this.buffsModified = false;
    }
  });

  Sim.buffs = {};

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
        if (!deepEquals(a[key], b[key], factor)) {
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
      dr_accum = Math.min(6 * (Sim.target.dr_max || 0), dr_accum + Sim.time - dr_start);
      dr_start = undefined;
    }
    if (dr_end !== undefined) {
      dr_accum = Math.max(0, dr_accum - (Sim.time - dr_end));
      dr_end = undefined;
    }
    return 1 - dr_accum / 600;
  }

  function onBuffExpired(e) {
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
        Sim.removeEvent(buff.events[evt]);
      }
      delete Sim.buffs[e.id];
    }
    if (buff.params.status && Sim.statusBuffs[buff.params.status].dr) {
      drUpdate();
      dr_end = e.time;
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
      Sim.removeEvent(stack.events[evt]);
    }
    buff.stacklist[buff.stackstart] = undefined;
    buff.stackstart = (buff.stackstart + 1) % buff.params.maxstacks;
  }
  function onStackExpired(e) {
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
    if (obj.time !== undefined && obj.time <= e.time) {
      delete obj.events.tick;
      return;
    }
    if (e.buff.params.ontick) {
      obj.data.stacks = e.buff.stacks;
      obj.data.time = e.time;
      Sim.pushCastInfo(obj.castInfo);
      e.buff.params.ontick(obj.data);
      Sim.popCastInfo();
    }
    obj.events.tick = Sim.after(e.buff.params.tickrate, onBuffTick, e);
  }

  Sim.refreshBuff = function(id, duration) {
    var buff = this.buffs[id];
    if (buff && buff.params.refresh) {
      buff.time = this.time + duration;
      if (buff.events.expire) {
        this.removeEvent(buff.events.expire);
      }
      buff.events.expire = this.after(duration, onBuffExpired, {id: id});
    }
  };
  var uniqId = 0;
  Sim.addBuff = function(id, stats, params) {
    if (!id) {
      id = "uniq_" + (uniqId++);
    }
    if (typeof params === "number") {
      params = {duration: params};
    }
    params = this.extend({
      stacks: 1,
      maxstacks: 1,
      refresh: true,
      multiply: true,
    }, params);
    if (this.statusBuffs[id]) {
      params.status = id;
    }
    if (params.status) {
      stats = (stats || {});
      stats[params.status] = 1;
      if (this.statusBuffs[params.status].dr) {
        params.duration = Math.floor((params.duration || 60) * drUpdate());
        if (Sim.target.mincc && params.duration < Sim.target.mincc) {
          return;
        }
        dr_start = this.time;
      }
    }

    if (params.maxstacks === 1) {
      params.refresh = true;
    }
    params.stacks = Math.min(params.stacks, params.maxstacks);

    var buff = this.buffs[id];
    if (!buff && !params.stacks) {
      return;
    }
    if (!buff) {
      this.buffs[id] = buff = {
        params: params,
        stacks: 0,
        events: {},
        start: this.time,
        castInfo: this.castInfo(),
      };
      if (!params.refresh) {
        buff.stacklist = new Array(params.maxstacks);
        buff.stackstart = 0;
      }

      buff.data = this.extend({buff: buff}, params.data);
      if (params.onapply) {
        params.onapply(buff.data);
      }
    } else {
      var castInfo = this.castInfo();
      if (castInfo) {
        buff.castInfo.user = castInfo.user;
      }
      if (params.onrefresh) {
        params.onrefresh(buff.data);
      }
    }

    var oldstacks = buff.stacks;
    this.setBuffStats(id, stats, buff.stacks + params.stacks);

    if (params.refresh) {
      if (params.duration && (!buff.time || buff.time < this.time + params.duration)) {
        buff.time = this.time + params.duration;
        if (buff.events.expire) {
          this.removeEvent(buff.events.expire);
        }
        buff.events.expire = this.after(params.duration, onBuffExpired, {id: id});
      }
      if (params.tickrate && !buff.events.tick) {
        buff.events.tick = this.after(params.tickinitial || params.tickrate, onBuffTick, {buff: buff});
      }
      this.extend(buff.data, params.data);
    } else {
      while (buff.stacks < oldstacks + params.stacks) {
        if (params.onrefresh) {
          var stack = buff.stacklist[buff.stackstart];
          Sim.pushCastInfo(stack.castInfo);
          params.onrefresh(stack.data);
          Sim.popCastInfo();
        }
        removeStack(buff);
        --oldstacks;
      }
      var pos = (buff.stackstart + oldstacks) % buff.params.maxstacks;
      for (var i = oldstacks; i < buff.stacks; ++i) {
        var stack = {
          events: {},
          castInfo: this.castInfo(),
          start: this.time,
        };
        if (params.duration) {
          stack.time = this.time + params.duration;
          stack.events.expire = this.after(params.duration, onStackExpired, {id: id});
        }
        stack.data = this.extend({buff: buff, stack: stack}, params.data);
        if (params.onapply) {
          params.onapply(stack.data);
        }
        if (params.tickrate) {
          stack.events.tick = this.after(params.tickinitial || params.tickrate, onBuffTick, {buff: buff, stack: stack});
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
        if (buff.stacklist) {
          while (buff.stacks) {
            removeStack(buff);
            --buff.stacks;
          }
        }
        onBuffExpired({id: id});
        return;
      }
      var oldstacks = buff.stacks;
      if (buff.params.multiply) {
        this.setBuffStats(id, buff.stats, buff.stacks - stacks);
      } else {
        this.buff.stacks -= stacks;
      }
      if (buff.stacklist) {
        for (var i = 0; i < stacks; ++i) {
          removeStack(buff);
        }
      }
    }
  };
  Sim.getBuff = function(id) {
    var buff = this.buffs[id];
    if (!buff) return 0;
    return buff.stacks;
  };
  Sim.getBuffDuration = function(id) {
    var buff = this.buffs[id];
    if (!buff) return false;
    if (buff.params.refresh) {
      return (buff.time ? buff.time - this.time : true);
    } else {
      if (!buff.stacks) return false;
      var stack = buff.stacklist[(buff.stackstart + buff.stacks - 1) % buff.params.maxstacks];
      return (stack.time ? stack.time - this.time : true);
    }
  };
})();
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

  Sim.buffWatchList = {};
  Sim.buffWatchers = {};
  Sim.statusWatchers = {};
  Sim.buffs = {};
  Sim.metaBuffs = {};
  Sim.metaParents = {};
  Sim.uptimes = {};

  function _buff(id, target) {
    var buff = Sim.buffs[id];
    if (!buff) return;
    if (target !== undefined && buff.targets) {
      buff = buff.targets[target];
    }
    return buff;
  }

  Sim.watchBuff = function(name, func) {
    if (!this.buffWatchers[name]) {
      this.buffWatchers[name] = [];
    }
    var castInfo = this.newCastInfo();
    this.buffWatchers[name].push({func: func, castInfo: castInfo});

    this.pushCastInfo(castInfo);
    func.call(this, {stacks: this.getBuff(name), duration: this.getBuffDuration(name)});
    this.popCastInfo();
  };
  Sim.watchStatus = function(name, func) {
    if (!this.statusWatchers[name]) {
      this.statusWatchers[name] = [];
    }
    Sim.statusWatchers[name].push({func: func, castInfo: this.newCastInfo()});
  };
  Sim.buffWatchTrigger = function(name) {
    this.buffWatchList[name] = true;
    var parents = this.metaParents[name];
    if (parents) for (var i = 0; i < parents.length; ++i) {
      this.buffWatchTrigger(parents[i]);
    }
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

    for (var name in this.buffWatchList) {
      var data = {stacks: this.getBuff(name), duration: this.getBuffDuration(name), targets: this.getBuffTargets(name)};
      var watchers = this.buffWatchers[name];
      if (watchers) for (var i = 0; i < watchers.length; ++i) {
        var castInfo = this.extend({}, watchers[i].castInfo);
        castInfo.castId = this.getCastId();
        this.pushCastInfo(castInfo);
        watchers[i].func.call(this, data);
        this.popCastInfo();
      }
    }
    this.buffWatchList = {};

    if (this.buffsModified) {
      this.stats = new this.Stats(this.baseStats, this.buffs);
      this.buffsModified = false;
    }
  });

  var lastUpdate = {};
  function updateUptime(id) {
    /*var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var count = 0;
      for (var i = 0; i < meta.length; ++i) {
        count += Sim.getBuff(meta[i]);
      }
      return count;
    }
    if (buff.targets) {
      buff = buff.targets[this.target.boss ? 0 : this.target.index];
    }
    return (buff && buff.stacks || 0);*/
    var stacks = Sim.getBuff(id);
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
  function buffEquals(prev, stats) {
    if (!prev && !stats) return true;
    return deepEquals(prev, stats);
  }

  Sim.setBuffStats = function(buff, stats, stacks) {
    if (stats === null) stats = buff.stats;
    stacks = Math.min(stacks, buff.params.maxstacks);
    if (!buffEquals(buff.stats, stats) || (buff.params.multiply && stacks != buff.stacks && !buffEquals(undefined, stats))) {
      this.buffsModified = true;
    }
    buff.stats = stats;
    buff.stacks = stacks;
  };

  var dr_accum = [], dr_start = [], dr_end = [];
  function drUpdate(index) {
    index = (index || 0);
    if (dr_start[index] !== undefined) {
      dr_accum[index] = Math.min(12 * (Sim.target.maxdr || 0), (dr_accum[index] || 0) + 2 * (Sim.time - dr_start[index]));
      dr_start[index] = undefined;
    }
    if (dr_end[index] !== undefined) {
      dr_accum[index] = Math.max(0, (dr_accum[index] || 0) - (Sim.time - dr_end[index]));
      dr_end[index] = undefined;
    }
    return 1 - (dr_accum[index] || 0) / 1200;
  }
  function drStart(index) {
    dr_start[index || 0] = Sim.time;
  }
  function drEnd(index) {
    dr_end[index || 0] = Sim.time;
  }

  function onBuffExpired(e) {
    updateUptime(e.id);
    var buff = _buff(e.id, e.target);
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
        drUpdate(e.target);
        drEnd(e.target);
      }
      buff.expired = true;
      if (Sim.buffs[e.id].targets && e.target) {
        delete Sim.buffs[e.id].targets[e.target];
      } else {
        delete Sim.buffs[e.id];
      }
    }
    Sim.buffWatchTrigger(e.id);
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

  function _reduceBuffDuration(dst, buff, amount) {
    if (buff.params.refresh) {
      if (buff.time - this.time <= amount) {
        dst.push({buff: buff, duration: buff.time - this.time});
        onBuffExpired({id: buff.id, target: buff.target});
      } else {
        dst.push({buff: buff, duration: amount});
        buff.time -= amount;
        if (buff.events.expire) _removeEvent(buff.events.expire);
        buff.events.expire = _after(buff.time - this.time, onBuffExpired, {id: buff.id, target: buff.target});
      }
    } else {
      for (var i = 0; i < buff.stacks; ++i) {
        var stack = buff.stacklist[(buff.stackstart + i) % buff.stacklist.length];
        if (stack.time - this.time <= amount) {
          dst.push({buff: stack, duration: stack.time - this.time});
          removeStack(buff);
          --buff.stacks;
          if (buff.stacks) {
            if (buff.params.multiply) {
              Sim.buffsModified = true;
            }
            Sim.buffWatchTrigger(buff.id);
          } else {
            onBuffExpired({id: buff.id, target: buff.target});
          }
        } else {
          dst.push({buff: stack, duration: amount});
          stack.time -= amount;
          if (stack.events.expire) _removeEvent(stack.events.expire);
          stack.events.expire = _after(stack.time - this.time, onStackExpired, {id: buff.id, target: buff.target});
        }
      }
    }
  }
  Sim.reduceBuffDuration = function(id, amount, targets) {
    var buff = this.buffs[id];
    var dst = [];
    if (!buff) return dst;
    updateUptime(id);
    if (buff.targets) {
      var maxTarget = this.target.index + (targets || this.target.count) - (this.target.boss ? 1 : 0);
      for (var idx in buff.targets) {
        if (idx < maxTarget) {
          _reduceBuffDuration.call(this, dst, buff.targets[idx], amount);
        }
      }
    } else {
      _reduceBuffDuration.call(this, dst, buff, amount);
    }
    return dst;
  };

  function onStackExpired(e) {
    updateUptime(e.id);
    var buff = _buff(e.id, e.target);
    if (buff) {
      while (buff.stacks && buff.stacklist[buff.stackstart].time <= e.time) {
        removeStack(buff);
        --buff.stacks;
      }
      if (buff.stacks) {
        if (buff.params.multiply) {
          Sim.buffsModified = true;
        }
        Sim.buffWatchTrigger(e.id);
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

  function _delayBuff(buff, delay, stacks) {
    if (buff.params.refresh) {
      if (buff.events.tick && buff.events.tick.time < this.time + delay) {
        this.removeEvent(buff.events.tick);
        buff.events.tick = this.after(delay, onBuffTick, {buff: buff});
        return 1;
      }
    } else {
      var reduced = 0;
      for (var i = 0; i < buff.stacklist.length && stacks > reduced; ++i) {
        var stack = buff.stacklist[i];
        if (stack && stack.events.tick && stack.events.tick.time < this.time + delay) {
          this.removeEvent(stack.events.tick);
          stack.events.tick = this.after(delay, onBuffTick, {buff: buff, stack: stack});
          ++reduced;
        }
      }
      return reduced;
    }
    return 0;
  }
  Sim.delayBuff = function(id, delay, stacks) {
    var buff = this.buffs[id];
    if (stacks === undefined) stacks = 9999;
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var reduced = 0;
      for (var i = 0; i < meta.length && stacks > reduced; ++i) {
        reduced += Sim.delayBuff(meta[i], delay, stacks - reduced);
      }
      return reduced;
    }
    if (buff.targets) {
      var sum = 0;
      for (var idx in buff.targets) {
        sum += _delayBuff.call(this, buff.targets[idx], delay, stacks);
      }
      return sum;
    } else {
      return _delayBuff.call(this, buff, delay, stacks);
    }
  };

  function _refreshBuff(buff, duration) {
    if (buff.params.refresh && (duration === "infinite" || (buff.time !== undefined && this.time + duration > buff.time))) {
      if (buff.events.expire) {
        _removeEvent(buff.events.expire);
      }
      if (duration !== "infinite") {
        buff.time = this.time + duration;
        buff.events.expire = _after(duration, onBuffExpired, {id: buff.id, target: buff.target});
      } else {
        delete buff.time;
      }
    }
  }
  Sim.refreshBuff = function(id, duration, target) {
    var buff = this.buffs[id];
    if (buff) {
      if (buff.targets) {
        if (target !== undefined) {
          if (buff.targets[target]) {
            _refreshBuff.call(this, buff.targets[target], duration);
          }
        } else {
          for (var idx in buff.targets) {
            _refreshBuff.call(this, buff.targets[idx], duration);
          }
        }
      } else {
        _refreshBuff.call(this, buff, duration);
      }
    }
  };

  var uniqId = 0;
  Sim.addBuff = function(id, stats, params, party) {
    if (!id) {
      id = "uniq_" + (uniqId++);
    }
    updateUptime(id);
    if (typeof params === "number") {
      params = {duration: params};
    }
    if (params && params.stacks) params.stacks = Math.round(params.stacks);
    if (params && params.maxstacks) params.maxstacks = Math.round(params.maxstacks);
    if (params && params.targets && !(params.targets instanceof Array)) {
      params.targets = Math.min(Sim.random("buff_" + id, 1, params.targets, true), Sim.target.count);
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
      params.targets = (params.targets || 1);
      stats = (stats || {});
      stats[params.status] = 1;
      if (params.status === "stunned" && this.stats.leg_dovuenergytrap && params.duration) {
        params.duration *= 1 + 0.01 * this.stats.leg_dovuenergytrap;
      }
    }
    params.stacks = Math.min(params.stacks, params.maxstacks);

    //if (params.maxstacks === 1) {
    //  params.refresh = true;
    //}
    if (params.targets !== undefined) {
      if (!this.buffs[id]) this.buffs[id] = {targets: {}};
      var tlist = this.buffs[id].targets;
      var tindex = params.targets;
      if (!(tindex instanceof Array)) {
        var tcount = params.targets;
        tindex = [];
        if (params.firsttarget === "new") {
          var tgt = Sim.target.list();
          for (var idx in tgt) {
            if (!tlist[idx]) {
              tindex.push(idx);
              --tcount;
            }
          }
          delete params.firsttarget;
        }
        if (this.target.boss && !params.firsttarget) {
          tindex.push(0);
          --tcount;
        }
        var t0 = (params.firsttarget || this.target.index);
        for (var i = 0; i < tcount; ++i) {
          tindex.push(t0 + i);
        }
      }

      if (params.status) {
        //TODO: should we trigger before or after duration check?
        var watchers = this.statusWatchers[params.status];
        if (watchers) for (var i = 0; i < watchers.length; ++i) {
          this.pushCastInfo(watchers[i].castInfo);
          watchers[i].func.call(this, params.duration, tindex);
          this.popCastInfo();
        }
      }

      for (var i = 0; i < tindex.length; ++i) {
        var idx = tindex[i];
        var buff = makeBuff.call(this, tlist[idx], id, stats, params, idx);
        if (buff) tlist[idx] = buff;
      }
    } else {
      var buff = makeBuff.call(this, this.buffs[id], id, stats, params, party);
      if (buff) this.buffs[id] = buff;
    }
    this.buffWatchTrigger(id);
    return id;
  };

  function makeBuff(buff, id, stats, params, target) {
    if (!buff && !params.stacks) {
      return;
    }

    if (params.status) {
      if (this.statusBuffs[params.status].dr) {
        if (params.nodr) {
          drUpdate(target);
        } else {
          params = this.extend({}, params);
          params.duration = Math.floor((params.duration || 60) * drUpdate(target));
          if (Sim.target.mincc && params.duration < Sim.target.mincc * 60) {
            return;
          }
        }
        drStart(target);
      }
    }

    var existed = !!buff;
    if (!buff) {
      buff = {
        params: params,
        stacks: 0,
        ticks: 0,
        events: {},
        start: this.time,
        userStart: this.time,
        castInfo: this.castInfo(),
        id: id,
        target: target,
      };
      if (!params.refresh) {
        buff.stacklist = new Array(params.maxstacks);
        buff.stackstart = 0;
      }

      buff.data = this.extend({buff: buff}, params.data);
    } else {
      var castInfo = this.castInfo();
      if (castInfo && params.refresh) {
        var castRefresh = 48 / this.stats.info.aps;
        if (this.time >= buff.userStart + castRefresh) {
          buff.castInfo.user = castInfo.user;
          buff.userStart = this.time;
        }
        buff.castInfo.weapon = castInfo.weapon;
        buff.castInfo.castId = castInfo.castId;
      }
    }

    var oldstacks = buff.stacks;
    Sim.setBuffStats(buff, stats, buff.stacks + params.stacks);

    if (params.refresh) {
      if (params.duration && (!existed || (buff.time !== undefined && buff.time < this.time + params.duration))) {
        buff.time = this.time + params.duration;
        if (buff.events.expire) {
          _removeEvent(buff.events.expire);
        }
        buff.events.expire = _after(params.duration, onBuffExpired, {id: id, target: target});
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
          stack.events.expire = _after(params.duration, onStackExpired, {id: id, target: target});
        }
        stack.data = this.extend({buff: buff, stack: stack}, params.data);
        if (params.onapply) {
          params.onapply(stack.data);
        }
        if (params.tickrate) {
          if (tickinitial === undefined) {
            tickinitial = (params.tickinitial === undefined ? params.tickrate : params.tickinitial);
          }
          stack.events.tick = this.after(tickinitial, onBuffTick, {buff: buff, stack: stack});
        }
        buff.stacklist[pos] = stack;
        pos = (pos + 1) % buff.params.maxstacks;
      }
    }
    return buff;
  }

  Sim.removeBuff = function(id, stacks, targets) {
    var buff = this.buffs[id];
    if (buff) {
      updateUptime(id);
      if (buff.targets) {
        if (targets === undefined) targets = this.target.count;
        var res;
        if (this.target.boss && buff.targets[0]) {
          res = _removeBuff.call(this, buff.targets[0], stacks);
          --targets;
        }
        for (var i = 0; i < targets; ++i) {
          if (buff.targets[this.target.index + i]) {
            var cr = _removeBuff.call(this, buff.targets[this.target.index + i], stacks);
            if (!res) res = cr;
          }
        }
        return res;
      } else {
        return _removeBuff.call(this, buff, stacks);
      }
    }
  };
  function _removeBuff(buff, stacks) {
    if (stacks === undefined || stacks >= buff.stacks) {
      var stack;
      if (buff.stacklist) {
        while (buff.stacks) {
          stack = removeStack(buff);
          --buff.stacks;
        }
      }
      onBuffExpired({id: buff.id, target: buff.target});
      return stack;
    }
    var oldstacks = buff.stacks;
    if (buff.params.multiply) {
      this.setBuffStats(buff, buff.stats, buff.stacks - stacks);
    } else {
      this.buff.stacks -= stacks;
    }
    if (buff.stacklist) {
      var stack;
      for (var i = 0; i < stacks; ++i) {
        stack = removeStack(buff);
      }
      this.buffWatchTrigger(buff.id);
      return stack;
    }
  }

  Sim.setBuffStacks = function(id, buffs, stacks) {
    if (!id && !stacks) return;
    if (!id) return Sim.addBuff(id, buffs, {maxstacks: 999, stacks: stacks});
    updateUptime(id);
    var cur = Sim.getBuff(id);
    if (cur < stacks) Sim.addBuff(id, buffs, {maxstacks: 999, stacks: stacks - cur});
    else if (cur > stacks) Sim.removeBuff(id, cur - stacks);
    return id;
  };
  Sim.metaBuff = function(id, list) {
    Sim.metaBuffs[id] = list;
    for (var i = 0; i < list.length; ++i) {
      Sim.metaParents[list[i]] = (Sim.metaParents[list[i]] || []);
      Sim.metaParents[list[i]].push(id);
    }
  };
  Sim.getBuff = function(id, target) {
    if (this.statusBuffs[id]) {
      return this.stats[id] ? 1 : 0;
    }
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var count = 0;
      for (var i = 0; i < meta.length; ++i) {
        count += Sim.getBuff(meta[i], target);
      }
      return count;
    }
    if (buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    return (buff && buff.stacks || 0);
  };
  Sim.getBuffTargets = function(id) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var count = 0;
      for (var i = 0; i < meta.length; ++i) {
        count += Sim.getBuffTargets(meta[i]);
      }
      return count;
    }
    if (buff.targets) {
      var count = 0;
      for (var idx in buff.targets) {
        count += 1;
      }
      return count;
    }
    return 1;
  };
  Sim.getBuffTargetList = function(id) {
    var buff = this.buffs[id];
    var list = [];
    if (!buff || !buff.targets) return list;
    for (var idx in buff.targets) {
      list.push(idx);
    }
    list.sort(function(a, b) {return a - b;});
    return list;
  };
  Sim.getBuffDuration = function(id, target) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var dura = Sim.getBuffDuration(meta[0]);
      for (var i = 1; i < meta.length; ++i) {
        dura = Math.max(dura, Sim.getBuffDuration(meta[i], target));
      }
      return dura;
    }
    if (buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    if (!buff) return 0;
    if (buff.params.refresh) {
      return (buff.time ? buff.time - this.time : 1e+10);
    } else {
      if (!buff.stacks) return 0;
      var stack = buff.stacklist[(buff.stackstart + buff.stacks - 1) % buff.params.maxstacks];
      return (stack.time ? stack.time - this.time : 1e+10);
    }
  };
  Sim.getBuffDurationLast = function(id, target) {
    var buff = this.buffs[id];
    if (!buff) {
      var meta = this.metaBuffs[id];
      if (!meta) return 0;
      var dura = Sim.getBuffDuration(meta[0]);;
      for (var i = 1; i < meta.length; ++i) {
        dura = Math.min(dura, Sim.getBuffDuration(meta[i], target));
      }
      return dura;
    }
    if (buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    if (!buff) return 0;
    if (buff.stacks < buff.params.maxstacks) return 0;
    if (buff.params.refresh) {
      return (buff.time ? buff.time - this.time : 1e+10);
    } else {
      if (!buff.stacks) return 0;
      var stack = buff.stacklist[buff.stackstart];
      return (stack.time ? stack.time - this.time : 1e+10);
    }
  };
  Sim.getBuffElapsed = function(id, target) {
    var buff = this.buffs[id];
    if (buff && buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    return (buff ? Sim.time - buff.start : 0);
  };
  Sim.getBuffTicks = function(id, target) {
    var buff = this.buffs[id];
    if (buff && buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    return (buff ? buff.ticks : 0);
  };
  Sim.getBuffData = function(id, target) {
    var buff = this.buffs[id];
    if (buff && buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    return buff && buff.data;
  };
  Sim.getBuffStack = function(id, target) {
    var buff = this.buffs[id];
    if (buff && buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    if (!buff || !buff.stacklist || !buff.stacks) return;
    var pos = (buff.stackstart + buff.stacks - 1) % buff.params.maxstacks;
    return buff.stacklist[pos];
  };
  Sim.getBuffCastInfo = function(id, target) {
    var buff = this.buffs[id];
    if (buff && buff.targets) {
      buff = buff.targets[target === undefined ? (this.target.boss ? 0 : this.target.index) : target];
    }
    return (buff && buff.castInfo);
  };
})();
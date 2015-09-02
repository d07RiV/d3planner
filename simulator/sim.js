(function() {
  var Sim = Simulator;

  //importScripts("seedrandom.js");

  Sim.initClass = {};
  Sim.affixes = {};
  Sim.gems = {};

/*  Sim.run = function() {
    var baseStats = new DC.Stats();
    baseStats.loadItems();
    DC.addPartyBuffs(baseStats);
  };*/

  Sim.extend = function() {
    var deep = false;
    var i = 1;
    var target = arguments[0] || {};
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }

    if (typeof target !== "object") {
      target = {};
    }

    for (; i < arguments.length; ++i) {
      var options = arguments[i];
      if (options != null) {
        for (var name in options) {
          var src = target[name];
          var copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && copy instanceof Object) {
            var clone;
            if (copy instanceof Array) {
              clone = (src && src instanceof Array ? src : []);
            } else {
              clone = (src && src instanceof Object ? src : {});
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  };

  Sim.eventQueue = new Sim.Heap(function(e) {
    return e.time;
  });
  Sim.handlers = {};

  Sim.after = function(frames, func, data) {
    frames = Math.ceil(frames);
    var e = {
      time: this.time + frames,
      func: func,
      data: data,
      castInfo: this.castInfo(),
    };
    this.eventQueue.push(e);
    return e;
  };

  Sim.register = function(event, func, data) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    var castInfo = this.castInfo();
    if (castInfo) {
      castInfo = this.extend(true, {}, castInfo);
      delete castInfo.user;
    }
    this.handlers[event].push({func: func, castInfo: castInfo, data: data});
  };
  Sim.unregister = function(event, func) {
    var handlers = this.handlers[event];
    if (handlers) {
      for (var i = 0; i < handlers.length; ++i) {
        if (handlers[i].func === func) {
          handlers.splice(i, 1);
          return;
        }
      }
    }
  }
  Sim.trigger = function(event, data) {
    var results = [];
    if (this.handlers[event]) {
      data = data || {};
      data.time = this.time;
      data.event = event;
      for (var i = 0; i < this.handlers[event].length; ++i) {
        var handler = this.handlers[event][i];
        this.pushCastInfo(handler.castInfo);
        data.data = handler.data;
        results.push(handler.func.call(this, data));
        this.popCastInfo();
      }
      delete data.data;
      delete data.time;
      delete data.event;
    }
    return results;
  };

  Sim.removeEvent = function(e) {
    Sim.eventQueue.remove(e);
  };

  Sim.init = function(data) {
    this.baseStats = data.stats;
    this.target = {};
    this.params = data.params || {};
    this.time = 0;
    this.target.radius = Math.max(data.params.targetRadius || 0, 1);
    this.target.area = Math.PI * Math.pow(this.target.radius, 2);
    this.target.size = (data.params.targetSize || 0);
    this.target.count = (data.params.targetCount || 1);
    this.target.distance = (data.params.targetDistance || 0);
    this.target.elite = data.params.showElites;
    this.target.boss = data.params.targetBoss;
    this.target.type = (data.params.targetType || "");
    this.target.density = this.target.count / this.target.area;
    this.target.maxdr = 0;
    if (!this.target.elite) {
      this.target.boss = false;
    }
    if (this.target.elite) {
      this.target.maxdr = 65;
      this.target.mincc = 0.65;
    }
    if (this.target.boss) {
      this.target.maxdr = 70;
      this.target.mincc = 0.85;
    }
    this.priority = data.priority;
    try {
      var scripts = {
        wizard: "sim/wizard",
        demonhunter: "sim/demonhunter",
        witchdoctor: "sim/witchdoctor",
        monk: "sim/monk",
        barbarian: "sim/barbarian",
        crusader: "sim/crusader",
      };
      importScripts(scripts[data.stats.charClass]);
    } catch(e) {}
    this.stats = new this.Stats(this.baseStats, this.buffs);
    this.trigger("init");
    this.trigger("update");
    for (var id in this.affixes) {
      if (this.stats[id]) {
        this.pushCastInfo({triggered: id});
        this.affixes[id].call(id, this.stats[id]);
        this.popCastInfo();
      }
    }
    for (var id in this.stats.gems) {
      if (this.gems[id]) {
        this.pushCastInfo({triggered: id});
        this.gems[id].call(id, this.stats.gems[id]);
        this.popCastInfo();
      }
    }
  };

  Sim.verbose = false;
  Sim.run = function(duration) {
    duration = (duration || 36000);
    var start = this.time;
    while (!this.eventQueue.empty() && this.time < start + duration * 1.5 && Sim.targetHealth > 0) {
      var e = this.eventQueue.pop();
      this.time = e.time;
      this.trigger("update");
      this.pushCastInfo(e.castInfo);
      e.data = (e.data || {});
      e.data.time = e.time;
      e.data.event = e;
      e.func(e.data);
      this.popCastInfo();
    }
    this.trigger("finish");
  };

  var rngBuffer = {};
  Sim.random = function(id, chance, count, sum) {
    if (count === undefined) count = 1;
    if (sum) {
      chance *= count;
    } else {
      chance = 1 - Math.pow(1 - chance, count);
    }
    rngBuffer[id] = (rngBuffer[id] === undefined ? 0.5 : rngBuffer[id]) + chance;
    var result = Math.floor(rngBuffer[id]);
    rngBuffer[id] -= result;
    return result;
  };

  Sim.castInfoStack = [];
  Sim.pushCastInfo = function(info) {
    this.castInfoStack.push(info);
  };
  Sim.popCastInfo = function() {
    this.castInfoStack.pop();
  };
  Sim.castInfo = function() {
    if (this.castInfoStack.length) {
      return this.castInfoStack[this.castInfoStack.length - 1];
    }
  };
  Sim.getCastId = function() {
    for (var i = this.castInfoStack.length - 1; i >= 0; --i) {
      if (this.castInfoStack[i] && this.castInfoStack[i].castId) {
        return this.castInfoStack[i].castId;
      }
    }
  };

  Sim.postMessage = function(data) {
    postMessage(data);
  };
  onmessage = function(e) {
    if (e.data.type === "start") {
      Sim.init(e.data);
      Sim.run();
      Sim.postResults();
    }
  };

  Sim.testrun = function(data) {
    Sim.postMessage = function(data) {
      console.log(Sim.extend(true, {}, data));
    };
    Sim.init(data);
    Sim.run();
    Sim.postResults();
  }

})();
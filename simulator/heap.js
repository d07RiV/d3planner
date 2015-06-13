(function() {
  var Sim = Simulator;

  var _nextkey = 0;

  function Heap(scoreFn) {
    this.heap = [];
    this.map = {};
    this.scoreFn = scoreFn;
  };

  Heap.prototype.empty = function() {
    return this.heap.length === 0;
  };
  Heap.prototype.size = function() {
    return this.heap.length;
  };
  Heap.prototype.push = function(e) {
    if (e._heapkey !== undefined && this.map[e._heapkey] !== undefined) {
      return;
    }
    this.heap.push(e);
    this.siftUp(this.heap.length - 1);
  };
  Heap.prototype.top = function(e) {
    return this.heap[0];
  };
  Heap.prototype.pop = function(e) {
    var result = this.heap[0];
    var end = this.heap.pop();
    delete this.map[result._heapkey];
    delete result._heapkey;
    if (this.heap.length) {
      this.heap[0] = end;
      this.siftDown(0);
    }
    return result;
  };
  Heap.prototype.siftUp = function(pos) {
    var element = this.heap[pos];
    var score = this.scoreFn(element);
    while (pos > 0) {
      var next = Math.floor((pos - 1) / 2);
      var parent = this.heap[next];
      if (this.scoreFn(parent) < score) {
        break;
      }
      this.heap[pos] = parent;
      this.map[parent._heapkey] = pos;
      pos = next;
    }
    this.heap[pos] = element;
    if (element._heapkey === undefined) {
      element._heapkey = _nextkey++;
    }
    this.map[element._heapkey] = pos;
    return pos;
  };
  Heap.prototype.siftDown = function(pos) {
    var element = this.heap[pos];
    var score = this.scoreFn(element);
    while (2 * pos + 1 < this.heap.length) {
      var next = 2 * pos + 1;
      var child = this.heap[next];
      var cScore = this.scoreFn(child);
      if (next + 1 < this.heap.length) {
        var c2 = this.heap[next + 1];
        var c2Score = this.scoreFn(c2);
        if (c2Score < cScore) {
          child = c2;
          cScore = c2Score;
          ++next;
        }
      }
      if (score <= cScore) {
        break;
      }
      this.heap[pos] = child;
      this.map[child._heapkey] = pos;
      pos = next;
    }
    this.heap[pos] = element;
    if (element._heapkey === undefined) {
      element._heapkey = _nextkey++;
    }
    this.map[element._heapkey] = pos;
    return pos;
  };
  Heap.prototype.remove = function(e) {
    if (e._heapkey === undefined || this.map[e._heapkey] === undefined) {
      return;
    }
    var pos = this.map[e._heapkey];
    var end = this.heap.pop();
    delete this.map[e._heapkey];
    delete e._heapkey;
    if (pos < this.heap.length) {
      this.heap[pos] = end;
      pos = this.siftUp(pos);
      this.siftDown(pos);
    }
  };

  Sim.Heap = Heap;
})();
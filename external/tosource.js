// toSource polyfill by Riv
// based on https://github.com/piranna/tosource-polyfill
// added better incapsulation (no longer breaks every object by adding enumerable properties)
// more consistent formatting
(function() {
  function _fill(proto, func) {
    if (proto.toSource === undefined) {
      proto.toSource = func;
      Object.defineProperty(proto, "toSource", {enumerable: false});
    }
  }

  [Boolean, Function, Number, RegExp].forEach(function(constructor) {
    _fill(constructor.prototype, constructor.prototype.toString);
  });

  _fill(Date.prototype, function() {
    return 'new Date('+this.getTime()+')';
  });

  _fill(String.prototype, function() {
    return JSON.stringify(this);
  });

  _fill(Math, function() {
    return 'Math';
  });

  const DEFAULT_INDENT = '  ';
  var _filter;
  var _indent = DEFAULT_INDENT;
  var seen = [];

  function join(elements) {
    var offset = Array(seen.length + 2).join(_indent);
    return offset
         + elements.join(',' + (_indent && '\n') + offset) + ',\n';
  }

  _fill(Array.prototype, function() {
    var items = '';
    if (this.length) items = join(this.map(walk));
    else return '[]';
    return '[' + (_indent && '\n') + items + Array(seen.length + 1).join(_indent) + ']';
  });

  _fill(Object.prototype, function() {
    var keys = Object.keys(this);
    var items = '';
    if (keys.length) {
      items = join(keys.map(function (key) {
        var s_key = legalKey(key) ? key : JSON.stringify(key);
        var value = walk(this[key]);
        return s_key + ':' + (_indent && ' ') + value;
      }, this));
    } else {
      return '{}';
    }
    return '{' + (_indent && '\n') + items + Array(seen.length + 1).join(_indent) + '}';
  });

  function walk(object) {
    object = _filter ? _filter(object) : object;
    switch (typeof object) {
        case 'boolean':
        case 'function':
        case 'number':
        case 'string':    return object.toSource();
        case 'undefined': return 'undefined';
    }
    if (object === Math) return object.toSource();
    if (object === null) return 'null';
    if (object instanceof RegExp) return object.toSource();
    if (object instanceof Date)   return object.toSource();
    var index = seen.indexOf(object);
    if (index >= 0) return '{$circularReference:'+index+'}';
    // Arrays and Objects
    seen.push(object);
    var result = object.toSource();
    seen.pop();
    return result;
  };

  function getIndent(indent) {
    switch (typeof indent) {
      case 'boolean':   return indent ? DEFAULT_INDENT : '';
      case 'number':    return Array(indent + 1).join(' ');
      case 'string':    return indent;
      case 'undefined': return DEFAULT_INDENT;
    }
    if(indent === null) return '';
    throw SyntaxError('Invalid indent: '+indent);
  }

  /*module.exports = function(object, filter, indent) {
      _filter = filter
      _indent = getIndent(indent)

      var result = walk(object)

      _filter = undefined
      _indent = DEFAULT_INDENT

      return result
  }*/

  var KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;
  function legalKey(string) {
      return /^[a-z_$][0-9a-z_$]*$/gi.test(string) && !KEYWORD_REGEXP.test(string);
  }
})();

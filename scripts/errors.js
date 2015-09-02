(function() {
  var shouldCatch = true;
  var lastEvent;
  var ignoreOnError = 0;

  function errorHandler(obj) {
    $.ajax({
      url: "report",
      data: JSON.stringify(obj),
      type: "POST",
      global: false,
      processData: false,
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
      },
      error: function(e) {
      },
    });
  }

  var limit = 1;
  function notifyError(obj) {
    if (limit <= 0) return;
    if (!obj.file || (obj.file.indexOf("d3planner.com") < 0 && obj.file.indexOf("d3local.com") < 0)) return;
    limit -= 1;
    if (lastEvent) {
      obj.event = {
        type: lastEvent.type,
        which: lastEvent.which,
      };
      if (lastEvent.target) {
        var attrs = lastEvent.target.attributes;
        if (attrs) {
          var ret = "<" + lastEvent.target.nodeName.toLowerCase();
          for (var i = 0; i < attrs.length; ++i) {
            ret += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
          }
          obj.event.target = ret + ">";
        } else {
          obj.event.target = lastEvent.target.nodeName;
        }
      }
    }
    try {
      obj.profile = DiabloCalc.getAllProfiles();
    } catch (e) {}
    try {
      obj.userName = $.cookie("user_name");
    } catch (e) {}
    obj.userAgent = navigator.userAgent;
    errorHandler(obj);
  }

  function handleException(event) {
    notifyError({
      name: event.name,
      message: event.message || event.description,
      stacktrace: stacktraceFromException(event) || generateStacktrace(),
      file: event.fileName || event.sourceURL,
      lineNumber: event.lineNumber || event.line,
    });
  }

  //////////////////////////////////////

  function wrap(_super, eventHandler) {
    if (typeof _super !== "function") {
      return _super;
    }
    if (!_super.errhandler) {
      _super.errhandler = function(event) {
        if (eventHandler) {
          lastEvent = event;
          if (!window.event) window.event = event;
          if (event && event.type === "touchstart") {
            window.touchEvent = event;
          }
        }
        if (shouldCatch) {
          try {
            var result = _super.apply(this, arguments);
            if (eventHandler && event && event.type === "touchstart") {
              window.touchEvent = undefined;
            }
            return result;
          } catch (e) {
            handleException(e);
            ignoreNextOnError();
            throw e;
          }
        } else {
          var result = _super.apply(this, arguments);
          if (eventHandler && event && event.type === "touchstart") {
            window.touchEvent = undefined;
          }
          return result;
        }
      };
      _super.errhandler.errhandler = _super.errhandler;
    }
    return _super.errhandler;
  }

  if (!window.atob) {
    shouldCatch = false;
  } else if (window.ErrorEvent) {
    try {
      if (new window.ErrorEvent("test").colno === 0) {
        shouldCatch = false;
      }
    } catch(e) {}
  }

  function polyFill(obj, name, makeReplacement) {
    var original = obj[name];
    var replacement = makeReplacement(original);
    obj[name] = replacement;
  }
  function ignoreNextOnError() {
    ignoreOnError += 1;
    window.setTimeout(function() {
      ignoreOnError -= 1;
    });
  }

  polyFill(window, "onerror", function(_super) {
    return function errhandler(message, url, lineNo, charNo, exception) {
      var shouldNotify = true;
      if (message === "Script error." && url === "" && lineNo === 0) {
        shouldNotify = false;
      }
      if (!charNo && window.event) {
        charNo = window.event.errorCharacter;
      }
      if (shouldNotify && !ignoreOnError) {
        notifyError({
          name: exception && exception.name || "window.onerror",
          message: message,
          file: url,
          lineNumber: lineNo,
          columnNumber: charNo,
          stacktrace: (exception && stacktraceFromException(exception)) || generateStacktrace(),
        });
      }
      if (_super) {
        _super(message, url, lineNo, charNo, exception);
      }
    };
  });

  function hijackTimeFunc(_super) {
    return function(f, t) {
      if (typeof f === "function") {
        f = wrap(f);
        var args = Array.prototype.slice.call(arguments, 2);
        return _super(function() {
          f.apply(this, args);
        }, t);
      } else {
        return _super(f, t);
      }
    };
  }
  polyFill(window, "setTimeout", hijackTimeFunc);
  polyFill(window, "setInterval", hijackTimeFunc);
  if (window.requestAnimationFrame) {
    polyFill(window, "requestAnimationFrame", function (_super) {
      return function (callback) {
        return _super(wrap(callback));
      };
    });
  }

  function hijackEventFunc(_super) {
    return function(e, f, capture, secure) {
      if (f && f.handleEvent) {
        f.handleEvent = wrap(f.handleEvent, true);
      }
      return _super.call(this, e, wrap(f, true), capture, secure);
    };
  }
  "EventTarget Window Node ApplicationCache AudioTrackList ChannelMergerNode CryptoOperation EventSource FileReader HTMLUnknownElement IDBRequest IDBTransaction KeyOperation MediaController MessagePort ModalWindow Notification SVGElementInstance Screen TextTrack TextTrackCue TextTrackList WebSocket WebSocketWorker Worker XMLHttpRequest XMLHttpRequestEventTarget XMLHttpRequestUpload".replace(/\w+/g, function(global) {
    var prototype = window[global] && window[global].prototype;
    if (prototype && prototype.hasOwnProperty && prototype.hasOwnProperty("addEventListener")) {
      polyFill(prototype, "addEventListener", hijackEventFunc);
      polyFill(prototype, "removeEventListener", hijackEventFunc);
    }
  });

  var FUNCTION_REGEX = /function\s*([\w\-$]+)?\s*\(/i;

  function generateStacktrace() {
    var stacktrace;
    var MAX_FAKE_STACK_SIZE = 10;
    var ANONYMOUS_FUNCTION_PLACEHOLDER = "[anonymous]";

    try {
      throw new Error("");
    } catch (exception) {
      stacktrace = stacktraceFromException(exception);
    }

    if (!stacktrace) {
      var functionStack = [];
      var curr = arguments.callee.caller.caller;
      while (curr && functionStack.length < MAX_FAKE_STACK_SIZE) {
        var fn = FUNCTION_REGEX.test(curr.toString()) ? RegExp.$1 || ANONYMOUS_FUNCTION_PLACEHOLDER : ANONYMOUS_FUNCTION_PLACEHOLDER;
        functionStack.push(fn);
        curr = curr.caller;
      }
      stacktrace = functionStack.join("\n");
    }

    return stacktrace;
  }

  function stacktraceFromException(exception) {
    return exception.stack || exception.backtrace || exception.stacktrace;
  }

})();

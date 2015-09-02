if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
  Object.defineProperty(String.prototype, "format", {enumerable: false});
}

DiabloCalc = {
  relPath: "/",
  options: {},
  optionPerProfile: {},
  addOption: function(name, get, set, profile) {
    Object.defineProperty(this.options, name, {get: get, set: set, enumerable: true});
    if (profile) this.optionPerProfile[name] = true;
  },
  localeTable: {},
  locale: function() {
    var tables = [];
    for (var i = 0; i < arguments.length; ++i) {
      var tbl = DiabloCalc.localeTable[arguments[i]];
      if (tbl) tables.push(tbl);
    }
    tables.push(DiabloCalc.localeTable);
    var res = function(str) {
      for (var i = 0; i < tables.length; ++i) {
        if (tables[i][str]) return tables[i][str];
      }
      return str;
    };
    res.fixkey = _L.fixkey;
    res.fixval = _L.fixval;
    return res;
  },
  patch: {},
};
(function() {
  var m = location.pathname.match(/^(\/.*\/)[^/]*$/);
  if (m) {
    DiabloCalc.relPath = m[1];
  }
})();

_L = function(str) {
  if (!DiabloCalc.localeTable[str]) {
    return str;
  }
  return DiabloCalc.localeTable[str];
};
_L.fixkey = function(data) {
  var list = Object.keys(data);
  for (var i = 0; i < list.length; ++i) {
    var tr = this(list[i]);
    if (tr !== list[i]) {
      data[tr] = data[list[i]];
      delete data[list[i]];
    }
  }
  return data;
};
_L.fixval = function(data) {
  var list = Object.keys(data);
  for (var i = 0; i < list.length; ++i) {
    data[list[i]] = this(data[list[i]]);
  }
  return data;
};
_L.add = function(data) {
  $.extend(true, DiabloCalc.localeTable, data);
};
_L.patch = DiabloCalc.patch;
_L.patch.add = function(data) {
  $.extend(true, _L.patch, data);
};
_L.patch.apply = function(to) {
  function _myExtend(dst, src) {
    for (var key in src) {
      if (typeof src[key] === "object") {
        if (typeof dst[key] === "object") {
          _myExtend(dst[key], src[key]);
        }
      } else {
        dst[key] = src[key];
      }
    }
  }
  _myExtend(to, this);
};
Object.defineProperty(_L, "fixkey", {enumerable: false});
Object.defineProperty(_L, "fixval", {enumerable: false});
Object.defineProperty(_L, "add", {enumerable: false});
Object.defineProperty(_L, "patch", {enumerable: false});
Object.defineProperty(_L.patch, "add", {enumerable: false});
Object.defineProperty(_L.patch, "apply", {enumerable: false});

$(function() {
  $(".editframe").tabs({heightStyle: "fill"});
  $(window).resize(function() {
    $(".editframe").tabs("refresh");
  });

/*  $(".scroll-x").mCustomScrollbar({
    axis: "x",
    live: "on",
  });
  $(".scroll-y").mCustomScrollbar({
    axis: "y",
    live: "on",
  });*/

  $.cookie.json = true;
  var mo = location.hostname.match(/([^.]*\.)?[^.]*$/);
  if (mo) {
    $.cookie.defaults.domain = mo[0];
  }

  var ajaxSpinner = new Spinner({
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  });

  var spinning = 0;
  DiabloCalc.spinStart = function() {
    if (spinning++ <= 0) {
      ajaxSpinner.spin($(".page")[0]);    
    }
  };
  DiabloCalc.spinStop = function() {
    if (--spinning <= 0) {
      ajaxSpinner.stop();
      spinning = 0;
    }
  };

  $(document).ajaxStart(function() {
    DiabloCalc.spinStart();
  });
  $(document).ajaxStop(function() {
    DiabloCalc.spinStop();
  });


  var themeSelect = $(".theme-select");
  var themeBox;
  var theme = ($.cookie("theme") || "dark");
  ajaxSpinner.opts.color = (theme === "light" ? "#000" : "#ccc");
  $("body").removeClass().addClass("theme-" + theme);
  themeSelect.val(theme).css("margin-left", 12);
  themeSelect.change(function() {
    var theme = $(this).val();
    $("body").removeClass().addClass("theme-" + theme);
    $.cookie("theme", theme, {expires: 365});
    ajaxSpinner.opts.color = (theme === "light" ? "#000" : "#ccc");
    if (themeBox) {
      themeBox.remove();
      themeBox = undefined;
    }
    if (DiabloCalc.trigger) DiabloCalc.trigger("changeTheme");
  });
  $(".footer").append(themeSelect);

  DiabloCalc.spinStart();

//  if (location.hostname.toLowerCase().indexOf("ptr") >= 0) {
//    $("#ptr-link").append("<a href=\"http://" + location.hostname.replace(/^[^.]*/, "www") + "\">" + _L("Switch to live version") + "</a>");
//    $("#ptr-link").find("a").click(function() {
//      $(this).attr("href", "http://" + location.hostname.replace(/^[^.]*/, "www") + location.pathname);
//    });
//  } else {
//    $("#ptr-link").append("<a href=\"http://" + location.hostname.replace(/^[^.]*/, "ptr") + "\">" + _L("PTR version is available!") + "</a>");
//    $("#ptr-link").find("a").click(function() {
//      $(this).attr("href", "http://" + location.hostname.replace(/^[^.]*/, "ptr") + location.pathname);
//    });
//  }

  DC_getScript("scripts/data.js", function() {
    DiabloCalc.loadData(function() {
      var optgroupMain = $("<optgroup></optgroup>").attr("label", _L("Characters"));
      var optgroupFollower = $("<optgroup></optgroup>").attr("label", _L("Followers"));
      $(".char-class").append(optgroupMain);//.append(optgroupFollower);
      for (var cls in DiabloCalc.classes) {
        var option = $("<option></option>").val(cls).text(DiabloCalc.classes[cls].name).addClass("class-" + cls).addClass("class-icon");
        if (DiabloCalc.classes[cls].follower) {
          optgroupFollower.append(option);
        } else {
          optgroupMain.append(option);
        }
      }
      var prevClass;
      DiabloCalc.updateClassIcon = function() {
        var span = $(".char-class").next().find("span").first();
        if (prevClass) {
          span.removeClass(prevClass);
        }
        prevClass = "class-" + $(".char-class").val() + " " + (DiabloCalc.gender || "female");
        span.addClass(prevClass);
      };
      $(".char-class").chosen({
        disable_search: true,
        inherit_select_classes: true,
      }).change(function() {
        DiabloCalc.updateClassIcon();
        DiabloCalc.importStart();
        DiabloCalc.triggerNow("changeClass");
        DiabloCalc.importEnd("class");
      });
      DiabloCalc.updateClassIcon();
      if (!$(".char-class").data("chosen")) {
        DiabloCalc.noChosen = true;
      }
      DiabloCalc.charClass = $(".char-class").val();
      $(".char-class").next().find("span").first().addClass("class-icon");
      $(".char-level").blur(DiabloCalc.validateNumber);

      function onLoaded() {
        DiabloCalc.spinStop();
        DiabloCalc.importEnd("init");
        var m = location.pathname.match(/\/e?([0-9]+)$/);
        if (m) {
          DiabloCalc.loadProfile(undefined, m[1], location.pathname[1] === "e");
        } else if (window.localStorage) {
          var profile;
          try {
            profile = localStorage.getItem("profile");
            profile = JSON.parse(profile);
          } catch (e) {
            profile = undefined;
          }
          if (profile) {
            var restore = $("<div class=\"restore-profile signin-line\">" + _L("Restore last session?") + " </div>");
            restore.append($("<span>" + _L("Yes") + "</span>").click(function() {
              try {
                localStorage.removeItem("profile", "");
              } catch (e) {
              }
              DiabloCalc.setAllProfiles(profile, "load");
              setTimeout(function() {restore.remove();}, 0);
            }), " / ", $("<span>" + _L("No") + "</span>").click(function() {
              try {
                localStorage.removeItem("profile", "");
              } catch (e) {
              }
              setTimeout(function() {restore.remove();}, 0);
            }));
            $(".dollframe").prepend(restore);
          }
        }
        m = location.pathname.match(/\/reset=([0-9a-f]{32})$/);
        if (m && DiabloCalc.account) {
          DiabloCalc.account.reset(m[1]);
          var url = location.protocol + "//" + location.hostname + DiabloCalc.relPath;
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, "", url);
          }
        }

        if (!$.cookie("theme")) {
          themeBox = $("<div class=\"themetip\"><p>" + _L("Select your theme:") + "</p><p class=\"small\">(" + _L("Click to dismiss") + ")</p></div>").css("visibility", "hidden");
          $("body").append(themeBox);
          var pos = themeSelect.offset();
          themeBox.css("left", pos.left + themeSelect.outerWidth() / 2 - themeBox.outerWidth() / 2).css("top", pos.top - themeBox.outerHeight() - 20);
          themeBox.css("visibility", "");
          themeBox.click(function() {
            $.cookie("theme", theme);
            themeBox.remove();
            themeBox = undefined;
          });
        } else {
          $.ajax({
            url: "changes",
            dataType: "json",
            success: function(data) {
              if (data instanceof Array && data.length) {
                var newBox = $("<div class=\"changelog\"><h3>" + _L("What's new?") + "</h3><p class=\"small\"><i>" + _L("Click to dismiss") + "</i></p></div>").css("visibility", "hidden");
                for (var i = 0; i < data.length; ++i) {
                  newBox.append("<p><i>" + (new Date(1000 * data[i].date)).toLocaleString() + "</i>:<br/>" + data[i].text + "</p>");
                }
                $("body").append(newBox);
                var page = $(".page");
                var left = page.offset().left + page.outerWidth();
                newBox.css("max-width", Math.max(250, $(window).width() - left - 32));
                newBox.css("left", Math.min(left + 24, $(window).width() - newBox.outerWidth() - 8)).css("top", 16);
                newBox.css("visibility", "");
                var maxDate = data[0].date;
                newBox.click(function() {
                  $.cookie.json = false;
                  $.cookie("lastchange", maxDate + 1);
                  $.cookie.json = true;
                  newBox.remove();
                });
              }
            },
          });
        } 
      }

      DiabloCalc.onLoaded = onLoaded;
      DC_getScript("core");
    });
  });
});

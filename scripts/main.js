// Replace the normal jQuery getScript function with one that supports
// debugging and which references the script files as external resources
// rather than inline.
jQuery.extend({
  getScript: function(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;

    // Handle Script loading
    {
      var done = false;

      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function(){
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
          done = true;
          if (callback) callback();

          // Handle memory leak in IE
          script.onload = script.onreadystatechange = null;
        }
      };
    }

    head.appendChild(script);

    // We handle everything using the script element injection
    return undefined;
  },
  getScripts: function(urls, callback) {
    var count = urls.length;
    function proxy() {
      if (--count == 0) {
        callback();
      }
    }
    for (var i = 0; i < urls.length; ++i) {
      $.getScript(urls[i], proxy);
    }
  },
});
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
  options: {},
  optionPerProfile: {},
  addOption: function(name, get, set, profile) {
    Object.defineProperty(this.options, name, {get: get, set: set, enumerable: true});
    if (profile) this.optionPerProfile[name] = true;
  },
  localeTable: {},
  locale: function(name) {
    var tbl1 = DiabloCalc.localeTable[name];
    var tbl2 = DiabloCalc.localeTable;
    return function(str) {
      if (tbl1 && tbl1[str]) return tbl1[str];
      if (tbl2[str]) return tbl2[str];
      return str;
    };
  },
  patch: {},
};

_L = function(str) {
  if (!DiabloCalc.localeTable[str]) {
    DiabloCalc.localeTable[str] = str;
  }
  return DiabloCalc.localeTable[str];
};
_L.fix = function(data) {
  var list = Object.keys(data);
  for (var i = 0; i < list.length; ++i) {
    var tr = _L(list[i]);
    if (tr !== list[i]) {
      data[tr] = data[list[i]];
      delete data[list[i]];
    }
  }
};
_L.add = function(data) {
  $.extend(DiabloCalc.localeTable, data);
};
_L.patch = DiabloCalc.patch;
_L.patch.add = function(data) {
  $.extend(_L.patch, data);
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
Object.defineProperty(_L, "fix", {enumerable: false});
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


  var themeSelect = $("<select class=\"theme-select\"><option value=\"light\">Light Theme</option><option value=\"dark\">Dark Theme</option></select>");
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

  //if (location.hostname.toLowerCase().indexOf("ptr") >= 0) {
  //  $("#ptr-link").append("<a href=\"http://" + location.hostname.replace(/^[^.]*/, "www") + "\">Switch to live version</a>");
  //} else {
  //  $("#ptr-link").append("<a href=\"http://" + location.hostname.replace(/^[^.]*/, "ptr") + "\">PTR version is available!</a>");
  //}

  $.getScript("scripts/data.js", function() {
    DiabloCalc.loadData(function() {
      var optgroupMain = $("<optgroup></optgroup>").attr("label", "Characters");
      var optgroupFollower = $("<optgroup></optgroup>").attr("label", "Followers");
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
      $(".char-class").chosen({
        disable_search: true,
        inherit_select_classes: true,
      }).change(function() {
        var span = $(".char-class").next().find("span").first();
        if (prevClass) {
          span.removeClass(prevClass);
        }
        prevClass = "class-" + $(".char-class").val();
        span.addClass(prevClass);
      }).change().change(function() {
        DiabloCalc.importStart();
        DiabloCalc.triggerNow("changeClass");
        DiabloCalc.importEnd("class");
      });
      if (!$(".char-class").data("chosen")) {
        DiabloCalc.noChosen = true;
      }
      DiabloCalc.charClass = $(".char-class").val();
      $(".char-class").next().find("span").first().addClass("class-icon");
      $(".char-level").blur(DiabloCalc.validateNumber);

      function onLoaded() {
        DiabloCalc.spinStop();
        DiabloCalc.importEnd("init");
        var m = location.pathname.match(/^\/e?([0-9]+)$/);
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
            var restore = $("<div class=\"restore-profile signin-line\">Restore last session? </div>");
            restore.append($("<span>Yes</span>").click(function() {
              try {
                localStorage.removeItem("profile", "");
              } catch (e) {
              }
              DiabloCalc.setAllProfiles(profile, "load");
              setTimeout(function() {restore.remove();}, 0);
            }), " / ", $("<span>No</span>").click(function() {
              try {
                localStorage.removeItem("profile", "");
              } catch (e) {
              }
              setTimeout(function() {restore.remove();}, 0);
            }));
            $(".dollframe").prepend(restore);
          }
        }
        m = location.pathname.match(/^\/reset=([0-9a-f]{32})$/);
        if (m && DiabloCalc.account) {
          DiabloCalc.account.reset(m[1]);
          var url = location.protocol + "//" + location.hostname + "/";
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, "", url);
          }
        }

        if (!$.cookie("theme")) {
          themeBox = $("<div class=\"themetip\"><p>Select your theme:</p><p class=\"small\">(Click to dismiss)</p></div>").css("visibility", "hidden");
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
                var newBox = $("<div class=\"changelog\"><h3>What's new?</h3><p class=\"small\"><i>Click to dismiss.</i></p></div>").css("visibility", "hidden");
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

      $.getScripts([
            "scripts/common.js",
          ], function() {
        $.getScripts([
              "scripts/bnet-parser.js",
              "scripts/bnet-tooltips.js",
              "scripts/stats.js",
              "scripts/itembox.js",
              "scripts/skillbox.js",
              "scripts/account.js",
              "scripts/ui-paperdoll.js",
            ], function() {
          $.getScripts([
                "scripts/ui-equipment.js",
                "scripts/ui-import.js",
                "scripts/ui-paragon.js",
                "scripts/ui-stats.js",
                "scripts/ui-skills.js",
                "scripts/ui-timeline.js",
                "scripts/ui-simulator.js",
              ], function() {
            onLoaded();
          });
        });
      });
    });
  });
});

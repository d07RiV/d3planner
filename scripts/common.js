(function() {
  var DC = DiabloCalc;

  DC.popupMenu = function(evt, buttons, cancel) {
    if ($.isEmptyObject(buttons)) return;
    var popup = $("<ul class=\"popup-menu\"></ul>").css("position", "absolute");
    popup.css("left", evt.pageX + 15);
    popup.css("top", evt.pageY - 20);
    popup.attr("tabIndex", -1);
    $("body").append(popup);
    for (var name in buttons) {
      var btn = $("<li>" + name + "</li>");
      btn.click((function(cb) {return function(evt) {
        popup.remove();
        cb(evt);
      };})(buttons[name]));
      popup.append(btn);
    }
    popup.menu();
    popup.focus();
    popup.focusout(function() {
      if (cancel) cancel();
      popup.remove();
    });
  };
  DC.addTip = function(elem, text) {
    var orig = elem;
    if (elem[0].tagName === "SELECT" && !elem.is(":visible")) {
      elem = elem.next();
    }
    elem.hover(function() {
      var curtext = text;
      if (typeof text === "function") {
        curtext = text.call(orig);
      }
      if (!curtext) return;
      var tip = "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"profile-tooltip\"><p><span class=\"d3-color-gold\">" + curtext + "</span></p></div>";
      if (DC.tooltip) DC.tooltip.showHtml(this, tip);
    }, function() {
      if (DC.tooltip) DC.tooltip.hide();
    });
    return elem;
  };
  DC.chosenTips = function(elem, func) {
    var chosen = elem.data("chosen");
    if (!chosen) return;
    chosen.search_results.on("mouseover", "li", elem.data("chosen"), function(evt) {
      var chosen = evt.data;
      var index = this.getAttribute("data-option-array-index");
      if (!index || !chosen || !chosen.results_data || !chosen.results_data[index]) return;
      if (DC.tooltip) {
        func.call(this, chosen.results_data[index].value, this);
      }
    }).on("mouseleave", "li", function(evt) {
      if (DC.tooltip) DC.tooltip.hide();
    });
  };


  $.widget('ui.custommouse', $.ui.mouse, {
    options: {
    },
    widgetEventPrefix: 'custommouse',
    _init: function() {
      return this._mouseInit();
    },
    _create: function() {
      return this.element.addClass('ui-custommouse');
    },
    _destroy: function() {
      this._mouseDestroy();
      return this.element.removeClass('ui-custommouse');
    },
    _mouseStart: function() {
      return false;
    },
  });
  DC.enableTouch = function(elem) {
    var touch = undefined;
    if (!elem.draggable("instance")) {
      elem.custommouse();//.mouse("_mouseInit");
    }
    elem.on("touchstart", function(e) {
      touch = e.originalEvent.touches[0];
      setTimeout(function() {
        touch = undefined;
      }, 750);
      //e.preventDefault();
    });
    elem.on("touchcancel", function(e) {
      touch = undefined;
      e.preventDefault();
    });
    elem.on("touchend", function(e) {
      if (touch) {
        e = $.extend({}, e);
        e.type = "click";
        if (touch) {
          e.pageX = touch.pageX;
          e.pageY = touch.pageY;
        }
        touch = undefined;
        setTimeout(function() {
          elem.triggerHandler(e);
        }, 0);
      }
      e.preventDefault();
    });
  };

  var curPopup;
  var curHideOnEscape;
  DC.showPopup = function(elem, hideOnEsc) {
    if (curPopup && curPopup !== elem) curPopup.hide();
    curPopup = elem;
    curHideOnEscape = hideOnEsc;
  };
  DC.hidePopup = function(elem) {
    if (curPopup === elem) curPopup = undefined;
  };
  DC.shiftKey = false;
  $(document).mouseup(function(e) {
    if (curPopup && e.target && $.contains(document.documentElement, e.target) &&
        !curPopup.contains(e.target) && !$(e.target).closest(".popup-menu").length) {
      curPopup.hide();
    }
  }).keydown(function(e) {
    if (curPopup && curHideOnEscape && e.which === 27) {
      curPopup.hide();
    }
    if (e.which === 16) {
      DC.shiftKey = true;
    }
  }).keyup(function(e) {
    if (e.which === 16) {
      DC.shiftKey = false;
    }
  });

  DC.formatNumber = function(num, decimal, separator) {
    if (separator === undefined) {
      return num.toFixed(decimal || 0);
    }
    var parts = num.toFixed(decimal || 0).split(".");
    if (parseFloat(num) >= separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return parts.join(".");
  };
  DC.formatDamage = function(val) {
    if (val > 1e+13) {
      return DC.formatNumber(val / 1e+12, 3, 10000) + " T";
    } else if (val > 1e+10) {
      return DC.formatNumber(val / 1e+9, 3, 10000) + " B";
    } else if (val > 1e+7) {
      return DC.formatNumber(val / 1e+6, 3, 10000) + " M";
    } else {
      return DC.formatNumber(val, 0, 10000);
    }
  };
  DC.validateNumber = function() {
    var value = parseFloat($(this).val());
    if (isNaN(value)) {
      value = 0;
    }
    var step = parseFloat($(this).attr("step"));
    if ($(this).attr("min")) {
      value = Math.max(value, $(this).attr("min"));
    }
    if ($(this).attr("max")) {
      value = Math.min(value, $(this).attr("max"));
    }
    if (!isNaN(step)) {
      value = Math.round(value / step) * step;
      value = parseFloat(value.toFixed(2));
    }
    $(this).val(value);
    $(this).trigger("input");
  }

  DC.SearchResults = function(action, makeResults, emptytip) {
    this.action = action;
    this.emptytip = (emptytip || _L("No results."));
    this.div = $("<div></div>");
    this.message = $("<span></span>").hide();
    this.results = $("<ul class=\"search-results\"></ul>").hide();
    this.navbar = $("<div class=\"search-navbar\"></div>").hide();
    this.navtip = $("<span></span>");
    this.navfirst = $("<span class=\"search-navlink\">&lt;&lt;</span>");
    this.navprev = $("<span class=\"search-navlink\">&lt;</span>");
    this.navnext = $("<span class=\"search-navlink\">&gt;</span>");
    this.navlast = $("<span class=\"search-navlink\">&gt;&gt;</span>");
    this.navbox = $("<select></select>");
    this.navbar.append(this.navtip).append($("<span class=\"search-navbuttons\"></span>")
      .append(this.navfirst).append(this.navprev).append(this.navbox).append(this.navnext).append(this.navlast));
    this.div.append(this.message).append(this.results).append(this.navbar);
    this.makeResults = makeResults;

    var self = this;
    var _step = 10;
    this.navfirst.click(function() {
      if (self.query && self.query.start > 0) {
        self.search(self.query.term, 0);
      }
    });
    this.navprev.click(function() {
      if (self.query && self.query.start > 0) {
        self.search(self.query.term, Math.max(0, self.query.start - _step));
      }
    });
    this.navnext.click(function() {
      if (self.query && self.query.start + _step < self.query.count) {
        self.search(self.query.term, self.query.start + _step);
      }
    });
    this.navlast.click(function() {
      if (self.query && self.query.start + _step < self.query.count) {
        self.search(self.query.term, Math.floor((self.query.count - 1) / _step) * _step);
      }
    });
    this.navbox.change(function() {
      if (self.query) {
        self.search(self.query.term, self.navbox.val());
      }
    });

    this.setError = function(msg) {
      this.query = undefined;
      this.message.text(msg).show();
      this.results.hide();
      this.navbar.hide();
    };
    this.onSuccess = function(data) {
      if (data.errors && data.errors.length) {
        this.setError(data.errors);
      } else if (data.results && (data.count || data.results.length)) {
        this.message.hide();

        this.results.empty();
        var self = this;
        $.each(data.results, function(i, item) {
          var li = self.makeResults(data, item);
          self.results.append(li);
        });

        this.query.start = (data.start || 0);
        this.query.count = (data.count || data.results.length);
        this.navtip.text(_L("Showing {0} to {1} of {2}").format(this.query.start + 1, this.query.start + data.results.length, this.query.count));
        this.navfirst.toggleClass("disabled", this.query.start <= 0);
        this.navprev.toggleClass("disabled", this.query.start <= 0);
        this.navnext.toggleClass("disabled", this.query.start + data.results.length >= this.query.count);
        this.navlast.toggleClass("disabled", this.query.start + data.results.length >= this.query.count);
        this.navbox.prop("disabled", this.query.count <= _step);
        this.navbox.empty();
        for (var i = 0; i * _step < this.query.count; ++i) {
          this.navbox.append("<option value=\"" + (i * _step) + "\">" + (i + 1) + "</option>");
        }
        this.navbox.val(this.query.start);

        this.navbar.find(".navbuttons").toggle(this.query.count > _step);

        this.results.show();
        this.navbar.show();
      } else if (data.count === 0) {
        this.setError(this.emptytip);
      } else {
        this.setError(_L("Query failed."));
      }
    };
    this.onError = function(e) {
      this.setError(_L("Query failed."));
    };

    this.search = function(query, start) {
      //this.message.text("Searching...").show();
      //this.results.hide();
      //this.navbar.hide();
      this.query = {term: query};
      var self = this;
      $.ajax({
        url: this.action,
        data: $.extend({start: start}, query),
        type: "GET",
        dataType: "json",
        success: function(data) {self.onSuccess(data);},
        error: function(e) {self.onError(e);},
      });
    };
  };

})();
(function() {
  var _L = DiabloCalc.locale("account.js");

  function Dialog() {
    this.div = $("<div class=\"signin-dialog\"></div>");
    this.tip = $("<p class=\"tip\"></p>");
    this.name = $("<input type=\"text\" name=\"user_name\" class=\"text\"></input>");
    this.email = $("<input type=\"text\" name=\"user_email\" class=\"text\"></input>");
    this.reset_code = $("<input type=\"text\" name=\"user_reset_code\" class=\"text\"></input>");
    this.password = $("<input type=\"password\" name=\"user_password\" class=\"text\"></input>");
    this.password_old = $("<input type=\"password\" name=\"user_password_old\" class=\"text\"></input>");
    this.password_repeat = $("<input type=\"password\" name=\"user_password_repeat\" class=\"text\"></input>");
    this.remember = $("<input type=\"checkbox\" name=\"user_remember\" class=\"checkbox\"></input>");
    this.div.append(this.tip);
    this.fieldset = $("<fieldset></fieldset>");
    this.form = $("<form></form>").append(this.fieldset);
    this.div.append(this.form);

    var modes = DiabloCalc.localeTable.account;

    var self = this;

    this.reset_fields = function(arg) {
      this.name.val("");
      this.email.val(this.mode === "options" ? ($.cookie("user_email") || "") : "");
      this.reset_code.val(this.mode === "reset" ? arg : "");
      this.password.val("");
      this.password_old.val("");
      this.password_repeat.val("");
    };

    this.open = function(mode, arg) {
      this.mode = mode;
      this.reset_fields(arg);
      this.fieldset.empty();
      var height = 210;
      for (var f in modes[mode].fields) {
        var label = $("<label>" + modes[mode].fields[f] + "</label>");
        if (this[f].attr("type") === "checkbox") {
          label.prepend(this[f]);
          height += 5;
        } else {
          label.append(this[f]);
          height += 55;
        }
        this.fieldset.append(label);
      }
      this.fieldset.append("<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"></input>");
      this.tip.text(modes[mode].tip);
      var buttons = {};
      for (var b in modes[mode].buttons) {
        buttons[modes[mode].buttons[b]] = (function(b) {return function() {
          self.handlers[b].call(self);
        };})(b);
      }
      this.div.dialog({
        height: height,
        title: modes[mode].title,
        buttons: buttons,
      }).dialog("open");
    };

    this.all_fields = $([]).add(this.name).add(this.email).add(this.reset_code)
      .add(this.password).add(this.password_repeat).add(this.password_old);
    this.all_fields.focus(function() {
      $(this).removeClass("error");
    });

    this.set_tip = function(t) {
      this.tip.text(t).addClass("highlight");
      setTimeout(function() {self.tip.removeClass("highlight", 1500);}, 500);
    };

    this.check_length = function(field, name, min, max) {
      if (field.val().length < min || field.val().length > max) {
        field.addClass("error");
        this.set_tip(_L("Length of {0} must be between {1} and {2}.").format(name, min, max));
        return false;
      } else {
        return true;
      }
    };
    this.check_regexp = function(field, msg, regexp) {
      if (!(regexp.test(field.val()))) {
        field.addClass("error");
        this.set_tip(msg);
        return false;
      } else {
        return true;
      }
    };

    this.validate = function() {
      var valid = true;
      this.all_fields.removeClass("error");

      var fields = modes[this.mode].fields;

      if (fields.name) {
        valid = valid && this.check_length(this.name, "username", 2, 16);
        valid = valid && this.check_regexp(this.name, _L("Username may only consist of a-z and 0-9."), /^[a-z0-9._]+$/i);
      }

      if (fields.reset_code) {
        valid = valid && this.check_regexp(this.reset_code, _L("Invalid reset code"), /^[0-9a-f]{32}$/);
      }

      if (fields.email && (this.email.val() || this.mode === "recover")) {
        valid = valid && this.check_length(this.email, "e-mail", 4, 128);
        valid = valid && this.check_regexp(this.email, _L("Specify a valid e-mail address"), /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
      }

      if (fields.password && (this.password.val() || this.mode !== "options")) {
        valid = valid && this.check_length(this.password, "password", 6, 64);
        if (fields.password_repeat && valid && this.password.val() !== this.password_repeat.val()) {
          this.password_repeat.addClass("error");
          this.set_tip(_L("Passwords do not match."));
          valid = false;
        }
      }
      if (fields.password_old) {
        valid = valid && this.check_length(this.password_old, "password", 6, 64);
      }
      if (!valid) return undefined;

      var result = {action: this.mode};
      if (fields.name) result.user_name = this.name.val();
      if (fields.email && this.email.val()) result.user_email = this.email.val();
      if (fields.reset_code) result.reset_code = this.reset_code.val();
      if (fields.password && (this.password.val() || this.mode !== "options")) result.password_hash = MD5('SmartSalt' + this.password.val());
      if (fields.password_old) result.password_old_hash = MD5('SmartSalt' + this.password_old.val());
      if (fields.remember && this.remember.prop("checked")) result.user_remember = true;
      if (fields.password_old) result.user_name = $.cookie("user_name");
      return result;
    };

    //this.hostname = (location.hostname.indexOf("d3planner") >= 0 ? "https:" : location.protocol) + "//" + location.hostname + "/";
    this.hostname = "";

    this.handlers = {};

    this.default_handler = function() {
      var data = this.validate();
      if (data) {
        $.ajax({
          url: "account",
          data: data,
          type: "POST",
          dataType: "json",
          success: function(data) {
            if (data.code === "OK") {
              updateStatus();
              if (self.mode === "options" || self.mode === "recover") {
                if (self.mode === "recover") {
                  self.set_tip(_L("Password reset link sent."));
                } else {
                  self.set_tip(_L("Settings updated."));
                }
                self.reset_fields();
              } else {
                self.div.dialog("close");
              }
            } else if (data.errors && data.errors.length) {
              self.set_tip(data.errors[0]);
            } else {
              self.set_tip(_L("Unknown error."));
            }
          },
          error: function(e) {
            self.set_tip(_L("Unknown error."));
          },
        });
      }
    };
    
    this.handlers.register = this.default_handler;
    this.handlers.signin = this.default_handler;
    this.handlers.cancel = function() {
      this.div.dialog("close");
    };
    this.handlers.lostpassword = function() {
      setTimeout(function() {
        self.open("recover");
      }, 0);
    };
    this.handlers.already = function() {
      setTimeout(function() {
        self.open("reset");
      }, 0);
    };
    this.handlers.recover = this.default_handler;
    this.handlers.reset = this.default_handler;
    this.handlers.update = this.default_handler;

    this.form.on("submit", function(event) {
      event.preventDefault();
      self.default_handler();
    });

    this.div.dialog({
      autoOpen: false,
      height: 400,
      width: 400,
      modal: true,
      close: function() {
        self.form[0].reset();
        self.all_fields.removeClass("error");
      },
    });
  };

  var dialog = new Dialog();

  function fillLine(line) {
    line.signin = undefined;
    line.signout = undefined;
    line.register = undefined;
    line.options = undefined;
    if ($.cookie("user_name")) {
      line.signout = $("<span>" + _L("sign&nbsp;out") + "</span>");
      line.signout.click(function() {
        $.ajax({
          url: "account",
          data: {action: "signout"},
          type: "POST",
          dataType: "json",
          success: function(data) {
            updateStatus();
          },
          error: function(e) {
            updateStatus();
          },
        });
      });
      line.options = $("<span>" + _L("settings") + "</span>");
      line.options.click(function() {
        dialog.open("options");
      });
      line.div.empty().append(_L("Welcome, {0}").format($.cookie("user_name")) + " (", line.signout, ", ", line.options, ")");
      if (line.updater) line.updater.call(line.div, true);
    } else {
      line.signin = $("<span>" + _L("Sign in") + "</span>");
      line.signin.click(function() {
        dialog.open("signin");
      });
      line.register = $("<span>" + _L("register") + "</span>");
      line.register.click(function() {
        dialog.open("register");
      });
      line.div.empty().append(line.signin, _L(" or "), line.register, (line.suffix || "") + ".");
      if (line.updater) line.updater.call(line.div, false);
    }
  }
  var lineList = [];
  function makeLine(suffix, updater) {
    var line = {
      div: $("<div class=\"signin-line\"></div>"),
      suffix: suffix,
      updater: updater,
    };
    fillLine(line);
    lineList.push(line);
    return line.div;
  };

  function updateStatus() {
    $("body").toggleClass("logged-in", !!$.cookie("user_name"));
    if ($.cookie("user_name")) {
      DiabloCalc.session.signedin = true;
      //$(".left-banner").remove();
      //$(".right-banner").remove();
    }
    for (var i = 0; i < lineList.length; ++i) {
      fillLine(lineList[i]);
    }
  };

  DiabloCalc.account = {
    makeLine: makeLine,
    reset: function(code) {
      dialog.open("reset", code);
    },
    userName: function() {
      return $.cookie("user_name");
    },
  };
})();
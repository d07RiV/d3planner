(function() {
  var _L = DiabloCalc.locale("ui-import.js");

  var Sections;
  var Import = {};
  var Save = {};
  var Load = {};
  var MyProf = {};

  function UpdateProfiles() {
    if (DiabloCalc.account.userName()) {
      MyProf.results.div.show();
      MyProf.results.search();
    } else {
      MyProf.results.div.hide();
    }
  }

  function charLoaded(region, data) {
    var charClass = DiabloCalc.classMap[data.class] || data.class;
    var pData = {};
    pData.class = charClass;
    if (data.gender === 0) pData.gender = "male";
    if (data.gender === 1) pData.gender = "female";
    pData.gender
    pData.items = {};
    for (var slot in data.items) {
      pData.items[DiabloCalc.slotMap[slot] || slot] = DiabloCalc.parseItemData(data.items[slot], charClass);
    }
    if (data.skills && data.skills.active) {
      var active = data.skills.active;
      pData.skills = [];
      for (var i = 0; i < active.length; ++i) {
        if (!active[i].skill) {
          pData.skills.push(null);
          continue;
        }
        var id = active[i].skill.slug;
        var rune = "x";
        if (active[i].rune) rune = active[i].rune.type;
        pData.skills.push([DiabloCalc.skillById[charClass][id], rune]);
      }
    }
    if (data.skills && data.skills.passive) {
      var passive = data.skills.passive;
      pData.passives = [];
      for (var i = 0; i < passive.length; ++i) {
        if (!passive[i].skill) {
          pData.passives.push(null);
          continue;
        }
        var id = passive[i].skill.slug;
        pData.passives.push(DiabloCalc.skillById[charClass][id]);
      }
    }
    pData.paragon = {level: 0};
    if (data.paragonLevel) {
      pData.paragon.level = data.paragonLevel;
      if (data.paragonLevel >= 800) {
        pData.paragon.data = [[0,0,0,0], [50,50,50,50], [50,50,50,50], [50,50,50,50]];
      }
    }
    if (data.legendaryPowers) {
      pData.kanai = {};
      if (DiabloCalc.options.seasonal && DiabloCalc.season === 20) {
        var types = ["weapon", "armor", "jewelry"];
        var tindex = 0;
        for (var i = 0; i < data.legendaryPowers.length; ++i) {
          var p = data.legendaryPowers[i];
          var t = (p && types[tindex++]);
          if (p && t) pData.kanai[t] = p.id;
        }
      } else {
        for (var i = 0; i < data.legendaryPowers.length; ++i) {
          var p = data.legendaryPowers[i];
          var t = (p && DiabloCalc.getKanaiType(p.id));
          if (p && t) pData.kanai[t] = p.id;
        }
      }
    }
    DiabloCalc.setProfile(pData, "import");
    $(".editframe").tabs("option", "active", 1);
  }
  function doLoadCharacter(region, battletag, id, dead) {
    var data = {region: region, tag: battletag, id: id};
    if (dead) {
      data.dead = 1;
    }
    $.ajax({
      url: "proxy",
      data: data,
      type: "POST",
      dataType: "json",
      success: function(data) {
        charLoaded(region, data);
      },
    });
  }
  function loadCharacter(evt, region, battletag, id, dead) {
    DiabloCalc.activity("importchar");
    if (DiabloCalc.isModified && DiabloCalc.isModified()) {
      DiabloCalc.popupMenu(evt, _L.fixkey({
        "Discard current profile?": function() {
          doLoadCharacter(region, battletag, id, dead);
        },
      }));
    } else {
      doLoadCharacter(region, battletag, id, dead);
    }
  }
  function importProfile(region, battletag) {
    DiabloCalc.activity("importprofile");
    battletag = battletag.replace("#", "-");

    Import.results.empty();
    $.ajax({
      url: "proxy",
      data: {region: region, tag: battletag},
      type: "POST",
      dataType: "json",
      success: function(data) {
        Import.results.empty();
        if (!data.heroes && !data.fallenHeroes) {
          if (data.reason) {
            Import.results.text(data.reason);
          } else {
            Import.results.text(_L("Profile not found."));
          }
        }
        for (var keytype = 0; keytype < 2; ++keytype) {
          var heroes = (keytype ? data.fallenHeroes : data.heroes);
          if (!heroes) {
            continue;
          }
          if (keytype) {
            Import.results.append("<p>" + _L("Fallen Heroes") + "</p>");
          }
          for (var i = 0; i < heroes.length; ++i) {
            var hero = heroes[i];

            var li = $("<li></li>");
            var cls = DiabloCalc.classMap[hero.class] || hero.class;
            var gender = "";
            if (hero.gender === 0) gender += " male";
            if (hero.gender === 1) gender += " female";
            Import.results.append(li);
            li.append("<span class=\"class-icon class-" + cls + gender + "\">&nbsp;</span>");
            li.click((function(id, dead) {
              return function(evt) {
                loadCharacter(evt, region, battletag, id, dead);
              };
            })(hero.id, keytype));

            var timestamp = new Date((hero.death ? hero.death.time : hero["last-updated"]) * 1000);
            var date = timestamp.toLocaleDateString();

            var hc = "";
            var season = "";
            var dead = "";
            if (hero.hardcore) {
              hc = " hero-hardcore";
            }
            if (hero.seasonal) {
              season = " <span class=\"hero-seasonal\" title=\"" + _L("Seasonal") + "\">&nbsp;</span>";
            }
            if (hero.dead || keytype) {
              dead = " <span class=\"hero-dead\">" + _L("(Died {0})").format(date) + "</span>";
              li.addClass("hero-dead");
            }
            li.append("<span class=\"hero-name\">" + hero.name + "</span>");
            li.append(" <span class=\"hero-desc" + hc + "\">" + _L("Level {0} {1}").format(hero.level, DiabloCalc.classes[cls].name) + "</span>" + season + dead);
            if (!hero.dead) {
              li.append("  <span class=\"hero-updated\">" + _L("(updated {0})").format(date) + "</span>");
            }
          }
        }
      },
      error: function() {
        Import.results.text(_L("Profile not found."));
      },
    });
  }

  function saveProfile(id, all) {
    DiabloCalc.activity("saveprofile");
    if (all === undefined) all = Save.allsets.prop("checked");
    var data = (all ? DiabloCalc.getAllProfiles() : DiabloCalc.getProfile());
    var box;
    if (id) {
      data.id = id;
      box = MyProf.response;
    } else {
      data.name = Save.name.val();
      data.public = Save.public.prop("checked");
      box = Save.response;
    }
    box.hide();
    if (id !== undefined) data.id = id;
    $.ajax({
      url: "save",
      data: JSON.stringify(data),
      type: "POST",
      processData: false,
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
        if (response.id) {
          var url = location.protocol + "//" + location.hostname + DiabloCalc.relPath + response.id;
          DiabloCalc.session.profile = response.id;
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, "", url);
          }
          box.val(url);
          if (data.name) {
            document.title = data.name + " - " + DiabloCalc.pageTitle;
          } else {
            document.title = DiabloCalc.pageTitle;
          }
          UpdateProfiles();
        } else if (response.errors && response.errors.length) {
          box.val(response.errors[0]);
        } else {
          box.val(_L("Failed to save profile."));
        }
        box.slideDown();
      },
      error: function(e) {
        box.val(_L("Failed to save profile."));
        box.slideDown();
      },
    });
  }

  function validateObject(data, path, exceptions) {
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var curpath = (path ? path + "." :  "") + key;
      if (typeof data[key] === "string") {
        if (exceptions && curpath.match(exceptions)) continue;
        data[key] = data[key].replace(/[^a-zA-Z0-9_\-+\. ]/g, "");
      } else if (typeof data[key] === "object") {
        validateObject(data[key], curpath, exceptions);
      }
    }
  }

  function doLoadProfile(id, errors) {
    var data = {id: id};
    if (errors) data.error = 1;
    function signalError(reason) {
      var errorBox = $("<div class=\"errorBox\"><div><h3>Failed to load profile</h3><p>" + reason + "</p></div></div>");
      errorBox.click(function() {
        errorBox.remove();
      });
      $("body").append(errorBox);
    }
    $.ajax({
      url: "load",
      data: data,
      type: "POST",
      dataType: "json",
      success: function(data) {
        if (data.error) {
          return signalError(_L(data.error));
        }
        DiabloCalc.session.profile = id;
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, "", location.protocol + "//" + location.hostname + DiabloCalc.relPath + (errors ? "e" : "") + id);
        }
        if (data.name) {
          document.title = data.name + " - " + DiabloCalc.pageTitle;
        } else {
          document.title = DiabloCalc.pageTitle;
        }
        validateObject(data, "", /profiles\.[0-9]+\.name/);
        DiabloCalc.setAllProfiles(data, "load");
        $(".editframe").tabs("option", "active", 0);
      },
      error: function(e) {
        signalError(_L("Unknown error"));
      },
    });
  }
  function loadProfile(evt, id, errors) {
    DiabloCalc.activity("loadprofile");
    if (evt && DiabloCalc.isModified && DiabloCalc.isModified()) {
      DiabloCalc.popupMenu(evt, _L.fixkey({
        "Discard current profile?": function() {
          doLoadProfile(id, errors);
        },
      }));
    } else {
      doLoadProfile(id, errors);
    }
  }

  function MakeProfile(data, hero) {
    var id = hero.id;
    var li = $("<li></li>");
    if (hero.views) li.attr("title", _L("{0} recent views").format(hero.views));
    li.append("<span class=\"class-icon class-" + hero.class + (hero.gender ? " " + hero.gender : "") + "\">&nbsp;</span>");
    li.click(function(evt) {
      loadProfile(evt, id);
    });
    li.append("<span class=\"profile-name" + (hero.value ? "" : " unnamed") + "\">" + (hero.value || _L("Unnamed profile")) + "</span>");
    if (hero.author && hero.value) li.find(".profile-name").append("<span class=\"profile-author\">" + _L(" by {0}").format(hero.author) + "</span>");
    if (data.user) {
      li.append($("<span class=\"profile-overwrite\" title=\"" + _L("Update profile") + "\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, _L.fixkey({
          "Save current set": function() {
            saveProfile(id, false);
          },
          "Save all sets and settings": function() {
            saveProfile(id, true);
          },
        }));
      }));
      li.append($("<span class=\"profile-delete\" title=\"" + _L("Delete profile") + "\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, _L.fixkey({
          "Confirm delete?": function() {
            $.ajax({
              url: "delete",
              data: {id: id},
              type: "POST",
              dataType: "json",
              success: function(response) {
                if (response.code === "OK") {
                  MyProf.response.val(_L("Deleted."));
                  UpdateProfiles();
                } else if (response.errors && response.errors.length) {
                  MyProf.response.val(response.errors[0]);
                } else {
                  MyProf.response.val(_L("Failed to delete profile."));
                }
                MyProf.response.slideDown();
              },
              error: function(e) {
                MyProf.response.val(_L("Failed to delete profile."));
                MyProf.response.slideDown();
              },
            });
          },
        }));
      }));
    }
    li.append("<span class=\"date-saved\"><span>" + (new Date(1000 * hero.date)).toLocaleString() + "</span></span>");
    return li;
  }

  var tab = DiabloCalc.addScroll($("#tab-import"), "y");
  Sections = tab;//$("<div></div>");
  //tab.append(Sections);

  Sections.append("<h3>" + _L("Import") + "</h3>");
  var ImportDiv = $("<div></div>");
  Sections.append(ImportDiv);

  ImportDiv.append("<p>" + _L("BNImportNotice") + "</p>");
  //ImportDiv.append("<p><b>" + _L("The US and CN battle.net APIs are having issues, see these topics: " +
  //  "<a href=\"http://us.battle.net/en/forum/topic/19022402648\">US</a>, " +
  //  "<a href=\"http://us.battle.net/en/forum/topic/19288408739\">CN</a>.") + "</b></p>");

  Import.region = $("<select></select>").addClass("import-region");
  Import.region.append("<option value=\"eu\">EU</option>");
  Import.region.append("<option value=\"us\">US</option>");
  Import.region.append("<option value=\"tw\">TW</option>");
  Import.region.append("<option value=\"kr\">KR</option>");
  Import.region.append("<option value=\"cn\">CN</option>");
  Import.battletag = $("<input></input>").addClass("import-battletag").addClass("tooltip-active").val("Tag#1234").attr("name", "battletag");
  Import.button = $("<input></input>").attr("type", "submit").val(_L("Search")).click(function() {
    var region = Import.region.val();
    var tag = Import.battletag.val();
    if (Import.battletag.hasClass("tooltip-active")) {
      return;
    }

    var tags = (DiabloCalc.getStorage("battletag") || {});
    if (!tags[region]) tags[region] = [];
    if (tags[region].indexOf(tag) < 0) {
      tags[region].push(tag);
    }
    DiabloCalc.setStorage("region", region);
    DiabloCalc.setStorage("battletag", tags);
    importProfile(region, tag);
  });
  Import.battletag.focus(function() {
    if ($(this).hasClass("tooltip-active")) {
      $(this).removeClass("tooltip-active");
      $(this).val("");
    }
    $(this).autocomplete("search");
  }).blur(function() {
    if ($(this).val() === "") {
      $(this).addClass("tooltip-active");
      $(this).val("Tag#1234");
    }
  }).autocomplete({
    delay: 0,
    minLength: 0,
    select: function(event, ui) {
      importProfile(Import.region.val(), ui.item.value);
    },
    source: function(request, response) {
      var region = Import.region.val();
      var list = ((DiabloCalc.getStorage("battletag") || {})[region] || []);
      list.sort();
      var re = new RegExp($.ui.autocomplete.escapeRegex(request.term.toLowerCase()));
      response($.grep(list, function(x) {return x && re.test(x.toLowerCase());}));
    },
  }).keypress(function(e) {
    if (e.which == 13) {
      $(this).blur();
      Import.button.click();
    }
  });
  Import.region.val(DiabloCalc.getStorage("region") || "us");
  ImportDiv.append(Import.region).append(Import.battletag).append(Import.button);

  Import.results = $("<ul class=\"import-results\"></ul>");
  ImportDiv.append(Import.results);

  Sections.append("<h3>" + _L("Save") + "</h3>");
  var SaveDiv = $("<div></div>");
  Sections.append(SaveDiv);

  SaveDiv.append("<p>" + _L("Enter a name or a short description for your profile. Unnamed profiles do not come up in search results.") + "</p>");
  Save.public = $("<input type=\"checkbox\"></input>");
  Save.allsets = $("<input type=\"checkbox\"></input>");
  var publabel = $("<label title=\"" + _L("This profile will come up in search results, and might appear in future Popular Builds listings.") + "\">" + _L("Public profile") + "</label>")
    .prepend(Save.public).css("margin-bottom", -6);
  SaveDiv.append(publabel);
/*  SaveDiv.append(DiabloCalc.account.makeLine(_L(" to save private profiles"), function(okay) {
    this.toggle(!okay);
    privlabel.toggle(okay);
  }));*/
  SaveDiv.append($("<label>" + _L("Save all sets and settings") + "</label>").prepend(Save.allsets));
  Save.name = $("<input class=\"import-savename\"></input>");
  Save.button = $("<input type=\"button\" value=\"" + _L("Save") + "\"></input>").click(function() {
    saveProfile();
  });
  Save.response = $("<input class=\"import-saveresult\" readonly=\"readonly\"></input>").focus(function() {
    this.select();
  }).mouseup(function(e) {
    e.preventDefault();
  }).hide();
  SaveDiv.append(Save.name, "<br/>", Save.button, Save.response);

  Sections.append("<h3>" + _L("Search") + "</h3>");
  var LoadDiv = $("<div></div>");
  Sections.append(LoadDiv);

  Load.cls = $("<select class=\"import-loadclass\"><option value=\"\">" + _L("Any Class") + "</option></select>");
  for (var cls in DiabloCalc.classes) {
    if (DiabloCalc.classes[cls].follower) continue;
    Load.cls.append("<option value=\"" + cls + "\">" + DiabloCalc.classes[cls].name + "</option>");
  }
  Load.mainset = $("<select class=\"import-mainset\"><option value=\"\">" + _L("Any Set") + "</option></select>");
  Load.order = $("<select class=\"import-loadorder\"></select>");
  Load.order.append("<option selected=\"selected\" value=\"popularity\">" + _L("Most popular first") + "</option>");
  Load.order.append("<option value=\"date\">" + _L("Most recent first") + "</option>");
  Load.name = $("<input class=\"import-loadname\" placeholder=\"" + _L("Profile name") + "\"></input>");
  Load.button = $("<input type=\"button\" value=\"" + _L("Search") + "\"></input>").click(function() {
    DiabloCalc.activity("search");
    Load.results.search({term: Load.name.val(), cls: Load.cls.val(), mainset: Load.mainset.val(), order: Load.order.val()});
  });
  Load.results = new DiabloCalc.SearchResults("search", MakeProfile);
  LoadDiv.append($("<div class=\"searchrow searchrow-1\"></div>").append(Load.cls, Load.mainset, Load.button), $("<div class=\"searchrow\"></div>").append(Load.name, Load.order), Load.results.div);

  Load.cls.change(function() {
    var val0 = Load.mainset.val(), val = "";
    Load.mainset.empty();
    Load.mainset.append("<option value=\"\">" + _L("Any Set") + "</option>");
    Load.mainset.append("<option value=\"none\">" + _L("None ({0})").format(DiabloCalc.itemSets.nightmares.name) + "</option>");
    var cls = Load.cls.val();
    for (var id in DiabloCalc.itemSets) {
      var set = DiabloCalc.itemSets[id];
      if ((set.class === cls || set.tclass === cls) && set.bonuses[6]) {
        Load.mainset.append("<option value=\"" + id + "\">" + set.name + "</option>");
      }
    }
  });
  DiabloCalc.register("changeClass", function() {
    Load.cls.val(DiabloCalc.charClass).change();
  });
  Load.cls.val(DiabloCalc.charClass).change();
  Load.name.autocomplete({
    minLength: 2,
    select: function(event, ui) {
      DiabloCalc.activity("search");
      loadProfile(event, ui.item.id);
    },
  });
  var that = Load.name.autocomplete("instance");
  that._renderItem = function(ul, item) {
    //var date = item.date;
    //date = date.substring(0, date.indexOf(" "));
    return $("<li></li>").addClass("search-tip").append("<a class=\"class-icon class-" + item.class + "\">" + item.value +
      (item.author ? " <span class=\"profile-author\">" + _L(" by {0}").format(item.author) + "</span>" : "") + "</a>").appendTo(ul);
  };
  Load.name.autocomplete({
    source: function(request, response) {
      if (that.xhr) {
        that.xhr.abort();
      }
      that.xhr = $.ajax({
        url: "search",
        data: {term: request.term, cls: Load.cls.val(), mainset: Load.mainset.val(), order: Load.order.val()},
        dataType: "json",
        global: false,
        success: function(data) {
          response(data.results || []);
        },
        error: function() {
          response([]);
        },
      });
    },
  });
  Load.name.on("keypress", function(e) {
    if (e.which === 13) {
      Load.button.click();
      Load.name.autocomplete("close");
      if (that.xhr) {
        that.xhr.abort();
        delete that.xhr;
      }
      setTimeout(function() {
        if (that.searching) {
          clearTimeout(that.searching);
          delete that.searching;
        }
      }, 1);
    }
  });

  Sections.append("<h3>" + _L("My Profiles") + "</h3>");
  var MyDiv = $("<div></div>");
  Sections.append(MyDiv);
  MyProf.results = new DiabloCalc.SearchResults("search", MakeProfile);
  MyProf.response = $("<input class=\"import-saveresult\" readonly=\"readonly\"></input>").focus(function() {
    this.select();
  }).mouseup(function(e) {
    e.preventDefault();
  }).hide();
  MyDiv.append(MyProf.results.div, MyProf.response);
  MyDiv.prepend(DiabloCalc.account.makeLine(_L(" to track your saved profiles"), function(okay) {
    UpdateProfiles();
    this.toggle(!okay);
  }));

  Sections.accordion({
    collapsible: true,
    heightStyle: "content",
    activate: function(event, ui) {
      ui.newPanel.removeClass("sliding");
      ui.oldPanel.removeClass("sliding");
    },
    beforeActivate: function(event, ui) {
      ui.newPanel.addClass("sliding");
      ui.oldPanel.addClass("sliding");
    },
  });

  DiabloCalc.loadProfile = loadProfile;
})();
(function() {

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
    if (DiabloCalc.isModified && DiabloCalc.isModified()) {
      DiabloCalc.popupMenu(evt, {
        "Discard current profile?": function() {
          doLoadCharacter(region, battletag, id, dead);
        },
      });
    } else {
      doLoadCharacter(region, battletag, id, dead);
    }
  }
  function importProfile(region, battletag) {
    battletag = battletag.replace("#", "-");

    Import.results.empty();
    $.ajax({
      url: "proxy",
      data: {region: region, tag: battletag},
      type: "POST",
      dataType: "json",
      success: function(data) {
        for (var keytype = 0; keytype < 2; ++keytype) {
          var heroes = (keytype ? data.fallenHeroes : data.heroes);
          if (!heroes) {
            continue;
          }
          if (keytype) {
            Import.results.append("<p>Fallen Heroes</p>");
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
              season = " <span class=\"hero-seasonal\" title=\"Seasonal\">&nbsp;</span>";
            }
            if (hero.dead || keytype) {
              dead = " <span class=\"hero-dead\">(Died " + date + ")</span>";
              li.addClass("hero-dead");
            }
            li.append("<span class=\"hero-name\">" + hero.name + "</span>");
            li.append(" <span class=\"hero-desc" + hc + "\">Level " + hero.level + " " + DiabloCalc.classes[cls].name + "</span>" + season + dead);
            if (!hero.dead) {
              li.append("  <span class=\"hero-updated\">(updated " + date + ")</span>");
            }
          }
        }
      },
      error: function() {
        Import.results.text("Profile not found.");
      },
    });
  }

  function saveProfile(id, all) {
    if (all === undefined) all = Save.allsets.prop("checked");
    var data = (all ? DiabloCalc.getAllProfiles() : DiabloCalc.getProfile());
    var box;
    if (id) {
      data.id = id;
      box = MyProf.response;
    } else {
      data.name = Save.name.val();
      data.private = Save.private.prop("checked");
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
          var url = location.protocol + "//" + location.hostname + "/" + response.id;
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, "", url);
          }
          box.val(url);
          UpdateProfiles();
        } else if (response.errors && response.errors.length) {
          box.val(response.errors[0]);
        } else {
          box.val("Failed to save profile.");
        }
        box.slideDown();
      },
      error: function(e) {
        box.val("Failed to save profile.");
        box.slideDown();
      },
    });
  }

  function doLoadProfile(id, errors) {
    var data = {id: id};
    if (errors) data.error = 1;
    $.ajax({
      url: "load",
      data: data,
      type: "POST",
      dataType: "json",
      success: function(data) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, "", location.protocol + "//" + location.hostname + "/" + (errors ? "e" : "") + id);
        }
        DiabloCalc.setAllProfiles(data, "load");
        $(".editframe").tabs("option", "active", 0);
      },
      error: function(e) {
      },
    });
  }
  function loadProfile(evt, id, errors) {
    if (evt && DiabloCalc.isModified && DiabloCalc.isModified()) {
      DiabloCalc.popupMenu(evt, {
        "Discard current profile?": function() {
          doLoadProfile(id, errors);
        },
      });
    } else {
      doLoadProfile(id, errors);
    }
  }

  function MakeProfile(data, hero) {
    var id = hero.id;
    var li = $("<li></li>");
    li.append("<span class=\"class-icon class-" + hero.class + "\">&nbsp;</span>");
    li.click(function(evt) {
      loadProfile(evt, id);
    });
    li.append("<span class=\"profile-name" + (hero.value ? "" : " unnamed") + "\">" + (hero.value || "Unnamed profile") + "</span>");
    if (data.user) {
      li.append($("<span class=\"profile-overwrite\" title=\"Update profile\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, {
          "Save current set": function() {
            saveProfile(id, false);
          },
          "Save all sets and settings": function() {
            saveProfile(id, true);
          },
        });
      }));
      li.append($("<span class=\"profile-delete\" title=\"Delete profile\"></span>").click(function(evt) {
        evt.stopPropagation();
        DiabloCalc.popupMenu(evt, {
          "Confirm delete?": function() {
            $.ajax({
              url: "delete",
              data: {id: id},
              type: "POST",
              dataType: "json",
              success: function(response) {
                if (response.code === "OK") {
                  MyProf.response.val("Deleted.");
                  UpdateProfiles();
                } else if (response.errors && response.errors.length) {
                  MyProf.response.val(response.errors[0]);
                } else {
                  MyProf.response.val("Failed to delete profile.");
                }
                MyProf.response.slideDown();
              },
              error: function(e) {
                MyProf.response.val("Failed to delete profile.");
                MyProf.response.slideDown();
              },
            });
          },
        });
      }));
    }
    li.append("<span class=\"date-saved\">" + (new Date(1000 * hero.date)).toLocaleString() + "</span>");
    return li;
  }

  var tab = DiabloCalc.addScroll($("#tab-import"), "y");
  Sections = tab;//$("<div></div>");
  //tab.append(Sections);

  Sections.append("<h3>Import</h3>");
  var ImportDiv = $("<div></div>");
  Sections.append(ImportDiv);

  ImportDiv.append("<p>Imported data does not contain Paragon point distribution.</p>");

  Import.region = $("<select></select>").addClass("import-region");
  Import.region.append("<option value=\"eu\">EU</option>");
  Import.region.append("<option value=\"us\">US</option>");
  Import.region.append("<option value=\"tw\">TW</option>");
  Import.region.append("<option value=\"kr\">KR</option>");
  Import.battletag = $("<input></input>").addClass("import-battletag").addClass("tooltip-active").val("Tag#1234").attr("name", "battletag");
  Import.button = $("<input></input>").attr("type", "submit").val("Search").click(function() {
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

  Sections.append("<h3>Save</h3>");
  var SaveDiv = $("<div></div>");
  Sections.append(SaveDiv);

  SaveDiv.append("<p>Enter a name or a short description for your profile. Unnamed profiles do not come up in search results.</p>");
  Save.private = $("<input type=\"checkbox\"></input>");
  Save.allsets = $("<input type=\"checkbox\"></input>");
  var privlabel = $("<label title=\"This profile will not come up in search results, but can be accessed using the link provided.\">Private profile</label>")
    .prepend(Save.private).css("margin-bottom", -6);
  SaveDiv.append(privlabel);
  SaveDiv.append(DiabloCalc.account.makeLine(" to save private profiles", function(okay) {
    this.toggle(!okay);
    privlabel.toggle(okay);
  }));
  SaveDiv.append($("<label>Save all sets and settings</label>").prepend(Save.allsets));
  Save.name = $("<input class=\"import-savename\"></input>");
  Save.button = $("<input type=\"button\" value=\"Save\"></input>").click(function() {
    saveProfile();
  });
  Save.response = $("<input class=\"import-saveresult\" readonly=\"readonly\"></input>").focus(function() {
    this.select();
  }).mouseup(function(e) {
    e.preventDefault();
  }).hide();
  SaveDiv.append(Save.name, "<br/>", Save.button, Save.response);

  Sections.append("<h3>Load</h3>");
  var LoadDiv = $("<div></div>");
  Sections.append(LoadDiv);

  Load.name = $("<input class=\"import-loadname\"></input>");
  Load.button = $("<input type=\"button\" value=\"Search\"></input>").click(function() {
    Load.results.search({term: Load.name.val()});
  });
  Load.results = new DiabloCalc.SearchResults("search", MakeProfile);
  LoadDiv.append(Load.name, Load.button, Load.results.div);

  Load.name.autocomplete({
    minLength: 2,
    select: function(event, ui) {
      loadProfile(event, ui.item.id);
    },
  });
  var that = Load.name.autocomplete("instance");
  that._renderItem = function(ul, item) {
    //var date = item.date;
    //date = date.substring(0, date.indexOf(" "));
    return $("<li></li>").addClass("search-tip").append("<a class=\"class-icon class-" + item.class + "\">" + item.value + "</a>").appendTo(ul);
  };
  Load.name.autocomplete({
    source: function(request, response) {
      if (that.xhr) {
        that.xhr.abort();
      }
      that.xhr = $.ajax({
        url: "search",
        data: request,
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

  Sections.append("<h3>My Profiles</h3>");
  var MyDiv = $("<div></div>");
  Sections.append(MyDiv);
  MyProf.results = new DiabloCalc.SearchResults("search", MakeProfile);
  MyProf.response = $("<input class=\"import-saveresult\" readonly=\"readonly\"></input>").focus(function() {
    this.select();
  }).mouseup(function(e) {
    e.preventDefault();
  }).hide();
  MyDiv.append(MyProf.results.div, MyProf.response);
  MyDiv.prepend(DiabloCalc.account.makeLine(" to track your saved profiles", function(okay) {
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
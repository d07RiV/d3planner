function FormatNumber(num, decimal, separator) {
  if (separator === undefined) {
    return num.toFixed(decimal || 0);
  }
  var parts = num.toFixed(decimal || 0).split(".");
  if (parseFloat(num) >= separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return parts.join(".");
}
function FormatDamage(val) {
  if (val > 1e+13) {
    return FormatNumber(val / 1e+12, 3, 10000) + " T";
  } else if (val > 1e+10) {
    return FormatNumber(val / 1e+9, 3, 10000) + " B";
  } else if (val > 1e+7) {
    return FormatNumber(val / 1e+6, 3, 10000) + " M";
  } else {
    return FormatNumber(val, 0, 10000);
  }
}
function _run() {
  $.each(Tests, function(name, t) {
    var out1 = $("<td></td>");
    var out2 = $("<td></td>");
    var row = $("<tr><td>" + name + "</td><td>" + FormatDamage(t.damage) + "</td></tr>");
    row.append(out1, out2);
    $("table").append(row);
    var wrk = new Worker("/sim");
    wrk.onmessage = function(e) {
      if (e.data.type === "report") {
        var damage = e.data.damage / e.data.time * 60;
        out1.text(FormatDamage(damage));
        out2.text((damage >= t.damage ? "+" : "") + ((damage - t.damage) / t.damage * 100).toFixed(2) + "%");
      }
    };
    t.profile.type = "start";
    wrk.postMessage(t.profile);
  });
}

var fs = require("fs-extra");
var UglifyJS = require("uglify-js");
var less = require("less");
var ps = require("path");

var outDir = "production";
var cacheDir = "build_cache";

var jobs = {
  "css/all.css": {
    files: [
      "css/main.css",
      "css/layout.less",
      "css/classes.less",
      "css/paperdoll.less",
      "css/skills.less",
      "css/timeline.less",
      "css/stash.less",
      "css/simulator.less",
    ],
    processor: "less",
  },
  "external/all.css": {
    files: [
      "external/jquery-ui.css",
      "external/chosen.css",
    ],
    processor: "less",
  },
  "external/bnet/css/all.css": {
    files: [
      "external/bnet/css/tooltips.css",
    ],
    processor: "less",
  },
  "script.js": {
    files: [
      "external/jquery-2.0.3.js",
      "external/jquery-ui.js",
      "external/spin.min.js",
      "external/jquery.cookie.js",
      "external/chosen.jquery.js",
      "external/Chart.js",
      "external/jquery.mousewheel.js",
      "external/mwheelIntent.js",
      "external/md5.js",
      "external/canvasjs.js",
      "external/jquery.ui.touch-punch.js",
      "external/gl-matrix.js",
      "scripts/main.js",
    ],
    processor: "uglifyjs",
    localjs: true,
  },
  "core.js": {
    files: [
      "scripts/common.js",
      "scripts/bnet-parser.js",
      "scripts/bnet-tooltips.js",
      "scripts/stats.js",
      "scripts/itembox.js",
      "scripts/skilldata.js",
      "scripts/skillbox.js",
      "scripts/account.js",
      "scripts/optimizer.js",
      "scripts/ui-paperdoll.js",
      "scripts/ui-equipment.js",
      "scripts/ui-import.js",
      "scripts/ui-paragon.js",
      "scripts/ui-stats.js",
      "scripts/ui-skills.js",
      "scripts/ui-timeline.js",
      "scripts/ui-simulator.js",
      "scripts/d3gl_physics.js",
      "scripts/d3gl.js",
    ],
    suffix: "DiabloCalc.onLoaded();",
    processor: "uglifyjs",
    localjs: true,
  },
  "scripts/data.js": {
    files: [
      "scripts/data.js",
    ],
    processor: "uglifyjs",
  },
  "scripts/locale.js": {
    files: [
      ...fs.readdirSync("scripts/locale").map(fn => "scripts/locale/" + fn),
    ],
    suffix: "DiabloCalc.onLocaleLoaded();",
    processor: "uglifyjs",
    localjs: true,
  },
  "scripts/icons.js": {
    files: [
      "scripts/data/item_icons.js",
    ],
    processor: "uglifyjs",
    localjs: true,
  },
  "data.js": {
    files: [
      ...fs.readdirSync("scripts/data").map(fn => "scripts/data/" + fn),
      "scripts/d3gl_data.js",
    ],
    suffix: "DiabloCalc.onDataLoaded();",
    processor: "uglifyjs",
    localjs: true,
  },
  "data_ptr.js": {
    files: [
      ...fs.readdirSync("scripts/data_ptr").map(fn => "scripts/data_ptr/" + fn),
      "scripts/d3gl_data.js",
    ],
    suffix: "DiabloCalc.onDataLoaded();",
    processor: "uglifyjs",
    localjs: true,
  },
  "sim.js": {
    files: [
      "simulator/seedrandom.js",
      "simulator/heap.js",
      "simulator/math.js",
      "simulator/sim.js",
      "simulator/stats.js",
      "simulator/buffs.js",
      "simulator/damage.js",
      "simulator/cast.js",
      "simulator/itemsets.js",
      "simulator/itemspecial.js",
      "simulator/priority.js",
      "simulator/tracker.js",
    ],
    prefix: "Simulator = {};",
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/wizard.js": {
    files: [
      "simulator/wizard.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/demonhunter.js": {
    files: [
      "simulator/demonhunter.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/barbarian.js": {
    files: [
      "simulator/barbarian.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/monk.js": {
    files: [
      "simulator/monk.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/witchdoctor.js": {
    files: [
      "simulator/witchdoctor.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
  "sim/crusader.js": {
    files: [
      "simulator/crusader.js",
    ],
    processor: "uglifyjs",
    localjs: "worker",
  },
};

//////////////////////////////////

fs.removeSync(outDir);
fs.mkdirSync(outDir);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

function writeFile(path, data) {
  fs.createFileSync(path);
  fs.writeFileSync(path, data);
}
function readFile(path) {
  return fs.readFileSync(path, {encoding: "utf-8"});
}

var processors = {
  "uglifyjs": function(path) {
    var res;
    try {
      var result = UglifyJS.minify(readFile(path));
      res = result.code;
      if (result.error) console.log(result.error);
    } catch (err) {
      console.log(err);
    }
    return res;
  },
  "less": function(path) {
    var data;
    less.render(readFile(path), {
      filename: path,
      compress: true,
    }, function(e, output) {
      data = output.css;
    });
    return data;
  },
};

Object.entries(jobs).forEach(([output, desc]) => {
  console.log("Processing " + output);
  const func = processors[desc.processor];
  let result = [];
  let tm = null;
  if (desc.prefix) result.push(desc.prefix);
  desc.files.forEach(path => {
    const cachePath = cacheDir + "/" + path;
    const statSrc = fs.statSync(path);
    if (fs.existsSync(cachePath)) {
      const statDst = fs.statSync(cachePath);
      if (statSrc.mtime > statDst.mtime) {
        fs.removeSync(cachePath);
      }
    }
    let contents;
    if (fs.existsSync(cachePath)) {
      contents = readFile(cachePath);
    } else {
      console.log("  " + path);
      contents = func(path);
      writeFile(cachePath, contents);
      fs.utimesSync(cachePath, statSrc.mtime, statSrc.mtime);
    }
    if (!tm || statSrc.mtime > tm) {
      tm = statSrc.mtime;
    }
    result.push(contents);
  });
  if (desc.suffix) result.push(desc.suffix);
  writeFile(outDir + "/" + output, result.join("\n"));
  if (tm) fs.utimesSync(outDir + "/" + output, tm, tm);

  if (desc.localjs) {
    let result = [];
    if (desc.localjs === "worker") {
      if (desc.prefix) result.push(desc.prefix);
      desc.files.forEach(path => {
        const stat = fs.statSync(path);
        result.push(`importScripts("${path}?${stat.mtime.getTime()}")`);
      });
      if (desc.suffix) result.push(desc.suffix);
      result = result.join("\n");
    } else {
      desc.files.forEach(path => {
        const stat = fs.statSync(path);
        result.push(`    "/${path}?${stat.mtime.getTime()}",`);
      });
      result = `(function() {
  var order = [
${result.join("\n")}
  ];
  ${desc.prefix || ""}
  var loadIdx = 0;
  function doLoad() {
    if (loadIdx >= order.length) {
      ${desc.suffix || ""}
    } else {
      var path = order[loadIdx++];
      DC_getScript(path, doLoad);
    }
  }
  doLoad();
})();`;
    }
    writeFile(output, result);
  } else if (desc.processor === "less") {
    writeFile(output, result.join("\n"));
  }
});

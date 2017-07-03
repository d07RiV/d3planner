var outDir = "production";
var phpHeader =
  "<?php\n" +
  "header('Content-type: application/javascript');" +
  "function mklink($path, $src = NULL) {\n" +
  "  echo $path . \"?\" . filemtime($_SERVER['DOCUMENT_ROOT'] . ($src ? $src : $path));\n" +
  "}\n" +
  "?>\n";
var customStep = {
/*  "scripts/main.js": function(res) {
    return phpHeader + res.replace(/"\/[^"]*\.js"/gi, function(x) {
      if (x === "\"/scripts/data.js\"") return "\"<?php mklink(\"/scripts/data.js\", \"/scripts/data.php\"); ?>\"";
      if (x === "\"/scripts/ui-simulator.js\"") return "\"<?php mklink(\"/scripts/ui-simulator.js\", \"/scripts/ui-simulator.php\"); ?>\"";
      return "\"<?php mklink(" + x + "); ?>\"";
    });
  },
  "scripts/data.js": function(res) {
    return phpHeader + res.replace("\"/data\"", "\"<?php " +
                                           "$domain = explode('.', strtolower($_SERVER['HTTP_HOST'])); " +
                                           "mklink('/data', '/php/' . ($domain[0] == 'ptr' ? 'data.ptr.js.gz' : 'data.js.gz')); ?>\"");
  },
  "scripts/ui-simulator.js": function(res) {
    return phpHeader + res.replace("\"/sim\"", "\"<?php mklink('/sim', '/php/sim.temp.js'); ?>\"");
  },*/
};
var exceptions = {
//  "scripts/main.js": "scripts/main.php",
//  "scripts/data.js": "scripts/data.php",
//  "scripts/ui-simulator.js": "scripts/ui-simulator.php",
  "external/chosen.css": "external/chosen.min.css",
  "external/chosen.jquery.js": "external/chosen.jquery.min.js",
  "external/jquery-ui.js": "external/jquery-ui.min.js",
  "external/mwheelIntent.js": "external/mwheelIntent.min.js",
  "external/J3DIMath.js": "external/J3DIMath.min.js",
  "external/canvasjs.js": "external/canvasjs.min.js",
//  "simulator": "sim",
};
var job = {
//  "chinese/scripts/locale": "uglifyjs",
//  "scripts/d3gl_data.js": "uglifyjs",
//  "scripts/data_ptr": "uglifyjs",
//  "scripts" : "uglifyjs",
//  "css": "less",
  "simulator": "uglifyjs",
//  "external/canvasjs.js": "uglifyjs",
//  "external/J3DIMath.js": "uglifyjs",
//  "external/md5.js": "uglifyjs",
//  "external/bnet/css/tooltips.css": "less",
//  "external/chosen.css": "less",
//  "external/jquery-ui.js": "uglifyjs",
//  "external/chosen.jquery.js": "uglifyjs",
//  "external/jquery.cookie.js": "uglifyjs",
//  "external/Chart.js": "uglifyjs",
};

//////////////////////////////////

var fs = require("fs-extra");
var UglifyJS = require("uglify-js");
var less = require("less");
var ps = require("path");

fs.removeSync(outDir);
fs.mkdirSync(outDir);

function writeFile(path, data) {
  fs.createFileSync(path);
  fs.writeFileSync(path, data);
}
function readFile(path) {
  return fs.readFileSync(path, {encoding: "utf-8"});
}

var extensions = {
  "uglifyjs": ["js"],
  "less": ["css", "less"],
  "plain": [],
};
var callbacks = {
  "uglifyjs": function(path) {
    var res;
    try {
      res = UglifyJS.minify(path).code;
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
  "plain": function(path) {
    return readFile(path);
  },
};

function process(path, callback) {
  if (exceptions.hasOwnProperty(path)) {
    if (!exceptions[path]) return;
  }
  if (fs.lstatSync(path).isDirectory()) {
    var list = fs.readdirSync(path);
    for (var i = 0; i < list.length; ++i) {
      process(path + "/" + list[i], callback);
    }
  } else {
    var outPath = outDir + "/" + path;
    if (exceptions.hasOwnProperty(path)) {
      if (!exceptions[path]) return;
      outPath = outDir + "/" + exceptions[path];
    }
    var ext = ps.extname(path).substring(1);
    if (extensions[callback].indexOf(ext) >= 0) {
      if (ext != extensions[callback][0]) {
        outPath = outPath.replace(ext, extensions[callback][0]);
      }
      console.log("Processing " + path);
      var res = callbacks[callback](path);
      if (customStep.hasOwnProperty(path) && typeof customStep[path] === "function") {
        res = customStep[path](res);
      }
      writeFile(outPath, res);
    } else {
      fs.createFileSync(outPath);
      fs.copySync(path, outPath);
    }
    var stat = fs.statSync(path);
    fs.utimesSync(outPath, stat.atime, stat.mtime);
  }
}

for (var path in job) {
  process(path, job[path]);
}

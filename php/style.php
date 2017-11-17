<?php
require("getter.php");
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/(external|css|external\/bnet\/css)\/all.css$/', $uri, $match)) {
  if ($match[1] == 'external') {
    GetCss(array(
      "external/jquery-ui.min.css",
      "external/chosen.min.css",
    ));
  } else if ($match[1] == 'external/bnet/css') {
    GetCss(array(
      "external/bnet/css/tooltips.css",
    ));
  } else {
    GetCss(array(
      "css/main.css",
      "css/layout.css",
      "css/classes.css",
      "css/paperdoll.css",
      "css/skills.css",
      "css/timeline.css",
      "css/stash.css",
      "css/simulator.css",
    ));
  }
}
?>
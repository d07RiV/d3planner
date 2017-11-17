<?php
require("getter.php");
$uri = $_SERVER['REQUEST_URI'];
$domain = explode('.', strtolower($_SERVER['HTTP_HOST']));
$list = array();
function add_doc($name) {
  global $list;
  global $domain;
  if ($domain[0] == "ptr" && file_exists("../simulator/ptr_$name.js")) {
    $list[] = "simulator/ptr_$name.js";
  } else {
    $list[] = "simulator/$name.js";
  }
}
if (preg_match('/\/sim\/(wizard|demonhunter|witchdoctor|monk|barbarian|crusader)/', $uri, $matches)) {
  add_doc($matches[1]);
  GetDocs($list);
} else {
  add_doc("seedrandom");
  add_doc("heap");
  add_doc("math");
  add_doc("sim");
  add_doc("stats");
  add_doc("buffs");
  add_doc("damage");
  add_doc("cast");
  add_doc("itemsets");
  add_doc("itemspecial");
  add_doc("priority");
  add_doc("tracker");
  GetDocs($list, true, "Simulator = {};");
}
?>
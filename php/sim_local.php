<?php
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/^\/sim\/(wizard|demonhunter|witchdoctor|monk|barbarian|crusader)/', $uri, $matches)) {
  $out = file_get_contents('../simulator/' . $matches[1] . '.js');
} else {
  $out = "Simulator = {};\n";
  $out .= file_get_contents('../simulator/seedrandom.js') . "\n";
  $out .= file_get_contents('../simulator/heap.js') . "\n";
  $out .= file_get_contents('../simulator/sim.js') . "\n";
  $out .= file_get_contents('../simulator/stats.js') . "\n";
  $out .= file_get_contents('../simulator/buffs.js') . "\n";
  $out .= file_get_contents('../simulator/damage.js') . "\n";
  $out .= file_get_contents('../simulator/cast.js') . "\n";
  $out .= file_get_contents('../simulator/itemsets.js') . "\n";
  $out .= file_get_contents('../simulator/itemspecial.js') . "\n";
  $out .= file_get_contents('../simulator/priority.js') . "\n";
  $out .= file_get_contents('../simulator/tracker.js') . "\n";
  $out = preg_replace_callback('/"\/sim\/(wizard|demonhunter|witchdoctor|monk|barbarian|crusader)"/', function($matches) {
    $path = '../simulator/' . $matches[1] . '.js';
    if (file_exists($path)) {
      return '"/sim/' . $matches[1] . '?' . filemtime($path) . '"';
    } else {
      return $matches[0];
    }
  }, $out);
}
header('Content-Type: application/javascript');
header('Content-Length: ' . strlen($out));
echo $out;
?>
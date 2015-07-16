<?php
$data = file_get_contents('sim.js');
header('Content-Type: application/javascript');
$domain = explode('.', strtolower($_SERVER['HTTP_HOST']));
echo preg_replace_callback('/"(sim\/(\w+))"/', function($matches) {
  global $domain;
  $name = ($domain[0] == 'ptr' ? 'ptr_' : '') . $matches[2] . '.js';
  if (!file_exists($name)) {
    $name = $matches[2] . '.js';
  }
  if (file_exists($name)) {
    return '"' . $matches[1] . '?' . filemtime($name) . '"';
  }
  return $matches[0];
}, $data);
?>
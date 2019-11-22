<?php
require_once("config.inc.php");
$mysql = mysqli_connect($mysql_server, $mysql_user, $mysql_password);
mysqli_select_db($mysql, $mysql_db);
function pass_hash($pass) {
  return md5('SmartSalt' . $pass);
}
function get_domain() {
  $array = explode('.', strtolower($_SERVER['HTTP_HOST']));
  return (array_key_exists(count($array) - 2, $array) ? $array[count($array) - 2] : '') . '.' . $array[count($array) - 1];
}
$domain = get_domain();
?>
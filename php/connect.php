<?php
require_once("config.inc.php");
$mysql = mysql_connect($mysql_server, $mysql_user, $mysql_password);
mysql_select_db($mysql_db);
function get_domain() {
  $array = explode('.', strtolower($_SERVER['HTTP_HOST']));
  return (array_key_exists(count($array) - 2, $array) ? $array[count($array) - 2] : '') . '.' . $array[count($array) - 1];
}
$domain = get_domain();
?>
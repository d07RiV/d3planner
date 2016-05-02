<?php
$root =  $_SERVER['DOCUMENT_ROOT'];

error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);
include_once("connect.php");

$id = intval($_REQUEST['id']);
if ($id == 0) {
  readfile('input.txt');
  exit(0);
}
if (isset($_REQUEST['error'])) {
  $result = mysql_query("SELECT profile FROM errors WHERE id='$id'");
} else {
  $result = mysql_query("SELECT data FROM profiles WHERE id='$id'");
}
if (!$result || !mysql_num_rows($result)) {
  echo FALSE;
} else {
  $row = mysql_fetch_assoc($result);
  if (isset($_REQUEST['error'])) {
    echo $row['profile'];
  } else {
    echo $row['data'];
    $date = time();
    mysql_query("UPDATE profiles SET accessed='$date' WHERE id=$id");
    include_once("actions.php");
    log_action('load', $id);
  }
}
?>
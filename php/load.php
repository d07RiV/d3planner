<?php
$root =  $_SERVER['DOCUMENT_ROOT'];

error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);
include_once("connect.php");

header('Access-Control-Allow-Origin: *');

$id = intval($_REQUEST['id']);
if ($id == 0) {
  readfile('input.txt');
  exit(0);
}
if (isset($_REQUEST['error'])) {
  $result = mysqli_query($mysql, "SELECT profile FROM errors WHERE id='$id'");
} else {
  $result = mysqli_query($mysql, "SELECT data FROM profiles WHERE id='$id'");
}
if (!$result) {
  echo '{"error":"Database error"}';
} else if (!mysqli_num_rows($result)) {
  $result = mysqli_query($mysql, "SELECT data FROM profiles_bk WHERE id='$id'");
  if ($result && mysqli_num_rows($result)) {
    mysqli_query($mysql, "INSERT INTO profiles SELECT * FROM profiles_bk WHERE id='$id'");
  }
}
if (!$result) {
  echo '{"error":"Database error"}';
} else if (!mysqli_num_rows($result)) {
  echo '{"error":"Profile not found"}';
} else {
  $row = mysqli_fetch_assoc($result);
  if (isset($_REQUEST['error'])) {
    echo $row['profile'];
  } else {
    echo $row['data'];
    /*$date = time();
    mysqli_query($mysql, "UPDATE profiles SET accessed='$date' WHERE id=$id");

    $weekno = (int)(time() / (7 * 24 * 3600));
    mysqli_query($mysql, "INSERT INTO profileload (week, profile, requests) VALUES ($weekno, $id, 1) ON DUPLICATE KEY UPDATE requests=requests+1");
    include_once("actions.php");
    log_action('load', $id);*/
  }
}
?>
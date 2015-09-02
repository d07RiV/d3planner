<?php
$uri = strtok($_SERVER['REQUEST_URI'], '?');
if (!preg_match('/\/(textures|animations|models|animsets|icons)\/([0-9]+)$/', $uri, $matches) || !file_exists($matches[1] . '2.wgz')) {
  header('HTTP/1.1 404 Not Found');
  die('File not found');
}
if ($matches[1] == 'textures' && $matches[2] == '0') {
  $out = file_get_contents('white.png');
  header('Content-Type: image/png');
  header('Content-Length: ' . strlen($out));
  echo $out;
  exit();
}
$filename = $matches[1] . '2.wgz';
$tm = filemtime($filename);
$tmstring = gmdate('D, d M Y H:i:s ', $tm) . 'GMT';
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $tmstring) {
  header('HTTP/1.1 304 Not Modified');
  exit();
}

$handle = fopen($filename, 'rb');
$count = unpack('V', fread($handle, 4))[1];
$dir = fread($handle, $count * 12);
$left = 0;
$right = $count;
$request = 0 + $matches[2];
while ($right > $left) {
  $mid = (int)(($left + $right) / 2);
  $id = unpack('V', substr($dir, $mid * 12, 4))[1];
  if ($id < 0) $id += 4294967296;
  if ($id == $request) {
    break;
  } else if ($id < $request) {
    $left = $mid + 1;
  } else {
    $right = $mid;
  }
}
if (!isset($id) || $id != $request) {
  header('HTTP/1.1 404 Not Found');
  die('File not found');
}
$filepos = unpack('V2', substr($dir, $mid * 12 + 4, 8));
fseek($handle, $filepos[1]);
$out = fread($handle, $filepos[2]);
if ($matches[1] == 'textures' || $matches[1] == 'icons') {
  header('Content-Type: image/png');
  header('Last-Modified: ' . $tmstring);
  header('Content-Length: ' . strlen($out));
  echo $out;
} else {
  header('Content-Type: application/octet-stream');
  header('Content-Encoding: gzip');
  header('Last-Modified: ' . $tmstring);
  header('Content-Length: ' . strlen($out));
  echo $out;
}
?>
<?php
require_once("config.inc.php");
function EnumDir($dir) {
  $list = scandir("../$dir");
  $out = array();
  foreach ($list as $i => $name) {
    if (!in_array($name, array('.', '..'))) {
      $out[] = $dir . '/' . $name;
    }
  }
  return $out;
}
function GetDocs($order, $worker=false, $head='', $tail='') {
  global $compress_scripts;
  header('Content-Type: application/javascript; charset=utf-8');
  if ($compress_scripts || count($order) <= 1) {
    $tm = 0;
    $out = $head;
    foreach ($order as $i => $name) {
      $path = "../$name";
      if (file_exists($path)) {
        $tm = max($tm, filemtime($path));
        $out .= file_get_contents($path);
      }
    }
    $out .= $tail;
    $tmstring = gmdate('D, d M Y H:i:s ', $tm) . 'GMT';
    if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $tmstring) {
      header('HTTP/1.1 304 Not Modified');
      exit();
    }
    $out = gzencode($out);
    header('Content-Encoding: gzip');
    header('Last-Modified: ' . $tmstring);
    header('Content-Length: ' . strlen($out));
    echo $out;
  } else if ($worker) {
    echo $head . "\n";
    foreach ($order as $i => $name) {
      $path = "../$name";
      if (file_exists($path)) {
        $tm = filemtime($path);
        echo "importScripts(\"$name?$tm\");\n";
      }
    }
    echo $tail . "\n";
  } else {
?>
(function() {
  var order = [
<?php
  foreach ($order as $i => $name) {
    $path = "../$name";
    if (file_exists($path)) {
      $tm = filemtime($path);
      echo "    \"/$name?$tm\",\n";
    }
  }
?>
  ];
  <?php echo $head . "\n"; ?>
  var loadIdx = 0;
  function doLoad() {
    if (loadIdx >= order.length) {
      <?php echo $tail . "\n";?>
    } else {
      var path = order[loadIdx++];
      DC_getScript(path, doLoad);
    }
  }
  doLoad();
})();
<?php
  }
}
function GetCss($order) {
  header('Content-Type: text/css');
  $tm = 0;
  $out = '';
  foreach ($order as $i => $name) {
    $path = "../$name";
    if (file_exists($path)) {
      $tm = max($tm, filemtime($path));
      $out .= file_get_contents($path);
    }
  }
  $tmstring = gmdate('D, d M Y H:i:s ', $tm) . 'GMT';
  if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $tmstring) {
    header('HTTP/1.1 304 Not Modified');
    exit();
  }
  $out = gzencode($out);
  header('Content-Encoding: gzip');
  header('Last-Modified: ' . $tmstring);
  header('Content-Length: ' . strlen($out));
  echo $out;
}
?>
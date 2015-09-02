<?php
require("getter.php");
$domain = explode('.', strtolower($_SERVER['HTTP_HOST']));
$list = EnumDir($domain[0] == 'ptr' ? 'scripts/data_ptr' : 'scripts/data');
$list[] = "scripts/d3gl_data.js";
GetDocs($list, false, '', "DiabloCalc.onDataLoaded();");
?>
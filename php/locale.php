<?php
require("getter.php");
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/\/locale\/([a-z][a-z][A-Z][A-Z])/', $uri, $matches)) {
  $lang = $matches[1];
  require('../translate/translate.inc.php');
  if (isset($locale_languages[$lang]) && $locale_languages[$lang]) {
    GetDocs(EnumDir("translate/" . $locale_languages[$lang]['output']), false, '', "DiabloCalc.onLocaleLoaded();");
    exit(0);
  }
}
GetDocs(EnumDir("scripts/locale"), false, '', "DiabloCalc.onLocaleLoaded();", 'locale');
?>
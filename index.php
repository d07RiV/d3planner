<?php
require("php/session.php");
get_session(TRUE);
function mklink($path, $src = NULL) {
  echo $path . "?" . filemtime($_SERVER['DOCUMENT_ROOT'] . ($src ? $src : $path));
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Diablo III Character Planner</title>

  <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png">
  <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/favicons/manifest.json">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="<?php if (isset($_COOKIE["theme"]) && $_COOKIE["theme"] == "\"dark\"") echo "#121212"; else echo "#ffffff"; ?>">

  <script src="external/getscript.js"></script>
  <script src="external/tosource.js"></script>
  <link rel="stylesheet" type="text/css" href="external/all.css" />
  <link rel="stylesheet" type="text/css" href="external/bnet/css/all.css" />
  <link rel="stylesheet" type="text/css" href="css/all.css" />

  <link rel="stylesheet/less" type="text/css" href="css/classes.less" />
  <link rel="stylesheet/less" type="text/css" href="css/layout.less" />
  <link rel="stylesheet/less" type="text/css" href="css/paperdoll.less" />
  <link rel="stylesheet/less" type="text/css" href="css/simulator.less" />
  <link rel="stylesheet/less" type="text/css" href="css/skills.less" />
  <link rel="stylesheet/less" type="text/css" href="css/stash.less" />
  <link rel="stylesheet/less" type="text/css" href="css/timeline.less" />
  <script>
    less = {
      async: true,
      fileAsync: true,
    };
  </script>
  <script src="external/less.min.js"></script>

  <script src="script"></script>
 </head>
 <body class="<?php echo (isset($_COOKIE["theme"]) && $_COOKIE["theme"] == "\"light\"") ? "theme-light" : "theme-dark"; ?>">

  <div class="page">

   <div class="row body">

    <div class="col dollframe">

     <div id="ptr-link">
     </div>

     <div id="char-info">
      <select class="char-class"></select>
      <label>Level <input type="number" min="70" max="70" value="70" class="char-level"/></label>
     </div>

     <div class="paperdoll-container">
      <div class="paperdoll-background">
      </div>
     </div>

     <div class="timeline-frame">
     </div>

    </div>

    <div class="col editframe">
      <ul>
       <li class="main-tab"><a href="#tab-equipment">Equipment</a></li>
       <li class="main-tab"><a href="#tab-paragon">Paragon</a></li>
       <li class="main-tab"><a href="#tab-skills">Skills/Effects</a></li>
<!--       <li class="main-tab"><a href="#tab-stash">Stash</a></li>-->
       <li class="main-tab"><a href="#tab-import">Import/Save</a></li>
       <li class="main-tab"><a href="#tab-simulator">Simulate</a></li>
      </ul>

      <div id="tab-equipment" class="scroll-y">
      </div>

      <div id="tab-paragon" class="scroll-y">
      </div>

      <div id="tab-skills" class="scroll-y">
      </div>

<!--      <div id="tab-stash" class="scroll-y">
      </div>-->

      <div id="tab-import" class="scroll-y">
      </div>

      <div id="tab-simulator" class="scroll-y">
      </div>

    </div>

    <div class="col statsframe">
    </div>

   </div>

   <div class="row footer">
    Developed by Riv @ rivsoft.net.
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
     <input type="hidden" name="cmd" value="_s-xclick">
     <input type="hidden" name="hosted_button_id" value="RLWBXAT2ENXY2">
     <input type="image" src="css/images/donate.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
    </form>
    to help development.
    <select class="theme-select">
     <option value="light">Light Theme</option>
     <option value="dark">Dark Theme</option>
    </select>
   </div>

  </div>

 </body>
</html>
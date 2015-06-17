angular.module('templates-app', ['about/about.tpl.html', 'home/home.tpl.html']);

angular.module("about/about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("about/about.tpl.html",
    "<h1>About</h1>\n" +
    "\n" +
    "<p>This is what this is about.</p>");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<nav>\n" +
    "  <div class=\"nv\" ng-hide=\"minned\">\n" +
    "    <div class=\"btn-toolbar center-block\" role=\"toolbar\">\n" +
    "      <div class=\"btn-group btn-group-xs\" role=\"group\">\n" +
    "        <button class=\"btn btn-info\" ng-click=\"setTab(0)\" ng-class=\"{active: isTab(0)}\"><i class=\"fa fa-support\"></i> <span class=\"sr-only\">Help</span></button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"setTab(1)\" ng-class=\"{active: isTab(1)}\"><i class=\"fa fa-trophy\"></i> Assets</button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"setTab(2)\" ng-class=\"{active: isTab(2)}\"><i class=\"fa fa-tachometer\"></i> Conditions</button>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group btn-group-xs\" role=\"group\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"toHash()\"><i class=\"fa fa-angle-double-up\"></i> <span class=\"sr-only\">Top</span></button>\n" +
    "        <button class=\"btn btn-danger\" ng-if=\"isTab(2)\" ng-click=\"clear('sc')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear scoring conditions</span></button>\n" +
    "        <button class=\"btn btn-danger\" ng-if=\"isTab(1)\" ng-click=\"clear('aq')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear assets</span></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <button class=\"btn btn-warning left btn-xs\" aria-hidden=\"true\" ng-hide=\"minned\" ng-click=\"minned = true\"><i class=\"fa fa-minus\"></i></button>\n" +
    "  <button class=\"btn btn-info left btn-xs\" aria-hidden=\"true\" ng-show=\"minned\" ng-click=\"minned = false\"><i class=\"fa fa-plus\"></i></button>\n" +
    "</nav>\n" +
    "<div class=\"scoreboardWrapper\" id=\"scoreboard\">\n" +
    "  <div class=\"text-center scoreboard\">\n" +
    "    <h2>You&apos;ve earned <span class=\"score\">{{score | number : 0}}</span> influence.</h2>\n" +
    "  </div>\n" +
    "  <div class='text-center vspace' ng-hide=\"isTab(0)\">\n" +
    "    <label>Raw influence</label>\n" +
    "    <div class=\"input-group input-group-sm inf\">\n" +
    "      <span class=\"input-group-btn\" ng-click=\"increment($index, 'inf')\"><button class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button></span>\n" +
    "      <input accept=\"text/html\" type=\"number\" min=\"0\" ng-model=\"inf\" class=\"form-control\" ng-change=\"calculateScore()\">\n" +
    "      <span class=\"input-group-btn\"><button class=\"btn btn-warning\" ng-click=\"decrement($index, 'inf')\" ><i class=\"fa fa-minus\"></i></button></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"contents\">\n" +
    "  <div heading=\"Help\" ng-show=\"tab === 0\">\n" +
    "    <div class=\"help\">\n" +
    "      <img src=\"assets/images/banner.png\" alt='Eminient Domain Microcosm scoresheet' class='center-block' width=\"250px\">\n" +
    "      <h1 class=\"indent\"><i class=\"fa fa-support\"></i> Help</h1>\n" +
    "      <p>This application is intended to make the scoring of the card game Eminent Domain: Michrochosm easier.</p>\n" +
    "      <p>You should approach use of this app in three steps after having completed your game:</p>\n" +
    "      <ol>\n" +
    "        <li>\n" +
    "          <p>Enter the <strong>icons, colonies, and spoils</strong> you\"ve collected on the <strong>icons</strong> tab.</p>\n" +
    "          <p>This includes things like how many colonies you gained, how many red planets you have, etc.\n" +
    "          It does not include things like the \"1 influence per colony\" that your cards show in the top right.\n" +
    "          These are counted in the next step.</p>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <p>Enter the  <strong>scoring conditions</strong> shown on your cards on the <strong>conditions</strong> tab.</p>\n" +
    "          <p>This includes things like \"1 influence per capital\" and \"1 influence per red planet.\" These should be on the upper right corner of your cards.</p>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <p>Enter any raw influence granted by cards you control.</p>\n" +
    "        </li>\n" +
    "      </ol>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div heading=\"Assets\" ng-show=\"tab === 1\">\n" +
    "    <button class=\"btn btn-danger btn-sm pull-right indent\" ng-click=\"clear('aq')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear assets</span></button>\n" +
    "    <h1 class=\"indent\"><i class=\"fa fa-trophy\"></i> Assets acquired</h1>\n" +
    "    <div class=\"container\">\n" +
    "      <div ng-repeat=\"icon in sets\" class=\"{{gridClasses}} griditem\">\n" +
    "        <div class=\"itemWrapper\">\n" +
    "          <button ng-click=\"increment($index,'aq')\" class=\"btn btn-default gridbtn {{icon.name}}\">\n" +
    "            <div><i class=\"fa fa-{{icon.symbol}}\"></i> <span>{{icon.name}}</span> acquired</div>\n" +
    "          </button>\n" +
    "          <div class=\"input-group-sm input-group\">\n" +
    "            <span class=\"input-group-btn\"><button class=\"btn btn-warning\" ng-click=\"decrement($index, 'aq')\" ><i class=\"fa fa-minus\"></i></button></span>\n" +
    "            <input accept=\"text/html\" type=\"number\" min=\"0\" ng-model=\"icon.aqCount\" class=\"form-control\" ng-change=\"calculateScore()\">\n" +
    "            <span class=\"input-group-btn\" ng-click=\"increment($index, 'aq')\"><button class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button></span>\n" +
    "          </div>\n" +
    "          <div class=\"btn-group-xs btn-group\">\n" +
    "            <button class=\"btn btn-default\"  ng-click=\"zero($index, 'aq')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear assets</span></button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"toHash('scoreboard')\"><i class=\"fa fa-angle-double-up\"></i> <span class=\"sr-only\">Top</span></button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div heading=\"Conditions\" ng-show=\"tab === 2\" class=\"co\">\n" +
    "    <button class=\"btn btn-danger btn-sm pull-right indent\" ng-click=\"clear('sc')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear scoring conditions</span></button>\n" +
    "    <h1 class=\"indent\"><i class=\"fa fa-tachometer\"></i> Scoring conditions</h1>\n" +
    "    <div class=\"container\">\n" +
    "      <div ng-repeat=\"icon in sets\" class=\"{{gridClasses}} griditem\">\n" +
    "        <div class=\"itemWrapper\">\n" +
    "          <button ng-click=\"increment($index, 'sc')\" class=\"btn btn-default gridbtn {{icon.name}}\">\n" +
    "            <div><i class=\"fa fa-tachometer\"></i> <span>{{icon.name}}</span></div>\n" +
    "          </button>\n" +
    "          <div class=\"input-group-sm input-group\">\n" +
    "            <span class=\"input-group-btn\"><button class=\"btn btn-warning\" ng-click=\"decrement($index, 'sc')\" ><i class=\"fa fa-minus\"></i></button></span>\n" +
    "            <input accept=\"text/html\" type=\"number\" min=\"0\" ng-model=\"icon.scCount\" class=\"form-control\" ng-change=\"calculateScore()\">\n" +
    "            <span class=\"input-group-btn\" ng-click=\"increment($index,'sc')\"><button class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button></span>\n" +
    "          </div>\n" +
    "          <div class=\"btn-group-xs btn-group\">\n" +
    "            <button class=\"btn btn-default\"  ng-click=\"zero($index, 'sc')\"><i class=\"fa fa-trash\"></i><span class=\"sr-only\">clear {{icon.name}}</span></button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"toHash('scoreboard')\"><i class=\"fa fa-angle-double-up\"></i> <span class=\"sr-only\">Top</span></button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

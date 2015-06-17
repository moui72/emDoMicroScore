/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * 'src/app/home', however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a 'note' section could have the submodules 'note.create',
 * 'note.delete', 'note.edit', etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 */
(function(module) {

  // As you add controllers to a module and they grow in size, feel free to place them in their own files.
  //  Let each module grow organically, adding appropriate organization and sub-folders as needed.
  module.controller('HomeController', ['$scope', '$location', '$anchorScroll', '$confirm', function($scope, $location, $anchorScroll, $confirm) {
    // The top section of a controller should be lean and make it easy to see the "signature" of the controller
    //  at a glance.  All function definitions should be contained lower down.
    var model = this;

    $scope.sets = [
      {name: 'colonies', symbol: 'globe', aqCount: 0, scCount: 0},
      {name: 'spoils', symbol: 'database', aqCount: 0, scCount: 0},
      {name: 'capitals', symbol: 'university', aqCount: 0, scCount: 0},
      {name: 'techs', symbol: 'lightbulb-o', aqCount: 0, scCount: 0},
      {name: 'red', symbol: 'adjust', aqCount: 0, scCount: 0},
      {name: 'yellow', symbol: 'adjust', aqCount: 0, scCount: 0},
      {name: 'green', symbol: 'adjust', aqCount: 0, scCount: 0},
      {name: 'purple', symbol: 'adjust', aqCount: 0, scCount: 0}
    ];

    $scope.gridClasses = 'col-lg-3 col-md-4 col-sm-4 col-xs-6';
    $scope.score = 0;
    $scope.inf = 0;
    $scope.increment = increment;
    $scope.decrement = decrement;
    $scope.zero = zero;
    $scope.calculateScore = calculateScore;
    $scope.pageTitle = 'EmDO Microcosm Scoring';
    $scope.tab = 0;
    $scope.setTab = setTab;
    $scope.isTab = isTab;
    $scope.minned = false;
    $scope.toHash = toHash;
    $scope.clear = clear;

    init();

    function init() {
      // A definitive place to put everything that needs to run when the controller starts. Avoid
      //  writing any code outside of this function that executes immediately.
    }

    function toHash(hash) {
      hash = hash || 'scoreboard';
      $location.hash(hash);
      $anchorScroll();
    }

    function setTab(n) {
      $scope.tab = n;

      return n;
    }

    function isTab(n){
      return $scope.tab === n;
    }

    function calculateScore() {
      console.log('calculating');
      var score = 0;
      $scope.sets.forEach(function(val, index, array) {
        var chunk = array[index].aqCount * array[index].scCount;
        if (chunk > 0) {
          score += chunk;
        }
      });
      if ($scope.inf > 0) {
        score += $scope.inf;
      }
      $scope.score = score;

      return score;
    }

    function increment(index, type) {
      if(type === 'inf') {
        $scope.inf += 1;
        $scope.score = calculateScore();
        return $scope.inf;
      }
      console.log('increasing '+index);
      $scope.sets[index][type + 'Count'] += 1;
      if ($scope.sets[index][type + 'Count'] < 0) {
        $scope.sets[index][type + 'Count'] = 0;
      }
      $scope.score = calculateScore();

      return $scope.sets;
    }

    function decrement(index, type) {
      if (type === 'inf') {
        $scope.inf -= 1;
        if ($scope.inf < 0) {
          $scope.inf = 0;
        }
        $scope.score = calculateScore();

        return $scope.inf;
      }
      console.log('decreasing '+index);
      $scope.sets[index][type + 'Count'] -= 1;
      if ($scope.sets[index][type + 'Count'] < 0) {
        $scope.sets[index][type + 'Count'] = 0;
      }
      $scope.score = calculateScore();

      return $scope.sets;
    }

    function zero(index, type) {
      console.log('clearing '+index);
      $scope.sets[index][type + 'Count'] = 0;
      $scope.score = calculateScore();
      $scope.score = calculateScore();

      return $scope.sets;
    }

    function clear(type) {
      var items = 'assets';
      if (type === 'sc') {
        items = 'scoring conditions';
      }

      $confirm({text: 'Are you sure you want to clear all ' + items + '?'})
        .then(function() {
          console.log('clearing ' + items);
          $scope.sets.forEach(function(val, index, array) {
            array[index][type + 'Count'] =  0;
          });

          return true;
        });

      return false;

    }

    function confirmed() {
      var confirm = false;
    }

}]);

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module('emDoScore.home')));

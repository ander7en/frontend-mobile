angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('tabsController', {
    url: '',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.bookATrip', {
    url: '/booking',
    views: {
      'tab5': {
        templateUrl: 'templates/bookATrip.html',
        controller: 'bookATripCtrl'
      }
    }
  })

    .state('tabsController.aboutTeam', {
      url: '/page3',
      views: {
        'tab2': {
          templateUrl: 'templates/aboutTeam.html',
          controller: 'aboutTeamCtrl'
        }
      }
    })

$urlRouterProvider.otherwise('booking')



});

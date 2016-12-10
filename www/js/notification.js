'use strict';

/**
 * @ngdoc function
 * @name app.controller:NotificationCtrl
 * @description
 * # NotificationCtrl
 * Controller of the app
 */
angular.module('app')
  .controller('NotificationCtrl', function ($scope, NotificationService) {
    $scope.alerts = NotificationService.alerts;

    $scope.closeAlert = NotificationService.closeAlert;
  });

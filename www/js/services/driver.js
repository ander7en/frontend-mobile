'use strict';

/**
 * @ngdoc service
 * @name app.driver
 * @description
 * # driver
 * Service in the app.
 */
angular.module('app')
  .service('DriverService', DriverService);


function DriverService($http) {
  var driverServiceURL = 'https://taxi-backend.herokuapp.com' + '/drivers';
  this.loadDrivers = function (srcLocation) {
    return $http.get(driverServiceURL, {params: {lat: srcLocation.latitude, lng: srcLocation.longitude}});
  }
}

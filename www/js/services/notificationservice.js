'use strict';

/**
 * @ngdoc service
 * @name app.NotificationService
 * @description
 * # NotificationService
 * Service in the app.
 */
angular.module('app')
  .service('NotificationService', function () {
    var self = this;
    this.alerts = [];

    this.addAlert = function(alert) {
      self.alerts.push(alert);
    };

    this.closeAlert = function(index) {
      self.alerts.splice(index, 1);
    };
  });

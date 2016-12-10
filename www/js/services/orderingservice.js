'use strict';

/**
 * @ngdoc service
 * @name app.OrderingService
 * @description
 * # OrderingService
 * Service in the app.
 */
angular.module('app')
  .service('OrderingService', function (localStorageService) {
    var self = this;
    this.unfinishedOrderExits = false;
    this.unfinishedOrder = {};
    this.currentOrder = {finished: false, origin: 'noAddress', destination: 'noAddress'};

    this.getUnfinishedOrder = function () {
      return JSON.parse(localStorageService.get('unfinishedOrder'), function (key, value) {
        if (key == 'lat' || key == 'lng') {
          return function () {
            return value;
          }
        } else {
          return value
        }
      });
    };

    init();
    function init() {
      if (localStorageService.get('unfinishedOrder') != undefined) {
        self.unfinishedOrder = self.getUnfinishedOrder();
        self.unfinishedOrderExits = true;
      }
    }

    this.changeDestination = function (destination) {
      self.currentOrder.destination = destination;
      self.unfinishedOrder = self.currentOrder;
      self.saveUnfinishedOrder();
    };

    this.changePickup = function (origin) {
      self.currentOrder.origin = origin;
      self.unfinishedOrder = self.currentOrder;
      self.saveUnfinishedOrder();
    };

    this.deleteCurrentOrder = function () {
      self.currentOrder = {};
      self.unfinishedOrder = self.currentOrder;
      self.deleteUnfinishedOrder();
    };

    this.deleteUnfinishedOrder = function () {
      self.unfinishedOrder = {};
      localStorageService.remove('unfinishedOrder')
    };

    this.finishCurrentOrder = function () {
      self.currentOrder.finished = true;
      self.unfinishedOrder = {};
      self.deleteUnfinishedOrder();
    };

    this.saveUnfinishedOrder = function () {
      localStorageService.set('unfinishedOrder', JSON.stringify(self.unfinishedOrder));
    }
  });


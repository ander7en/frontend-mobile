angular.module('app.controllers', [])

  .controller('bookATripCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('MapCtrl', MapCtrl);


/* @ngInject */
function MapCtrl($rootScope, $scope, NgMap, $timeout, BookingService, OrderingService, DriverService) {

  var vm = this;
  // Data
  vm.map = undefined;
  vm.distance = undefined;
  vm.duration = undefined;
  vm.pickupAddress = undefined;
  vm.destinationAddress = undefined;
  vm.pickupLocation = undefined;
  vm.destinationLocation = undefined;
  vm.arrivalTime = undefined;
  $rootScope.bookingProc = false;

  // Methods
  vm.destinationPlaceChanged = destinationPlaceChanged;
  vm.pickupPlaceChanged = pickupPlaceChanged;
  vm.updateRouteInfo = updateRouteInfo;
  vm.submit = submit;
  vm.loadMarkers = loadMarkers;
  //////////
  init();

  function init() {
    NgMap.getMap().then(function (map) {
      vm.map = map;
    }).then(function () {
      if (OrderingService.unfinishedOrderExits) {
        vm.pickupLocation = OrderingService.unfinishedOrder.origin;
        locationToPlace(vm.pickupLocation);
        vm.destinationLocation = OrderingService.unfinishedOrder.destination;
        if (vm.destinationLocation != "noAddress") {
          locationToPlace(vm.destinationLocation, true);
        }
        loadDrivers(vm.pickupLocation);
      } else {
        NgMap.getGeoLocation().then(function (location) {
          locationToPlace(location);
          loadDrivers(location);
        });
      }
    });

  }

  function loadDrivers(l) {
    DriverService.loadDrivers({latitude: l.lat(), longitude: l.lng()})
      .then(function (response) {
        // success callback
        console.log(response);
        loadMarkers(response.data['drivers']);
      }, function (response) {
        //error callback
        console.log('Error: ', response)
      });
  }

  function loadMarkers(drivers) {
    console.log(drivers);
    vm.image = {
      url: 'img/taxi-pin.png',
      size: [32, 32],
      origin: [0, 0],
      anchor: [0, 32]
    };
    vm.shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };

    var driver_pis = [];
    var i = 0;
    var d;
    for (d in drivers) {
      var dr = drivers[d];
      driver_pis.push([dr['car_info'], dr['ltd'], dr['lng'], drivers.length - i]);
      i++;
    }

    console.log(driver_pis);

    vm.drivers = driver_pis;

  }

  function updateRouteInfo() {
    if (vm.pickupLocation && vm.destinationLocation) {
      $timeout(function () {
        vm.distance = vm.map.directionsRenderers[0].directions.routes[0].legs[0].distance.text;
        vm.duration = vm.map.directionsRenderers[0].directions.routes[0].legs[0].duration.text;
      }, 200);
    }
  }

  // Listener on Destination location change
  function destinationPlaceChanged() {
    vm.destinationLocation = this.getPlace().geometry.location;
    OrderingService.changeDestination(vm.destinationLocation);
    vm.map.setCenter(vm.destinationLocation);
    updateRouteInfo();
  }

  function locationToPlace(location, forDestinationPlace) {
    var forDestinationPlace = forDestinationPlace || false;
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(location.lat(), location.lng());
    geocoder.geocode({'latLng': latlng}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // document.getElementById('pickupLocation').value = results[0].formatted_address
          if (forDestinationPlace) {
            vm.destinationAddress = results[0].formatted_address;
            vm.destinationLocation = latlng;
            $scope.$apply();
            OrderingService.changeDestination(vm.destinationLocation);
          } else {
            vm.pickupAddress = results[0].formatted_address;
            vm.pickupLocation = latlng;
            $scope.$apply();
            OrderingService.changePickup(vm.pickupLocation);
          }
        } else {
          element.text('Location not found');
        }
      } else {
        element.text('Geocoder failed due to: ' + status);
      }
    });
  }

  // Listener on Pickup location change
  function pickupPlaceChanged() {
    vm.pickupLocation = this.getPlace().geometry.location;
    vm.map.setCenter(vm.pickupLocation);
    updateRouteInfo();
  }

  function submit(valid) {
    if (valid) {
      $rootScope.bookingProc = true;
      // $scope.$digest();

      setTimeout(function () {
        BookingService.book(vm.pickupLocation, vm.destinationLocation)
          .then(function (response) {
            // success callback
            $rootScope.bookingProc = false;
            console.log(response);
            return response
          }, function (response) {
            //error callback
            console.log('Error: ', response)
          }).then(function () {
          OrderingService.finishCurrentOrder();
        })
      }, 5000);
    } else {
      console.log("Form NOt Valid")
    }
  }
}

angular.module('keepUp').controller('HomeCtrl', function($scope, EventSvc) {
    EventSvc.getEvents()
        .then(function(response) {
            $scope.events = response.data;
            console.log(response.data);
        })
});
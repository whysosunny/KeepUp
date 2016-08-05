angular.module('keepUp').controller('EventsCtrl', function($scope, EventSvc) {
    $scope.createEvent = function(evt) {
        console.log(evt);
        EventSvc.addEvent(evt)
            .then(function(response) {
                console.log(response);
            }, function(error) {
                console.log(error);
            });
    };

    
});
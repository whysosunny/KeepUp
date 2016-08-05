angular.module('keepUp').controller('HomeCtrl', function($scope, EventSvc) {
    EventSvc.getEvents()
        .then(function(response) {
            $scope.events = response.data;
            console.log($scope.events);
            $scope.events.forEach(function(event) {
                event.created = moment(event.created).fromNow();
                event.date = moment(event.dateTime).format('MM/DD')
                event.day = moment(event.dateTime).format('dddd');
                event.time = moment(event.dateTime).format('hh:mm A');
                event.minutes = moment(event.dateTime).minutes();
            });

        })
});
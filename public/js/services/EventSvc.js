angular.module('keepUp').service('EventSvc', function($http) {
    var svc = this;

    svc.addEvent = function(evt) {
        return $http.post('/api/events', {
            title: evt.title,
            description: evt.description,
            location: evt.location,
            dateTime: evt.dateTime,
            created: Date.now()
        });
    };
    
    svc.getEvents = function() {
        return $http.get('/api/events')
    }
    
});
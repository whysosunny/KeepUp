angular.module('keepUp', ['ngRoute','ngMessages']);
angular.module('keepUp').config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/login', {
            templateUrl: './views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: './views/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/addEvent', {
            templateUrl: './views/addEvent.html',
            controller: 'EventsCtrl'
        })
        .otherwise('/');
}]);


angular.module('keepUp').controller('AppCtrl', ["$scope", "$http", "LoginSvc", "$location", function($scope, $http, LoginSvc, $location) {

    if(window.localStorage.token) {
        $http.defaults.headers.common['x-auth'] = window.localStorage.token;
        LoginSvc.getUser()
            .then(function(response) {
                $scope.currentUser = response.data;
            });
    }

    $scope.$on('login', function(_, user) {
        $location.path('/');
        $scope.currentUser = user;
    });
    
    $scope.logout = function() {
        $scope.currentUser = null;
        window.localStorage.removeItem('token');
        LoginSvc.logout();
    }
}]);
angular.module('keepUp').controller('EventsCtrl', ["$scope", "EventSvc", function($scope, EventSvc) {
    $scope.createEvent = function(evt) {
        EventSvc.addEvent(evt)
            .then(function(response) {
                console.log(response);
            }, function(error) {
                console.log(error);
            });
    };

    
}]);
angular.module('keepUp').controller('HomeCtrl', ["$scope", "EventSvc", function($scope, EventSvc) {
    EventSvc.getEvents()
        .then(function(response) {
            $scope.events = response.data;
            console.log(response.data);
        })
}]);
angular.module('keepUp').controller('LoginCtrl', ["$scope", "LoginSvc", function($scope,LoginSvc) {
    $scope.login = function(username,password) {
        LoginSvc.login(username,password)
            .then(function(response) {
                if(response.status === 401) {
                    $scope.loginError = response.statusText;
                } else {
                    $scope.$emit('login', response.data);
                }
            });
    }
}]);
angular.module('keepUp').controller('SignupCtrl', ["$scope", "SignupSvc", function($scope, SignupSvc) {
    $scope.signup = function(firstName, lastName, username, password,repeatPassword) {
        if(password === repeatPassword) {
            console.log(password);
            SignupSvc.signup(firstName,lastName,username,password)
                .then(function(response) {
                    console.log(response);
                });    
        } else {
            //Handle passwords don't match
            console.log("Passwords don't match!");
        }
        
    }
}]);
angular.module('keepUp').service('EventSvc', ["$http", function($http) {
    var svc = this;

    svc.addEvent = function(evt) {
        return $http.post('/api/events', {
            title: evt.title,
            description: evt.description,
            location: evt.location,
            dateTime: evt.dateTime
        });
    };
    
    svc.getEvents = function() {
        return $http.get('/api/events')
    }
    
}]);
angular.module('keepUp').service('LoginSvc', ["$http", function($http) {
    var svc = this;
    svc.getUser = function() {
        return $http.get('/api/users');
    };
    svc.login = function(username,password) {
        return $http.post('/api/sessions', {
            username: username,
            password: password
        }).then(function(val) {
            // svc.token = val.data;
            window.localStorage.token = val.data;
            $http.defaults.headers.common['x-auth'] = window.localStorage.token;
            return svc.getUser();
        }, function(err) {
            return err;
        });
    };
    svc.logout = function() {
        $http.defaults.headers.common['x-auth'] = undefined;
    }
}]);
angular.module('keepUp').service('SignupSvc', ["$http", function($http) {
    var svc = this;
    svc.signup = function(firstName,lastName, username, password) {
        return $http.post('/api/users', {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password
        });
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwiY29udHJvbGxlcnMvQXBwQ3RybC5qcyIsImNvbnRyb2xsZXJzL0V2ZW50c0N0cmwuanMiLCJjb250cm9sbGVycy9Ib21lQ3RybC5qcyIsImNvbnRyb2xsZXJzL0xvZ2luQ3RybC5qcyIsImNvbnRyb2xsZXJzL1NpZ251cEN0cmwuanMiLCJzZXJ2aWNlcy9FdmVudFN2Yy5qcyIsInNlcnZpY2VzL0xvZ2luU3ZjLmpzIiwic2VydmljZXMvU2lnbnVwU3ZjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQUEsT0FBQSxVQUFBLENBQUEsVUFBQTtBQ0FBLFFBQUEsT0FBQSxVQUFBLDBCQUFBLFNBQUEsZ0JBQUE7SUFDQTtTQUNBLEtBQUEsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsV0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsYUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLFVBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBLFVBQUEsV0FBQSx3REFBQSxTQUFBLFFBQUEsT0FBQSxVQUFBLFdBQUE7O0lBRUEsR0FBQSxPQUFBLGFBQUEsT0FBQTtRQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGFBQUE7UUFDQSxTQUFBO2FBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsT0FBQSxjQUFBLFNBQUE7Ozs7SUFJQSxPQUFBLElBQUEsU0FBQSxTQUFBLEdBQUEsTUFBQTtRQUNBLFVBQUEsS0FBQTtRQUNBLE9BQUEsY0FBQTs7O0lBR0EsT0FBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLGNBQUE7UUFDQSxPQUFBLGFBQUEsV0FBQTtRQUNBLFNBQUE7OztBQ2xCQSxRQUFBLE9BQUEsVUFBQSxXQUFBLHFDQUFBLFNBQUEsUUFBQSxVQUFBO0lBQ0EsT0FBQSxjQUFBLFNBQUEsS0FBQTtRQUNBLFNBQUEsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQTtlQUNBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7OztBQ05BLFFBQUEsT0FBQSxVQUFBLFdBQUEsbUNBQUEsU0FBQSxRQUFBLFVBQUE7SUFDQSxTQUFBO1NBQ0EsS0FBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLFNBQUEsU0FBQTtZQUNBLFFBQUEsSUFBQSxTQUFBOzs7QUNKQSxRQUFBLE9BQUEsVUFBQSxXQUFBLG9DQUFBLFNBQUEsT0FBQSxVQUFBO0lBQ0EsT0FBQSxRQUFBLFNBQUEsU0FBQSxVQUFBO1FBQ0EsU0FBQSxNQUFBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFNBQUEsV0FBQSxLQUFBO29CQUNBLE9BQUEsYUFBQSxTQUFBO3VCQUNBO29CQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7Ozs7O0FDUEEsUUFBQSxPQUFBLFVBQUEsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsV0FBQTtJQUNBLE9BQUEsU0FBQSxTQUFBLFdBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUE7UUFDQSxHQUFBLGFBQUEsZ0JBQUE7WUFDQSxRQUFBLElBQUE7WUFDQSxVQUFBLE9BQUEsVUFBQSxTQUFBLFNBQUE7aUJBQ0EsS0FBQSxTQUFBLFVBQUE7b0JBQ0EsUUFBQSxJQUFBOztlQUVBOztZQUVBLFFBQUEsSUFBQTs7Ozs7QUNWQSxRQUFBLE9BQUEsVUFBQSxRQUFBLHNCQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsTUFBQTs7SUFFQSxJQUFBLFdBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsZUFBQTtZQUNBLE9BQUEsSUFBQTtZQUNBLGFBQUEsSUFBQTtZQUNBLFVBQUEsSUFBQTtZQUNBLFVBQUEsSUFBQTs7OztJQUlBLElBQUEsWUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7Ozs7QUNiQSxRQUFBLE9BQUEsVUFBQSxRQUFBLHNCQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsaUJBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTtXQUNBLEtBQUEsU0FBQSxLQUFBOztZQUVBLE9BQUEsYUFBQSxRQUFBLElBQUE7WUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxhQUFBO1lBQ0EsT0FBQSxJQUFBO1dBQ0EsU0FBQSxLQUFBO1lBQ0EsT0FBQTs7O0lBR0EsSUFBQSxTQUFBLFdBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUE7OztBQ25CQSxRQUFBLE9BQUEsVUFBQSxRQUFBLHVCQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsU0FBQSxTQUFBLFVBQUEsVUFBQSxVQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxjQUFBO1lBQ0EsVUFBQTtZQUNBLFdBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7O0lBR0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnLCBbJ25nUm91dGUnLCduZ01lc3NhZ2VzJ10pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2xvZ2luJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9zaWdudXAnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc2lnbnVwLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZ251cEN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvYWRkRXZlbnQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWRkRXZlbnQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRzQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLm90aGVyd2lzZSgnLycpO1xufSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgTG9naW5TdmMsICRsb2NhdGlvbikge1xuXG4gICAgaWYod2luZG93LmxvY2FsU3RvcmFnZS50b2tlbikge1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xuICAgICAgICBMb2dpblN2Yy5nZXRVc2VyKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH0pO1xuICAgIFxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xuICAgICAgICBMb2dpblN2Yy5sb2dvdXQoKTtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignRXZlbnRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXZlbnRTdmMpIHtcbiAgICAkc2NvcGUuY3JlYXRlRXZlbnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgRXZlbnRTdmMuYWRkRXZlbnQoZXZ0KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXZlbnRTdmMpIHtcbiAgICBFdmVudFN2Yy5nZXRFdmVudHMoKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSlcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsTG9naW5TdmMpIHtcbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCkge1xuICAgICAgICBMb2dpblN2Yy5sb2dpbih1c2VybmFtZSxwYXNzd29yZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvZ2luRXJyb3IgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgU2lnbnVwU3ZjKSB7XG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKGZpcnN0TmFtZSwgbGFzdE5hbWUsIHVzZXJuYW1lLCBwYXNzd29yZCxyZXBlYXRQYXNzd29yZCkge1xuICAgICAgICBpZihwYXNzd29yZCA9PT0gcmVwZWF0UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhc3N3b3JkKTtcbiAgICAgICAgICAgIFNpZ251cFN2Yy5zaWdudXAoZmlyc3ROYW1lLGxhc3ROYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL0hhbmRsZSBwYXNzd29yZHMgZG9uJ3QgbWF0Y2hcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoIVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnRXZlbnRTdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuXG4gICAgc3ZjLmFkZEV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2V2ZW50cycsIHtcbiAgICAgICAgICAgIHRpdGxlOiBldnQudGl0bGUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXZ0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgbG9jYXRpb246IGV2dC5sb2NhdGlvbixcbiAgICAgICAgICAgIGRhdGVUaW1lOiBldnQuZGF0ZVRpbWVcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBzdmMuZ2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvZXZlbnRzJylcbiAgICB9XG4gICAgXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnTG9naW5TdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuICAgIHN2Yy5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcnMnKTtcbiAgICB9O1xuICAgIHN2Yy5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb25zJywge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAvLyBzdmMudG9rZW4gPSB2YWwuZGF0YTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW4gPSB2YWwuZGF0YTtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW47XG4gICAgICAgICAgICByZXR1cm4gc3ZjLmdldFVzZXIoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHN2Yy5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gdW5kZWZpbmVkO1xuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdTaWdudXBTdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuICAgIHN2Yy5zaWdudXAgPSBmdW5jdGlvbihmaXJzdE5hbWUsbGFzdE5hbWUsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VycycsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIGZpcnN0TmFtZTogZmlyc3ROYW1lLFxuICAgICAgICAgICAgbGFzdE5hbWU6IGxhc3ROYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0pO1xuICAgIH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

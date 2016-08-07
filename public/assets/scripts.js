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
        console.log(evt);
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
            console.log($scope.events);
            $scope.events.forEach(function(event) {
                event.created = moment(event.created).fromNow();
                event.date = moment(event.dateTime).format('MM/DD')
                event.day = moment(event.dateTime).format('dddd');
                event.time = moment(event.dateTime).format('hh:mm A');
                event.minutes = moment(event.dateTime).minutes();
            });

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
            dateTime: evt.dateTime,
            created: Date.now()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwiY29udHJvbGxlcnMvQXBwQ3RybC5qcyIsImNvbnRyb2xsZXJzL0V2ZW50c0N0cmwuanMiLCJjb250cm9sbGVycy9Ib21lQ3RybC5qcyIsImNvbnRyb2xsZXJzL0xvZ2luQ3RybC5qcyIsImNvbnRyb2xsZXJzL1NpZ251cEN0cmwuanMiLCJzZXJ2aWNlcy9FdmVudFN2Yy5qcyIsInNlcnZpY2VzL0xvZ2luU3ZjLmpzIiwic2VydmljZXMvU2lnbnVwU3ZjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQUEsT0FBQSxVQUFBLENBQUEsVUFBQTtBQ0FBLFFBQUEsT0FBQSxVQUFBLDBCQUFBLFNBQUEsZ0JBQUE7SUFDQTtTQUNBLEtBQUEsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsV0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsYUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLFVBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBLFVBQUEsV0FBQSx3REFBQSxTQUFBLFFBQUEsT0FBQSxVQUFBLFdBQUE7O0lBRUEsR0FBQSxPQUFBLGFBQUEsT0FBQTtRQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGFBQUE7UUFDQSxTQUFBO2FBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsT0FBQSxjQUFBLFNBQUE7Ozs7SUFJQSxPQUFBLElBQUEsU0FBQSxTQUFBLEdBQUEsTUFBQTtRQUNBLFVBQUEsS0FBQTtRQUNBLE9BQUEsY0FBQTs7O0lBR0EsT0FBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLGNBQUE7UUFDQSxPQUFBLGFBQUEsV0FBQTtRQUNBLFNBQUE7OztBQ2xCQSxRQUFBLE9BQUEsVUFBQSxXQUFBLHFDQUFBLFNBQUEsUUFBQSxVQUFBO0lBQ0EsT0FBQSxjQUFBLFNBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQTtRQUNBLFNBQUEsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQTtlQUNBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7OztBQ1BBLFFBQUEsT0FBQSxVQUFBLFdBQUEsbUNBQUEsU0FBQSxRQUFBLFVBQUE7SUFDQSxTQUFBO1NBQ0EsS0FBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLFNBQUEsU0FBQTtZQUNBLFFBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsU0FBQSxPQUFBO2dCQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsU0FBQTtnQkFDQSxNQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLFVBQUE7Ozs7O0FDVkEsUUFBQSxPQUFBLFVBQUEsV0FBQSxvQ0FBQSxTQUFBLE9BQUEsVUFBQTtJQUNBLE9BQUEsUUFBQSxTQUFBLFNBQUEsVUFBQTtRQUNBLFNBQUEsTUFBQSxTQUFBO2FBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxTQUFBLFdBQUEsS0FBQTtvQkFDQSxPQUFBLGFBQUEsU0FBQTt1QkFDQTtvQkFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7OztBQ1BBLFFBQUEsT0FBQSxVQUFBLFdBQUEsc0NBQUEsU0FBQSxRQUFBLFdBQUE7SUFDQSxPQUFBLFNBQUEsU0FBQSxXQUFBLFVBQUEsVUFBQSxTQUFBLGdCQUFBO1FBQ0EsR0FBQSxhQUFBLGdCQUFBO1lBQ0EsUUFBQSxJQUFBO1lBQ0EsVUFBQSxPQUFBLFVBQUEsU0FBQSxTQUFBO2lCQUNBLEtBQUEsU0FBQSxVQUFBO29CQUNBLFFBQUEsSUFBQTs7ZUFFQTs7WUFFQSxRQUFBLElBQUE7Ozs7O0FDVkEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7O0lBRUEsSUFBQSxXQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGVBQUE7WUFDQSxPQUFBLElBQUE7WUFDQSxhQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxTQUFBLEtBQUE7Ozs7SUFJQSxJQUFBLFlBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7O0FDZEEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGlCQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7V0FDQSxLQUFBLFNBQUEsS0FBQTs7WUFFQSxPQUFBLGFBQUEsUUFBQSxJQUFBO1lBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsYUFBQTtZQUNBLE9BQUEsSUFBQTtXQUNBLFNBQUEsS0FBQTtZQUNBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxXQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7QUNuQkEsUUFBQSxPQUFBLFVBQUEsUUFBQSx1QkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFNBQUEsU0FBQSxVQUFBLFVBQUEsVUFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7OztJQUdBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJywgWyduZ1JvdXRlJywnbmdNZXNzYWdlcyddKTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3NpZ251cC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2FkZEV2ZW50Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2FkZEV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0N0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbn0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignQXBwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIExvZ2luU3ZjLCAkbG9jYXRpb24pIHtcblxuICAgIGlmKHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW4pIHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbjtcbiAgICAgICAgTG9naW5TdmMuZ2V0VXNlcigpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKF8sIHVzZXIpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9KTtcbiAgICBcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcbiAgICAgICAgTG9naW5TdmMubG9nb3V0KCk7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0V2ZW50c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV2ZW50U3ZjKSB7XG4gICAgJHNjb3BlLmNyZWF0ZUV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIEV2ZW50U3ZjLmFkZEV2ZW50KGV2dClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV2ZW50U3ZjKSB7XG4gICAgRXZlbnRTdmMuZ2V0RXZlbnRzKClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmV2ZW50cyk7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5jcmVhdGVkID0gbW9tZW50KGV2ZW50LmNyZWF0ZWQpLmZyb21Ob3coKTtcbiAgICAgICAgICAgICAgICBldmVudC5kYXRlID0gbW9tZW50KGV2ZW50LmRhdGVUaW1lKS5mb3JtYXQoJ01NL0REJylcbiAgICAgICAgICAgICAgICBldmVudC5kYXkgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLmZvcm1hdCgnZGRkZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnRpbWUgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLmZvcm1hdCgnaGg6bW0gQScpO1xuICAgICAgICAgICAgICAgIGV2ZW50Lm1pbnV0ZXMgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLm1pbnV0ZXMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLExvZ2luU3ZjKSB7XG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpIHtcbiAgICAgICAgTG9naW5TdmMubG9naW4odXNlcm5hbWUscGFzc3dvcmQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2dpbkVycm9yID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ1NpZ251cEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFNpZ251cFN2Yykge1xuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbihmaXJzdE5hbWUsIGxhc3ROYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQscmVwZWF0UGFzc3dvcmQpIHtcbiAgICAgICAgaWYocGFzc3dvcmQgPT09IHJlcGVhdFBhc3N3b3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYXNzd29yZCk7XG4gICAgICAgICAgICBTaWdudXBTdmMuc2lnbnVwKGZpcnN0TmFtZSxsYXN0TmFtZSx1c2VybmFtZSxwYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9IYW5kbGUgcGFzc3dvcmRzIGRvbid0IG1hdGNoXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ0V2ZW50U3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcblxuICAgIHN2Yy5hZGRFdmVudCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9ldmVudHMnLCB7XG4gICAgICAgICAgICB0aXRsZTogZXZ0LnRpdGxlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGV2dC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGxvY2F0aW9uOiBldnQubG9jYXRpb24sXG4gICAgICAgICAgICBkYXRlVGltZTogZXZ0LmRhdGVUaW1lLFxuICAgICAgICAgICAgY3JlYXRlZDogRGF0ZS5ub3coKVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHN2Yy5nZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9ldmVudHMnKVxuICAgIH1cbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdMb2dpblN2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIHN2YyA9IHRoaXM7XG4gICAgc3ZjLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpO1xuICAgIH07XG4gICAgc3ZjLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2Vzc2lvbnMnLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIC8vIHN2Yy50b2tlbiA9IHZhbC5kYXRhO1xuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbiA9IHZhbC5kYXRhO1xuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbjtcbiAgICAgICAgICAgIHJldHVybiBzdmMuZ2V0VXNlcigpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgc3ZjLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB1bmRlZmluZWQ7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ1NpZ251cFN2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIHN2YyA9IHRoaXM7XG4gICAgc3ZjLnNpZ251cCA9IGZ1bmN0aW9uKGZpcnN0TmFtZSxsYXN0TmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXJzJywge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgZmlyc3ROYW1lOiBmaXJzdE5hbWUsXG4gICAgICAgICAgICBsYXN0TmFtZTogbGFzdE5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

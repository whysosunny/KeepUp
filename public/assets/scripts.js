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

    if(window.localStorage.loggedIn) {
        LoginSvc.getUser()
            .then(function(response) {
                $scope.currentUser = response.data;
            });
    }


    $scope.$on('login', function(_, user) {
        window.localStorage.loggedIn = true;
        $location.path('/');
        $scope.currentUser = user;
    });
    
    $scope.logout = function() {
        window.localStorage.removeItem('loggedIn');
        $scope.currentUser = null;
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
    EventSvc.getEvents().then(function(response) {
            $scope.events = response.data;
            $scope.events.forEach(function(event) {
                event.created = moment(event.created).fromNow();
                event.date = moment(event.dateTime).format('MM/DD')
                event.day = moment(event.dateTime).format('dddd');
                event.time = moment(event.dateTime).format('hh:mm A');
                event.minutes = moment(event.dateTime).minutes();
            });
    });
}]);
angular.module('keepUp').controller('LoginCtrl', ["$scope", "LoginSvc", function($scope,LoginSvc) {
    $scope.login = function(username,password) {
        LoginSvc.login(username,password)
            .then(function(response) {
                if(response.status === 401) {
                    $scope.loginError = response.statusText;
                } else {
                    $scope.$emit('login', response);
                }
            });
    }
}]);
angular.module('keepUp').controller('SignupCtrl', ["$scope", "SignupSvc", "$location", function($scope, SignupSvc, $location) {
    $scope.signup = function(firstName, lastName, username, password,repeatPassword) {
        if(password === repeatPassword) {
            SignupSvc.signup(firstName,lastName,username,password)
                .then(function(response) {
                    $scope.$emit('login', response.data);
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
        return $http.post('/login', {
            username: username,
            password: password
        }).then(function(val) {
            return val.data;
        }, function(err) {
            return err;
        });
    };
    svc.logout = function() {
        $http.get('/logout').then(function(){
            console.log("Logged out!");
        });
    }
}]);
angular.module('keepUp').service('LogoutSvc', ["$http", function($http) {
    var svc = this;
    this.logout = $http.get('/logout')
        .then(function() {
            console.log("logged out!");
        });
}]);
angular.module('keepUp').service('SignupSvc', ["$http", function($http) {
    var svc = this;
    svc.signup = function(firstName,lastName, username, password) {
        return $http.post('/signup', {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password
        });
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwiY29udHJvbGxlcnMvQXBwQ3RybC5qcyIsImNvbnRyb2xsZXJzL0V2ZW50c0N0cmwuanMiLCJjb250cm9sbGVycy9Ib21lQ3RybC5qcyIsImNvbnRyb2xsZXJzL0xvZ2luQ3RybC5qcyIsImNvbnRyb2xsZXJzL1NpZ251cEN0cmwuanMiLCJzZXJ2aWNlcy9FdmVudFN2Yy5qcyIsInNlcnZpY2VzL0xvZ2luU3ZjLmpzIiwic2VydmljZXMvTG9nb3V0U3ZjLmpzIiwic2VydmljZXMvU2lnbnVwU3ZjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQUEsT0FBQSxVQUFBLENBQUEsVUFBQTtBQ0FBLFFBQUEsT0FBQSxVQUFBLDBCQUFBLFNBQUEsZ0JBQUE7SUFDQTtTQUNBLEtBQUEsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsV0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsYUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLFVBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBLFVBQUEsV0FBQSx3REFBQSxTQUFBLFFBQUEsT0FBQSxVQUFBLFdBQUE7O0lBRUEsR0FBQSxPQUFBLGFBQUEsVUFBQTtRQUNBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxPQUFBLGNBQUEsU0FBQTs7Ozs7SUFLQSxPQUFBLElBQUEsU0FBQSxTQUFBLEdBQUEsTUFBQTtRQUNBLE9BQUEsYUFBQSxXQUFBO1FBQ0EsVUFBQSxLQUFBO1FBQ0EsT0FBQSxjQUFBOzs7SUFHQSxPQUFBLFNBQUEsV0FBQTtRQUNBLE9BQUEsYUFBQSxXQUFBO1FBQ0EsT0FBQSxjQUFBO1FBQ0EsU0FBQTs7O0FDbkJBLFFBQUEsT0FBQSxVQUFBLFdBQUEscUNBQUEsU0FBQSxRQUFBLFVBQUE7SUFDQSxPQUFBLGNBQUEsU0FBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBO1FBQ0EsU0FBQSxTQUFBO2FBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBO2VBQ0EsU0FBQSxPQUFBO2dCQUNBLFFBQUEsSUFBQTs7Ozs7O0FDUEEsUUFBQSxPQUFBLFVBQUEsV0FBQSxtQ0FBQSxTQUFBLFFBQUEsVUFBQTtJQUNBLFNBQUEsWUFBQSxLQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsU0FBQSxPQUFBO2dCQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsU0FBQTtnQkFDQSxNQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsT0FBQTtnQkFDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLFVBQUE7Ozs7QUNSQSxRQUFBLE9BQUEsVUFBQSxXQUFBLG9DQUFBLFNBQUEsT0FBQSxVQUFBO0lBQ0EsT0FBQSxRQUFBLFNBQUEsU0FBQSxVQUFBO1FBQ0EsU0FBQSxNQUFBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFNBQUEsV0FBQSxLQUFBO29CQUNBLE9BQUEsYUFBQSxTQUFBO3VCQUNBO29CQUNBLE9BQUEsTUFBQSxTQUFBOzs7OztBQ1BBLFFBQUEsT0FBQSxVQUFBLFdBQUEsbURBQUEsU0FBQSxRQUFBLFdBQUEsV0FBQTtJQUNBLE9BQUEsU0FBQSxTQUFBLFdBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUE7UUFDQSxHQUFBLGFBQUEsZ0JBQUE7WUFDQSxVQUFBLE9BQUEsVUFBQSxTQUFBLFNBQUE7aUJBQ0EsS0FBQSxTQUFBLFVBQUE7b0JBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7ZUFFQTs7WUFFQSxRQUFBLElBQUE7Ozs7O0FDVEEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7O0lBRUEsSUFBQSxXQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGVBQUE7WUFDQSxPQUFBLElBQUE7WUFDQSxhQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxTQUFBLEtBQUE7Ozs7SUFJQSxJQUFBLFlBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7O0FDZEEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7SUFHQSxJQUFBLFFBQUEsU0FBQSxTQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7V0FDQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsSUFBQTtXQUNBLFNBQUEsS0FBQTtZQUNBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxXQUFBO1FBQ0EsTUFBQSxJQUFBLFdBQUEsS0FBQSxVQUFBO1lBQ0EsUUFBQSxJQUFBOzs7O0FDbEJBLFFBQUEsT0FBQSxVQUFBLFFBQUEsdUJBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsS0FBQSxTQUFBLE1BQUEsSUFBQTtTQUNBLEtBQUEsV0FBQTtZQUNBLFFBQUEsSUFBQTs7O0FDSkEsUUFBQSxPQUFBLFVBQUEsUUFBQSx1QkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFNBQUEsU0FBQSxVQUFBLFVBQUEsVUFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsV0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7OztJQUdBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJywgWyduZ1JvdXRlJywnbmdNZXNzYWdlcyddKTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3NpZ251cC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2FkZEV2ZW50Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2FkZEV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0N0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbn0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignQXBwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIExvZ2luU3ZjLCAkbG9jYXRpb24pIHtcblxuICAgIGlmKHdpbmRvdy5sb2NhbFN0b3JhZ2UubG9nZ2VkSW4pIHtcbiAgICAgICAgTG9naW5TdmMuZ2V0VXNlcigpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmxvZ2dlZEluID0gdHJ1ZTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9KTtcbiAgICBcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9nZ2VkSW4nKTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgICAgTG9naW5TdmMubG9nb3V0KCk7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0V2ZW50c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV2ZW50U3ZjKSB7XG4gICAgJHNjb3BlLmNyZWF0ZUV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIEV2ZW50U3ZjLmFkZEV2ZW50KGV2dClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV2ZW50U3ZjKSB7XG4gICAgRXZlbnRTdmMuZ2V0RXZlbnRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5jcmVhdGVkID0gbW9tZW50KGV2ZW50LmNyZWF0ZWQpLmZyb21Ob3coKTtcbiAgICAgICAgICAgICAgICBldmVudC5kYXRlID0gbW9tZW50KGV2ZW50LmRhdGVUaW1lKS5mb3JtYXQoJ01NL0REJylcbiAgICAgICAgICAgICAgICBldmVudC5kYXkgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLmZvcm1hdCgnZGRkZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnRpbWUgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLmZvcm1hdCgnaGg6bW0gQScpO1xuICAgICAgICAgICAgICAgIGV2ZW50Lm1pbnV0ZXMgPSBtb21lbnQoZXZlbnQuZGF0ZVRpbWUpLm1pbnV0ZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSxMb2dpblN2Yykge1xuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKSB7XG4gICAgICAgIExvZ2luU3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9naW5FcnJvciA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgU2lnbnVwU3ZjLCAkbG9jYXRpb24pIHtcbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkLHJlcGVhdFBhc3N3b3JkKSB7XG4gICAgICAgIGlmKHBhc3N3b3JkID09PSByZXBlYXRQYXNzd29yZCkge1xuICAgICAgICAgICAgU2lnbnVwU3ZjLnNpZ251cChmaXJzdE5hbWUsbGFzdE5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9IYW5kbGUgcGFzc3dvcmRzIGRvbid0IG1hdGNoXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ0V2ZW50U3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcblxuICAgIHN2Yy5hZGRFdmVudCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9ldmVudHMnLCB7XG4gICAgICAgICAgICB0aXRsZTogZXZ0LnRpdGxlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGV2dC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGxvY2F0aW9uOiBldnQubG9jYXRpb24sXG4gICAgICAgICAgICBkYXRlVGltZTogZXZ0LmRhdGVUaW1lLFxuICAgICAgICAgICAgY3JlYXRlZDogRGF0ZS5ub3coKVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHN2Yy5nZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9ldmVudHMnKVxuICAgIH1cbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdMb2dpblN2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIHN2YyA9IHRoaXM7XG4gICAgc3ZjLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpO1xuICAgIH07XG5cbiAgICBzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLmRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzdmMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIG91dCFcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdMb2dvdXRTdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuICAgIHRoaXMubG9nb3V0ID0gJGh0dHAuZ2V0KCcvbG9nb3V0JylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dlZCBvdXQhXCIpO1xuICAgICAgICB9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdTaWdudXBTdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuICAgIHN2Yy5zaWdudXAgPSBmdW5jdGlvbihmaXJzdE5hbWUsbGFzdE5hbWUsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NpZ251cCcsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIGZpcnN0TmFtZTogZmlyc3ROYW1lLFxuICAgICAgICAgICAgbGFzdE5hbWU6IGxhc3ROYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0pO1xuICAgIH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

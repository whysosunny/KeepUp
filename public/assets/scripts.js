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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwic2VydmljZXMvRXZlbnRTdmMuanMiLCJzZXJ2aWNlcy9Mb2dpblN2Yy5qcyIsInNlcnZpY2VzL1NpZ251cFN2Yy5qcyIsImNvbnRyb2xsZXJzL0FwcEN0cmwuanMiLCJjb250cm9sbGVycy9FdmVudHNDdHJsLmpzIiwiY29udHJvbGxlcnMvSG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9Mb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9TaWdudXBDdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQUEsT0FBQSxVQUFBLENBQUEsVUFBQTtBQ0FBLFFBQUEsT0FBQSxVQUFBLDBCQUFBLFNBQUEsZ0JBQUE7SUFDQTtTQUNBLEtBQUEsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsV0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLEtBQUEsYUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztTQUVBLFVBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7O0lBRUEsSUFBQSxXQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGVBQUE7WUFDQSxPQUFBLElBQUE7WUFDQSxhQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxVQUFBLElBQUE7WUFDQSxTQUFBLEtBQUE7Ozs7SUFJQSxJQUFBLFlBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7O0FDZEEsUUFBQSxPQUFBLFVBQUEsUUFBQSxzQkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGlCQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7V0FDQSxLQUFBLFNBQUEsS0FBQTs7WUFFQSxPQUFBLGFBQUEsUUFBQSxJQUFBO1lBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsYUFBQTtZQUNBLE9BQUEsSUFBQTtXQUNBLFNBQUEsS0FBQTtZQUNBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxXQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7QUNuQkEsUUFBQSxPQUFBLFVBQUEsUUFBQSx1QkFBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFNBQUEsU0FBQSxVQUFBLFVBQUEsVUFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7Ozs7QUNQQSxRQUFBLE9BQUEsVUFBQSxXQUFBLHdEQUFBLFNBQUEsUUFBQSxPQUFBLFVBQUEsV0FBQTs7SUFFQSxHQUFBLE9BQUEsYUFBQSxPQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsYUFBQTtRQUNBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxPQUFBLGNBQUEsU0FBQTs7OztJQUlBLE9BQUEsSUFBQSxTQUFBLFNBQUEsR0FBQSxNQUFBO1FBQ0EsVUFBQSxLQUFBO1FBQ0EsT0FBQSxjQUFBOzs7SUFHQSxPQUFBLFNBQUEsV0FBQTtRQUNBLE9BQUEsY0FBQTtRQUNBLE9BQUEsYUFBQSxXQUFBO1FBQ0EsU0FBQTs7O0FDbEJBLFFBQUEsT0FBQSxVQUFBLFdBQUEscUNBQUEsU0FBQSxRQUFBLFVBQUE7SUFDQSxPQUFBLGNBQUEsU0FBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBO1FBQ0EsU0FBQSxTQUFBO2FBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBO2VBQ0EsU0FBQSxPQUFBO2dCQUNBLFFBQUEsSUFBQTs7Ozs7O0FDUEEsUUFBQSxPQUFBLFVBQUEsV0FBQSxtQ0FBQSxTQUFBLFFBQUEsVUFBQTtJQUNBLFNBQUE7U0FDQSxLQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQSxTQUFBO1lBQ0EsUUFBQSxJQUFBLE9BQUE7WUFDQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUE7Z0JBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxTQUFBO2dCQUNBLE1BQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxPQUFBO2dCQUNBLE1BQUEsTUFBQSxPQUFBLE1BQUEsVUFBQSxPQUFBO2dCQUNBLE1BQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxPQUFBO2dCQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsVUFBQTs7Ozs7QUNWQSxRQUFBLE9BQUEsVUFBQSxXQUFBLG9DQUFBLFNBQUEsT0FBQSxVQUFBO0lBQ0EsT0FBQSxRQUFBLFNBQUEsU0FBQSxVQUFBO1FBQ0EsU0FBQSxNQUFBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFNBQUEsV0FBQSxLQUFBO29CQUNBLE9BQUEsYUFBQSxTQUFBO3VCQUNBO29CQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7Ozs7O0FDUEEsUUFBQSxPQUFBLFVBQUEsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsV0FBQTtJQUNBLE9BQUEsU0FBQSxTQUFBLFdBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUE7UUFDQSxHQUFBLGFBQUEsZ0JBQUE7WUFDQSxRQUFBLElBQUE7WUFDQSxVQUFBLE9BQUEsVUFBQSxTQUFBLFNBQUE7aUJBQ0EsS0FBQSxTQUFBLFVBQUE7b0JBQ0EsUUFBQSxJQUFBOztlQUVBOztZQUVBLFFBQUEsSUFBQTs7OztJQUlBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJywgWyduZ1JvdXRlJywnbmdNZXNzYWdlcyddKTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3NpZ251cC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2FkZEV2ZW50Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2FkZEV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0N0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbn0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnRXZlbnRTdmMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBzdmMgPSB0aGlzO1xuXG4gICAgc3ZjLmFkZEV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2V2ZW50cycsIHtcbiAgICAgICAgICAgIHRpdGxlOiBldnQudGl0bGUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXZ0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgbG9jYXRpb246IGV2dC5sb2NhdGlvbixcbiAgICAgICAgICAgIGRhdGVUaW1lOiBldnQuZGF0ZVRpbWUsXG4gICAgICAgICAgICBjcmVhdGVkOiBEYXRlLm5vdygpXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgc3ZjLmdldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2V2ZW50cycpXG4gICAgfVxuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ0xvZ2luU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJyk7XG4gICAgfTtcbiAgICBzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgLy8gc3ZjLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xuICAgICAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzdmMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnU2lnbnVwU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLGxhc3ROYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnMnLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBmaXJzdE5hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3ROYW1lOiBsYXN0TmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0FwcEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBMb2dpblN2YywgJGxvY2F0aW9uKSB7XG5cbiAgICBpZih3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuKSB7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW47XG4gICAgICAgIExvZ2luU3ZjLmdldFVzZXIoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgfSk7XG4gICAgXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XG4gICAgICAgIExvZ2luU3ZjLmxvZ291dCgpO1xuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdFdmVudHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFdmVudFN2Yykge1xuICAgICRzY29wZS5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICBFdmVudFN2Yy5hZGRFdmVudChldnQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFdmVudFN2Yykge1xuICAgIEV2ZW50U3ZjLmdldEV2ZW50cygpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5ldmVudHMpO1xuICAgICAgICAgICAgJHNjb3BlLmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuY3JlYXRlZCA9IG1vbWVudChldmVudC5jcmVhdGVkKS5mcm9tTm93KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0ZSA9IG1vbWVudChldmVudC5kYXRlVGltZSkuZm9ybWF0KCdNTS9ERCcpXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF5ID0gbW9tZW50KGV2ZW50LmRhdGVUaW1lKS5mb3JtYXQoJ2RkZGQnKTtcbiAgICAgICAgICAgICAgICBldmVudC50aW1lID0gbW9tZW50KGV2ZW50LmRhdGVUaW1lKS5mb3JtYXQoJ2hoOm1tIEEnKTtcbiAgICAgICAgICAgICAgICBldmVudC5taW51dGVzID0gbW9tZW50KGV2ZW50LmRhdGVUaW1lKS5taW51dGVzKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSxMb2dpblN2Yykge1xuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKSB7XG4gICAgICAgIExvZ2luU3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9naW5FcnJvciA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTaWdudXBTdmMpIHtcbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkLHJlcGVhdFBhc3N3b3JkKSB7XG4gICAgICAgIGlmKHBhc3N3b3JkID09PSByZXBlYXRQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGFzc3dvcmQpO1xuICAgICAgICAgICAgU2lnbnVwU3ZjLnNpZ251cChmaXJzdE5hbWUsbGFzdE5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSGFuZGxlIHBhc3N3b3JkcyBkb24ndCBtYXRjaFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2ghXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

angular.module('keepUp', ['ngRoute','ngMessages']);
angular.module('keepUp').config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/home.html'
            // controller: 'HomeCtrl'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwiY29udHJvbGxlcnMvQXBwQ3RybC5qcyIsImNvbnRyb2xsZXJzL0V2ZW50c0N0cmwuanMiLCJjb250cm9sbGVycy9Mb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9TaWdudXBDdHJsLmpzIiwic2VydmljZXMvRXZlbnRTdmMuanMiLCJzZXJ2aWNlcy9Mb2dpblN2Yy5qcyIsInNlcnZpY2VzL1NpZ251cFN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFBLE9BQUEsVUFBQSxDQUFBLFVBQUE7QUNBQSxRQUFBLE9BQUEsVUFBQSwwQkFBQSxTQUFBLGdCQUFBO0lBQ0E7U0FDQSxLQUFBLEtBQUE7WUFDQSxhQUFBOzs7U0FHQSxLQUFBLFVBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxLQUFBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxLQUFBLGFBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxVQUFBOzs7O0FDbEJBLFFBQUEsT0FBQSxVQUFBLFdBQUEsd0RBQUEsU0FBQSxRQUFBLE9BQUEsVUFBQSxXQUFBOztJQUVBLEdBQUEsT0FBQSxhQUFBLE9BQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxhQUFBO1FBQ0EsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLE9BQUEsY0FBQSxTQUFBOzs7O0lBSUEsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLE1BQUE7UUFDQSxVQUFBLEtBQUE7UUFDQSxPQUFBLGNBQUE7OztJQUdBLE9BQUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxjQUFBO1FBQ0EsT0FBQSxhQUFBLFdBQUE7UUFDQSxTQUFBOzs7QUNsQkEsUUFBQSxPQUFBLFVBQUEsV0FBQSxxQ0FBQSxTQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsY0FBQSxTQUFBLEtBQUE7UUFDQSxTQUFBLFNBQUE7YUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUE7ZUFDQSxTQUFBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBOzs7OztBQ05BLFFBQUEsT0FBQSxVQUFBLFdBQUEsb0NBQUEsU0FBQSxPQUFBLFVBQUE7SUFDQSxPQUFBLFFBQUEsU0FBQSxTQUFBLFVBQUE7UUFDQSxTQUFBLE1BQUEsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsU0FBQSxXQUFBLEtBQUE7b0JBQ0EsT0FBQSxhQUFBLFNBQUE7dUJBQ0E7b0JBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7Ozs7QUNQQSxRQUFBLE9BQUEsVUFBQSxXQUFBLHNDQUFBLFNBQUEsUUFBQSxXQUFBO0lBQ0EsT0FBQSxTQUFBLFNBQUEsV0FBQSxVQUFBLFVBQUEsU0FBQSxnQkFBQTtRQUNBLEdBQUEsYUFBQSxnQkFBQTtZQUNBLFFBQUEsSUFBQTtZQUNBLFVBQUEsT0FBQSxVQUFBLFNBQUEsU0FBQTtpQkFDQSxLQUFBLFNBQUEsVUFBQTtvQkFDQSxRQUFBLElBQUE7O2VBRUE7O1lBRUEsUUFBQSxJQUFBOzs7OztBQ1ZBLFFBQUEsT0FBQSxVQUFBLFFBQUEsc0JBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBOztJQUVBLElBQUEsV0FBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxlQUFBO1lBQ0EsT0FBQSxJQUFBO1lBQ0EsYUFBQSxJQUFBO1lBQ0EsVUFBQSxJQUFBO1lBQ0EsVUFBQSxJQUFBOzs7OztBQ1JBLFFBQUEsT0FBQSxVQUFBLFFBQUEsc0JBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxTQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtZQUNBLFVBQUE7WUFDQSxVQUFBO1dBQ0EsS0FBQSxTQUFBLEtBQUE7O1lBRUEsT0FBQSxhQUFBLFFBQUEsSUFBQTtZQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGFBQUE7WUFDQSxPQUFBLElBQUE7V0FDQSxTQUFBLEtBQUE7WUFDQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsV0FBQTtRQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQTs7O0FDbkJBLFFBQUEsT0FBQSxVQUFBLFFBQUEsdUJBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxTQUFBLFNBQUEsVUFBQSxVQUFBLFVBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGNBQUE7WUFDQSxVQUFBO1lBQ0EsV0FBQTtZQUNBLFVBQUE7WUFDQSxVQUFBOzs7SUFHQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcsIFsnbmdSb3V0ZScsJ25nTWVzc2FnZXMnXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCdcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3NpZ251cC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2FkZEV2ZW50Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2FkZEV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0N0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbn0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignQXBwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIExvZ2luU3ZjLCAkbG9jYXRpb24pIHtcblxuICAgIGlmKHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW4pIHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbjtcbiAgICAgICAgTG9naW5TdmMuZ2V0VXNlcigpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKF8sIHVzZXIpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9KTtcbiAgICBcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcbiAgICAgICAgTG9naW5TdmMubG9nb3V0KCk7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0V2ZW50c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV2ZW50U3ZjKSB7XG4gICAgJHNjb3BlLmNyZWF0ZUV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIEV2ZW50U3ZjLmFkZEV2ZW50KGV2dClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSxMb2dpblN2Yykge1xuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKSB7XG4gICAgICAgIExvZ2luU3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9naW5FcnJvciA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTaWdudXBTdmMpIHtcbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkLHJlcGVhdFBhc3N3b3JkKSB7XG4gICAgICAgIGlmKHBhc3N3b3JkID09PSByZXBlYXRQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGFzc3dvcmQpO1xuICAgICAgICAgICAgU2lnbnVwU3ZjLnNpZ251cChmaXJzdE5hbWUsbGFzdE5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSGFuZGxlIHBhc3N3b3JkcyBkb24ndCBtYXRjaFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2ghXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5zZXJ2aWNlKCdFdmVudFN2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIHN2YyA9IHRoaXM7XG5cbiAgICBzdmMuYWRkRXZlbnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZXZlbnRzJywge1xuICAgICAgICAgICAgdGl0bGU6IGV2dC50aXRsZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBldnQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBsb2NhdGlvbjogZXZ0LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGF0ZVRpbWU6IGV2dC5kYXRlVGltZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ0xvZ2luU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJyk7XG4gICAgfTtcbiAgICBzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgLy8gc3ZjLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xuICAgICAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzdmMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnU2lnbnVwU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLGxhc3ROYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnMnLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBmaXJzdE5hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3ROYW1lOiBsYXN0TmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

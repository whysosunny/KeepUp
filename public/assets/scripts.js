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
        .when('/addPost', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5nQ29uZmlnLmpzIiwiY29udHJvbGxlcnMvQXBwQ3RybC5qcyIsImNvbnRyb2xsZXJzL0xvZ2luQ3RybC5qcyIsImNvbnRyb2xsZXJzL1NpZ251cEN0cmwuanMiLCJzZXJ2aWNlcy9Mb2dpblN2Yy5qcyIsInNlcnZpY2VzL1NpZ251cFN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFBLE9BQUEsVUFBQSxDQUFBLFVBQUE7QUNBQSxRQUFBLE9BQUEsVUFBQSwwQkFBQSxTQUFBLGdCQUFBO0lBQ0E7U0FDQSxLQUFBLEtBQUE7WUFDQSxhQUFBOzs7U0FHQSxLQUFBLFVBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxLQUFBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxLQUFBLFlBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7U0FFQSxVQUFBOzs7O0FDbEJBLFFBQUEsT0FBQSxVQUFBLFdBQUEsd0RBQUEsU0FBQSxRQUFBLE9BQUEsVUFBQSxXQUFBOztJQUVBLEdBQUEsT0FBQSxhQUFBLE9BQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxhQUFBO1FBQ0EsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLE9BQUEsY0FBQSxTQUFBOzs7O0lBSUEsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLE1BQUE7UUFDQSxVQUFBLEtBQUE7UUFDQSxPQUFBLGNBQUE7OztJQUdBLE9BQUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxjQUFBO1FBQ0EsT0FBQSxhQUFBLFdBQUE7UUFDQSxTQUFBOzs7O0FDbEJBLFFBQUEsT0FBQSxVQUFBLFdBQUEsb0NBQUEsU0FBQSxPQUFBLFVBQUE7SUFDQSxPQUFBLFFBQUEsU0FBQSxTQUFBLFVBQUE7UUFDQSxTQUFBLE1BQUEsU0FBQTthQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsU0FBQSxXQUFBLEtBQUE7b0JBQ0EsT0FBQSxhQUFBLFNBQUE7dUJBQ0E7b0JBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7Ozs7QUNQQSxRQUFBLE9BQUEsVUFBQSxXQUFBLHNDQUFBLFNBQUEsUUFBQSxXQUFBO0lBQ0EsT0FBQSxTQUFBLFNBQUEsV0FBQSxVQUFBLFVBQUEsU0FBQSxnQkFBQTtRQUNBLEdBQUEsYUFBQSxnQkFBQTtZQUNBLFFBQUEsSUFBQTtZQUNBLFVBQUEsT0FBQSxVQUFBLFNBQUEsU0FBQTtpQkFDQSxLQUFBLFNBQUEsVUFBQTtvQkFDQSxRQUFBLElBQUE7O2VBRUE7O1lBRUEsUUFBQSxJQUFBOzs7OztBQ1ZBLFFBQUEsT0FBQSxVQUFBLFFBQUEsc0JBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxTQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtZQUNBLFVBQUE7WUFDQSxVQUFBO1dBQ0EsS0FBQSxTQUFBLEtBQUE7O1lBRUEsT0FBQSxhQUFBLFFBQUEsSUFBQTtZQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGFBQUE7WUFDQSxPQUFBLElBQUE7V0FDQSxTQUFBLEtBQUE7WUFDQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsV0FBQTtRQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQTs7O0FDbkJBLFFBQUEsT0FBQSxVQUFBLFFBQUEsdUJBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxTQUFBLFNBQUEsVUFBQSxVQUFBLFVBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLGNBQUE7WUFDQSxVQUFBO1lBQ0EsV0FBQTtZQUNBLFVBQUE7WUFDQSxVQUFBOzs7SUFHQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcsIFsnbmdSb3V0ZScsJ25nTWVzc2FnZXMnXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCdcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3NpZ251cC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL2FkZFBvc3QnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWRkRXZlbnQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRzQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgLm90aGVyd2lzZSgnLycpO1xufSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwVXAnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgTG9naW5TdmMsICRsb2NhdGlvbikge1xuXG4gICAgaWYod2luZG93LmxvY2FsU3RvcmFnZS50b2tlbikge1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xuICAgICAgICBMb2dpblN2Yy5nZXRVc2VyKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH0pO1xuICAgIFxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xuICAgICAgICBMb2dpblN2Yy5sb2dvdXQoKTtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLExvZ2luU3ZjKSB7XG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpIHtcbiAgICAgICAgTG9naW5TdmMubG9naW4odXNlcm5hbWUscGFzc3dvcmQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2dpbkVycm9yID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLmNvbnRyb2xsZXIoJ1NpZ251cEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFNpZ251cFN2Yykge1xuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbihmaXJzdE5hbWUsIGxhc3ROYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQscmVwZWF0UGFzc3dvcmQpIHtcbiAgICAgICAgaWYocGFzc3dvcmQgPT09IHJlcGVhdFBhc3N3b3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYXNzd29yZCk7XG4gICAgICAgICAgICBTaWdudXBTdmMuc2lnbnVwKGZpcnN0TmFtZSxsYXN0TmFtZSx1c2VybmFtZSxwYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9IYW5kbGUgcGFzc3dvcmRzIGRvbid0IG1hdGNoXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBVcCcpLnNlcnZpY2UoJ0xvZ2luU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJyk7XG4gICAgfTtcbiAgICBzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgLy8gc3ZjLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuID0gdmFsLmRhdGE7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xuICAgICAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzdmMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgna2VlcFVwJykuc2VydmljZSgnU2lnbnVwU3ZjJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB2YXIgc3ZjID0gdGhpcztcbiAgICBzdmMuc2lnbnVwID0gZnVuY3Rpb24oZmlyc3ROYW1lLGxhc3ROYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnMnLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBmaXJzdE5hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3ROYW1lOiBsYXN0TmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

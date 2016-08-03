angular.module('keepUp').controller('AppCtrl', function($scope, $http, LoginSvc, $location) {

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
});
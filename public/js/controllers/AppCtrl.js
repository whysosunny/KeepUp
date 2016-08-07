angular.module('keepUp').controller('AppCtrl', function($scope, $http, LoginSvc, $location) {

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
});
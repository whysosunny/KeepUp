angular.module('keepUp').service('LogoutSvc', function($http) {
    var svc = this;
    this.logout = $http.get('/logout')
        .then(function() {
            console.log("logged out!");
        });
});
angular.module('keepUp').service('LoginSvc', function($http) {
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
});
angular.module('keepUp').service('SignupSvc', function($http) {
    var svc = this;
    svc.signup = function(firstName,lastName, username, password) {
        return $http.post('/signup', {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password
        });
    };
});
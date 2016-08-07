angular.module('keepUp').controller('SignupCtrl', function($scope, SignupSvc, $location) {
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
});
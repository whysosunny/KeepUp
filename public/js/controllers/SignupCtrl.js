angular.module('keepUp').controller('SignupCtrl', function($scope, SignupSvc) {
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
});
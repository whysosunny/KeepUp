angular.module('keepUp').config(function($routeProvider) {
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
});


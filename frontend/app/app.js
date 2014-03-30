angular.module('teleinfo-app', ['ngRoute', 'teleinfo.home'])
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'home/home.tpl.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                })
                .otherwise({redirectTo: '/home'})
        }]);


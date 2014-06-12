angular.module('teleinfo-app', ['ngRoute', 'teleinfo.home', 'teleinfo.history'])
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'home/home.tpl.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                })
                .when('/history', {
                    templateUrl: 'history/history.tpl.html',
                    controller: 'HistoryCtrl',
                    controllerAs: 'history'
                })
                .otherwise({redirectTo: '/home'})
        }]);


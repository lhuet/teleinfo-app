angular.module('teleinfo.home', [])

.controller( 'HomeCtrl', function HomeController( $scope, $http ) {
        $scope.intensite = undefined;
        $scope.indexcompteur = undefined;
        $http.get('/rest/inst/p')
            .success(function(data) {
                $scope.puissance = data;
            });
        $http.get('/rest/inst/index')
            .success(function(data) {
                $scope.indexcompteur = data;
            })
})
;


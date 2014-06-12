angular.module('teleinfo.history', [])

    .controller('HistoryCtrl', function HistoryController($scope, $http) {
         $scope.changeDate = function(dateMin, dateMax) {
             $http.get("/history/data.json"
             ).success(function(data){
                    $scope.data = data;

                     angular.forEach($scope.data, function(value) {
                         value.date = new Date(value.date);
                         console.log(value.date);
                     });
                 });
         }

    })
;


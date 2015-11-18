
ctrlApp.controller('dashboardController', ['$scope', '$http', '$sce', '$User',
    function ($scope, $http, $sce, $User) {
        
        $scope.init = function () {
            
            $scope.selectedWebsite = $User.getSelectedWebsite();
        }
    }
]);
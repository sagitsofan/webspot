
ctrlApp.controller('topMenuController', ['$scope', '$http', '$User', '$sce', '$window', 'PanelDataModel', '$location',
    function ($scope, $http, $User, $sce, $window, PanelDataModel, $location) {
        
        $scope.init = function (){

            $scope.user = $User.get();
            $scope.selectedWebsite = $User.getSelectedWebsite();
        }

        $scope.logout = function () {

            $User.logout();
        }
        
        $scope.changeWebsite = function (website) {
            
            if (website._id != $scope.selectedWebsite._id) {

                PanelDataModel.session(website).success(function (result, status, headers, config) {
                    
                    $User.setSelectedWebsite(website);
                    $location.path('#/dashboard');
                    $window.location.reload();
                });
            }

        }
    }
]);
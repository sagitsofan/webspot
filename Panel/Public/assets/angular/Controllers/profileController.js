
ctrlApp.controller('profileController', ['$scope', 'PanelDataModel', 'APIService', 'ngNotify', '$User', '$location', '$window',
    function ($scope, PanelDataModel, APIService, ngNotify, $User, $location, $window) {
        $scope.user = {};
        
        $scope.init = function () {

            PanelDataModel.user().then(function (results) {

                $scope.user = results.data;
            });
        }

        $scope.save = function () {
            
            PanelDataModel.updateUser($scope.user).then(function (results) {
                
                //update user in cookie
                $User.set($scope.user);
                
                //ngNotify.set('Saved successfully!', {
                //    type: 'info'
                //});

                $location.path('#/dashboard');
                $window.location.reload();
            });
        }
        
        //websites manage methods
        $scope.openWebsiteDialog = function (website, editIndex) {
            
            $scope.editIndex = editIndex;
            $scope.currentWebsite = website;
            $scope.showModal = true;
        };
        
        $scope.deleteWebsite = function () {
            
            $scope.user.websites.splice($scope.editIndex, 1);
            $scope.closeWebsiteDialog();
        };
        
        $scope.saveWebsite = function () {
            
            //add mode
            if ($scope.editIndex == undefined) { 
                
                $scope.user.websites.push($scope.currentWebsite);
            }
            
            $scope.closeWebsiteDialog();
        };
        
        $scope.closeWebsiteDialog = function () {
            
            $scope.editIndex = null;
            $scope.currentWebsite = null;
            $scope.showModal = false;
        };
    }
]);
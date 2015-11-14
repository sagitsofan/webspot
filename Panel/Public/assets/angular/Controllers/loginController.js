
ctrlApp.controller('loginController', ['$scope', '$http', 'PanelDataModel', '$User',
    function ($scope, $http, PanelDataModel, $User) {
        $scope.loginStatus = "";
        $scope.createStatus = "";

        $scope.showLoginError = false;
        $scope.showRegisterError = false;
        
        $scope.user = {};
        $scope.user.image = "";
        $scope.user.websites = [];

        $scope.login = function (form) {

            $scope.showLoginError = false;
            
            if (form.$valid) {
                
                $scope.validateUser($scope.email, $scope.password);
            }
            else {
                $scope.showLoginError = true;
            }
        }
        
        $scope.validateUser = function (email, password) {

            PanelDataModel.login(email, password).success(function (data, status, headers, config) {
                
                if (data != null && data.error === undefined) {
                    
                    $User.set(data);
                    $User.setSelectedWebsite(data.websites[0]);
                    $User.redirectAfterLogin();
                }
                else {
                    
                    $scope.password = "";
                    $scope.loginStatus = data.error.message;
                }
            });
        }

        $scope.register = function (form) {
            
            $scope.showRegisterError = false;
            
            if (form.$valid) {
                
                PanelDataModel.register($scope.user).success(function (data, status, headers, config) {
                    
                    if (data) {
                        $scope.user = {};
                    }

                    $scope.createStatus = data.status.message;
                });
            }
            else {
                $scope.showRegisterError = true;
            }
        }

        $scope.init = function () {
            
            var usr = $User.get();

            if (usr != false) {
                
                $scope.validateUser(usr.email, usr.password);
            }
        
        }

        $scope.init();
    }
]);
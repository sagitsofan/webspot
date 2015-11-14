
ctrlApp.controller('menuController', ['$scope', '$http', 'PanelDataModel', 'APIService', '$sce', '$location', '$User',
    function ($scope, $http, PanelDataModel, APIService, $sce, $location, $User) {

        $scope.menuItems = [];
        $scope.currentView = "";
        
        //handle selected item in the menu
        $scope.$on("$locationChangeSuccess", function handleLocationChangeEvent(event) {
            
            $User.authenticate();

            if ($location.path().replace("/", "") == "") {
                $scope.currentView = "home";
            }
            else {
                $scope.currentView = $location.path().split("/")[2];
            }
        });

        APIService.invoke(Method.Get, Action.GetSchema, "", "", function (result) {
        //PanelDataModel.schema().then(function (result) {
            
            $scope.menuItems = result.data;
        });
    }
]);
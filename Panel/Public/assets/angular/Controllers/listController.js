
ctrlApp.controller('listController', ['$scope', '$http', 'GenericDataModel', 'PanelDataModel', 'APIService', '$sce', '$routeParams', 'ngNotify',
    function ($scope, $http, GenericDataModel, PanelDataModel, APIService, $sce, $routeParams, ngNotify) {
        
        $scope.schema = $routeParams.schema;
        $scope.items = [];
        $scope.sortingLog = [];

        $scope.init = function () {
            
            APIService.invoke(Method.Get, Action.GetSchema, "", "", function (results) {
            //PanelDataModel.schema().then(function (results) {

                $scope.currentSchema = _.first(_.where(results.data, { "name": $scope.schema }));
                $scope.loobyField = _.first(_.where($scope.currentSchema.schema.fields, { "name": $scope.currentSchema.loobyField }));

                APIService.invoke(Method.Get, Action.GetData, $scope.schema, "", function (result) {
                //GenericDataModel.getData($scope.schema).then(function (result) {

                    $scope.items = result.data;
                });
            });
        }

        $scope.init();
        
        $scope.formatHtml = function (loobyField) {
            
            if ($scope.currentSchema.loobyHtml != undefined) {
                
                //ensure undefined value
                loobyField = ((typeof loobyField === 'undefined') ? "" : loobyField);

                var formatedString = $scope.currentSchema.loobyHtml.replace("{{" + $scope.loobyField.name + "}}", loobyField);
                return $sce.trustAsHtml(formatedString);
            }
            else {

                return $sce.trustAsHtml(loobyField);
            }
        }
        

        $scope.sortableOptions = {
            
            stop: function (e, ui) {

                //update data
                var data = [];
                var index = 1;
                for (var i in $scope.items) {
                    
                    var item = {};
                    item.id = $scope.items[i]._id;
                    item.indexNumber = index;
                    
                    data.push(item);
                    
                    index++;
                }
                
                APIService.invoke(Method.Post, Action.Sort, $scope.schema, data, function (result) {
                //GenericDataModel.sort($scope.schema, data).success(function (result, status, headers, config) {
                    
                    ngNotify.set('Saved successfully!', {
                        type: 'info'
                    });
                });
            }
        };
        
    }
]);
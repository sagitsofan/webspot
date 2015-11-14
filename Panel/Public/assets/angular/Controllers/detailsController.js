
ctrlApp.controller('detailsController', ['$scope', '$http', '$sce', '$routeParams', '$location', 'GenericDataModel', 'PanelDataModel', 'ngNotify',
    function ($scope, $http, $sce, $routeParams, $location, GenericDataModel, PanelDataModel, ngNotify) {
        
        //dynamic variables
        $scope.id = $routeParams.id;
        $scope.schema = $routeParams.schema;
        $scope.formData = {};
        $scope.showDeleteModal = false;

        //arrays
        $scope.fields = [];
        
        $scope.isEditMode = function () {
            
            return ($scope.id == null ? false : true)
        }

        $scope.handleItem = function () {

            if ($scope.isEditMode()) {

                GenericDataModel.updateRowData($scope.schema, $scope.id, $scope.formData).success(function (result, status, headers, config) {
                    
                    ngNotify.set('Saved successfully!', {
                        type: 'info'
                    });

                    $scope.redirect();
                });
            } else {

                GenericDataModel.addRowData($scope.schema, $scope.formData).success(function (result, status, headers, config) {
                    
                    ngNotify.set('Added successfully!', {
                        type: 'info'
                    });
                    
                    $scope.redirect();
                });
            }
        }
        
        $scope.openDeleteDialog = function () {
            
            $scope.showDeleteModal = true;

        }
        
        $scope.delete = function () {
            
            GenericDataModel.deleteRowData($scope.schema, $scope.id).success(function (result, status, headers, config) {
                
                ngNotify.set('Deleted successfully!', {
                    type: 'pitchy'
                });

                $scope.close();
                $scope.redirect();
            });

        };
        
        $scope.close = function () {
            
            $scope.showDeleteModal = false;
        };

        $scope.redirect = function () {

            var url = '/list/' + $scope.schema;
            $location.path(url);
        }
        
        $scope.init = function () {
            
            if ($scope.isEditMode()) {
                GenericDataModel.getRowData($scope.schema, $scope.id).then(function (results) {
                    $scope.formData = _.first(results.data);

                    PanelDataModel.schema().then(function (results) {
                        var currentSchema = _.first(_.where(results.data, { "name": $scope.schema }));
                        $scope.fields = currentSchema.schema.fields;
                    });
                });
            }
            else {
                PanelDataModel.schema().then(function (results) {
                    var currentSchema = _.first(_.where(results.data, { "name": $scope.schema }));
                    $scope.fields = currentSchema.schema.fields;
                });
            }
        }

        $scope.init();
    }
]);
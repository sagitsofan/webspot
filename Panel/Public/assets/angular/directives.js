//dyanmic directive
ctrlApp.directive('dynamic', function ($compile, $injector) {
    
    var linker = function (scope, element, attrs) {
        
        scope.type = scope.type.toLowerCase();
        
        //check directive realy exists
        if (!$injector.has('panel' + scope.type + 'Directive')) { scope.type = "input"; }
        
        var markup = "<panel" + scope.type + " field='field' ng-model='formdata[field.name]'></panel-input>";
        var compiledTag = $compile(markup)(scope);
        element.append(compiledTag);
    };
    
    return {
        restrict: 'E',
        link : linker,
        scope: {
            type: '@',
            field: '=',
            formdata: '=',
        }
    }
});


//components directives
ctrlApp.directive('panelinput', function () {
    return {
        restrict: 'E',
        controllerAs: 'inputCtrl',
        templateUrl: '/Client/Directives/Text.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {

        }
    };
});

ctrlApp.directive('paneldropdown', function () {
    return {
        restrict: 'E',
        controllerAs: 'dropdownCtrl',
        templateUrl: '/Client/Directives/DropDown.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
        }
    };
});

ctrlApp.directive('paneltextarea', function () {
    return {
        restrict: 'E',
        controllerAs: 'textareaCtrl',
        templateUrl: '/Client/Directives/TextArea.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
        }
    };
});

ctrlApp.directive('panelmultiple', function () {
    return {
        restrict: 'E',
        controllerAs: 'multipleCtrl',
        templateUrl: '/Client/Directives/Multiple.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {

        }
    };
});

ctrlApp.directive('panelgrid', function () {
    return {
        restrict: 'E',
        controllerAs: 'gridCtrl',
        templateUrl: '/Client/Directives/Grid.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function ($scope, $filter, $http, $sce) {
            
            $scope.formatHtml = function (loobyField) {
                
                var formatedString = $scope.field.loobyHtml.replace("{{" + $scope.field.loobyField + "}}", loobyField);
                return $sce.trustAsHtml(formatedString);
            }
        },
        link : function ($scope, scope, element, attrs, $sce) {
            
            $scope.open = function (index, object) {
                
                //add mode
                if (object == undefined) {
                    
                    //create dynamic object
                    $scope.editObject = {};
                    
                    angular.forEach($scope.field.fields, function (value, key) {
                        $scope.editObject[value.name] = "";
                    });

                }
                //edit mode
                else {
                    
                    $scope.editObject = angular.copy(object);
                }
                
                $scope.editIndex = index;
                $scope.showModal = true;
            };
            
            $scope.delete = function () {
                
                $scope.model.splice($scope.editIndex, 1);
                $scope.showModal = false;
            };
            
            $scope.save = function () {
                
                if ($scope.editIndex == undefined) {
                    
                    //add mode
                    $scope.model = ((typeof $scope.model === 'undefined') ? [] : $scope.model);
                    $scope.model.push($scope.editObject);
                }
                else {
                    
                    //edit mode
                    $scope.model[$scope.editIndex] = $scope.editObject;
                }
                
                $scope.showModal = false;
            };
            
            $scope.close = function () {
                
                $scope.showModal = false;
            };
        }
    };
});

ctrlApp.directive('panelcheckbox', function () {
    return {
        restrict: 'E',
        controllerAs: 'checkboxCtrl',
        templateUrl: '/Client/Directives/Checkbox.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function ($scope, $filter, $http) {

        },
        link : function ($scope, scope, element, attrs) {

        }
    };
});

ctrlApp.directive('panelradiobutton', function () {
    return {
        restrict: 'E',
        controllerAs: 'radioButtonsCtrl',
        templateUrl: '/Client/Directives/Radiobutton.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function ($scope, $filter, $http) {

        },
        link : function ($scope, scope, element, attrs) {
            
            $scope.chooice = {
                userChoice: ""
            };
            
            $scope.chooice.userChoice = $scope.model;
            
            $scope.$watch('chooice.userChoice', function () {
                $scope.model = $scope.chooice.userChoice;
            });

        }
    };
});

ctrlApp.directive('panelcheckboxs', function () {
    return {
        restrict: 'E',
        controllerAs: 'checkboxsCtrl',
        templateUrl: '/Client/Directives/CheckBoxs.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function ($scope, $filter, $http) {

        },
        link : function ($scope, scope, element, attrs) {
            
            $scope.selection = ((typeof $scope.model === 'undefined') ? [] : $scope.model);
            $scope.toggleSelection = function toggleSelection(name) {
                
                var idx = $scope.selection.indexOf(name);
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
                else {
                    $scope.selection.push(name);
                }
                
                $scope.model = $scope.selection;
            }
        }
    };
});

ctrlApp.directive('panelrtf', function () {
    return {
        restrict: 'E',
        controllerAs: 'textRtf',
        templateUrl: '/Client/Directives/Rtf.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
            var txt = $('.wysihtml5');
            
            $scope.$watch('model', function (val) {
                txt.siblings("iframe").contents().find("body").html(val);
            });
            
            txt.wysihtml5({
                stylesheets: [],
                events: {
                    "blur": function () {
                        
                        $scope.$apply(function () {
                            var html = txt.siblings("iframe").contents().find("body").html();
                            $scope.model = html;
                        });
                    }
                }
            });
        }
    };
});

ctrlApp.directive('paneldate', function () {
    return {
        restrict: 'E',
        controllerAs: 'DateCtrl',
        templateUrl: '/Client/Directives/Date.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
            $('.date-picker').datepicker({
                autoclose: true
            })
            .on('changeDate', function (e) {
                
                $scope.$apply(function (scope) {
                    
                    $scope.model = $(".date-picker").val();
                });
            });
        }
    };
});

ctrlApp.directive('panelgallery', function () {
    return {
        restrict: 'E',
        controllerAs: 'GalleryCtrl',
        templateUrl: '/Client/Directives/Gallery.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
            $scope.model = ((typeof $scope.model === 'undefined') ? [] : $scope.model);
            
            $scope.handleFile = function ($file, $message, $flow) {
                
                $scope.model.push($file.name);
            }
            
            $scope.deleteFile = function (file) {
                
                var idx = $scope.model.indexOf(file);
                if (idx > -1) {
                    $scope.model.splice(idx, 1);
                }
            }
        }
    };
});

ctrlApp.directive('panelnumber', function () {
    return {
        restrict: 'E',
        controllerAs: 'PhoneCtrl',
        templateUrl: '/Client/Directives/Number.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
       
        }
    };
});

ctrlApp.directive('panelphone', function () {
    return {
        restrict: 'E',
        controllerAs: 'PhoneCtrl',
        templateUrl: '/Client/Directives/Phone.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
        }
    };
});

ctrlApp.directive('panelurl', function () {
    return {
        restrict: 'E',
        controllerAs: 'UrlCtrl',
        templateUrl: '/Client/Directives/Url.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function () {
            var self = this;
        },
        link : function ($scope, scope, element, attrs) {
            
        }
    };
});

ctrlApp.directive('panelrelationalgrid', function (GenericDataModel) {
    return {
        restrict: 'E',
        controllerAs: 'relationalGridCtrl',
        templateUrl: '/Client/Directives/RelationalGrid.html',
        scope : {
            model : "=ngModel",
            field : "="
        },
        controller: function ($scope, $filter, $http, $sce) {
            
            $scope.formatHtml = function (loobyField) {
                
                var formatedString = $scope.field.loobyHtml.replace("{{" + $scope.field.loobyField + "}}", loobyField);
                return $sce.trustAsHtml(formatedString);
            }
        },
        link : function ($scope, scope, element, attrs, $sce) {
            
            $scope.items = [];
            
            $scope.init = function () {
                
                angular.forEach($scope.model, function (id, key) {
                    
                    GenericDataModel.getRowData($scope.field.document, id).success(function (result, status, headers, config) {
                        
                        $scope.items.push(result[0]);
                    });
                });
            };
            $scope.init();
            
            $scope.open = function (index, object) {
                
                //add mode
                if (object == undefined) {
                    
                    //create dynamic object
                    $scope.editObject = {};
                    
                    angular.forEach($scope.field.fields, function (value, key) {
                        $scope.editObject[value.name] = "";
                    });

                }
                //edit mode
                else {
                    
                    $scope.editObject = angular.copy(object);
                }
                
                $scope.selectedItem = object;
                $scope.editIndex = index;
                $scope.showModal = true;
            };
            
            $scope.delete = function () {
                
                GenericDataModel.deleteRowData($scope.field.document, $scope.selectedItem._id).success(function (result, status, headers, config) {
                    
                    $scope.items.splice($scope.editIndex, 1);
                    $scope.model.splice($scope.editIndex, 1);
                    
                    $scope.showModal = false;
                });
            };
            
            $scope.save = function () {
                
                if ($scope.selectedItem == undefined) {
                    
                    //add mode
                    $scope.items = ((typeof $scope.items === 'undefined') ? [] : $scope.items);
                    $scope.model = ((typeof $scope.model === 'undefined') ? [] : $scope.model);
                    
                    GenericDataModel.addRowData($scope.field.document, $scope.editObject).success(function (result, status, headers, config) {
                        
                        $scope.items.push(result);
                        $scope.model.push(result._id);
                    });
                }
                else {
                    //edit mode
                    
                    GenericDataModel.updateRowData($scope.field.document, $scope.selectedItem._id, $scope.editObject).success(function (result, status, headers, config) {
                        
                        $scope.items[$scope.editIndex] = $scope.editObject;
                    });
                }
                
                $scope.showModal = false;
            };
            
            $scope.close = function () {
                
                $scope.showModal = false;
            };
        }
    };
});

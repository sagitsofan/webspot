var ctrlApp = angular.module("ctrlApp", ['ngRoute', 'ui.bootstrap.modal', 'flow', 'ui.sortable', 'ngNotify']).config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
                    when('/cms', { templateUrl: '/cms/views/welcome/welcome.html' }).
                    when('/dashboard', { templateUrl: '/client/dashboard/dashboard.html' }).
                    when('/list/:schema', { templateUrl: '/cms/views/list/list.html' }).
                    when('/details/:schema/:id', { templateUrl: '/cms/views/details/details.html' }).
                    when('/details/:schema/:id#:modal', { templateUrl: '/cms/views/details/details.html' }).
                    when('/add/:schema', { templateUrl: '/cms/views/details/details.html' }).
                    otherwise({ redirectTo: '/' });
        
        $locationProvider.html5Mode(true);
}]);

ctrlApp.config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: '/panel/upload',
            testChunks: false,
            permanentErrors: [500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4
        };
        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', arguments);
        });
    }]);
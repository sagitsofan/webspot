var ctrlApp = angular.module("ctrlApp", ['ngRoute', 'ui.bootstrap.modal', 'flow', 'ui.sortable', 'ngNotify']).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                    when('/', { templateUrl: '/client/partials/dashboard.html' }).
                    when('/profile', { templateUrl: '/client/partials/profile.html' }).
                    when('/list/:schema', { templateUrl: '/client/partials/list.html' }).
                    when('/details/:schema/:id', { templateUrl: '/client/partials/details.html' }).
                    when('/details/:schema/:id#:modal', { templateUrl: '/client/partials/details.html' }).
                    when('/add/:schema', { templateUrl: '/client/partials/details.html' }).
                    otherwise({ redirectTo: '/' })
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
ctrlApp.service('APIService', ['$http', 'ngNotify', function ($http, ngNotify) {
        
        this.invoke = function (method, url, params, data, callback) {
            
            switch (method) {

                case Method.Get:
                    {
                        Metronic.startPageLoading();

                        $http.get(url + params).then(function (result) {
                            
                            callback(result);

                            Metronic.stopPageLoading();

                        }, function (response) {
                            
                            Metronic.stopPageLoading();

                            ngNotify.set('Something is not wrong: ' + response.data, {
                                type: 'error'
                            });
                        });

                        break;
                    }

                case Method.Post:
                    {
                        Metronic.startPageLoading();

                        $http.post(url + params, { data }).then(function (result, status, headers, config) {
                            
                            Metronic.stopPageLoading();
                            
                            callback(result);

                        }, function (response) {
                            
                            Metronic.stopPageLoading();

                            ngNotify.set('Something is not wrong: ' + response.data, {
                                type: 'error'
                            });
                        });

                        break;
                    }
            }
        }
}]);

//factories
ctrlApp.factory('GenericDataModel', ['$http', function ($http) {
        
        var data = {};
        
        data.getData = function (schema) {
            
            return $http.get('/api/' + schema);
        }
        
        data.getRowData = function (schema, id) {
            
            return $http.get('/api/' + schema + '/' + id);
        }
        
        data.updateRowData = function (schema, id, data) {
            
            return $http.post('/api/update/' + schema + '/' + id, {
                data: data
            });
        }
        
        data.deleteRowData = function (schema, id) {
            
            return $http.post('/api/delete/' + schema + '/' + id);
        }
        
        data.addRowData = function (schema, data) {
            
            return $http.post('/api/add/' + schema + '/', { data });
        }
        
        data.sort = function (schema, data) {
            
            return $http.post('/api/sort/' + schema + '/', { data });
        }

        return data;
}]);

ctrlApp.factory('PanelDataModel', ['$http', function ($http) {
        
        var data = {};
        var _schemasCachedData = null;
        
        data.schema = function () {
            
            if (_schemasCachedData == null)
                _schemasCachedData = $http.get('/panel/schema');
            
            return _schemasCachedData;
        }
        
        data.login = function (email, password) {
            
            return $http.post('/panel/login/', { email: email, password: password });
        }
        
        data.session = function (website) {
            
            return $http.post('/panel/session', { website: website });
        }

        
        data.register = function (user) {
            
            return $http.post('/panel/register', { user });
        }
        
        data.user = function () {
            
            return $http.get('/panel/user');
        }
        
        data.updateUser = function (data) {
            
            return $http.post('/panel/updateUser/', {
                data: data
            });
        }
        
        return data;
}]);

//services
ctrlApp.service('$User', function () {
    
    //user manager
    this.set = function (user) {
        
        //clear pass field
        //todo: security breach
        //user.password = null;

        localStorage.setItem("PanelUser", JSON.stringify(user));
    }
    
    this.get = function () {
        
        var user = localStorage.getItem("PanelUser");

        if (user === null)
            return false;
        else
            return JSON.parse(user);
    }
    
    this.logout = function () {
        
        localStorage.removeItem("PanelUser");
        localStorage.removeItem("PanelWebsite");

        this.redirectAfterLogin();
    }

    this.authenticate = function () {

        if (!this.get())
            document.location.href = "/login";
    }

    this.redirectAfterLogin = function () {
        
        document.location.href = "/";
    }
    
    //website manager
    this.setSelectedWebsite = function (website) {
        
        localStorage.setItem("PanelWebsite", JSON.stringify(website));
    }

    this.getSelectedWebsite = function () {
        
        var website = localStorage.getItem("PanelWebsite");
        
        if (website === null)
            return false;
        else
            return JSON.parse(website);
    }

});
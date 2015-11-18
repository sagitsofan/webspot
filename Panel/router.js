var path = require('path');

var Router = (function () {
    
    function _initialize(app) {
        
        //marketing website
        app.get('/', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/www/index.html'));
        });
        
        //login page
        app.get('/login', function (req, res) {
            
            //clear data from session
            req.session.user = null;
            req.session.website = null;

            res.sendFile(path.join(__dirname + '/client/login/login.html'));
        });
        
        app.get('/code', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/client/code/code.html'));
        });
        
        app.get('/cms', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/client/master/master.html'));
        });
        
        app.get('/dashboard', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/client/master/master.html'));
        });

        
        ////partials handle
        //app.get('/client/cms/views/:partialPath', function (req, res) {

        //    res.sendFile(path.join(__dirname + '/client/cms/views/' + req.params.partialPath));
        //})

        ////directives handle
        //app.get('/client/cms/directives/:directivesPath', function (req, res) {

        //    res.sendFile(path.join(__dirname + '/client/cms/directives/' + req.params.directivesPath));
        //})
        
        app.get('*', function (req, res) {

            res.status(404).send('Not found');
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = Router;
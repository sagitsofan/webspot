var path = require('path');

var Router = (function () {
    
    function _initialize(app) {
        
        //root handle
        app.get('/', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/client/master/master.html'));
        });

        app.get('/login', function (req, res) {
            
            //clear data from session
            req.session.user = null;
            req.session.website = null;

            res.sendFile(path.join(__dirname + '/client/master/login.html'));
        });
        
        app.get('/code', function (req, res) {
            
            res.sendFile(path.join(__dirname + '/client/partials/code.html'));
        });
        
        //partials handle
        app.get('/client/partials/:partialPath', function (req, res) {

            res.sendFile(path.join(__dirname + '/client/partials/' + req.params.partialPath));
        })

        //directives handle
        app.get('/client/Directives/:directivesPath', function (req, res) {

            res.sendFile(path.join(__dirname + '/client/directives/' + req.params.directivesPath));
        })
        
        //todo: REMARK
        app.get('*', function (req, res) {

            res.status(404).send('Not found');
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = Router;
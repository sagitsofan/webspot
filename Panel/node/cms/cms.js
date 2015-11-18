var baseDal =   require('../classes/baseDal.js');
var dal     =   require('../classes/dal.js');

// Handle uploads through Flow.js
process.env.TMPDIR = 'tmp';
var multipart       = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow            =      require('../lib/flow-node/flow-node.js')('tmp');
var fs              =        require('fs');
// Handle uploads through Flow.js

var Api = (function () {
    
    function _initialize(app) {
        
        //panel base methods
        app.post('/panel/session', function (req, res) {
            
            req.session.website = req.body.website;
            res.json(true);
        });
        
        app.post('/panel/login', function (req, res) {
            
            baseDal.login(req.body.email, req.body.password, function (results) {
                
                if (results.error == undefined) {
                    //save config in session
                    req.session.user = results;
                    req.session.website = results.websites[0];
                }
                
                res.json(results);
            });
        });
        
        app.get('/panel/schema', function (req, res) {
            
            baseDal.schemas(req.session.website.host, function (results) {
                
                res.json(results);
            });
        });
        
        app.post('/panel/register', function (req, res) {
            
            baseDal.addUser(req.body.user, function (item) {
                res.json(item);
            });
        });
        
        app.post('/panel/upload', multipartMiddleware, function (req, res) {
            
            flow.post(req, function (status, filename, original_filename, identifier) {
                
                var stream = fs.createWriteStream('./public/uploads/' + filename);
                
                stream.on('finish', function () {
                    res.status(status).send();
                });
                
                flow.write(identifier, stream, { end: true });
            });
        });
        
        app.get('/panel/user', function (req, res) {
            
            baseDal.getUser(req.session.user._id, function (result) {
                
                res.json(result);
            });
        });
        
        app.post('/panel/updateUser/', function (req, res) {
            
            baseDal.updateUser(req.session.user._id, req.body.data, function (item) {
                res.json(item);
            });
        });
        
        //generic methods
        app.post('/api/update/:schema/:id', function (req, res) {
            
            dal.updateRowData(req.params.schema, req.params.id, req.body.data, req.session.website.host, function (item) {
                res.json(item);
            });
        });
        
        app.post('/api/delete/:schema/:id', function (req, res) {
            
            dal.deleteRowData(req.params.schema, req.params.id, req.session.website.host, function (item) {
                res.json(item);
            });
        });
        
        app.post('/api/add/:schema/', function (req, res) {
            
            dal.addRowData(req.params.schema, req.body.data, req.session.website.host, function (item) {
                res.json(item);
            });
        });
        
        app.post('/api/sort/:schema/', function (req, res) {
            
            dal.sortRows(req.params.schema, req.body.data, req.session.website.host, function (item) {
                res.json(item);
            });
        });

        app.get('/api/:schema', function (req, res) {
            
            dal.getData(req.params.schema, req.session.website.host, function (results) {
                res.json(results);
            });
        });
        
        app.get('/api/:schema/:id', function (req, res) {
            
            dal.getRowData(req.params.schema, req.params.id, req.session.website.host, function (item) {
                res.json(item);
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = Api;
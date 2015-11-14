var baseDal     = require('../panel/classes/baseDal.js');
var dal     =   require('../panel/classes/dal.js');
var helper  = require('../panel/classes/helper.js');

var Rest = (function () {
    
    function _initialize(app) {
        
        app.get('/api/:schema', function (req, res) {
            
            var subdomain = "myfirstwebsite";//helper.getSubdomain(req.headers.host); //todo:
            
            baseDal.getUserByWebsite(subdomain, function (user) {
                
                dal.getData(req.params.schema, user.websites[0].host, function (results) {
                    res.json(results);
                });

            });
        });
        
        app.get('/api/:schema/:id', function (req, res) {
            
            var subdomain = "myfirstwebsite";//helper.getSubdomain(req.headers.host); //todo:
            
            baseDal.getUserByWebsite(subdomain, function (user) {
                
                dal.getRowData(req.params.schema, req.params.id, user.websites[0].host, function (item) {
                    res.json(item);
                });

            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = Rest;
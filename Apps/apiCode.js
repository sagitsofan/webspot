var path        = require('path');
var baseDal     = require('../panel/classes/baseDal.js');
var generator   = require('./classes/generator.js');
var helper   = require('../panel/classes/helper.js');

var ApiCode = (function () {
    
    function _initialize(app) {
        
        function renderResource(userid, url, specialFile, res) {
            if (specialFile) {
                //serve static content
                res.sendFile(path.join(__dirname + '/Public/assets/uploadimages/' + url));
            }
            else {
                //serve dynamic content
                generator.generate(userid, url, function (data) {
                    res.send(data);
                });
            }
        }

        //handle sub domain
        app.get('/*', function (req, res, next) {
            
            var subdomain = helper.getSubdomain(req.headers.host);

            if (subdomain != "") {
                
                //default web page. todo: take from files meta data.
                if (req.params[0] == "")
                    req.params[0] = "default.html";
                
                baseDal.getUserByWebsite(subdomain, function (user) {
                    
                    if (user != null) {
                        
                        var arrSpecialFiles = helper.getSpecialFilesArray();
                        var ext = req.params[0].split('.')[1];
                        var specialFile = helper.isItemInArray(arrSpecialFiles, ext);
                        
                        renderResource(user._id, req.params[0], specialFile, res);
                    } 
                    else {
                        
                        res.send("ERR: USER NOT FOUND");
                    }
                });
            }
            else {
                
                next();
            }
        });
        
        //temp viewer for users
        app.get('/code/view/:userid/*', function (req, res) {
            
            var arrSpecialFiles = helper.getSpecialFilesArray();
            var ext = req.params[0].split('.')[1];
            var specialFile = helper.isItemInArray(arrSpecialFiles, ext);
            
            renderResource(req.params.userid, req.params[0], specialFile, res);
        });
    }
   
    return {
        initialize: _initialize
    };
})();

module.exports = ApiCode;
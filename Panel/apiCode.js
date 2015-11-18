var fs          = require('fs');
var baseDal     = require('./classes/baseDal.js');
var helper      = require('./classes/helper.js');
var _           = require('underscore');

// Handle uploads through Flow.js
process.env.TMPDIR = 'tmp';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./Public/assets/node/flow-node.js')('tmp');
var fs = require('fs');
// Handle uploads through Flow.js

var ApiCode = (function () {

    function _initialize(app, io) {
        
        io.on('connection', function (socket) {
            
            socket.on('init', function (userid) {
                
                baseDal.getUser(userid, function (user) {
                    
                    baseDal.files(user.websites[0].host, function (files) {
                        
                        io.emit('GetTree', files);
                    });
                });
            });
        });
        
        //app.post('/code/tree', function (req, res) {
            
        //    baseDal.getUser(req.body.userid, function (user) {
                
        //        baseDal.files(user.websites[0].host, function (files) {
                    
        //            res.json(files);
        //        });
        //    });
        //});
        
        app.post('/code/manage', function (req, res) {
            
            baseDal.getUser(req.body.userid, function (user) {
                
                baseDal.manageFiles(req.body.data, req.body.action, user.websites[0].host, function (results) {
                    
                    res.json(results);
                });
            });
        });
        
        app.post('/code/upload', multipartMiddleware, function (req, res) {
            
            flow.post(req, function (status, filename, original_filename, identifier) {
                
                baseDal.getUser("55fb0bbcca62f8b82759032f", function (user) { //TODO: change HC id
                    
                    var data = {};
                    data._id = null;
                    data.name = filename;
                    data.parent = req.query.parent;
                    
                    var arrSpecialFiles = helper.getSpecialFilesArray();
                    var ext = filename.split('.')[1];
                    var isSpecialFile = helper.isItemInArray(arrSpecialFiles, ext);

                    var encode = (isSpecialFile) ? "" : "utf8";

                    fs.readFile(__dirname + '/tmp/flow-' + identifier + ".1", encode, function (err, content) {
                        
                        if (isSpecialFile) {
                            
                            data.type = "reference";
                            data.content = filename;
                            
                            //save to disk
                            fs.writeFile(__dirname + '/Public/assets/uploadimages/' + filename, content, 'base64', function (err) { }); //todo: set personal folder for current user 
                        }
                        else { 
                            
                            data.type = "file";
                            data.content = content;
                        }
                        
                        //save to tree in mongo
                        baseDal.manageFiles(data, "add", user.websites[0].host, function (results) {
                            res.json(data);
                        });
                    });
                });
            });
        });
    }
   
    return {
        initialize: _initialize
    };
})();

module.exports = ApiCode;
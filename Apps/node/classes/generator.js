var dal         = require('../../../panel/node/classes/dal.js');
var baseDal     = require('../../../panel/node/classes/baseDal.js');
var _           = require('underscore');
var cheerio     = require('cheerio');
var async       = require('async/lib/async.js');

var generator = (function () {
    
    function _getfileNameFromQS(url)
    {
        var fileName = "";
        
        if (url.indexOf("/") > 0) {
            fileName = url.substring(url.lastIndexOf("/") + 1, url.length);

        } else {
            fileName = url;
        }
        return fileName;
    }
    
    function _replaceAll(str, replaceWhat, replaceTo) {
        
        replaceWhat = "[[" + replaceWhat + "]]";

        replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp(replaceWhat, 'g');
        return str.replace(re, replaceTo);
    }
    
    function _getRepeaters(user, finalMarkup, callbackRepeaters) {

        var $ = cheerio.load(finalMarkup);
        var arrRepeat = $("*[repeat]");
        
        if (arrRepeat.length > 0) {
            var returnHtml = "";
            
            async.each(arrRepeat, function (rpt, callback) {
                
                var schemaName = $(rpt).attr("repeat");
                var itemMarkup = $.html($(rpt));
                
                _handleRepeat(user, schemaName, itemMarkup, function (itemMarkupFixed) {
                    
                    $(rpt).after(itemMarkupFixed);
                    $(rpt).remove();
                    
                    callback();
                })

            }, function (err) {
                
                callbackRepeaters($.html());
            });
        } else {

            callbackRepeaters(finalMarkup);
        }
    }

    function _handleRepeat(user, schemaName, itemMarkup, callback) {
        
        async.waterfall([
            function (callback) {
                
                //get schema
                baseDal.getSchemaOrFieldByName(schemaName, user.websites[0].host, function (schema) {
                    callback(null, schema);
                });
            },
            function (schema, callback) {
                
                dal.getData(schemaName, user.websites[0].host, function (data) {
                    callback(null, schema, data);
                });
            }
        ], 
        function (err, schema, data) {
            
            var finalMarkup = "";
            if (schema != null) {
                
                var fields = schema.fields || schema.schema.fields; //(schema.schema == undefined ? schema.fields : schema.schema.fields );
                
                for (var j in data) {
                    
                    var currentMarkup = itemMarkup;
                    
                    for (var k in fields) {
                        
                        var replaceWhat = schemaName + "." + fields[k].name;
                        var replaceTo = data[j][fields[k].name];
                        
                        currentMarkup = _replaceAll(currentMarkup, replaceWhat, replaceTo);
                    }
                    
                    finalMarkup += currentMarkup
                }
            }
            
            callback(finalMarkup);
        });
    }

    function _generate(userid, url, callback) {

        var fileName = _getfileNameFromQS(url);
        
        async.waterfall([
            function (callback) {
                
                //get user data
                baseDal.getUser(userid, function (user) {
                    callback(null, user);
                });
            },
            function (user, callback) {
                
                //get files data
                baseDal.files(user.websites[0].host, function (files) {
                    callback(null, user, files);
                });
            },
            function (user, files, callback) {
                
                //get schema data
                baseDal.getSchemaByName(fileName, user.websites[0].host, function (schema) {
                    callback(null, user, files, schema);
                });
            },
            function (user, files, schema, callback) {
                
                //get values
                dal.getData(fileName, user.websites[0].host, function (data) {
                    callback(null, user, files, schema, data);
                });
            }
        ], 
        function (err, user, files, schema, data) {
            
            var currentPage = _.filter(files.root, function (item) {
                return item.name === fileName;// && item.parent == path;
            });
            
            if (currentPage.length > 0) {
                
                if (schema != null) {
                    
                    var finalMarkup = "";
                    
                    //check for masterpage
                    var masterPage = _.filter(files.root, function (item) {
                        return item.name === 'master.html'; //todo: get name from metadata
                    });
                    
                    //masterpage exists
                    if (masterPage != null) {
                        finalMarkup = masterPage[0].content.replace("<content></content>", currentPage[0].content);
                    }
                    else { //masterpage doesnt exists
                        finalMarkup = currentPage[0].content;
                    }
                    
                    //handle dynamic data
                    if (data.length > 0) {
                        var fields = schema.schema.fields;
                        
                        //handle single props
                        for (var i in fields) {
                            
                            var replaceWhat = fields[i].name;
                            var replaceTo = data[0][fields[i].name];

                            finalMarkup = _replaceAll(finalMarkup, replaceWhat , replaceTo);
                        }
                        
                        //handle repeat
                        _getRepeaters(user, finalMarkup, function (html) {
                            callback(html);
                        });
                    }
                }
                else {
                    
                    //send regullar file
                    callback(currentPage[0].content);
                }
            }
            else {
                
                callback("ERR: RESOURCE WAS NOT FOUND");
            }
        });
    }

    return {
        generate: _generate
    };
})();

module.exports = generator;
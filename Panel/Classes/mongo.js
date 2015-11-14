var config = require('./config.js');

var Mongo = (function () {
    var MongoClient = require('mongodb').MongoClient;

    function _connect(callback, host) {
        
        //ensure default value
        host = (typeof host === 'undefined') ? config.appSettings().mongodb.host : host;

        MongoClient.connect(host, function (err, db) {
            callback(db, err);
        });
    }
    
    function _connectBase(callback) {
        
        _connect(callback, config.appSettings().mongodb.host);
    }
    
    return {
        connect: _connect,
        connectBase: _connectBase
    };
})();

module.exports = Mongo;
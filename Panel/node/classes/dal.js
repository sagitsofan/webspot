var adapter = require('./mongo.js');
var ObjectID = require('mongodb').ObjectID;

var Dal = (function () {

    function _getData(schema, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var arr = [];
            var collection = db.collection(schema);
            var items = collection.find().sort({ indexNumber: 1 });
            
            items.each(function (err, item) {
                if (item != null) {
                    arr.push(item);
                     
                } else {
                    callback(arr)
                }
            });
        }, host);
    }
    
    function _getRowData(schema, id, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var arr = [];
            var collection = db.collection(schema);
            var items = collection.find({ "_id" : ObjectID(id) });
            
            items.each(function (err, item) {
                if (item != null) {
                    arr.push(item);
                     
                } else {
                    callback(arr)
                }
            });
        }, host);
    }
    
    function _updateRowData(schema, id, obj, host, callback) {
    
        adapter.connect(function (db, err) {
            
            var collection = db.collection(schema);
            var fields = {};
            
            Object.keys(obj).forEach(function (key) {
                if (key != "_id") {
                    fields[key] = obj[key];
                }
            });

            collection.update({ "_id"  : ObjectID(id) }, { $set: fields });
    
            callback(true);
        }, host);
    }
    
    function _deleteRowData(schema, id, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var collection = db.collection(schema);
            
            collection.remove({ "_id"  : ObjectID(id) });
            
            callback(true);
        }, host);
    }

    function _addRowData(schema, obj, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var collection = db.collection(schema);
            var fields = {};
            
            Object.keys(obj).forEach(function (key) {
                fields[key] = obj[key];
            });
            
            collection.insert(fields);
            
            callback(fields);
        }, host);
    }
    
    function _sortRows(schema, sort, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var collection = db.collection(schema);
            
            for (var i in sort) {
                
                collection.update(
                    { _id: ObjectID(sort[i].id) },
                    { $set: { "indexNumber": sort[i].indexNumber } }
                )
            }
            
            callback(true);
        }, host);
    }

    return {
        getData: _getData,
        getRowData: _getRowData,
        updateRowData: _updateRowData,
        deleteRowData: _deleteRowData,
        addRowData: _addRowData,
        sortRows: _sortRows,
    };
})();

module.exports = Dal;
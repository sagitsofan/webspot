var adapter = require('./mongo.js');
var ObjectID = require('mongodb').ObjectID;

var baseDal = (function () {

    function _login(email, password, callback) {
        
        adapter.connectBase(function (db, err) {
            
            db.collection("users").findOne({ "email" : email, "password": password }, function (err, user) {
                
                if (user == null) {

                    var data = { error: { message: "User was not found or not exists" } };
                    callback(data);
                }
                else {
                    
                    callback(user);
                }
            });
        });
    }
    
    function _addUser(user, callback) {
        
        adapter.connectBase(function (db, err) {
            
            //check user email not exists
            db.collection("users").findOne({ "email" : user.email }, function (err, data) {
                
                if (data == null) {
                    
                    var collection = db.collection("users");
                    var fields = {};
                    
                    Object.keys(user).forEach(function (key) {
                        fields[key] = user[key];
                    });
                    
                    collection.insert(fields);
                    
                    data = { status : { message: "User was created successfully" } };
                }
                else {
                    data = { status : { message: "Please choose different email" } };
                }

                callback(data);
            });
        });
    }

    function _schemas(host, callback) {
        
        adapter.connect(function (db, err) {
            
            var arr = [];
            var collection = db.collection("schemas");
            var items = collection.find();
            
            items.each(function (err, item) {
                if (item != null) {
                    arr.push(item);
                     
                } else {
                    callback(arr)
                }
            });
        }, host);
    }
    
    function _files(host, callback) {
        
        adapter.connect(function (db, err) {
            
            var arr = [];
            var collection = db.collection("files");
            var items = collection.find();
            
            items.each(function (err, item) {

                if (item != null) {

                    callback(item)
                }
            });
        }, host);
    }
    
    function _manageFiles(data, action, host, callback) {
        
        adapter.connect(function (db, err) {

            var collection = db.collection("files");
            
            switch (action) {

                case "update":
                    {
                        collection.update(
                            { "_id": ObjectID(data.rootId), "root._id": ObjectID(data.id) },
                            { $set: { "root.$.content" : data.content } }
                        )
                        
                        callback(true);
                        
                        break;
                    }
                case "rename":
                    {
                        collection.update(
                            { "_id": ObjectID(data.rootId), "root._id": ObjectID(data.id) },
                            { $set: { "root.$.name" : data.name } } //, "root.$.ext" : data.ext
                        )
                        
                        callback(true);

                        break;
                    }
                case "add":
                    {
                        //generate new id
                        data._id = ObjectID();

                        collection.update(
                            {},
                            { "$push": { root : { _id: data._id, name: data.name, type: data.type, parent: data.parent, content: data.content  } } }
                        )
                        
                        callback(data);

                        break;
                    }
                case "delete":
                    {
                        collection.update(
                            { "_id": ObjectID(data.rootId) },
                            { "$pull": { "root": { "_id": ObjectID(data.id) } } }
                        )
                        
                        callback(true);

                        break;
                    }
            }

        }, host);
    }

    function _getSchemaByName(name, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var collection = db.collection("schemas");
            
            collection.findOne({ name : name }, function (err, item) {
                
                callback(item)
            });

        }, host);
    }
    
    function _getSchemaOrFieldByName(name, host, callback) {
        
        adapter.connect(function (db, err) {
            
            var collection = db.collection("schemas");
            
            collection.findOne({ name : name }, function (err, item) {
                
                if (item == null) {
                    
                    collection.find({ 'schema.fields': { $elemMatch: { name: { $regex : '^' + name + '$', $options : 'i' } } } }).toArray(function (err, result) {
                        
                        if (result != undefined && result.length > 0) {
                            
                            var r = result[0];
                            for (var i = 0; i < r.schema.fields.length; i++) {
                                
                                if (r.schema.fields[i].name == name) {
                                    
                                    callback(r.schema.fields[i]);
                                }
                            }
                        }
                        else {
                            callback(null);
                        }
                    });
                }
                else {
                    callback(item)
                }
            });

        }, host);
    }

    function _getUser(id, callback) {
        
        adapter.connectBase(function (db, err) {
            
            var collection = db.collection("users");
            
            collection.findOne({ "_id" : ObjectID(id) }, function (err, user) {
                
                callback(user);
            })
        });
    }
    
    function _getUserByWebsite(websitename, callback) {
        
        adapter.connectBase(function (db, err) {
            
            var collection = db.collection("users");
            
            collection.find({ websites: { $elemMatch: { name: { $regex : '^' + websitename + '$', $options : 'i' } } } }).toArray(function (err, result) {
                    
                if (result.length > 0) { callback(result[0]); }
                else callback(null);

            });
        });
    }
    
    function _updateUser(id, obj, callback) {
        
        adapter.connectBase(function (db, err) {
            
            var collection = db.collection("users");
            var fields = {};
            
            Object.keys(obj).forEach(function (key) {
                if (key != "_id") {
                    fields[key] = obj[key];
                }
            });
            
            //make sure every website has unique id
            for (i = 0; i < fields.websites.length; i++) {
                if (fields.websites[i]._id == undefined)
                    fields.websites[i]._id = ObjectID().toString();
            }
            
            collection.update({ "_id"  : ObjectID(id) }, { $set: fields });
            
            callback(true);
        });
    }
    
    return {
        login: _login,
        schemas: _schemas,
        getSchemaByName: _getSchemaByName,
        addUser: _addUser,
        getUser: _getUser,
        updateUser: _updateUser,
        files: _files,
        manageFiles: _manageFiles,
        getUserByWebsite: _getUserByWebsite,
        getSchemaOrFieldByName: _getSchemaOrFieldByName
    };
})();

module.exports = baseDal;
//global vars
var port = process.env.port;
global.appRoot = __dirname;

//require engines
var express = require('express');
var rest = require('./rest.js');
var config = require('./classes/config.js');
var apiCode = require('./apiCode.js');

//init express engine
var app = express();

//using
app.use(express.static('public'));

//init apps
rest.initialize(app);
apiCode.initialize(app);

//port listen
var activeport = null;

if (config.appSettings().env == "dev") {
    activeport = config.appSettings().port
}
else {
    activeport = process.env.PORT;
}


//port listen
app.listen(activeport, function () {
    console.log('listening at port', activeport);
});

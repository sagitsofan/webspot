//global vars
var port            = process.env.port;
global.appRoot      = __dirname + "/node";

//require engines
var express         = require('express');
var bodyParser      = require('body-parser')
var cookieParser    = require('cookie-parser')
var session         = require('express-session')

var router          = require('./router.js');
var apiCode         = require('./node/code/code.js');
var api             = require('./node/cms/cms.js');
var config          = require('./node/classes/config.js');


//init express engine
var app = express();

//settings
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//using
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({ secret: '1234567890QWERTY', resave: false, saveUninitialized: true }));


//init apps
api.initialize(app);
apiCode.initialize(app);
router.initialize(app);


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

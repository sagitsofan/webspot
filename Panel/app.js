//global vars
var port            = process.env.port;
global.appRoot      = __dirname;

//require engines
var express         = require('express');
var apiCode         = require('./apiCode.js');
var api             = require('./api.js');
var router          = require('./router.js');
var config          = require('./classes/config.js');
var bodyParser      = require('body-parser')
var cookieParser    = require('cookie-parser')
var session         = require('express-session')

//init express engine
var app = express();

//settings
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//using
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({ secret: '1234567890QWERTY', resave: false, saveUninitialized: true }));

//port listen
var activeport = config.appSettings().env == "dev" ? config.appSettings().port : process.env.PORT

//port listen
var server = app.listen(activeport, function () {
    console.log('listening at port', activeport);
});

//socket configuration
var io = require('socket.io')(server);

//init apps
api.initialize(app);
apiCode.initialize(app, io);
router.initialize(app);

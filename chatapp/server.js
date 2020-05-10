/*
 * dotenv setup to manage environments
 */
var argv = require('yargs')
    .command('environment', function (yargs) {
        yargs.options({
            location: {
                demand: true,
                alias: 'e',
                type: 'string'
            }
        });
    })
    .help('help')
    .argv;
envFileName = argv.e;
require('dotenv').config({
    path: ".env." + envFileName
});


/*
 * define all global and local variables
 */
var express = require('express');
var path = require('path');
global.logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var port = process.env.PORT || 3001;
var isSSLEnable = process.env.IS_SSL || false;
global.http = require('http');

global.fs = require('fs');
global.app = express();
// app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/swagger'));
global.bodyParser = require('body-parser');
global.cors = require('cors');
global.router = express.Router();
global.helper = require('./app/helpers/_helpers');
socketEvents = require('./app/socket.io');
//global._mongoose = require('./app/helpers/_mongoose');
//global.langCode = '';
global.appMessage = require('./app/helpers/language/' + process.env.MSGLANG + ".msg.js");

global.mongoose = require('mongoose');
mongoose.connect(process.env.mongo_server, {
    useMongoClient: true,
});
//var mongo = require('mongodb');
//
//var Server = mongo.Server,
//    Db = mongo.Db
//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('demoapp', server);

mongoose.Promise = require('bluebird');
global.Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(logger('dev'));

var ip = require("ip");
global.requestUserIp = ip.address();

//global.requestIp = require('request-ip');
//app.use(requestIp.mw());
//app.use(function(req, res) { 
//    global.ip = req.clientIp; 
//    res.end(ip); 
//    console.log("Getting..." + ip); 
//});
/*
 * for angular
 */
//app.options(cors({origin: '*'}));
app.use(cors({
    origin: '*'
}));


// swagger definition
var swaggerDefinition = {
    info: {
        title: 'TeamWorkChat API Collection',
        version: '2.0.0',
        description: '',
    },
    // host: process.env.SERVER_URL +':'+ process.env.NODE_PORT,
    host: 'http://13.55.238.41:3001',
    basePath: '',
    schemes: ['http', 'https'],
    consumes: [
        "application/json",
        "application/xml"
    ],
    produces: [
        "application/json",
        "application/xml"
    ],
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./app/admin/component/masterData/*.js',
         './app/admin/component/users/*.js',
        './app/admin/component/company/*.js',
        './app/admin/component/groups/*.js',
        './app/admin/component/messages/*.js']

};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
/**
 * For validation using middleware
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Expose-Headers", "x-access-token");
    // res.header('Access-Control-Allow-Origin','*');
    // res.header('Access-Control-Allow-Headers','Content-Type');
    // res.header('Access-Control-Allow-Methods','GET','POST','PUT','DELETE','OPTIONS');
    next();
});

global.auth = require('./app/middleware/auth.js');
app.use(auth('on'));

var colors = require('colors');
var settings = require('./config/settings');
global._ = require('lodash');
global.asyncLoop = require('node-async-loop');
global.models = require('./app/models/');
global.admin = require('./app/admin/');
// var masterData = require('./app/admin/component/masterData/masterData.ctrl');
// masterData.masterSchema();
// global.socket = ''






var http = require('http')
global.https = require('https');

global.io = require('socket.io').listen(http);

var server = http.createServer(app);

console.log("ENV : " + process.env.ENVIRONMENT);
if (isSSLEnable == "true") {
    //ssl
    var server = https.createServer({
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
    }, app);
} else {
    //non ssl
    var server = http.createServer(app);
}

global.io = require('socket.io').listen(server);
socketEvents(io);

server.listen(port, function () {
    console.log('listening on +:  ' + port + " and SSL is "+isSSLEnable);
});
// server.listen(settings.port, function () {
//     console.log(("Listening on port-----------------" + settings.port).green);
// }).on('error', function (e) {
//     if (e.code == 'EADDRINUSE') {
//         console.log('Address in use. Is the server already running?'.red);
//     }
// });












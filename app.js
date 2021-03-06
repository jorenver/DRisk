var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');
var session = require('express-session');

var app = express();
var http = require('http').Server(app);

/*Session*/
var redis = require('redis');
var ip = require('ip');
var client = redis.createClient();
var redisStore = require('connect-redis')(session);
var sessionMiddleware = session({
	secret: 'bobneuman',
	store: new redisStore({
			host:'localhost',
			port: 6379,
			client:client,
			ttl: 1000 }),
	saveUninitialized: false,
	resave: false
});
/*Session*/

app.use(sessionMiddleware);

var router=require('./app/router.js');
var serverSocket=require('./app/serverSocket.js');

app.set('port', 7000);
app.set('ipAddress',ip.address()); // my ip address

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*Statics*/
app.use(express.static('./app/public'));
/*Template engine*/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.use('/',router);

http.listen(app.get('port'),function(){
    console.log("DRisk Aplication running in a port " + app.get('port'));
});

var io = require('socket.io')(http);
serverSocket.createServerSocket(io,sessionMiddleware);
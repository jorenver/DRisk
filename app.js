var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');

var app = express();
var http=require('http').Server(app);

var router=require('./app/router.js');

app.set('port', 7000);

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
var fs = require('fs');
var jsonfile = require('jsonfile');
jsonfile.spaces = 2;
var path = require('path');
var __dirnameSVG = "app/public/svg/";
var __dirnameJSON = "app/public/JSON/";


exports.customizeMap = function(request,response){
	response.render("customizeMap.html");
}

exports.saveFileSVG = function(request,response){
	var svgString = request.body.svg;
	var fileName =  "mapConfigured"  + getDateTime() + ".svg";
    var graphJSON = request.body.graph;
    //save svg file
	fs.writeFile(path.resolve(__dirnameSVG,fileName),svgString, function (err) {
        if (err) console.log(err);
        console.log('Saved svg file!');
    });
    //save json file
    jsonfile.writeFile(__dirnameJSON + "configured.json",{ Graph: graphJSON } ,function(){
        console.log("Saved json file!")
    });

    response.json({fileName: fileName});
}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
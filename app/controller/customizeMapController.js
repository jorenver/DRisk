var fs = require('fs');
var path = require('path');
var __dirname = "app/public/svg/";

exports.customizeMap = function(request,response){
	response.render("customizeMap.html");
}

exports.saveFileSVG = function(request,response){
	var svgString = request.body.svg;
	var fileName =  "mapConfigured"  + getDateTime() + ".svg";
	fs.writeFile(path.resolve(__dirname,fileName),svgString, function (err) {
        if (err) console.log(err);
        console.log('Saved!');
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
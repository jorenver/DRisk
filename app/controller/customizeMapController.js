var fs = require('fs');
var jsonfile = require('jsonfile');
jsonfile.spaces = 2;
var path = require('path');
var __dirnameSVG = "app/public/svg/maps";
var __dirnameJSON = "app/public/JSON/";


exports.customizeMap = function(request,response){
    if(request.session.idMatch!=null){
        response.render("customizeMap.html");
    }else{
        response.redirect('/');
    }
}

exports.saveFileSVG = function(request,response){
	var svgString = request.body.svg;
	var fileName =  "mapConfigured"  + getDateTime() ;
    var graphJSON = request.body.graph;
    //save svg file
	fs.writeFile(path.resolve(__dirnameSVG,fileName+ ".svg"),svgString, function (err) {
        if (err) console.log(err);
        console.log('Saved svg file!');
    });
    //save json file
    jsonfile.writeFile(__dirnameJSON +fileName +"Graph.json",{ Graph: graphJSON } ,function(){
        console.log("Saved json file!")
    });

    response.json({"fileName": fileName});
}

function getDateTime() {
    return Date.now();
}
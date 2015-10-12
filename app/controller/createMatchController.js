var model = require('../model/model');


exports.createMatch = function(request,response){
	model.createMatch(request,response);
}

exports.setDataMatch = function(request,response){	
	model.setDataMatch(request,response);
}
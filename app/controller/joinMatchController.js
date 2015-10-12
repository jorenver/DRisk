var model = require('../model/model');

exports.joinMatch = function(request,response){
	var nick= request.body.nick;
	if(!request.session.player){
		request.session.player = nick;
	}
	response.render('chooseMatch',{nick:nick});
}

exports.getMatches = function(request, response){
	console.log("getMatches");
	var nickname = request.body.nick;
	if(nickname){
		model.getPublishedMatches(request, response);

	}
}
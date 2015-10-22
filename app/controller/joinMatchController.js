var model = require('../model/model');

exports.joinMatch = function(request,response){
	var nick= request.body.nick;
	if(!request.session.nick){
		request.session.nick = nick;
	}
	response.render('chooseMatch',{nick:nick});
}

exports.getMatches = function(request, response){
	console.log("getMatches");
	var nickname = request.query.nick;
	var page = request.query.page;
	if(nickname){
		model.getPublishedMatches(request, response, page);
	}
}
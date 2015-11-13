var model = require('../model/model');

exports.joinMatch = function(request,response){
	var nick= request.body.nick;
	//if(!request.session.nick){
		console.log('1111111111111',request.session.nick)
		request.session.nick = nick;
	//}
	console.log("xxxxxxxxxxxxx problema clhoosen");
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
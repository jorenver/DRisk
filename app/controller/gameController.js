var model = require('../model/model');

exports.Start= function(request,response){

	//response.render('game',{idMatch:request.idMatch,nick:request.session.nick});
	console.log(request.session.nick)
	response.render('game',{idMatch:request.session.idMatch,nick:request.session.nick});

}
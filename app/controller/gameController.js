var model = require('../model/model');

exports.Start= function(request,response){
	console.log(request.session.nick)
	response.render('game',{idMatch:request.session.idMatch,nick:request.session.nick});
}
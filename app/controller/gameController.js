var model = require('../model/model');

exports.Start= function(request,response){

	response.render('game',{idMatch:request.idMatch,nick:request.session.nick});
}
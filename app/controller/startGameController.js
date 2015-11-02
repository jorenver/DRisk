var model = require('../model/model');

var Matches = model.Matches;

exports.startGame = function (request,response) {
	var idMatch = request.query.idMatch;
	if(idMatch!=null){
		
		var match = model.getMatch(idMatch);
		model.printMatch(idMatch);
		response.render('game');

	}else{
		response.redirect('/');
	}
}
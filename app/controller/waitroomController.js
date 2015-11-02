var model = require('../model/model');


var Matches = model.Matches;

exports.waitroom = function(request,response){//wait room to players not creator
	var id_match = request.query.id_match;
	var nick = request.session.nick;
	response.render('waitroom',{idMatch:id_match, nick: nick });

}

exports.getMatchData = function(request, response){//get data from a match
	var id_match= request.query.id_match;
	var matchData = model.getMatch(id_match);
	//validar no nulo, mandar 404
	if(matchData){
		response.json({match: matchData});
	}
	
}

exports.getPlayers = function(request,response){
	var idMatch = request.query.idMatch;
	var match = model.getMatch(idMatch);
	if(match!=null){
		response.json({ players : match.listPlayer});
	}
}
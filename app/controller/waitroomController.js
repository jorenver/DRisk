var model = require('../model/model');

var Matches = model.Matches;

exports.waitroom = function(request,response){
	var id_match = request.query.id_match;
	var nick = request.session.nick;
	console.log("******idMatch",id_match);
	response.render('waitroom',{idMatch:id_match, nick: nick });
}

exports.getMatchData = function(request, response){
	var id_match= request.query.id_match;
	console.log("idmatch", id_match);
	var matchData = model.getMatch(id_match);
	//validar no nulo, mandar 404
	console.log("match*****", matchData);
	response.json({match: matchData});
}

exports.getPlayers = function(request,response){
	var idMatch = request.query.idMatch;
	var match = Matches[idMatch];
	if(match!=null){
		response.json({ players : match.listPlayer});
	}
}
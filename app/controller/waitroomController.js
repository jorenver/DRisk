var model = require('../model/model');

exports.waitroom = function(request,response){
	var id_match= request.query.id_match;

	if(!request.session.player){
		request.session.player = nick;
	}
	
	response.render('waitroom',{idMatch:id_match });
}

exports.getMatchData = function(request, response){

	var id_match= request.query.id_match;
	console.log("idmatch", id_match);
	var matchData = model.getMatch(id_match);
	//validar no nulo, mandar 404
	console.log("match*****", matchData);
	response.json({match: matchData});

}
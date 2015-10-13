var model = require('../model/model');
var Matches = model.Matches;

exports.setMap = function(request,response){
	model.setMap(request,response);
}

exports.setMapGet = function(request,response){
	var nick = request.session.nick;
	var idMatch = request.session.idMatch;
	if(nick!=null && idMatch !=null){
		var match = Matches[idMatch];
		if(match != null){
			var map = match.map;
			if(map != null){
				var numPlayer = match.numPlayers;
				var mode = match.mode;
				response.render('publicMatch',{
					idMatch:request.session.idMatch,
					numPlayer:numPlayer,
					mode:mode,
					nameMap:map.name
				});
			}else{
				response.redirect('/setDataMatch');
			}
		}else{
			response.redirect('/createMatch');
		}
	}else{
		response.redirect('/');
	}
}
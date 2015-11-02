var model = require('../model/model');

exports.createMatch = function(request,response){
	model.createMatch(request,response);
}

exports.createMatchGet = function(request,response){
	var nick = request.session.nick;
	var idMatch = request.session.idMatch;
	if(nick!=null && idMatch !=null){
		response.render('createMatch',{ nick : nick, idMatch : idMatch });
	}else{
		response.redirect('/');
	}
}

exports.setDataMatch = function(request,response){	
	model.setDataMatch(request,response);
}

exports.setDataMatchGet = function(request,response){
	var nick = request.session.nick;
	var idMatch = request.session.idMatch;
	if(nick!=null && idMatch !=null){
		var match = model.getMatch(idMatch);
		if( match.mode.length && match.numPlayers){//if mode already set and numPlayers already set
			var gameMode = match.mode;
			response.render('chooseMap',{ nick : nick, mode : gameMode });
		}else{
			response.redirect('/createMatch');
		}
	}else{
		response.redirect('/');
	}
}
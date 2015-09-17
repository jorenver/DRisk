
var matches = {};

exports.index = function(request,response){
	response.render('index');
}

exports.create = function(request,response){
	request.session.match = {nickname:request.body.nickname};
	response.render('createMatch',{nickname:request.body.nickname});
}

exports.createGet = function(request,response){
	if(request.session.match){
		response.render('createMatch',{ nickname :  request.session.match.nickname });
	}else{
		response.redirect('/');
	}
}

exports.setParameters = function(request,response){
	if(request.session){
		matches[request.query.nickname] = {maxPlayer:request.query.maxPlayer,
			mode : request.query.mode,
			listPlayer : []
		};
		response.render('chooseMap',{ nickname : request.query.nickname, mode: request.query.mode });
	}else{
		response.redirect('/');
	}
}

exports.chooseMap = function(request,response){
	if(request.session.match){
		response.render('chooseMap',{ nickname : request.session.match.nickname });
	}else{
		response.redirect('/');
	}
}

exports.setMap = function(request,response){
	if(request.session.match){
		var nickname = request.session.match.nickname;
		var match = matches[nickname];
		if(match){
			match.idMapa = request.body.mapChosen;
			matches[nickname] = match;
			request.session.matches = matches;
			response.send(match);
		}else{
			response.send("error");
		}
	}else{
		response.redirect('/');
	}
}
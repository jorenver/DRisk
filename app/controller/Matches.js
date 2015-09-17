
var matches = {};

exports.index = function(request,response){
	response.render('index');
}

exports.create = function(request,response){
	request.session.match = { nickname : request.body.nickname };
	response.render('createMatch',{ nickname :  request.body.nickname });
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
		request.session.match = { nickname : request.query.nickname ,
			maxPlayer : request.query.maxPlayer, mode : request.query.mode ,
			listPlayer : []
		}
		matches[ request.query.nickname ] = { maxPlayer: request.query.maxPlayer,
			mode : request.query.mode,
			listPlayer : []
		};
		request.session.matches = matches;
		response.send(request.session.match);
	}else{
		response.redirect('/');
	}
}


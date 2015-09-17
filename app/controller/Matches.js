exports.index = function(request,response){
	response.render('index');
}

exports.create = function(request,response){
	response.render('createMatch',{ nickname :  request.body.nickname });
}

exports.setParameters = function(request,response){
	if(request.session){
		request.session.match = { nickname : request.query.nickname ,
			maxPlayer : request.query.maxPlayer, mode : request.query.mode
		}
		response.send(request.session.match);
	}else{
		response.redirect('/');
	}
}
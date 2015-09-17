var html_dir = './app/views/';

exports.list = function(request, response){
	var nick = request.query.nick;
	response.render('chooseGames', {nickname: nick} );

};

exports.matches = function(request, response){
	var matches = request.session.matches;
		
		var list = [];

		for(var key in matches){
			console.log("******",matches[key]);
			var match = matches[key];
			var element = {
			     nickName: key,
			     gameMode: match.mode,
			     players: 0,
			     totalPlayers: match.maxPlayer 	
			};
			list.push(element);

		}
	var j = {games:list};
	response.json(j);

	
};
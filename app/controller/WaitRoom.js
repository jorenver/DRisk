var html_dir = './app/views/';

exports.waitroom = function(request, response){
	
	var idGame = request.query.idmatch;
	var name = request.query.idcreator;
	console.log("waitron idGmae", idGame);
	console.log("unirse***", idGame , name);

	response.render('waitroom', {idGame: request.query.idmatch});
	var matches = request.session.matches;
	matches[idGame].listPlayer.push(name); 
	console.log(matches[idGame].listPlayer);

};


exports.players = function(request, response){
	
	var idGame = request.query.idGame;
	console.log("idGame***",idGame);
	
	var matches = request.session.matches;

	console.log("players", matches[idGame].listPlayer);
	var list = matches[idGame].listPlayer;
	
	var dataGame = {
		mode: "Mundial Domination"
	}

	var j = {players:list, dataGame: dataGame};
	response.json(j);	
};
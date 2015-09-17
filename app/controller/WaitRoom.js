var html_dir = './app/views/';

exports.waitroom = function(request, response){
	response.render('waitroom', {idGame: request.query.idmatch});
};


exports.players = function(request, response){
	
	var idGame = request.query.idGame;
	
	var list = [ "Mafia Chumi", "Fajada1", "Fajada2", "Fajada3", "Fajada4", "Fajada5"];
	var dataGame = {
		mode: "Mundial Domination"
	}
	var j = {players:list, dataGame: dataGame};
	response.json(j);	
};
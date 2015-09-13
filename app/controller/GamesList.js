var html_dir = './app/views/';

exports.list = function(request, response){
	response.render('games', {nickname: "Oswaldo"});
};


exports.matches = function(request, response){
	var list = [
			    {
			     idCreator:1,
			     idMatch:1,
			     nickName: "Mafia Chumi",
			     gameMode: "Mundial Domination",
			     players: 4,
			     totalPlayers: 5
			    },
			    {
			     idCreator:2,
			     idMatch:2,
			     nickName: "Eloy",
			     gameMode: "Mundial Domination",
			     players: 6,
			     totalPlayers: 7
			    },
			    {
			     idCreator:3,
			     idMatch:3,
			     nickName: "Mafia Chumi",
			     gameMode: "Mundial Domination",
			     players: 3,
			     totalPlayers: 5
			    }

			];
	var j = {games:list};
	response.json(j);

	
};
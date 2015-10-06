var Matches={ 
	'1': { idMatch: 1, 
		nickCreator: 'jorenver', 
		stateMatch: 'published',
		mode: "World Domination",
		numPlayers: 5,
		listPlayer:[{nick:'jorenver'},{nick:'kevanort'},{nick:'obayona'}] 
	},
	'2': { idMatch: 2, 
		nickCreator: 'eloyasd', 
		stateMatch: 'pending',
	},
	'3': { idMatch: 3, 
		nickCreator: 'rodfcast', 
		stateMatch: 'published',
		mode: "World Domination",
		numPlayers: 5,
		listPlayer:[{nick:'rodfcast'},{nick:'jorenver'},{nick:'obayona'}] 
	}
};
var cont=3;

function validarNick(nick){
	for(i in Matches){
		Match=Matches[i];
		if (Match.stateMatch=='pending') {
			if(Match.nickCreator==nick)
				return false;	
		}else{
			for(j in Match.listPlayer){
				player=Match.listPlayer[j];
				if(player.nick==nick)
					return false;
			}
		}
	}
	return true;
}

exports.createMatch = function(request,response){
	var nick= request.query.nick;
	console.log(validarNick(nick));
	if(validarNick(nick)){
		var Match={
			idMatch:cont,
			nickCreator:nick,
			stateMatch:'pending'
		};
		cont=cont+1;
		Matches[Match.idMatch]=Match;
		console.log(Matches);
		response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
	}else
		response.render('index',{error:'nick'});
}

exports.getPublishedMatches = function(request, response){
	var list = [];

	for (i in Matches){

		var match = Matches[i];

		if(match.stateMatch == 'published'){
			var m = {
				"idMatch": match.idMatch,
				"nickName": match.nickCreator,
				"gameMode": match.mode,
				"players": match.listPlayer.length,
				"totalPlayers": match.numPlayers
			};
			list.push(m);

		}
	}
	response.send({games: list});


}

exports.Matches= Matches;

var libGraph = require("graphlib");
var Graph = libGraph.Graph;

//grafo de prueba
var testMap = new Graph({ directed: false, compound: false, multigraph: false });
testMap.setNode("Cuba", {name: "Cuba", owner: null, numSoldier: 0 });
testMap.setNode("Brasil", {name: "Brasil", owner: null, numSoldier: 0 });
testMap.setNode("Chile", {name: "Chile", owner: null, numSoldier: 0 });
testMap.setNode("Colombia", {name: "Colombia", owner: null, numSoldier: 0 });
testMap.setNode("Ecuador", {name: "Ecuador", owner: null, numSoldier: 0 });
testMap.setNode("Guyana", {name: "Guyana", owner: null, numSoldier: 0 });
testMap.setNode("Paraguay", {name: "Paraguay", owner: null, numSoldier: 0 });
testMap.setNode("Bolivia", {name: "Bolivia", owner: null, numSoldier: 0 });
testMap.setNode("Peru", {name: "Peru", owner: null, numSoldier: 0 });

testMap.setEdge("Cuba", "Brasil");
testMap.setEdge("Cuba", "Colombia");
testMap.setEdge("Brasil", "Chile");
testMap.setEdge("Brasil", "Ecuador");
testMap.setEdge("Chile", "Guyana");
testMap.setEdge("Colombia", "Ecuador");
testMap.setEdge("Colombia", "Paraguay");
testMap.setEdge("Ecuador", "Guyana");
testMap.setEdge("Ecuador", "Bolivia");
testMap.setEdge("Guyana", "Peru");
testMap.setEdge("Paraguay", "Bolivia");
testMap.setEdge("Paraguay", "Peru");
var strMap =  libGraph.json.write(testMap);


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
		map: strMap,
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

exports.joinPlayer = function(idMatch, nickPlayer){

	var players = Matches[idMatch].listPlayer;
	
	for (var i=0; i< players.length; i++){
		if(players[i].nick == nickPlayer ){
			return; //error
		}
	}

	Matches[idMatch].listPlayer.push({nick: nickPlayer});
	console.log(Matches[idMatch]);

}

exports.printMatch= function(idMatch){
	console.log("***Match***" ,Matches[idMatch]);
}

exports.getMatch = function(idMatch){
	return Matches[idMatch];
}

exports.Matches= Matches;

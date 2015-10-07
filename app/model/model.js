var libGraph = require("graphlib");
var Graph = libGraph.Graph;


var strMap =  loadGraph("../public/JSON/testMap.json");


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
			"idMatch":cont,
			"nickCreator":nick,
			"numPlayer":0,
			"mode":"",
			"map":null,
			"listPlayer":[],
			"turn":"",
			"state":null,
			"stateMatch":'pending',
			"cards":[]
		};
		cont=cont+1;
		Matches[Match.idMatch]=Match;
		request.session.Match=Match;
		console.log(Matches);
		response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
	}else if(!request.session.Match)
		response.render('index',{error:'nick'});
	else
		response.render('createMatch',{nick:request.session.Match.nickCreator,idMatch:request.session.Match.idMatch});
}


exports.setDataMatch = function(request,response){
	var nick= request.query.nick;
	var idMatch= request.query.idMatch;
	var numPlayer= request.query.numPlayer;
	var gameMode= request.query.gameMode;
	var Match;
	Match=Matches[idMatch];
	console.log(Match);
	console.log(numPlayer);
	Match.numPlayer=numPlayer;
	Match.gameMode=gameMode;
	console.log(Match);
	response.render('chooseMap',{nick:nick,mode:gameMode});
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

function loadGraph(filename){
	//file: json file of graph
	var data = require(filename).Graph;
	var graph = new Graph({ directed: false, compound: false, multigraph: false });

	var nodes = data.Nodes;
	for(var i =0; i< nodes.length; i++){
		graph.setNode(nodes[i], {name: nodes[i], owner: null, numSoldier: 0 });
	}

	var edges = data.Edges;
	for(var i=0; i<edges.length; i++){
		graph.setEdge(edges[i].U, edges[i].V);
	}
	return libGraph.json.write(graph);



}


exports.Matches= Matches;

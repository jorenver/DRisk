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
var colors = [
{string: "Red" , code: "#FF0000" }, 
{string:"Green" , code:"#04B404"},
{string:"Orange" , code: "#FF8000"},
{string:"Blue" , code: "#0431B4"}, 
{string:"Pink" , code:"#F5A9A9"}, 
{string:"Yellow" , code: "#FFFF00"}, 
{string:"Brown" , code:"#3B240B"}
];

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
	var nick= request.body.nick;
	console.log(validarNick(nick));
	if(validarNick(nick)){
		var Match={
			"idMatch": cont,
			"nickCreator": nick,
			"numPlayer": 0,
			"mode":"",
			"map": null,
			"listPlayer": [],
			"turn":"",
			"state": null,
			"stateMatch": 'pending',
			"cards": []
		};
		cont=cont+1;
		Matches[Match.idMatch] = Match;
		request.session.idMatch = Match.idMatch;
		request.session.nick = Match.nickCreator;
		response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
	}else if(!request.session.idMatch){
		response.render('index',{error:'nick'});
	}else{
		response.render('createMatch',{nick:Matches[request.session.idMatch].nickCreator,idMatch:request.session.idMatch});
	}
}


exports.setDataMatch = function(request,response){
	var nick = request.session.nick;
	var idMatch = request.session.idMatch;
	var numPlayer = request.body.numPlayer;
	var gameMode = request.body.gameMode;
	var Match;

	Match = Matches[idMatch];
	if(Match!=null){
		Match.numPlayer = numPlayer;
		Match.mode = gameMode;
		console.log(Matches);
		response.render('chooseMap',{ nick:nick, mode:gameMode });
	}
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

exports.setMap = function(request,response){
	console.log(request.body.mapChosen);
	mapChosen=request.body.mapChosen;
	var Map={
		name:mapChosen,
		graph:null,
		svg:null
	}
	var match = Matches[request.session.idMatch];
	if(match!=null){
		match.map = Map;
		numPlayer=match.numPlayer;
		mode=match.mode;
		console.log(match);
		response.render('publicMatch',{idMatch:request.session.idMatch,
			numPlayer:numPlayer,
			mode:mode,
			nameMap:Map.name});
	}
}

exports.publicMatch = function(request,response){
	console.log('*****************************');
	console.log(request.session.idMatch);
	if(request.session.idMatch){
		Matches[request.session.idMatch].stateMatch='published';
		console.log(Matches[request.session.idMatch]);
		numPlayer=Matches[request.session.idMatch].numPlayer;
		mode=Matches[request.session.idMatch].mode;
		map=Matches[request.session.idMatch].map.name;
		var player={
			nick:request.session.nick,
			idTerritory:null,
			cards:[],
			numSoldier:0,
			color:colors[0]
		};
		Matches[request.session.idMatch].listPlayer.push(player);
		console.log(Matches[request.session.idMatch]);
		response.render('waitRoonCreator',{idMatch:request.session.idMatch,numPlayer:numPlayer,mode:mode,map:map,player:player});

	}else{
		response.render('index',{error:'no'});
	}
}


exports.Matches= Matches;

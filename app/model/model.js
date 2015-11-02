var libGraph = require("graphlib");
var Graph = libGraph.Graph;

var strMap =  loadGraph("../public/JSON/testMap.json");
var colors = [
	{string: "Red" , code: "#FF0000" }, 
	{string:"Green" , code:"#04B404"},
	{string:"Orange" , code: "#FF8000"},
	{string:"Blue" , code: "#0431B4"}, 
	{string:"Pink" , code:"#F5A9A9"}, 
	{string:"Yellow" , code: "#FFFF00"}, 
	{string:"Brown" , code:"#3B240B"}
];

var Matches={ 
	'1': { idMatch: 1, 
		nickCreator: 'jorenver', 
		stateMatch: 'published',
		mode: "World Domination",
		numPlayers: 5,
		listPlayer:[{
			nick:'jorenver',idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[0]},
			{nick:'kevanort',
			idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[1]},	
			{nick:'obayona',
			idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[2] }
		]
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
		listPlayer:[{
			nick:'rodfcast',idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[0]},
			{nick:'kevanort',
			idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[1]},	
			{nick:'kawayuo',
			idTerritory: null,
			cards: [],
			numSoldier: 0,
			color:colors[2] }
		] 
	}
};


var cont=4;

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
	if(validarNick(nick)){
		var Match={
			"idMatch": cont,
			"nickCreator": nick,
			"numPlayers": 0,
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
		Match.numPlayers = numPlayer;
		Match.mode = gameMode;
		//console.log(Matches);
		response.render('chooseMap',{ nick:nick, mode:gameMode });
	}
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
		var numPlayer = match.numPlayers;
		var mode = match.mode;
		response.render('publicMatch',{idMatch:request.session.idMatch,
			numPlayer:numPlayer,
			mode:mode,
			nameMap:Map.name});
	}
}
/*
exports.publicMatch = function(request,response){
	//manejar sesion aqui
	if(request.session.idMatch){
		var match = Matches[request.session.idMatch];
		if(match){
			var numPlayer = match.numPlayers;
			var mode = match.mode;
			var map = match.map.name;
			if(match.stateMatch == 'pending'){
				match.stateMatch = 'published';	
				var player={
					nick: request.session.nick,
					idTerritory: null,
					cards: [],
					numSoldier: 0,
					color:colors[match.listPlayer.length]
				};
				match.listPlayer.push(player);
				response.render('waitRoomCreator',{ idMatch:request.session.idMatch, numPlayer: numPlayer,
													mode: mode , nameMap: map
												  });
			}else{
				response.render('waitRoomCreator',{ idMatch:request.session.idMatch, numPlayer: numPlayer,
													mode: mode , nameMap: map
												  });
			}
		}
	}else{
		response.render('index',{error:'no'});
	}
}
*/

exports.getPublishedMatches = function(request, response, page){
	var list = [];
	var tam = 10;
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
	var count = Math.ceil(list.length/tam);
	var registers = list.slice(page*tam, page*tam + tam);
	response.send({games: registers, limit: count});
}

exports.joinPlayer = function(idMatch, nickPlayer){
	var players = Matches[idMatch].listPlayer;
	for (var i=0; i< players.length; i++){
		if(players[i].nick == nickPlayer ){
			return; //error
		}
	}
	var currentIndex = Matches[idMatch].listPlayer.length;
	var player={
		nick: nickPlayer,
		idTerritory: null,
		cards: [],
		numSoldier: 0,
		color:colors[currentIndex]
	};
	Matches[idMatch].listPlayer.push(player);
	//console.log(Matches[idMatch]);
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

exports.emitPublicMatch = function(idMatch,nick,io){
	console.log('se published');
	Matches[idMatch].stateMatch='published';
	numPlayer=Matches[idMatch].numPlayers;
	mode=Matches[idMatch].mode;
	var player={
		nick: nick,
		idTerritory: null,
		cards: [],
		numSoldier: 0,
		color:colors[0]
	};
	Matches[idMatch].listPlayer.push(player);
	console.log(Matches[idMatch]);
	io.emit('goWaitRoomCreator');
}


exports.goWaitRoom = function(request,response){
	numPlayer=Matches[request.session.idMatch].numPlayers;
	mode=Matches[request.session.idMatch].mode;
	map=Matches[request.session.idMatch].map.name;
	response.render('waitRoomCreator',{ idMatch:request.session.idMatch, numPlayer:numPlayer, mode:mode,map:map,player:player});
}


exports.waitroom = function(request,response){
	var idMatch = request.query.id_match;
	var nick = request.session.nick;
	var match=Matches[idMatch];

	response.render('waitroom',{idMatch:idMatch, nick: nick,numPlayer:match.numPlayers,mode:match.mode,listPlayer:match.listPlayer });
}


exports.Matches= Matches;

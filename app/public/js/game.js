//variables of the game
var stage;
var match;
var graph;

//sockets
var socket;
var territorysSelected;


function loadMatch(event){
	var respond = JSON.parse(event.target.responseText);
	match = respond.match; 

	console.log("***match- cliente", match);
	//cargar el grafo
	var strMap = match.map.graph;
	graph = new graphlib.json.read(strMap);
	
	console.log(graph);
	//dibujar el mapa, los jugadores, y setear selectTerritoryEvent 
	//a cada territorio

	if(isMyTurn()){
		console.log("es mi turno");
		alert("es mi turno");
	}
	

}


function isMyTurn(){
	if(match.turn == nick){
		return true;
	}
	else{
		return false;
	}
}

function clickTerritory(idTerritory){
	
	//valido con el grafo la jugada de acuerdo a los datos
	var value = stage.validateMove({
		nick: nick,
		graph: graph,
		idTerritory: idTerritory
	});

	if(value){
		socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory: idTerritory } );
	}
	else{
		console.log("error");
	}
	console.log("grafo actualizado", match.map.graph);

}


function clickTowTerritorys(idTerritory){
	
	//valido con el grafo la jugada de acuerdo a los datos
	if(!territorysSelected[0] ){
		territorysSelected[0]=idTerritory;
	}else{
		territorysSelected[1]=idTerritory;
	}


	var value = stage.validateMove({
		nick: nick,
		graph: graph,
		idTerritory1: territorysSelected[0],
		idTerritory2: territorysSelected[1]
	});

	if(value){
		socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
	}
	else{
		console.log("error");
	}
	territorysSelected[0]=null;
	territorysSelected[1]=null;
	console.log("grafo actualizado", match.map.graph);

}


function getMatch(){
	var request = new XMLHttpRequest();
	var url="/getMatchData?id_match=" + idMatch;
	console.log(url);
	request.open("GET",url,true);
	request.addEventListener('load',loadMatch ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);	
}

function connectSocketGame(){
	socket= io.connect();

	socket.on("updateMap", function(args){
		
		console.log("updateMap", args.nickTurn);
		match.turn = args.nickTurn;
		stage.doUpdateMap(args, match, graph); //actualiza grafo

		//redraw map
		var cell = document.getElementById(args.idTerritory);
		var territory = graph.node(args.idTerritory);

		cell.innerHTML = args.idTerritory + " " + territory.owner + " " + territory.numSoldier;

		if(args.stage != stage.stageName){ //si cambia el estado
			stage = stage.nextStage();
			if(args.stage=='Atack' || args.stage=='Move'){
				setClick(clickTowTerritorys);
			}
			console.log(stage);
		}

		if(isMyTurn()){
			alert("es mi turno");
		}

	});
}

function setClick(action){
	var cells = document.getElementsByClassName("tile");
	
	for (var i =0; i< cells.length; i++){
		cells[i].addEventListener("click", function(event){
			if(isMyTurn()){
				var territory = this.id;
				console.log("click en "+ territory);
				action(territory);
			}
			

		});
	}
}

function initialize(event){

	stage = new selectTerritory(); //empieza con el stage select
	console.log(nick, idMatch);
	getMatch(); //obtengo el match por ajax
	connectSocketGame();
	territorysSelected={
		territory1:null,
		territory12:null
	}
	setClick(clickTerritory);
	
}


window.addEventListener('load',initialize,false);
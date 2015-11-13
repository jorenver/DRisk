//variables of the game
var stage;
var match;
var graph;
var player;

//sockets
var socket;
var territorysSelected;

//raphael variables
var paper;
//paper variables
var mapGroup;

function isMyTurn(){
	if(match.turn == nick){
		return true;
	}
	else{
		return false;
	}
}

function changeCards(){

	/*var players = match.listPlayer;
	for (var i = 0; i< ; i++){

	}*/

}


function clickTwoTerritorys(idTerritory){
	//valido con el grafo la jugada de acuerdo a los datos
	if(!territorysSelected[0] ){
		territorysSelected[0]=idTerritory;
	}else{
		territorysSelected[1]=idTerritory;
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
	
}

function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}

function searchTerritory(list,idTerritory){
	for(var i in list){
		if(list[i].name == idTerritory){
			return list[i];
		}
	}
	return null;
}

function procesarNumSolidier(event){
	var respond = JSON.parse(event.target.responseText);
	var numSoldier = respond.numSoldier; 
	var user = respond.nick; 
	var player;
	player= searchPlayer(match.listPlayer,nick);
    console.log(player)
    player.numSoldier=numSoldier;
	console.log(player)
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
		//cell.innerHTML = args.idTerritory + " " + territory.owner + " " + territory.numSoldier;
		var territoryPath = searchTerritory(mapGroup.children,args.idTerritory);
		var lastPlayer = searchPlayer(match.listPlayer,territory.owner);
		updateTerritory(territoryPath, lastPlayer.color.code);

		if(args.stage != stage.stageName){ //si cambia el estado
			stage = stage.nextStage();
			if(args.stage=='Reforce'){
				var url = "/getNumSoldier?nick="+match.turn;
		        var request = new XMLHttpRequest();
		        request.addEventListener('load',procesarNumSolidier, false);
		        request.open("GET",url, true);
		        request.send(null);
			}
			
			if(args.stage=='Atack' || args.stage=='Move'){
				setClick(clickTwoTerritorys);
			}
			console.log(stage);
		}

		if(isMyTurn()){
			alert("es mi turno");
		}

	});
}

function loadPlayersInfo(listPlayer){
	var wrapper = document.getElementById('listPlayer');
	var td;
	var nick;
	var row;
	for(var i in listPlayer){
		row = document.createElement('tr');
		$(row).attr('class','row-table');

		td = document.createElement('td');
		$(td).attr('class','row-table-color  u-flex-row u-justify-center u-align-center');
		$(td).css("background-color",listPlayer[i].color.code);
		
		nick = document.createElement('td')
		$(nick).attr('class','row-table-nick');
		nick.innerHTML = listPlayer[i].nick;
		
		row.appendChild(td);
		row.appendChild(nick);
		wrapper.appendChild(row);
	}
}

function loadMatch(event){
	var respond = JSON.parse(event.target.responseText);
	match = respond.match;
	console.log("***match- cliente", match);

	//load the information of current player 
	player = searchPlayer(match.listPlayer,nick);
	loadPlayersInfo(match.listPlayer);
	//cargar el grafo
	var strMap = match.map.graph;
	graph = new graphlib.json.read(strMap);
	console.log(graph);

	if(isMyTurn()){
		console.log("es mi turno");
		alert("es mi turno");
	}
}


function getMatch(){
	var request = new XMLHttpRequest();
	var url="/getMatchData?id_match=" + idMatch +"&nick="+ nick;
	console.log(url);
	request.open("GET",url,true);
	request.addEventListener('load',loadMatch ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);	
}


function initialize(event){
	stage = new selectTerritory(); //empieza con el stage select
	console.log(nick, idMatch);
	getMatch(); //obtengo el match por ajax
	//cargar lista de jugadores
	connectSocketGame();
	territorysSelected={
		territory1:null,
		territory12:null
	}
	initLibPaper('../svg/MapaRisk.svg');//dentro se llama a setClick
}

function initLibPaper(url){
	// Get a reference to the canvas object
	var canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	loadSVGMap(url);
	// Draw the view now:
	paper.view.draw();
}

function loadSVGMap(file){	
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			mapGroup = paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
			mapGroup.scale(0.70);
			setClick(clickTerritory);
		}
	});
}

function setClick(action){
	var groupTerritory = mapGroup.children;
	//groupTerritory: array de territorios, cada elemento es un objeto de tipo Group
	for(var i = 0 ; i < groupTerritory.length ; i++){
		groupTerritory[i].on('click',function(event){
			if(isMyTurn()){
				var territoryPath = this;
				action(territoryPath);
			}
		});
	}
}


function clickTerritory(territoryPath){
	//valido con el grafo la jugada de acuerdo a los datos
	var idTerritory = territoryPath.name;
	var value = stage.validateMove({
		nick: nick,
		graph: graph,
		idTerritory: idTerritory
	});
	if(value){
		// "player" is the current player
		updateTerritory(territoryPath, player.color.code);//colocate a soldier into territory and change color
		socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory: idTerritory } );
	}else{
		console.log("Error al seleccionar territorio");
	}
	console.log("grafo actualizado", match.map.graph);
}

function updateTerritory(territoryPath,color){
	territoryPath.fillColor = color
	//traer el url del svg desde el server
	paper.project.importSVG('../svg/soldier.svg',function(soldier){
		soldier.position = territoryPath.position;
		soldier.scale(0.10);
		var span = document.getElementById('soldierNum');
		span.innerHTML = parseInt(span.innerHTML)-1;
	});
}

window.addEventListener('load',initialize,false);
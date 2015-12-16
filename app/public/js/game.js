//variables of the game
var stage;
var match;
var graph;
var player;

//sockets
var socket;
var territorysSelected;

//raphael variables
//paper variables
var mapGroup;
var soldierItem;
var turnItem;

function isMyTurn(){
	if(match.turn == nick){
		return true;
	}
	else{
		return false;
	}
}


function clickTwoTerritorys(territoryPath){
	//valido con el grafo la jugada de acuerdo a los datos
	console.log('***************** 2 territorios')
	var idTerritory = territoryPath.name;
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
			$("#soldierNum").html(player.numSoldier);
		}
		else{
			console.log("error");
		}
		territorysSelected[0]=null;
		territorysSelected[1]=null;
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
    player.numSoldier = numSoldier;
    $("#soldierNum").html(player.numSoldier);
}

function connectSocketGame(){
	socket= io.connect();

	socket.on('connect',function(){
		socket.emit('addConnection');
	});

	socket.on("updateMap", function(args){
		match.turn = args.nickTurn;
		stage.doUpdateMap(args, match, graph); //actualiza juego, grafo
		//redraw map
		redraw(args, stage.drawAction);

		if(args.stage != stage.stageName){ //si cambia el estado
			stage = stage.nextStage();
			if(args.stage=='Reforce'){
				var url = "/getNumSoldier?nick="+match.turn;
		        var request = new XMLHttpRequest();
		        request.addEventListener('load',procesarNumSolidier, false);
		        request.open("GET",url, true);
		        request.send(null);
		        $("#reforceAction").css('background-color','#43888e');
			}	
			if(args.stage=='Atack' || args.stage=='Move'){
				setClick(clickTwoTerritorys);
			}
			if(args.state == 'changeCards'){

					//check whether to exchange cards
					if(player.cards.length >= 3){

						//mostrar pop-up para escoger las cartas a intercambiar
						//dentro del pop-up hacer emit(do-move())

					}
					else{
						stage = stage.next(); //not exchange cards, next stage "Reforce"
					}


			}
			if(args.state == 'receiveCard'){
				if(wonBattle){
					socket.emit("doMove", {nick: nick} );
				}
			}

		}
		if(isMyTurn()){
			loadTurnItem();
		}
	});
}



function redraw(args, drawAction){

	if(drawAction == "redrawMap"){
		var territory = graph.node(args.idTerritory);
		var territoryPath = searchTerritory(mapGroup.children,args.idTerritory);
		var lastPlayer = searchPlayer(match.listPlayer,territory.owner);
		updateTerritory(territoryPath,lastPlayer.color.code);
	}
	if(drawAction == "receiveCard"){
		console.log("Dibujo un pop up con la carta recivida");
		//draw a pop-up
	}
	if(drawAction == "changeCard"){
		console.log("Dibujo un pop up con las cartas a intercambiar");
		//draw a pop-up
	}

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
	if(player && turnItem){
		turnItem.fillColor = player.color.code;
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
	loadSoldierItem();
	paper.view.draw();// Draw the view now:
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
			loadTurnItem();
			paper.view.on('frame',animationOn);
		}
	});
}

function setClick(action){
	var groupTerritory = mapGroup.children;// array de territorios, cada elemento es un objeto de tipo Group
	for(var i = 0 ; i < groupTerritory.length ; i++){
		groupTerritory[i].off('click');
		groupTerritory[i].on('click',function(event){
			if(isMyTurn()){
				var territoryPath = this;
				action(territoryPath);
			}
		});
	}
}

function updateTerritory(territoryPath,color){
	territoryPath.fillColor = color;
	
	var soldier = soldierItem.clone();
	soldier.position = territoryPath.position;
	soldier.scale(0.10);
	paper.project.activeLayer.addChild(soldier);
	updateNumSoldier(territoryPath);
	var numSoldier = territoryPath.data.numSoldier;
	var numSoldierPath = paper.project.activeLayer.getItem({ name : territoryPath.name + "-soldier" });
	if(!numSoldierPath){
		var numSoldierPath = new paper.PointText({
			name : territoryPath.name + "-soldier",
			fillColor : 'white',
	    	fontSize: 15
		});
	}
	numSoldierPath.point.x = territoryPath.position.x + 25;
	numSoldierPath.point.y = territoryPath.position.y;
	numSoldierPath.content = numSoldier;
}

function updateNumSoldier(territoryPath){
	if(territoryPath.data.numSoldier == null){
		territoryPath.data.numSoldier = 1 ;
	}else{
		territoryPath.data.numSoldier = territoryPath.data.numSoldier + 1; 
	}
}

function clickTerritory(territoryPath){
	var idTerritory = territoryPath.name;
	var value = stage.validateMove({//valido con el grafo la jugada de acuerdo a los datos
		nick: nick,
		graph: graph,
		idTerritory: idTerritory
	});
	// "player" is the current player
	if(value){
		//colocate a soldier into territory, change color and update num soldiers
		//updateTerritory(territoryPath,player.color.code);
		socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory: idTerritory } );
		$("#soldierNum").html(player.numSoldier);
	}else{
		console.log("Error al seleccionar territorio");
	}
	console.log("grafo actualizado", match.map.graph);
}

function loadSoldierItem(){
	//load a svg and it transforms to item
	paper.project.importSVG('../svg/soldier.svg',function(soldier){
		soldierItem = soldier;
		soldier.remove();
	});
}

function loadTurnItem(){
	//load a textitem with information about turn
	var x,y;
	x = paper.view.size.width/2 - 50;
	y = paper.view.size.height/2;
	turnItem = new paper.PointText({
    	point: [x,y],
    	content: 'YOUR TURN',
    	fontFamily: 'Plump',
    	strokeWidth : 1,
    	strokeColor : 'black',
    	fontWeight: 'bold',
    	fontSize: 50
	});
	if(player){
		turnItem.fillColor = player.color.code;
	}
	turnItem.opacity = 1;
	turnItem.visible = false;
}

function animationOn(){
	if(match){
		if(turnItem){
			turnAnimation();
		}
	}
}

function turnAnimation(){
	if(isMyTurn()){
		if(turnItem.opacity > 0.05){
			turnItem.visible = true
			turnItem.opacity = turnItem.opacity - 0.05;
		}else{
			turnItem.visible = false;
			turnItem.remove();
		}
	}
}


window.addEventListener('load',initialize,false);
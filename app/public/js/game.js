//variables of the game
var stage;
var match;
var graph;
var player;
var temporalCards = [] //list to add select cards
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
	console.log('***************** 2 territorios');
	var idTerritory = territoryPath.name;
	if(territorysSelected[0] && territorysSelected[1] ){
		territorysSelected[0]=null;
		territorysSelected[1]=null;

	}
	if(!territorysSelected[0] ){
		territorysSelected[0]=idTerritory;
		alert('Escoja el territorio ha actacar');
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
			//$("#soldierNum").html(player.numSoldier);
		}
		else{
			territorysSelected[0]=null;
			territorysSelected[1]=null;
			console.log("error");
			alert('movimiento invalido, escoja otro par de territorios');
		}
		
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
			alert('Estado: '+args.stage);
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
				if(args.stage=='Atack' ){
					auxPlayer=searchPlayer(match.listPlayer,match.turn);
	       			auxPlayer.lastTerritorysConquers=0;
	       		}
			}
			if(args.stage == 'changeCards'){

				if(isMyTurn()){

					//check whether to exchange cards
					if(player.cards.length >= 3){

						//mostrar pop-up para escoger las cartas a intercambiar
						//dentro del pop-up hacer emit(do-move())
						openChangeCard_PopUp();

					}
					else{
						stage = stage.nextStage(); //not exchange cards, next stage "Reforce"
					}
				}


			}
			if(args.stage == 'receiveCard'){ 
				//if the player has conquer al least one territory
				if(player.lastTerritorysConquers>0){ 
					alert("nick "+ nick);
					socket.emit("doMove", {nick: nick, idMatch: idMatch} );
				}
				else{
					alert("no recibes cartas");
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
	if(drawAction == "changeCards"){
		console.log("Dibujo un pop up con las cartas a intercambiar");
		//draw a pop-up
	}
	if(drawAction == "Atack"){
		if(args.idTerritory1==null && args.idTerritory2==null){
            this.change=true;
            return;
        }
		console.log("Actualico el mapa ");
		var territory1 = graph.node(args.idTerritory1);
		var territory2 = graph.node(args.idTerritory2);
		//actualizo el primer territorio
		var territoryPath1 = searchTerritory(mapGroup.children,args.idTerritory1);
		territoryPath1.data.numSoldier=territory1.numSoldier;
		var lastPlayer1 = searchPlayer(match.listPlayer,territory1.owner);
		updateTerritoryAttack(territoryPath1,lastPlayer1.color.code);
		//actualizo el 2 territorio
		var territoryPath2 = searchTerritory(mapGroup.children,args.idTerritory2);
		territoryPath2.data.numSoldier=territory2.numSoldier;
		var lastPlayer2 = searchPlayer(match.listPlayer,territory2.owner);
		updateTerritoryAttack(territoryPath2,lastPlayer2.color.code);
	}

}

function openChangeCard_PopUp( ){
	
    if(player.cards.length >= 5){
    	bt_cancelTrace.disabled = true; //the player must change cards,
    	//do not close the pop-up
    }
    var table = document.createElement("table");
    var cards = player.cards;
    //add the cards in the pop-up
    for(var i=0; i< cards.length; i++){
    	var row = document.createElement("tr");
    	row.innerHTML = cards[i].soldierType + " " + cards[i].idTerritory;
    	row.setAttribute("class","card");
    	row.setAttribute('data-idterritory',cards[i].idTerritory );
    	row.setAttribute('data-soldiertype',cards[i].soldierType );
    	table.appendChild(row);
    	
    	row.addEventListener('click', function(event){

    		if(temporalCards.length >3){
    			alert("Ya escogiste las tres cartas");
    		}

    		this.style.backgroundColor = "yellow";
    		//add in a temporal cards list
			temporalCards.push({soldierType: this.getAttribute('data-soldiertype'),
			 idTerritory: this.getAttribute('data-idterritory')});    		

    	});
    }

    content_traceCard.appendChild(table);

    bt_traceCard.addEventListener('click', function(event){
    	var value = state.validateMove({listCards: temporalCards});
    	if(value){
    		//emit the cards to the server
    		socket.emit("doMove", {nick: nick, cardsTraced: temporalCards } );
    		temporalCards = [];
    	}
    	else{
    		alert("error, las cartas deben ser todas iguales o todas diferentes");
    		temporalCards = [];
    		var listCards = document.getElmentByClassName("card");
    		for (var i =0; i< listCards.length; i++ ){
    			listCards[i].style.backgroundColor = "";
    		}
    	}
    });

    bt_cancelTrace.addEventListener('click', function(event){
    	content_traceCard.innerHTML = "";
    	traceCard_PopUp.style.display="none";
    });


    traceCard_PopUp.style.display="flex";
    
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
	//Mostrar.addEventListener('click',openBattle);
	//Ocultar.addEventListener('click',closeBattle);

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

function updateTerritoryAttack(territoryPath,color){
	territoryPath.fillColor = color;
	
	var soldier = soldierItem.clone();
	soldier.position = territoryPath.position;
	soldier.scale(0.10);
	paper.project.activeLayer.addChild(soldier);
	//updateNumSoldier(territoryPath);
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
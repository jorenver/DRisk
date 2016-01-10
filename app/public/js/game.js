//variables of the game
var stage;
var match;
var graph;
var player;
//sockets
var socket;
var territorysSelected;

//paper variables to a paper.js scope
var mapGroup;
var soldierItem;
var turnItem;
var paperMapScope;


//objects to draw in other scopes


function isMyTurn(){
	if(match.turn == nick){
		return true;
	}
	else{
		return false;
	}
}

function LightenDarkenColor(color, cant) {
    //voy a extraer las tres partes del color
	 var rojo = color.substr(1,2);
	 var verd = color.substr(3,2);
	 var azul = color.substr(5,2);
	 
	 //voy a convertir a enteros los string, que tengo en hexadecimal
	 var introjo = parseInt(rojo,16);
	 var intverd = parseInt(verd,16);
	 var intazul = parseInt(azul,16);
	 
	 //ahora verifico que no quede como negativo y resto
	 if (introjo-cant>=0) introjo = introjo-cant;
	 if (intverd-cant>=0) intverd = intverd-cant;
	 if (intazul-cant>=0) intazul = intazul-cant;
	 
	 //voy a convertir a hexadecimal, lo que tengo en enteros
	 rojo = introjo.toString(16);
	 verd = intverd.toString(16);
	 azul = intazul.toString(16);
	 
	 //voy a validar que los string hexadecimales tengan dos caracteres
	 if (rojo.length<2) rojo = "0"+rojo;
	 if (verd.length<2) verd = "0"+verd;
	 if (azul.length<2) azul = "0"+azul;
	 
	 //voy a construir el color hexadecimal
	 var oscuridad = "#"+rojo+verd+azul;
	 
	 //la función devuelve el valor del color hexadecimal resultante
	 return oscuridad;
}

function LightenDarkenColorTerritory(idTerritory,cant){
	var territory=graph.node(idTerritory);
	var territoryPath = searchTerritory(mapGroup.children,idTerritory);
	var lastPlayer = searchPlayer(match.listPlayer,territory.owner);
	updateTerritoryAttack(territoryPath,LightenDarkenColor(lastPlayer.color.code,cant));

}
function LightenDarkenColorNeighborsTerritory(idTerritory,cant){
	list=graph.neighbors(idTerritory);
	for (var i = 0; i < list.length; i++) {
		var territory=graph.node(list[i]);
		if (territory.owner==nick) {
			continue;
		}
		if(territory.owner){
			var territoryPath = searchTerritory(mapGroup.children,list[i]);
			var lastPlayer = searchPlayer(match.listPlayer,territory.owner);
			updateTerritoryAttack(territoryPath,LightenDarkenColor(lastPlayer.color.code,cant));	
		}
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
		var territory=graph.node(idTerritory);

		if(territory.owner!=nick || territory.numSoldier<=1){
			alert('No puede escoger ese territorio');
			return;
		}
		territorysSelected[0]=idTerritory;

		//cambio el color del territorio seleccionado
		LightenDarkenColorTerritory(territorysSelected[0],100);
		//LightenDarkenColorNeighborsTerritory(territorysSelected[0],50);

		if(stage.stageName!='Move'){
			alert('Escoja el territorio ha actacar');
		}
		else{
			alert('Escoja el territorio de Destino');
		}

	}else{

		territorysSelected[1]=idTerritory;
		var value = stage.validateMove({
			nick: nick,
			graph: graph,
			idTerritory1: territorysSelected[0],
			idTerritory2: territorysSelected[1]
		});

		if(value){
			LightenDarkenColorTerritory(territorysSelected[0],-100);
			if(stage.stageName!='Move'){
				//LightenDarkenColorNeighborsTerritory(territorysSelected[0],-50);
				socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
			}else{
				openMove();
			}
		}
		else{
			LightenDarkenColorTerritory(territorysSelected[0],-100);
			//LightenDarkenColorNeighborsTerritory(territorysSelected[0],-50);
			territorysSelected[0]=null;
			territorysSelected[1]=null;
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
    player.numSoldier += numSoldier;   
	console.log("Recibiste "+ numSoldier + " soldados, chucha");
    $("#soldierNum").html(player.numSoldier);

    setClick(clickTerritory);
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
		console.log("Recibo esto", args);

		redraw(args, stage.drawAction);

		if(args.stage != stage.stageName){ //si cambia el estado
			stage = stage.nextStage();
			// alert('Estado: '+args.stage);
			if(args.stage=='Reforce'){
				var url = "/getNumSoldier?nick="+match.turn;
		        var request = new XMLHttpRequest();
		        console.log("***** Estoy en reforce cliente");
		        request.addEventListener('load',procesarNumSolidier, false);
		        request.open("GET",url, true);
		        request.send(null);
		        $("#reforceAction").css('background-color','#43888e');
		        setClick(clickTerritory);
			}	
			if(args.stage=='Atack' || args.stage=='Move'){
				setClick(clickTwoTerritorys);
				if(args.stage=='Atack' ){
					auxPlayer=searchPlayer(match.listPlayer,match.turn);
	       			auxPlayer.lastTerritorysConquers=0;
	       		}
			}
			if(args.stage == 'changeCards'){
				console.log("**** estoy en change cards turno:",args.nickTurn );

				if(isMyTurn()){

					//check whether to exchange cards
					if(player.cards.length >= 3){

						//mostrar pop-up para escoger las cartas a intercambiar
						//dentro del pop-up hacer emit(do-move())
						openChangeCard_PopUp();

					}
					else{
						 console.log("envio esto en changeCard", {nick:nick, idMatch: idMatch,
						  cardsTraced: [], flag: false } );

						 socket.emit("doMove", {nick:nick, idMatch: idMatch,
						  cardsTraced: [], flag: false });//not exchange cards, next stage "Reforce"
					}
				}


			}
			if(args.stage == 'receiveCard'){ 
				//if the player has conquer al least one territory
				if(isMyTurn()){
					if(player.lastTerritorysConquers>0){ 
						 console.log("envio esto en receiveCard", {nick: nick, idMatch: idMatch, flag: true} );

						socket.emit("doMove", {nick: nick, idMatch: idMatch, flag: true} );
					}
					else{
						socket.emit("doMove", {nick: nick, idMatch: idMatch, flag:false} );
					}
				}
			}

		}
		//if(isMyTurn()){
			loadTurnItem();
		//}
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

		if(!args.flag){
			return;
		}

		//show a pop-up with the information
		var p = document.createElement("p");
		p.innerHTML = "You receive this card:"
		content_receiveCard.appendChild(p);
		var card = args.card;

		var territoryPath = searchTerritory(mapGroup.children, card.idTerritory);
		
		var grapherReceiveCard = new graphicsCard();
		grapherReceiveCard.initializeScope();
		var territory = territoryPath.clone();
		territory.remove();
		grapherReceiveCard.drawCard(card, territory);
		
		bt_closeReceiveCard.onclick = function(event){
			console.log("cierro pop up receive card");
			content_receiveCard.innerHTML = "";
			grapherReceiveCard.cleanScope();
    		receiveCard_PopUp.style.display="none";

		};

		receiveCard_PopUp.style.display = "flex";



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
    
    var cards = player.cards;
    
    var grapherChangeCards = new graphicsChangeCards();
    grapherChangeCards.initializeScope();

    for (var i = 0; i< cards.length; i++){
    	var currentCard = cards[i];
    	console.log(currentCard);

    	var territoryPath = searchTerritory(mapGroup.children, currentCard.idTerritory);
		var territory = territoryPath.clone();
		territory.remove();
		var widthCard = grapherChangeCards.widthCard;
		grapherChangeCards.drawCard(10 + (widthCard+ 20)*i, 10, currentCard , territory);

    }

    //event to the button trace cards
    bt_traceCard.onclick =  function(event){
    	var temporalCards = grapherChangeCards.getSelectedCards();
    	var value = stage.validateMove({listCards: temporalCards });
    	if(value){
    		//emit the cards to the server
    		socket.emit("doMove", {nick: nick,idMatch: idMatch ,
    			cardsTraced: temporalCards, flag: true } );

    		//
    		var difference = player.cards.length - temporalCards.length;
    		if(difference<3){
    			traceCard_PopUp.style.display="none";
    		}
    	}
    	else{
    		alert("error, las cartas deben ser todas iguales o todas diferentes");
    	}
    };

    bt_cancelTrace.onclick = function(event){
    	traceCard_PopUp.style.display="none";
    	grapherChangeCards.cleanScope();
    	console.log("Click en cerra change Cards");
    	socket.emit("doMove", {nick:nick, idMatch: idMatch,
						  cardsTraced: [], flag: false }); //emit to change the state

    };


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
	moveAction.addEventListener("click",buttonMove,false);
	reciveCardsAction.addEventListener("click",buttonRecive,false);

}

function initLibPaper(url){
	// Get a reference to the canvas object
	var canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paperMapScope = new paper.PaperScope();
    paperMapScope.setup(canvas);
	loadSVGMap(url);
	loadSoldierItem();
	paperMapScope.view.draw();// Draw the view now:

}

function loadSVGMap(file){	
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			mapGroup = paperMapScope.project.importSVG(xml.getElementsByTagName("svg")[0]);
			mapGroup.scale(0.70);
			mapGroup.position = new paperMapScope.Point(paperMapScope.view.size.width/2, paperMapScope.view.size.height/2);
			setClick(clickTerritory);
			loadTurnItem();
			paperMapScope.view.on('frame',animationOn);
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
	//soldier.scale(1);
	//paper.project.activeLayer.addChild(soldier);
	paperMapScope.project.activeLayer.addChild(soldier);
	//updateNumSoldier(territoryPath);
	var numSoldier = territoryPath.data.numSoldier;
	var numSoldierPath = paperMapScope.project.activeLayer.getItem({ name : territoryPath.name + "-soldier" });
	if(!numSoldierPath){
		var numSoldierPath = new paperMapScope.PointText({
			name : territoryPath.name + "-soldier",
			fillColor : 'white',
	    	fontSize: 20
		});
	}
	numSoldierPath.point.x = territoryPath.position.x;
	numSoldierPath.point.y = territoryPath.position.y;
	numSoldierPath.content = numSoldier;
}

function updateTerritory(territoryPath,color){
	territoryPath.fillColor = color;
	var soldier = soldierItem.clone();
	soldier.position = territoryPath.position;
	//soldier.scale(1);
	//paper.project.activeLayer.addChild(soldier);
	paperMapScope.project.activeLayer.addChild(soldier);
	updateNumSoldier(territoryPath);
	var numSoldier = territoryPath.data.numSoldier;
	var numSoldierPath = paperMapScope.project.activeLayer.getItem({ name : territoryPath.name + "-soldier" });
	if(!numSoldierPath){
		var numSoldierPath = new paperMapScope.PointText({
			name : territoryPath.name + "-soldier",
			fillColor : 'white',
	    	fontSize: 20
		});
	}
	numSoldierPath.point.x = territoryPath.position.x;
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
		console.log("Esto estoy enviando: ", nick, idMatch, idTerritory );
		socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory: idTerritory } );
		$("#soldierNum").html(player.numSoldier);
	}else{
		console.log("Error al seleccionar territorio");
	}
	
}

function buttonMove(){
	if(isMyTurn() && stage.stageName=="Atack"){
		if(territorysSelected[0]){
			LightenDarkenColorTerritory(territorysSelected[0],-100);
			territorysSelected[0]=null;
			territorysSelected[1]=null;
		}
		socket.emit("doMove", {nick: nick, 
								idMatch: idMatch, 
								idTerritory1: null,
								idTerritory2: null });
	}
}

function buttonRecive(){
	if(isMyTurn() && stage.stageName=="Move"){
		if(territorysSelected[0]){
			LightenDarkenColorTerritory(territorysSelected[0],-100);
			territorysSelected[0]=null;
			territorysSelected[1]=null;
		}
		socket.emit("doMove", {nick: nick, 
								idMatch: idMatch, 
								idTerritory1: null,
								idTerritory2: null,
								num:0} );
	}
}



function loadSoldierItem(){
	//load a svg and it transforms to item
	paperMapScope.project.importSVG('../svg/soldier-01.svg',function(soldier){
		soldierItem = soldier;
		soldier.remove();
	});
}

function loadTurnItem(){
	//load a textitem with information about turn
	var x,y;
	x = paperMapScope.view.size.width/2 -100;
	y = paperMapScope.view.size.height/2;
	turnItem = new paperMapScope.PointText({
    	point: [x,y],
    	content: 'YOUR TURN '+match.turn,
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
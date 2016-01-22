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
var dicesPaths=[];
var gb;
var continents;

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
	}else{

		territorysSelected[1]=idTerritory;
		var value = stage.validateMove({
			nick: nick,
			graph: graph,
			idTerritory1: territorysSelected[0],
			idTerritory2: territorysSelected[1]
		});

		if(value){
			LightenDarkenColorTerritory(territorysSelected[0],0);
			if(stage.stageName!='Move'){
				socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
			}else{
				openMove();
			}
		}
		else{
			LightenDarkenColorTerritory(territorysSelected[0],0);
			//LightenDarkenColorNeighborsTerritory(territorysSelected[0],-50);
			territorysSelected[0]=null;
			territorysSelected[1]=null;
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

function updateNumSoldiers(auxPlayer){
    $("#viewSoldiersNum").html(auxPlayer.numSoldier);
}

function procesarNumSolidier(event){
	var respond = JSON.parse(event.target.responseText);
	var numSoldier = respond.numSoldier; 
	var user = respond.nick;
	var auxPlayer=searchPlayer(match.listPlayer,match.turn);
    auxPlayer.numSoldier = numSoldier;  
	console.log("YYYYYYYYYYY Soldados por Jugador" ,match.listPlayer);
	if(isMyTurn()){
		updateNumSoldiers(auxPlayer);
	}
    setClick(clickTerritory);
}

function getSoldiers(){
	var url = "/getNumSoldier?nick="+match.turn;
    var request = new XMLHttpRequest();
    console.log("***** Estoy en reforce cliente");
    request.addEventListener('load',procesarNumSolidier, false);
    request.open("GET",url, true);
    request.send(null);
}

function connectSocketGame(){
	socket= io.connect();

	socket.on('connect',function(){
		socket.emit('addConnection');
	});
	socket.on("winner", function(){
		window.location.href = "/winner";
	});
	socket.on("loser", function(){
		window.location.href = "/loser";
	});
	socket.on("updateMap", function(args){
		match.turn = args.nickTurn;
		stage.doUpdateMap(args, match, graph); //actualiza juego, grafo
		//redraw map
		console.log("Recibo esto", args);

		redraw(args, stage.drawAction);
		updateViewStage();
		updateViewCards();
		updateNumSoldiers(player);
		if(args.stage != stage.stageName){ //si cambia el estado
			stage = stage.nextStage();
			updateViewStage();
			if(args.stage=='Reforce'){
				getSoldiers();
			}	
			if(args.stage=='Atack' || args.stage=='Move'){
				setClick(clickTwoTerritorys);
				if(args.stage=='Atack' ){
					var auxPlayer=searchPlayer(match.listPlayer,match.turn);
	       			auxPlayer.lastTerritorysConquers=0;
	       			if(args.losers){
	       				for (var i = 0; i < args.losers.length; i++) {
	       					var nickLoser=args.losers[i];
	       					for (var i = 0; i < listPlayer.length; i++) {
	       						if(listPlayer[i].nick==nickLoser){
	       							listPlayer.splice(i,1);
	       							i--;
	       						}
	       					}
	       				}
	       			}
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
		changeColorTurn();
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

		if(nick!= args.nick){
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

		receiveCard_PopUp.style.display = "block" ;



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
		var heightCard = grapherChangeCards.heigthCard;
		if (i <5){
			grapherChangeCards.drawCard(10 + (widthCard+ 20)*i, 10, currentCard , territory);
		}
		else{

			x = i - 5;
			grapherChangeCards.drawCard(10 + (widthCard+ 20)*x, 20 + heightCard , currentCard , territory);
		}


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
    	
    };

    bt_cancelTrace.onclick = function(event){
    	traceCard_PopUp.style.display="none";
    	grapherChangeCards.cleanScope();
    	console.log("Click en cerra change Cards");
    	socket.emit("doMove", {nick:nick, idMatch: idMatch,
						  cardsTraced: [], flag: false }); //emit to change the state

    };


    traceCard_PopUp.style.display="block";
    
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
	
	player = searchPlayer(match.listPlayer,nick);//load the information of current player 
	loadPlayersInfo(match.listPlayer);
	
	var strMap = match.map.graph;//cargar el grafo
	graph = new graphlib.json.read(strMap);
	continents=match.map.continents;
	console.log("Contientes: ",continents);
	updateViewStage();
	initLibPaper();
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
	//Mostrar.addEventListener('click',openBattle);
	//Ocultar.addEventListener('click',closeBattle);
	moveAction.addEventListener("click",buttonMove,false);
	reciveCardsAction.addEventListener("click",buttonRecive,false);
	//updateViewStage();
	gb= new graphicsBattle();
	gb.initializeScope();
}

function initLibPaper(){
	// Get a reference to the canvas object
	var canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paperMapScope = new paper.PaperScope();
    paperMapScope.setup(canvas);
    var url = '../svg/maps/'+ match.map.name + ".svg"
	loadSVGMap(url);
	loadSoldierItem();
	loadDicesItems();
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
			//loadTurnItem();
			changeColorTurn()
			//paperMapScope.view.on('frame',animationOn);
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
	soldier.scale(0.5);
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
	soldier.scale(0.5);
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
			LightenDarkenColorTerritory(territorysSelected[0],0);
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
			LightenDarkenColorTerritory(territorysSelected[0],0);
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

function loadDicesItems(){
	//load a svg and it transforms to item
	for (var i = 1; i <=6 ; i++) {
		paperMapScope.project.importSVG('../svg/Dice'+i+'.svg',function(dice){
			dicesPaths.push(dice);
			dice.remove();
		});
	}
	
}
/*
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
*/
function changeColorTurn(){
	viewTurn.innerHTML=match.turn;
	viewTurn.style.color=searchPlayer(match.listPlayer,match.turn).color.code;
	var players=$( ".row-table-nick");
	for (var i = 0; i < players.length; i++) {
		if(players[i].innerHTML==match.turn){
			players[i].style.color=searchPlayer(match.listPlayer,match.turn).color.code;
		}else{
			players[i].style.color="black";
		}
	};
}

function updateViewStage(){
	//$("#reforceAction").css('background-color','#43888e');
	$(".actionButton").css('background-color','#000096');
	//$('.actionButton').attr('disabled', true);
	
	if(stage.stageName=="Select"){
		//viewStage.innerHTML="Select Territory";
		selectAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
	if(stage.stageName=="Reforce"){
		//viewStage.innerHTML="Reforce Territory";
		reforceAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
	if(stage.stageName=="Atack"){
		//viewStage.innerHTML="Attack Territory";
		attackAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
	if(stage.stageName=="Move"){
		//viewStage.innerHTML="Move Soldier";
		moveAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
	if(stage.stageName=="changeCards"){
		//viewStage.innerHTML="Change Cards";
		changeAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
	if(stage.stageName=="receiveCard"){
		//viewStage.innerHTML="Receive Card";
		reciveCardsAction.style.background=searchPlayer(match.listPlayer,match.turn).color.code;
	}
}

function updateViewCards(){
	viewNumCards.innerHTML=player.cards.length;

}


window.addEventListener('load',initialize,false);
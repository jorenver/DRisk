//state selectTerritory
function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}

var selectTerritory = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "Select"; 
	this.drawAction = "redrawMap";

	this.validateMove = function(args){
		
		var idTerritory = args.idTerritory;

		var territory = args.graph.node(idTerritory);
		
		if( !territory.owner || (territory.owner == args.nick ) ){
			return true;
		}
		else{
			return false;
		}

	};

	this.doUpdateMap = function(args, match, graph){
		//update the graph
		var nick = args.nick;
		var idTerritory = args.idTerritory;
		graph.node(idTerritory).owner = nick;
		graph.node(idTerritory).numSoldier += 1;
		var player;
		player= searchPlayer(match.listPlayer,nick);
        console.log(player)
        player.numSoldier-=1;
        console.log(player);

		console.log("grafo actualizado Select", graph);
	}


	this.nextStage = function(){
		//return the next stage
		return new reforceTerritory();

	}


}

var reforceTerritory = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "Reforce"; 
	this.drawAction = "redrawMap";

	this.validateMove = function(args){
		var idTerritory = args.idTerritory;

		var territory = args.graph.node(idTerritory);
		
		if(territory.owner == args.nick){
			return true;
		}
		else{
			return false;
		}

	}

	this.doUpdateMap = function(args, match, graph){
		//update the graph
		var nick = args.nick;
		var idTerritory = args.idTerritory;
		graph.node(idTerritory).owner = nick;
		graph.node(idTerritory).numSoldier += 1;
		var player;
		player= searchPlayer(match.listPlayer,nick);
        console.log(player)
        player.numSoldier-=1;
        console.log(player);
		console.log("grafo actualizado Reforce", graph);
	}


	this.nextStage = function(){
		//return the next stage
		return new atackTerritory();

	}
}

var isneighbors=function(graph,territory1,territory2){
	list=graph.neighbors(territory1);
	for (var i = 0; i < list.length; i++) {
		if(list[i]==territory2)
			return true;
	}
	return false;
}

var atackTerritory = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "Atack";
	this.drawAction = "Atack"; 

	this.validateMove = function(args){
		var nick=args.nick;
		var idTerritory1=args.idTerritory1;
		var idTerritory2=args.idTerritory2;
		var territory1 = args.graph.node(idTerritory1);
		var territory2 = args.graph.node(idTerritory2);
		if(territory1.numSoldier>1 && territory1.owner==nick && territory2.owner != nick && isneighbors(args.graph,idTerritory1,idTerritory2 )){
			return true;
		}else
			return false;

	}

	this.doUpdateMap = function(args, match, graph){
		if(args.idTerritory1==null && args.idTerritory2==null){//cambio de estado
			return;
		}
		//update the graph
        dice1=args.dice1;
        console.log('########Dados Atacante####### '+ dice1);
        dice2=args.dice2;
        console.log('########Dados Defensor#######'+ dice2);
        numAttacker=args.numAttacker;
        numDefender=args.numDefender;
        var territory1 = graph.node(args.idTerritory1);
        var territory2 = graph.node(args.idTerritory2);
       	territory1.numSoldier =territory1.numSoldier- numAttacker;
       	territory2.numSoldier =territory2.numSoldier- numDefender;
       	content_battle.innerHTML='Attacker: '+territory1.owner+'<br>';
       	content_battle.innerHTML+='Territory: '+args.idTerritory1+' Dices: '+dice1+' Dead: '+numAttacker+'<br>';
       	content_battle.innerHTML+='Defender: '+territory2.owner+'<br>';
       	content_battle.innerHTML+='Territory: '+args.idTerritory2+' Dices: '+dice2+' Dead: '+numDefender+'<br>';
       	if(territory2.numSoldier==0){
       		territory2.owner=territory1.owner;
       		territory2.numSoldier=1;
       		territory1.numSoldier=territory1.numSoldier-1;
       		content_battle.innerHTML+='Conquered Territory';
       		auxPlayer=searchPlayer(match.listPlayer,match.turn);
       		auxPlayer.lastTerritorysConquers+=1;
       	}else{
       		content_battle.innerHTML+='Not Conquered Territory';
       	}
       	openBattle();
	}

	this.nextStage = function(){
		//return the next stage
		return new receiveCard();

	}


}


var move = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "Atack"; 

	this.validateMove = function(args){

	}

	this.doUpdateMap = function(args, match, graph){
		//update the graph
		
	}

	this.getDrawParameter = function(){
		return {action: "reDrawMap"};
	}

	this.nextStage = function(){
		//return the next stage

	}




}


var changeCards = function(){

	//recieve an object {nick, idTerritory, graph }
	this.stageName = "changeCards"; 
	this.drawAction = "changeCards";

	this.validateMove = function(args){

		//validate whether the set of cards are tradeable
		console.log("cahngeCards recieve:", args);

		var listCards = args.listCards;
		console.log("lista de cartas",listCards);

		//validate that the three cards are equals (typeSoldier equal)
		if(areCardsEqual(listCards)){
			return true;
		}//validate that the trhee cards are differents (type soldier different)
		else if (areCardsDifferent(listCards)){ 
			return true;
		}
		else{
			return false; //not valid set of cards
		}


	}



	this.doUpdateMap = function(args, match, graph){
		//reciece the num of soldiers
		//and quit the cards traded
		if(!args.flag){
			return;
		}

		var cardsTraced = args.cardsTraced; //cards traced
		var nick = args.nick;
		var player = searchPlayer(match.listPlayer,nick);
		var cards = player.cards;
		var aux = [];


		player.cards = aux;
		player.numSoldier += args.numSoldier;
		player.numSoldier += args.extraSoldiers;

		if(match.turn != args.nick){
			return;
		}

		//quit the cards traded of the cards of the player
		//remove the cards
		for (var i =0; i< cards.length; i++){			
			if (!existCard(cardsTraced ,cards[i])){
				aux.push(cards[i]);
			}
		}

		//update the pop-up of change Cards

		var listCards = document.getElementsByClassName("card");
		for(var i =0; i< listCards.length; i++){
			for(var j = 0; j < cardsTraced.length; i++){

				var idTerritory = listCards[i].getAttribute('data-idterritory');
				if(idTerritory == cardsTraced[j].idTerritory){
					listCards[i].style.display="none";
				}

			}

		}
		if(player.cards.length < 5){
			bt_cancelTrace.disabled = false;
		}


	}



	this.nextStage = function(){
		return new reforceTerritory();

	}


}

var receiveCard = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "receiveCard"; 
	this.drawAction = "receiveCard";

	this.validateMove = function(args){
		
	}

	this.doUpdateMap = function(args, match, graph){
		//update the graph
		if(!args.flag){
			console.log("*****No recibe cartas*****");
			return;
		}


		var card = args.card; 
		console.log("NICKNAME:", args.nick);
		var player = searchPlayer(match.listPlayer, args.nick);
		player.cards.push(card); //add the new card
		console.log("cards", player.cards);
		//show a pop-up with the information
		var p = document.createElement("p");
		p.innerHTML = "You receive this card:"
		var div = document.createElement("div");
		div.innerHTML = args.card.soldierType + " " + args.card.idTerritory;
		content_receiveCard.appendChild(p);
		content_receiveCard.appendChild(div);
		bt_closeReceiveCard.addEventListener('click', function(event){
			content_receiveCard.innerHTML = "";
    		receiveCard_PopUp.style.display="none";
		});

		receiveCard_PopUp.style.display = "flex";
		

		
	}

	this.nextStage = function(){
		//return the next stage
		return new changeCards();

	}


}


function areCardsEqual(listCards ){
	var type1 = listCards[0].soldierType;
	var type2 = listCards[1].soldierType;
	var type3 = listCards[2].soldierType;

	console.log(type1, type2, type3);
	if ( (type1 == type2) && (type2 == type3) ){
		return true;
	}
	else{
		console.log("Retorno falso");
		return false;
	}


}

function areCardsDifferent(listCards ){
	var type1 = listCards[0].soldierType;
	var type2 = listCards[1].soldierType;
	var type3 = listCards[2].soldierType;
	console.log(type1, type2, type3);

	if ( (type1 != type2) && (type2!= type3) && (type1!=type3) ){
		console.log("retorno verdadero");
		return true;
	}
	else{
		return false;
	}


}

function existCard(listCards, card){
	for(var i = 0; i< listCards.length; i++){
		if(listCards[i].idTerritory == card.idTerritory){
			return true;
		}
	}
	return false;

}


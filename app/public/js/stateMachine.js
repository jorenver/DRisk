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

	this.validateMove = function(args){
		var nick=args.nick;
		var idTerritory1=args.idTerritory1;
		var idTerritory2=args.idTerritory2;

		var territory1 = args.graph.node(idTerritory1);
		console.log('222222222222222222 '+territory1)
		var territory2 = args.graph.node(idTerritory2);
		if(territory1.numSoldier>1 && territory1.owner==nick && territory2.owner != nick ){
			return true;
		}else
			return false;

	}

	this.doUpdateMap = function(args, match, graph){
		//update the graph
        dice1=args.dice1;
        console.log('########Dados Atacante####### '+ dice1);
        dice2=args.dice2;
        console.log('########Dados Defensor#######'+ dice2);
        numAttacker=args.numAttacker;
        console.log('$$$$$$$$$$$Perdidos Atacante$$$$$$$$$$$ '+ numAttacker);
        numDefender=args.numDefender;
        console.log('$$$$$$$$$$$Perdidos Defensor$$$$$$$$$$$ '+ numDefender);
        var territory1 = graph.node(args.idTerritory1);
        var territory2 = graph.node(args.idTerritory2);
       	territory1.numSoldier -= numAttacker;
       	territory2.numSoldier -= numDefender;
       	if(territory2.numSoldier==0){
       		territory2.owner=territory1.owner;
       		territory2.numSoldier=1;
       		territory1.numSoldier-=1;
       		 console.log('$$$$$$$$$$$Cambio de owner$$$$$$$$$$$ ');
       	}
		
	}

	this.nextStage = function(){
		//return the next stage

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
		var listCards = args.listCards;

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

		var cardsTraced = args.cardsTraced; //cards traced
		var nick = args.nick;
		var player = searchPlayer(match.listPlayer,nick);
		var cards = player.cards;
		var aux = [];

		//quit the cards traded of the cards of the player
		for (var i =0; i< cards.length; i++){			
			if (!existCard(cardsTraced ,cards[i])){
				aux.push(cards[i]);
			}
		}
		player.cards = aux;
		player.numSoldier += args.numSoldier;
	
	}



	this.nextStage = function(){
		return new reforceTerritory();

	}


}

var recieveCard = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "recieveCards"; 
	this.drawAction = "recieveCards";

	this.validateMove = function(args){
		
	}

	this.doUpdateMap = function(args, match, graph){
		//update the graph
		var card = args.card; 
		var nick = args.nick;
		var player = searchPlayer(match.listPlayer,nick);
		player.cards.push(card); //add the new card
		
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

	if (type1 == type2 && type2== type3){
		return true;
	}
	else{
		return false;
	}


}

function areCardsDifferent(listCards ){
	var type1 = listCards[0].soldierType;
	var type2 = listCards[1].soldierType;
	var type3 = listCards[2].soldierType;

	if (type1 != type2 && type2!= type3 && type1!=type3){
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


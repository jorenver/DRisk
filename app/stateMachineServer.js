function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}

function getNumDices(list,num){
    do{
        var index=0;
        var min=list[index];
        for (var i = 0; i < list.length; i++) {
            if (list[i]<min) {
                min=list[i];
                index=i;
            }
        }
        delete list[index];
    }while(list.length>num);
    return list;
}
function removeMaxDice(list){
    var max=0;
    var max=list[index];
    for (var i = 0; i < list.length; i++) {
        if (list[i]>max) {
            max=list[i];
            index=i;
        }
    }
    delete list[index];
    return max;
}

function generateDices(n){
    var list=[];
    for (var i =0 ; i<n ; i++) {
        var aleatorio = Math.round(Math.random()*5)+1;
        list.push(aleatorio);
    }
    return list;
}


var selectTerritory = function(){
    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Select";

    this.initStage= function(match){
        console.log('init Select')
    }

    this.isChangeTurn= function(){
        return true;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Select******");
        var nick = args.nick;
        var idTerritory = args.idTerritory;
        console.log(nick, idTerritory);
        var graphPtr = match.map.graph;
        var player;
        graphPtr.node(idTerritory).owner = nick;
        graphPtr.node(idTerritory).numSoldier += 1;
        player= searchPlayer(match.listPlayer,nick);
        console.log(player)
        player.numSoldier-=1;
        console.log(player);
    }

    this.nextStage = function(){
        return new reforceTerritory();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Select');
        var data = {
            nick: args.nick, 
            idTerritory: args.idTerritory,
            nickTurn: playerTurn.nick, 
            stage: stage
        };
        return data;
    }

    this.validateChangeStage=function(match){
        var cont=0;
        console.log('$$$$$$$$$$consultar cambio Select$$$$$$$$$$$$');
        listPlayer=match.listPlayer;
        for(i in listPlayer){
            if(listPlayer[i].numSoldier==0)
                cont+=1;
        }
        console.log(cont);
        if(cont==listPlayer.length)
            nextState="Reforce";
        else
            nextState="Select";

        return nextState;
    }

}

var reforceTerritory = function(){
    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Reforce";
    
    this.initStage= function(match){
        console.log('init Reforce');
        var listPlayer=match.listPlayer;
        player= searchPlayer(listPlayer,match.turn);
        //calcular el numero de soldados
        player.numSoldier=5;
    }

    this.isChangeTurn= function(){

        return false;
    
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Reforce******");
        var nick = args.nick;
        var idTerritory = args.idTerritory;
        console.log(nick, idTerritory);
        var graphPtr = match.map.graph;

        graphPtr.node(idTerritory).owner = nick;
        graphPtr.node(idTerritory).numSoldier += 1;
        player= searchPlayer(match.listPlayer,nick);
        console.log(player)
        player.numSoldier-=1;
        console.log(player);
    }

    this.nextStage = function(){
        //return the next stage
        return new atackTerritory();

    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Reforce');
        var data = {
            nick: args.nick, 
            idTerritory: args.idTerritory,
            nickTurn: playerTurn.nick, 
            stage: stage
        };
        return data;
    }

    this.validateChangeStage=function(match){ 
        var listPlayer=match.listPlayer;
        player= searchPlayer(listPlayer,match.turn);
        console.log('77777777777777 validando cambio '+player.numSoldier)
        if(player.numSoldier==0)
            return 'Atack';
        else
            return 'Reforce';
    }

}

var atackTerritory = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Atack";
    this.initStage= function(match){
        console.log('init Atack');
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Atack******");
        //calculate dice
        //attacker: 2 soldiers 1 dice, 3 soldiers 2 dice, 4 o more soldier 3 dice
        //defender: 1 soldier 1 dice, 2 o more soldiers 2 dice
        var listDiceAttacker=[],listDiceDefender=[],numDefender, numAttacker;
        var graph,nickAttacker,nickDefender,numSoldierA,numSoldierD,territoryA,territoryD,nDeadA,nDedD;
        graph=match.map.graph;
        territoryA=graph.node(args.idTerritory1);
        territoryB=graph.node(args.idTerritory2);
        nickAttacker=territoryA.owner;
        nickDefender=territoryD.owner;
        numSoldierA=territoryA.numSoldier;
        numSoldierD=territoryB.numSoldier;
        if(numSoldierA>=4){
            numAttacker=3;
        }
        else{
            numAttacker=numSoldierA-1;
        }

        if(numSoldierD>=2){
            numDefender=2;
        }
        else{
            numDefender=numSoldierD-1;
        }
        //round
        nDedD=0;
        nDeadA=0;
        listDiceDefender=generateDices(numDefender);
        listDiceAttacker=generateDices(numAttacker);
        numSoldierA=territoryA.numSoldier;
        numSoldierD=territoryB.numSoldier;
        auxA=getNumDices(listDiceAttacker,Math.min(listDiceAttacker.length, listDiceDefender.length));
        auxD=getNumDices(listDiceDefender,Math.min(listDiceAttacker.length, listDiceDefender.length));
        while(auxA!=[] && auxD!=[]){
            if(removeMaxDice(auxA)>removeMaxDice(auxD)){
                console.log('gana atacante');
                console.log('Defensor: '+territoryD.numSoldier);
                territoryD.numSoldier-=1;
                console.log('Defensor: '+territoryD.numSoldier);

            }else{
                console.log('gana defensor');
                console.log('Atacante: '+territoryD.numSoldier);
                territoryA.numSoldier-=1;
                console.log('Atacante: '+territoryD.numSoldier);
            }            
        }




    }

    this.nextStage = function(){
        //return the next stage
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Atack');
        
    }

    this.validateChangeStage=function(match){
      
    }

}

var move = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Move";
    this.initStage= function(match){
        console.log('init Move');
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Move******");
    }

    this.nextStage = function(){
        //return the next stage
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Move');
        
    }

    this.validateChangeStage=function(match){
      
    }

}

var changeCards = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Carts";
    this.initStage= function(match){
        console.log('init Carts');
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //args = {nick, cardsTraced, cards}
        //cards: the rest of the cards of the player

        //update the graph
        console.log("********Change Cards******");
        //recibir cartas, removerlas del jugador
        //calcular numero de soldados
        
        var nick = args.nick;
        match.cards.concat(args.cardsTraced); //add the cards to the heap

        var player = searchPlayer(match.listPlayer, nick);  //search the player
        player.cards = args.cards; //set the rest of the cards

        player.timesCardTrace+= 1; //incremenct the times that a player traces a card

        player.numSoldier+= calculateSoldiersByCards(player.timesCardTrace);  


    }

    this.nextStage = function(){
        //return the next stage
        return new reforceTerritory();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Carts');
        
    }

    this.validateChangeStage=function(match){
        
    }

}

var sendCard = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "sendCard";
    this.newCard = null;

    this.initStage= function(match){
        console.log('init receive Carts');
    }

    this.isChangeTurn= function(){
        return true;
    } 

    this.doMove = function(args, match){
        //get the new card
        console.log("********obtener New Card******");
        var nick = args.nick;
        console.log ("cartas", match.cards);
        this.newCard = match.cards.shift(); //get the new card
        var player = searchPlayer(match.listPlayer, nick);  //search the player
        player.cards.push(this.newCard); //add the new card to the player's cards

    }

    this.nextStage = function(){
        //return the next stage
        return new changeCards();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('build data receive Cards');
        return {nick: args.nick, card: this.newCard };

        
    }

    this.validateChangeStage=function(match){
        return "changeCards";
    }

}

exports.selectTerritory = selectTerritory;
exports.reforceTerritory = reforceTerritory;
exports.atackTerritory = atackTerritory;
exports.move = move;
exports.changeCards = changeCards;
exports.sendCard = sendCard;


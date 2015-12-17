function minimo(a,b){
    if(a<b)
        return a;
    return b;
}
function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}

function getNumDices(list,num){
    var newList=[];
    while(num>0){
        var index=0;
        var max=list[index];
        for (var i = 0; i < list.length; i++) {
            if (list[i]>max) {
                max=list[i];
                index=i;
            }
        }
        newList.push(list[index]);
        console.log('lista '+list);
        console.log('nueva lista '+newList)
        console.log('num '+num)
        delete list[index];
        num--;
    }
    return newList;
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
            return "Atack";
        else
            return "Reforce";
    }

}

var atackTerritory = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Atack";
    this.atacker=0;
    this.defender=0;
    this.listDiceDefender=null;
    this.listDiceAttacker=null;

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
        territoryD=graph.node(args.idTerritory2);
        nickAttacker=territoryA.owner;
        nickDefender=territoryD.owner;
        numSoldierA=territoryA.numSoldier;
        numSoldierD=territoryD.numSoldier;
        if(numSoldierA>=4){
            numAttacker=3;

        }
        else{
            numAttacker=numSoldierA-1;
        }
        console.log("########## numero Dados Atacante" + numAttacker);
        if(numSoldierD>=2){
            numDefender=2;
        }
        else{
            numDefender=1;
        }
        console.log("########## numero Dados Defensor" + numDefender);
        //round
        listDiceDefender=generateDices(numDefender);
        this.listDiceDefender=listDiceDefender.slice();//copy
        listDiceDefender.sort();
        listDiceDefender.reverse();

        listDiceAttacker=generateDices(numAttacker);
        this.listDiceAttacker=listDiceAttacker.slice();//copy
        listDiceAttacker.sort();
        listDiceAttacker.reverse();

        this.atacker=0;
        this.defender=0;
        console.log("########## Dados Atacante "+listDiceAttacker);
        console.log("########## Dados Defensor "+listDiceDefender);

        while (listDiceAttacker.length!=0 && listDiceDefender.length!=0){
            console.log("########## while");
            diceAttacker=listDiceAttacker.shift();
            diceDefender=listDiceDefender.shift();;
            if(diceAttacker>diceDefender){
                console.log('gana atacante');
                console.log('Defensor: '+territoryD.numSoldier);
                territoryD.numSoldier-=1;
                console.log('Defensor: '+territoryD.numSoldier);
                this.defender+=1;
                if(territoryD.numSoldier=0){
                    territoryD.owner=territoryA.owner;
                    territoryA.numSoldier-=1;
                    territoryD.numSoldier+=1;
                }
            }else{
                console.log('gana defensor');
                console.log('Atacante: '+territoryA.numSoldier);
                territoryA.numSoldier-=1;
                this.atacker+=1;
                console.log('Atacante: '+territoryA.numSoldier);
            }  

        }
    }

    this.nextStage = function(){
        //return the next stage
        return "Atack";
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Atack');
        var data = { 
            idTerritory1: args.idTerritory1,
            idTerritory2: args.idTerritory2,
            nickTurn: playerTurn.nick,
            dice1:this.listDiceAttacker,
            dice2:this.listDiceDefender,
            numAttacker:this.atacker,
            numDefender:this.defender,
            stage: stage
        };
        return data;
        
    }

    this.validateChangeStage=function(match){
      return "Atack";
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
        return true;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Carts******");
        //lastTerritorysConquers
    }

    this.nextStage = function(){
        //return the next stage
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
        return false;
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
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('build data receive Cards');
        return {nick: args.nick, card: this.newCard };

        
    }

    this.validateChangeStage=function(match){
      
    }

}

exports.selectTerritory = selectTerritory;
exports.reforceTerritory = reforceTerritory;
exports.atackTerritory = atackTerritory;
exports.move = move;
exports.changeCards = changeCards;
exports.sendCard = sendCard;


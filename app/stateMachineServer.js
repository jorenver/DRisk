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
        return true;
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

var changeCarts = function(){

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

exports.selectTerritory = selectTerritory;
exports.reforceTerritory = reforceTerritory;
exports.atackTerritory = atackTerritory;
exports.move = move;
exports.changeCarts = changeCarts;


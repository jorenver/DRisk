
var selectTerritory = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Select"; 

    this.doMove = function(args, match){
        //update the graph

        console.log("********actualizando grafo******");
        var nick = args.nick;
        var idTerritory = args.idTerritory;
        console.log(nick, idTerritory);
        var graphPtr = match.map.graph;

        graphPtr.node(idTerritory).owner = nick;
        graphPtr.node(idTerritory).numSoldier += 1;
    }

    this.nextStage = function(){
        //return the next stage

    }

}

exports.selectTerritory = selectTerritory;
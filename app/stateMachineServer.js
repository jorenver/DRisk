
var selectTerritory = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Select"; 

    this.updateMap = function(args, match, graph){
        //update the graph

        console.log("********actualizando grafo******");
        /*var nick = args.nick;
        var idTerritory = args.idTerritory;


        graph.node(idTerritory).owner = nick;
        graph.node(idTerritory).numSoldier += 1;*/
    }

    this.nextStage = function(){
        //return the next stage

    }

}

exports.selectTerritory = selectTerritory;
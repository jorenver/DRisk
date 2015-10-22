//state selectTerritory

var selectTerritory = function(){

	//recibe an object {nick, idTerritory, graph }

	this.doUpdateMap = function(args){
		//update the graph
		var nick = args.nick
		var idTerritory = args.idTerritory
		console.log(args.graph)
		args.graph.node(idTerritory).owner = nick
	}


}
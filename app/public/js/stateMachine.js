//state selectTerritory

var selectTerritory = function(){

	//recibe an object {nick, idTerritory, graph }
	this.stageName = "Select"; 

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

	this.validateMove = function(args){
		var idTerritory = args.idTerritory;

		var territory = args.graph.node(idTerritory);
		
		if( !territory.owner || (territory.owner == args.nick ) ){
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

		console.log("grafo actualizado Reforce", graph);
	}

	this.nextStage = function(){
		//return the next stage

	}


}





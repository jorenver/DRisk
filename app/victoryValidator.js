var victoryValidatorWorldDomination = function(){

	this.getWinner = function(match){
		var graphPtr = match.map.graph;
		var listPlayer=match.listPlayer;
		if(listPlayer.length==2){
			var territorys= graphPtr.nodes();
			var contPlayer1=0,contPlayer2=0;
			for(var i=0;i<territorys.length;i++){
				var territory = graphPtr.node(territorys[i]);
				if(territory.owner==listPlayer[0].nick)
					contPlayer1++;
				if(territory.owner==listPlayer[1].nick)
					contPlayer2++;
				if(contPlayer1>0 && contPlayer2>0)
					return null;	
			}
			if(contPlayer1==0){
				return listPlayer[1].nick;
			}
			if(contPlayer2==0){
				return listPlayer[0].nick;
			}
		}
		return null;
	}

	this.getLosers = function(match){
		var graphPtr = match.map.graph;
		var listPlayer=match.listPlayer;
		var losers=[];
		var aux={};
		for (var i = 0; i < listPlayer.length; i++){
			aux[listPlayer[i].nick]=0;
		}
		var territorys= graphPtr.nodes();
		for (var i = 0; i < territorys.length; i++) {
			var territory= graphPtr.node(territorys[i]);
			if(territory.owner!=null){
				aux[territory.owner]+=1;
			}	
		}
		for (var i = 0; i < listPlayer.length; i++){
			if(aux[listPlayer[i].nick]==0){
				losers.push(listPlayer[i].nick);
			}
		}

		return losers;
	}

}

var victoryvalidatorCapitalMode= function(){
	this.getWinner = function(match){

		return null;
	}

	this.getLosers = function(match){

		return null;
	}

}

var victoryvalidatorWorldSecretMission = function(){
	this.getWinner = function(match){

		return null;
	}

	this.getLosers = function(match){

		return null;
	}

}

exports.victoryValidatorWorldDomination = victoryValidatorWorldDomination;
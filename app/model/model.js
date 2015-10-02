var Matches={ 
	'1': { idMatch: 1, 
		nickCreator: 'jorenver', 
		stateMatch: 'publicada',
		listPlayer:[{nick:'jorenver'},{nick:'kevanort'},{nick:'obayona'}] 
	},
	'2': { idMatch: 2, 
		nickCreator: 'eloyasd', 
		stateMatch: 'pendiente',
	} 
};
var cont=3;

function validarNick(nick){
	for(i in Matches){
		Match=Matches[i];
		if (Match.stateMatch=='pendiente') {
			if(Match.nickCreator==nick)
				return false;	
		}else{
			for(j in Match.listPlayer){
				player=Match.listPlayer[j];
				if(player.nick==nick)
					return false;
			}
		}
	}
	return true;
}

exports.createMatch = function(request,response){
	var nick= request.query.nick;
	console.log(validarNick(nick));
	if(validarNick(nick)){
		var Match={
			idMatch:cont,
			nickCreator:nick,
			stateMatch:'pendiente'
		};
		cont=cont+1;
		Matches[Match.idMatch]=Match;
		console.log(Matches);
		response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
	}else
		response.render('index',{error:'nick'});
}

exports.Matches= Matches;

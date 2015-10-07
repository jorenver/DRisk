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
			numPlayer:0,
			mode:"",
			map:null,
			listPlayer:[],
			turn:"",
			state:null,
			stateMatch:'pendiente',
			cards:[]
		};
		cont=cont+1;
		Matches[Match.idMatch]=Match;
		request.session.Match=Match;
		console.log(Matches);
		response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
	}else if(!request.session.Match)
		response.render('index',{error:'nick'});
	else
		response.render('createMatch',{nick:request.session.Match.nickCreator,idMatch:request.session.Match.idMatch});
}

exports.setDataMatch = function(request,response){
	var nick= request.query.nick;
	var idMatch= request.query.idMatch;
	var numPlayer= request.query.numPlayer;
	var gameMode= request.query.gameMode;
	var Match;
	Match=Matches[idMatch];
	console.log(Match);
	console.log(numPlayer);
	Match.numPlayer=numPlayer;
	Match.gameMode=gameMode;
	console.log(Match);
	response.render('chooseMap',{nick:nick,mode:gameMode});
}



exports.Matches= Matches;

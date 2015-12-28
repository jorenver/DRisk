var model = require('../model/model');

exports.Start= function(request,response){

	//response.render('game',{idMatch:request.idMatch,nick:request.session.nick});
	//console.log(request.session.nick)
	response.render('game',{idMatch:request.idMatch,nick:request.session.nick});

}

exports.getNumSoldier= function(request,response){ //get nunSoilder
	var nick= request.query.nick;
	var player,match,idMatch;
	idMatch=request.session.idMatch;
	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@',idMatch)
	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@',nick)
	match=model.Matches[idMatch];
	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@',match)
	player= searchPlayer(match.listPlayer,nick);
	response.json({numSoldier:player.numSoldier,nick:nick})
}



function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}


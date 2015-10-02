var Matches={};
var cont=1;
exports.createMatch = function(request,response){
	var nick= request.query.nick;
	var Match={
		idMatch:cont,
		nickCreator:nick
	};
	cont=cont+1;
	Matches[Match.idMatch]=Match;
	console.log(Matches);
	console.log(Matches.length);
	response.render('createMatch',{nick:nick,idMatch:Match.idMatch});
}

exports.Matches= Matches;

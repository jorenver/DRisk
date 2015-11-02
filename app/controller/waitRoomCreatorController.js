var model = require('../model/model');

exports.waitRoomCreator = function(request,response){
	var id_match = request.query.id_match;
	var nick = request.session.nick;
	response.render('waitRoomCreator',{idMatch:id_match, nick: nick });
}
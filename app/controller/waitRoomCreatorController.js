var model = require('../model/model');
var Matches = model.Matches;

exports.waitRoomCreator = function(request,response){
	/*var id_match = request.query.id_match;
	var nick = request.session.nick;
	var map=Matches[id_match].map.name;
	response.render('waitRoomCreator',{idMatch:id_match, nick: nick , });*/
	model.goWaitRoom(request,response);
}
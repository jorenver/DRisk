exports.joinMatch = function(request,response){
	var nick= request.query.nick;
	response.render('chooseMatch',{nick:nick});
}
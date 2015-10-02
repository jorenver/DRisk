exports.createMatch = function(request,response){
	var nick= request.query.nick;
	response.render('createMatch',{nick:nick});
}
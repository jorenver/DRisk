var html_dir = './app/views/';

exports.startGame = function(request, response){
	response.render('startGame', {idGame: 1});
};
var html_dir = './app/views/';

exports.game = function(request, response){
	response.render('game', {mode: "Dominacion Mundial",
							players:[{nick:'jorge'},
									{nick:'mafia'},
									{nick:'fajada'},
									{nick:'rodrigo'},
									{nick:'oswaldo'},
									{nick:'kevin'}]
					});
};

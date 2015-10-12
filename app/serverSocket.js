var model = require('./model/model.js');


exports.createServerSocket = function(io,sessionMiddleware){
    var clients={};
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function(player) {  
        var session=player.request.session;
        if(session.player){
        	clients[session.player] = session.player;
        	player.on("chooseGame", function(data){
        		if(data.idPlayer == session.player){ 
        			model.joinPlayer(data.idMatch, data.idPlayer);
					model.printMatch(data.idMatch);
					player.emit("getWaitRoom", {"idMatch": data.idMatch, "sucess": true} );
        		}
        		else{
        			player.emit("getWaitRoom", {"idMatch": data.idMatch, "sucess": false, 
        				"idPlayer": session.player} );
        		}
        	});
        }
    }); 
}
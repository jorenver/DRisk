var model = require('./model/model.js');


exports.createServerSocket = function(io,sessionMiddleware){
    var clients={};
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function(player) {  
        var session= player.request.session;
        if(session.nick){
        	clients[session.player] = session.player;
        	
            player.on("chooseGame", function(data){
    			
                model.joinPlayer(data.idMatch, session.nick);
                console.log("variable de session",session.idMatch);
    			model.printMatch(data.idMatch);
    			player.emit("getWaitRoom", {idMatch: data.idMatch} );
        	});
        }
    }); 
}
var model = require('./model/model.js');


exports.createServerSocket = function(io,sessionMiddleware){
    var clients={};
    var clientsChoose={};
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function(player) {  
        var session= player.request.session;
        if(session.nick && session.idMatch==null){
        	clients[session.player] = session.player;
    
             player.on("addPlayerChoose", function(data){
                console.log('se agrega');
                clientsChoose[session.nick]=player;
                console.log(clientsChoose);
            });

            player.on("removePlayerChoose", function(data){
                console.log('se elimina');
                console.log(session.nick);
                delete clientsChoose[session.nick];               
                console.log(clientsChoose);
            });
        }else if(session.idMatch && session.nick){
            player.on("publicMatch", function(data){
                console.log('se va a publicar 2');
                idMatch=session.idMatch;
                nick=session.nick;
                model.emitPublicMatch(idMatch,nick,io);  
            });

            player.on("chooseGame", function(data){
                model.joinPlayer(data.idMatch, session.nick);
                console.log("variable de session",session.idMatch);
                model.printMatch(data.idMatch);
                player.emit("getWaitRoom", {idMatch: data.idMatch} );
            });
        }
    }); 
}
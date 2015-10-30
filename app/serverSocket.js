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
        	console.log('problema');
            player.on("chooseGame", function(data){
    			
                model.joinPlayer(data.idMatch, session.nick);
                console.log("variable de session",session.idMatch);
    			model.printMatch(data.idMatch);
    			player.emit("getWaitRoom", {idMatch: data.idMatch} );
                //notificar a los clientes que se encuentran en la partida de la persona que se unio
                //incrementar el contador de la partida en chooseGame
        	});

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
            console.log('si entre');
            player.on("publicMatch", function(data){
                console.log('se va a publicar 2');
                idMatch=session.idMatch;
                console.log(idMatch)
                nick=session.nick;
                model.publicMatch(idMatch,nick,io);  
            });
        }
    }); 
}
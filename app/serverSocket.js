var model = require('./model/model.js');


exports.createServerSocket = function(io,sessionMiddleware){
    var clients={};
    var clientsChoose={};
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function(player) {  
        var session= player.request.session;
        if(session.nick){
        	//clients[session.player] = session.player;

            player.on("chooseGame", function(data){
    			
                model.joinPlayer(data.idMatch, session.nick);
                console.log("variable de session",session.idMatch);
    			model.printMatch(data.idMatch);
    			player.emit("getWaitRoom", {idMatch: data.idMatch} );
                //notificar a los clientes que se encuentran en la partida de la persona que se unio
                //incrementar el contador de la partida en chooseGame
        	});

             player.on("addPlayerChoose", function(data){
                clientsChoose[session.nick]=player;
                
            });

            player.on("removePlayerChoose", function(data){
                delete clientsChoose[session.nick];               
                if(clients[session.idMatch]){
                    clients[session.idMatch].push(io);
                }

            });

            player.on("publicMatch", function(data){
                console.log('se va a publicar 2');
                idMatch=session.idMatch;
                console.log(idMatch)
                nick=session.nick;
                clients[idMatch]=[];
                clients[idMatch].push(io);
                model.publicMatch(idMatch,nick,io);  
            });

            player.on("startGame", function(data){
                model.Matches[session.idMatch].stateMatch='playing';
                players=clients[session.idMatch];
                for(p in players){
                    players[p].emit('playerStart');
                }
            });
        }
    }); 
}
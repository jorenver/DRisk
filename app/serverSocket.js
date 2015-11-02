var model = require('./model/model.js');
var stage = require('./stateMachineServer.js');

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
                session.idMatch=data.idMatch;
                console.log("variable de session",session.idMatch);
    			//model.printMatch(data.idMatch);
    			player.emit("getWaitRoom", {idMatch: data.idMatch} );
                //notificar a los clientes que se encuentran en la partida de la persona que se unio
                //incrementar el contador de la partida en chooseGame
        	});

        	clients[session.player] = session.player;
    
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
                //model.publicMatch(idMatch,nick,io);  
                model.emitPublicMatch(idMatch,nick,io);  
            });

            player.on("startGame", function(data){
                var currentMatch = model.Matches[session.idMatch];
                currentMatch.stateMatch='playing';
                var listPlayer = currentMatch.listPlayer;
                suffle(listPlayer); //suffle the list of players
                console.log("lista de jugadores", listPlayer);
                var playerTurn = listPlayer.shift(); //dequeue
                currentMatch.turn = playerTurn.nick; //set the first turn
                listPlayer.push(playerTurn); //enqueue 
                currentMatch.stage = new stage.selectTerritory();//set the stage select territory
                players=clients[session.idMatch];


                for(p in players){
                    players[p].emit('playerStart');
                }
            });

            player.on("doMove", function(args){
                var currentMatch = model.Matches[session.idMatch];
                currentMatch.stage.updateMap(null, null, null);
            });

        }
    }); 
}



    function suffle(input){
         
        for (var i = input.length-1; i >=0; i--) {
         
            var randomIndex = Math.floor(Math.random()*(i+1)); 
            var itemAtIndex = input[randomIndex]; 
             
            input[randomIndex] = input[i]; 
            input[i] = itemAtIndex;
        }
    }

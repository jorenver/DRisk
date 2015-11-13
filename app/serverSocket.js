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
                session.idMatch = data.idMatch;
                if(clients[session.idMatch]){
                    clients[session.idMatch].push(io);
                }
                model.joinPlayer(data.idMatch, session.nick,clients[session.idMatch]);
                console.log("variable de session",session.idMatch);
    			//model.printMatch(data.idMatch);
    			//player.emit("getWaitRoom", {idMatch: data.idMatch} );
                //notificar a los clientes que se encuentran en la partida de la persona que se unio
                //incrementar el contador de la partida en chooseGame
        	});

        	clients[session.player] = session.player;
    
             player.on("addPlayerChoose", function(data){
                clientsChoose[session.nick]=player;
            });

            player.on("removePlayerChoose", function(data){
                delete clientsChoose[session.nick];               
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
                /*
                    set num soilder for each player
                    2 players= 40 soldier
                    3 players= 35 soldier
                    4 players= 30 soldier
                    5 players= 25 soldier
                    6 players= 20 soldier
                */
                numSoldier=50-5*listPlayer.length;
                numSoldier=1;
                console.log('++++++++++++++++++number of soilder for each player:', numSoldier)
                for(p in listPlayer){
                    console.log(listPlayer[p]);
                    listPlayer[p].numSoldier=numSoldier;
                    console.log(listPlayer[p]);
                }
                var playersSocket = clients[session.idMatch];
                for(p in playersSocket){
                    playersSocket[p].emit('playerStart');
                }

                

            });

            player.on("doMove", function(args){
                var currentMatch = model.Matches[args.idMatch];
                console.log("doMove", currentMatch);
                currentMatch.stage.doMove(args, currentMatch);
                var playersSocket = clients[args.idMatch];
                var listPlayer = currentMatch.listPlayer;
                if(currentMatch.stage.isChangeTurn()){
                    //change the turn
                    var playerTurn = listPlayer.shift(); //dequeue
                    currentMatch.turn = playerTurn.nick; //set the first turn
                    listPlayer.push(playerTurn); //enqueue
                }else{
                    console.log('se mantiene el turno')
                    var playerTurn = listPlayer[listPlayer.length-1];
                    console.log(playerTurn)
                }
                nextState=currentMatch.stage.validateChangeStage(currentMatch);//get name of next stage
                var data=currentMatch.stage.buildData(args,playerTurn,nextState);
                if(currentMatch.stage.stageName!=nextState){ // only if is neceray change stage
                    currentMatch.stage=currentMatch.stage.nextStage();
                    currentMatch.stage.initStage(currentMatch);
                    console.log('cambie de estado');
                }
                for(p in playersSocket){
                    playersSocket[p].emit('updateMap', data);
                }
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

var model = require('./model/model.js');
var stage = require('./stateMachineServer.js');
var validator = require('./victoryValidator.js');

exports.createServerSocket = function(io,sessionMiddleware){
    var clients={};
    var clientsChoose={};
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function(player) {  
        var session = player.request.session;
        if(session.nick){

            player.on('addConnection',function(){
                //when a client has connected, we have to save that connection
                //player: is a current Socket connection
                if(session.idMatch){
                    if(!clients[session.idMatch]){
                        clients[session.idMatch] = [];
                    }
                    clients[session.idMatch].push(player);
                }
            });

            player.on("closeConnection",function(){
                //when a client has disconnected, we have to eliminate that client
                //player: is a current Socket connection
                var sockets = clients[session.idMatch];//it gets all the clients has joined to this match
                if(sockets){
                    //we can get one specific socket by id
                    for (i in sockets){
                        if(sockets[i].id == player.id){
                            console.log("se borro conexion")
                            delete sockets[i];
                        }
                    }
                }
            });

            player.on("chooseGame", function(data){
                player.emit("getWaitRoom",{idMatch:data.idMatch});//player goes to the wait room
                var sockets = clients[data.idMatch];
                model.joinPlayer(data.idMatch, session.nick,sockets);//notify to all players about the new player
        	});

        	//clients[session.player] = session.player;
    
            player.on("addPlayerChoose", function(data){
                clientsChoose[session.nick]=player;
            });

            player.on("removePlayerChoose", function(data){
                delete clientsChoose[session.nick];               
            });

            player.on("publicMatch", function(data){
                idMatch = session.idMatch;    nick = session.nick;
                model.emitPublicMatch(idMatch,nick,player);//stay the current match as 'published'
            });

            player.on("startGame", function(data){
                var currentMatch = model.Matches[session.idMatch];
                if(currentMatch.mode=="World Domination"){
                    currentMatch.validator= new validator.victoryValidatorWorldDomination(); 
                    console.log('xxxxxxxx Se Agrega el Validador xxxxxxx '+ currentMatch.validator)
                }
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

                numSoldier = 5;
                console.log('++++++++++++++++++number of soilder for each player:', numSoldier)
                
                for(p in listPlayer){
                    listPlayer[p].numSoldier=numSoldier;
                }
                
                var playersSocket = clients[session.idMatch];
                for(p in playersSocket){
                    playersSocket[p].emit('playerStart');
                }
            });

            player.on("doMove", function(args){
                var currentMatch = model.Matches[args.idMatch];
                console.log("*****Importante serverSocket: doMove****");
                currentMatch.stage.doMove(args, currentMatch);
                var playersSocket = clients[args.idMatch];
                var listPlayer = currentMatch.listPlayer;
                if(currentMatch.stage.isChangeTurn()){//change the turn
                    var playerTurn = listPlayer.shift(); //dequeue
                    currentMatch.turn = playerTurn.nick; //set the first turn
                    listPlayer.push(playerTurn); //enqueue
                }else{
                    console.log('se mantiene el turno')
                    var playerTurn = listPlayer[listPlayer.length-1];
                    //console.log(playerTurn)
                }
                nextState=currentMatch.stage.validateChangeStage(currentMatch, args);//get name of next stage
                var data=currentMatch.stage.buildData(args,playerTurn,nextState);
                if(currentMatch.stage.stageName=="Atack"){
                    var validator=currentMatch.validator;
                    data.winner=validator.getWinner(currentMatch);
                    data.loser = validator.getLoser(currentMatch);
                }
                if(data.winner){
                    console.log('%%%%%%%%%% el ganado es '+data.winner);
                }else{
                    console.log('%%%%%%%%%% no hay ganador');
                }
                if(currentMatch.stage.stageName!=nextState){ // only if is neceray change stage
                    currentMatch.stage=currentMatch.stage.nextStage();
                    currentMatch.stage.initStage(currentMatch);
                    console.log('cambie de estado');
                }
                else{
                    console.log("mantengo mi estado");
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

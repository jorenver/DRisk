var model = require('./model/model.js');

exports.createServerSocket = function(io,sessionMiddleware){
    
    io.use(function(socket,next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', function(player) {  
        var session=player.request.session
 
    }); 
}
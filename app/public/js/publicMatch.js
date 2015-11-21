var socket;

function publicMatch(event){
	socket.emit('publicMatch');
}

function initialize (){
	socket = io.connect();

	socket.on('connect',function(){
		console.log("conexion lista");
	});

	socket.on('goWaitRoomCreator', function(data){
  		window.location.href = "/waitRoomCreator";	
  	});
  	
	btnPublic.addEventListener('click',publicMatch,false);
}


window.addEventListener('load',initialize,false);
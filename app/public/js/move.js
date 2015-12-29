function openMove(){
	txtNumSoilderMove.value=1;
	popMove.style.display="flex";
}

function closeMove(){
	territorysSelected[0]=null;
	territorysSelected[1]=null;
	popMove.style.display="none";
}

function moveSoldier(){
	socket.emit("doMove", {nick: nick, 
							idMatch: idMatch, 
							idTerritory1: territorysSelected[0],
							idTerritory2: territorysSelected[1],
							num:txtNumSoilderMove.value} );
	popMove.style.display="none";
}
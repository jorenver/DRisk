function openMove(){
	txtNumSoilderMove.value=1;
	popMove.style.display="flex";
	txtNumSoilderMove.max=graph.node(territorysSelected[0]).numSoldier-1;
}

function closeMove(){
	territorysSelected[0]=null;
	territorysSelected[1]=null;
	popMove.style.display="none";
}

function moveSoldier(){
	if(txtNumSoilderMove.value<=graph.node(territorysSelected[0]).numSoldier-1){
		socket.emit("doMove", {nick: nick, 
								idMatch: idMatch, 
								idTerritory1: territorysSelected[0],
								idTerritory2: territorysSelected[1],
								num:txtNumSoilderMove.value} );
		popMove.style.display="none";
	}else{
		alert('Soilder Number Invalid');
	}
}
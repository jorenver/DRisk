
function closeBattle(event){
    battle.style.display="none";
    //chat.style.opacity=1;
}


function openBattle(){

	battle.style.display="flex";
	$('#Ocultar').off('click');
	$('#next').off('click');
	$('#Stop').off('click');
	Ocultar.addEventListener('click',closeBattle);
	
	if(!isMyTurn()){
		next.style.display="none";
		Stop.style.display="none";
	}else{
		next.style.display="flex";
		Stop.style.display="flex";
		next.addEventListener('click',nextRound);
		Stop.addEventListener('click',changeBattle);
	}
}



function nextRound(){
	socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
}

function changeBattle(){
	socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: null,idTerritory2: null });
	battle.style.display="none";
	//stage = stage.nextStage();
}
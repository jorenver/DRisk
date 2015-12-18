
function closeBattle(event){
    battle.style.display="none";
    //chat.style.opacity=1;
}


function openBattle(){
	battle.style.display="flex";
	Ocultar.addEventListener('click',closeBattle);
	next.addEventListener('click',nextRound);
	Stop.addEventListener('click',changeBattle);
}



function nextRound(){
	socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
}

function changeBattle(){
	socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: null,idTerritory2: null });
	battle.style.display="none";
	stage = stage.nextStage();
}
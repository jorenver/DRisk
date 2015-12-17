
function closeBattle(event){
    battle.style.display="none";
    //chat.style.opacity=1;
    territorysSelected[0]=null;
	territorysSelected[1]=null;
}


function openBattle(){
	battle.style.display="flex";
	Ocultar.addEventListener('click',closeBattle);
	Ocultar.addEventListener('click',nextRound);
	Ocultar.addEventListener('click',changeBattle);
}



function nextRound(){
	socket.emit("doMove", {nick: nick, idMatch: idMatch, idTerritory1: territorysSelected[0],idTerritory2: territorysSelected[1] } );
}

function changeBattle(){
	socket.emit("doMove", {stop:true});
	battle.style.display="none";
}
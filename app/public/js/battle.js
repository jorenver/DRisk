
function closeBattle(event){
	territorysSelected[0]=null;
	territorysSelected[1]=null;
    battle.style.display="none";
    //chat.style.opacity=1;
    //var gb= new graphicsBattle();
	//gb.cleanScope();
}


function openBattle(){

	battle.style.display="block";
	$('#Ocultar').off('click');
	$('#next').off('click');
	$('#Stop').off('click');
	Ocultar.onclick =closeBattle;
	//battle.style.width="500px";
	//battle.style.height="350px";
	//content_battle_canvas.style.width="500px";
	//content_battle_canvas.style.height="300px";
	if(!isMyTurn()){
		next.style.display="none";
		Stop.style.display="none";
	}else{
		if( graph.node(territorysSelected[0]).numSoldier>1){
			next.style.display="flex";
			next.onclick =nextRound;
		}else{
			next.style.display="none";
		}
		Stop.style.display="block";
		Stop.onclick =changeBattle;
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
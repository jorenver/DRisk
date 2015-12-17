
function closeBattle(event){
	//var chat=document.getElementById("contenido");
    battle.style.display="none";
    //chat.style.opacity=1;
}


function openBattle(){
	battle.style.display="flex";
	Ocultar.addEventListener('click',closeBattle);
	//var chat=document.getElementById("contenido");

	/*if(chat!=null){
		chat.style.opacity=0.5;
	}
	*/
}

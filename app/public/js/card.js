
function closeBattle(event){
	//var chat=document.getElementById("contenido");
    traceCard.style.display="none";
    //chat.style.opacity=1;
}


function openChangeCard(){
	traceCard.style.display="flex";
	tc_trace.addEventListener('click',closeBattle);
	//var chat=document.getElementById("contenido");

	/*if(chat!=null){
		chat.style.opacity=0.5;
	}
	*/
}

function publicMatch(event){
	window.location.href = "/publicMatch";

}

function initialize (){
	btnPublic.addEventListener('click',publicMatch,false);
}


window.addEventListener('load',initialize,false);
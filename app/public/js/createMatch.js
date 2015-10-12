
var currentMatch;

var Match =function (nickname,maxPlayer,mode){
	this.nickname = nickname;
	this.maxPlayer = maxPlayer;
	this.mode = mode;
}

function sendData(){
	var form = document.getElementById('dataMatchForm');
	var flag = form.checkValidity();
	if(flag){
		form.submit(); 
	}else{
		if(document.getElementById('inputMaxPlayer').value > 6){
			alert("Enter a smaller number of players");
		}else{
			alert("Enter the data correctly");
		}
	}
}

function init () {
	
}

window.addEventListener("load",init,false);

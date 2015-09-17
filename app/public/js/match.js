
var currentMatch;

var Match =function (nickname,maxPlayer,mode){
	this.nickname = nickname;
	this.maxPlayer = maxPlayer;
	this.mode = mode;
}

function sendData(){
	var mode = document.getElementById('modes').value;
	var input = document.getElementById('inputMaxPlayer');
	var flag = input.checkValidity();
	if(flag){
		var maxPlayer = document.getElementById('inputMaxPlayer').value;
		currentMatch = new Match(nick,maxPlayer,mode);
		window.location.href="/setParameterMatch?nickname="+ nick +"&maxPlayer=" + maxPlayer + "&mode=" +mode; 
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

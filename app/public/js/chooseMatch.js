var id_match = -1;
var socket;

function clickRow(event){
	id_match = this.getAttribute('data-idmatch');
	console.log("***", id_match);
	var rows = document.getElementsByClassName("row-table");


	for (var i = 0; i < rows.length; i++) {
	   rows[i].style.backgroundColor = "white"; 
	}


	this.style.backgroundColor = "red";

}

function processingMatches(event){
	var respond = JSON.parse(event.target.responseText);
	var matches = respond.games;

	var table = document.getElementById("table");
  	table.innerHTML = "";

  	var headers = ["Creator", "Game Mode","Players" ];

    var tr = document.createElement("tr");

  	for (j in headers){
      var th = document.createElement("td");
      th.innerHTML = headers[j];
      tr.appendChild(th);
    }
    table.appendChild(tr);

    for(var i =0; i< matches.length; i++){
	    var match = matches[i];
	    var tr = document.createElement("tr");
	    tr.setAttribute("class","row-table");
	    tr.setAttribute('data-idmatch',match.idMatch);

	    tr.addEventListener('click', clickRow, false);
		var td = document.createElement("td");
		td.innerHTML = match.nickName;
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = match.gameMode;
		tr.appendChild(td);

		var txtPlayers = match.players + "/" + match.totalPlayers;

		var td = document.createElement("td");
		td.innerHTML = txtPlayers;
		tr.appendChild(td);

	    table.appendChild(tr);

  	}

}

function joinMatch(event){
	if (id_match == -1){
		alert("Select one match from the list");
		return;
	}
	console.log("peticion al servidor ID: (idmatch, persona)", id_match, name);
	
	socket.emit("chooseGame", {idMatch: id_match, idPlayer: name });
	//window.location.href = "/chooseGame?id_match="+id_match +"&id_player=" + name;
}

function getMatches(){
	console.log("getMatches cliente");
	var request = new XMLHttpRequest();
	var url="/getMatches";
	request.open("POST",url,true);
	request.addEventListener('load',processingMatches ,false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send("nick="+name);
}

function connectSocketChooseMap(){
	socket = io.connect();

	socket.on('getWaitRoom',function(data){
 		console.log("pedir waitroom");
 		if(data.sucess){
 			window.location.href = "/waitroom?id_match="+ data.idMatch;	
 		}
 		else{
 			alert("error");
 			console.log("redirijo ");
 			window.location.href = "/joinMatch?nick="+ data.idPlayer;	
 		}
 		

  	});


}

function initialize(event){
	getMatches();
	btnJoin.addEventListener("click", joinMatch);

	// Create a new directed graph
	//var g = new graphlib.Graph();
	connectSocketChooseMap();



}


window.addEventListener('load',initialize,false);

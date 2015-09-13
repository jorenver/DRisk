var id_creator = -1;
var id_match = -1;


function clickRow(event){
	id_match = this.getAttribute('data-idmatch');
	id_creator = this.getAttribute('data-idcreator');

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
      var th = document.createElement("th");
      th.innerHTML = headers[j];
      tr.appendChild(th);
    }
    table.appendChild(tr);

    for(var i =0; i< matches.length; i++){
	    var match = matches[i];
	    var tr = document.createElement("tr");
	    tr.setAttribute("class","row-table");
	    tr.setAttribute('data-idmatch',match.idMatch);
	    tr.setAttribute('data-idcreator',match.idCreator);

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
	if (id_creator == -1 || id_match == -1){
		alert("Select one match from the list");
		return;
	}
	console.log("peticion al servidor ID: (creator, partido)", id_creator, id_match);

}

function getMatches(){
	var request = new XMLHttpRequest();
	var url="/matches";
	request.open("POST",url,true);
	request.addEventListener('load',processingMatches ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);
}

function initialize(event){
	getMatches();
	btnJoin.addEventListener("click", joinMatch);
}


window.addEventListener('load',initialize,false);

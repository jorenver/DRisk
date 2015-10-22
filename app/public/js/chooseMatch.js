var id_match = -1;
var socket;

//variables for pagination
var pag = 0;
var limit = 100000; 
var numPages = 10;

function clickRow(event){
	id_match = this.getAttribute('data-idmatch');
	var rows = document.getElementsByClassName("row-table");


	for (var i = 0; i < rows.length; i++) {
	   rows[i].style.backgroundColor = "white"; 
	}

	this.style.backgroundColor = "red";

}

function processingMatches(event){
	var respond = JSON.parse(event.target.responseText);
	var matches = respond.games;
	limit = respond.limit;

	if(matches.length == 0)
		return;
	//find table and clean it
	var table = document.getElementById("table");
  	table.innerHTML = "";

  	//insert headers
  	var headers = ["Creator", "Game Mode","Players" ];

    var tr = document.createElement("tr");

  	for (j in headers){
      var th = document.createElement("td");
      th.innerHTML = headers[j];
      tr.appendChild(th);
    }
    table.appendChild(tr);


    var i = 0;
    while(i< numPages){

    	if(i< matches.length){
	    	var match = matches[i];
	    	insertRow(false, match, table);
		}
		else{
			insertRow(true, null, table);
		}
		i= i + 1;

  	}

}

function insertRow(empty, data, table){
	
	if(!empty){
		var tr = document.createElement("tr");
    	tr.setAttribute("class","row-table");
	    tr.setAttribute('data-idmatch',data.idMatch);

	    tr.addEventListener('click', clickRow, false);
		var td = document.createElement("td");
		td.innerHTML = data.nickName;
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = data.gameMode;
		tr.appendChild(td);

		var txtPlayers = data.players + "/" + data.totalPlayers;

		var td = document.createElement("td");
		td.innerHTML = txtPlayers;
		tr.appendChild(td);

	    table.appendChild(tr);
	}
	else{
		var tr = document.createElement("tr");
    	tr.setAttribute("class","row-table-empty");

		var td = document.createElement("td");
		td.innerHTML = "-";
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = "-";
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = "-";
		tr.appendChild(td);

	    table.appendChild(tr);
	}
}

function replaceRow(data, table){
	var emptyRows = document.getElementsByClassName("row-table-empty");
	if(emptyRows.length == 0){
		return;
	}

	var row = emptyRows[0];
	row.addEventListener('click', clickRow, false);
	row.className = "";
	row.className = "row-table";
	row.setAttribute('data-idmatch',data.idMatch);

	var cells = row.children;
	cells[0].innerHTML = data.nickName;
	cells[1].innerHTML = data.gameMode;
	cells[2].innerHTML = data.players + "/" + data.totalPlayers;


}

function nextPage(event){
  if(pag < limit -1 ){
    pag = pag + 1;
  }
  getMatches();
}

function prevPage(event){
  if(pag > 0){
    pag = pag - 1; 
  }
  getMatches();
}


function joinMatch(event){
	if (id_match == -1){
		alert("Select one match from the list");
		return;
	}

	socket.emit("chooseGame", {idMatch: id_match});
}

function getMatches(){
	var request = new XMLHttpRequest();
	var url="/getMatches?nick="+name + "&page=" + pag;
	request.open("GET",url,true);
	request.addEventListener('load',processingMatches ,false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(null);
}

function connectSocketChooseMap(){
	socket = io.connect();

	socket.on('getWaitRoom',function(data){
 		var idMatch = data.idMatch;
 		window.location.href = "/waitroom?id_match="+ idMatch;	
 		
  	});

  	socket.on('PublicMatch', function(data){
  		var table = document.getElementById("table");
  		replaceRow(data, table);
  	});


}

function initialize(event){
	getMatches();
	btnJoin.addEventListener("click", joinMatch);
	connectSocketChooseMap();
	back.addEventListener("click", prevPage);
	next.addEventListener("click", nextPage);
	socket.emit('addPlayerChoose');

}


window.addEventListener('load',initialize,false);

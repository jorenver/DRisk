var colors = [
{string: "Red" , code: "#FF0000" }, {string:"Green" , code:"#04B404"},{string:"Orange" , code: "#FF8000"},
{string:"Blue" , code: "#0431B4"}, {string:"Pink" , code:"#F5A9A9"}, {string:"Yellow" , code: "#FFFF00"}, {string:"Brown" , code:"#3B240B"}
];


function processingPlayers(event){
	var respond = JSON.parse(event.target.responseText);
	var players = respond.players;

	var table = document.getElementById("tablePlayers");
  	table.innerHTML = "";

  	var headers = ["Color", "Players", " " ];

    var tr = document.createElement("tr");

  	for (j in headers){
      var th = document.createElement("td");
      th.innerHTML = headers[j];
      tr.appendChild(th);
    }
    table.appendChild(tr);


  	for(var i =0; i< players.length; i++){
	    var player = players[i];
	    var tr = document.createElement("tr");
	    tr.setAttribute("class","row-table");
		var td = document.createElement("td");
		td.innerHTML = colors[i].string;
		td.style.backgroundColor = colors[i].code;
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = player;
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = "X";
		tr.appendChild(td);		

	    table.appendChild(tr);

  	}

  	var dataGame = respond.dataGame;

  	numPlayers.innerHTML = "Number of players: " + players.length;
  	gameMode.innerHTML = "Mode: " + dataGame.mode;


}

function getPlayers(idGame){
	var request = new XMLHttpRequest();
	var url="/players?idGame=" + idGame;
	request.open("GET",url,true);
	request.addEventListener('load',processingPlayers ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);
}

function initialize(event){
	getPlayers(idGame);
}

window.addEventListener('load',initialize,false);

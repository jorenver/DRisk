var colors = [
{string: "Red" , code: "#FF0000" }, {string:"Green" , code:"#04B404"},{string:"Orange" , code: "#FF8000"},
{string:"Blue" , code: "#0431B4"}, {string:"Pink" , code:"#F5A9A9"}, {string:"Yellow" , code: "#FFFF00"}, {string:"Brown" , code:"#3B240B"}
];

var socket;

function processingMatch(event){
	var respond = JSON.parse(event.target.responseText);
	var match = respond.match;
	console.log(match);
	var strMap = match.map;
	console.log("strMap",strMap);
	var map = new graphlib.json.read(strMap);
	console.log(map.nodes());

	var stage = new selectTerritory();

	stage.doUpdateMap({nick: "eloy" , idTerritory:"Cuba" , graph: map});
	console.log("nodo", map.node("Cuba"))

	/*
	var table = document.getElementById("tablePlayers");
  	table.innerHTML = "";

  	var headers = ["Color", "Players" ];

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
	    //tr.setAttribute('data-idmatch',.idMatch);
	    //tr.setAttribute('data-idcreator',match.idCreator);

	    //tr.addEventListener('click', clickRow, false);
		var td = document.createElement("td");
		td.innerHTML = colors[i].string;
		td.style.backgroundColor = colors[i].code;
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = player;
		tr.appendChild(td);



	    table.appendChild(tr);

  	}

  	var dataGame = respond.dataGame;

  	numPlayers.innerHTML = "Number of players: " + players.length;
  	gameMode.innerHTML = "Mode: " + dataGame.mode;*/


}

function getMatch(idGame){
	var request = new XMLHttpRequest();
	var url="/getMatchData?id_match=" + idMatch;
	console.log(url);
	request.open("POST",url,true);
	request.addEventListener('load',processingMatch ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);
}

function socketConnect(){
	socket = io.connect();

	//recive the order to start game
	socket.on("playerStart", function(){
		window.location.href = "/game?idMatch="+idMatch;
	});

}

function initialize(event){
	getMatch(idMatch);
	socketConnect();

}


window.addEventListener('load',initialize,false);

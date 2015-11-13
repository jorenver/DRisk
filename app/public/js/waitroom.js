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
	var url="/getMatchData?id_match=" + idMatch + "&nick=" + nick;
	console.log(url);
	request.open("GET",url,true);
	request.addEventListener('load',processingMatch ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);
}

function socketConnect(){
	socket = io.connect();


	//recive the order to start game
	socket.on("playerStart", function(){
		window.location.href = "/game";

	});
	socket.on("addPlayer", function(data){
		var table = document.getElementById("tablePlayers");
	    var player = data.player;
	    var row = rowPlayer(player);
	    table.appendChild(row);
	});

}

function processingPlayers(event){
	var respond = JSON.parse(event.target.responseText);
	var players = respond.players;
	
	if(players.length == 0){
		return;
	}
	var table = document.getElementById("tablePlayers");
	$('table').empty();
	
	var headers = ["Color", "Player"];
	//insertHeaders(table,headers);
  	for(var i =0; i< players.length; i++){
	    var player = players[i];
	    var row = rowPlayer(player);
	    table.appendChild(row);
  	}
}

function rowPlayer(player){
	var array = [ { 'attribute' : 'class', 'value': 'row-table u-flex-row u-justify-center' } ];
	var tr = createElement('tr',array);
	var nick = player.nick;
	var color = player.color;
	console.log(color);

	array = [ { 'attribute' : 'class', 'value': 'row-table-color  u-flex-row u-justify-center u-align-center' } ];
	var td = createElement('td',array);
	td.innerHTML = ""; td.style.backgroundColor = color.code;
	tr.appendChild(td);

	array = [ { 'attribute' : 'class', 'value': 'row-table-nick' } ];
	td = createElement('td',array);
	td.innerHTML = nick;
	tr.appendChild(td);

	return tr;
}
function createElement(type,array){
	var element = document.createElement(type);
	for(var i in array){
		element.setAttribute(array[i].attribute,array[i].value);
	}
	return element;
}

function getPlayers(idGame){
	var request = new XMLHttpRequest();
	var url="/players?idMatch=" + idGame;
	request.open("GET",url,true);
	request.addEventListener('load',processingPlayers ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(null);
}

function initialize(event){
	getPlayers(idMatch);
	//getMatch(idMatch);
	
	socketConnect();
	socket.emit('removePlayerChoose');
}


window.addEventListener('load',initialize,false);

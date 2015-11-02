var colors = [
{string: "Red" , code: "#FF0000" }, {string:"Green" , code:"#04B404"},{string:"Orange" , code: "#FF8000"},
{string:"Blue" , code: "#0431B4"}, {string:"Pink" , code:"#F5A9A9"}, {string:"Yellow" , code: "#FFFF00"}, {string:"Brown" , code:"#3B240B"}
];
var socket;

function insertHeaders(table,headers){
	var array = [ { 'attribute' : 'class', 'value': 'row-table' } ];
    var tr = createElement('tr',array);
  	for (var j in headers){
      var th = createElement('td',[]);
      th.innerHTML = headers[j];
      tr.appendChild(th);
    }
    table.appendChild(tr);
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
	socketConnect();
}
function startGame(){
	socket.emit('startGame');
}

function socketConnect(){
	socket = io.connect();

	//recive the order to start game
	socket.on("playerStart", function(){
		window.location.href = "/game";
	});

}

window.addEventListener('load',initialize,false);

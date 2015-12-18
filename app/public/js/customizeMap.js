
var mapGroup;
var paper;

var files = ["../svg/america.svg","../svg/africa.svg","../svg/europa.svg"]

var mapsContinents = []

var continent ;
var currentScale = 0.6;

function handleDragStart(event){
	event.dataTransfer.effectAllowed = 'move';	
	event.dataTransfer.setData('text/plain', event.target.src);
}

function handleDragOver(event){
	event.preventDefault();
}

function handleDrop(event) {
	// this/e.target is current target element.
	// Stops some browsers from redirecting.
	if(event.stopPropagation){
		event.preventDefault();
	    event.stopPropagation(); 
	}
	var src = event.dataTransfer.getData('text/plain');
	
	var position = {};
	position.x = event.clientX;
	position.y = event.clientY;
	console.log(position);
	loadSVGMap(src,paper,position);
	return false;
}

function handleDragEnd(event) {
	console.log("finalizo");
	var id = event.target.id;
	$("#"+id).remove();
}


function onContinentDrag(event) {
    var continent = event.target;
    continent.position = new paper.Point(continent.position.x + event.delta.x, continent.position.y + event.delta.y);
}

function onContinentChangeParameters(event){// on click
	continent = event.target;
	$("#drawerMapConfiguration").css('display','flex');
}


function initLibPaper(){
	var canvasElement = document.getElementById('drawerMap');// Get a reference to the canvas object
	paper = new paper.PaperScope();
	paper.setup(canvasElement);
}

function loadSVGMap(file,paper,pos){	
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			var continent = paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
			continent.scale(0.6);
			continent.on('mousedrag',onContinentDrag);
			continent.on('click',onContinentChangeParameters);
			
			pos = calculateCoordiantes(pos);
			
			var x = pos.x ;
			var y = pos.y ;
			
			continent.position = new paper.Point(x,y);
			mapsContinents.push(continent);
		}
	});
}

function calculateCoordiantes(position){
	var x = 400 ;
	var y = 50 ;
	var newPosition = {};
	if( position.x - x < 0){
		newPosition.x = 0;
	}else{
		newPosition.x = position.x - x;
	}
	
	if(position.y - y < 0) {
		newPosition.y = 0;
	}else{
		newPosition.y = position.y - y;
	}

	return newPosition;
}

function outputUpdate(vol) {
	document.querySelector('#volume').value = vol*100 + "%";
}

function changeParameters(event){
	
	var size = parseFloat($("#sizeInput").val());
	var color = $("#colorInput").val();

	if(continent){
		var diference = size - currentScale;		
		size = currentScale + diference + (1.0 - currentScale);
		currentScale = currentScale + diference;
		continent.fillColor = color;
		if (size>0){
			continent.scale(size);
		}
	}
	$("#drawerMapConfiguration").css('display','none');
}

function closeParameters(event){
	$("#drawerMapConfiguration").css('display','none');
}

function init () {
	
	northAmerica.addEventListener("dragend",handleDragEnd,false);
	southAmerica.addEventListener("dragend",handleDragEnd,false);
	africa.addEventListener("dragend",handleDragEnd,false);
	asia.addEventListener("dragend",handleDragEnd,false);
	europe.addEventListener("dragend",handleDragEnd,false);

	drawerMap.addEventListener("drop",handleDrop,false);
	drawerMap.addEventListener("dragover",handleDragOver,false);
	
	initLibPaper();
}

window.addEventListener('load',init,false);
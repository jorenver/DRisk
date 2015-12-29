
var mapGroup;
var paper;

var files = ["../svg/america.svg","../svg/africa.svg","../svg/europa.svg"]

var path;
var line;

var mapsContinents = []

var continent ;
var currentScale = 0.6;

function handleDragStart(event){
	event.dataTransfer.effectAllowed = 'move';	
	event.dataTransfer.setData('text/plain', event.target.id);
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
	var id = event.dataTransfer.getData('text/plain');
	var position = {};
	position.x = event.clientX;
	position.y = event.clientY;
	console.log(position);
	console.log(id);
	loadSVGMap(id,paper,position);
	return false;
}

function handleDragEnd(event) {
	console.log("finalizo");
	var id = event.target.id;
	$("#"+id).remove();
}

function onDragContinent(event) {
    var continent = event.target;
    continent.position = new paper.Point(continent.position.x + event.delta.x, continent.position.y + event.delta.y);
}

function onClickContinent(event){// on click
	console.log("on click");
	continent = event.target;
	console.log(continent.data.id);
	var intersections = continent.getIntersections(line);
	var p ;
	if (intersections.length) {
		var result;
		intersections.forEach(function(intersection) {
			var point = intersection.point;
			new paper.Path.Circle({ center: point, radius: 5, fillColor: 'red' });
			p = intersection.path;
			var location = p.getLocationOf(point)
			result = p.split(location);
			p.closed = true;
			p.fillColor = "blue";
			if (result){
				result.closed = true;
				result.selected = true;    
				result.position.x += 10;
				result.position.y += 10
				result.fillColor = "green";
			}
		});
	}
}

function onDoubleClickContinent(event){//double click
	$("#drawerMapConfiguration").css('display','flex');
}

var circle;

function initLibPaper(){
	var canvasElement = document.getElementById('drawerMap');// Get a reference to the canvas object
	paper = new paper.PaperScope();
	paper.setup(canvasElement);	
}

function loadSVGMap(id,paper,pos){
	var element = document.getElementById(id);
	if(!element){
		return
	}
	var file = element.src;
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			var continentPath = paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
			configureContinent(continentPath,pos);
			appendContinent(id,continentPath);
			line = new paper.Path.Line([100, 100], [500, 500]);
			line.strokeColor = 'red';
			line.transformContent = false;
		}
	});
}

function configureContinent(continentPath,pos){
	continentPath.scale(0.8);
	pos = calculateCoordiantes(pos);
	continentPath.position = new paper.Point(pos.x,pos.y);
}

function appendContinent(id,continentPath){
	var continent = {};
	continent.id = id ;
	var compoundPath = continentPath.children[0].children[0].children[0];
	compoundPath.data.id = id;

	compoundPath.on('click',onClickContinent);
	//compoundPath.on('doubleclick',onDoubleClickContinent);
	//compoundPath.on('mousemove',onMouseMove);
	//compoundPath.on('mousedown',onMouseDownContinent);
	//compoundPath.on('mousedrag',onMouseDrag);
	//compoundPath.on('mouseup',onMouseUp);
	/*var children = compoundPath.children;
	for(var i = 0 ; i<children.length ; i++){
		var path = children[i];
		path.on('mousemove',onMouseMove);
	}*/
	continent.path = compoundPath;
	mapsContinents.push(continent);
}

function onMouseMove(event) {
	if(!path){
		nearestPoint = getNearestPoint(event.target,event.point);
		circle.position = nearestPoint;
	}else{
		console.log("hi");
		path.add(event.point);
	}
}

function onMouseDownContinent(event){
	if (path) {
		//path.selected = false;
	}else{
		console.log("new path");
		path = new paper.Path();
		path.strokeColor = 'black';
		path.fullySelected = true;
	}
	//path.add(nearestPoint);
}


function onMouseDrag(event) {
	console.log("mouse drag");
	path.add(event.point);
}

function onMouseUp(event) {
	if(path){
		path.selected = false;
		path.smooth();
		console.log("mouse up")
		var compoundPath = event.target;
		var intersections = compoundPath.getCrossings(path);
		console.log(intersections);
		var children = compoundPath.children;
		console.log(children);
		for(var i=0;i<intersections.length;i++){
			var c = new paper.Path.Circle({ center: intersections[i].point, radius: 5, fillColor: 'red' });
			var p = intersections[i].path;
			if(p){
				var location = p.getLocationOf(intersections[i].point);
				var result  = p.split(location);
				if(result){
					result.selected = true;
				}
			}	
		}
	}
}


function getNearestPoint(compoundPath,point){
	var delta_x,delta_y;
	var nearestPoint;
	for(var j = 0 ; j < compoundPath.children.length ; j++){
		var path = compoundPath.children[j];
		nearestPoint = path.getNearestPoint(event.point);
		delta_x =  Math.abs( point.x - nearestPoint.x );
		delta_y =  Math.abs( point.y - nearestPoint.y );
		if(delta_x <= 1 && delta_y <= 1){
			return nearestPoint;
		}
	}
	return point;
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
	document.querySelector('#outSize').value = vol*100 + "%";
}

function degresUpdate(degree){
	document.querySelector('#outDegrees').value = degree + "°";
}

function changeParameters(event){
	
	var size = parseFloat($("#sizeInput").val());
	var color = $("#colorInput").val();
	var degrees = parseInt($("#rotationInput").val());
	console.log(degrees);

	if(continent){
		var diference = size - currentScale;		
		size = currentScale + diference + (1.0 - currentScale);
		currentScale = currentScale + diference;
		if (size>0){
			continent.scale(size);
		}
		
		continent.fillColor = color;
		continent.rotate(degrees);
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
	//asia.addEventListener("dragend",handleDragEnd,false);
	europe.addEventListener("dragend",handleDragEnd,false);

	drawerMap.addEventListener("drop",handleDrop,false);
	drawerMap.addEventListener("dragover",handleDragOver,false);
	
	initLibPaper();
}

window.addEventListener('load',init,false);
//ondragstart="handleDragStart(event);" 
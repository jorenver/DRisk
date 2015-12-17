
var mapGroup;
var myPapers = [];

var files = ["../svg/america.svg","../svg/africa.svg","../svg/europa.svg"]

function handleDragStart(event){
	this.style.opacity = '0.4'; 
}

function init () {
	//initLibPaper('../svg/europa.svg');
	/*$("#continents" ).children().each(function(index){
		initContinentPaper(index,$(this)[0]);
	});*/
	initContinentPaper(0,document.getElementById('america'));
	initContinentPaper(1,document.getElementById('africa'));
}

function initLibPaper(url){
	// Get a reference to the canvas object
	var canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	//loadSVGMap(paper,url);
	paper.view.draw();// Draw the view now:
}

/*
function loadSVGMap(file){	
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			mapGroup = paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
			mapGroup.scale(0.70);
			handleClick();
		}
	});
}*/

function initContinentPaper(id,canvasElement){
	myPapers[id] = new paper.PaperScope();
	paper = myPapers[id];
	paper.setup(canvasElement);
	loadSVGMap(id,files[id]);
}


function loadSVGMap(id,file){	
	$.ajax({
		type: "GET",
		async: true,
		url: file,
		dataType: "xml",
		success: function(xml){
			var map= myPapers[id].project.importSVG(xml.getElementsByTagName("svg")[0]);
			map.scale(0.70);
			map.position = new myPapers[id].Point(paper.view.size.width/2, paper.view.size.height/2);
		}
	});
}

var selected = false;
var pathOne;
var pathTwo

function joinTerritory(event){
	/*if(!selected){
		pathOne = this;
		selected = true;
	}else{
		pathTwo = this;
		pathTwo.remove();
		var childrenTwo = pathTwo.children;
		pathOne.addChildren(childrenTwo);

		//paper.project.activeLayer.addChild(pathOne);
		pathOne.fillColor = 'red';
	}*/
	this.selected = true;

}

function handleClick(){
	var groupTerritory = mapGroup.children;// array de territorios, cada elemento es un objeto de tipo Group
	for(var i = 0 ; i < groupTerritory.length ; i++){
		groupTerritory[i].on('click',joinTerritory);
	}
}

window.addEventListener('load',init,false);
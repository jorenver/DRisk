

var ConfigurationWorker = function(){
	var self = this;
	this.configurationTool = null;
	this.paper = null;
	this.continentsID = ["NorthAmerica","SouthAmerica","Africa","Europe"]
	this.canvas = document.getElementById("drawerMap");
	this.util = null;
	this.mapsContinents = [];

	this.getCanvasElement = function(){
		return this.canvas;
	}

	this.init = function(){
		this.paper = new paper.PaperScope();
		this.paper.setup(this.canvas);	
		
		util = new Util();

		this.configurationTool = new ConfigurationTool(this.paper);
		this.configurationTool.init();
	}

	this.registerEvents = function(){
		var dragStart = new HandleDragStart();
		var dragEnd = new HandleDragEnd();
		var dragOver = new HandleDragOver();
		var drop = new HandleDrop();
		for(var i = 0 ; i <this.continentsID.length ; i++){
			var element = document.getElementById(this.continentsID[i]);
			if(element){
				element.addEventListener(dragStart.name, dragStart.action , false);
				element.addEventListener(dragEnd.name, dragEnd.action , false);
			}
		}
		this.canvas.addEventListener(dragOver.name,dragOver.action,false);
		this.canvas.addEventListener(drop.name,drop.action,false);
		this.canvas.addEventListener('loadMap',this.loadMap,false);
	}

	this.loadMap = function(event){
		var detail = event.detail;
		var element = document.getElementById(detail.id);
		if(!element){
			return
		}
		var file = element.src;
		var callback = function (xml){
			var continentPath = paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
			var args = {};
			args.factorScale = 0.8;
			args.position = detail.position;
			self.configureContinent(continentPath,args);
			continentPath.on('click',function(event){
				self.appendContinent(detail.id,continentPath);
				self.configurationTool.doConfiguration({ event: event});
			});
		}

		$.ajax({
			type: "GET",
			async: true,
			url: file,
			dataType: "xml",
			success: callback
		});
	}

	this.configureContinent = function(continentPath,args){
		console.log(args);
		continentPath.scale(args.factorScale);
		var pos = util.calculateCoordinates(args.position);
		continentPath.position = new paper.Point(pos.x,pos.y);
	}

	this.appendContinent = function(id,continentPath){
		var continent = {};
		var compoundPath = continentPath.children[0].children[0].children[0];
		continent.id = id ;
		compoundPath.data.id = id;
		continent.path = compoundPath;
		this.mapsContinents.push(continent);
	}
}

var HandleDragStart = function(){
	this.name = "dragstart";
	this.action = function(event){
		event.dataTransfer.effectAllowed = 'move';	
		event.dataTransfer.setData('text/plain', event.target.id);
	}
}

var HandleDragEnd = function(){
	this.name = "dragend";
	this.action = function(event){
		var id = event.target.id;
		$("#"+id).remove();
	}
}

var HandleDragOver = function(){
	this.name = "dragover";
	this.action = function(event){
		event.preventDefault();
	}
}

var HandleDrop = function(){
	this.name = "drop";	
	this.action = function(event){
		if(event.stopPropagation){
			event.preventDefault();
	    	event.stopPropagation(); 
		}
		var id = event.dataTransfer.getData('text/plain');
		var position = {};
		position.x = event.clientX;
		position.y = event.clientY;
		var loadMapEvent = new CustomEvent('loadMap', { 
			'detail' : {
				id : id , 
				position : position
			}
		});
		var canvas = document.getElementById("drawerMap");
		canvas.dispatchEvent(loadMapEvent);
		return false;
	}
}


var Util = function(){

	this.calculateCoordinates = function(position){
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

}
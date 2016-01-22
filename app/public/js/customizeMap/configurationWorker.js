

var ConfigurationWorker = function(){
	var self = this;
	this.configurationTool = null;
	this.paper = null;
	this.continentsID = ["NorthAmerica","SouthAmerica","Africa","Europe","Oceania"]
	this.canvas = document.getElementById("drawerMap");
	this.util = null;
	this.mapsContinents = [];

	this.getCanvasElement = function(){
		return this.canvas;
	}

	this.init = function(){
		this.paper = new paper.PaperScope();
		this.paper.setup(this.canvas);	
		
		this.util = new Util();

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
			//we have to change a position,scale, strokeColor, etc and register events for the continent
			var args = {};
			args.idContinent = detail.id;
			args.factorScale = 0.6;
			args.position = self.util.calculateCoordinates(detail.position);
			args.stroke = "black"
			self.fitContinent(continentPath,args);
			self.registerEventContinent(continentPath.children[0].children[0].children[0]);
		}
		$.ajax({
			type: "GET",
			async: true,
			url: file,
			dataType: "xml",
			success: callback
		});
	}

	this.registerEventContinent = function(compoundPath){//register events of the continent
		var mouseEnter = new HandleMouseEnter();
		var mouseLeave = new HandleMouseLeave();
		compoundPath.on(mouseLeave.name,mouseLeave.action);
		compoundPath.on(mouseEnter.name,function(event){
			var continent = event.target;
			if(continent._class == "CompoundPath"){
				mouseEnter.action(event);
				self.configurationTool.doConfiguration({ event: event });
				self.configurationTool.setContinents(self.mapsContinents);
			}
		});	
	}

	this.fitContinent = function(continentPath,args){//change position scale,fillColor, stroke Color of the continent
		continentPath.scale(args.factorScale);
		continentPath.position = new paper.Point(args.position.x,args.position.y);
		continentPath.strokeColor = args.stroke;

		var compoundPath = continentPath.children[0].children[0].children[0];
		compoundPath.data.id = args.idContinent;
		compoundPath.data.scale = args.factorScale;
		self.addContinent(compoundPath);	
	}

	this.addContinent = function(compoundPath){
		this.mapsContinents.push(compoundPath);
	}
}

var HandleMouseEnter = function(){
	this.name = "mouseenter";
	this.action = function(event){
		if(!configurationWorker.configurationTool.currentOption){
			return;
		}
		var continent = event.target;
		continent.shadowColor =new configurationWorker.paper.Color(1, 0, 0);
		continent.shadowBlur = 15;// Set the shadow blur radius to 12:
		continent.shadowOffset = new configurationWorker.paper.Point(0, 0);// Offset the shadow by { x: 5, y: 5 }
	}
}

var HandleMouseLeave = function(){
	this.name = "mouseleave";
	this.action = function(event){
		if(!configurationWorker.configurationTool.currentOption){
			return;
		}
		var continent = event.target;
		continent.shadowColor = null;
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
		//configurationWorker.configurationTool.setContinents(configurationWorker.mapsContinents);
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

	this.compareDistances = function(obj1,obj2){
		var distOne, distTwo;
		distOne = obj1.distance;
		distTwo = obj2.distance;
		if( distOne == distTwo ){
			return 0;
		}
		if( distOne > distTwo ){
			return 1;
		}
		return -1;
	}

	this.getDistance = function(pointOne,pointTwo){
		var delta_x,delta_y;
		var distance;
		delta_x =  Math.abs( pointOne.x - pointTwo.x );
		delta_y =  Math.abs( pointOne.y - pointTwo.y );
		distance = Math.sqrt(delta_x*delta_x + delta_y*delta_y);
		return distance;
	}

	this.generateColor = function(){
		var red,green,blue;
		var max = 255;
		red = Math.floor(Math.random()*255 + 1);
		green = Math.floor(Math.random()*255 + 1);
		blue = Math.floor(Math.random()*255 + 1);
		return new paper.Color(red/max, green/max, blue/max);
	}

	this.generateGrayColor = function(){
		var gray;
		var max = 255;
		gray = Math.floor(Math.random()*180 + 50);
		return new paper.Color(gray/max);
	}

	this.lightContinent = function(continent){
		continent.shadowColor = "blue"
		continent.shadowBlur = 15;
	}

	this.notification = function(msg,callback){

	}

}

var Notification = function(msg,callback){
	var self = this;
	this.parentHTML = {};
	this.buttonAccept = {};
	this.action = callback;

	this.launch = function(){
		var div = $("<div>", { class: "notification u-flex-column u-align-center u-justify-space-around" }).html(msg);
		var divButton = $("<div>", { class: "notificationButton u-flex-row u-align-center u-justify-center" })
		this.buttonAccept = $("<input>",{ value: 'ok', type : "button"});
		this.parentHTML = div;
		this.buttonAccept.on('click',function(){
			//self.action();
			self.quit();
		});
		//$('#mapWrapper').animate({opacity: 0.4}, 500);
		divButton.append(this.buttonAccept);
		div.append(divButton)
		setTimeout(function(){ 
			self.quit();
		}, 3000);
		$("body").append(div);   
	}

	this.quit = function(){
		self.parentHTML.slideUp();
	}


}
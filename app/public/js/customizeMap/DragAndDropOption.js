/*Drag and Drop a continent*/
var DragAndDropOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.target = null;
	this.util = new Util()

	this.configure = function(args){
		var eventMouse = args.event;
		this.target = eventMouse.target;
		this.removeEventsHandle(this.target);
		this.target.on('mousedrag',this.mouseDrag);
		this.target.on('mousedown',this.mouseDown);
		this.target.on('mouseup',this.mouseUp);
	}

	this.removeEventsHandle = function(target){
		target.off('mousedrag');
		target.off('mousedown');
		target.off('mouseup');
		target.off('mousemove');
		target.off('click');
	}

	this.mouseDown = function(event){
		self.util.lightContinent(event.target);
	}

	this.mouseUp= function(event){
		event.target.shadowColor = null;
	}

	this.mouseDrag = function(event){
		var continent = event.target;
		self.target = event.target;
	    continent.position = new paper.Point(continent.position.x + event.delta.x, continent.position.y + event.delta.y);
	}

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
		if(this.target){
			this.removeEventsHandle(this.target);
		}
	}

	this.setContinents = function(continents){

	}
}
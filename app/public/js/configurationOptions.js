/*Drag and Drop a continent*/
var DragAndDropOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;

	this.configure = function(args){
		console.log("drag and drop a continent!");
		var eventMouse = args.event;
		this.target = eventMouse.target;
		this.target.on('mousedrag',this.drag);
	}

	this.drag = function(event){
		var continent = event.target;
	    continent.position = new paper.Point(continent.position.x + event.delta.x, continent.position.y + event.delta.y);
	}
}

/*Remove Continent from a canvas*/
var RemoveOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;

	this.configure = function(args){
		console.log("remove a continent!");
		this.target = args.event.target;
		this.target.remove();
	}

}

/*Change Parameters of continent*/
var ParametersOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.currentScale = 0.6;
	this.id = id;

	this.configure = function(args){
		console.log("change parameter of a continent");
		this.target = args.event.target;
		var canvas = document.getElementById("drawerMap");
		canvas.addEventListener('changeParameter',this.changeParameters,false);
		$("#drawerMapConfiguration").css('display','flex');
	}

	this.changeParameters = function(event){
		var detail = event.detail;
		var size = detail.size;
		var color =  detail.color;
		var degrees = detail.degrees;

		if(self.target){
			console.log("change Parameters");
			var diference = size - self.currentScale;		
			size = self.currentScale + diference + (1.0 - self.currentScale);
			self.currentScale = self.currentScale + diference;
			if (size>0){
				self.target.scale(size);
			}
			self.target.fillColor = color;
			self.target.rotate(degrees);
		}
	}
}

/*Divide territories into continent*/
var DivideTerritoriesOption = function(paper,id){
	
}


/*Link a territories*/
var LinkTerritoriesOption = function(paper,id){

}


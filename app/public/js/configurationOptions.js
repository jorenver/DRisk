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

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
		if(this.target)
			this.target.off('mousedrag');
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
		var id = this.target.data.id;
		/*Reset */
		var img = document.createElement('img');
		$(img).attr('id',id);
		$(img).attr('src',"../svg/" + id + ".svg");
		$(img).attr('class','map');
		$(img).attr('draggable',true);

		var dragStart = new HandleDragStart();
		var dragEnd = new HandleDragEnd();
		img.addEventListener(dragStart.name, dragStart.action , false);
		img.addEventListener(dragEnd.name, dragEnd.action , false);
		continents.appendChild(img);
		/**/
	}

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
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

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
	}
}

/*Divide territories into continent*/
var DivideTerritoriesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.circles = [];
	this.target = null
	this.startPoint = null;
	this.endPoint = null;
	//this.edges = [];

	this.configure = function(args){
		console.log("divide territories of continents");
		this.target = args.event.target;
		this.target.strokeColor = "black";
		this.target.on('mousemove',this.mouseMove);
		this.target.on('click',this.mouseClick);
		this.pointerReference = new paper.Path.Circle({ center: paper.view.center, radius: 3, fillColor: 'red' });
		buttonAccept.addEventListener('click',this.dividePaths,false);
	}

	this.generateColor = function(){
		var red,green,blue;
		var max = 255;
		red = Math.floor(Math.random()*255 + 1);
		green = Math.floor(Math.random()*255 + 1);
		blue = Math.floor(Math.random()*255 + 1);
		return new paper.Color(red/max, green/max, blue/max);
	}

	this.mouseMove = function(event){
		console.log("mouse move");
		var point = self.getNearestPoint(event.target,event.point);
		if(point){
			self.pointerReference.position = point;
		}
	}

	this.mouseClick = function(event){
		if(!self.startPoint){
			self.startPoint = self.getNearestPoint(event.target,event.point);
			self.circles.push(new paper.Path.Circle({ center: self.startPoint, radius: 5, fillColor: 'blue' }));
			self.pointerReference.remove();
		}else{
			self.endPoint = self.getNearestPoint(event.target,event.point);
			self.circles.push(new paper.Path.Circle({ center: self.endPoint, radius: 5, fillColor: 'blue' }));
			var straightLine = new paper.Path.Line(self.startPoint, self.endPoint);
			straightLine.strokeColor = 'black';
			straightLine.scale(1.1);
			//self.edges.push(straightLine);
			var compoundPath = event.target;
			var intersections = compoundPath.getIntersections(straightLine);
			self.splitPaths(intersections);
			self.closedPaths(compoundPath,intersections);
			straightLine.remove();
			self.startPoint = null;
			self.endPoint = null;
			self.pointerReference.remove();
		}
	}


	this.splitPaths = function(intersections){
		var parentPath;
		intersections.forEach(function(intersection) {
			var point = intersection.point;
			parentPath = intersection.path;	
			var location = parentPath.getLocationOf(point);
			parentPath.split(location);
		});
	}

	this.closedPaths = function(compoundPath,intersections,edge){
		var children = compoundPath.children;
		for(var j = 0 ; j < children.length ; j++){
			var child = children[j];
			for(var i = 0 ; i < intersections.length ; i++){
				var location = children[j].getLocationOf(intersections[i].point);
				if(location){
					child.join(edge);
					//child.selected = true;
					child.closed = true;
					child.strokeColor = "black";
					break;
				}
			}
		}
	}

	this.dividePaths = function(){
		console.log("mouse double click");
		var compoundPath = self.target;
		var children = compoundPath.children;
		var group = new self.paper.Group();
		for(var j = 0 ; j < children.length ; j++){
			var child = children[j].clone();
			child.fillColor = self.generateColor();
			child.strokeColor = "black";
			group.addChild(child);
		}
		group.position = compoundPath.position;
		compoundPath.remove();
	}

	this.removeCircles = function(){
		while(self.circles.length){
			var circle = self.circles.pop()
			circle.remove();
		}
	}

	this.getNearestPoint = function(compoundPath,point){
		if(!compoundPath.children){
			return null;
		}
		var delta_x,delta_y;
		var nearestPoint;
		var distance;
		var results = [];
		for(var j = 0 ; j < compoundPath.children.length ; j++){
			var path = compoundPath.children[j];
			nearestPoint = path.getNearestPoint(point);
			delta_x =  Math.abs( point.x - nearestPoint.x );
			delta_y =  Math.abs( point.y - nearestPoint.y );
			distance = Math.sqrt(delta_x*delta_x + delta_y*delta_y);
			results.push( { nearestPoint : nearestPoint , distance : distance } );	
		}
		var sortedResults = results.sort(this.compareDistances);
		var minPoint = sortedResults[0].nearestPoint;
		return minPoint;
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

	this.disable = function(){
		if(this.target){
			this.target.off('click');
			this.target.off('mousemove');
			this.pointerReference.remove();
			this.removeCircles();
			$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
		}
	}
}


/*Link a territories*/
var LinkTerritoriesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;

	this.configure = function(args){
		console.log("links continents");
		this.target = args.event.target;
		
	}

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
	}

}


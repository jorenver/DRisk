
var RedrawEdgesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.target = null
	this.firstSegment = null;
	this.secondSegment = null;
	this.hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 }


	this.configure = function(args){
		console.log("redraw edges of territories");
		var eventMouse = args.event;
		this.target = eventMouse.target;
		this.target.on('click',this.mouseClick);
		this.util = new Util();
	}

	this.mouseClick = function(event){
		console.log("mouse click")
		self.removeEventsHandle(self.target);
		self.util.lightContinent(self.target);
		self.target.on('mouseenter',self.mouseEnter)
		self.target.on('mouseleave',self.mouseLeave)
		self.target.on('mousedown',self.mouseDown);
		self.target.on('mousedrag',self.mouseDrag);
		self.target.on('mouseup',self.mouseUp);
	}

	this.removeEventsHandle = function(target){
		target.off('mouseenter');
		target.off('mouseleave');
		target.off('mousedrag');
		target.off('mousedown');
		target.off('mouseup');
		target.off('mousemove');
		target.off('click');
	}

	this.mouseDown = function(event){
		var point = event.point;
		var hitResult = self.target.hitTest(event.point, self.hitOptions);
		var location , firstPath, secondPath;
		if(!hitResult){
			return;
		}
		console.log(hitResult);
		if(hitResult.type == 'stroke'){
			location = hitResult.location;//first path closer
			firstPath = hitResult.item;
			var array = self.getNearestPaths(self.target,point);//get second paht closer
			self.firstSegment = firstPath.insert(location.index + 1, point);
			if(array){
				for(var i = 0 ; i < array.length ; i++){
					if (array[i].path.id != firstPath.id){
						secondPath = array[i].path;
						break;
					}
				}
				location = secondPath.getNearestLocation(point);
				self.secondSegment = secondPath.insert(location.index + 1, point);
			}
		}
	}

	this.mouseDrag = function(event){
		if(self.firstSegment){
			self.firstSegment.point = new paper.Point(self.firstSegment.point.x + event.delta.x,self.firstSegment.point.y + event.delta.y);
		}
		if(self.secondSegment){
			self.secondSegment.point = new paper.Point(self.secondSegment.point.x + event.delta.x,self.secondSegment.point.y + event.delta.y)
		}
	}

	this.mouseUp = function(event){
		self.firstSegment = null;
		self.secondSegment = null;
	}

	this.mouseEnter = function(event){
		var point = event.point;
		var array = self.getNearestPaths(self.target,point);
		var pathCloser = array[0].path;
		//pathCloser.selected = true;
	}

	this.mouseLeave = function(event){
		var point = event.point;
		var array = self.getNearestPaths(self.target,point);
		var pathCloser = array[0].path;
		//pathCloser.selected = false;
	}

	this.getNearestPaths = function(compoundPath,point){
		if(!compoundPath.children){
			return null;
		}
		var distance;
		var results = [];
		var path ;
		for(var j = 0 ; j < compoundPath.children.length ; j++){
			path = compoundPath.children[j];
			nearestPoint = path.getNearestPoint(point);
			distance = this.util.getDistance(point,nearestPoint);
			results.push( { path : path , distance : distance } );	
		}
		return results.sort(this.util.compareDistances);
	}

	this.disable = function(){
		if(this.target){
			for(var i = 0 ; i < this.target.children.length ; i++){
				this.target.children[i].selected = false;
			}
			this.target.selected = false;
		}
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
	}

	this.setContinents = function(continents){

	}

}

/*Divide territories into continent*/
var DivideTerritoriesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.target = null
	this.startPoint = null;
	this.endPoint = null;
	this.pointerReference = null;
	this.continents = []
	this.circles = [];
	this.notificationOn = false;
	
	this.configure = function(args){//mouse enter event
		console.log("divide territories of continents");
		var continent = args.event.target;
		continent.on('click',this.defineContinent);
		this.util = new Util();
	}

	this.defineContinent = function (event){
		self.target = event.target;
		self.startPoint = null;
		self.endPoint = null;
		if(self.pointerReference){
			self.pointerReference.remove();
			self.pointerReference = null;
		}
		self.removeEventsHandle(self.target);
		self.pointerReference = new paper.Path.Circle({ center: paper.view.center, radius: 3, fillColor: 'red' });
		self.pointerReference.bringToFront();
		self.target.on('mousemove',self.mouseMove);
		self.target.on('click',self.mouseClick);
		self.continents.forEach(function(continent){
			if(continent.data.id != self.target.data.id){
				continent.off('mousemove',self.mouseMove);
				continent.off('click',self.mouseClick);
				continent.on('click',self.defineContinent);
				continent.shadowColor = null;
			}
		});
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
		self.util.lightContinent(event.target);
		if(point){
			self.pointerReference.bringToFront();
			self.pointerReference.position = point;
		}
	}

	this.mouseClick = function(event){
		if(!self.startPoint){
			self.startPoint = self.getNearestPoint(self.target,event.point);
			self.circles.push(new paper.Path.Circle({ center: self.startPoint, radius: 5, fillColor: 'blue' }));
		}else{
			self.endPoint = self.getNearestPoint(self.target,event.point);
			self.circles.push(new paper.Path.Circle({ center: self.endPoint, radius: 5, fillColor: 'blue' }));
			var straightLine = new paper.Path.Line(self.startPoint, self.endPoint);
			straightLine.strokeColor = 'black';
			straightLine.scale(1.1);
			//self.edges.push(straightLine);
			var compoundPath = event.target;
			var intersections = compoundPath.getIntersections(straightLine);
			intersections = self.filterIntersections(intersections);
			self.splitPaths(compoundPath,intersections);
			self.closedPaths(compoundPath,intersections);
			straightLine.remove();
			self.startPoint = null;
			self.endPoint = null;
		}
	}

	this.compareCurveLocation = function(locationOne,locationTwo){
		if(locationOne.point.y == locationTwo.point.y){
			return 0;
		}
		if(locationOne.point.y > locationTwo.point.y){
			return 1;
		}
		return -1;
	}

	this.filterIntersections = function(intersections){
		var intersection;
		var radius = 6;
		var flag = false;
		var interFiltered = [];
		var clusters = [];
		var num_clusters = 0
		intersections = intersections.sort(this.compareCurveLocation);
		for(var i = 0; i <intersections.length ; i++){
			intersection = intersections[i];
			clusters[num_clusters] = [];
			clusters[num_clusters].push(intersection)
			for(var j = i + 1 ; j < intersections.length ; j++ ){
				var distance = intersection.point.getDistance(intersections[j].point);
				if( intersection._id != intersections[j]._id && distance <= radius){
					clusters[num_clusters].push(intersections[j]);
					i++;
				} 
			}
			num_clusters += 1;
		}
		console.log(clusters);
		for(var i = 0; i < num_clusters ; i++){
			var cluster = clusters[i];
			interFiltered.push(cluster.pop());
		}

		return interFiltered;
	}

	this.splitPaths = function(compoundPath,intersections){
		var parentPath;
		intersections.forEach(function(intersection) {
			var point = intersection.point;
			var pathsIntersected = self.getPaths(compoundPath,point);
			for(var j = 0 ; j < pathsIntersected.length ; j++){
				var parentPath =  pathsIntersected[j];
				var location = parentPath.getLocationOf(point);
				parentPath.split(location);
			}
			//parentPath = intersection.path;	
			//var location = parentPath.getLocationOf(point);
			//parentPath.split(location);
		});
	}

	this.getPaths = function(compoundPath,point){
		var children = compoundPath.children;
		var paths = [];
		for(var j = 0 ; j < children.length ; j++){
			var child = children[j];
			if(child.getLocationOf(point)){
				paths.push(child);
			}
		}
		return paths;
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
		var sortedResults = results.sort(this.util.compareDistances);
		var minPoint = sortedResults[0].nearestPoint;
		return minPoint;
	}

	this.disable = function(){
		this.continents.forEach(function(continent){
			self.removeEventsHandle(continent);
			continent.shadowColor = null;
		});
		this.startPoint = null;
		this.endPoint = null;
		if(this.pointerReference){
			this.pointerReference.remove();
		}
		this.removeCircles();
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
	}

	this.setContinents = function(continents){
		this.continents = continents;
	}
}
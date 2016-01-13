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

/*Remove Continent from a canvas*/
var RemoveOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.target = null;
	this.continents = null;

	this.configure = function(args){
		console.log("remove a continent!");
		this.target = args.event.target;
		this.removeEventsHandle(this.target);
		this.target.on('click',this.removeContinent);
	}

	this.removeEventsHandle = function(target){
		target.off('mousedrag');
		target.off('mousedown');
		target.off('mouseup');
		target.off('click');
		target.off('mousemove');
		target.off('click');
	}

	this.removeContinent = function(event){
		self.target.remove();
		self.reset();
		for (var i = self.continents.length - 1; i >= 0; i--) {
			if( self.continents[i].data.id == self.target.data.id ){
				self.continents[i].splice(i, 1);			
				break
			}
		};

	}

	this.reset = function(){
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
	}

	this.disable = function(){
		if(this.target){
			this.removeEventsHandle(this.target);
		}
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
	}

	this.setContinents = function(continents){
		this.continents = continents;
	}

}

/*Change Parameters of continent*/
var ParametersOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.currentScale = 0.6;
	this.id = id;
	this.target = null;

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

	this.setContinents = function(continents){

	}
}

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
			self.splitPaths(intersections);
			self.closedPaths(compoundPath,intersections);
			straightLine.remove();
			self.startPoint = null;
			self.endPoint = null;
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

/*Link a territories*/
var LinkTerritoriesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.edges = null
	this.continents = null;
	this.target = null;
	this.graph = {}

	this.configure = function(args){
		console.log("links continents");
		this.target = args.event.target;	
		this.removeEventsHandle(this.target);
		//this.target.shadowColor = null;
		this.target.on('click',self.selectTerritory);
		this.util = new Util();
	}

	this.removeEventsHandle = function(target){
		target.off('mousedrag');
		target.off('mousedown');
		target.off('mouseup');
		target.off('mousemove');
		target.off('click');
	}

	this.getContinent = function(id){
		for(var i = 0 ; i <this.continents.length ; i++){
			if(this.continents[i].data.id == id ){
				return this.continents[i];
			}
		}
		return null;
	}

	this.generateNodeGraph = function(){
		//debe ejecutarse solamente una vez
		this.graph["Nodes"] = []
		var continent;
		var continentID;
		var territories;
		var territoryID;
		for (var i =0 ; i < this.continents.length ; i++){
			continent = this.continents[i]
			continentID = continent.data.id
			territories = continent.children;
			for(var j = 0 ; j < continent.children.length; j++){
				territoryID = continentID + j
				territories[j].data.id = territoryID
				this.graph.Nodes.push({"id": territoryID ,"continent": continentID });
			}
		}
		this.graph["Edges"] = []
		this.generateEdgeGraph();
	}

	this.getNeighbourhood = function(territory,territories){
		var neighbourhood = []
		for(var i = 0 ; i < territories.length ; i++){
			if(territories[i].data.id == territory.data.id){
				continue;
			}
			if(territory.intersects(territories[i])){
				neighbourhood.push(territories[i]);
			}
		}
		return neighbourhood;
	}

	this.generateEdgeGraph = function(){
		var continent,territory , neighbourhood;
		for (var i =0 ; i < this.continents.length ; i++){
			continent = this.continents[i];
			territories = continent.children;
			for(var j = 0 ; j < territories.length; j++){
				territory = territories[j];
				neighbourhood = this.getNeighbourhood(territory,territories);
				for(var k = 0 ; k < neighbourhood.length ; k++){
					this.createEdge(territory.data.id,neighbourhood[k].data.id);
				}
			}
		}
		console.log(this.graph);
	}

	this.getEdges = function(){
		console.log("get edges");
		var svgPath;
		var id;
		var continentsID = ["NorthAmerica","SouthAmerica","Africa","Europe","Oceania"]
		if(this.edges != null){
			return
		}
		this.edges = {}
		for(var i = 0 ; i < continentsID.length  ;i++){
			id = continentsID[i];
			svgPath = "../svg/" +  id + ".svg";
			$.ajax({
				type: "GET",
				async: false,
				url: svgPath,
				dataType: "xml",
				success: function(xml){
					var continentPath = self.paper.project.importSVG(xml.getElementsByTagName("svg")[0]);
					var compoundPath = continentPath.children[0].children[0].children[0];
					compoundPath.data.id = id;
					console.log("compoundPath");
					console.log(compoundPath);
					self.edges[id] = compoundPath;
					continentPath.remove();
				}
			});
		}
		console.log(self.edges);
	}

	this.transformEdge = function(edge,continent){
		var edgeTmp = edge.clone();
		edgeTmp.position = continent.position;
		edgeTmp.scale(continent.data.scale);
		return edgeTmp;
	}

	this.getTerritoryEdge = function(territory,edge){//determine if a path belongs to edge
		//edges object is set of compoundPaths that keeps only the edges of the continents
		var continent = this.getContinent(edge.data.id);// get reference to continent that the user already have configured
		var edgeTmp = this.transformEdge(edge,continent);// change position, rotation and scale of this edge, edgeTemp is type "Path"
		var inter = edgeTmp.getIntersections(territory);
		if(inter.length){//if the current "territory" belongs to edge "length" should not be zero
			return inter;
		}else{
			return null;
		}
	}

	this.isEdge = function(territory,edge){
		if(this.getTerritoryEdge(territory,edge)){
			return true;
		}else{
			return false;
		}
	}

	this.selectTerritory = function(event){
		console.log("select territory");
		var point = event.point;
		var territory = self.getPathCloser(self.target,point); //get territory closer to the poing
		if(!territory){
			return
		}
		territory = territory.clone();
		if(!self.target.data){
			return
		}
		var idContinent = self.target.data.id;
		var continentParent;

		var territoryLink;
		var continentLink;

		if(!territory){
			return;
		}
		continentParent = self.edges[idContinent];
		if(self.isEdge(territory,continentParent)){//determine if the path "territory" belongs to the edge
			var vectorOne = self.getNormalVector(territory,continentParent);
			var result = self.getLinkerTerritories(territory);
			if(!result){
				return;
			}
			territoryLink = result.path.clone();
			continentLink = self.edges[result.continentID];

			var vectorTwo = self.getNormalVector(territoryLink,continentLink);
			var dif = Math.abs(vectorTwo.angle - vectorOne.angle);
			if(dif >0 && dif < 90){
				alert("you cannot link that territory" )
			}else{
				alert("joins territories");
				var from = self.getCentroid(territory);
				var to = self.getCentroid(territoryLink);
				var line = new self.paper.Path.Line(from, to);
				line.strokeColor = 'red';
				line.strokeWidth = 5;
				line.dashArray = [10, 4];
				//generate adjacents from territory to territoryLink and back
				var source = territory.data.id;
				var destiny = territoryLink.data.id;
				self.createEdge(source,destiny);
				self.createEdge(destiny,source);
				
			}
		}else{
			alert("it is not a territory in the edge");
		}
	}

	this.createEdge = function(source,destiny){
		this.graph["Edges"].push({ "U" : source ,"V" : destiny });
	}

	this.getNormalVector = function(territory,parentContinent){
		var intersects = self.getTerritoryEdge(territory,parentContinent);
		var pathIntersect = new paper.Path(intersects);
		var normal, offset , point, vector, sum;
		var centroid = this.getCentroid(pathIntersect);
		point = pathIntersect.getNearestPoint(centroid);
		offset = pathIntersect.getOffsetOf(point);
		if(!offset){
			return;
		}
		normal = pathIntersect.getNormalAt(offset);
		vector = new paper.Point(normal.x*40,normal.y*40);
		sum =  new paper.Point(vector.x + point.x , vector.y + point.y );
		if(territory.parent.contains(sum)){
			normal.x = - normal.x;
			normal.y = - normal.y;
		}
		//this.drawNormalVector(normal,point);//draw vector;
		return normal;
	}

	this.drawNormalVector = function(normal,point){
		var vector = new paper.Point(normal.x*40,normal.y*40);
		var sum =  new paper.Point(vector.x + point.x , vector.y + point.y );
		new paper.Path.Circle({ center: sum , radius: 5, fillColor: 'green' });		
		var line = new paper.Path({
    		segments: [point, sum],
    		strokeColor: 'red'
		});	
	}

	this.getPathCloser = function(compoundPath,point){
		if(!compoundPath.children){
			return null;
		}
		var distance;
		var results = [];
		var path ;
		for(var j = 0 ; j < compoundPath.children.length ; j++){
			path = compoundPath.children[j];
			if(path.contains(point)){
				return path;
			}
		}
		return null;
	}

	
	this.generateColor = function(){
		var red,green,blue;
		var max = 255;
		red = Math.floor(Math.random()*255 + 1);
		green = Math.floor(Math.random()*255 + 1);
		blue = Math.floor(Math.random()*255 + 1);
		return new paper.Color(red/max, green/max, blue/max);
	}

	this.getLinkerTerritories = function(territory){
		//search closer paths to territory
		var centroid = this.getCentroid(territory);
		var continent, path , point, distance;
		var paths = []; 
		for(var i = 0 ; i < this.continents.length ; i++){
			continent = this.continents[i];
			if(this.target.data.id != continent.data.id){
				for(var j = 0 ; j < continent.children.length ; j++){
					var path = continent.children[j];
					if(this.isEdge(path,this.edges[continent.data.id])){//only if the path belongs to edge we will search closer paths
						point = path.getNearestPoint(centroid);//get the nearest point from the centroid to "path"
						distance = this.util.getDistance(centroid,point);//calculate euclidian distances
						paths.push({ path : path , continentID : continent.data.id ,  distance : distance });
					}
				}
			}
		}
		if(paths.length){
			paths.sort(this.util.compareDistances);
			return paths[0];
		}else{
			return null;
		}
	}

	this.getCentroid = function(territory){
		var segments = territory.segments;
		var sum_x = 0 , sum_y = 0 ,size;
		
		size = segments.length;

		if(!segments){
			return null;
		}

		for(var i = 0 ; i < size ; i++){
			sum_x += segments[i].point.x;
			sum_y += segments[i].point.y;
		}
		return new paper.Point( Math.floor(sum_x/size) , Math.floor(sum_y/size));
	}

	this.disable = function(){
		$("#"+this.id).css("background-color","rgba(0,0,96, 1)");
		if(this.target){
			this.removeEventsHandle(this.target);
		}
	}

	this.setContinents = function(continents){
		this.continents = continents;
		this.generateNodeGraph();
	}

}




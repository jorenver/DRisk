/*Link a territories*/
var LinkTerritoriesOption = function(paper,id){
	var self = this;
	this.paper = paper;
	this.id = id;
	this.edges = null
	this.continents = null;
	this.target = null;
	this.notificationOn = false;
	this.graph = {};

	this.configure = function(args){
		console.log("links continents");
		this.target = args.event.target;	
		this.removeEventsHandle(this.target);
		//this.target.shadowColor = null;
		this.target.on('click',self.selectTerritory);
		buttonAccept.addEventListener('click',this.generateSVG,false);
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

	this.generateNodeGraph = function(continents){
		this.graph["Nodes"] = []
		var continent, continentID;
		var territories, territoryID;
		for (var i =0 ; i < continents.length ; i++){
			continent = continents[i]
			continentID = continent.data.id;
			territories = continent.children;
			for(var j = 0 ; j < territories.length; j++){
				territoryID = continentID + j
				territories[j].data.id = territoryID
				this.graph.Nodes.push({"id": territoryID ,"continent": continentID });
			}
		}
		this.generateEdgeGraph(continents);
	}

	this.generateEdgeGraph = function(continents){
		this.graph["Edges"] = []
		var continent,territory , neighbourhood;
		for (var i =0 ; i < continents.length ; i++){
			continent = continents[i];
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

	this.getEdges = function(){
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
					self.edges[id] = compoundPath;
					continentPath.remove();
				}
			});
		}
	}

	this.transformLimit = function(edge,continent){
		var edgeTmp = edge.clone();
		edgeTmp.position = continent.position;
		edgeTmp.scale(continent.data.scale);
		return edgeTmp;
	}

	this.getTerritoryEdge = function(territory,edge){//determine if a path belongs to edge
		//edges object is set of compoundPaths that keeps only the edges of the continents
		var continent = this.getContinent(edge.data.id);// get reference to continent that the user already have configured
		var edgeTmp = this.transformLimit(edge,continent);// change position, rotation and scale of this edge, edgeTemp is type "Path"
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
				self.updateContinents(source,destiny);
			}
		}else{
			alert("it is not a territory in the edge");
		}
	}

	this.updateContinents = function(idSource,idDestiny){
		var continentSource = this.getContinent(idSource);
		var continentDestiny = this.getContinent(idDestiny);
		if(continentSource && continentDestiny){
			continentSource.selected = true;
			continentDestiny.selected = true;
		}
	}

	this.createEdge = function(source,destiny){
		this.graph["Edges"].push({ "U" : source ,"V" : destiny });
	}

	/*
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
	}*/

	this.getNormalVector = function(territory,parentContinent){
		var intersects = self.getTerritoryEdge(territory,parentContinent);
		var pathIntersect = new paper.Path(intersects);
		var normal, offset , point, vector, sum;
		var centroid ;
		normal = this.getMeanVector(pathIntersect)
		centroid = this.getCentroid(pathIntersect);
		point = pathIntersect.getNearestPoint(centroid);
		vector = new paper.Point(normal.x*40,normal.y*40);
		sum =  new paper.Point(vector.x + point.x , vector.y + point.y );
		if(territory.parent.contains(sum)){
			normal.x = - normal.x;
			normal.y = - normal.y;
		}
		//this.drawNormalVector(normal,point);//draw vector;
		return normal;
	}

	this.getMeanVector = function(edges){
		var segments = edges.segments;
		var sum_x = 0 ,sum_y = 0;
		var normal;
		for(var i=0 ; i < segments.length; i++){
			offset = edges.getOffsetOf(segments[i].point);
			normal = edges.getNormalAt(offset);
			sum_x += normal.x;
			sum_y += normal.y;
		}
		return new this.paper.Point(sum_x/segments.length,sum_y/segments.length);
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
	}

	this.generateSVG = function(){
		console.log("generar svg");
		var canvas = document.getElementById("resultadoMap");
		var project = new self.paper.Project(canvas);		
		self.continents.forEach(function(continent){
			var territories = continent.children;
			territories.forEach(function(territory){
				var territory = territory.clone();
				territory.fillColor = self.util.generateGrayColor();
				var territoryGroup = new self.paper.Group();
				territoryGroup.id = territory.data.id;
				territoryGroup.addChild(territory);
				territoryGroup.remove();
				project.activeLayer.addChild(territoryGroup);
			});
		});		
		var graph = self.graph;
		var svgObject = project.exportSVG();//convert group paper in node html
		svgObject = formatToSVG(svgObject);//change hierarchy of the node
		var serializer = new XMLSerializer();
		var svgString = serializer.serializeToString(svgObject);
		sendMapData(svgString,graph);
	}

	var formatToSVG = function(svgObject){
		//change svgObject to specified format to send to the server
		var groupNode, territoryNode;
		var data,dataJson;
		var layer = svgObject.children[0];//
		var territoriesNode = layer.children;
		var svgParent = svgObject.cloneNode();
		for(var i = 0 ; i < territoriesNode.length ; i++){
			groupNode = territoriesNode[i];
			territoryNode = groupNode.children[0];
			data = JSON.parse(territoryNode.getAttribute('data-paper-data'));
			groupNode.setAttribute("id",data.id);
			svgParent.appendChild(groupNode.cloneNode(true));
		}
		return svgParent;
	}


	var sendMapData = function(svgString,graph){
		$.ajax({
	        type: 'POST',
	        url: '/saveSVG',
	        data: { svg : svgString , graph : graph },
	        dataType: 'json',
	        success: function(dat)
	        {
	            console.log("done")
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	console.log(errorThrown);
	        }
	    }).done(function(dat) {
	    	alert("Your map has been created!")
	       	goToPlay(dat.fileName);
	    });
	}

	var goToPlay = function(fileName){
		var form = document.createElement("form");
		form.setAttribute('method',"post");
		form.setAttribute('action',"/setMap");
		var input = document.createElement("input"); //input element, Submit button
		input.setAttribute('name','mapChosen');
		input.setAttribute('value',fileName);
		form.appendChild(input);
		form.submit();
	}

}




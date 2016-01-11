

var ConfigurationTool = function(paper){	
	var self = this;
	this.paper = paper;
	this.optionsID = ["optDragAndDrop","optRemove","optDivide","optRedraw","optLink","optParameters"]
	this.options = {};
	this.currentOption = null
	this.continents = [];

	this.init = function(){
		this.options[this.optionsID[0]] = new DragAndDropOption(this.paper,this.optionsID[0]);
		this.options[this.optionsID[1]] = new RemoveOption(this.paper,this.optionsID[1]);
		this.options[this.optionsID[2]] = new DivideTerritoriesOption(this.paper,this.optionsID[2]);
		this.options[this.optionsID[3]] = new RedrawEdgesOption(this.paper,this.optionsID[3]);
		this.options[this.optionsID[4]] = new LinkTerritoriesOption(this.paper,this.optionsID[4]);
		this.options[this.optionsID[5]] = new ParametersOption(this.paper,this.optionsID[5]);
		this.registerEvents();
		this.util = new Util();
	}

	this.registerEvents = function(){
		for(var i = 0 ; i <this.optionsID.length ; i++){
			var element = document.getElementById(this.optionsID[i]);
			if(element){
				element.addEventListener('click',function(event){
					if(self.currentOption){
						self.currentOption.disable();
					}
					var option = self.options[event.target.id];
					if(option){
						self.setOption(option);
						self.resetEventsHandle();
						$("#"+event.target.id).css('background-color','rgba(200,0,0,1)');
					}	
				}, false);
			}
		}
	}

	this.resetEventsHandle = function(){
		var cont;
		for (var i = 0; i < configurationWorker.mapsContinents.length; i++) {
			cont = configurationWorker.mapsContinents[i]
			configurationWorker.registerEventContinent(cont);
		};
	}

	this.setOption = function(option){
		this.currentOption = option;
	}

	this.setContinents = function(continents){
		this.continents = continents;
		this.currentOption.setContinents(continents);
	}

	this.doConfiguration = function(args){
		this.currentOption.configure(args);
	}

	this.generateColor = function(){
		var red,green,blue;
		var max = 255;
		red = Math.floor(Math.random()*255 + 1);
		green = Math.floor(Math.random()*255 + 1);
		blue = Math.floor(Math.random()*255 + 1);
		return new paper.Color(red/max, green/max, blue/max);
	}

	this.generateSVG = function(){
		console.log("generar svg");
		var canvas = document.getElementById("resultadoMap");
		var project = new self.paper.Project(canvas);
		var continentsGroup = new self.paper.Group();
		self.continents.forEach(function(continent){
			var territories = continent.children;
			var territoriesGroup = new self.paper.Group();
			territories.forEach(function(territory){
				var path = territory.clone();
				path.fillColor = self.util.generateColor();
				territoriesGroup.addChild(path);
			});
			continentsGroup.addChild(territoriesGroup);
		});
		console.log(continentsGroup);
		continentsGroup.remove()
		project.activeLayer.addChild(continentsGroup);
		var fileName = "mapContinents.svg";
		var svgString = project.exportSVG({asString:true});
		$.ajax({
	        type: 'POST',
	        url: '/saveSVG',
	        data: { svg : svgString },
	        dataType: 'application/json',
	        success: function(){
	            console.log("done")
	        }
	    }).done(function(dat) {
	        console.log(dat);
	    })
	}
}




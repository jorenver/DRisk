

var ConfigurationTool = function(paper){	
	var self = this;
	this.paper = paper;
	this.optionsID = ["optDragAndDrop","optRemove","optDivide","optRedraw","optParameters","optLink"]
	this.options = {};
	this.currentOption = null
	this.continents = [];

	this.init = function(){
		this.options[this.optionsID[0]] = new DragAndDropOption(this.paper,this.optionsID[0]);
		this.options[this.optionsID[1]] = new RemoveOption(this.paper,this.optionsID[1]);
		this.options[this.optionsID[2]] = new DivideTerritoriesOption(this.paper,this.optionsID[2]);
		this.options[this.optionsID[3]] = new RedrawEdgesOption(this.paper,this.optionsID[3]);
		this.options[this.optionsID[4]] = new ParametersOption(this.paper,this.optionsID[4]);
		this.options[this.optionsID[5]] = new LinkTerritoriesOption(this.paper,this.optionsID[5]);
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
						self.generateNotificaction();
						$("#"+event.target.id).css('background-color','rgba(200,0,0,1)');
					}	
				}, false);
			}
		}
	}

	this.generateNotificaction = function(){
		if(this.currentOption.notificationOn){
			return;
		}
		var title = $("#" + this.currentOption.id).attr('title');
		var notification = new Notification(title,null);
		notification.launch();
		this.currentOption.notificationOn = true;
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
		if(this.currentOption.id == "optLink"){
			this.currentOption.getEdges();
			this.currentOption.generateNodeGraph(configurationWorker.mapsContinents);
		}
	}

	this.setContinents = function(continents){
		this.continents = continents;
		this.currentOption.setContinents(continents);
	}

	this.doConfiguration = function(args){
		if(this.currentOption)
			this.currentOption.configure(args);
	}
}




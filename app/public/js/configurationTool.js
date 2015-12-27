

var ConfigurationTool = function(paper){	
	var self = this;
	this.paper = paper;
	this.optionsID = ["optDragAndDrop","optRemove","optDivide","optLinks","optParameters"]
	this.options = {};
	this.currentOption = null
	this.target = null;

	this.init = function(){
		this.options[this.optionsID[0]] = new DragAndDropOption(this.paper,this.optionsID[0]);
		this.options[this.optionsID[1]] = new RemoveOption(this.paper,this.optionsID[1]);
		this.options[this.optionsID[4]] = new ParametersOption(this.paper,this.optionsID[4]);
		
		this.registerEvents();
	}

	this.registerEvents = function(){
		for(var i = 0 ; i <this.optionsID.length ; i++){
			var element = document.getElementById(this.optionsID[i]);
			if(element){
				element.addEventListener('click',function(event){
					if(self.currentOption){
						$("#"+self.currentOption.id).css("background-color","rgba(226,228,230, 0.3)");
					}
					var option = self.options[event.target.id];
					if(option){
						self.setOption(option);
						$("#"+event.target.id).css('background-color','rgba(0,0,96,1)');
					}	
				}, false);
			}
		}
	}

	this.setOption = function(option){
		this.currentOption = option;
	}

	this.doConfiguration = function(args){
		this.currentOption.configure(args);
	}
	
	this.setTarget = function(path){
		this.target = path;
	}

}



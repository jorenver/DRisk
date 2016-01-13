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

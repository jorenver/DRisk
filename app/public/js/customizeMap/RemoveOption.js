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
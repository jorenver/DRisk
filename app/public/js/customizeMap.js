

function outputUpdate(vol) {
	document.querySelector('#outSize').value = vol*100 + "%";
}

function degresUpdate(degree){
	document.querySelector('#outDegrees').value = degree + "°";
}

function closeParameters(event){
	$("#drawerMapConfiguration").css('display','none');
}

function changeParameters(event){	
	var size = parseFloat($("#sizeInput").val());
	var color = $("#colorInput").val();
	var degrees = parseInt($("#rotationInput").val());
	
	var changeEvent = new CustomEvent('changeParameter', { 
		'detail' : {
			size : size, 
			color : color,
			degrees : degrees
		}
	});
	var canvas = document.getElementById("drawerMap");
	canvas.dispatchEvent(changeEvent);
	closeParameters(null);
}


function initialize () {
	var configurationWorker = new ConfigurationWorker();
	configurationWorker.init();
	configurationWorker.registerEvents();
}



window.addEventListener('load',initialize,false);
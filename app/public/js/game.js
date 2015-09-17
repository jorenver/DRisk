function createMap(route){
	map= new Object();
	map.data=route;
	map.type="image/svg+xml"
	$("#containerMap").append(map);
}


function iniciar(){
	createMap('../svg/world.svg');
}

window.addEventListener('load', iniciar, false);
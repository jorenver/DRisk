/*
	Description:
	Se definio un array un de Imagenes donde cada indice guarda la imagen correspondiente

	Syntax:
	[element0, element1, ..., elementN]
	new Array()
	new Array(4)
*/

var ArrayImagenes = new Array();
ArrayImagenes[0]='/svg/maps/World.svg';
ArrayImagenes[1]='/svg/maps/EcuadorGermany.svg';
ArrayImagenes[2]='/svg/maps/OrientedCountry.svg';
//ArrayImagenes[3]='/svg/preload maps/';
//SArrayImagenes[4]='/svg/preload maps/';
/*
 	Description:
 	Esta funcion se conecta con el combobox y lo que hace es que a medida
 	que seleccionas una opcion del combobox se cambia una imagen
 	Syntax:
 	function(which)
*/

function changeContent(which){
 	listaImagenes.src =ArrayImagenes[document.getElementById('mapChosen').options.selectedIndex];
}

function previousPage(event){
	console.log("aqui!");
	//window.location.href = "/createMatch";
}

function customizeMap(event){
	window.location.href = "/customizeMap";
}
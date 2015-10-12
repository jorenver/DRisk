/*
	Description:
	Se definio un array un de Imagenes donde cada indice guarda la imagen correspondiente

	Syntax:
	[element0, element1, ..., elementN]
	new Array()
	new Array(4)
*/

var ArrayImagenes = new Array();
ArrayImagenes[0]='/img/ecuador.png';
ArrayImagenes[1]='/img/brazil.png';
ArrayImagenes[2]='/img/estadosUnidos.png';
ArrayImagenes[3]='/img/mundo.png';
ArrayImagenes[4]='/img/china.png';
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
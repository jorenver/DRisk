/*
	Description:
	Se definio un array un de Imagenes donde cada indice guarda la imagen correspondiente

	Syntax:
	[element0, element1, ..., elementN]
	new Array()
	new Array(4)
*/

var ArrayImagenes = new Array();
ArrayImagenes[0]='../public/img/africa.png';
ArrayImagenes[1]='../public/img/Mapa1.gif';
ArrayImagenes[2]='../public/img/mapamundi.jpg';
ArrayImagenes[3]='../public/img/Mapa2.jpg';

 /*
 	Description:
 	Esta funcion se conecta con el combobox y lo que hace es que a medida
 	que seleccionas una opcion del combobox se cambia una imagen
 	Syntax:
 	function(which)
 */
 function changeContent(which){
 	listaImagenes.src =ArrayImagenes[document.getElementById('OpcionesMapa').options.selectedIndex];
 
 }
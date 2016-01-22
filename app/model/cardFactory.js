
exports.createCards =  function(graph) {
	var territories = graph.nodes();
	var cards = [];
	for (var i =0; i< territories.length; i ++){
		
		//soldierType:  0 = infantry, 1 = cavalry, 2 = artillery
		var card = {
			idTerritory: territories[i],
			soldierType: i%3
		}
		cards.push(card);
	}
	suffle(cards)
	return cards;

}

function suffle(input){
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
}
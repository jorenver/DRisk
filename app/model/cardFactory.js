
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
	return cards;

}
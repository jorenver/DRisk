

var graphicsCard = function(){

	this.paperScopeCard;

	this.initializeScope = function(){
		
		var canvas = document.getElementById('receiveCardCanvas');
          
		var paperScopeCard = new paper.PaperScope();
		paperScopeCard.setup(canvas);
		this.paperScopeCard = paperScopeCard;



	}

	this.drawCard = function(card, territoryPath){

		var paperScopeCard = this.paperScopeCard;
		var group = new paperScopeCard.Group();

		//draw a rectangle to form the card
        var x = paperScopeCard.view.size.width/2;
        var y = paperScopeCard.view.size.height/2;


		var rect = new paperScopeCard.Rectangle(0, 0, 150, 175);
        var pathRect = new paperScopeCard.Path.Rectangle(rect);
        pathRect.fillColor = '#e9e9ff';
        pathRect.strokeColor = 'blue';
        pathRect.strokeWidth = 4;
        pathRect.shadowColor = new paperScopeCard.Color(0, 0, 0);
        pathRect.shadowBlur = 8;
        pathRect.shadowOffset = new paperScopeCard.Point(5, 5);
        pathRect.position.x = x;
        pathRect.position.y = y;

        //group.addChildren(pathRect);

        //create the territory path
        var territory = territoryPath.scale(0.9);
        territory.position.x = pathRect.position.x;
        territory.position.y = pathRect.position.y - 20;
        territory.fillColor = "#2A1B0A";

        paperScopeCard.project.activeLayer.addChild(territory);

        //group.addChildren(territoryPath);

        //create the soldier
        var url;
        if(card.soldierType == 0){
        	
        	url = '../svg/soldier-01.svg';
        	

        }
        else if(card.soldierType == 1){
        	url = '../svg/cavalry.svg';

        }
        else{
        	url = '../svg/artillery.svg';
        	
        }


        paperScopeCard.project.importSVG(url,function(soldier){
                
        	var soldierPath  = soldier;
        	soldierPath.position.x = pathRect.position.x;
    		soldierPath.position.y = pathRect.position.y + 40;


    		var text = new paperScopeCard.PointText(pathRect.position.x, pathRect.position.y - 60);
                
	        text.content = card.idTerritory;
	        text.characterStyle = {
	            fontSize:16,
	            fillColor:"black",//new RgbColor(119,119,119);
	            font:"Arial"
	        };
	        text.justification = 'center'
	
			//draw all        	
        	paperScopeCard.view.draw();
    	});



	}

	this.cleanScope = function(){
		this.paperScopeCard.project.activeLayer.removeChildren();
	}



}


//object to graphic the changes card popup

var graphicsChangeCards = function(){


    this.paperScopeChangeCard;
    this.widthCard;
    this.heigthCard;
    selectedCards = [];

    this.initializeScope = function(){
        
        var canvas = document.getElementById('changeCardsCanvas');
          
        var paperScopeChangeCard = new paper.PaperScope();
        paperScopeChangeCard.setup(canvas);
        this.paperScopeChangeCard = paperScopeChangeCard;
        this.widthCard = 112;
        this.heigthCard = 153;

    }

    this.drawCard = function(x, y, card, territoryPath){

        var paperScopeChangeCard = this.paperScopeChangeCard;
        
        var listItem = [];

        //draw a rectangle to form the card
        console.log("dibujo esta carta", card);

        var rect = new paperScopeChangeCard.Rectangle(x, y, this.widthCard, this.heigthCard);
        var pathRect = new paperScopeChangeCard.Path.Rectangle(rect);
        pathRect.name = "rect";
        pathRect.fillColor = '#e9e9ff';
        pathRect.strokeColor = 'blue';
        pathRect.strokeWidth = 5;
        pathRect.shadowColor = new paperScopeChangeCard.Color(0, 0, 0);
        pathRect.shadowBlur = 4;
        pathRect.shadowOffset = new paperScopeChangeCard.Point(5, 5);
        listItem.push(pathRect);

        //create the territory path

        var territory = territoryPath.scale(0.35);
        territory.position.x = pathRect.position.x;
        territory.position.y = pathRect.position.y - 15;
        territory.fillColor = "#2A1B0A";
        listItem.push(territory);
        paperScopeChangeCard.project.activeLayer.addChild(territory);

        

        //create the soldier
        var url;
        if(card.soldierType == 0){
            
            url = '../svg/soldier-01.svg';
            

        }
        else if(card.soldierType == 1){
            url = '../svg/cavalry.svg';

        }
        else{
            url = '../svg/artillery.svg';
            
        }


        paperScopeChangeCard.project.importSVG(url,function(soldier){
                
            var soldierPath  = soldier;
            soldierPath.position.x = pathRect.position.x;
            soldierPath.position.y = pathRect.position.y + 40;

            listItem.push(soldierPath);

            var text = new paperScopeChangeCard.PointText(pathRect.position.x, pathRect.position.y - 54);
                
            text.content = card.idTerritory;
            text.characterStyle = {
                fontSize:10,
                fillColor:"black",//new RgbColor(119,119,119);
                font:"Arial"
            };
            text.justification = 'center'
            listItem.push(text);

            var group = new paperScopeChangeCard.Group(listItem);
            

            group.data.card = card;
            group.data.clicked = 0;

            group.onClick = function(event) {
                console.log(this.data.card);

                var rect = this.getItem({name: "rect"});

                if(this.data.clicked == 0){
                    
                    if(selectedCards.length >= 3){
                        return;
                    }

                    rect.fillColor = '#e67e17';
                    this.data.clicked = 1;
                    selectedCards.push(this.data.card);

                    if(selectedCards.length >=3){
                        bt_traceCard.disabled = false;
                    }

                }
                else {
                    rect.fillColor = '#e9e9ff';
                    this.data.clicked = 0;
                    removeSelectedCard(this.data.card);


                    if(selectedCards.length < 3){
                        bt_traceCard.disabled = true;
                    }


                }
            }

            paperScopeChangeCard.view.draw();



        });


    }
    //remove card form the list of selected cards
    function removeSelectedCard(card){
        var listTemp = [];
        for(var i =0; i < selectedCards.length; i++){
            var currentCard = selectedCards[i];
            if(currentCard.idTerritory != card.idTerritory){
                listTemp.push(currentCard);
            }

        }
        selectedCards = listTemp;

    }

    this.cleanScope = function(){
        this.paperScopeChangeCard.project.activeLayer.removeChildren();

    }

    this.getSelectedCards = function(){
        return selectedCards;
    }



}



var graphicsBattle= function(){

    this.paperScopeBattle;

    this.initializeScope = function(){
        
        var canvas = document.getElementById('content_battle_canvas');
          
        var paperScopeBattle = new paper.PaperScope();
        paperScopeBattle.setup(canvas);
        this.paperScopeBattle = paperScopeBattle;



    }

    this.drawBattle = function(args){

        var paperScopeBattle = this.paperScopeBattle;
        var group = new paperScopeBattle.Group();
        var nodeTerritory1 = graph.node(args.idTerritory1);
        var nodeTerritory2 = graph.node(args.idTerritory2);

        var text = new paperScopeBattle.PointText(new paperScopeBattle.Point(200, 30));
        text.fillColor = 'black';
        text.fontSize=30;
        text.content = 'Battle ';

        var textAttaker = new paperScopeBattle.PointText(new paperScopeBattle.Point(70, 50));
        textAttaker.fillColor = 'black';
        textAttaker.content = nodeTerritory1.owner;

        var textAttakerTerritory = new paperScopeBattle.PointText(new paperScopeBattle.Point(70, 70));
        textAttakerTerritory.fillColor = 'black';
        textAttakerTerritory.content ="Territory: "+ args.idTerritory1;

        var territoryPath1 = searchTerritory(mapGroup.children,args.idTerritory1);
        var territory1 = territoryPath1.clone();
        territory1.remove();
        territory1.scale(1);
        territory1.position.x = 90;
        territory1.position.y = 150;
        paperScopeBattle.project.activeLayer.addChild(territory1);

        var textAttaker = new paperScopeBattle.PointText(new paperScopeBattle.Point(310, 50));
        textAttaker.fillColor = 'black';
        textAttaker.content = nodeTerritory2.owner;

        var textDefenderTerritory = new paperScopeBattle.PointText(new paperScopeBattle.Point(310, 70));
        textDefenderTerritory.fillColor = 'black';
        textDefenderTerritory.content = "Territory: "+args.idTerritory2;
        
        var territoryPath2 = searchTerritory(mapGroup.children,args.idTerritory2);
        //var lastPlayer2 = searchPlayer(match.listPlayer,nodeTerritory2.owner);
        var territory2 = territoryPath2.clone();
        territory2.remove();
        territory2.scale(1);
        //territory2.fillColor=lastPlayer2.color.code;
        territory2.position.x = 330;
        territory2.position.y = 150;
        paperScopeBattle.project.activeLayer.addChild(territory2);
        
        for (var i = 0; i < args.dice1.length; i++) {
            dice=dicesPaths[args.dice1[i]-1].clone();
            dice.remove();
            dice.scale(0.5);
            dice.position.x = 50*(i+1);
            dice.position.y = 250;
            paperScopeBattle.project.activeLayer.addChild(dice);

        };

        for (var i = 0; i < args.dice2.length; i++) {
            dice=dicesPaths[args.dice2[i]-1].clone();
            dice.remove();
            dice.scale(0.5);
            dice.position.x = 330+50*(i+1);
            dice.position.y = 250;
            paperScopeBattle.project.activeLayer.addChild(dice);

        };
        
        paperScopeBattle.view.draw();


    }

    this.cleanScope = function(){
        this.paperScopeBattle.project.activeLayer.removeChildren();
    }



}



function minimo(a,b){
    if(a<b)
        return a;
    return b;
}
function searchPlayer(list,nick){
    for(i in list) {
        if(list[i].nick==nick)
            return list[i];
    }
    return null;
}

function getNumDices(list,num){
    var newList=[];
    while(num>0){
        var index=0;
        var max=list[index];
        for (var i = 0; i < list.length; i++) {
            if (list[i]>max) {
                max=list[i];
                index=i;
            }
        }
        newList.push(list[index]);
        //console.log('lista '+list);
        //console.log('nueva lista '+newList)
        //console.log('num '+num)
        delete list[index];
        num--;
    }
    return newList;
}


function generateDices(n){
    var list=[];
    for (var i =0 ; i<n ; i++) {
        var aleatorio = Math.round(Math.random()*5)+1;
        list.push(aleatorio);
    }
    return list;
}


function calculateSoldiersByCards(timesCardTrace){
    var soldiers = 0;

    if(timesCardTrace>=1 && timesCardTrace<=5 ){
        // 1 time --> 4 soldiers
        // 2 time --> 6 soldiers
        // 3 time --> 8 soldiers
        // 4 time --> 10 soldiers
        // 5 time --> 12 soldiers
        soldiers = 2*timesCardTrace + 2; 
    }
    else if( timesCardTrace == 6){
        soldiers = 15;
    }
    else{
        // 5 mores in every trace
        soldiers = 15 + 5*(timesCardTrace - 6);
    }
    return soldiers;
}

function calculateExtraSoldiersCards(nick, graph, cardsTraced){
    //calculate extra soldiers
    //if a territory of a card is equal to an territory of a player
    //add 2 territorys 
    for (var i =0; i< cardsTraced.length; i++){
        var idTerritoryCard = cardsTraced[i].idTerritory;
        var band = graph.hasNode(idTerritoryCard);
        if(band){
            var Territory = graph.node(idTerritoryCard);
            if(Territory.owner == nick){
                return 2; //extra soldier
            }
        }

    }
    return 0; //no extra soldier
}

var selectTerritory = function(){
    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Select";

    this.initStage= function(match){
        console.log('init Select')
    }

    this.isChangeTurn= function(){
        return true;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Select******");
        var nick = args.nick;
        var idTerritory = args.idTerritory;
        //console.log(nick, idTerritory);
        var graphPtr = match.map.graph;
        var player;
        graphPtr.node(idTerritory).owner = nick;
        graphPtr.node(idTerritory).numSoldier += 1;
        player= searchPlayer(match.listPlayer,nick);
        //console.log(player)
        player.numSoldier-=1;
        //console.log(player);
    }

    this.nextStage = function(){
        return new reforceTerritory();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Select');
        var data = {
            nick: args.nick, 
            idTerritory: args.idTerritory,
            nickTurn: playerTurn.nick, 
            stage: stage
        };
        return data;
    }

    this.validateChangeStage=function(match, args){
        var cont=0;
        console.log('$$$$$$$$$$consultar cambio Select$$$$$$$$$$$$');
        listPlayer=match.listPlayer;
        for(i in listPlayer){
            if(listPlayer[i].numSoldier==0)
                cont+=1;
        }
        console.log(cont);
        if(cont==listPlayer.length)
            nextState="Reforce";
        else
            nextState="Select";

        return nextState;
    }

}

function calculateNumReforces(match){
    /*
        number territorys -- numSoldiers
        1  a 11 -- 3
        12 a 14 -- 4
        15 a 17 -- 5
        18 a 20 -- 6
        21 a 23 -- 7
        24 a 26 -- 8
        27 a 29 -- 9
        30 a 32 -- 10
        33 a 35 -- 11
        36 a 38 -- 12
        37 a 39 -- 13
        *Africa -- 3
        oceania -- 2
        *Asia --   7
        *Europa -- 5
        *America Norte -- 5
        *America del Sur -- 2
    */
    var graphPtr = match.map.graph;
    var Af=3,Oc=2,As=7,Eu=5,An=5,Ams=2;
    idTerritorys=graphPtr.nodes();
    var cont=0;
    for (var i = 0; i < idTerritorys.length; i++) {
        idTerritory=idTerritorys[i];
        if(graphPtr.node(idTerritory).owner==match.turn){
            cont++;
        }else{
            if(graphPtr.node(idTerritory).continent=="NorthAmerica")
                An=0;
            if(graphPtr.node(idTerritory).continent=="SouthAmerica")
                Ams=0;
            if(graphPtr.node(idTerritory).continent=="Africa")
                Af=0;
            if(graphPtr.node(idTerritory).continent=="Europe")
                Eu=0;
            if(graphPtr.node(idTerritory).continent=="Asia")
                As=0;
            if(graphPtr.node(idTerritory).continent=="Oceania")
                Oc=0;
        }

    }
    var num;
    if(cont <=11){
        num=3;
    }else{
        cont=cont-12;
        num=((cont-(cont%3))/3)+4;
    }
    num=num+An+Ams+Af+Eu+As+Oc;
    return num;
}

var reforceTerritory = function(){
    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Reforce";
    
    this.initStage= function(match){
        console.log('init Reforce');
        var listPlayer=match.listPlayer;
        player= searchPlayer(listPlayer,match.turn);
        //calcular el numero de soldados

        player.numSoldier+=calculateNumReforces(match);
    }

    this.isChangeTurn= function(){

        return false;
    
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Reforce******");
        console.log(args);
        var nick = args.nick;
        var idTerritory = args.idTerritory;
        console.log(nick, idTerritory);
        var graphPtr = match.map.graph;

        graphPtr.node(idTerritory).owner = nick;
        graphPtr.node(idTerritory).numSoldier += 1;
        player= searchPlayer(match.listPlayer,nick);
        //console.log(player)
        player.numSoldier-=1;
        //console.log(player);
    }

    this.nextStage = function(){
        //return the next stage
        return new atackTerritory();

    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Reforce');
        var data = {
            nick: args.nick, 
            idTerritory: args.idTerritory,
            nickTurn: playerTurn.nick, 
            stage: stage
        };
        return data;
    }

    this.validateChangeStage=function(match, args){ 
        var listPlayer=match.listPlayer;
        player= searchPlayer(listPlayer,match.turn);
        //console.log('77777777777777 validando cambio '+player.numSoldier)
        if(player.numSoldier==0)
            return "Atack";
        else
            return "Reforce";
    }

}

var atackTerritory = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Atack";
    this.atacker=0;
    this.defender=0;
    this.listDiceDefender=null;
    this.listDiceAttacker=null;
    this.change=false;

    this.initStage= function(match){
        console.log('init Atack');
        auxPlayer=searchPlayer(match.listPlayer,match.turn);
        auxPlayer.lastTerritorysConquers=0;
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //update the graph
        if(args.idTerritory1==null && args.idTerritory2==null){
            this.change=true;
            return;
        }
        console.log("********actualizando grafo Atack******");
        //calculate dice
        //attacker: 2 soldiers 1 dice, 3 soldiers 2 dice, 4 o more soldier 3 dice
        //defender: 1 soldier 1 dice, 2 o more soldiers 2 dice

        var listDiceAttacker=[],listDiceDefender=[],numDefender, numAttacker;
        var graph,nickAttacker,nickDefender,numSoldierA,numSoldierD,territoryA,territoryD,nDeadA,nDedD;
        graph=match.map.graph;
        territoryA=graph.node(args.idTerritory1);
        territoryD=graph.node(args.idTerritory2);
        nickAttacker=territoryA.owner;
        nickDefender=territoryD.owner;
        numSoldierA=territoryA.numSoldier;
        numSoldierD=territoryD.numSoldier;
        debugger;
        if(numSoldierA>=4){
            numAttacker=3;

        }
        else{
            numAttacker=numSoldierA-1;
        }
        //console.log("########## numero Dados Atacante" + numAttacker);
        if(numSoldierD>=2){
            numDefender=2;
        }
        else{
            numDefender=1;
        }
        //console.log("########## numero Dados Defensor" + numDefender);
        //round
        listDiceDefender=generateDices(numDefender);
        this.listDiceDefender=listDiceDefender.slice();//copy
        listDiceDefender.sort();
        listDiceDefender.reverse();

        listDiceAttacker=generateDices(numAttacker);
        this.listDiceAttacker=listDiceAttacker.slice();//copy
        listDiceAttacker.sort();
        listDiceAttacker.reverse();

        this.atacker=0;
        this.defender=0;
        //console.log("########## Dados Atacante "+listDiceAttacker);
        //console.log("########## Dados Defensor "+listDiceDefender);

        while (listDiceAttacker.length!=0 && listDiceDefender.length!=0){
            //console.log("########## while");
            diceAttacker=listDiceAttacker.shift();
            diceDefender=listDiceDefender.shift();;
            if(diceAttacker>diceDefender){
                //console.log('gana atacante');
                //console.log('Defensor: '+territoryD.numSoldier);
                territoryD.numSoldier=territoryD.numSoldier-1;
                //console.log('Defensor: '+territoryD.numSoldier);
                this.defender+=1;
                if(territoryD.numSoldier==0){
                    territoryD.owner=territoryA.owner;
                    territoryD.numSoldier=territoryA.numSoldier-1;
                    territoryA.numSoldier=1;
                    auxPlayer=searchPlayer(match.listPlayer,territoryA.owner);
                    auxPlayer.lastTerritorysConquers+=1;
                }
            }else{
                //console.log('gana defensor');
                //console.log('Atacante: '+territoryA.numSoldier);
                territoryA.numSoldier=territoryA.numSoldier-1;
                this.atacker+=1;
                //console.log('Atacante: '+territoryA.numSoldier);
            }  

        }
    }

    this.nextStage = function(){
        //return the next stage
        return new move();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Atack');
        var data = { 
            idTerritory1: args.idTerritory1,
            idTerritory2: args.idTerritory2,
            nickTurn: playerTurn.nick,
            dice1:this.listDiceAttacker,
            dice2:this.listDiceDefender,
            numAttacker:this.atacker,
            numDefender:this.defender,
            stage: stage,
            winner: null,
            losers:null
        };
        return data;
        
    }

    this.validateChangeStage=function(match, args){
        if(this.change)
            return "Move";
        var graphPtr = match.map.graph;

        return "Atack";
    }

}

var move = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "Move";
    this.initStage= function(match){
        console.log('init Move');
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //update the graph
        console.log("********actualizando grafo Move******");
        var nick = args.nick;
        var idTerritory1 = args.idTerritory1;
         var idTerritory2 = args.idTerritory2;
         if(idTerritory1!=null && idTerritory2!=null){
            var graphPtr = match.map.graph;
            graphPtr.node(idTerritory1).numSoldier -= args.num;
            graphPtr.node(idTerritory2).numSoldier += args.num;
        }
    }

    this.nextStage = function(){
        //return the next stage
        return new sendCard();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Move');
        var data = { 
            idTerritory1: args.idTerritory1,
            idTerritory2: args.idTerritory2,
            nickTurn: playerTurn.nick,
            num:args.num,
            stage: stage
        };
        return data;
        
    }

    this.validateChangeStage=function(match, args){
      return "receiveCard";
    }

}


function getRestOfTheCards(cards, cardsTraced){
    var aux = []
    for (var i =0; i< cards.length; i++){           
        if (!existCard(cardsTraced ,cards[i])){
            aux.push(cards[i]);
        }
    }
    return aux;
}
function existCard(listCards, card){
    for(var i = 0; i< listCards.length; i++){
        if(listCards[i].idTerritory == card.idTerritory){
            return true;
        }
    }
    return false;

}

var changeCards = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "changeCards";
    this.numSoldier = 0;
    this.extraSoldiers = 0;
    this.playerCards = [];

    this.initStage= function(match){
        console.log('init Carts');
    }

    this.isChangeTurn= function(){
        return false;
    } 

    this.doMove = function(args, match){
        //args = {nick, cardsTraced }

        //update the graph
        console.log("********Change Cards******");
        console.log(args);
        //recibir cartas, removerlas del jugador
        //calcular numero de soldados
        if(!args.flag){
            return;
        }


        var nick = args.nick;
        match.cards.concat(args.cardsTraced); //add the cards to the heap

        var player = searchPlayer(match.listPlayer, nick);  //search the player

        player.cards = getRestOfTheCards(player.cards, args.cardsTraced); //set the rest of the cards
        this.playerCards = player.cards; //this is to test whether the stage change

        player.timesCardTrace+= 1; //incremenct the times that a player traces a card

        //calculate the  of soldiers by cards
        this.numSoldier = calculateSoldiersByCards(player.timesCardTrace);

        //calculate the extra soldiers
        this.extraSoldiers = calculateExtraSoldiersCards(args.nick, 
            match.map.graph, args.cardsTraced);  

        player.numSoldier = this.soldiers + this.extraSoldiers;


    }



    this.nextStage = function(){
        //return the next stage
        return new reforceTerritory();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('bild data Cards');
        

        if(!args.flag){
            return {nick: args.nick, cardsTraced: args.cardsTraced,
            numSoldier: 0, extraSoldiers: 0, 
            nickTurn: playerTurn.nick, flag: args.flag, stage: "Reforce" };
        }

        return {nick: args.nick, cardsTraced: args.cardsTraced,
            numSoldier: this.numSoldier, extraSoldiers: this.extraSoldiers, 
            nickTurn: playerTurn.nick, flag: args.flag, stage: "Reforce" };

        
    }

    this.validateChangeStage=function(match, args){
        
        if(!args.flag){
            return "Reforce";
        }

        if(this.playerCards >= 3){
            return "changeCards";
        }
        else{
            return "Reforce";
        }
    
    }

}

var sendCard = function(){

    //recibe an object {nick, idTerritory, graph }
    this.stageName = "sendCard";
    this.newCard = null;

    this.initStage= function(match){
        console.log('init receive Carts');
    }

    this.isChangeTurn= function(){
        return true;
    } 

    this.doMove = function(args, match){
        //get the new card
        console.log("sencard recibo esto", args);

        if(!args.flag){
            return;
        }
        console.log("********obtener New Card******");
        var nick = args.nick;
        this.newCard = match.cards.shift(); //get the new card
        var player = searchPlayer(match.listPlayer, nick);  //search the player
        player.cards.push(this.newCard); //add the new card to the player's cards

    }

    this.nextStage = function(){
        //return the next stage
        return new changeCards();
    }

    this.buildData= function(args, playerTurn, stage){
        console.log('build data receive Cards');
        return {nick: args.nick, card: this.newCard, stage: "changeCards",
         flag: args.flag, nickTurn: playerTurn.nick };

        
    }

    this.validateChangeStage=function(match, args){
        return "changeCards";
    }

}

exports.selectTerritory = selectTerritory;
exports.reforceTerritory = reforceTerritory;
exports.atackTerritory = atackTerritory;
exports.move = move;
exports.changeCards = changeCards;
exports.sendCard = sendCard;


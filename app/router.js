var gameListController = require('./controller/GamesList');
var gameController = require('./controller/GameController');

var matchesController = require('./controller/Matches');

var waitRoomController = require('./controller/WaitRoom');
var startGameController = require('./controller/StartGame');


var express=require('express');
var router=express.Router();

router.get('/games',gameListController.list);
router.post('/matches',gameListController.matches);
router.post('/createMatch',matchesController.create);
router.get('/createMatch',matchesController.createGet);
router.get('/setParameterMatch',matchesController.setParameters);
router.get('/chooseMap',matchesController.chooseMap);
router.post('/setMap',matchesController.setMap);
router.get('/',matchesController.index);

router.get('/waitroom', waitRoomController.waitroom);
router.get('/players', waitRoomController.players);
router.get('/startGame', startGameController.startGame);

//Game
router.get('/game',gameController.game);

module.exports = router;

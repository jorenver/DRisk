var gameListController = require('./controller/GamesList');
var waitRoomController = require('./controller/WaitRoom');
var startGameController = require('./controller/StartGame');

var express=require('express');
var router=express.Router();

router.get('/games',gameListController.list);
router.post('/matches',gameListController.matches);

router.get('/waitroom', waitRoomController.waitroom);
router.get('/players', waitRoomController.players);
router.get('/startGame', startGameController.startGame);


module.exports = router;

var gameListController = require('./controller/GamesList');
var gameController = require('./controller/GameController');

var express=require('express');
var router=express.Router();

router.get('/games',gameListController.list);
router.post('/matches',gameListController.matches);



//Game
router.get('/game',gameController.game);

module.exports = router;

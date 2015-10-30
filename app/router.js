var express=require('express');
var router=express.Router();
module.exports = router;

var indexController = require('./controller/indexController');
var createMatchController = require('./controller/createMatchController');
var joinMatchController = require('./controller/joinMatchController');
var waitroomController = require('./controller/waitroomController');
var chooseMapController = require('./controller/chooseMapController');
var publicMatchController = require('./controller/publicMatchController');

var customizeMapController = require('./controller/customizeMapController');
var startGameController = require('./controller/startGameController');

router.get('/', indexController.index);

router.get('/createMatch',createMatchController.createMatchGet);
router.post('/createMatch', createMatchController.createMatch);

router.get('/setDataMatch',createMatchController.setDataMatchGet);
router.post('/setDataMatch', createMatchController.setDataMatch);

router.get('/setMap',chooseMapController.setMapGet);
router.post('/setMap',chooseMapController.setMap);

router.get('/publicMatch',publicMatchController.publicMatch);

//Join 
router.post('/joinMatch', joinMatchController.joinMatch);
router.get('/getMatches', joinMatchController.getMatches);

//waitroom players (not player creator)
router.get('/waitroom', waitroomController.waitroom);
router.post('/getMatchData', waitroomController.getMatchData);

//Map
router.get('/customizeMap',customizeMapController.customizeMap);
//Start game
router.get('/startGame',startGameController.startGame);
//Players
router.get('/players',waitroomController.getPlayers);
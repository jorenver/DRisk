var express=require('express');
var router=express.Router();
module.exports = router;

var indexController = require('./controller/indexController');
var createMatchController = require('./controller/createMatchController');
var joinMatchController = require('./controller/joinMatchController');
var waitroomController = require('./controller/waitroomController');
var chooseMapController = require('./controller/chooseMapController');
var publicMatchController = require('./controller/publicMatchController');

router.get('/', indexController.index);

router.post('/createMatch', createMatchController.createMatch);
router.post('/setDataMatch', createMatchController.setDataMatch);
router.post('/setMap',chooseMapController.setMap);
router.get('/publicMatch',publicMatchController.publicMatch);

router.post('/joinMatch', joinMatchController.joinMatch);

//Join 
router.get('/joinMatch', joinMatchController.joinMatch);
router.post('/getMatches', joinMatchController.getMatches);

//waitroom players (not player creator)
router.get('/waitroom', waitroomController.waitroom);
router.post('/getMatchData', waitroomController.getMatchData);


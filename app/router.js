var express=require('express');
var router=express.Router();
module.exports = router;

var indexController = require('./controller/indexController');
var createMatchController = require('./controller/createMatchController');
var joinMatchController = require('./controller/joinMatchController');
var waitroomController = require('./controller/waitroomController');

router.get('/', indexController.index);
router.get('/createMatch', createMatchController.createMatch);

//Join 
router.get('/joinMatch', joinMatchController.joinMatch);
router.post('/getMatches', joinMatchController.getMatches);

//waitroom players (not player creator)
router.get('/waitroom', waitroomController.waitroom);
router.post('/getMatchData', waitroomController.getMatchData);
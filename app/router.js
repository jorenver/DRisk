var gameListController = require('./controller/GamesList');
var matches = require('./controller/Matches');

var express=require('express');
var router=express.Router();

router.get('/games',gameListController.list);
router.post('/matches',gameListController.matches);
router.post('/createMatch',matches.create);
router.get('/setParameterMatch',matches.setParameters);
router.get('/',matches.index);

module.exports = router;

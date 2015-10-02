var express=require('express');
var router=express.Router();
module.exports = router;

var indexController = require('./controller/indexController');
var createMatchController = require('./controller/createMatchController');
var joinMatchController = require('./controller/joinMatchController');

router.get('/', indexController.index);
router.get('/createMatch', createMatchController.createMatch);
router.get('/joinMatch', joinMatchController.joinMatch);
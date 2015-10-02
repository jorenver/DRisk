var express=require('express');
var router=express.Router();
module.exports = router;

var indexController = require('./controller/indexController');

router.get('/', indexController.index);
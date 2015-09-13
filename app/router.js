var gameListController = require('./controller/GamesList');

var express=require('express');
var router=express.Router();

router.get('/games',gameListController.list);
router.post('/matches',gameListController.matches);

module.exports = router;

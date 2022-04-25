var express = require('express');
var router = express.Router();
let a = require('../editor/editingImages.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

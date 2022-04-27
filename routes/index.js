var express = require('express');
var router = express.Router();
const { writeOnImage } = require('../editor/editingImages.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let fileName = __dirname + '\\..\\images\\Doggies.jpg';
  writeOnImage(fileName, 'p.jpg', 20, 80, 140, 100, 'Nice');
  res.render('index', { title: 'Express' });
});

module.exports = router;

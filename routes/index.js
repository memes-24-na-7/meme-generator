var express = require('express');
var router = express.Router();
const { writeOnImage } = require('../editor/editingImages.js');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  let fileName = __dirname + '\\..\\images\\Doggies.jpg';
  writeOnImage(fileName, 'p.jpg', 20, 80, 140, 100, 'Ура, обводка!');
  res.sendFile(path.join(__dirname, '../views/h.html'));
});

module.exports = router;

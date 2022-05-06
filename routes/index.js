const express = require('express');
const router = express.Router();
const { writeOnImage } = require('../editor/editingImages.js');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // let fileName = __dirname + '\\..\\images\\Doggies.jpg';
  // writeOnImage(fileName, 'p.jpg', 20, 80, 140, 100, 'Ура, обводка!');
  // let pagePath = path.join(__dirname, '..', 'views', 'image-load.html');
  //res.sendFile('D:\\Users\\Александра\\Desktop\\meme-generator\\views\\image-load.html');
  res.sendFile(path.join(__dirname, '../views/image-load.html'));
});

module.exports = router;

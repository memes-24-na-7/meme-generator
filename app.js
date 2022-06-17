const createError = require('http-errors');
const express = require('express');
const path = require('path');
let app = express();

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

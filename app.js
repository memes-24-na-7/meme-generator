const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const url = require('url');
const fs = require('fs');

// var logger = require('morgan');
// var router = express.Router();

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// var indexRouter = require('./routes/index');
// app.use('/', indexRouter);
const cookieName = 'meme-editor-uid';

let addUserFilename = function(uid, filename = null) {
  fs.readFile('galleries.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    }
    let galleries = JSON.parse(data);

    if (!filename && typeof galleries[uid] === 'undefined') {
      galleries[uid] = Array();
      fs.writeFile('galleries.json', JSON.stringify(galleries), err => console.log(err));
    }

    if (filename) {
      galleries[uid].push(filename);
      fs.writeFile('galleries.json', JSON.stringify(galleries), err => console.log(err));
    }
  });
};

app.get('/', function(req, res, next) {
  let uid = cookieParser.JSONCookies(req.cookies)[cookieName];
  if (typeof uid === 'undefined') {
    uid = uuid.v4();
    let content = fs.readFileSync('galleries.json', 'utf8');
    let users = JSON.parse(content);
    while (users.hasOwnProperty(uid)) {
      uid = uuid.v4();
    }
    res.cookie(cookieName, uid);
  }

  addUserFilename(uid);
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
});

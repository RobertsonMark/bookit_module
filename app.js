var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Schema = mongoose.Schema;

var app = express();

var RoomSchema = new Schema({
    name: {type: String},
    isReserved: {type: Number},
    room: {type: Number}
});

var Room = mongoose.model('Room', RoomSchema);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://admin:admin1234@ds113815.mlab.com:13815/bookit', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("test we good xdxd okay sign");
});


app.get('/', function(req, res, next) {
  // Read from database
  // if open, send flag saying its open
  // else send flase that its reserved
  Room.findOne({room: 201}, function (err, doc) {
      if (err) {
          console.log(err)
      } else {
          res.render('index', { isReserved: doc.isReserved, name: doc.name });
      }
  })
});


// Will create the default database object
app.post('/admin-create', function(req, res) {
  var newRoom = {
      isReserved: 0,
      name: "Nobody",
      room: 201
  }
  var data = new Room(newRoom);
  data.save();
  res.redirect('/');
});

app.post('/reserve', function(req, res) {
  //logic saving to db - say the room is now reserved
  //go to new view
  Room.findOne({room: 201}, function (err, doc) {
      if (err) {
          console.log(err)
      } else {
          doc.isReserved = 1;
          doc.name = "You";
          doc.save();
      }
  })
  res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;

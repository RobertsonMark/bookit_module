var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Connection settings
// url, password to the AZURE
var config = {
    userName: 'Bookitnow',
    password: 'Bookitpassword19',
    server: 'bookitdb.database.windows.net',
    options:
    {
        database: 'Bookit',
        encrypt: true
    }
}

var connection = new Connection(config);
connection.on('connect', function(err)
    {
        if (err) {
            console.log(err)
        }
        else {
            executeStatement();
        }
    });

//dbo.Main
//1 is available

function executeStatement() {
    request = new Request('SELECT * FROM dbo.Main', function(err, rowCount) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rowCount + 'rows');
        }
    });
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log(column.value);
        });
    });
    connection.execSql(request);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;

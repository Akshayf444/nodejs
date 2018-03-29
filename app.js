var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');

var usersRouter = require('./routes/users');
var pagesRouter = require('./routes/pages');

var app = express();

var mysql = require('mysql')
var session;


/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({secret: 'adqwqcxcxcz'}));

//app.use('/', indexRouter);

app.get('/', function(req, res, next) {
	res.render('index', { title: 'Login',layout:false });
});

app.post('/', function(req, res, next) {
	session = req.session;
	req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users where email = "' + req.body.email + '" and password = "' + req.body.password + '"',function(err, rows, fields) {
			if(rows[0].is_admin){
				session.email = req.body.email;
				if(rows[0].is_admin == 1){
					session.is_admin = rows[0].is_admin;
					res.redirect('/users');
				}
			}else{
				console.log('invalid login');
			}
			
		});
    });	
});

app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.use('/users', usersRouter);
app.use('/pages', pagesRouter);

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('ejs-locals');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var cors = require('cors');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config();
require('./config/passport');
var app = express();

const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost/shop_gallery';
mongoose.connect(MONGOURL, { useNewUrlParser: true }, err => {
  console.error(err || `Connected to MongoDB: ${MONGOURL}`);
});

// view engine setup
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());
app.use(session({
  secret: '1688',
  resave: false, saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

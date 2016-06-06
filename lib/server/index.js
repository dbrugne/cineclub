const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));
if (process.env.DISABLE_HTTP_LOG !== '1') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '../../', 'public'),
  dest: path.join(__dirname, '../../', 'public'),
  indentedSyntax: true,
}));
app.use(express.static(path.join(__dirname, '../../', 'public')));

app.use('/api', require('./api/index'));
app.use('/email', require('./routes/email'));
app.use('/', require('./routes/index')); // last route to match every react-router routes

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const error = {
    message: err.message,
    error: (app.get('env') === 'development')
      ? err
      : {}, // no stack-trace outside development
  };

  if (!req.accepts('html')) {
    res.type('application/vnd.api+json').json(error);
  } else {
    res.render('error', error);
  }
});

module.exports = app;

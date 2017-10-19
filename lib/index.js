const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')

const accessToken = require('./accessToken')
const call = require('./call')
const channels = require('./channels')
const login = require('./login')


function serverUnifyme(env)
{
  var app = express()
    require('mongoose-middleware').initialize(mongoose);
    mongoose.connect('mongodb://localhost:27017/Login', function(err) {
      if(err) throw err;
        console.log('Conectados con éxito a la Base de Datos');
    });

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/auth', accessToken(env))
  app.use('/call', call(env))
  app.use('/channels', channels(env))
    app.use('/login', channels(env))

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
  })


  return app
}


module.exports = serverUnifyme

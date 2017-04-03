'use strict';

const debug = require('debug')('xbalance');
const express = require('express');
const path  = require('path');
//import favicon from 'serve-favicon';
const logger = require('morgan');
//import cookieParser from 'cookie-parser';
const bodyParser = require('body-parser');
const http = require('http');
const Faye = require('faye');
const _ = require('lodash');
const os = require('os');

let log = require('./server/logger').log;
let index = require('./routes/index').router;
let api = require('./routes/api').api;
let publish = require('./server/publish').publish;

const onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let port = this;
  let bind = _.isString(port) && `Pipe ${port}` || `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': {
      log.crit(`${bind} requires elevated privileges.\n App will now exit!`);
      process.exit(1);
      break;
    }
    case 'EADDRINUSE': {
      log.crit(`${bind} is already in use.\n App will now exit!`);
      process.exit(1);
      break;
    }
    default: {
      throw error;
    }
  }
};

const onListening = function onListening() {
  let server = this;
  const addr = server.address();
  let bind = _.isString(addr) && `Pipe ${addr}` || `Port ${addr.port}`;
  log.info(`Listening on ${bind}`);
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('json spaces', 2);

app.use('/', index);

// JSON API
app.get('/api/getBalances', api.getBalances);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let httpPort = process.env.XBALANCE_PORT || '4000';
app.set('port', httpPort);
let httpServer = http.createServer(app);
let onErrorHttp = _.bind(onError, httpPort);
httpServer.on('error', onErrorHttp);
let onListeningHttp = _.bind(onListening, httpServer);
httpServer.on('listening', onListening);
httpServer.listen(httpPort);

let fayePort = '8000';
let fayeServer = http.createServer();
let bayeux = new Faye.NodeAdapter({mount: '/'});
bayeux.attach(fayeServer);
bayeux.on('handshake', function(clientId) {
  debug(`Client connected:, ${clientId}`);
});
let onErrorFaye = _.bind(onError, fayePort);
fayeServer.on('error', onErrorFaye);
let onListeningFaye = _.bind(onListening, fayeServer);
fayeServer.on('listening', onListeningFaye);
fayeServer.listen(fayePort);

let hostname = os.hostname();
log.info(`App running at: http://${hostname}:${httpPort}/`)
publish();
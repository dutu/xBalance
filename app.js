'use strict';

const debug = require('debug')('exchangebalance:server');
import express from 'express';
import path from 'path';
//import favicon from 'serve-favicon';
import logger from 'morgan';
//import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import { log } from './server/logger';

import { router as index } from './routes/index';
import { api } from './routes/api';
import { publish } from './server/publish';

const Faye = require('faye');

const onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': {
      log.crit(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    }
    case 'EADDRINUSE': {
      log.crit(`${bind} is already in use`);
      process.exit(1);
      break;
    }
    default: {
      throw error;
    }
  }
};

const onListening = function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
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

let port = process.env.XBALANCE_PORT || '3000';
app.set('port', port);
let server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let fayeServer = http.createServer();
let bayeux = new Faye.NodeAdapter({mount: '/'});
bayeux.attach(fayeServer);
bayeux.on('handshake', function(clientId) {
  log.info(`Client connected:, ${clientId}`);
});
fayeServer.listen(8000);

publish();
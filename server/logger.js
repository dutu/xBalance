'use strict';

const winston = require('winston');

let log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all'
    })
  ]
});

log.setLevels(winston.config.syslog.levels);

module.exports.log = log;

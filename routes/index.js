'use strict';

const express = require('express');

let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'xBalance' });
});

module.exports.router= router;

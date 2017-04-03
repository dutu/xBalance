'use strict';

const _ = require('lodash');
const moment = require('moment');

const getAccountsBalance =  require ('../server/xBalance').getAccountsBalance;

let api = {};

api.getBalances = function getBalances(req, res) {
	getAccountsBalance(function (result) {
	  let response = _.cloneDeep(result);
	  if (req.query.dateformat) {
      response.forEach(account => {
        account.timestamp = moment(account.timestamp).format(req.query.dateformat);
      });
    }
    res.json(response);
  });
};

module.exports.api = api;

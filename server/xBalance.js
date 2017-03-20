const async  = require ('async');
const _ = require ('lodash');
const Cryptox = require('cryptox');

const log = require('./logger').log;
const accounts = require('../accounts.js').accounts;

let getAccountBalance = function (balances, account, callback) {
  let cryptox = new Cryptox(account.exchange, { key: account.api.key, secret: account.api.secret, username: account.api.clientId, passphrase: account.api.passphrase });
  let result = {
    accountName: account.accountName,
  };
  cryptox.getBalance({}, function (err, balance) {
    if (err) {
      log.error(`Account name: ${account.accountName}, getBalance() error: ${err.message}`);
      result.error = err.message;
      result.timestamp = Date.now();
      balances.push(result);
      return callback (null, balances);
    }

    return callback (null, balances);
  });
};

export const getAccountsBalance = function getAccountsBalance(callback) {
  if (!_.isArray(accounts)) {
    log.crit(`configuration file accounts.js is invalid! Please correct the configuration and restart the application.`);
    process.exit(1);
  }

  async.reduce(accounts, [], getAccountBalance, function(err, result) {
    if( err ) {
      log.crit(`Failed to process. Error: ${err.message}`);
    }

    callback(result);
  });
};
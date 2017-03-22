const async  = require ('async');
const _ = require ('lodash');
const Cryptox = require('cryptox');
const Big = require('big.js');
const blockexplorer = require('blockchain.info').blockexplorer;
const log = require('./logger').log;
const accounts = require('../accounts.js').accounts;

let rates = [];

let getRate = function getRate(cryptox, currencyA, currencyB, callback) {
  let currA = currencyA.toUpperCase() === 'XBT' && 'BTC' || currencyA.toUpperCase();
  let currB = currencyB.toUpperCase() === 'XBT' && 'BTC' || currencyB.toUpperCase();
  if (currA === currB) {
    return callback('1');
  }

  let rate = _.find(rates, {pair: `${currA}_${currB}`});
  if (rate) {
    return callback(rate.rate);
  }

  rate = _.find(rates, {pair: `${currB}_${currA}`});
  if (rate) {
    return callback(rate.rate);
  }

  cryptox.getRate({ pair: `${currA}_${currB}` }, function (err, res) {
    if (!err && res.error === '') {
      rates.push({pair: `${currA}_${currB}`, rate: res.data[0].rate});
      callback(res.data[0].rate)
    } else {
      cryptox.getRate({pair: `${currB}_${currA}`}, function (err, res) {
        if (!err && res.error === '') {
          let rate = new Big(1).div(res.data[0].rate).toFixed(8);
          rates.push({pair: `${currB}_${currA}`, rate: rate });
          callback(rate)
        } else {
          callback(null);
        }
      });
    }
  });
};


let getAccountBalance = function (balances, account, callback) {
  switch (account.exchange) {
    case 'BTC wallet': {
      let result = {
        exchange: account.exchange,
        accountName: account.accountName,
      };
      blockexplorer.getMultiAddress(account.addresses)
        .then(function(response) {
          result.timestamp = Date.now();
          result.subAccount = '';
          result.totalBalance = [];
          let totalBTC = response.addresses.reduce((totalFinal_balance, address) => {
            return totalFinal_balance += address.final_balance;
          }, 0) / 100000000;
          result.totalBalance.push({ currency: 'BTC', amount: totalBTC.toFixed(8), worthBTC: totalBTC.toFixed(8) });
          balances.push(result);
          return callback(null, balances);
        })
        .catch(function (errorMessage) {
          result.timestamp = Date.now();
          log.error(`Account name: ${account.accountName}, getBalance() error: ${errorMessage}`);
          result.error = errorMessage;
          balances.push(result);
          return callback(null, balances);
        });
      break;
    }

    default: {
      let cryptox = new Cryptox(account.exchange, { key: account.api.key, secret: account.api.secret, username: account.api.clientId, passphrase: account.api.passphrase });
      let options = account.exchange === 'poloniex' && { account: 'all' } || {};
      cryptox.getBalance(options, function (err, balance) {
        let result = {
          exchange: account.exchange,
          accountName: account.accountName,
          timestamp: Date.now(),
        };
        if (err) {
          log.error(`Account name: ${account.accountName}, getBalance() error: ${err.message}`);
          result.error = err.message;
          balances.push(result);
          return callback(null, balances);
        }

        async.each(balance.data,
          function (subAccountBalance, callback) {
            let result = {
              accountName: account.accountName,
              exchange: account.exchange,
            };
            if (subAccountBalance.account_id) {
              result.subAccount = subAccountBalance.account_id;
            }

            result.timestamp = Date.now();
            result.totalBalance = [];
            async.each(subAccountBalance.total,
              function (currencyBalance, callback) {
                let amount = new Big(currencyBalance.amount);
                if (!amount.eq(0)) {
                  getRate(cryptox, currencyBalance.currency, 'BTC', function (rate) {
                    let worthBTC = 0;
                    if (rate) {
                      worthBTC = amount.times(rate).toFixed(8);
                    }

                    result.totalBalance.push({ currency: currencyBalance.currency === 'XBT' && 'BTC' || currencyBalance.currency, amount: amount.toFixed(8), worthBTC: worthBTC });
                    callback(null);
                  });
                } else {
                  callback(null);
                }
              },

              function (err) {
                if (result.totalBalance.length > 0) {
                  balances.push(result);
                }

                callback(err);
              }
            );
          },

          function (err) {
            callback(null, balances);
          }
        );
      });
    }
  };
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
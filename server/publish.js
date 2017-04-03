const Faye = require('faye');
const os = require('os');
const _ = require('lodash');

const log = require('./logger').log;
const getAccountsBalance = require('./xBalance').getAccountsBalance;

const updateClients = function updateClients(fayeClient) {
  getAccountsBalance(function (balances) {
    fayeClient.publish('/balances', {
      balances: balances,
    });
  });
};


let publish = function publish() {
  let hostname = os.hostname();
  let client = new Faye.Client(`http://${hostname}:8000/`);
  let settings;
  let upd = _.bind(updateClients, this, client);

  client.subscribe('/settings', function(message) {
    settings = message.settings;
    //log.info('Got settings from browser client');
  });

  client.subscribe('/getBalances', function(message) {
    settings = message.settings;
    log.info('Balances requested from browser');
    updateClients(client);
  });

//  setInterval(upd, 5000);
};

module.exports.publish = publish;

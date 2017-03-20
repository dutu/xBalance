
let balances;
let header = {
  id: 'header',
  view: 'template',
  type: 'header',
  autoheight:true,
  css: 'header',
  borderless: true,
  template: function(obj) { return obj.value; },
  data: { value: 'xBalance' },
};

let accountSettingsView = { id: 'accountSettings', rows:[{ id: 'accountSettingsTab', template: 'Two' }] };

let columns = [
  { id: "timestamp",	header: "Date", sort: "int"},
  { id: "exchange",	header: "Exchange", sort: "string" },
  { id: "accountName", header:"Account name", autowidth: true, sort: "string" },
  { id: "subAccount", header:"Subaccount", autowidth: true, sort: "string" },
  { id: 'worthBTC',	header: 'worthBTC', sort: "int" },
];

let balanceTableConfig = {
  id: 'balanceTable',
  view: 'datatable',
  autoheight: true,
  autowidth: true,
  drag: true,
  columns: webix.copy(columns),
  data: [],

};

let tabview = {
  view: 'tabview',
  multiview: { keepViews: true },
  id: 'profileTabview',
  animate: { type: "flip", subtype: "vertical" },
  cells:[
    { header: "Balance", body: balanceTableConfig },
    { header: "Settings", body: accountSettingsView },
  ],
};

webix.ready(function () {
  webix.ui({
    view: 'scrollview',
    scroll: 'y',
    body: {
      type: 'clean',
      id: 'app',
      rows: [
        header,
        tabview,
      ]
    }
  });

  webix.extend($$("balanceTable"), webix.ProgressBar);

  let client = new Faye.Client(`http://${window.location.hostname}:8000/`);
  client.publish('/settings', {
    settings: 'From browser'
  });

  $$('balanceTable').clearAll();
  $$('balanceTable').showProgress({ delay: 300000, hide: true });
  client.publish('/getBalances', {
    settings: {},
  });

  client.subscribe('/balances', function(message) {
    balances = message.balances;
    let balanceTable = [];
    balances.forEach(account => {
      let balanceRow = {
        accountName: account.accountName,
        exchange: account.exchange,
        timestamp: account.timestamp,
        subAccount: account.subAccount,
        worthBTC: 0,
      };

      if (Array.isArray(account.totalBalance)) {
        account.totalBalance.forEach(currencyBalance => {
          balanceRow[currencyBalance.currency] = currencyBalance.amount;
          balanceRow.worthBTC += parseFloat(currencyBalance.worthBTC);
          let currencyColumn = columns.find(column => {
            return column.id === currencyBalance.currency
          });
          if (!currencyColumn) {
            columns.push({ id: currencyBalance.currency,	header: currencyBalance.currency, sort: "int", align: 'center' })
          }
        });
      } else {
        balanceRow.subAccount = account.error || balanceRow.subAccount;
      }
      balanceRow.worthBTC = balanceRow.worthBTC.toFixed(8);
      balanceTable.push(balanceRow);
    });
    $$('balanceTable').hideProgress();
    $$('balanceTable').clearAll();
    $$('balanceTable').define({
      'columns': columns,
      'data': balanceTable,
    });
    $$("balanceTable").refreshColumns();
  });
});


export let accounts = [
  {
    accountName: 'Bitstamp account1',
    exchange: 'bitstamp',
    api: {
      key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      secret: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      clientId: '123456',   // required for Bitstamp and CEX.io
      passphrase: '', // required for Gdax
    },
  },
  {
    accountName: 'Bitstamp account2',
    exchange: 'bitstamp',
    api: {
      key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      secret: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      clientId: '456789',   // required for Bitstamp and CEX.io
      passphrase: '', // required for Gdax
    },
  },
  {
    accountName: 'My wallet',
    exchange: 'BTC wallet',
    addresses :[
      '1EzEcyUfQ1SnwLwsGz94DR2k4ToBpZ3Fiq',
      '1DpQ8H6eWceMF7GUnbuNgjr7z9MrD3ejJV',
    ]
  },
];
const http = require('http');
const config = require('../services/config.js');

const options = {
  host: 'localhost',
  port: config.get('LISTEN_PORT'),
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.headers['x-powered-by'] === 'Express') {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('ERROR', err);
  process.exit(1);
});

request.end();

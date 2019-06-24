const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'NODE_ENV',
    'LISTEN_PORT',
    'GECKO_DRIVER_BASEURL'
  ])
  // 3. Config file
  .file({
    file: path.join(__dirname, '../conf/', `${nconf.get('NODE_ENV')}.conf.json`)
  })

  // 4. Defaults
  .defaults({
    LISTEN_PORT: 3100
  });

// Check for required settings
checkConfig('GECKO_DRIVER_BASEURL');

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in lib/conf/${nconf.get('NODE_ENV')}.conf.json`);
  }
}

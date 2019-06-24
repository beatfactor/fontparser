require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const appVersion = require('../package.json').version;
const app = express();
app.enable('trust proxy');
app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.set('app-version', appVersion);
  next();
});
app.use(helmet());
app.get('/', (req, res, next) => {
  res.send('/');
});
app.use(require('./routes/v1/parse-fonts.js'));

app.use((err, req, res, next) => {
  const type = err.type || err.data;
  if (type) {
    console.error(type, ':', err.message);
  } else {
    console.error(err.name, ':', err.message);
  }

  let statusCode = err.statusCode || 500;
  let responseText = err.response || 'Internal Server Error.';

  res.status(statusCode);
  res[err.json ? 'json' : 'send'](responseText);
});

const port = process.env.LISTEN_PORT || 3100;
const server = http.createServer(app);
server.listen(port, () => console.log(`Webflow Font Service API running on port ${port}...`));

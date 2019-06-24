const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.text({limit: '10mb'}));
app.use('/', express.static(path.resolve(__dirname, './www')));

const port = process.env.PORT || 9001;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

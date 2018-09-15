const mongoose = require('mongoose');
const config = require('./config');

const database = config.getConf('mongodb:database');
const user = config.getConf('mongodb:user');
const password = config.getConf('mongodb:password');
const host = config.getConf('mongodb:host');
const port = config.getConf('mongodb:port');
if (user && password) {
  var uri = `mongodb://${user}:${password}@${host}:${port}/${database}`;
} else {
  var uri = `mongodb://${host}:${port}/${database}`;
}
mongoose.connect(uri, {
  useNewUrlParser: true
});
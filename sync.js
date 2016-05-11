require('dotenv').config();
require('./lib/mongoConnect')(process.env.MONGO_DB || 'mongodb://localhost/test');
const syncTask = require('./lib/syncTask');

syncTask();

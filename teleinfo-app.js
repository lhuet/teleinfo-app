var tarifbleu = require('tarifbleu');
var loggerMongo = require('./mongologger');

// Log toutes les minutes
tarifbleu.tarifbleu('/dev/ttyAMA0', '00 * * * * *', loggerMongo.getLogger());

console.log('Lancement datalogger Mongo tarifbleu');

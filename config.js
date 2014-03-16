'use strict';

var login = process.env.MONGO_LOGIN;
var pwd = process.env.MONGO_PASSWORD;
var hostmongo = process.env.MONGO_HOST;
var portmongo = process.env.MONGO_PORT;
var databaseName = process.env.MONGO_DATABASE;


exports.urlMongo = 'mongodb://'+login+':'+encodeURIComponent(pwd) + '@'+hostmongo+':'+portmongo+'/'+databaseName;

exports.serialPort = process.env.TELE_PORT || '/dev/ttyAMA0';

exports.httpPort = process.env.PORT || 3000;
'use strict';

var tarifbleu = require('tarifbleu');
var loggerMongo = require('./mongo/mongologger');
var routes = require('./routes');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var http = require('http');
var util = require('util');


var login = process.env.MONGO_LOGIN;
var pwd = process.env.MONGO_PASSWORD;
var hostmongo = process.env.MONGO_HOST;
var portmongo = process.env.MONGO_PORT;
var databaseName = process.env.MONGO_DATABASE;
var url = 'mongodb://'+login+':'+encodeURIComponent(pwd) + '@'+hostmongo+':'+portmongo+'/'+databaseName;
var serialPort = process.env.TELE_PORT || '/dev/ttyAMA0';


mongoClient.connect(url, {uri_decode_auth: true, auto_reconnect: true }, function (err, db) {

    // Test connexion database
    assert.equal(null, err);
    assert.ok(db != null);
    console.log('Connexion database ok');

    // Log toutes les minutes
    tarifbleu.tarifbleu(serialPort, '00 * * * * *', loggerMongo.getLogger(db));

    // Partie API Rest
    var app = express();

    // Variables environnement
    app.set('port', process.env.PORT || 3000);

    // routes de l'application
    routes(app, db, tarifbleu);

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Lancement application teleinfo sur le port ' + app.get('port'));
    });

});
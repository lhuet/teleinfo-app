'use strict';

var tarifbleu = require('tarifbleu');
var loggerMongo = require('./app/mongo/mongologger');
var routes = require('./app/routes');
var config = require('./app/config');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');


mongoClient.connect(config.urlMongo, {uri_decode_auth: true, auto_reconnect: true }, function (err, db) {

    // Test connexion database
    assert.equal(null, err);
    assert.ok(db !== null);
    console.log('Connexion database ok');

    // Log toutes les minutes
    if (process.env.NODE_ENV === 'RPI') {
        tarifbleu.tarifbleu(config.serialPort, '00 * * * * *', loggerMongo.getLogger(db));
    }

    // Partie API Rest
    var app = express();

    // routes de l'application
    routes(app, db, tarifbleu);

    // Fichiers static
    app.use(express.static(__dirname + '/public'));

    app.listen(config.httpPort);
    console.log('Lancement application teleinfo sur le port ' + config.httpPort);

});
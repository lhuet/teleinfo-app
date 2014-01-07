'use strict';

var tarifbleu = require('tarifbleu');
var loggerMongo = require('./mongologger');
var express = require('express');
var http = require('http');

// Log toutes les minutes
tarifbleu.tarifbleu('/dev/ttyAMA0', '00 * * * * *', loggerMongo.getLogger());

// Partie API Rest
var app = express();

// Variables environnement
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
    res.json('application teleinfo démarrée');
});

app.get('/rest/pinst', function(req, res) {
    res.json(tarifbleu.getPuissanceApparente());
});

app.get('/rest/iinst', function(req, res) {
    res.json(tarifbleu.getIntensite());
});

app.get('/rest/index', function(req, res) {
    res.json(tarifbleu.getIndex());
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Lancement application teleinfo sur le port ' + app.get('port'));
});

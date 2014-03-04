'use strict';

var tarifbleu = require('tarifbleu');
var loggerMongo = require('./mongo/mongologger');
var consoinst = require('./teleinfo/consoinst');
var express = require('express');
var http = require('http');

var serialPort = process.env.TELE_PORT || '/dev/ttyAMA0';

// Log toutes les minutes
tarifbleu.tarifbleu(serialPort, '00 * * * * *', loggerMongo.getLogger());

// Partie API Rest
var app = express();

// Variables environnement
app.set('port', process.env.PORT || 3000);

// Requête 'isAlive'
app.get('/', function(req, res) {
    res.json('application teleinfo démarrée');
});

// Mise à jour du contexte des requêtes sur le compteur
app.all('/rest/inst/*', function(req, res, next) {
    req.tarifbleu = tarifbleu;
    next();
});

// Requêtes données instantannées
app.get('/rest/inst/p', consoinst.pinst);
app.get('/rest/inst/i', consoinst.iinst);
app.get('/rest/inst/index', consoinst.index);

// Requêtes mongo
app.get('/rest/consojour/:jour', function(req, res) {
/*    db.teleinfo.aggregate([
    { $match : {datetime: {$gte: ISODate("2014-01-07T00:00:00Z")}}}, 
    { $sort : { datetime: 1 } },
    { $group : { 
        _id : 1,
        min : { $first: "$indexcpt"},
        max : { $last: "$indexcpt"}
        }
    }
    ]);*/
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Lancement application teleinfo sur le port ' + app.get('port'));
});

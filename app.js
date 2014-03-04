'use strict';

var tarifbleu = require('tarifbleu');
var loggerMongo = require('./mongo/mongologger');
var consoinst = require('./teleinfo/consoinst');
var mongo = require('./mongo/mongoHelpers');
var express = require('express');
var http = require('http');
var util = require('util');

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
app.get('/rest/testmongo', function(req, res) {
    console.log('Requête HTTP mongo reçue')
    var _db;
    mongo.connect()
       .then(function(db) {
           var request = [
               {$match: {datetime: {$gte:new Date("2014-01-01T00:00:00.000Z"), $lte:new Date("2014-02-17T00:00:00.000Z")}}},
               {$project:
               {annee: {'$year':'$datetime'},
                   mois:{'$month':'$datetime'},
                   jour:{'$dayOfMonth':'$datetime'},
                   datetime:1,
                   indexcpt:1}},
               {$group:
               {_id:{annee:'$annee', mois:'$mois', jour:'$jour'},
                   mini:{$min:'$indexcpt'},
                   maxi:{$max:'$indexcpt'}}},
               {$project:
               {conso:{$subtract:['$maxi', '$mini']},
                   annee:{$substr: ["$_id.annee", 0, 4]},  // Workaround pour conversion d'un nombre en string
                   mois:{$substr: ["$_id.mois", 0, 2]},
                   jour:{$substr: ["$_id.jour", 0, 2]}}},
               {$project:
               {_id:0,
                   date: {$concat: ['$annee', '-', '$mois', '-', '$jour']},
                   conso: 1}},
               {$sort:{conso:-1}}
           ];
           _db = db;
           return mongo.aggregate(db, 'teleinfo', request);
       })
       .then(function(result) {
           _db.close();
           res.send(result);
       })
       .catch(function(err) {
           console.log(err);
            res.send(err);
        });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Lancement application teleinfo sur le port ' + app.get('port'));
});

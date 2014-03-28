'use strict';

var consoinst = require('../teleinfo/consoinst');
var ContentMongo = require('./content');

module.exports = exports = function(app, db, tarifbleu) {

    var content = new ContentMongo(db);

    // Requête 'isAlive'
    app.get('/', function (req, res) {
        res.json('application teleinfo démarrée');
    });

    // Mise à jour du contexte des requêtes sur le compteur
    app.all('/rest/inst/*', function (req, res, next) {
        req.tarifbleu = tarifbleu;
        next();
    });

    // Requêtes données instantannées
    app.get('/rest/inst/p', consoinst.pinst);
    app.get('/rest/inst/i', consoinst.iinst);
    app.get('/rest/inst/index', consoinst.index);

    // Requêtes mongo
    app.get('/rest/conso/journaliere', content.consoParJour);
    app.get('/rest/puissance/pmaxparheure', content.pmaxParHeure);

};
var consoinst = require('../teleinfo/consoinst');
var mongo = require('../mongo/mongoHelpers');

module.exports = exports = function(app, db, tarifbleu) {

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
    app.get('/rest/testmongo', function (req, res) {
        console.log('Requête HTTP mongo reçue')

        var request = [
            {$match: {datetime: {$gte: new Date("2014-01-01T00:00:00.000Z"), $lte: new Date("2014-02-17T00:00:00.000Z")}}},
            {$project: {annee: {'$year': '$datetime'},
                mois: {'$month': '$datetime'},
                jour: {'$dayOfMonth': '$datetime'},
                datetime: 1,
                indexcpt: 1}},
            {$group: {_id: {annee: '$annee', mois: '$mois', jour: '$jour'},
                mini: {$min: '$indexcpt'},
                maxi: {$max: '$indexcpt'}}},
            {$project: {conso: {$subtract: ['$maxi', '$mini']},
                annee: {$substr: ["$_id.annee", 0, 4]},  // Workaround pour conversion d'un nombre en string
                mois: {$substr: ["$_id.mois", 0, 2]},
                jour: {$substr: ["$_id.jour", 0, 2]}}},
            {$project: {_id: 0,
                date: {$concat: ['$annee', '-', '$mois', '-', '$jour']},
                conso: 1}},
            {$sort: {conso: -1}}
        ];

        mongo.aggregate(db, 'teleinfo', request)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err) {
                console.log(err);
                res.send(err);
            });
    });

}
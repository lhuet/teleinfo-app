"use strict";

var mongo = require('../mongo/mongoHelpers');
var moment = require('moment');

function ContentMongo (db) {

    this.consoParJour = function (req, res) {

        // Url attendue du type : /rest/conso/journaliere?debut=2014-01-27&fin=2014-03-16

        var debut = moment(req.query.debut);
        var fin = moment(req.query.fin);

        // Conso journalière triée par conso (jour le plus consommateur en premier)
        var request = [
            {$match: {datetime: {$gte: debut.toDate(), $lte: fin.toDate()}}},
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
    }
};

module.exports = ContentMongo;
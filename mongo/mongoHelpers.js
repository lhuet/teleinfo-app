'use strict';

var q = require('q');

exports.aggregate = function(db, collection, request) {
    var deferred = q.defer();
    console.log('Requête aggregate lancée');
    db.collection(collection).aggregate(request, deferred.makeNodeResolver());
    return deferred.promise;
};
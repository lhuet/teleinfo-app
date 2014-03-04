'use strict';

var q = require('q');
var mongoClient = require('mongodb').MongoClient;

var login = process.env.MONGO_LOGIN;
var pwd = process.env.MONGO_PASSWORD;
var hostmongo = process.env.MONGO_HOST;
var portmongo = process.env.MONGO_PORT;
var databaseName = process.env.MONGO_DATABASE;
var url = 'mongodb://'+login+':'+encodeURIComponent(pwd) + '@'+hostmongo+':'+portmongo+'/'+databaseName;

exports.connect = function () {
    var deferred = q.defer();
    console.log('Connexion mongolab lancée ...');
    console.log('URL : ' + url);
    mongoClient.connect(url,deferred.makeNodeResolver());
    return deferred.promise;
};

exports.aggregate = function(db, collection, request) {
    var deferred = q.defer();
    console.log('Requête aggregate lancée');
    db.collection(collection).aggregate(request, deferred.makeNodeResolver());
    return deferred.promise;
}
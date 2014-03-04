'use strict';

// Requêtes données instantannées
exports.pinst = function(req, res) {
    res.json(req.tarifbleu.getPuissanceApparente());
};

exports.iinst = function(req, res) {
    res.json(req.tarifbleu.getIntensite());
};

exports.index = function(req, res) {
    res.json(req.tarifbleu.getIndex());
};

var db = require("./app").bucket;
var config = require("./config");
var N1qlQuery = require('couchbase').N1qlQuery;

function Model() { };

Model.getAll = function(callback) {
    var statement = "SELECT _id, beacon, timestamp, gateway " +
                    "FROM `" + config.couchbase.bucket + "` " +
                    "WHERE type = 'status'";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};


Model.getAllGateways = function(callback) {
    var statement = "SELECT META().id, name, hostname, ipaddress " +
                    "FROM `" + config.couchbase.bucket + "` " +
                    "WHERE type = 'gateway'";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}

Model.getAllBeacons = function(callback) {
    var statement = "SELECT META().id, name, uuid, major, minor " +
                    "FROM `" + config.couchbase.bucket + "` " +
                    "WHERE type = 'beacon'";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}

Model.getActivity = function(callback) {
    var statement = "SELECT beacon, timestamp, a.gateway, COUNT(*) AS count " +
                    "FROM `" + config.couchbase.bucket + "` AS a " +
                    "LET timestamp = MILLIS_TO_UTC(a.timestamp, '2006-01-02'), beacon = (SELECT META().id, name, uuid, major, minor FROM `" + config.couchbase.bucket + "` USE KEYS a.beacon)[0] " +
                    "WHERE a.type = 'status' " +
                    "GROUP BY beacon, timestamp, a.gateway " +
                    "ORDER BY a.gateway, timestamp ASC";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}


Model.getAllTest = function(callback) {
    var statement = "SELECT beacon, timestamp, gateway, COUNT(*) AS count " +
                    "FROM `" + config.couchbase.bucket + "` AS a " +
                    "LET timestamp = MILLIS_TO_UTC(a.timestamp, '2006-01-02'), beacon = (SELECT META().id, name, uuid, major, minor FROM `" + config.couchbase.bucket + "` USE KEYS a.beacon)[0], gateway = (SELECT META().id, name, hostname, ipaddress FROM `" + config.couchbase.bucket + "` USE KEYS a.gateway)[0] " +
                    "WHERE a.type = 'status' " +
                    "GROUP BY beacon, timestamp, gateway " +
                    "ORDER BY gateway, timestamp ASC";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        var dataMap = {};
        for(var i in result) {
            if(result[i].hasOwnProperty("gateway") && result[i].hasOwnProperty("beacon")) {
                if(!dataMap.hasOwnProperty(result[i].gateway.name)) {
                    dataMap[result[i].gateway.name] = {};
                }
                if(!dataMap[result[i].gateway.name].hasOwnProperty(result[i].beacon.name)) {
                    dataMap[result[i].gateway.name][result[i].beacon.name] = [];
                }
                dataMap[result[i].gateway.name][result[i].beacon.name].push([(new Date(result[i].timestamp)).getTime(), result[i].count]);
            }
        }
        var parsedDataMap = {};
        for(var i in dataMap) {
            parsedDataMap[i] = [];
            for(var j in dataMap[i]) {
                parsedDataMap[i].push({name: j, data: dataMap[i][j]});
            }
        }
        callback(null, parsedDataMap);
    });
};

module.exports = Model;

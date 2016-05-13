var db = require("./app").bucket;
var config = require("./config");
var N1qlQuery = require('couchbase').N1qlQuery;

function Model() { };

Model.getAll = function(callback) {
    var statement = "SELECT META(beacon).id, beacon.uuid, beacon.major, beacon.minor, status.createdAt, status.gatewayDevice " +
                    "FROM `" + config.couchbase.bucket + "` AS beacon " +
                    "UNNEST beacon.beaconStatus AS status"
                    "WHERE beacon.uuid IS NOT MISSING";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};


Model.getAllGateways = function(callback) {
    var statement = "SELECT DISTINCT status.gatewayDevice " +
                    "FROM `" + config.couchbase.bucket + "` AS beacon " +
                    "UNNEST beacon.beaconStatus AS status"
                    "WHERE beacon.uuid IS NOT MISSING";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}


Model.getAllTest = function(callback) {
    var statement = "SELECT beacon.uuid, beacon.major, beacon.minor, MILLIS_TO_UTC(status.createdAt, '2006-01-02') AS trackTime, status.gatewayDevice, COUNT(*) AS count " +
                    "FROM `" + config.couchbase.bucket + "` AS beacon " +
                    "UNNEST beacon.beaconStatus AS status " +
                    "WHERE beacon.uuid IS NOT MISSING " +
                    "GROUP BY beacon.uuid, beacon.major, beacon.minor, MILLIS_TO_UTC(status.createdAt, '2006-01-02'), status.gatewayDevice " +
                    "ORDER BY status.gatewayDevice, beacon.uuid, trackTime ASC";
    var query = N1qlQuery.fromString(statement);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        var dataMap = {};
        for(var i in result) {
            if(!dataMap.hasOwnProperty(result[i].gatewayDevice)) {
                dataMap[result[i].gatewayDevice] = {};
            }
            if(!dataMap[result[i].gatewayDevice].hasOwnProperty(result[i].uuid)) {
                dataMap[result[i].gatewayDevice][result[i].uuid] = [];
            }
            dataMap[result[i].gatewayDevice][result[i].uuid].push([(new Date(result[i].trackTime)).getTime(), result[i].count]);
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

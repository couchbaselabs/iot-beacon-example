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


module.exports = Model;

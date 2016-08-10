var express = require("express");
var couchbase = require("couchbase");
var path = require("path");
var config = require("./config");
var app = express();

module.exports.bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

app.use("/bower_components",express.static(path.join(__dirname, "public/bower_components")));
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var routes = require("./routes.js")(app);

var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});

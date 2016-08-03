var dashboard = angular.module("iotDashboard", ["highcharts-ng"]);

dashboard.controller("ExampleController", function($scope, $http) {
    $scope.charts = [];
    $scope.beacons = [];
    $scope.gateways = [];
    $http({method: "GET", url: "http://localhost:3000/test"}).then(function(result) {
        for(var i in result.data) {
            $scope.charts.push({
                options: {
                    chart: {
                        zoomType: 'x'
                    },
                    rangeSelector: {
                        enabled: true
                    },
                    navigator: {
                        enabled: true
                    },
                    legend: {
                        enabled: true,
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                },
                xAxis: {},
                series: result.data[i],
                name: i,
                useHighStocks: true
            });
        }
    }, function(error) {
        console.log("ERROR -> " + JSON.stringify(error));
    });

    $http({method: "GET", url: "http://localhost:3000/beacons"}).then(function(results) {
        $scope.beacons = results.data;
    }, function(error) {
        console.error(error);
    });

    $http({method: "GET", url: "http://localhost:3000/gateways"}).then(function(results) {
        $scope.gateways = results.data;
    }, function(error) {
        console.error(error);
    });

    $scope.saveBeacon = function(name, uuid, major, minor) {
        if(name != "" && uuid != "" && major != "" && minor != "") {
            var documentId = uuid + "::" + major + "::" + minor;
            $http({
                method: "PUT",
                url: "http://localhost:4984/default/" + documentId,
                data: {
                    type: "beacon",
                    name: name,
                    uuid: uuid,
                    major: major,
                    minor: minor
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(success) {
                $scope.beacons.push({
                    name: name
                });
            }, function(error) {
                console.error(error);
            });
        }
    }

    $scope.saveGateway = function(name, hostname, ipaddress) {
        if(name != "" && hostname != "" && ipaddress != "") {
            var documentId = hostname + "::" + ipaddress;
            $http({
                method: "PUT",
                url: "http://localhost:4984/default/" + documentId,
                data: {
                    type: "gateway",
                    name: name,
                    hostname: hostname,
                    ipaddress: ipaddress
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(success) {
                $scope.gateways.push({
                    name: name
                });
            }, function(error) {
                console.error(error);
            });
        }
    }
});

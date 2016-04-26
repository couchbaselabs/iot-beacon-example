var dashboard = angular.module("iotDashboard", ['chart.js']);

dashboard.controller("MainController", function($scope) {

    /*
     * [{"createdAt":1460647951902,"gatewayDevice":"macbookpro/127.0.0.1","id":"f92fec41-c72f-4830-baf8-fea459ec0fbe","major":0,"minor":1,"uuid":"nraboy"},
     * {"createdAt":1460647996039,"gatewayDevice":"macbookpro/127.0.0.1","id":"f92fec41-c72f-4830-baf8-fea459ec0fbe","major":0,"minor":1,"uuid":"nraboy"}]
     */

    var mockResponse = [
        {
            "createdAt":1460647951902,
            "gatewayDevice":"kitchen-101",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":"nraboy"
        },
        {
            "createdAt":1460647996039,
            "gatewayDevice":"kitchen-101",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":
            "agupta"
        },
        {
            "createdAt":1460659991000,
            "gatewayDevice":"kitchen-101",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":
            "agupta"
        },
        {
            "createdAt":1460659991000,
            "gatewayDevice":"kitchen-101",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":
            "agupta"
        },
        {
            "createdAt":1460674391000,
            "gatewayDevice":"kitchen-101",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":"nraboy"
        },
        {
            "createdAt":1460674391000,
            "gatewayDevice":"kitchen-600",
            "id":"f92fec41-c72f-4830-baf8-fea459ec0fbe",
            "major":0,
            "minor":1,
            "uuid":"nraboy"
        }
    ];


    $scope.map = {};

    for(var i in mockResponse) {
        if(!$scope.map.hasOwnProperty(mockResponse[i].gatewayDevice)) {
            $scope.map[mockResponse[i].gatewayDevice] = {};
        }
        if(!$scope.map[mockResponse[i].gatewayDevice].hasOwnProperty(mockResponse[i].uuid)) {
            $scope.map[mockResponse[i].gatewayDevice][mockResponse[i].uuid] = [];
            for(var j = 0; j <= 23; j++) {
                $scope.map[mockResponse[i].gatewayDevice][mockResponse[i].uuid].push(0);
            }
        }
    }

    var now = new Date();
    $scope.today = (now.getMonth() + 1) + "-" + now.getDate() + "-" + now.getFullYear();

    $scope.labels = [];
    for(var i = 0; i <= 23; i++) {
        $scope.labels.push(i);
    }

    for(var key in mockResponse) {
        var savedDate = new Date(mockResponse[key].createdAt);
        if(savedDate.getMonth() == now.getMonth()) {
            $scope.map[mockResponse[key].gatewayDevice][mockResponse[key].uuid][savedDate.getHours()]++;
        }
    }

    for(var i in $scope.map) {
        $scope.map[i].series = Object.keys($scope.map[i]);
        $scope.map[i].data = [];
        for(var j in $scope.map[i].series) {
            $scope.map[i].data.push($scope.map[i][$scope.map[i].series[j]]);
            delete $scope.map[i][$scope.map[i].series[j]];
        }
    }

});

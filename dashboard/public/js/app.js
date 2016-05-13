var dashboard = angular.module("iotDashboard", ["highcharts-ng"]);

dashboard.controller("ExampleController", function($scope, $http) {
    $scope.charts = [];
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
});

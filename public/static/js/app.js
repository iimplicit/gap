(function() {
    var app = angular.module("GAP");

    app.controller("landingPageController", ["$scope", "$http",
        function($scope, $http) {

        }
    ]);

    app.controller("signupPageController", ["$scope", "$http",
        function($scope, $http) {

        }
    ]);

    app.controller("surveyAnalyticsPageController", ["$scope", "$http", "$routeParams",
        function($scope, $http, $routeParams) {
            console.log("survey-analytics => this is id", $routeParams.id);
        }
    ]);

})();
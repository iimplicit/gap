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

    app.controller("surveyViewPageController", ["$scope", "$http", "$routeParams",
        function($scope, $http, $routeParams) {
            // http://localhost:3000/api/surveys/54d1374ea0f09231943ee5d2
            $http.get("http://localhost:3000/api/surveys/" + $routeParams.id).
            success(function(data) {
                $scope.survey = data.survey;
            }).
            error(function(data) {
                console.log("error")
            });
        }
    ]);



    app.controller("surveyAnalyticsPageController", ["$scope", "$http", "$routeParams",
        function($scope, $http, $routeParams) {
            console.log("survey-analytics => this is id", $routeParams.id);
        }
    ]);

})();
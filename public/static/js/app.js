var app = angular.module("GAP", ["ngRoute"]);

// for testing purpost, set authentication header
// must be removed before pull request
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQyNzA4YTk4NzRhZGNmNDA2N2ZhMDkiLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.vXTcAYsvAQFHKrZ1gBYYlrFXMijZjP0OvcKii4BcHl0";
}])

app.config(["$routeProvider", "$locationProvider",
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'static/pages/landingPage.html',
            controller: 'landingPageController'
        }).when('/signup', {
            templateUrl: 'static/pages/signupPage.html',
            controller: 'signupPageController'
        }).when('/signin', {
            templateUrl: 'static/pages/signinPage.html',
            controller: 'signinPageController'
        }).when('/surveys', {
            templateUrl: 'static/pages/surveysPage.html',
            controller: 'surveysPageController'
        }).when('/survey/:id/new', {   
            templateUrl: 'static/pages/surveyNewPage.html',
            controller: 'surveyNewPageController'
        }).when('/survey/:id/edit', {
            templateUrl: 'static/pages/surveyEditPage.html',
            controller: 'surveyEditPageController'
        }).when('/survey/:id/view', {
            templateUrl: 'static/pages/surveyViewPage.html',
            controller: 'surveyViewPageController'
        }).when('/survey/:id/analytics', {
            templateUrl: 'static/pages/surveyAnalyticsPage.html',
            controller: 'surveyAnalyticsPageController'
        }).otherwise({
            redirectTo: '/'
        });

        if(window.history && window.history.pushState){
    		$locationProvider.html5Mode(true);
  		}
    }
]);

app.controller("landingPageController", ["$scope", "$http",
    function($scope, $http) {
        
    }
]);

app.controller("signupPageController", ["$scope", "$http",
    function($scope, $http) {

    }
]);

app.controller("signinPageController", ["$scope", "$http",
    function($scope, $http){

    }
]);

app.controller("surveysPageController", ["$scope", "$http",
	function($scope, $http){
    $http.get("http://localhost:3000/api/surveys/").
      success(function(data){
        $scope.surveys = data.surveyList;
      }).
      error(function(data){
        console.log("error")
      });
	}
]);

app.controller("surveyNewPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
      $scope.survey = {};

      $scope.create = function(survey){
        // Form Validation - empty form should not be submitted
        if(!$scope.survey.title || $scope.survey.title === '') { return; }

        // POST Request to create a survey
        $http.post("http://localhost:3000/api/surveys", survey).
          success(function(data){
            console.log("success")

            // after a survey is successfully created,
            // title user has entered, should be removed
            $scope.survey = {};
          }).
          error(function(data){
            console.log("error")
          });
      }
    }
]);

app.controller("surveyEditPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
      // http://localhost:3000/api/surveys/54d1374ea0f09231943ee5d2
      $http.get("http://localhost:3000/api/surveys/" + $routeParams.id).
        success(function(data){
          $scope.survey = data.survey;
        }).
        error(function(data){
          console.log("error");
        });

      $scope.update = function(survey){
      }
    }
]);

app.controller("surveyViewPageController", ["$scope", "$http", "$routeParams", 
    function($scope, $http, $routeParams){
      // http://localhost:3000/api/surveys/54d1374ea0f09231943ee5d2
      $http.get("http://localhost:3000/api/surveys/" + $routeParams.id).
        success(function(data){
          $scope.survey = data.survey;
        }).
        error(function(data){
          console.log("error")
        });
    }
]);

app.controller("surveyAnalyticsPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
        console.log("survey-analytics => this is id", $routeParams.id);
    }
]);


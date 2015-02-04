var app = angular.module("GAP", ["ngRoute"]);

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

	}
]);

app.controller("surveyNewPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
        console.log("survey-new => this is id", $routeParams.id);
    }
]);

app.controller("surveyEditPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
        console.log("survey-edit => this is id", $routeParams.id);
    }
]);

app.controller("surveyViewPageController", ["$scope", "$http", "$routeParams", 
    function($scope, $http, $routeParams){
        console.log("survey-view => this is id", $routeParams.id);
    }
]);

app.controller("surveyAnalyticsPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams){
        console.log("survey-analytics => this is id", $routeParams.id);
    }
]);


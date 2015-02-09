var app = angular.module("GAP", ["ngRoute"]);

// for testing purpost, set authentication header
// must be removed before pull request
app.config(['$httpProvider',
    function($httpProvider) {
        //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQyNzA4YTk4NzRhZGNmNDA2N2ZhMDkiLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.vXTcAYsvAQFHKrZ1gBYYlrFXMijZjP0OvcKii4BcHl0
        $httpProvider.defaults.headers.common['Authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQ0ZjYxNDQwYTZhZmU1NjNiYzE4NDciLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.bFhPYq_8YDAAZJtdSdknYx0pf7QJfCay_8CVHa3IYOw";
    }
])

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

        if (window.history && window.history.pushState) {
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
    function($scope, $http) {

    }
]);

app.controller("surveysPageController", ["$scope", "$http",
    function($scope, $http) {
        $http.get("http://localhost:3000/api/surveys/").
        success(function(data) {
            $scope.surveys = data.surveyList;
        }).
        error(function(data) {
            console.log("error")
        });
    }
]);

app.controller("surveyNewPageController", ["$scope", "$http", "$routeParams", "ngTableParams", "$sce",
    function($scope, $http, $routeParams, ngTableParams, $sce) {
        $scope.survey = {};

        $scope.survey.formSetting = {
            nations: [],
            categories: [],
            indicies: []
        }

        $scope.addNation = function($event, nation) {
            $event.preventDefault();
            var addingNation = {};
            addingNation.name = nation;
            addingNation.index = $scope.survey.formSetting.nations.length;
            $scope.nation = "";

            $scope.survey.formSetting.nations.push(addingNation);
        }

        $scope.removeNation = function($index) {
            $scope.survey.formSetting.nations.splice($index, 1);
        }

        $scope.addCategory = function($event, category) {
            $event.preventDefault();
            var addingCategory = {};
            addingCategory.name = category;
            addingCategory.index = $scope.survey.formSetting.categories.length;
            $scope.category = "";

            $scope.survey.formSetting.categories.push(addingCategory);
        }

        $scope.removeCategory = function($index) {
            $scope.survey.formSetting.categories.splice($index, 1);
        }

        $scope.addIndex = function($event, index) {
            $event.preventDefault();
            var addingIndex = {};
            addingIndex.name = index;
            addingIndex.index = $scope.survey.formSetting.indicies.length;
            $scope.index = "";

            $scope.survey.formSetting.indicies.push(addingIndex);
        }

        $scope.removeIndex = function($index) {
            $scope.survey.formSetting.indicies.splice($index, 1);
        }

        $scope.create = function(survey) {
            // Form Validation - empty form should not be submitted
            // if(!$scope.survey.title || $scope.survey.title === '') { return; }

            // POST Request to create a survey
            $http.post("http://localhost:3000/api/surveys", survey).
            success(function(data) {
                console.log("success");
                // after a survey is successfully created,
                // title user has entered, should be removed
                $scope.survey = {};
                $scope.survey.formSetting = {
                    nations: [],
                    categories: [],
                    indicies: []
                };
            }).
            error(function(data) {
                console.log("error");
            });
        }

        $scope.selectedInputType = "";
        $scope.survey.items = [];

        $scope.inputTypes = [{
            value: "text",
            title: "input"
        }, {
            value: "email",
            title: "input[email]"
        }, {
            value: "url",
            title: "input[url]"
        }, {
            value: "date",
            title: "input[date]"
        }, {
            value: "textarea",
            title: "textarea"
        }, {
            value: "select",
            title: "select"
        }, {
            value: "checkbox",
            title: "checkbox"
        }];

        $scope.addQuestion = function(selectedInputType) {
            var addingItem = {
                section: "demographic",
                type: selectedInputType,
                options: [],
                required: false
            };
            $scope.survey.items.push(addingItem);
        }

        $scope.addOption = function(addingOption, $index, $event) {
            $event.preventDefault();
            $scope.survey.items[$index].options.push(addingOption);
        }

        $scope.submit = function() {
            console.log($scope.survey);
        }
    }
]);

app.controller("surveyEditPageController", ["$scope", "$http", "$routeParams",
    function($scope, $http, $routeParams) {
        // http://localhost:3000/api/surveys/54d1374ea0f09231943ee5d2
        $http.get("http://localhost:3000/api/surveys/" + $routeParams.id).
        success(function(data) {
            $scope.survey = data.survey;
        }).
        error(function(data) {
            console.log("error");
        });

        $scope.update = function(survey) {
            // PUT Request to update a survey
            $http.put("http://localhost:3000/api/surveys/" + $routeParams.id, survey).
            success(function(data) {
                console.log("success")
                // should implement event after successfully updated
            }).
            error(function(data) {
                console.log("error")
            });
        }
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
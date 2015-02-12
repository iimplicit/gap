(function() {
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
                controller: 'signinPageController',
                controllerAs: "vm"
            }).when('/surveys', {
                templateUrl: 'static/pages/surveysPage.html',
                controller: 'surveysPageController'
            }).when('/survey/new', {
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

    app.controller("surveyNewPageController", ["$scope", "$http", "$routeParams",
        function($scope, $http, $routeParams) {
            $scope.survey = {
                formSetting: {
                    nations: [],
                    categories: [],
                    indicies: []
                },
                items: {
                    demographic: [],
                    content: []
                }
            };

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

            $scope.fieldTypes = [{
                value: "grid",
                title: "grid"
            }];

            $scope.selectedfieldType = $scope.fieldTypes[0];

            $scope.addFieldType = function(selectedFieldType) {
                var addingItem = {
                    type: selectedFieldType,
                    scenario: "",
                    questions: [{
                        question: "",
                        responses: [{
                            name: "barely effective",
                            scores: {}
                        }, {
                            name: "soso effective",
                            scores: {}
                        }, {
                            name: "very effective",
                            scores: {}
                        }, ],
                        required: false
                    }],
                };
                $scope.survey.items.content.push(addingItem);
            }

            $scope.addResponse = function(question) {
                var addingResponse = {
                    name: "",
                    scores: {}
                };
                question.responses.push(addingResponse);
            }

            $scope.removeResponse = function(question, index) {
                question.responses.splice(index, 1);
            }

            // add receives parent scope object
            $scope.addQuestion = function(item) {
                var addingQuestion = {
                    question: "",
                    responses: [{
                        name: "barely effective",
                        scores: {}
                    }, {
                        name: "soso effective",
                        scores: {}
                    }, {
                        name: "very effective",
                        scores: {}
                    }, ],
                    required: false
                };
                item.questions.push(addingQuestion);
            }

            $scope.removeField = function($index) {
                $scope.survey.items.content.splice($index, 1);
            }

            // remove receives parent scope object and parent scope object's $index
            $scope.removeQuestion = function(item, $index) {
                item.questions.splice($index, 1);
            }

            $scope.addScore = function(response, indexName, score) {
                response.scores[indexName] = score;
            }

            $scope.addDemoQuestion = function(selectedInputType) {
                var addingItem = {
                    type: selectedInputType,
                    options: [],
                    required: false
                };
                $scope.survey.items.demographic.push(addingItem);
            }

            $scope.addOption = function(addingOption, $index, $event) {
                $event.preventDefault();
                $scope.survey.items.demographic[$index].options.push(addingOption);
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

})();
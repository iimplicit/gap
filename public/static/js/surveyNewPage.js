/**
/* surveyNewPage.js
 */
(function() {
	var app = angular.module("GAP");

  app.controller("surveyNewPageController", ["$scope", "$http", "$routeParams", "$window",
        function($scope, $http, $routeParams, $window) {
            var nw = this;

            $scope.initSurvey = function(){
              emptySurvey = {
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

              return emptySurvey;
            }

            $scope.survey = $scope.initSurvey();

            $scope.categoryInput = "";

            nw.addNation = function(nationInput) {
                nw.nationInput = "";
                var addingNation = {};
                addingNation.name = nationInput;
                addingNation.index = $scope.survey.formSetting.nations.length;
                $scope.survey.formSetting.nations.push(addingNation);
            }

            $scope.removeNation = function($index) {
                $scope.survey.formSetting.nations.splice($index, 1);
            }

            nw.addCategory = function(categoryInput) {
                nw.categoryInput = "";
                var addingCategory = {};
                addingCategory.name = categoryInput;
                addingCategory.index = $scope.survey.formSetting.categories.length;
                $scope.survey.formSetting.categories.push(addingCategory);
            }

            $scope.removeCategory = function($index) {
                $scope.survey.formSetting.categories.splice($index, 1);
            }

            nw.addIndex = function(indexInput) {
                nw.indexInput = "";
                var addingIndex = {};
                addingIndex.name = indexInput;
                addingIndex.index = $scope.survey.formSetting.indicies.length;
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
                    $window.location.href = "/#/surveys";
                    $scope.survey = $scope.initSurvey();
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

            $scope.checkInput = function (inputType) {
                return $scope.survey.formSetting[inputType].length === 0;
            }
        }
    ]);

    app.controller("surveyEditPageController", ["$scope", "$http", "$routeParams", "$window",
        function($scope, $http, $routeParams, $window) {
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
                    $window.location.href = "/#/surveys";
                    $scope.survey = $scope.initSurvey();
                }).
                error(function(data) {
                    console.log("error")
                });
            }

            $scope.initSurvey = function(){
              emptySurvey = {
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

              return emptySurvey;
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
})();

/**
/*	surveyPage.js
 */
(function() {
    "use strict";
    var app = angular.module("GAP");

    app.factory("SurveyFactory", function SurveyFactory($http, API_URL, AuthTokenFactory, $q) {
        "use strict";
        return {
            readSurveys: readSurveys,
            deleteSurvey: deleteSurvey,
            readSurvey: readSurvey,
            submitSurvey: submitSurvey
        };

        function readSurveys() {
            if (AuthTokenFactory.getToken()) {
                return $http.get(API_URL + "/surveys");
            } else {
                return $q.reject({
                    data: "valid token required"
                });
            }
        }

        function deleteSurvey(surveyId) {
            if (confirm("Do you really want to delete the survey?")) {
                if (AuthTokenFactory.getToken()) {
                    return $http.delete(API_URL + "/surveys/" + surveyId);
                } else {
                    return $q.reject({
                        data: "valid token required"
                    });
                }
            } else {
                return $q.reject({
                    data: "not decided to delete the survey"
                });
            }
        }

        function readSurvey(surveyId) {
            if (AuthTokenFactory.getToken()) {
                return $http.get("http://localhost:3000/api/surveys/" + surveyId);
            } else {
                return $q.reject({
                    data: "valid token required"
                });
            }
        }

        function submitSurvey(survey) {
            if (AuthTokenFactory.getToken()) {
                return $http.post("http://localhost:3000/api/surveys/" + surveyId, survey).then(function success(response) {
                    return response;
                });
            } else {
                return $q.reject({
                    data: "valid token required"
                });
            }
        }
    });

    app.controller("surveysPageController", ["SurveyFactory", "$scope", "$window", "$http",
        function(SurveyFactory, $scope, $window, $http) {
            SurveyFactory.readSurveys().then(function(data) {
                $scope.surveys = data.data.surveyList;
            }, function(response) {
                console.log(response.data);
            });

            $scope.deleteSurvey = function(surveyId, $index) {
                SurveyFactory.deleteSurvey(surveyId).then(function(response) {
                    $scope.surveys.splice($index, 1);
                    console.log("delete successful");
                }, function(response) {
                    console.log(data);
                });
            }

            $scope.copySurvey = function(survey){
                var addingSurvey = {
                    title: survey.title + " - copy",
                    description: survey.description,
                    formSetting: survey.formSetting,
                    items: survey.items
                };

                $http.post("http://localhost:3000/api/surveys", addingSurvey).
                success(function(data){
                    $window.location.reload();
                }).
                error(function(data){
                    console.log("error");
                });
            }
        }
    ]);
})();

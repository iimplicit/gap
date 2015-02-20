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
            submitSurvey: submitSurvey,
            downloadSurvey: downloadSurvey
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

        // *** SurveyFactory.readSurvey:
        //          this function brings one survey info from the server
        //          unlike other methods, this method does not require token since it is needed
        //          that anonymous users can access to this survey without tokens
        function readSurvey(surveyId) {
            return $http.get(API_URL + "/surveys/" + surveyId);
        }

        function submitSurvey(surveyId, submittingResult) {
            if (AuthTokenFactory.getToken()) {
                return $http.post("http://gap.geec.info:3000/api/surveys/submit/" + surveyId, submittingResult).then(function success(response) {
                    return response;
                });
            } else {
                return $q.reject({
                    data: "valid token required"
                });
            }
        }

        function downloadSurvey(surveyId) {
            if (AuthTokenFactory.getToken()) {
                return $http.get("http://gap.geec.info:3000/api/surveys/" + surveyId + "/export");
            } else {
                return $q.reject({
                    data: "valid token required"
                });
            }
        }
    });

    app.controller("surveysPageController", ["SurveyFactory", "$scope", "$window", "$http",
        function(SurveyFactory, $scope, $window, $http) {
            $scope.sortingOrder = "updatedAt";
            $scope.reverse = true;

            SurveyFactory.readSurveys().then(function(data) {
                $scope.surveys = data.data.surveyList;
                console.log(data);
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

            $scope.copySurvey = function(survey) {
                $http.post("http://gap.geec.info:3000/api/surveys/" + survey._id + "/copy").
                success(function(data) {
                    $window.location.reload();
                }).
                error(function(data) {
                    console.log("error");
                });
            }

            // *** SurveyFactory.downloadFile:
            //          this function uses blob object to download file from the server
            //          refer to this document for further study
            //          downloading part comes from surveyFactory, while generating url
            //          is done by blob object
            //          https://developer.mozilla.org/ko/docs/Web/API/Blob
            $scope.downloadFile = function(surveyId) {
                SurveyFactory.downloadSurvey(surveyId).then(function(response){
                    var file = new Blob([response.data], {
                        type: 'application/csv'
                    });
                    var fileURL = URL.createObjectURL(file);
                    var a = document.createElement('a');
                    a.href = fileURL;
                    a.target = '_blank';
                    a.download = surveyId + '.csv';
                    document.body.appendChild(a);
                    a.click();
                }, function(response){
                    console.log("error", response.data);
                });
            }

            $scope.sortBy = function(sortingOrder) {
                if($scope.sortingOrder === sortingOrder) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.sortingOrder = sortingOrder;    
                }
            }
        }
    ]);
})();
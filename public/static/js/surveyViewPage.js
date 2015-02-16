/**
/* surveyViewPage.js
 */
(function() {
    var app = angular.module("GAP");

    app.controller("surveyViewPageController", ["$injector", "$routeParams", "SurveyFactory", "$q",
        function($injector, $routeParams, SurveyFactory, $q) {
            var view = this;

            var surveyId = $routeParams.id;

            view.currentIndex = 0;

            var deffered = $q.defer();
            var promise = deffered.promise;

            // *** promise:
            //          this promise is to solve async problems of http request
            //          when SurveyFactory.readSurvey (line: 43) receives response from the server
            //          and deffered object resolves the deffered, then this promise get fired
            promise.then(function(response) {
                view.submittingItem = {
                    surveyReply: [],
                    demographic: []
                }

                for (var i = 0; i < view.survey.items.demographic.length; i++) {
                    view.submittingItem.demographic.push({
                        type: "",
                        value: ""
                    });
                }

                view.survey.items.content.forEach(function(item, index){
                    view.survey.items.content[index].questions.forEach(function(){
                        view.submittingItem.surveyReply.push("");
                    })
                });
            }, function(response) {

            });

            // *** SurveyFactory.readSurvey:
            //          as stated above, controller has dependency on SurverFactory
            //          here we call readSurvey function of SurveyFactory object
            //          you can refer to readSurvey in surveysPage.js file
            SurveyFactory.readSurvey(surveyId).then(function(response) {
                view.survey = response.data.survey;
                view.pageLength = 1 + view.survey.items.content.length;
                view.progress = Math.floor((view.currentIndex / view.pageLength) * 100);
                console.log(view.survey);
                deffered.resolve({
                    data: "receive succeeded"
                });
            }, function(response) {
                deffered.reject({
                    data: "receive failed"
                });
            });

            // *** goNext: 
            //          after error check, add one to view.currentIndex
            //          if view.currentIndex reaches view.pageLength, confirm user intent to continue
            //          and if confirmed, send servey result to the server 
            view.goNext = function() {
                if (view.currentIndex < view.pageLength - 1) {
                    view.currentIndex++;
                    view.progress = Math.floor((view.currentIndex / view.pageLength) * 100);
                } else {
                    if (confirm("Would you like to submit your survey?")) {
                        SurveyFactory.submitSurvey(surveyId, view.submittingItem).then(function(response){
                            console.log("submit succesful", response);
                        }, function(response){
                            console.log("submit failed", response);
                        });
                        view.currentIndex++;
                        view.progress = Math.floor((view.currentIndex / view.pageLength) * 100);
                    } else {
                        return;
                    }
                }
            }

            // *** goPrev: 
            //          after error check, subtracts one from view.currentIndex
            view.goPrev = function() {
                if (view.currentIndex > 0) {
                    view.currentIndex--;
                    view.progress = Math.floor((view.currentIndex / view.pageLength) * 100);
                }
            }

            // *** answerGird: 
            //          receives scenarioNumber, questionNumber, responseNumber, answer variables
            //          when ngChange is executed from input radio button
            //          after receiving, for loop checks answer's location within one dimensional array
            //          after calculating indexCount, puts responseNumber into the array        
            view.answerGrid = function(scenarioNumber, questionNumber, responseNumber, answer) {
                var indexCount = 0;
                view.survey.items.content.forEach(function(item, firstIndex){
                    view.survey.items.content[firstIndex].questions.forEach(function(item, secondIndex){
                        indexCount++;
                        if(firstIndex === scenarioNumber && secondIndex === questionNumber) {
                            view.submittingItem.surveyReply[indexCount-1] = responseNumber + "";    
                        }
                    })
                });
            }
        }
    ]);
})();
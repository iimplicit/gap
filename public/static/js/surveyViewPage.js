/**
/* surveyViewPage.js
 */
(function() {
    var app = angular.module("GAP");

    // app.factory("ViewFactory", function ViewFactory() {
    // 	return {
    // 		goNext: goNext,
    // 		goPrev: goPrev
    // 	}

    // 	function goNext(currentIndex){
    // 		if(currentIndex > 0){
    // 			return currentIndex++;
    // 		}
    // 	}

    // 	function goPrev(currentIndex){
    // 		if(currentIndex < 0){
    // 			return currentIndex--;
    // 		}
    // 	}
    // });

    app.controller("surveyViewPageController", ["$injector", "$routeParams", "SurveyFactory",
        function($injector, $routeParams, SurveyFactory) {
            var view = this;

            var surveyId = $routeParams.id;

            view.currentIndex = 0;

            SurveyFactory.readSurvey(surveyId).then(function(response) {
                view.survey = response.data.survey;
                view.pageLength = 1 + view.survey.items.content.length;
                view.progress = Math.floor((view.currentIndex / view.pageLength ) * 100);
                console.log(view.survey);
                console.log(view.progress);
            }, function(response) {
                console.log(response.data);
            });

			view.goNext = function(){
				if(view.currentIndex < view.pageLength - 1) {
					view.currentIndex++;
					view.progress = Math.floor((view.currentIndex / view.pageLength ) * 100);
				} else {
					if(confirm("Would you like to submit your survey?")) {
						view.currentIndex++;
						view.progress = Math.floor((view.currentIndex / view.pageLength ) * 100);
					} else {
						return;
					}
				}
			}

			view.goPrev = function(){
				if(view.currentIndex > 0) {
					view.currentIndex--;
					view.progress = Math.floor((view.currentIndex / view.pageLength ) * 100);
				}
			}
        }
    ]);
})();
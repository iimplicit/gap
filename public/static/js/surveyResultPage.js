/**
/* surveyResultPage.js by Sungpil Nam
 */

(function(){
	var app = angular.module("GAP");

	app.controller("surveyResultPageController", ["SurveyResultFactory", "$routeParams", function(SurveyResultFactory, $routeParams){
		var result = this;

		var surveyId = $routeParams.id;

		result.data = SurveyResultFactory.getResult(surveyId);
		result.data.categories.push({name: "Total"});
		console.log(result.data);
	}]);
})();
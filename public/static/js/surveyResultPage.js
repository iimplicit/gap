/**
/* surveyResultPage.js by Sungpil Nam
 */

(function(){
	var app = angular.module("GAP");

	app.controller("surveyResultPageController", ["SurveyResultFactory", "$routeParams", "$scope",function(SurveyResultFactory, $routeParams, $scope){
		var result = this;

		var surveyId = $routeParams.id;

		result.data = SurveyResultFactory.getResult(surveyId);
		result.data.categories.push({name: "Total"});

		console.log(result.data);

        // ready data for nation chart

        var nationSeries = [];
        var categories = Object.keys(result.data.result[0][0]);

        var chartValues = result.data.result;
        var lastIdx = chartValues.length - 1;
        var totalValues = chartValues[lastIdx];

        for(var key in result.data.nations) {
            var i = result.data.nations[key];
            var element = {};
            element.pointPlacement = 'on';
            element.name = i.name;

            element.data = [];
            var oneValue = totalValues[key];
            for(var k =0; k<categories.length; k++){
                element.data.push(oneValue[categories[k]]);
            }
            console.log('element.data', element.data);
            nationSeries.push(element);
        }
        console.log('categories', categories);
        console.log('nationSeries', nationSeries);

        // ready data for category chart

        var categoriesSeries = [];

        for(var key=0; key<result.data.categories.length-1; key++) {
            var i = result.data.categories[key];
            var element = {};
            element.pointPlacement = 'on';
            element.name = i.name;

            element.data = [];
            var oneValue = result.data.result[key];
            for(var k =0; k<categories.length; k++){
                element.data.push(oneValue[oneValue.length-1][categories[k]]);
            }

            console.log('element.data', element.data);
            categoriesSeries.push(element);
        }

        console.log('categoriesSeries', categoriesSeries);

        // draw highchart for nation
        $('#nationsChartContainer').highcharts({

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Total Score per Nation',
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: nationSeries

        });

        // draw highchart for category
        $('#categoriesChartContainer').highcharts({

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Total Score per Cateogory',
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: categoriesSeries

        });

	}]);

})();

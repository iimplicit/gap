/** 
/* common.js
 */
(function() {
    "use strict";
    var app = angular.module("GAP", ["ngRoute", "ngMessages", "ngCookies"]);

    app.constant("API_URL", "http://localhost:3000/api");

    app.config(["$httpProvider",
        function($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        }
    ]);

    app.config(["$routeProvider", "$locationProvider",
        function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'static/pages/landingPage.html',
                controller: 'landingPageController'
            }).when('/signup', {
                templateUrl: 'static/pages/signupPage.html',
                controller: 'signupPageController',
                controllerAs: "cr"
            }).when('/signin', {
                templateUrl: 'static/pages/signinPage.html',
                controller: 'signinPageController',
                controllerAs: "vm"
            }).when('/surveys', {
                templateUrl: 'static/pages/surveysPage.html',
                controller: 'surveysPageController'
            }).when('/survey/new', {
                templateUrl: 'static/pages/surveyNewPage.html',
                controller: 'surveyNewPageController',
                controllerAs: "nw"
            }).when('/survey/:id/edit', {
                templateUrl: 'static/pages/surveyEditPage.html',
                controller: 'surveyEditPageController'
            }).when('/survey/:id/view', {
                templateUrl: 'static/pages/surveyViewPage.html',
                controller: 'surveyViewPageController',
                controllerAs: "view"
            }).when('/survey/:id/view/result', {
                templateUrl: 'static/pages/surveyResultPage.html',
                controller: 'surveyResultPageController',
                controllerAs: "result"
            }).when('/survey/:id/analytics', {
                templateUrl: 'static/pages/surveyAnalyticsPage.html',
                controller: 'surveyAnalyticsPageController'
            }).otherwise({
                redirectTo: '/'
            });
        }
    ]);

    app.run(['$rootScope', '$location', "AuthTokenFactory",
        function($rootScope, $location, AuthTokenFactory) {
            $rootScope.$on('$routeChangeStart', function(event, curr, prev) {
                // if (!AuthTokenFactory.getToken()) {
                //     console.log("no token");
                //     $location.path('/signin');
                // } 
            });
        }
    ]);

    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'use strict';
        var store = $window.localStorage;
        var tokenKey = 'auth-token';
        var userKey = "username";

        return {
            getToken: getToken,
            setToken: setToken,
            setUsername: setUsername
        };

        function getToken() {
            return store.getItem(tokenKey);
        }

        function setToken(token) {
            if (token) {
                store.setItem(tokenKey, token);
            } else {
                store.removeItem(tokenKey);
            }
        }

        function setUsername(username) {
            if (username) {
                store.setItem(userKey, username);
            } else {
                store.removeItem(userKey);
            }
        }
    });

    app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
        'use strict';
        return {
            request: addToken
        };

        function addToken(config) {
            var token = AuthTokenFactory.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    });

    app.factory("SurveyResultFactory", function SurveyResult($cookieStore){
        "use strict";
        return {
            setResult: setResult,
            getResult: getResult
        }

        function setResult(surveyId, surveyResult) {
            $cookieStore.put(surveyId, surveyResult);
        }

        function getResult(surveyId) {
            return $cookieStore.get(surveyId);   
        }               
    });

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
})();

/**
/* signinPage.js
 */

    var app = angular.module("GAP");

    app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q) {
        'use strict';
        return {
            userSignin: userSignin,
            userSignout: userSignout
        };

        function userSignin(username, password) {
            return $http.post(API_URL + '/login', {
                username: username,
                password: password
            }).then(function success(response) {
                AuthTokenFactory.setToken(response.data.token);
                return response;
            });
        }

        function userSignout() {
            AuthTokenFactory.setToken();
        }
    });

    app.controller("signinPageController", ["UserFactory", "$scope", "$window",
        function(UserFactory, $scope, $window) {
        	vm = this;

            vm.userSignin = function(username, password) {
                UserFactory.userSignin(username, password).then(function(response){
                	alert("Signin Successful");
                	$window.location.href = "/#/surveys/";
                }, function(response){
                	alert(response);
                });
            }
        }
    ]);

/**
/* signinPage.js
 */
(function() {
    var app = angular.module("GAP");

    app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q, $location, $window) {
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
                console.log(response);
                AuthTokenFactory.setToken(response.data.token);
                return response;
            });
        }

        function userSignout() {
            AuthTokenFactory.setToken();
            AuthTokenFactory.setUsername();
            $location.path("/");
            $window.location.reload();
        }
    });

    app.controller("signinPageController", ["UserFactory", "$scope", "$window", "$location",
        function(UserFactory, $scope, $window, $location) {
            vm = this;

            vm.userSignin = function(username, password) {
                UserFactory.userSignin(username, password).then(function(response) {
                    // plan to refactor by getting username from server response
                    alert("Signin Successful");
                    $location.path("/surveys");
                    $window.location.reload();
                    var store = $window.localStorage;
                    store.setItem("username", username);
                }, function(response) {
                    console.log("signin failed", response);
                });
            }
        }
    ]);
})();
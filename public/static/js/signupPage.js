/**
 * Created by Phangji on 2/12/15.
 */
var app = angular.module("GAP");

app.factory('UserCreateFactory', function UserCreateFactory($http, API_URL, AuthTokenFactory, $q) {
    'use strict';
    return {
        userSignup: userSignup
    };

    function userSignup(username, password, email) {
        return $http.post(API_URL + '/users', {
            username: username,
            password: password,
            email: email
        }).then(function success(response) {
            //AuthTokenFactory.setToken(response.data.token); //?
            return response;
        });
    }
});

app.controller("signupPageController", ["UserCreateFactory", "$scope", "$window",
    function(UserCreateFactory, $scope, $window) {
        cr = this;

        cr.userSignup = function(username, password, email) {
            UserCreateFactory.userSignup(username, password, email).then(function(response){
                alert("Signup Successful");
                $window.location.href = "/#/users/signin";
            }, function(response){
                alert(response);
            });
        }
    }
]);
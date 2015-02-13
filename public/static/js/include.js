/** 
/* include.js
 */
(function() {
    "use strict";
    var app = angular.module("GAP");

    app.factory("NavbarFactory", function NavbarFactory($window, AuthTokenFactory, UserFactory) {
        return {
            checkUserStatus: checkUserStatus,
            userSignout: userSignout
        }

        function checkUserStatus() {
            if(AuthTokenFactory.getToken()){
                var key = "username"
                var store = $window.localStorage;
                return store.getItem(key);    
            } else {
                return undefined;
            }
        }

        function userSignout() {
            UserFactory.userSignout();
        }
    });

    app.controller("navbarController", ["NavbarFactory", "$scope", "AuthTokenFactory",
        function(NavbarFactory, AuthTokenFactory, $scope) {
            var nav = this;

            nav.username = NavbarFactory.checkUserStatus();

            nav.userSignout = function(){
                NavbarFactory.userSignout();   
            }
        }
    ]);
})();
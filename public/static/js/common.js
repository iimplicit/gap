/** 
/* common.js
 */
(function() {
    "use strict";
    var app = angular.module("GAP");

    app.constant("API_URL", "http://localhost:3000/api");

    app.config(["$httpProvider",
        function($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        }
    ]);

    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'use strict';
        var store = $window.localStorage;
        var key = 'auth-token';

        return {
            getToken: getToken,
            setToken: setToken
        };

        function getToken() {
            return store.getItem(key);
        }

        function setToken(token) {
            if (token) {
                store.setItem(key, token);
            } else {
                store.removeItem(key);
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
})();
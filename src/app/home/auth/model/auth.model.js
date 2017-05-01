/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.auth')
        .factory('authModel', authModel);

    /** @ngInject */
    function authModel(CONFIG, $localStorage, $resource, $http, $q) {
        var user = null;
        return {
            getToken: function () {
                if ($localStorage.token) {
                    return true
                }
                return false;
            },
            getUser: function () {
                var deferred = $q.defer();

                if (user) {
                    deferred.resolve(user);
                }

                else {
                    // user = $resource('api/authenticatedUser/:user', {user: "@user"}).get()
                    user = $resource(CONFIG.url + '/api/authenticateduser/:user', {user: "@user"}).get()
                    deferred.resolve(user);

                }

                return deferred.promise;

            }
        }


    }
})();

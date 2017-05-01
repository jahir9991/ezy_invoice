'use strict';

angular.module('InvoiceAdmin', [

    'ngStorage',
    'angular-jwt',
    'ngDialog',
    'ui.bootstrap',
    'ui.select',
    // 'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    "xeditable",
    'ui.slimscroll',
    // 'ngJsTree',
    'angular-progress-button-styles',

    'ngAnimate',

    'InvoiceAdmin.theme',
    'InvoiceAdmin.home',
    'moment-picker'
]);
angular.module('InvoiceAdmin')
    .constant("CONFIG", {
        "url": "http://localhost:8000"
        // "url": ""
    });
angular.module('InvoiceAdmin')
    .constant("token", {});

angular.module('InvoiceAdmin')
    .config(function (uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.resetSearchInput = true;
        uiSelectConfig.appendToBody = true;
    });
angular.module('InvoiceAdmin')
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

angular.module('InvoiceAdmin')
    .config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: true,
            containerId: 'toast-container',
            maxOpened: 0,
            progressBar: true,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
    });


angular.module('InvoiceAdmin')
    .run(function ($rootScope, $state, $localStorage, editableOptions, editableThemes) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            // if (toState.authenticate && !AuthService.isAuthenticated()){
            if (toState.authenticate && !$localStorage.token) {
                // User isn’t authenticated
                $state.transitionTo("auth");
                event.preventDefault();
            }
            if (!toState.authenticate && $localStorage.token) {
                event.preventDefault();
            }

        });

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-success btn-with-icon" ><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-danger btn-with-icon"><i class="ion-close-round"></i></button>';
        // App is loading so auto-set isAppLoading and start a timer


    });

angular.module('InvoiceAdmin')
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/auth');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    });

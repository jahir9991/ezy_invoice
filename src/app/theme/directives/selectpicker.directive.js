/**
 * @author v.lugovksy
 * created on 16.12.2015
 * @deprecated
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin')
        .directive('selectpicker', selectpicker);

    /** @ngInject */
    function selectpicker() {
        return {
            restrict: 'A',
            require: ['?ngOptions', '?ngSelectss'],
            priority: 1500, // make priority bigger than ngOptions and ngRepeat
            link: {
                pre: function (scope, elem, attrs) {

                    elem.append('<option disabled="false" value="">' + (attrs.title || 'Select something') + '</option>')


                },
                post: function (scope, elem, attrs) {
                    function refresh() {
                        elem.selectpicker('refresh');
                    }

                    if (attrs.ngModel) {
                        scope.$watch(attrs.ngModel, refresh);
                    }

                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, refresh);
                    }
                    if (attrs.ngSelectss) {
                        scope.$watch(attrs.ngSelectss, refresh);

                    }


                    elem.selectpicker({
                        dropupAuto: true, hideDisabled: attrs.dis
                    });
                }
            }
        };
    }


})();


/**
 * Based on: http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
 * Usage:
 * focus-me="shouldSetFocus" <!-- value to watch for focus state -->
 * focus-me-readonly <!-- use attribute for not changing the model on blur -->
 */



(function() {
    'use strict';
    angular.module('focus-me', [])
        .directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
            return {
                //scope: true,   // optionally create a child scope
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.focusMe);
                    scope.$watch(model, function(value) {
                        if(value === true) {
                            $timeout(function() {
                                element[0].focus();
                            });
                        }
                    });
                    // to address @blesh's comment, set attribute value to 'false'
                    // on blur event:
                    element.bind('blur', function() {
                        if (!_.isUndefined(attrs.focusMeReadonly)) { return; }
                        scope.$apply(model.assign(scope, false));
                    });
                }
            };
        }]);
})();

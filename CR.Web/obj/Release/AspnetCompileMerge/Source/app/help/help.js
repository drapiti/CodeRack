(function () {
    'use strict';
    var controllerId = 'help';
    angular.module('app').controller(controllerId, ['common', help]);

    function help(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Help';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Help View'); });
        }
    }
})();
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'hardware';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', hardware]);

    function hardware($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.hardware = [];
        vm.hardwareCount = 0;
        vm.hardwareFilteredCount = 0;
        vm.search = search;
        vm.hardwareSearch = $routeParams.search || '';
        vm.gotoHardware = gotoHardware;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Hardware';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.hardwareFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getHardware(), controllerId)
                .then(function () {
                    log('Activated Hardware View');
                });
        }

        function getHardwareCount() {
            return datacontext.hardware.getCount().then(function (data) {
                return vm.hardwareCount = data;
            });
        }

        function getHardwareFilteredCount() {
            vm.hardwareFilteredCount = datacontext.hardware.getFilteredCount(vm.hardwareearch);
        }

        function getHardware(forceRefresh) {
            return datacontext.hardware.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.hardwareSearch)
                .then(
                    function (data) {
                        vm.hardware = data;
                        getHardwareFilteredCount();
                        if (!vm.hardwareCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getHardwareCount();
                        }
                        return data;
                    }
                );
        }

        function gotoHardware(hardware) {
            if (hardware && hardware.id) {
                $location.path('/hardware/' + hardware.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getHardware();
        }

        function refresh() { getHardware(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.hardwareSearch = '';
            }
            getHardware();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
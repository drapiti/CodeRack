(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'ports';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', ports]);

    function ports($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.ports = [];
        vm.portCount = 0;
        vm.portFilteredCount = 0;
        vm.search = search;
        vm.portSearch = $routeParams.search || '';
        vm.gotoPort = gotoPort;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Active Links';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.portFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getPorts(), controllerId)
                .then(function () {
                    log('Activated Active Links View');
                });
        }

        function getPortCount() {
            return datacontext.port.getCount().then(function (data) {
                return vm.portCount = data;
            });
        }

        function getPortFilteredCount() {
            vm.portFilteredCount = datacontext.port.getFilteredCount(vm.portSearch);
        }

        function getPorts(forceRefresh) {
            return datacontext.port.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.portSearch)
                .then(
                    function (data) {
                        vm.ports = data;
                        getPortFilteredCount();
                        if (!vm.portCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getPortCount();
                        }
                        return data;
                    }
                );
        }

        function gotoPort(port) {
            if (port && port.id) {
                $location.path('/port/' + port.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getPorts();
        }

        function refresh() { getPorts(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.portSearch = '';
            }
            getPorts();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
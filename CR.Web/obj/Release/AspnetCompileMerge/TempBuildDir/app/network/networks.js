(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'networks';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', networks]);

    function networks($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.networks = [];
        vm.networkCount = 0;
        vm.networkFilteredCount = 0;
        vm.search = search;
        vm.networkSearch = $routeParams.search || '';
        vm.gotoNetwork = gotoNetwork;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Networks';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.networkFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getNetworks(), controllerId)
                .then(function () {
                    log('Activated Network View');
                });
        }

        function getNetworkCount() {
            return datacontext.network.getCount().then(function (data) {
                return vm.networkCount = data;
            });
        }

        function getNetworkFilteredCount() {
            vm.networkFilteredCount = datacontext.network.getFilteredCount(vm.networkSearch);
        }

        function getNetworks(forceRefresh) {
            return datacontext.network.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.networkSearch)
                .then(
                    function (data) {
                        vm.networks = data;
                        getNetworkFilteredCount();
                        if (!vm.networkCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getNetworkCount();
                        }
                        return data;
                    }
                );
        }

        function gotoNetwork(network) {
            if (network && network.id) {
                $location.path('/network/' + network.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getNetworks();
        }

        function refresh() { getNetworks(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.networkSearch = '';
            }
            getNetworks();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
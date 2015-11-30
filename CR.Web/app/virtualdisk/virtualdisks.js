(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'virtualdisks';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', virtualdisks]);

    function virtualdisks($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.virtualDisks = [];
        vm.diskCount = 0;
        vm.diskFilteredCount = 0;
        vm.search = search;
        vm.diskSearch = $routeParams.search || '';
        vm.gotoDisk = gotoDisk;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Virtual Disks';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.diskFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getDisks(), controllerId)
                .then(function () {
                    log('Activated Virtual Disk View');
                });
        }

        function getDiskCount() {
            return datacontext.virtualdisk.getCount().then(function (data) {
                return vm.diskCount = data;
            });
        }

        function getDiskFilteredCount() {
            vm.diskFilteredCount = datacontext.virtualdisk.getFilteredCount(vm.diskSearch);
        }

        function getDisks(forceRefresh) {
            return datacontext.virtualdisk.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.diskSearch)
                .then(
                    function (data) {
                        vm.virtualDisks = data;
                        getDiskFilteredCount();
                        if (!vm.diskCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getDiskCount();
                        }
                        return data;
                    }
                );
        }

        function gotoDisk(virtualDisk) {
            if (virtualDisk && virtualDisk.id) {
                $location.path('/virtualdisk/' + virtualDisk.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getDisks();
        }

        function refresh() { getLuns(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.diskSearch = '';
            }
            getDisks();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'luns';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', luns]);

    function luns($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.luns = [];
        vm.lunCount = 0;
        vm.lunFilteredCount = 0;
        vm.search = search;
        vm.lunSearch = $routeParams.search || '';
        vm.gotoLun = gotoLun;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Storage Area Network LUNs';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.lunFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getLuns(), controllerId)
                .then(function () {
                    log('Activated LUN Storage View');
                });
        }

        function getLunCount() {
            return datacontext.lun.getCount().then(function (data) {
                return vm.lunCount = data;
            });
        }

        function getLunFilteredCount() {
            vm.lunFilteredCount = datacontext.lun.getFilteredCount(vm.lunSearch);
        }

        function getLuns(forceRefresh) {
            return datacontext.lun.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.lunSearch)
                .then(
                    function (data) {
                        vm.luns = data;
                        getLunFilteredCount();
                        if (!vm.lunCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getLunCount();
                        }
                        return data;
                    }
                );
        }

        function gotoLun(lun) {
            if (lun && lun.id) {
                $location.path('/lun/' + lun.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getLuns();
        }

        function refresh() { getLuns(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.lunSearch = '';
            }
            getLuns();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
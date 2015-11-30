(function() {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'farmobjects';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', farmObjects]);

    function farmObjects($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.farmobjects = [];
        vm.farmobjectCount = 0;
        vm.farmobjectFilteredCount = 0;
        vm.search = search;
        vm.farmobjectSearch = $routeParams.search || '';
        vm.gotoFarmObject = gotoFarmObject;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Farm Objects';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function() {
                return Math.floor(vm.farmobjectFilteredCount / vm.paging.pageSize) + 1;
            }
        });
    
        activate();

        function activate() {    
                common.activateController(getFarmObjects(), controllerId)
                     .then(function () { log('Activated Farm Object View'); });            
        }

        function getFarmObjectCount() {
            return datacontext.farmobject.getCount().then(function(data) {
                return vm.farmobjectCount = data;
            });
        }

        function getFarmObjectFilteredCount() {
            vm.farmobjectFilteredCount = datacontext.farmobject.getFilteredCount(vm.farmobjectSearch);
        }

        function getFarmObjects(forceRefresh) {
            return datacontext.farmobject.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.farmobjectSearch)
                .then(
                    function(data) {
                        vm.farmobjects = data;
                        getFarmObjectFilteredCount();
                        if (!vm.farmobjectCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getFarmObjectCount();
                        }                        
                        return data;
                    }
                );
        }

        function gotoFarmObject(farmobject) {
            if (farmobject && farmobject.id) {
                $location.path('/farmobject/' + farmobject.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getFarmObjects();
        }

        function refresh() { getFarmObjects(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.farmobjectSearch = '';
            }
            getFarmObjects();
        }
    }
})();
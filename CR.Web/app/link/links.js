(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'links';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', links]);

    function links($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.links = [];
        vm.linkCount = 0;
        vm.linkFilteredCount = 0;
        vm.search = search;
        vm.linkSearch = $routeParams.search || '';
        vm.gotoLink = gotoLink;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Provision Links';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.linkFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        //if (auth.isAuthenticated)
            activate();

        function activate() {
            common.activateController(getLinks(), controllerId)
                .then(function () {
                    log('Activated Provision Links View');
                });
        }

        function getLinkCount() {
            return datacontext.link.getCount().then(function (data) {
                return vm.linkCount = data;
            });
        }

        function getLinkFilteredCount() {
            vm.linkFilteredCount = datacontext.link.getFilteredCount(vm.linkSearch);
        }

        function getLinks(forceRefresh) {
            return datacontext.link.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.linkSearch)
                .then(
                    function (data) {
                        vm.links = data;
                        getLinkFilteredCount();
                        if (!vm.linkCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getLinkCount();
                        }
                        return data;
                    }
                );
        }

        function gotoLink(link) {
            if (link && link.id) {
                $location.path('/link/' + link.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getLinks();
        }

        function refresh() { getLinks(true); }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.linkSearch = '';
            }
            getLinks();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
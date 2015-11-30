(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'reservations';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
    ['$location', '$routeParams', 'common', 'config', 'datacontext', reservations]);

    function reservations($location, $routeParams, common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.  
        vm.reservations = [];
        vm.reservationCount = 0;
        vm.reservationFilteredCount = 0;
        vm.search = search;
        vm.reservationSearch = $routeParams.search || '';
        vm.gotoReservation = gotoReservation;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.refresh = refresh;
        vm.title = 'Reservations';
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.reservationFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController(getReservations(), controllerId)
                .then(function () {
                    log('Activated Reservation View');
                });
        }

        function getReservationCount() {
            return datacontext.reservation.getCount().then(function (data) {
                return vm.reservationCount = data;
            });
        }

        function getReservationFilteredCount() {
            vm.reservationFilteredCount = datacontext.reservation.getFilteredCount(vm.reservationSearch);
        }

        function getReservations(forceRefresh) {
            return datacontext.reservation.getPartials(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.reservationSearch)
                .then(
                    function (data) {
                        vm.reservations = data;
                        getReservationFilteredCount();
                        if (!vm.reservationCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            getReservationCount();
                        }
                        return data;
                    }
                );
        }

        function gotoReservation(reservation) {
            if (reservation && reservation.id) {
                $location.path('/reservation/' + reservation.id);
            }
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getReservations();
        }

        function refresh() { getReservations(true); }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.reservationSearch = '';
            }
            getReservations();
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();
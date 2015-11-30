(function () {
    'use strict';

    var controllerId = 'reservationdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', reservationdetail
    ]);

    function reservationdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.reservation;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        //var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deleteReservation = deleteReservation;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.reservation = undefined;
        vm.farmObjects = [];
        vm.clusters = [];
        vm.networks = [];
        vm.isNewReservation = undefined;

        activate();

        Object.defineProperty(vm, 'canSave', { get: canSave });

        Object.defineProperty(vm, 'canCancel', { get: canCancel });

        Object.defineProperty(vm, 'canDelete', { get: canDelete });

        function canCancel() { return vm.hasChanges && !vm.isSaving; }

        function canSave() { return vm.hasChanges && !vm.isSaving && vm.hasRole; }

        function canDelete() { return vm.hasRole; }

        function activate() {
            onHasRole();
            initLookups();
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedReservation()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.reservation.id);

            if (vm.reservation.entityAspect.entityState.isDetached()) {
                gotoReservations();
            }
        }

        function deleteReservation() {
            return bsDialog.deleteDialog('Reservation')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.reservation);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoReservations();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoReservations() {
            $location.path('/reservation');
        }

        function getRequestedReservation() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewReservation = true;
                return vm.reservation = datacontext.reservation.create();
            }

            return datacontext.reservation.getEntityByIdOrFromWip(val)
                .then(function (data) {
                    wipEntityKey = data.key;
                    vm.reservation = data.entity || data;
                }, function (error) {
                    logError('Unable to get reservation ' + val);
                    gotoReservations();
                });
        }

        function goBack() { $window.history.back(); }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) { autoStoreWip(); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.farmObjects = lookups.farmObjects;
            vm.clusters = lookups.clusters;
            vm.networks = lookups.networks;
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function onHasRole() {            
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewReservation) {
                vm.reservation.createdBy = user;
                vm.reservation.createdDate = new Date();
            }
            vm.reservation.updatedBy = user;
            vm.reservation.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.reservation.id);
            }, function (error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.reservation) return;
            var description = vm.reservation.address || '[New Reservation]' + vm.reservation.id;
            var routeState = 'reservation';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.reservation, wipEntityKey, entityName, description, routeState);
        }
    }
})();
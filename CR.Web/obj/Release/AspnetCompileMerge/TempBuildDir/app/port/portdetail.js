(function () {
    'use strict';

    var controllerId = 'portdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', portdetail
    ]);

    function portdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.port;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deletePort = deletePort;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.port = undefined;
        vm.farmObjects = [];
        vm.links = [];
        vm.isNewPort = undefined;

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
            common.activateController([getRequestedPort()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.port.id);

            if (vm.port.entityAspect.entityState.isDetached()) {
                gotoPorts();
            }
        }

        function deletePort() {
            return bsDialog.deleteDialog('Port')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.port);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoPorts();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoPorts() {
            $location.path('/port');
        }

        function getRequestedPort() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewPort = true;
                return vm.port = datacontext.port.create();
            }

            return datacontext.port.getEntityByIdOrFromWip(val)
                .then(function (data) {
                    wipEntityKey = data.key;
                    vm.port = data.entity || data;
                }, function (error) {
                    logError('Unable to get port ' + val);
                    gotoPorts();
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
            vm.links = lookups.links;
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function onHasRole() {
            if (roles.indexOf("pplanning") > -1 || roles.indexOf("tlc") > -1)
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewPort) {
                vm.port.createdBy = user;
                vm.port.createdDate = new Date();
            }
            vm.port.updatedBy = user;
            vm.port.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.port.id);
            }, function (error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.port) return;
            var description = vm.port.portNo || '[New Port]' + vm.port.id;
            var routeState = 'port';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.port, wipEntityKey, entityName, description, routeState);
        }
    }
})();
(function() {
    'use strict';

    var controllerId = 'virtualdiskdetail';

    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', virtualDiskdetail
    ]);

    function virtualDiskdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.virtualDisk;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deleteStorage = deleteStorage;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.virtualDisk = undefined;
        vm.farmObjects = [];
        vm.isNewDisk = undefined;

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
            common.activateController([getRequestedStorage()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.virtualDisk.id);

            if (vm.virtualDisk.entityAspect.entityState.isDetached()) {
                gotoVirtualDisks();
            }
        }

        function deleteStorage() {
            return bsDialog.deleteDialog('Virtual Disk')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.virtualDisk);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoVirtualDisks();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoVirtualDisks() {
            $location.path('/virtualdisk');
        }

        function getRequestedStorage() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewDisk = true;
                return vm.virtualDisk = datacontext.virtualdisk.create();
            }

            return datacontext.virtualdisk.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    wipEntityKey = data.key;
                    vm.virtualDisk = data.entity || data;
                }, function(error) {
                    logError('Unable to get virtualdisk ' + val);
                    gotoVirtualDisks();
                });
        }

        function goBack() { $window.history.back(); }       

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.farmObjects = lookups.farmObjects;
        }

        function onDestroy() {
            $scope.$on('$destroy', function() {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function(event, data) { autoStoreWip(); });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function(event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function onHasRole() {
            if (roles.indexOf("support") > -1)
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewDisk) {
                vm.virtualDisk.createdBy = user;
                vm.virtualDisk.createdDate = new Date();
            }
            vm.virtualDisk.updatedBy = user;
            vm.virtualDisk.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.virtualDisk.id);
            }, function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.virtualDisk) return;
            var description = vm.virtualDisk.diskLabel || '[New Disk]' + vm.virtualDisk.id;
            var routeState = 'virtualDisk';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.virtualDisk, wipEntityKey, entityName, description, routeState);
        }
    }
})();
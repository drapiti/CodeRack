(function() {
    'use strict';

    var controllerId = 'lundetail';

    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', storagedetail
    ]);

    function storagedetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.lun;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deleteStorage = deleteStorage;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.lun = undefined;   
        vm.isNewLun = undefined;
        vm.farmObjects = [];

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
            helper.replaceLocationUrlGuidWithId(vm.lun.id);

            if (vm.lun.entityAspect.entityState.isDetached()) {
                gotoStorage();
            }
        }

        function deleteStorage() {
            return bsDialog.deleteDialog('Storage')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.lun);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoStorage();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoStorage() {
            $location.path('/lun');
        }

        function getRequestedStorage() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewLun = true;
                return vm.lun = datacontext.lun.create();
            }

            return datacontext.lun.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    wipEntityKey = data.key;
                    vm.lun = data.entity || data;
                }, function(error) {
                    logError('Unable to get lun ' + val);
                    gotoStorage();
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
            if (roles.indexOf("storage") > -1)
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewLun) {
                vm.lun.createdBy = user;
                vm.lun.createdDate = new Date();
            }
            vm.lun.updatedBy = user;
            vm.lun.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.lun.id);
            }, function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.lun) return;
            var description = vm.lun.lunLabel || '[New Lun]' + vm.lun.id;
            var routeState = 'lun';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.lun, wipEntityKey, entityName, description, routeState);
        }
    }
})();
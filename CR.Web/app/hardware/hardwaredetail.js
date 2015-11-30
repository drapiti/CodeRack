(function() {
    'use strict';

    var controllerId = 'hardwaredetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', hardwaredetail
    ]);

    function hardwaredetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.hardware;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deletehardware = deletehardware;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.hardware = undefined;
        vm.isNewHardware = undefined;
        vm.hardwareTypes = [];
        
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
            common.activateController([getRequestedhardware()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.hardware.id);

            if (vm.hardware.entityAspect.entityState.isDetached()) {
                gotohardware();
            }
        }

        function deletehardware() {
            return bsDialog.deleteDialog('Hardware')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.hardware);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotohardware();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotohardware() {
            $location.path('/hardware');
        }

        function getRequestedhardware() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewhardware = true;
                return vm.hardware = datacontext.hardware.create();
            }

            return datacontext.hardware.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    wipEntityKey = data.key;
                    vm.hardware = data.entity || data;
                }, function(error) {
                    logError('Unable to get hardware ' + val);
                    gotohardware();
                });
        }

        function goBack() { $window.history.back(); }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;            
            vm.hardwareTypes = lookups.hardwareTypes;
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
            if (roles.indexOf("pplanning") > -1 || roles.indexOf("tlc") > -1 || roles.indexOf("storage") > -1 || roles.indexOf("support") > -1)
                vm.hasRole = true;
        }


        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewhardware) {
                vm.hardware.createdBy = user;
                vm.hardware.createdDate = new Date();
            }
            vm.hardware.updatedBy = user;
            vm.hardware.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.hardware.id);
            }, function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.hardware) return;
            var description = vm.hardware.model || '[New Hardware]' + vm.hardware.id;
            var routeState = 'hardware';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.hardware, wipEntityKey, entityName, description, routeState);
        }
    }
})();
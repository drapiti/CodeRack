(function() {
    'use strict';

    var controllerId = 'farmobjectdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', farmobjectdetail
    ]);

    function farmobjectdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.farmObject;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;
        
        vm.cancel = cancel;
        vm.deleteFarmObject = deleteFarmObject;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.farmObject = undefined;
        vm.bootTypes = [];
        vm.clusters = [];
        vm.operatingSystems = [];
        vm.serviceLevels = [];
        vm.services = [];
        vm.hardware = [];
        vm.parentObjects = [];
        vm.hardwareTypes = [];
        vm.racks = [];
        vm.rooms = [];    
        vm.bkPolicyVMs = [];
        vm.bkPolicyPMs = [];
        vm.isNewFarmObject = undefined;
       
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
            common.activateController([getRequestedFarmObject()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.farmObject.id);

            if (vm.farmObject.entityAspect.entityState.isDetached()) {
                gotoFarmObjects();
            }
        }

        function deleteFarmObject() {
            return bsDialog.deleteDialog('Farm Object')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.farmObject);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoFarmObjects();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoFarmObjects() {
            $location.path('/farmobject');
        }

        function getRequestedFarmObject() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewFarmObject = true;
                return vm.farmObject = datacontext.farmobject.create();
            }

            return datacontext.farmobject.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    wipEntityKey = data.key;
                    vm.farmObject = data.entity || data;
                }, function(error) {
                    logError('Unable to get farm object ' + val);
                    gotoFarmObjects();
                });
        }

        function goBack() { $window.history.back(); }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.bkPolicyVMs = lookups.bkPolicyVMs;
            vm.bkPolicyPMs = lookups.bkPolicyPMs;
            vm.bootTypes = lookups.bootTypes;
            vm.clusters = lookups.clusters;
            vm.hardwareObjects = lookups.hardwareObjects;
            vm.operatingSystems = lookups.operatingSystems;
            vm.services = lookups.services;
            vm.serviceLevels = lookups.serviceLevels;
            vm.rooms = lookups.rooms;
            vm.racks = lookups.racks;
            vm.parentObjects = lookups.parentObjects;
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

            if (vm.isNewFarmObject) {
                vm.farmObject.createdBy = user;
                vm.farmObject.createdDate = new Date();
            }
            vm.farmObject.updatedBy = user;
            vm.farmObject.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.farmObject.id);
            }, function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.farmObject) return;
            var description = vm.farmObject.name || '[New Farm Object]' + vm.farmObject.id;
            var routeState = 'farmobject'; //Only required when our route and entityName do not coincide otherwise not necessary
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.farmObject, wipEntityKey, entityName, description, routeState);
        }
          
    }
})();
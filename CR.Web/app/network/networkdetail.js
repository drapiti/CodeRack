(function() {
    'use strict';

    var controllerId = 'networkdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', networkdetail
    ]);

    function networkdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.network;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;

        vm.cancel = cancel;
        vm.deleteNetwork = deleteNetwork;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.network = undefined;      
        vm.services = [];
        vm.isNewNetwork = undefined;

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
            common.activateController([getRequestedNetwork()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.network.id);

            if (vm.network.entityAspect.entityState.isDetached()) {
                gotoNetworks();
            }
        }

        function deleteNetwork() {
            return bsDialog.deleteDialog('Network')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.network);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoNetworks();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoNetworks() {
            $location.path('/network');
        }

        function getRequestedNetwork() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewNetwork = true;
                return vm.network = datacontext.network.create();
            }

            return datacontext.network.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    wipEntityKey = data.key;
                    vm.network = data.entity || data;
                }, function(error) {
                    logError('Unable to get network ' + val);
                    gotoNetworks();
                });
        }

        function goBack() { $window.history.back(); }       

        function onDestroy() {
            $scope.$on('$destroy', function() {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.services = lookups.services;
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
            if (roles.indexOf("tlc") > -1 || roles.indexOf("support") > -1)
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewNetwork) {
                vm.network.createdBy = user;
                vm.network.createdDate = new Date();
            }
            vm.network.updatedBy = user;
            vm.network.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.network.id);
            }, function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.network) return;
            var description = vm.network.address || '[New Network]' + vm.network.id;
            var routeState = 'network';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.network, wipEntityKey, entityName, description, routeState);
        }
    }
})();
(function () {
    'use strict';

    var controllerId = 'linkdetail';

    angular.module('app').controller(controllerId,
    [
        '$location', '$routeParams', '$scope', '$window', 'auth', 'bootstrap.dialog', 'common',
        'config', 'datacontext', 'helper', 'model', linkdetail
    ]);

    function linkdetail($location, $routeParams, $scope, $window, auth, bsDialog, common,
        config, datacontext, helper, model) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var entityName = model.entityNames.link;
        var wipEntityKey = undefined;
        var user = auth.profile.name;
        var roles = ["support", "pplannig", "storage", "tlc", "user"]; //auth.profile.roles;
        
        vm.cancel = cancel;
        vm.deleteLink = deleteLink;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.hasRole = false;
        vm.isSaving = false;
        vm.save = save;
        vm.link = undefined;
        vm.isNewLink = undefined;   

        activate();

        Object.defineProperty(vm, 'canSave', { get: canSave });

        Object.defineProperty(vm, 'canCancel', { get: canCancel });

        Object.defineProperty(vm, 'canDelete', { get: canDelete });

        function canCancel() { return vm.hasChanges && !vm.isSaving; }

        function canSave() { return vm.hasChanges && !vm.isSaving && vm.hasRole; }

        function canDelete() { return vm.hasRole; }

        function activate() {
            onHasRole();        
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedLink()], controllerId)
                .then(onEveryChange);           
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.link.id);

            if (vm.link.entityAspect.entityState.isDetached()) {
                gotoLinks();
            }
        }

        function deleteLink() {
            return bsDialog.deleteDialog('Link')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.link);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoLinks();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function gotoLinks() {
            $location.path('/link');
        }

        function getRequestedLink() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.isNewLink = true;
                return vm.link = datacontext.link.create();
            }

            return datacontext.link.getEntityByIdOrFromWip(val)
                .then(function (data) {
                    wipEntityKey = data.key;
                    vm.link = data.entity || data;
                }, function (error) {
                    logError('Unable to get link ' + val);
                    gotoLinks();
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

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function onHasRole() {
            if (roles.indexOf("pplanning") > -1 || roles.indexOf("tlc") > -1 || roles.indexOf("support") > -1)
                vm.hasRole = true;
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            if (vm.isNewLink) {
                vm.link.createdBy = user;
                vm.link.createdDate = new Date();
            }
            vm.link.updatedBy = user;
            vm.link.updatedDate = new Date();

            vm.isSaving = true;
            return datacontext.save().then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.link.id);
            }, function (error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.link) return;
            var description = vm.link.name || '[New Link]' + vm.link.id;
            var routeState = 'link';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.link, wipEntityKey, entityName, description, routeState);
        }
    }
})();
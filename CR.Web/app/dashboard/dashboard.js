(function() {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'config', 'datacontext', dashboard]);

    function dashboard($scope, common, config, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);       

        var vm = this;        
        vm.search = search;
        vm.farmObjectCount = 0;
        vm.hardwareCount = 0;
        vm.reservationCount = 0;
        vm.networkCount = 0;
        vm.linkCount = 0;
        vm.portLinkCount = 0;
        vm.lunCount = 0;
        vm.diskCount = 0;
        vm.farmObjects = {
            title: 'New Farm Objects',
            interval: 5000,
            list: []
        };
        vm.news = {
            title: 'About',
            description: 'Code Rack is a mobile ready cross platform single page application (SPA) to help IT staff maintain inventory, configuration information and live data of their Datacenter environment.'
        };
        vm.title = 'Dashboard';

        vm.lun = {
            title: 'SAN LUN Allocation',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortLUN
        };
        vm.disk = {
            title: 'Virtual Disk Allocation',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortDisk
        };
        vm.rack = {
            title: 'Rack Power and Occupancy Levels',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortRack
        };
        vm.port = {
            title: 'Port Utilization',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortPort
        };
        vm.hardware = {
            title: 'Child/Parent Relative Occupancy',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortHardware
        };
        vm.power = {
            title: 'Resource Allocation for IBM System P',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortPower
        };
        vm.virtual = {
            title: 'Resource Allocation for Virtual Infrastructure',
            allocation: [],
            predicate: '',
            reverse: false,
            setSort: setSortVirtual
        };
        vm.server = {
            title: 'Server Distribution',
            distribution: [],
            predicate: '',
            reverse: false,
            setSort: setSortServer
        };

        $scope.limit = 5;
 
        activate();

        function activate() {
            var promises = [
                getNewFarmObjects(), getFarmObjectCount(), getLinkCount(), getLunCount(), getReservationCount(), 
                getNetworkCount(), getHardwareCount(), getPortLinkCount(), getDiskCount(), getServerDistribution(),
                getLUNAllocation(), getDiskAllocation(), getHardwareAllocation(), getPortAllocation(),
                getRackAllocation(), getPowerAllocation(), getVirtualAllocation()
            ];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });              
        }

        function search($event) {
            if ($event.keyCode == keyCodes.esc) {
                vm.portSearch = '';
                vm.lunSearch = '';
                vm.diskSearch = '';
                vm.rackSearch = '';
                vm.hardwareSearch = '';
                vm.powerSearch = '';
                vm.virtualSearch = '';
                vm.serverServiceSearch = '';
            }
        }

        function getHardwareCount() {
            return datacontext.hardware.getCount().then(function(data) {
                return vm.hardwareCount = data;
            });
        }

        function getFarmObjectCount() {
            return datacontext.farmobject.getCount().then(function(data) {
                return vm.farmObjectCount = data;
            });
        }

        function getNewFarmObjects() {
            return datacontext.farmobject.getPartials().then(function(data) {
                return vm.farmObjects.list = data;
            });
        }

        function getNetworkCount() {
            return datacontext.network.getCount().then(function(data) {
                return vm.networkCount = data;
            });
        }

        function getReservationCount() {
            return datacontext.reservation.getCount().then(function(data) {
                return vm.reservationCount = data;
            });
        }

        function getLinkCount() {
            return datacontext.link.getCount().then(function (data) {
                return vm.linkCount = data;
            });
        }

        function getPortLinkCount() {
            return datacontext.port.getCount().then(function (data) {
                return vm.portLinkCount = data;
            });
        }

        function getLunCount() {
            return datacontext.lun.getCount().then(function (data) {
                return vm.lunCount = data;
            });
        }

        function getDiskCount() {
            return datacontext.virtualdisk.getCount().then(function (data) {
                return vm.diskCount = data;
            });
        }

        function getServerDistribution() {
            return datacontext.farmobject.getServerDistribution().then(function (data) {
                return vm.server.distribution = data;
            });
        }

        function getLUNAllocation() {
            return datacontext.lun.getUtilized().then(function(data) {
                return vm.lun.allocation = data;
            });
        }

        function getHardwareAllocation() {
            return datacontext.farmobject.getHardwareAllocation().then(function (data) {
                return vm.hardware.allocation = data;
            });
        }

        function getRackAllocation() {
            return datacontext.farmobject.getRackAllocation().then(function (data) {
                return vm.rack.allocation = data;
            });
        }

        function getPowerAllocation() {
            return datacontext.farmobject.getPowerAllocation().then(function (data) {
                return vm.power.allocation = data;
            });
        }

        function getVirtualAllocation() {
            return datacontext.farmobject.getVirtualAllocation().then(function (data) {
                return vm.virtual.allocation = data;
            });
        }


        function getDiskAllocation() {
            return datacontext.virtualdisk.getUtilized().then(function (data) {
                return vm.disk.allocation = data;
            });
        }

        function getPortAllocation() {
            return datacontext.port.getUtilized().then(function (data) {
                return vm.port.allocation = data;
            });
        }

        function setSortLUN(prop) {
            vm.lun.predicate = prop;
            vm.lun.reverse = !vm.lun.reverse;      
        }

        function setSortDisk(prop) {
            vm.disk.predicate = prop;
            vm.disk.reverse = !vm.disk.reverse;
        }

        function setSortRack(prop) {
            vm.rack.predicate = prop;
            vm.rack.reverse = !vm.rack.reverse;
        }

        function setSortHardware(prop) {
            vm.hardware.predicate = prop;
            vm.hardware.reverse = !vm.hardware.reverse;
        }

        function setSortPort(prop) {
            vm.port.predicate = prop;
            vm.port.reverse = !vm.port.reverse;
        }

        function setSortPower(prop) {
            vm.power.predicate = prop;
            vm.power.reverse = !vm.power.reverse;
        }

        function setSortVirtual(prop) {
            vm.virtual.predicate = prop;
            vm.virtual.reverse = !vm.virtual.reverse;
        }

        function setSortServer(prop) {
            vm.server.predicate = prop;
            vm.server.reverse = !vm.server.reverse;
        }

    }
})();
(function() {
    'use strict';

    var serviceId = 'repository.farmobject';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryFarmObject]);

    function RepositoryFarmObject(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.farmObject;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'updatedDate desc, name';

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.zStorage = zStorage;
            this.zStorageWip = zStorageWip;
            // Exposed data access functions
            this.create = create;
            this.getPartials = getPartials;
            this.getById = getById;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
            this.getRackAllocation = getRackAllocation;
            this.getHardwareAllocation = getHardwareAllocation;
            this.getPowerAllocation = getPowerAllocation;
            this.getVirtualAllocation = getVirtualAllocation;
            this.getServerDistribution = getServerDistribution;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create() {
            return this.manager.createEntity(entityName);
        }
         
        function getPartials(forceRemote, page, size, nameFilter) {
            var self = this;
            // Only return a page worth of farm objects
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (self.zStorage.areItemsLoaded('FarmObjects') && !forceRemote) {
                // Get the page of farm objects from local cache
                return self.$q.when(getByPage());
            }

            // Load all farm objects to cache via remote query
            return EntityQuery.from('FarmObjects')              
                .select('id, name, serial, cPUs, cPUCores, updatedDate, ram, nic, entitledCapacity, bkPolicyVMId, bkPolicyPMId, bootTypeId, destinationTypeId, hardwareObjectId, rackId, serviceLevelId, parentObjectId, clusterId, poolId')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var farmObjects = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('FarmObjects', true);
                self.zStorage.save();
                self.log('Retrieved [Farm Object Partials] from remote data source', farmObjects.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                if (nameFilter) {
                    predicate = _nameSerialClusterPredicate(nameFilter);
                }

                var farmObjects = EntityQuery.from('FarmObjects') 
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return farmObjects;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _nameSerialClusterPredicate(filterValue) {
            return breeze.Predicate
                .create('name', 'contains', filterValue)
                .or('serial', 'contains', filterValue)
                .or('cluster.name', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('FarmObjects')) {
                return self.$q.when(self._getLocalEntityCount('FarmObjects'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('FarmObjects')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _nameSerialClusterPredicate(nameFilter);

            var farmObjects = EntityQuery.from('FarmObjects')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return farmObjects.length;
        }
 
        function getRackAllocation() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var farmObjects = data;

                //loop thorugh the farmobjects and create a mapped service allocation object 
                var rackMap = farmObjects.reduce(function (accum, farmObject) {
                    var rackName = farmObject.rack.name;
                    var rackIndex = farmObject.rack.id;

                    if (accum[rackIndex - 1]) {
                        if (rackName != "Dynamic/Virtual") {
                            accum[rackIndex - 1].utilizedPower += farmObject.hardwareObject.powerIndex;
                            accum[rackIndex - 1].utilizedSpace += farmObject.hardwareObject.rackUnitSize;
                            accum[rackIndex - 1].count++;
                        }
                    } else {
                        if (rackName != "Dynamic/Virtual") {
                            accum[rackIndex - 1] = {
                                rack: rackName,
                                utilizedPower: farmObject.hardwareObject.powerIndex,
                                utilizedSpace: farmObject.hardwareObject.rackUnitSize,
                                count: 1
                            };
                        }
                    }
                    return accum;
                }, []);
                return rackMap;
            });
        }

        function getHardwareAllocation() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var farmObjects = data;

                //loop thorugh the farmobjects and create a mapped service allocation object 
                var hardwareMap = farmObjects.reduce(function (accum, farmObject) {       
                    var parentName = farmObject.parentObject.name;
                    var nodeCapacity = farmObject.parentObject.maxChildren;
                    var hardwareIndex = farmObject.parentObject.id;

                    if (accum[hardwareIndex - 1]) {
                        if(parentName != "-") {
                            accum[hardwareIndex - 1].farmObjects++;
                            accum[hardwareIndex - 1].nodeCapacity--;
                        }
                    } else {
                        if (parentName != "-") {
                            accum[hardwareIndex - 1] = {
                                parentName: parentName,
                                nodeCapacity: nodeCapacity - 1,
                                farmObjects: 1
                            };
                        }
                    }
                    return accum;
                }, []);
                return hardwareMap;
            });
        }

        function getPowerAllocation() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var farmObjects = data;

                //loop thorugh the farmobjects and create a mapped service allocation object 
                var resourceMap = farmObjects.reduce(function (accum, farmObject) {
                    var serviceName = farmObject.serviceLevel.service.label;
                    var serviceIndex = farmObject.serviceLevel.service.id;
                    var hardwareType = farmObject.hardwareObject.hardwareType.name;
                    
                    if (accum[serviceIndex - 1]) { 
                        if (hardwareType == 'LPAR') {
                            accum[serviceIndex - 1].cpuPower += farmObject.cPUs,
                            accum[serviceIndex - 1].ramPower += farmObject.ram,
                            accum[serviceIndex - 1].entitledCapacity += farmObject.entitledCapacity
                        }
                    } else {
                        if (hardwareType == 'LPAR') {
                            accum[serviceIndex - 1] = {
                                service: serviceName,
                                cpuPower: farmObject.cPUs,
                                entitledCapacity: farmObject.entitledCapacity,
                                ramPower: farmObject.ram
                            };
                        }
                    }
                    return accum;
                }, []);
                return resourceMap;
            });
        }

        function getVirtualAllocation() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var farmObjects = data;

                //loop thorugh the farmobjects and create a mapped service allocation object 
                var resourceMap = farmObjects.reduce(function (accum, farmObject) {
                    var serviceName = farmObject.serviceLevel.service.label;
                    var serviceIndex = farmObject.serviceLevel.service.id;
                    var hardwareType = farmObject.hardwareObject.hardwareType.name;

                    if (accum[serviceIndex - 1]) {
                        if (hardwareType == 'Virtual Machine') {
                            accum[serviceIndex - 1].cpuVirtual += farmObject.cPUs,
                            accum[serviceIndex - 1].ramVirtual += farmObject.ram
                        }
                    } else {
                        if (hardwareType == 'Virtual Machine') {
                            accum[serviceIndex - 1] = {
                                service: serviceName,
                                cpuVirtual: farmObject.cPUs,
                                ramVirtual: farmObject.ram,
                            };
                        }
                    }
                    return accum;
                }, []);
                return resourceMap;
            });
        }

        function getServerDistribution() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var farmObjects = data;

                //loop thorugh the farmobjects and create a mapped service allocation object 
                var serverMap = farmObjects.reduce(function (accum, farmObject) {
                    var type = farmObject.hardwareObject.hardwareType.name;
                    var serviceName = farmObject.serviceLevel.service.label;
                    var serviceIndex = farmObject.serviceLevel.service.id;

                    if (accum[serviceIndex - 1]) {
                        if(type == 'Virtual Machine') {
                            accum[serviceIndex - 1].virtual++;
                        }
                        if (type == 'Rack Server' || type == "Blade Server") {
                            accum[serviceIndex - 1].physical++;                        
                        }
                    } else {
                        if (type == 'Virtual Machine') {
                            accum[serviceIndex - 1] = {
                                service: serviceName,
                                virtual: 1,
                                physical: 0
                            };
                        }
                        if (type == 'Rack Server' || type == "Blade Server") {
                            accum[serviceIndex - 1] = {
                                service: serviceName,
                                physical: 1,
                                virtual: 0,
                            };
                        }
                    }
                    return accum;
                }, []);
                return serverMap;
            });
        }
    }
})();
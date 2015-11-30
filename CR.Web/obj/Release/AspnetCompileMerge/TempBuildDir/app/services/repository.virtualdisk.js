(function() {
    'use strict';

    var serviceId = 'repository.virtualdisk';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryVirtualDisk]);

    function RepositoryVirtualDisk(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.virtualDisk;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'farmObjectId, size';                

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
            this.getUtilized = getUtilized;
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

            if (self.zStorage.areItemsLoaded('VirtualDisks') && !forceRemote) {
                // Get the page of farm objects from local cache 
                return self.$q.when(getByPage());
            }

            // Load all farm object Types to cache via remote query
            return EntityQuery.from('VirtualDisks')
                .select('id, diskLabel, size, type, farmObjectId')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var virtualDisks = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('VirtualDisks', true);
                self.zStorage.save();
                self.log('Retrieved [Virtual Disk Partials] from remote data source', virtualDisks.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                
                if (nameFilter) {
                    predicate = _virtualDiskLabelPredicate(nameFilter);
                }                

                var virtualdisks = EntityQuery.from('VirtualDisks')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return virtualdisks;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _virtualDiskLabelPredicate(filterValue) {
            return breeze.Predicate
                .create('diskLabel', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('VirtualDisks')) {
                return self.$q.when(self._getLocalEntityCount('VirtualDisks'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('VirtualDisks')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _virtualDiskLabelPredicate(nameFilter);

            var virtualDisks = EntityQuery.from('VirtualDisks')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return virtualDisks.length;
        }

        function getUtilized() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var virtualDisks = data;

                //loop thorugh the virtualdisks and create a mapped service allocation object 
                var serviceMap = virtualDisks.reduce(function (accum, virtualDisk) {
                    var serviceLabel = virtualDisk.farmObject.serviceLevel.service.label;
                    var serviceIndex = virtualDisk.farmObject.serviceLevel.service.id;

                    if (accum[serviceIndex-1]) {
                            accum[serviceIndex - 1].count++;
                            accum[serviceIndex - 1].utilizedStorage += virtualDisk.size;
                    } else {
                            accum[serviceIndex-1] = {
                                service: serviceLabel,
                                utilizedStorage: virtualDisk.size,
                                count: 1,         
                            };                                                
                    }
                    return accum;                    
                }, []);
                return serviceMap;
            });
        }
    }
})();
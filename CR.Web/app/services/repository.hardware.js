(function() {
    'use strict';

    var serviceId = 'repository.hardware';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', Repositoryhardware]);

    function Repositoryhardware(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.hardwareObject;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'model';                

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

            if (self.zStorage.areItemsLoaded('HardwareObjects') && !forceRemote) {
                // Get the page of farm objects from local cache 
                return self.$q.when(getByPage());
            }

            // Load all farm object Types to cache via remote query
            return EntityQuery.from('HardwareObjects')   
                .select('id, model, brand, rackUnitSize, powerIndex, portCapacity, imageSource, hardwareTypeId')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var hardware = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('HardwareObjects', true);
                self.zStorage.save();
                self.log('Retrieved [Hardware Partials] from remote data source', hardware.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                if (nameFilter) {
                    predicate = _modelPredicate(nameFilter);                   
                }                

                var hardware = EntityQuery.from('HardwareObjects')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return hardware;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _modelPredicate(filterValue) {   
            return breeze.Predicate
                .create('model', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('HardwareObjects')) {
                return self.$q.when(self._getLocalEntityCount('HardwareObjects'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('HardwareObjects')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _modelPredicate(nameFilter);

            var hardware = EntityQuery.from('HardwareObjects')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return hardware.length;
        }
    }
})();
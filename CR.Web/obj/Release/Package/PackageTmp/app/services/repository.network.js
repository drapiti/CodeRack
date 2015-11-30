(function () {
    'use strict';

    var serviceId = 'repository.network';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryNetwork]);

    function RepositoryNetwork(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.network;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'address';

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

            if (self.zStorage.areItemsLoaded('Networks') && !forceRemote) {
                // Get the page of farm objects from local cache 
                return self.$q.when(getByPage());
            }

            // Load all farm object Types to cache via remote query
            return EntityQuery.from('Networks')
                .select('id, address, vlan, serviceId, description')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var network = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Networks', true);
                self.zStorage.save();
                self.log('Retrieved [Network Partials] from remote data source', network.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                if (nameFilter) {
                    predicate = _networkVlanPredicate(nameFilter);
                }

                var networks = EntityQuery.from('Networks')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return networks;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _networkVlanPredicate(filterValue) {
            return breeze.Predicate
                .create('address', 'contains', filterValue)
                .or('service.name', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Networks')) {
                return self.$q.when(self._getLocalEntityCount('Networks'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('Networks')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }
 
        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _networkVlanPredicate(nameFilter);

            var networks = EntityQuery.from('Networks')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return networks.length;
        }
    }
})();
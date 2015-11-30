(function() {
    'use strict';

    var serviceId = 'repository.link';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryLink]);

    function RepositoryLink(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.link;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'id';                

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

            // Only return a page worth of ports
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (self.zStorage.areItemsLoaded('Links') && !forceRemote) {
                // Get the page of ports from local cache 
                return self.$q.when(getByPage());
            }

            // Load all ports to cache via remote query
            return EntityQuery.from('Links')   
                .select('id, labelServerEndpoint, labelTlcEndpoint, labelPreCabling, labelJump')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var link = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Links', true);
                self.zStorage.save();
                self.log('Retrieved [Link Partials] from remote data source', link.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                if (nameFilter) {
                    predicate = _linkPredicate(nameFilter);
                }                

                var ports = EntityQuery.from('Links') 
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return ports;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _linkPredicate(filterValue) {
            return breeze.Predicate
                .create('labelServerEndpoint', 'contains', filterValue)
                .or('labelTlcEndpoint', 'contains', filterValue)
                .or('labelPreCabling', 'contains', filterValue)
                .or('labelJump', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Links')) {
                return self.$q.when(self._getLocalEntityCount('Links'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('Links')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _linkPredicate(nameFilter);

            var links = EntityQuery.from('Links')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return links.length;
        }
    }
})();
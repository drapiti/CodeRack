(function() {
    'use strict';

    var serviceId = 'repository.reservation';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryReservation]);

    function RepositoryReservation(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.reservation;
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

            if (self.zStorage.areItemsLoaded('Reservations') && !forceRemote) {
                // Get the page of farm objects from local cache 
                return self.$q.when(getByPage());
            }

            // Load all farm object Types to cache via remote query
            return EntityQuery.from('Reservations')
                .select('id, address, networkId, farmObjectId, description')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var reservation = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Reservations', true);
                self.zStorage.save();
                self.log('Retrieved [Reservation Partials] from remote data source', reservation.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = null; 
                if (nameFilter) {
                    predicate = _addressHostnamePredicate(nameFilter);                    
                }                

                var reservations = EntityQuery.from('Reservations')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return reservations;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _addressHostnamePredicate(filterValue) {
            return breeze.Predicate
                .create('address', 'contains', filterValue)
                .or('farmObject.name', 'contains', filterValue);                
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Reservations')) {
                return self.$q.when(self._getLocalEntityCount('Reservations'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('Reservations')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _addressHostnamePredicate(nameFilter);

            var reservations = EntityQuery.from('Reservations')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return reservations.length;
        }
    }
})();
(function() {
    'use strict';

    var serviceId = 'repository.port';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryPort]);

    function RepositoryPort(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.port;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'id, farmObjectId';                

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

            // Only return a page worth of ports
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (self.zStorage.areItemsLoaded('Ports') && !forceRemote) {
                // Get the page of ports from local cache 
                return self.$q.when(getByPage());
            }

            // Load all ports to cache via remote query
            return EntityQuery.from('Ports')
                .select('id, portNo, state, createdDate, farmObjectId, linkId')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed); 

            function querySucceeded(data) {
                var port = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Ports', true);
                self.zStorage.save();
                self.log('Retrieved [Port Partials] from remote data source', port.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                if (nameFilter) {
                    predicate = _farmObjectLinkPredicate(nameFilter);                   
                }                

                var ports = EntityQuery.from('Ports') 
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

        function _farmObjectLinkPredicate(filterValue) {
            return breeze.Predicate
                .create('farmObject.name', 'contains', filterValue)
                .or('link.labelServerEndpoint', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Ports')) {
                return self.$q.when(self._getLocalEntityCount('Ports'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('Ports')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _farmObjectLinkPredicate(nameFilter);

            var ports = EntityQuery.from('Ports')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return ports.length;
        }

        function getUtilized() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var ports = data;

                //loop thorugh the ports and create a mapped service allocation object 
                var portMap = ports.reduce(function (accum, port) {
                    var portIndex = port.farmObject.id;
                    var farmObjectName = port.farmObject.name;
                    var available = port.farmObject.hardwareObject.portCapacity;                    
                    var state = port.state;

                    if (accum[portIndex - 1]) {
                        if (state == 'Up') {
                            accum[portIndex - 1].count++;
                            accum[portIndex - 1].available--;
                        }
                    } else {
                       if (state == 'Up') {
                            accum[portIndex - 1] = {
                                farmObject: farmObjectName,
                                count: 1,  
                                available: available - 1                                                  
                            };
                       }
                    }
                    return accum;
                }, []);
                return portMap;
            });
        }
    }
})();
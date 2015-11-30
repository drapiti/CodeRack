(function() {
    'use strict';

    var serviceId = 'repository.lun';
    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryLun]);

    function RepositoryLun(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.lun;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'farmObjectId';

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.zStorage = zStorage;
            this.zStorageWip = zStorageWip;
            //Exposed data access functions
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

            if (self.zStorage.areItemsLoaded('Luns') && !forceRemote) {
                // Get the page of farm objects from local cache 
                return self.$q.when(getByPage());
            }

            // Load all farm object Types to cache via remote query
            return EntityQuery.from('Luns')   
                .select('id, lunLabel, size, lunScsiId, isBootLun, lunScenario, farmObjectId')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var luns = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Luns', true);
                self.zStorage.save();
                self.log('Retrieved [Lun Partials] from remote data source', luns.length, true);
                return getByPage();
            }

            function getByPage() {
                var predicate = self._predicates.isNotNullo;
                
                if (nameFilter) {
                    predicate = _lunLabelwWNPredicate(nameFilter);
                }                

                var luns = EntityQuery.from('Luns') 
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return luns;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _lunLabelwWNPredicate(filterValue) {   
            return breeze.Predicate
                .create('lunLabel', 'contains', filterValue)
                .and('id', '!=', 0);
        }

        // Formerly known as datacontext.getFarmObjectCount()
        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Luns')) {
                return self.$q.when(self._getLocalEntityCount('Luns'));
            }
            // Farm objects aren't loaded; ask the server for a count.
            return EntityQuery.from('Luns')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter) {
            var predicate = _lunLabelwWNPredicate(nameFilter);

            var luns = EntityQuery.from('Luns')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return luns.length;
        }

        function getUtilized() {
            return this.getPartials(false, 1, 10000).then(function (data) {
                var luns = data;

                //loop thorugh the luns and create a mapped service allocation object 
                var serviceMap = luns.reduce(function (accum, lun) {
                    var serviceIndex = lun.farmObject.serviceLevel.service.id;
                    var serviceLevel = lun.farmObject.serviceLevel.name;
                    var serviceLabel = lun.farmObject.serviceLevel.service.label;              
                    var lunScenario = lun.lunScenario;
                    var size = lun.size;

                    if (accum[serviceIndex - 1]) {
                        if (lunScenario == 'A') {
                            accum[serviceIndex - 1].utilizedStorage += (size * 4);
                            accum[serviceIndex - 1].count++;
                        }
                        else if (serviceLevel.match(' B (NOHA-DR)') && lunScenario == 'B') {
                            accum[serviceIndex - 1].utilizedStorage += (size * 3);
                            accum[serviceIndex - 1].count++;
                        }
                        else if (serviceLevel.match(' B (NOHA-NODR)') && lunScenario == 'B') {
                            accum[serviceIndex - 1].utilizedStorage += size;
                            accum[serviceIndex - 1].count++;
                        }
                        else if (lunScenario == 'C') {
                            accum[serviceIndex - 1].utilizedStorage += size;
                            accum[serviceIndex - 1].count++;
                        }
                        else if (lunScenario == 'D') {
                            accum[serviceIndex - 1].utilizedStorage += (size * 2);
                            accum[serviceIndex - 1].count++;
                        }                        
                    } else {
                        if (lunScenario == 'A') {
                            accum[serviceIndex - 1] = {
                                service: serviceLabel,
                                utilizedStorage: (size * 4),
                                count: 1
                            };
                        }
                        else if (serviceLevel.match('B (NOHA-DR)') && lunScenario == 'B') {
                            accum[serviceIndex - 1] = {
                                service: serviceLabel,
                                utilizedStorage: (size * 3),
                                count: 1
                            };
                        }
                        else if (serviceLevel.match('B (NOHA-NODR)') && lunScenario == 'B') {
                            accum[serviceIndex - 1] = {
                                service: serviceLabel,
                                utilizedStorage: size,
                                count: 1
                            };
                        }
                        else if (lunScenario == 'C') {
                            accum[serviceIndex - 1] = {
                                service: serviceLabel,
                                utilizedStorage: size,
                                count: 1
                            };
                        }
                        else if (lunScenario == 'D') {
                            accum[serviceIndex - 1] = {
                                service: serviceLabel,
                                utilizedStorage: (size * 2),
                                count: 1
                            };                        
                        }
                    }
                    return accum;
                }, []);
                return serviceMap;
            });
        }
        
    }
})();
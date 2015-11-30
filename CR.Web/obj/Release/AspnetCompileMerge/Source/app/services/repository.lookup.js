/// <reference path="repository.hardware.js" />
(function() {
    'use strict';

    var serviceId = 'repository.lookup';

    angular.module('app').factory(serviceId,
    ['model', 'repository.abstract', 'zStorage', RepositoryLookup]);

    function RepositoryLookup(model, AbstractRepository, zStorage) {
        var entityName = 'lookups';
        var EntityQuery = breeze.EntityQuery;


        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.zStorage = zStorage;
            // Exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        //Ctor.prototype = new AbstractRepository(Ctor);
        //Ctor.prototype.constructor = Ctor;
        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLookups()
        function getAll() {
            var self = this;
            return EntityQuery.from('Lookups')                
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                model.createNullos(self.manager);
                self.zStorage.save();
                self.log('Retrieved [Lookups]', data, true);
                return true;
            }
        }

        // Formerly known as datacontext.setLookups()
        function setLookups() {
            this.lookupCachedData = {
                bkPolicyVMs: this._getAllLocal('BkPolicyVMs', 'name'),
                bkPolicyPMs: this._getAllLocal('BkPolicyPMs', 'label'),
                bootTypes: this._getAllLocal('BootTypes', 'name'),
                pools: this._getAllLocal('Pools', 'name'),
                clusters: this._getAllLocal('Clusters', 'name'),             
                destinationTypes: this._getAllLocal('DestinationTypes', 'name'),
                farmObjects: this._getAllLocal('FarmObjects', 'name'),
                links: this._getAllLocal('Links', 'labelServerEndpoint'),
                networks: this._getAllLocal('Networks', 'address'),
                hardwareObjects: this._getAllLocal('HardwareObjects', 'model'),
                hardwareTypes: this._getAllLocal('HardwareTypes', 'name'),
                parentObjects: this._getAllLocal('ParentObjects', 'name'),
                operatingSystems: this._getAllLocal('OperatingSystems', 'name'),
                racks: this._getAllLocal('Racks', 'name'),  
                rooms: this._getAllLocal('Rooms', 'name'),
                serviceLevels: this._getAllLocal('ServiceLevels', 'name'),
                services: this._getAllLocal('Services', 'label')
            };
        }
    }
})();
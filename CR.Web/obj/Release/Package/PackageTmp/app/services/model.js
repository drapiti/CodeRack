(function() {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'model';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['model.validation', model]);

    function model(modelValidation) {
        //var nulloDate = new Date();

        // Define the functions and properties to reveal.
        var entityNames = {
            bkPolicyVM: 'BkPolicyVM',
            bkPolicyPM: 'BkPolicyPM',
            bootType: 'BootType',
            pool: 'Pool',
            cluster: 'Cluster',   
            destinationType: 'DestinationType',
            farmObject: 'FarmObject',
            link: 'Link',
            lun: 'Lun',     
            virtualDisk: 'VirtualDisk',
            network: 'Network',
            hardwareObject: 'HardwareObject',
            hardwareType: 'HardwareType',
            parentObject: 'ParentObject',
            operatingSystem: 'OperatingSystem',
            port: 'Port',            
            rack: 'Rack',
            reservation: 'Reservation',
            room: 'Room',
            service: 'Service',
            serviceLevel: 'ServiceLevel'
        };

        var service = {
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames,
            extendMetadata: extendMetadata
        };

        return service;

        function configureMetadataStore(metadataStore) {            
            registerFarmObject(metadataStore);            
            registerLink(metadataStore);
            registerLun(metadataStore);
            registerVirtualDisk(metadataStore);
            registerNetwork(metadataStore);
            registerHardware(metadataStore);
            registerPort(metadataStore);            
            registerReservation(metadataStore);
            
            modelValidation.createAndRegister(entityNames);
        }

        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.farmObject, { name: ' [Select a farmobject]', serial: ' [Select a serial]' });
            createNullo(entityNames.bkPolicyVM, { name: ' [Select a VM backup policy]' });
            createNullo(entityNames.bkPolicyPM, { label: ' [Select a backup policy]' });
            createNullo(entityNames.bootType, { name: ' [Select a boot type]' });
            createNullo(entityNames.pool, { name: ' [Select a pool]' });
            createNullo(entityNames.cluster);     
            createNullo(entityNames.destinationType, { name: ' [Select a destination type]' });
            createNullo(entityNames.link, { labelServerEndpoint: ' [Select a server endpoint link label]' });
            createNullo(entityNames.operatingSystem, { description: ' [Select an operating system]' });
            createNullo(entityNames.network, { address: ' [Select a network]' });
            createNullo(entityNames.service, { label: ' [Select a service]' });
            createNullo(entityNames.serviceLevel, { name: ' [Select a service level]', label: ' [Select a service level]' });
            createNullo(entityNames.hardwareObject, {  brandModel: ' [Select a hardware brand/model]' });
            createNullo(entityNames.hardwareType, { name: ' [Select a hardware type]' });
            createNullo(entityNames.parentObject, { name: ' [Select a parent object]' });
            createNullo(entityNames.rack);
            createNullo(entityNames.room);                    

            function createNullo(entityName, values) {
                var initialValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        function extendMetadata(metadataStore) {
            modelValidation.applyValidators(metadataStore);
        }

        function registerFarmObject(metadataStore) {
            metadataStore.registerEntityTypeCtor('FarmObject', FarmObject);

            function FarmObject() { this.isPartial = false; }

            Object.defineProperty(FarmObject.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(FarmObject.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerHardware(metadataStore) {
            metadataStore.registerEntityTypeCtor('HardwareObject', HardwareObject);

            function HardwareObject() { this.isPartial = false; }

            Object.defineProperty(HardwareObject.prototype, 'brandModel', {
                get: function() {
                    var br = this.brand;
                    var mo = this.model;
                    return mo ? br + ' ' + mo : br;
                }
            });

            Object.defineProperty(HardwareObject.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(HardwareObject.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerPort(metadataStore) {
            metadataStore.registerEntityTypeCtor('Port', Port);

            function Port() { this.isPartial = false; }

            Object.defineProperty(Port.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(Port.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerLink(metadataStore) {
            metadataStore.registerEntityTypeCtor('Link', Link);

            function Link() { this.isPartial = false; }

            Object.defineProperty(Link.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(Link.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerNetwork(metadataStore) {
            metadataStore.registerEntityTypeCtor('Network', Network);

            function Network() { this.isPartial = false; }

            Object.defineProperty(Network.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(Network.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerReservation(metadataStore) {
            metadataStore.registerEntityTypeCtor('Reservation', Reservation);

            function Reservation() { this.isPartial = false; }

            Object.defineProperty(Reservation.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(Reservation.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerLun(metadataStore) {
            metadataStore.registerEntityTypeCtor('Lun', Lun);

            function Lun() { this.isPartial = false; }

            Object.defineProperty(Lun.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(Lun.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }

        function registerVirtualDisk(metadataStore) {
            metadataStore.registerEntityTypeCtor('VirtualDisk', VirtualDisk);

            function VirtualDisk() { this.isPartial = false; }

            Object.defineProperty(VirtualDisk.prototype, 'createdOn', {
                get: function () {
                    var createdDate = this.createdDate;
                    var value = moment(createdDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.createdDate = value;
                }
            });

            Object.defineProperty(VirtualDisk.prototype, 'updatedOn', {
                get: function () {
                    var updatedDate = this.updatedDate;
                    var value = moment(updatedDate).format('DD/MM/YYYY');
                    return value;
                },
                set: function (value) {
                    this.updatedDate = value;
                }
            });
        }
    }
})();
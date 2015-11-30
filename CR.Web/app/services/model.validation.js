(function() {
    'use strict';

    var serviceId = 'model.validation';
    angular.module('app').factory(serviceId, ['common', modelValidation]);

    function modelValidation(common) {
        var entityNames;
        var log = common.logger.getLogFn(serviceId);
        var Validator = breeze.Validator;
        var requireReferenceValidator;
        //twitterValidator;

        var service = {
            applyValidators: applyValidators,
            createAndRegister: createAndRegister
        };

        return service;

        function applyValidators(metadataStore) {
            applyRequireReferenceValidators(metadataStore);
            log('Validators applied', null, serviceId);
        }

        function createAndRegister(eNames) {
            entityNames = eNames;
            // Step 1) Create it
            requireReferenceValidator = createRequireReferenceValidator();           
            // Step 2) Tell breeze about it
            Validator.register(requireReferenceValidator);
            // Step 3) Later we will apply them to the properties/entites via applyValidators
            log('Validators created and registered', null, serviceId, false);
        }

        function applyRequireReferenceValidators(metadataStore) {
            var farmObjectNavigations = ['operatingSystem', 'serviceLevel.service', 'bkPolicyVM', 'bkPolicyPM', 'bootType', 'cluster', 'destinationType', 'rack.room', 'hardwareObject.hardwareType', 'parentObject', 'pool' ];
            var farmObjectEntityType = metadataStore.getEntityType(entityNames.farmObject);

            farmObjectNavigations.forEach(function (propertyName) {
                farmObjectEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });

            var networkNavigations = ['service'];
            var networkEntityType = metadataStore.getEntityType(entityNames.network);

            networkNavigations.forEach(function (propertyName) {
                networkEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });

            var reservationNavigations = ['farmObject', 'network', 'cluster'];
            var reservationEntityType = metadataStore.getEntityType(entityNames.reservation);

            reservationNavigations.forEach(function (propertyName) {
                reservationEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });

            var lunNaviagations = ['farmObject.serviceLevel.service'];
            var lunEntityType = metadataStore.getEntityType(entityNames.lun);

            lunNaviagations.forEach(function (propertyName) {
                lunEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });
            
            var diskNaviagations = ['farmObject.serviceLevel.service'];
            var diskEntityType = metadataStore.getEntityType(entityNames.virtualDisk);

            diskNaviagations.forEach(function (propertyName) {
                diskEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });

            var portNaviagations = ['farmObject.serviceLevel.service', 'link', 'farmObject.hardwareObject' ];
            var portEntityType = metadataStore.getEntityType(entityNames.port);

            portNaviagations.forEach(function (propertyName) {
                portEntityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });

        }

        function createRequireReferenceValidator() {
            var name = 'requireReferenceEntity';
            // isRequired = true so zValidate directive displays required indicator
            var ctx = { messageTemplate: 'Missing %displayName%', isRequired: true };
            var val = new Validator(name, valFunction, ctx);
            return val;

            // passes if reference has a value and is not the nullo (whose id===0)
            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }
    }
})();
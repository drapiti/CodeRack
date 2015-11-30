(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'breeze/Breeze';

    var imageSettings = {
        imageBasePath: '../Content/images/objects/',
        unknownApplianceImageSource: 'unknownobject.jpg'
    };

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        entitiesChanged: 'datacontext.entitiesChanged',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        spinnerToggle: 'spinner.toggle',
        storage: {
            // names of events that WIP will fire
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
};

    var config = {
        appErrorPrefix: '[CR Error] ', //Configure the exceptionHandler decorator
        docTitle: 'CR: ',
        events: events,        
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        remoteServiceName: remoteServiceName,
        version: '2.3.2'
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    app.config(['authProvider', '$httpProvider', function (authProvider, $httpProvider) {
        authProvider.init({
            name: 'CodeRack',
            domain: 'coderack.auth0.com',
            clientID: 'miBpxMWfUpEHpmMTUi1s1fKUmygIipFj',
            callbackURL: location.href,
            loginUrl: '/login'
        })
        $httpProvider.interceptors.push('authInterceptor');
    }]);
    
    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);

    //#region Configure the zStorage
    app.config(['zStorageConfigProvider', function (cfg) {
        cfg.config = {
            enabled: true, // enable Local Storage (WIP is always enabled)
            events: events.storage,
            key: 'CRAngularBreeze', // Identifier for the app
            wipKey: 'CRAngularBreeze.wip', // Identifer for the app's 
            version: config.version, // Your app's version                                   
            appErrorPrefix: config.appErrorPrefix, // optional prefix for any error messages
            newGuid: breeze.core.getUuid // GUID function generator
        };
    }]);

    //#region Configure the Breeze Validation Directive
    app.config(['zDirectivesConfigProvider', function (cfg) {
        cfg.zValidateTemplate =
                     '<span class="invalid"><i class="fa fa-warning"></i>' +
                     '%error%</span>';
        //cfg.zRequiredTemplate =
        //    '<i class="fa-asterisk fa-asterisk-invalid z-required" title="Required"></i>';
    }]);
    //#endregion    
})();
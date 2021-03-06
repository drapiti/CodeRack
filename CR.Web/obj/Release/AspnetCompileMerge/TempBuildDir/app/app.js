﻿(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules         
        'auth0',             // configures auth0 authentication
        'breeze.angular',    // configures breeze for an angular app
        'breeze.directives', // contains the breeze validation directive (zValidate)
        'ngzWip',            // angular-breeze local storage features
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)        
    ]);
    
    // Handle routing errors and success events
    app.run(['$route', 'auth', 'breeze', 'routemediator', function ($route, auth, breeze, routemediator) {
        // Include $route to kick start the router.        
        auth.hookEvents();
        routemediator.setRoutingHandlers();     
    }]);    
})();
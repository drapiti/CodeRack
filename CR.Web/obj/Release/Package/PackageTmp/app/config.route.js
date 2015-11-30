(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            //$routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, definition) {
            // Sets resolvers for all of the routes
            // by extending any existing resolvers (or creating a new one).
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime                
            });
            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }
    
    prime.$inject = ['datacontext'];
    function prime(dc) { return dc.prime(); }    

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    requiresLogin: true,
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                    
                }            
            }, {
                url: '/hardware',
                config: {
                    title: 'hardware',
                    templateUrl: 'app/hardware/hardware.html',
                    requiresLogin: true,
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-camera"></i> Hardware'
                    }
                }
            }, {
                url: '/hardware/:id',
                config: {
                    title: 'hardwaredetail',
                    templateUrl: 'app/hardware/hardwaredetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/farmobject',
                config: {
                    title: 'farmobjects',
                    templateUrl: 'app/farmobject/farmobjects.html',
                    requiresLogin: true,
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-server"></i> Farm Objects'
                    }
                }
            }, {
                url: '/farmobject/:id',
                config: {
                    title: 'farmobjectdetail',
                    templateUrl: 'app/farmobject/farmobjectdetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/farmobject/search/:search',
                config: {
                    title: 'farmobjects-search',
                    templateUrl: 'app/farmobject/farmobjects.html',
                    requiresLogin: true,
                    settings: {}
                }        
            }, {
                url: '/network',  
                config: {
                    title: 'networks',
                    templateUrl: 'app/network/networks.html',
                    requiresLogin: true,
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-sitemap"></i> Networks'
                    }
                }
            }, {
                url: '/network/:id',
                config: {
                    title: 'networkdetail',
                    templateUrl: 'app/network/networkdetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/reservation',
                config: {
                    title: 'reservations',
                    templateUrl: 'app/reservation/reservations.html',
                    requiresLogin: true,
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-bookmark-o"></i> Reservations'
                    }
                }
            }, {
                url: '/reservation/:id',
                config: {
                    title: 'reservationdetail',
                    templateUrl: 'app/reservation/reservationdetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/link',
                config: {
                    title: 'links',
                    templateUrl: 'app/link/links.html',
                    requiresLogin: true,
                    settings: {
                        nav: 6,
                        content: '<i class="fa fa-unlink"></i> Provision Links'
                    }
                }
            }, {
                url: '/link/:id',
                config: {
                    title: 'linkdetail',
                    templateUrl: 'app/link/linkdetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/port',
                config: {
                    title: 'ports',
                    templateUrl: 'app/port/ports.html',
                    requiresLogin: true,
                    settings: {
                        nav: 7,
                        content: '<i class="fa fa-link"></i> Active Links'
                    }
                }
            }, {
                url: '/port/:id',
                config: {
                    title: 'portdetail',
                    templateUrl: 'app/port/portdetail.html',
                    requiresLogin: true,
                    settings: {}
                }           
            }, {
                url: '/lun',
                config: {
                    title: 'luns',
                    templateUrl: 'app/lun/luns.html',
                    requiresLogin: true,
                    settings: {
                        nav: 8,
                        content: '<i class="fa fa-hdd-o"></i> SAN LUNs'
                    }
                }
            }, {
                url: '/lun/:id',
                config: {
                    title: 'lundetail',
                    templateUrl: 'app/lun/lundetail.html',
                    requiresLogin: true,
                    settings: {}
                }
            }, {
                url: '/virtualdisk',
                config: {
                    title: 'virtualdisks',
                    templateUrl: 'app/virtualdisk/virtualdisks.html',
                    requiresLogin: true,
                    settings: {
                        nav: 9,
                        content: '<i class="fa fa-hdd-o"></i> Virtual Disks'
                    }
                }
            }, {
                url: '/virtualdisk/:id',
                config: {
                    title: 'virtualdiskdetail',
                    templateUrl: 'app/virtualdisk/virtualdiskdetail.html',
                    requiresLogin: true,
                    settings: {}
                }   
            }, {
                url: '/help',
                config: {
                    title: 'help',
                    templateUrl: 'app/help/help.html',
                    requiresLogin: true,
                    settings: {
                        nav: 10,
                        content: '<i class="fa fa-question"></i> Help'
                    }
                }
            }, {
                url: '/workinprogress',
                config: {
                    templateUrl: 'app/wip/wip.html',
                    title: 'workinprogress',
                    requiresLogin: true,
                    settings: {
                        content: '<i class="fa fa-asterisk"></i> Work In Progress'
                    }
                }
            }, {
                url: '/login',
                config: {
                    title: 'login',
                    templateUrl: 'app/login/login.html',                    
                    settings: {}
                }
            }
        ];
    }
})();
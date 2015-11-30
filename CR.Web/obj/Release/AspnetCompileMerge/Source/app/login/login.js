(function () {
    'use strict';
    var controllerId = 'login';
    angular.module('app').controller(controllerId, ['$scope', 'auth', 'common', login]);

    function login($scope, auth, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;
        vm.title = 'Account Details';
        $scope.auth = auth;
                            
        activate();
        
        function activate() {
            common.activateController(authenticate(), controllerId)
                .then(function () { log('Activated User View'); });
        }

        function authenticate() {
           auth.signin({
                popup: true,     
                connections: ['DatabaseUser'],
                showSignup: false,
                showForgot: true,
                icon: '../../images/intesa.jpg',
                showIcon: true,
                dict: 'en'
           });           
        }
    }
})();
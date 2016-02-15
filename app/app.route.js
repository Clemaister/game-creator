app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    
    .when('/', {
        templateUrl : 'app/components/rpg-builder/rpgBuilderView.html',
        controller  : 'rpgBuilderController'
    })
    
    .when('/player', {
        templateUrl : 'app/components/player/playerView.html',
        controller  : 'playerController'
    })
    
    .otherwise({redirectTo: '/'});
    
    $locationProvider.html5Mode(true);

}]);
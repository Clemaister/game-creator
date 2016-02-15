app.directive("actionBar", function($location){
    return {
        restrict: "AE",
        scope:{
            title: "@",
            genre: "="
        },
        templateUrl: "app/shared/action-bar/actionBarView.html",
        link: function (scope, element, attr) {
            
            
        }
    }
});
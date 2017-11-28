var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	    .when('/', {
	    	templateUrl: 'partials/login.html'
	    })
	    .otherwise({
	    	redirectTo: '/'
	    });
}]);


// ***** -> uncomment and define the controller function here

//app.controller('LoginCtrl', ['$scope', '$resource',
//	function($scope, $resource){
//	}]);
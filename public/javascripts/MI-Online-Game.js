var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','facebook']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

/* Facebook */
app.config(function(FacebookProvider) {
	FacebookProvider.init('364525113975028');
})

app.controller('facebookCtrl',['$scope','Facebook', function ($scope, Facebook) {
	$scope.loginStatus = 'disconnected';
	$scope.facebookIsReady = false;
	$scope.user = null;
	$scope.login = function () {
		Facebook.login(function(response) {
			$scope.loginStatus = response.status;
		});
	};
	$scope.removeAuth = function () {
		Facebook.api({
			method: 'Auth.revokeAuthorization'
		}, function(response) {
			Facebook.getLoginStatus(function(response) {
				$scope.loginStatus = response.status;
			});
		});
	};
	$scope.api = function () {
		Facebook.api('/me', function(response) {
			$scope.user = response;
		});
	};
	$scope.$watch(function() {
		return Facebook.isReady();
	}, function(newVal) {
		if (newVal) {
			$scope.facebookIsReady = true;
		}
	}
	);
}]);


// ***** -> uncomment and define the controller function here

//app.controller('LoginCtrl', ['$scope', '$resource',
//	function($scope, $resource){
//	}]);

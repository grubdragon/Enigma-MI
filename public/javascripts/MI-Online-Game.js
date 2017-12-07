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

app.controller('facebookCtrl',['$rootscope','Facebook', function ($rootscope, Facebook) {
	$rootscope.loginStatus = 'disconnected';
	$rootscope.facebookIsReady = false;
	$rootscope.user = null;
	$rootscope.login = function () {
		Facebook.login(function(response) {
			$rootscope.loginStatus = response.status;
		});
	};
	$rootscope.removeAuth = function () {
		Facebook.api({
			method: 'Auth.revokeAuthorization'
		}, function(response) {
			Facebook.getLoginStatus(function(response) {
				$rootscope.loginStatus = response.status;
			});
		});
	};
	$rootscope.api = function () {
		Facebook.api('/me', function(response) {
			$rootscope.user = response;
		});
	};
	
	$rootscope.$watch(
		function() {
			return Facebook.isReady();
		},
		function(newVal) {
			if (newVal)
				$rootscope.facebookReady = true;
		}
		);

	var userIsConnected = false;

	Facebook.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			userIsConnected = true;
		}
	});

      /**
       * IntentLogin
       */
       $rootscope.IntentLogin = function() {
       	if(!userIsConnected) {
       		$rootscope.login();
       	}
       };

      /**
       * Login
       */
       $rootscope.login = function() {
       	Facebook.login(function(response) {
       		if (response.status == 'connected') {
       			$rootscope.logged = true;
       			$rootscope.me();
       		}

       	});
       };

       $rootscope.logout = function() {
       	Facebook.logout(function() {
       		$rootscope.$apply(function() {
       			$rootscope.user   = {};
       			$rootscope.logged = false;  
       		});
       	});
       }




   }]);


// ***** -> uncomment and define the controller function here

//app.controller('leaderboard', ['$rootscope', '$resource', 'location',
	//function($rootscope, $resource){

		
 	//}]);

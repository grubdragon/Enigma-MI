var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','facebook']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html'
	})
	.when('/leaderboard', {
		templateUrl: 'partials/leaderboard.html',
		controller: 'leaderboardCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

/* Facebook */
app.config(function(FacebookProvider) {
	FacebookProvider.init('364525113975028');
})

app.controller('facebookCtrl',['$rootScope','Facebook', function ($rootScope, Facebook) {
	$rootScope.loginStatus = 'disconnected';
	$rootScope.facebookIsReady = false;
	$rootScope.user = {};
	$rootScope.login = function () {
		Facebook.login(function(response) {
			$rootScope.loginStatus = response.status;
		});
	};
	$rootScope.removeAuth = function () {
		Facebook.api({
			method: 'Auth.revokeAuthorization'
		}, function(response) {
			Facebook.getLoginStatus(function(response) {
				$rootScope.loginStatus = response.status;
			});
		});
	};
	$rootScope.api = function () {
		Facebook.api('/me', function(response) {
			$rootScope.user = response;
		});
	};
	
	$rootScope.$watch(
		function() {
			return Facebook.isReady();
		},
		function(newVal) {
			if (newVal)
				$rootScope.facebookReady = true;
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
       $rootScope.IntentLogin = function() {
       	if(!userIsConnected) {
       		$rootScope.login();
       	}
       };

      /**
       * Login
       */
       $rootScope.login = function() {
       	Facebook.login(function(response) {
       		if (response.status == 'connected') {
       			$rootScope.logged = true;
       			$rootScope.me();
       		}

       	});
       };

       $rootScope.logout = function() {
       	Facebook.logout(function() {
       		$rootScope.$apply(function() {
       			$rootScope.user   = {};
       			$rootScope.logged = false;  
       		});
       	});
       }




   }]);
//app.factory('board', function($resource){
//	var data
//})

// ***** -> uncomment and define the controller function here

app.controller('leaderboardCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http, $location){
	$rootScope.Leaderboard = function(){
		var user = {
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		};
		var Check = $rootScope('/check');
		Check.save(user, function(res){
			var board = $resource('/api/leaderboard');
			board.post(user, function(res){
				$resource.user_db = res;
			}, function(err){

			});
		},
		function(err){
			$location.path('/');
		});
		

		
			

	}

}]);

app.controller('answerCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	

	}]);

app.controller('questionCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http, $routeParam, $location){
	var user = {
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		};
	var level = $rootScope.user.level;

	$rootScope.Question = function(user){
		

		var Check = $rootScope('/check');
		Check.save(user, function(res){
			
			var Questions = $resource('/:levelreq', { level:'@levelreq'},{
				update:{ method:'POST'}
			});
			Questions.post(level, function(res){
				$rootScope.question = res;
			}, function(err){})
		}, function(err){
			$location.path('/')
		});
	
	$rootScope.Answer = function(){
		var answer = {
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid,
			"level" : $rootScope.user.level,
			"ans" : $rootScope.user.ans
		};
		var Check = $rootScope('/check');
		Check.save(user, function(res){
			var Answer = $resource('submit/:level', { level:'@level'}, {update:{method:'POST'}});
			Answer.post(answer, function(res){
				$rootScope.ans = res; 
			})
		},function(err){})

	}

	}
}]);


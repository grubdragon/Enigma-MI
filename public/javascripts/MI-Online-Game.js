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

app.controller('leaderboardCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Leaderboard = function(){
		var user = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};

		$http.post('/check', user, config)
			.success(function(response, user, config){
				$http.post('/api/leaderboard', user, config).then(
					function(response, user, config){
						$rootScope.user_db =response
					})
			});
			/*.success(function(user, response, config, $rootScope){
				var board = $resource('/api/leaderboard', {},
					update: {
						method: 'POST',
						transformRequest: function (user){
							return angular.toJson(user);
						}
					});
			});*/

	}

}]);

app.controller('answerCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Answer = function(){
		var answer = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid,
			"level" : $rootScope.user.level,
			"ans" : $rootScope.user.ans
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		$http.post('/submit/:level', answer, config)

	}

	}]);

app.controller('questionCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Question = function(){
		var user = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};

		$http.post('/:levelReq', user, config);

	}
}]);

/*app.controller('leaderboardCtrl', ['$rootScope', '$resource', '$location', '$routeParams',
    function($rootScope, $resource, $location, $routeParams){
    	var user = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		});	
        var Leaderboard = $resource('/api/leaderboard', {user.firstName:"@firstName"}, {user.lastName:"@lastName"}, {user.fbid:"@fbid"} {
            update: { method: 'POST' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $rootScope.video = video;
        });

        $rootScope.save = function(){
            Videos.update($rootScope.video, function(){
                $location.path('/');
            });
        }
    }]);*/
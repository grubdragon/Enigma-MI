var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','facebook']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html',
		controller: 'facebookCtrl'
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

app.controller('facebookCtrl',['$rootScope','$http','Facebook', function ($rootScope, $http, Facebook) {
	// Define user empty data :/
	$rootScope.user = {};

      // Defining user logged status
      $rootScope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $rootScope.byebye = false;
      $rootScope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
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
       	console.log("IntentLogin called");
       	if(!userIsConnected) {
       		console.log("IntentLogin body");
       		$rootScope.login();
       	}
       	else{
                  $rootScope.me();
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
       
       /**
        * me 
        */
        $rootScope.me = function() {
        	Facebook.api('/me', function(response) {
            /**
             * Using $rootScope.$apply since this happens outside angular framework.
             */
             $rootScope.$apply(function() {
                  $rootScope.user = response;
            });
             var data = response;
             console.log(data);
             $http.post("/api/users/check", data)
             .success(function (data, status, headers, config) {
                  $scope.go = function ( path ) {
                        $location.path( path );
                  };
            })
             .error(function (data, status, header, config) {
             });


             
             console.log("me: "+JSON.stringify(response));

       });
        };

      /**
       * Logout
       */
       $rootScope.logout = function() {
       	Facebook.logout(function() {
       		$rootScope.$apply(function() {
       			$rootScope.user   = {};
       			$rootScope.logged = false;  
       		});
       	});
       }

      /**
       * Taking approach of Events :D
       */
       $rootScope.$on('Facebook:statusChange', function(ev, data) {
       	console.log('Status: ', data);
       	if (data.status == 'connected') {
       		$rootScope.$apply(function() {
       			$rootScope.salutation = true;
       			$rootScope.byebye     = false;    
       		});
       	} else {
       		$rootScope.$apply(function() {
       			$rootScope.salutation = false;
       			$rootScope.byebye     = true;

            // Dismiss byebye message after two seconds
            $timeout(function() {
            	$rootScope.byebye = false;
            }, 2000)
      });
       	}


       });




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
	}

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
            },function(err){});

      }
}]);


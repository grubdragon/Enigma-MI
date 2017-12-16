/* collapsing navbar stuff */
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});

/*angular stuff*/
var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','ngSanitize','facebook']);

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
	.when('/register', {
		templateUrl: 'partials/register.html',
		controller: 'regCtrl'
	})
	.when('/game', {
		templateUrl: 'partials/storyline.html',
		controller: 'questionCtrl'
	})
  .when('/rules', {
    templateUrl: 'partials/rules.html',
    controller: 'rulesCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);

/* Facebook */
app.config(function(FacebookProvider) {
	FacebookProvider.init('364525113975028');
})

app.controller('facebookCtrl',['$rootScope', '$resource','$location','Facebook', '$timeout', function ($rootScope, $resource, $location, Facebook, $timeout) {
	// Define user empty data :/
  $rootScope.show_nav=false;
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

             var send_user = {
               "fbid" : $rootScope.user.id
             };

             var Check = $resource('/api/users/check');
             Check.save(send_user, function(res){
               console.log("res log kiya: "+JSON.stringify(res));
               if(res.error && res.serverGenerated){
                console.log("error hua");
                $location.path('/register')
              }     
              else{
                console.log("mein yaha aaya tha");
                $location.path('/game');
              }
            }, function(err){
             $location.path('/');
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

app.controller('leaderboardCtrl', ['$rootScope', '$scope', '$resource', '$location', 'Facebook', function($rootScope, $scope, $resource, $location, Facebook){
	$rootScope.show_nav=true;
  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected') {
      $location.path('/');
    }
    else{
      Facebook.api('/me', function(response) {
            /**
             * Using $rootScope.$apply since this happens outside angular framework.
             */
             $rootScope.$apply(function() {
              $rootScope.user = response;
            });

             var send_user = {
               "fbid" : $rootScope.user.id
             };

             var Check = $resource('/api/users/check');
             Check.save(send_user, function(res){
               console.log("res log kiya: "+JSON.stringify(res));
               if(res.error && res.serverGenerated){
                console.log("error hua");
                $location.path('/register')
              }     
              else{
                console.log("mein yaha aaya tha");
                console.log(res);
                $rootScope.user = res;
                var board = $resource('/api/users/leaderboard');
                board.save(send_user, function(res){
                 if(res.error && res.serverGenerated){
                  console.log("error hua");
                  $location.path('/');
                }     
                else{
                  console.log(res);
                  $scope.ranklist = res;
                }
              }, function(err){
                $location.path('/');
              });
              }
            }, function(err){
             $location.path('/');
           });             
             console.log("me: "+JSON.stringify(response));
           });
    }
  });

}]);

app.controller('regCtrl', ['$rootScope','$scope', '$resource','$location','Facebook', function($rootScope, $scope, $resource, $location, Facebook){
  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected' || !($rootScope.user) ) {
      $location.path('/');
    }
    else{

    }
  });
  $rootScope.register = function() {
    $rootScope.show_nav=false;
    Facebook.getLoginStatus(function(response) {
      if (response.status != 'connected' || !($rootScope.user) ) {
        $location.path('/');
      }
      else{
        console.log("register called");
        console.log($rootScope.user.id);
        var fbid=$rootScope.user.id;
        var send_user = {
          "firstName": $scope.firstName,
          "lastName": $scope.lastName,
          "username": $scope.username,
          "phone_no": $scope.phone,
          "fbid": fbid,
          "email": $scope.email
        };

        var Register=$resource('/api/users/create');
        Register.save(send_user, function(res){
          if(res.success){
            $location.path('/game');      
          }
          else{
            $location.path('/');      
          }                              

        }, function(err){

        });
      }
    });
  };
}]);

app.controller('questionCtrl', ['$scope','$rootScope', '$resource','$route', '$templateCache','$http','$location', 'Facebook', function($scope,$rootScope, $resource, $route, $templateCache, $http, $location, Facebook){
  $rootScope.show_nav=true;
  $scope.tab = 1;
  $scope.currentQuestion={};
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected') {
      $location.path('/');
    }
    else{
      Facebook.api('/me', function(response) {
            /**
             * Using $rootScope.$apply since this happens outside angular framework.
             */
             $rootScope.$apply(function() {
              $rootScope.user = response;
            });

             var send_user = {
               "fbid" : $rootScope.user.id
             };

             var Check = $resource('/api/users/check');
             Check.save(send_user, function(res){
               console.log("res log kiya: "+JSON.stringify(res));
               if(res.error && res.serverGenerated){
                console.log("error hua");
                $location.path('/register')
              }     
              else{
                console.log("mein yaha aaya tha");
                console.log(res);
                $rootScope.user = res;
                $scope.Question();
              }
            }, function(err){
             $location.path('/');
           });             
             console.log("me: "+JSON.stringify(response));
           });
    }
  });

  $scope.Question = function(){
    var Check = $resource('/api/users/check');
    Check.save($rootScope.user, function(res){

     var Questions = $resource('/api/questions/levelFetch');

     Questions.save({
      "firstName" : $rootScope.user.firstName,
      "lastName" : $rootScope.user.lastName,
      "fbid" : $rootScope.user.fbid,
      "level" : $rootScope.user.level
    }, function(res){
      $scope.currentQuestion = res;
      console.log($scope.currentQuestion);
    }, function(err){
      $location.path('/');
    });

   }, function(err){
     $location.path('/');
   });
  };

  $scope.Answer = function(){
    console.log($rootScope.user);
    var send_user = {
      "firstName" : $rootScope.user.firstName,
      "lastName" : $rootScope.user.lastName,
      "fbid" : $rootScope.user.fbid,
      "level" : $rootScope.user.level,
      "ans" : $scope.answer
    };
    
    var Check = $resource('/api/users/check');
    Check.save($rootScope.user, function(res){

      var Answer = $resource('/api/questions/submit');
      Answer.save(send_user, function(res){
        if(res.success && res.serverGenerated){
          var currentPageTemplate = $route.current.templateUrl;
          $templateCache.remove(currentPageTemplate);
          $rootScope.user.level+=1;
          $route.reload();
        }
        else if(!res.success){
          var element = document.getElementById("answer");
        }
      });

    },function(err){
      $location.path('/');
    });

  };


}]);

app.controller('rulesCtrl', ['$rootScope', '$scope', '$resource', '$location', 'Facebook', function($rootScope, $scope, $resource, $location, Facebook){
  $rootScope.show_nav=true;
  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected') {
      $location.path('/');
    }
    else{
      Facebook.api('/me', function(response) {
            /**
             * Using $rootScope.$apply since this happens outside angular framework.
             */
             $rootScope.$apply(function() {
              $rootScope.user = response;
            });

             var send_user = {
               "fbid" : $rootScope.user.id
             };

             var Check = $resource('/api/users/check');
             Check.save(send_user, function(res){
               console.log("res log kiya: "+JSON.stringify(res));
               if(res.error && res.serverGenerated){
                console.log("error hua");
                $location.path('/register')
              }     
              else{
                console.log("mein yaha aaya tha");
                console.log(res);
                $rootScope.user = res;
              }
            }, function(err){
             $location.path('/');
           });             
             console.log("me: "+JSON.stringify(response));
           });
    }
  });

}]);

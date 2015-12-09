// Script for Angular controllers

'use strict';

angular.module('MainApp', ['ngSanitize', 'ui.router','ui.bootstrap','firebase'])
.config(function($stateProvider,$urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/', //"root" directory
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})

		.state('about', {
			url: '/about',
			templateUrl: 'partials/about.html',
			controller:'AboutCtrl'
		})

		.state('recruit', {
			url: '/recruit',
			templateUrl: 'partials/recruit.html',
			controller: 'RecruitCtrl'
		})

		.state('gallery', {
			url: '/gallery',
			templateUrl: 'partials/gallery.html',
			controller: 'GalleryCtrl'
		})

		.state('philanthropy', {
			url: '/philanthropy',
			templateUrl: 'partials/philanthropy.html',
			controller: 'PhilanthropyCtrl'
		})

		.state('contact', {
			url: '/contact',
			templateUrl: 'partials/contact.html'
		})

		.state('admin', {
			url: '/admin',
			templateUrl: 'partials/admin.html'
		})

	// For any unmatched url, redirect to "home"
	$urlRouterProvider.otherwise('/');

})

//Controller for Home page
.controller('HomeCtrl', ['$scope','$http','$uibModal', function($scope, $http, $uibModal) {
 	$scope.eventDetail = function() {
			//show modal!
			var modalInstance = $uibModal.open({
			   templateUrl: 'partials/event-detail-modal.html',
			   controller: 'EventModalCtrl',
			   scope: $scope //pass in all our scope variables!
			});
 	}
}])

.controller('EventModalCtrl',['$scope','$http','$uibModalInstance', function($scope, $http, $uibModalInstance) {
  //when hit cancel, close
  $scope.cancel = function () {
     $uibModalInstance.dismiss('cancel');
  };
}])

//Controller for About page
.controller('AboutCtrl', ['$scope', '$http', function($scope, $http) {

}])

//Controller for Recruit page
.controller('RecruitCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', function($scope, $http, $firebaseArray, $firebaseObject) {


	// Create a new instance of the Mandrill class from the mandrill
	// library. It takes one parameter, the API key
	var m = new mandrill.Mandrill('Fi1hgj6aNP06OJfjfPQZ2Q');

	// create a variable for the API call
	$scope.content = {
		"message": {
			"from_email":"jake.therrien13@gmail.com",
			"to":[{"email":"jake.therrien13@gmail.com"}],
			"subject":"New Rushee for Pi Kappa Phi",
			"text":"This is my first time using Mandrill!"
		}
	};

	$scope.updateContent = function() {
		console.log($scope.fromEmail)
		$scope.content.message.subject = "Rush Contact: " + $scope.name;
		$scope.content.message.from_email = $scope.fromEmail;
		$scope.content.message.text = "New rushee " + $scope.name + " from " + $scope.school + 
			" high school. His high school graduation year is " + $scope.gradYear + 
			". You can reach him at " + $scope.phone + ".";  
		$scope.sendTheMail();
	}

	// send the email
	$scope.sendTheMail = function() {
		m.messages.send($scope.content);
		console.log("email sent successfully!");
	};

	var ref = new Firebase("http://pkpwebsite.firebaseio.com");
	var recruitRef = ref.child('recruit');
	$scope.recruit = $firebaseArray(recruitRef);

	// adds the recruits to a recruit database in firebase
	$scope.addRecruit = function() {
		$scope.recruit.$add({
			name: $scope.name,
			email: $scope.fromEmail,
			phonenumber: $scope.phone
		})
	};



}])

//Controller for Gallery page
.controller('GalleryCtrl', ['$scope', '$http', function($scope, $http) {

}])

//Controller for Philanthropy page
.controller('PhilanthropyCtrl', ['$scope', '$http', function($scope, $http) {

}])

//Controller for Admin page
.controller('AdminCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth',
	function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {

	// reference to app
    var ref = new Firebase("http://pkpwebsite.firebaseio.com");

	var Auth = $firebaseAuth(ref);

    //reference to a value in the JSON in the Sky
    var announceRef = ref.child('announcement');
    var eventsRef = ref.child('event');
    var officerRef = ref.child('officer');

    $scope.announce = $firebaseArray(announceRef);
    $scope.events = $firebaseArray(eventsRef);
    $scope.officers = $firebaseArray(officerRef);

    $scope.newAnnounce = {};
    $scope.newEvent = {};

    $scope.addAnnounce = function() {
    	var newAnnounceInfo = {
        'description': $scope.newAnnounce.description,
        'date': $scope.newAnnounce.date

        }
    	$scope.announce.$save();
    }

     $scope.addEvent = function() {
    	var newEventInfo = {
        'title': $scope.newEvent.title,
    		'location': $scope.newEvent.location,
    		'date': $scope.newEvent.date,
    		'time': $scope.newEvent.time, 
    		'description': $scope.newEvent.description
    	}
    	$scope.events.$save();
    }


	$scope.signIn = function() {
	    var promise = Auth.$authWithPassword({
	      'email': $scope.admin.email,
	      'password': $scope.admin.password
	    });
    	return promise;
  	}

	//Make LogOut function available to views
	$scope.logOut = function() {
		Auth.$unauth(); //"unauthorize" to log out
	};

  	//Any time auth status updates, set the userId so we know
  	Auth.$onAuth(function(authData) {
    	if(authData) { //if we are authorized
      		$scope.userId = authData.uid;
      		console.log('logged in')
    	} else {
      	$scope.userId = undefined;
    	}
  	});

  	//Test if already logged in (when page load)
  	var authData = Auth.$getAuth(); //get if we're authorized
  		if(authData) {
    	$scope.userId = authData.uid;
  	}

}])









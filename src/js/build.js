/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var gitHubApp = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	* Current Application do not use authentification 
	* therefore number of requests limited by 60 per hour.
	*/

	var gitHubController = angular.module('gitHubController', []);

	__webpack_require__(2);
	__webpack_require__(3);

	var app = angular.module('GitHubApp',[
	   	'ngTagsInput',
	   	'gitHubController',
	   	'gitHubService'
	]);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	/**
	* Service for initialization, storing info, and interacting with user data
	*/

	var gitHubService = angular.module('gitHubService',[])

	gitHubService.factory('GitHubService',['$http', function($http){

	   var service = {
	      users: [],
	      reposFound: false,
	      doNotInteract: false,


	      /* 
	      * Method to fetch main information about user.
	      * After success fetch user repositories.
	      */
	      userRequest: function(username, newNames) {
	         return $http({
	            method: "GET",
	            url: "https://api.github.com/users/" + username
	         })
	         .success(function (data) {
	            // Yes. Name could be unavailable.
	            if (data.name == null) data.name = data.login;
	            /*Call repositories request*/

	            service.reposRequest(username,data);
	         })
	         .error(function (err,status) {
	            // Push 'Not-Found username' just to show it in UI
	            service.users.push({
	               'username':username,
	               available: false,
	               stargazers: -1,
	               repos: [],
	               err: status == 403 ? 'Query Limit Was Reached' : 'No Such User Info Found'
	            });

	            service.uiReload();
	         });

	      },

	      /**
	      * Method to fetch the list of user repositories
	      * As API said it could show maximum 100 repositories by one request. 
	      * Therefore, to receive all repos - should implement pagination on UI 
	      * or implement query loop while get all repos.
	      */
	      reposRequest: function(username,user_data) {
	         var self = this;
	         return $http({
	            method: "GET",
	            url: "https://api.github.com/users/" + username + "/repos?per_page=100" 
	         })
	         .success(function(data){
	            var starsCount = 0;

	            service.reposFound = data.length > 0;

	            // If repositories available: count its stars
	            if ( service.reposFound ) {
	               angular.forEach(data, function(i,index){
	                  starsCount += i.stargazers_count;
	               })
	            }

	            // Push new git user to array
	            service.users.push({
	               'username': username,
	               'user_data':user_data,
	               repos: data,
	               stargazers: starsCount,
	               available: true
	            });

	            service.uiReload();

	         })
	         .error(function(err,status){
	            console.log(err,status)
	         });

	      },

	      /*
	      * When added new username aka $tag
	      */
	      addNewUser: function() {
	         // Needed to not call service
	         service.doNotInteract = false;
	         return;
	      },


	      /*
	      * When delete username aka $tag
	      */
	      deleteUser: function (tag_name) {
	         service.doNotInteract = true;

	         var deleteUser = tag_name.user_name;

	         angular.forEach(service.users,function (i,index) {
	            if ( service.users[index].username === deleteUser ) {
	               service.users.splice(index,1)
	               return;
	            }

	         })

	         service.uiReload()

	      },

	      // DOM manipulation
	      uiReload: function() {
	         setTimeout(function(){
	            jQuery('.hoverable').removeClass('first');
	            jQuery('.hoverable:first').addClass('first');
	            jQuery('.user-block').addClass('col-md-3') 
	            jQuery('.user-block:first').removeClass('col-md-3') 
	         },50)

	      }

	   };


	   return service;
	  
	}]);

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	/**
	* GitHubController responsible for assigning service to local scope 
	* and write watcher for users aka $tags collection.
	*/

	var gitHubController = angular.module('gitHubController');

	gitHubController.controller('GitHubController',['$scope','GitHubService',
	   function($scope, GitHubService){

	      $scope.gitService = GitHubService;

	      // Watcher for inputed users
	      $scope.$watchCollection('username', function(newNames,oldNames) { 

	         if (newNames && newNames.length >= 1 && !GitHubService.doNotInteract) {
	            var currentUser = newNames[newNames.length-1].user_name;
	            
	            // Call service to fetch data
	            GitHubService.userRequest(currentUser, newNames);

	         }

	      });

	}]);

/***/ }
/******/ ]);
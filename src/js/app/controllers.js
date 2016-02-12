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
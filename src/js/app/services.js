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
         .then(function (response) {

            // Yes. Name could be unavailable.
            if (response.data.name == null) response.data.name = response.data.login;

            /*Call repositories request*/
            return service.reposRequest(username,response.data)

         })
         .catch(function (response) {
            if (response.status == 404) {
               service.users.push({
                  'username':username,
                  available: false,
                  stargazers: -1,
                  repos: [],
                  err: response.status == 404 ? 'No Such User Info Found' : 'Query Limit Was Reached'
               });  
            }
         })
         .finally(function () {
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
         .then(function(response){
            var starsCount = 0;

            service.reposFound = response.data.length > 0;

            // If repositories available: count its stars
            if ( service.reposFound ) {
               angular.forEach(response.data, function(i,index){
                  starsCount += i.stargazers_count;
               })
            }

            // Push new git user to array
            service.users.push({
               'username': username,
               'user_data':user_data,
               repos: response.data,
               stargazers: starsCount,
               available: true
            });
            
         })
         .finally(function () {
           service.uiReload();
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
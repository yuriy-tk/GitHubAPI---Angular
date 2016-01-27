   /*
   * Current Application do not use authentification 
   * therefore numver of requests limited by 60 per hour.
   */
   
   var app = angular.module('GitHubApp',['Services','ngTagsInput']);

   /*
   * Service for initialization, storing info, and interacting with user data
   */
   angular.module('Services',[]).factory('GithubService',function($rootScope,$http){

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
               console.log(err,status)
               // Push 'Not-Found username' just to show it in UI
               service.users.push({
                  username,
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
                  username,
                  user_data,
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

            // var users = $rootScope.users;
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
     
   });
   
   /*
   * GitHubController responsible for assigning service to local scope 
   * and write watcher for users aka $tags collection.
   */
   app.controller('GitHubController',function($scope, GithubService){

      $scope.gitService = GithubService;

      // Watcher for inputed users
      $scope.$watchCollection('username', function(newNames,oldNames) { 

         if (newNames && newNames.length >= 1 && !GithubService.doNotInteract) {
            var currentUser = newNames[newNames.length-1].user_name;
            
            // Call service to fetch data
            GithubService.userRequest(currentUser, newNames);

         }

      });



   });
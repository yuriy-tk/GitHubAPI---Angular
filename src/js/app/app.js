'use strict';
/**
* Current Application do not use authentification 
* therefore number of requests limited by 60 per hour.
*/

var gitHubController = angular.module('gitHubController', []);

require('./services.js');
require('./controllers.js');

var app = angular.module('GitHubApp',[
   	'ngTagsInput',
   	'gitHubController',
   	'gitHubService'
]);
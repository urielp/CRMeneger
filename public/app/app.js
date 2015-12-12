/**
 * Created by Uriel on 04/12/2015.
 */
angular.module('userApp' ,[
    'ngAnimate',//to add animation to all of our angular directive(mainly show,hide)
    'app.routes',//will be the routing for our application
    'authService',//authentication service
    'mainCtrl',//our main controller
    'userCtrl',//user management controller
    'userService'//user services
])
    //application configuration to integrate token into requests
    .config(function($httpProvider)
    {
        //attach our auth interceptor to the http request
        //since we want to keep the token as long as the user using the srvices
        $httpProvider.interceptors.push('AuthInterceptor');
    });
/**
 * Created by Uriel on 30/11/2015.
 */
angular.module('authService' , [ ])
//============================================
//auth factory to login and get information
//inject $http for comunicating with the API
//inject $q to return promise objects
//inject AuthToken to mange tokens
//============================================


    .factory('Auth',function($http,$q,AuthToken) {

        //create auth factory object
        var authFactory = {};

        //login
        authFactory.login = function(username,password)
        {
            return $http.post('/api/authenticate',
                {
                    username:username,
                    password:password
                })
                .success(function(data)
                {
                    AuthToken.setToken(data.token);
                    return data;
                });
        };
        //logout
        authFactory.logout = function()
        {
            AuthToken.setToken();
        }

        //check if user is logged in
        authFactory.isLoggedIn = function ()
        {
            if(AuthToken.getToken())
            {
                return true;
            }
            else
            {return false;}
        };
        //get user info
        authFactory.getUser = function()
        {
            if(AuthToken.getToken())
            {
                return $http.get('/api/me',{cache:true});

            }
            else
            {
                return $q.reject({message:'User has no token.'});
            }
            /*Old code
             if(AuthToken.getToken())
             {
             return $http.get('/api/me');

             }
             else
             {return $q.reject({message:'User has no token.'});}
             */
        };

        //return authFactory
        return authFactory;
    })

//===========================================
//factory for handeling tokens
//inject $window so tore token client side
//===========================================
    .factory('AuthToken',function($window)
    {
        var authTokenFactory = {};
        //get the token
        authTokenFactory.getToken = function()
        {
            return $window.localStorage.getItem('token');
        };

        //finction to set or clear token
        //if token is passed , set the token
        //if there is no token , clear it from local storage

        authTokenFactory.setToken = function(token)
        {
            if(token)
            {
                $window.localStorage.setItem('token',token);
            }
            else
            {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })


//============================================
//application configuration to integrate token into requests

    .factory('AuthInterceptor',function($q,AuthToken)
    {
        var interceptorFactory = {};

        //this will happen to all HTTP requests
        interceptorFactory.request = function(config)
        {
            //grab the token
            var token = AuthToken.getToken();
            if(token)
            {
                config.headers['x-access-token'] = token;
            }
            return config;

        };
        //happen on response errors
        interceptorFactory.responseError = function (response)
        {
            //if server returns a 403 forbidden response
            if(response.status == 403)
            {
                AuthToken.setToken();
                //redirect if token doesn't autenticate
                $location.path('/login');
            }

            //return the error from the server as a promise
            return $q.reject(response);
        }


        return interceptorFactory;
    });
/**
 * Created by Uriel on 04/12/2015.
 */
angular.module('mainCtrl' , [])

.controller('mainController',function($rootScope,$location,Auth)
    {
        var vm=this;

        //get info of a person is logged in
        vm.loggedIn = Auth.isLoggedIn();

        //check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            // get user information on page load
            Auth.getUser()
                .then(function(data) {
                    vm.user = data.data;
                });
        });

        //function to handel login form
        vm.doLogin = function()
        {
            vm.processing =true;
            vm.error ='';

            Auth.login(vm.loginData.username,vm.loginData.password)
                .success(function(data){
                    console.log('1');
                    vm.processing=false;
                    //if user successfully logged in,he will be redirect to users page
                    if (data.success) {
                        $location.path('/users');
                        console.log('routing to user page');
                    }
                    else {
                        vm.error = data.message;
                        console.log(vm.loginData.username);
                    }
                });
        };

        //function to handel logging out
        vm.doLogout = function()
        {
            Auth.logout();
            //reset all user info
            vm.user={};
            $location.path('/login');
        };

    });
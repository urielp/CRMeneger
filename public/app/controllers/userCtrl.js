/**
 * Created by Uriel on 04/12/2015.
 */
angular.module('userCtrl' , ['userService'])

//user controller for main page
//inject the User factory
.controller('userController',function(User)
    {
        var vm = this;
        //set a processing variable to show loading things
        vm.processing =true;

        //grab all users at the page load
        User.all()
            .success(function(data)
            {
                //when a;; the users came back,remove processing variable
                vm.processing =false;

                //bind the users that come back to vm.users
                vm.users=data;

            });

        vm.deleteUser = function(id)
        {
            vm.processing=true;
            User.delete(id)
                .success(function(data)
                {
                    //get all users to update the table

                    User.all()
                        .success(function(data)
                        {
                            vm.processing=fals;
                            vm.users=data;
                        })
                })
        }

    })
    .controller('userCreateController',function(user)
    {
        var vm =this;

        //variable to hide/show elements of the view
        //diferentiates between create or edit pages
        vm.type ='create';

        //function to create a user
        vm.saveUser=function()
        {
            vm.processing=ture;
            //clear message
            vm.message ='';

            //use the create function in the userService

            User.create(vm.userData)
                .success(function(data)
                {
                    vm.processing =false;

                    //clear the form
                    vm.userData = {};
                    vm.message=data.message;
                });
        };
    })


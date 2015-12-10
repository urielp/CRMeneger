/**
 * Created by Uriel on 28/11/2015.
 */

//name of our angular app

angular.module('firstApp',[]).controller('mainController',function()
{
    //bind this to view model
    var vm=this;

    //define variavbles and objects on this
    //this let them be avilable to our views

    vm.message ='Hey there ! Come and see how good i look!';

    //define list of items

    vm.computers =
        [
            {name:'MacBook Pro',color:'Silver',nerdness:7},
            {name:'Yoga 2 Pro',color:'Gray',nerdness:6},
            {name:'ChromeBook',color:'Black',nerdness:5}

        ];


    vm.computerData = {};
    vm.addComputer=function()
    {
        //add computer to the list
        vm.computers.push(
            {
                name:vm.computerData.name,
                color:vm.computerData.color,
                nerdness:vm.computerData.nerdness
            }
        );
    }

    //after computer has been added clear the form
    vm.computerData ={};

});

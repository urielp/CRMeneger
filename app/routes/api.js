/**
 * Created by Uriel on 30/11/2015.
 */
var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt =require('jsonwebtoken');
var config =require('../../config');

//super secret for creating tokens
var superSecret =config.secret;

module.exports = function (app,express)
{

    var apiRouter = express.Router();

    apiRouter.post('/authenticate',function(req,res)
    {
        //find the user
        //select the suer name and password explicity
        User.findOne({
            username:req.body.username
        }).select('name username password').exec(function(err,user)
        {
            if (err) throw err;
            //no user with that username was found
            if(!user)
            {
                res.json({success:false,message:'Authentication failed,User was not found'});
            }
            else if(user)
            {
                //check if password match
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword)
                {
                    res.json({success:false,message:'Authontication falied.Wrong password'});
                }
                else
                {
                    //if user was authenticated
                    var token = jwt.sign({
                        name: user.name,
                        username:user.username},superSecret,{expiresIn:1440 //expires in 24 hours}
                    });
                    //return the information include token as JSON
                    res.json({success:true,message:'Enjoy Your Token', token:token});
                }
            }
        });
    });

    //middleware to use for all requests
    apiRouter.use(function(req,res,next)
    {
        //do some logging
        console.log('Somebody just came to our APP!');
        console.log('##'+req.body.token + '||' + req.query.token + ' || ' + req.headers['x-access-token']);
        //this is where we will  authenticate users
        //by headers or URL param
        var token = req.body.token || req.query.token|| req.headers['x-access-token'];

        //decoding the token
        if(token)
        {
            jwt.verify(token,superSecret,function(err,decoded)
            {
                if(err)
                {
                    return res.status(403).send({success:false,message:'Failed to authenticate token'});
                }
                else
                {
                    //if request is good,save token and use it for other routes
                    req.decoded =decoded;
                    next();
                }
            });
        }
        else
        {
            //if there is no tokern
            //return an HTTP response 403 (access forbidden) and an error message
            return res.status(403).send(
                {
                    success:false,
                    message:'no token provided.'
                }
            );
        }



    });

//test route to make sure everything is working
//accessed at GET http://loclhost:8080/api
    apiRouter.get('/',function(req,res)
    {
        res.json({message:'Yay!!Welcome to our API'});
    });

    //on routes that ends with /users
//---------------------------------
    apiRouter.route('/users')
//create user (accessed at POST http://localhost:8080/api/users)
        .post(function(req,res)
        {
            //create new instance of user
            var user =  new User();
            //seting the user data
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;
            //save the user and check for errors

            user.save(function(err)
            {
                if(err)
                {
                    //duplicated entry
                    if(err.code == 11000)
                        return res.json({sucess:false,message:'A user with that username already exists. '});
                    else
                        return res.send(err);
                }
                res.json({message:'User created!'});
            });

        })
        //gets all the users in our Db
        .get(function(req,res)
        {
            User.find(function(err,users)
            {
                if(err) res.send(err);
                res.json(users);
            });



        });

    //on route ending with /users/:user_id
//------------------------------------

    apiRouter.route('/users/:user_id')
        //get the user with that id
        //accessed at GET http://localhost:8080/users/:user_id
        .get(function(req,res)
        {
            User.findById(req.params.user_id,function(err,user)
            {
                if(err) res.send(err);
                //return the user
                res.json(user);
            });
        })
        .put(function(req,res)
        {
            User.findById(req.params.user_id,function(err,user)
            {
                if(err)res.send(err);
                //updating the user
                if(req.body.name) user.name=req.body.name;
                if(req.body.username) user.username=req.body.username;
                if(req.body.password) user.password=req.body.password;

                //save the user
                user.save(function(err)
                {
                    if(err) res.send(err);
                    res.json({message:'User was updated!!'});
                });
            });
        })
        .delete(function(req,res)
        {
            User.remove({
                _id:req.params.user_id
            },function(err,user)
            {
                if(err) return res.send(err);
                res.json({message:'User was removed!'});
            });
        });

    return apiRouter;
};
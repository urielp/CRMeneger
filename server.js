/**
 * Created by Uriel on 21/11/2015.
 */
//=========BASE SETUP============
//calling the packages
var express =require('express');//call express
var app =express();//define our app using express
var bodyParser = require('body-parser');//call body-parser
var morgan = require('morgan');//morgan - used to see request log in console
var mongoose = require('mongoose');//for working with DB
var config =require('./config');
var path =require('path');

//==========APP CONFIGURATION===========================
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//Configure our app to handel CORS requests
app.use(function(req,res,next)
{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Origin','GET,POST');
    res.setHeader('Access-Control-Allow-Origin','X-Requested-With,content-type, Authorization');
    next();
});
//Log all request to console
app.use(morgan('dev'));
//Connect to DB
//mongoose.connect('mongodb://localhost/CRMDB');
mongoose.connect(config.database);

//set static files location
//used for request that our fron end will make
app.use(express.static(__dirname+ '/public'));
//======================================================


//=========ROUTES FOR OUR API===========================
var apiRoutes = require('./app/routes/api')(app,express);
app.use('/api',apiRoutes);

//MAIN CATCH ALL ROUTE
//SEND USER TO FRONEND
app.get('*',function(req,res)
{
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
//======================================================

//START OUR SERVER
//====================
//app.listen(port);
app.listen(config.port);
console.log('server started at port : ' + config.port);
/**End of application configuration**/
/**
 * Created by Uriel on 21/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema(
    {
        name:String,
        username: {type:String,required:true,index:{unique:true}},
        password:{type:String,required:true,select:false}
    }
);
//hash the password before user saved it
UserSchema.pre('save',function(next)
{
    var user=this;
    //hash the password only if new user or user is updating password
    if(!user.isModified('password'))return next();

    //generate hash
    bcrypt.hash(user.password,null,null,function(err,hash)
    {
        if (err) return next(err);
        //changed the [assword to hashed version
        user.password=hash;
        next();
    });
});

//method to compare a given password with hashed one(if exists)
UserSchema.methods.comparePassword=function(password)
{
    var user=this;
    return bcrypt.compareSync(password,user.password);
};
//return the model
module.exports = mongoose.model('User',UserSchema);
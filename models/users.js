const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:[true,'Please enter an email'],
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minLength: [6,'Minimum password length is 6 characters.'],

    },
    lists:[{name:{type:String},tasks:[{task:{type:String},checked:{type:Boolean}}]}]
});

userSchema.pre('save',async function(next) {
    this.password = await bcrypt.hash(this.password,10);
    next();
});

module.exports = mongoose.model('User',userSchema);
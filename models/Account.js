//jshint esversion:6, node:true
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let AccountSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator : /\S+@\S+\.\S+/,
            message : "You didn't provide an email"
        }
    },
    nickname: { type: String, required: true },
    password: { type: String },
    fullname: String,
    description: String,
    birthday: Date,
    isPrivate: Boolean,
    isAdmin: Boolean,
    creationDate: Date,
    updatedDate: Date
});

AccountSchema.pre('save', function(next) {
    let currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.creationDate) this.creationDate = currentDate;
    //if (!this.name) this.name = this.username.split("@")[0];
    next();
});


AccountSchema.plugin(passportLocalMongoose);

let Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
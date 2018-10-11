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
    name: String,
    description: String,
    birthday: Date,
    isPrivate: Boolean,
    isAdmin: Boolean,
    creationDate: Date,
    updatedDate: Date
});

AccountSchema.pre('save', function(next) {
    let currentDate = new Date();
    this.updateDate = currentDate;
    if (!this.creationDate) this.creationDate = currentDate;
    next();
});


AccountSchema.plugin(passportLocalMongoose);

let Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
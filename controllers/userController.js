//jshint esversion:6
let mongoose = require("mongoose");
let passport = require("passport");
let fs = require('fs');
let Account = require("../models/Account");
//let Auction = require("../models/Auction");
//let Message = require("../models/Message");
//let Chat = require("../models/ChatMessage");

/*
        (month === 1)&&(day <= 31)
        ||(month === 2)&&(
            ((year % 4 === 0)&&(day <= 29))
            ||(((year) % 4 !== 0)&&(day <= 28))
        )
        ||(month === 3)&&(day <= 31)
        ||(month === 4)&&(day <= 30)
        ||(month === 5)&&(day <= 31)
        ||(month === 6)&&(day <= 30)
        ||(month === 7)&&(day <= 31)
        ||(month === 8)&&(day <= 31)
        ||(month === 9)&&(day <= 30)
        ||(month === 10)&&(day <= 31)
        ||(month === 11)&&(day <= 30)
        ||(month === 12)&&(day <= 31) 
*/

function checkdate(month, day, year) {
    if ((month === 1)&&(day <= 31)||(month === 2)&&(((year % 4 === 0)&&(day <= 29))||(((year) % 4 !== 0)&&(day <= 28)))||(month === 3)&&(day <= 31)||(month === 4)&&(day <= 30)||(month === 5)&&(day <= 31)||(month === 6)&&(day <= 30)||(month === 7)&&(day <= 31)||(month === 8)&&(day <= 31)||(month === 9)&&(day <= 30)||(month === 10)&&(day <= 31)||(month === 11)&&(day <= 30)||(month === 12)&&(day <= 31)) {
        return true;
    } else {
        return false;
    }
}

let userController = {};

// Go to registration page
userController.register = function(req, res) {
    res.render('account_signup', {message : ""});
};

// Post registration
userController.doRegister = function(req, res) {
    //console.log(req.body);
    if (req.body.username && req.body.nickname && req.body.password && req.body.password2) {
        if (req.body.password === req.body.password2) {
            Account.register(
                new Account({ 
                    username: req.body.username, 
                    nickname: req.body.nickname 
                }), 
                req.body.password, 
                function(err, user) {
                    if (err) {
                        return res.render("signup", { message : err.message });
                    }
                    passport.authenticate('local', { failureRedirect: "/login" })(req, res, function () {
                        res.redirect('/');
                    });
                }
            );
        } else {
            return res.render("account_signup", { message : "Passwords don\'t match" });
        }
    } else {
        return res.render("account_signup", { message : "Fill all fields." });
    }
};

// Go to login page
userController.login = function(req, res) {
    res.render('account_signin', {message : ""});
};

// Post login
userController.doLogin = function(req, res) {
    //console.log(req.body);
    passport.authenticate('local', { failureRedirect: "/login" })(req, res, function () {
        res.redirect('/');
    });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// remove account
userController.removeAccount = function(req, res) {
    let xd = req.body.id;
    if (req.user && xd.toString() === req.user.id.toString()) {
        //Auction.remove({
        //    owner: req.user
        //}, function(err) {
        //    if (err) res.send(err);
        //});
        //Message.remove({
        //    author: req.user
        //}, function(err) {
        //    if (err) res.send(err);
        //});
        //Chat.remove({})
        //    .or([{ dude1: req.user }, { dude2: req.user }])
        //    .exec(function(err) {
        //        if (err) res.send(err);
        //    });
        req.logout();
        let filePath = "./public/photos/accounts/avatar/"+xd+".jpg"; 
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        Account.remove({
            _id: xd
        }, function(err, bear) {
            if (err) res.send(err);
            res.redirect('/');
        });
    }
};

// modify account
userController.modifyAccount = function(req, res) {
    res.render("myaccount_modify", { user : req.user });
};

userController.doModifyAccount = function(req, res) {
    Account.findById(req.body.id, function(err, acc) {
        if (
            (!isNaN(req.body.birthdayy)) && (!isNaN(req.body.birthdaym)) && (!isNaN(req.body.birthdayd)) && (
                checkdate(parseInt(req.body.birthdaym),parseInt(req.body.birthdayd),parseInt(req.body.birthdayy))
            )
        ) {
            if (req.body.nickname) {
                if (err) res.send(err);
                acc.nickname = req.body.nickname;
                acc.fullname = req.body.fullname ? req.body.fullname : "";
                acc.description = req.body.description ? req.body.description : "";
                let datestring = ""+req.body.birthdayy+"-"+req.body.birthdaym+"-"+req.body.birthdayd+"";
                if (req.body.birthdayy && req.body.birthdaym && req.body.birthdayd) {
                    acc.birthday = new Date(datestring);
                }
                acc.location = req.body.location ? req.body.location : "";
                acc.isPrivate = req.body.isprivate === "true" ? true : false;   
                acc.save(function(err) {
                    if (err) return res.render("modifyacc", { user : req.user, message : err.message });
                    res.redirect('/myaccount');
                });
            } else {
                return res.render("myaccount_modify", { user : req.user, message : "The required fields must be filled." });
            }
        } else {
            return res.render("myaccount_modify", { user : req.user, message : "Date is not valid." });
        } 

    });
};

userController.changePassword = function(req, res) {
    res.render("account_changepass", {user : req.user});
};

userController.doChangePassword = function(req, res) {
    Account.findById(req.body.id, function(err, acc) {
        if (err) res.send(err);
        if (req.body.newpassword === req.body.newpassword2) {
            acc.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
                if (err) return res.render("account_changepass", { user : req.user, message : err.message });
                res.redirect('/myaccount');
            });
        } else {
            res.render("account_changepass", { user : req.user, message : "Passwords don't match." });
        }
    });
};

userController.changeAvatar = function(req, res) {
    res.render("account_changeavatar", {user : req.user});
};

userController.showAccount = function(req, res) {
    Account
        .findById(req.params.aid)
        .exec(function(err, cat) {
            if (err) res.send(err);
            res.render("account_info", { user : req.user, account : cat });
        });
};

userController.showNone = function(req, res) {
    res.render("account_info", { user : req.user });
};

module.exports = userController;
//jshint esversion:6
let mongoose = require("mongoose");
let passport = require("passport");
let fs = require('fs');
let Account = require("../models/Account");
//let Auction = require("../models/Auction");
//let Message = require("../models/Message");
//let Chat = require("../models/ChatMessage");

let userController = {};

// Go to registration page
userController.register = function(req, res) {
    res.render('account_signup', {message : ""});
};

// Post registration
userController.doRegister = function(req, res) {
    //console.log(req.body);
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
                //passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                //});
            }
        );
    } else {
        return res.render("account_signup", { message : "Passwords don\'t match" });
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
    //let filePath = "./public/photos/avatar/"+xd+".jpg"; 
    //if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    Account.remove({
        _id: xd
    }, function(err, bear) {
        if (err) res.send(err);
        res.redirect('/');
    });
};

// modify account
//userController.modifyAccount = function(req, res) {
//    res.render("modifyacc", {user : req.user});
//};
//
//userController.doModifyAccount = function(req, res) {
//    Account.findById(req.body.id, function(err, acc) {
//        if (
//            (!isNaN(req.body.birthdayy)) && (!isNaN(req.body.birthdaym)) && (!isNaN(req.body.birthdayd))
//        ) {
//            if (
//                req.body.username && req.body.nickname
//            ) {
//                if (err) res.send(err);
//                acc.username = req.body.username;
//                acc.nickname = req.body.nickname;
//                acc.name = req.body.name ? req.body.name : "";
//                acc.description = req.body.description ? req.body.description : "";
//                let datestring = ""+req.body.birthdayy+"-"+req.body.birthdaym+"-"+req.body.birthdayd+"";
//                if (req.body.birthdayy && req.body.birthdaym && req.body.birthdayd) {
//                    acc.birthday = new Date(datestring);
//                }
//                acc.address = req.body.address ? req.body.address : "";
//                acc.telephone = req.body.telephone ? req.body.telephone : "";
//                acc.isPrivate = req.body.isprivate === "true" ? true : false;   
//                acc.save(function(err) {
//                    if (err) return res.render("modifyacc", { user : req.user, message : err.message });
//                    res.redirect('/myaccount');
//                });
//            } else {
//                return res.render("modifyacc", { user : req.user, message : "The required fields must be filled." });
//            }
//        } else {
//            return res.render("modifyacc", { user : req.user, message : "Date is not valid." });
//        } 
//
//    });
//};

//userController.changePassword = function(req, res) {
//    res.render("changepass", {user : req.user});
//};
//
//userController.doChangePassword = function(req, res) {
//    Account.findById(req.body.id, function(err, acc) {
//        if (err) res.send(err);
//        acc.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
//            if (err) return res.render("changepass", { user : req.user, message : err.message });
//            res.redirect('/myaccount');
//        });
//    });
//};
//
//userController.changeAvatar = function(req, res) {
//    res.render("changeavatar", {user : req.user});
//};
//
//userController.showAccount = function(req, res) {
//    Account
//        .findById(req.params.aid)
//        .exec(function(err, cat) {
//            if (err) res.send(err);
//            res.render("account_info", { user : req.user, account : cat });
//        });
//};
//
//userController.showNone = function(req, res) {
//    res.render("account_info", { user : req.user });
//};

module.exports = userController;
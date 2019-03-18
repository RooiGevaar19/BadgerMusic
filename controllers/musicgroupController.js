//jshint esversion:6
let mongoose = require("mongoose");
let fs = require('fs');
let Account = require("../models/Account");
let MusicGroup = require("../models/MusicGroup");

let groupController = {};

groupController.home = function(req, res) {
    let bears;
    let done = false;

    MusicGroup
        .find({})
        .sort({ updatedDate : -1 })
        .skip(0)
        .limit(12)
        .exec(function(err, res) {
            bears = res;
            done = true;
        });

    setTimeout(function() {
        while (done !== true) {}
        //console.log(bears);
        res.render('index', { user : req.user, groups : bears });
    }, 100);
};

groupController.addMusicGroup = function(req, res) {
    res.render('musicgroup_add', {user : req.user, message : ""});
};

groupController.doAddMusicGroup = function(req, res) {
    //res.render('musicgroup_add', {user : req.user, message : ""});
    if (req.user) {
        console.log(req.body);
        //if (req.body.groupname && req.body.grouptype) {
            let bear = MusicGroup({
                name : req.body.groupname,
                memberscount : 1,
                description : (req.body.description ? req.body.description : ""),
                isGroupPrivate : (req.body.grouptype==="secret" ? true : false),
                isSongsPrivate : (req.body.grouptype==="public" ? false : true)  
            });
            bear.members.push(req.user.id);
            bear.admins.push(req.user.id);
            console.log(bear);
            bear.save(function(err) {
                if (err) res.render("musicgroup_add", { user : req.user, message : err.message });
                res.redirect('/');
            });
        //} else {
        //    res.render("musicgroup_add", {user : req.user, message : "Fill the required fields!"});
        //}
    } else {
        res.render("blank", {user : req.user});
    }
};

module.exports = groupController;
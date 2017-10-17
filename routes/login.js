var mongoose = require('mongoose');
var User = require('../models/user.js');
var Hash = require('jhash');
var express = require('express');
var router = express.Router();

//Post endpoint
login = function (req, res) {
    console.log(req.body);
    var password = req.body.password;
    var passhash = new Hash.SHA256(password).hex(password);
    User.findOne({username: req.body.username, password: passhash}, function (err, user) {
        console.log(user);
        if (user == null) return res.status(404).send("INCORRECT");
        else {
            console.log(user);
            return res.status(200).send(user);
        }
    });
};


//endpoints
//app.post('/login',login);
router.post('/login', (req, res) => {
    console.log("REQ CHAT TOKEN:");
    console.log(req.body);
    const identity = req.body.username;
    const deviceId = req.body.password;
    res.send('Ok!');
});

module.exports = router;

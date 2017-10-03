/**
 * Created by aitor on 26/9/17.
 */
var express = require('express');
var router = express.Router();
var env = require('../config/env');
const Twilio = require('twilio').Twilio;

const client = new Twilio(env.twilioAccountSid, env.authToken);
const service = client.chat.services(env.serviceChatSid);

router.get('/list', (req, res) => {
    service.channels
        .list()
        .then(response => {
            console.log(response);
            res.send(JSON.stringify(response));
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;
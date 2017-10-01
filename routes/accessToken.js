/**
 * Created by aitor on 26/9/17.
 */
var express = require('express');
var router = express.Router();
var env = require('../config/env');
const AccessToken = require('twilio').jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

router.post('/token', (req, res) => {
    console.log(req.body);
    const identity = req.body.identity;
    const deviceId = req.body.deviceId;

    const endpointId = `${env.appName}:${identity}:${deviceId}`;

    // Create a "grant" which enables a client to use Chat as a given user,
    // on a given device
    const chatGrant = new ChatGrant({
        serviceSid: env.serviceSid,
        endpointId: endpointId,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(env.twilioAccountSid, env.twilioApiKey, env.twilioApiSecret);

    token.addGrant(chatGrant);

    token.identity = identity;

    // Serialize the token to a JWT string and include it in a JSON response
    // res.send({
    //     identity: identity,
    //     token: token.toJwt(),
    // });
    res.send(token.toJwt());
});

module.exports = router;
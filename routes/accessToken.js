/**
 * Created by aitor on 26/9/17.
 */
var express = require('express');
var router = express.Router();
var env = require('../config/env');
const AccessToken = require('twilio').jwt.AccessToken;
const ClientCapability = require('twilio').jwt.ClientCapability;
const client = require('twilio')(env.twilioAccountSid, env.authToken);
const ChatGrant = AccessToken.ChatGrant;
const VoiceGrant = AccessToken.VoiceGrant;

router.post('/tokenChat', (req, res) => {
    console.log("REQ CHAT TOKEN:");
    console.log(req.body);
    const identity = req.body.identity;
    const deviceId = req.body.deviceId;

    const endpointId = `${env.appName}:${identity}:${deviceId}`;

    // Create a "grant" which enables a client to use Chat as a given user,
    // on a given device
    const chatGrant = new ChatGrant({
        serviceSid: env.serviceChatSid,
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

router.post('/tokenVoice', (req, res) => {
    console.log("REQ VOICE TOKEN:");
    console.log(req.body);
// Used specifically for creating Voice tokens
    const outgoingApplicationSid = env.serviceVoiceSid;
    const identity = req.body.identity;

// Create a "grant" which enables a client to use Voice as a given user
    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid
    });

// Create an access token which we will sign and return to the client,
// containing the grant we just created
    const token = new AccessToken(env.twilioAccountSid, env.twilioApiKey, env.twilioApiSecret);
    token.addGrant(voiceGrant);
    token.identity = identity;

// Serialize the token to a JWT string
    console.log(token);

    //res.send(token.toJwt());
    res.send({
        identity: identity,
        token: token.toJwt(),
    });


});

router.post('/tokenVoiceOutgoing', (req, res) => {
    const capability = new ClientCapability({
        accountSid: env.twilioAccountSid,
        authToken: env.authToken,
    });
    capability.addScope(
        new ClientCapability.OutgoingClientScope({applicationSid: env.serviceVoiceSid})
    );
    const token = capability.toJwt();

    client.validationRequests
        .create({
            friendlyName: 'My Home Phone Number',
            phoneNumber: req.body.phoneNumber,
        })
        .then(data => {
            console.log(data);

            //res.send(token.toJwt());
            res.set('Content-Type', 'application/jwt');
            res.send(token);
        });



});
module.exports = router;
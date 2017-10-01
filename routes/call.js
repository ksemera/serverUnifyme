/**
 * Created by aitor on 28/9/17.
 */
var express = require('express');
var router = express.Router();
var env = require('../config/env');
var twilio = require('twilio');

var VoiceResponse = twilio.twiml.VoiceResponse;
// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(env.twilioAccountSid, env.authToken);

router.post('/start', (req, res) => {
    // This should be the publicly accessible URL for your application
    // Here, we just use the host for the application making the request,
    // but you can hard code it or use something different if need be
    var salesNumber = env.phoneNumber;
    var url = 'http://' + req.headers.host + '/outbound/' + encodeURIComponent(salesNumber);

    var options = {
        to: req.body.phoneNumber,
        from: salesNumber,
        url: url,
    };

    // Place an outbound call to the user, using the TwiML instructions
    // from the /outbound route
    client.calls.create(options)
        .then((message) => {
            console.log(message.responseText);
            res.send({
                message: 'Thank you! We will be calling you shortly.',
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
});

// Return TwiML instuctions for the outbound call
router.post('/outbound/:salesNumber', function (request, response) {
    var salesNumber = request.params.salesNumber;
    var twimlResponse = new VoiceResponse();

    twimlResponse.say('Thanks for contacting our sales department. Our ' +
        'next available representative will take your call. ',
        {voice: 'alice'});

    twimlResponse.dial(salesNumber);

    response.send(twimlResponse.toString());
});
module.exports = router;
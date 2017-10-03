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
    var promise = client.calls.create({
        url: 'https://demo.twilio.com/welcome/voice', // A URL containing TwiML instructions for the call
        to: req.body.phoneNumber,
        from: salesNumber,
    });


// You can assign functions to be called, at any time, after the request to
// Twilio has been completed.  The first function is called when the request
// succeeds, the second if there was an error.
    promise.then(function (call) {
        console.log('Call success! Call SID: ' + call.sid);
        res.send('success');
    }, function (error) {
        console.error('Call failed!  Reason: ' + error.message);
        res.send('failed');
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
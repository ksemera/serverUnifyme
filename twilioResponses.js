// Require the twilio and HTTP modules
var twilio = require('twilio');
var http = require('http');

// Create an HTTP server, listening on port 1337, that
// will respond with a TwiML XML document
http.createServer(function (req, res) {
    /*var resp = new twilio.twiml.VoiceResponse();

    resp.dial(
        '+34617997965',
        {callerId: '+34931223837'} //a phone number you've verified with Twilio to use as a caller ID number
    );

    //Render the TwiML document using "toString"
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(resp.toString());*/
    res.send('Ok')
}).listen(1337, function() {
    console.log("Node server TwiML running on http://localhost:1337");
});


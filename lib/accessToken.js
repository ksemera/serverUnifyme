/**
 * Created by aitor on 26/9/17.
 */
const express = require('express')
const twilio = require('twilio')

const {AccessToken, ClientCapability} = twilio.jwt
const {ChatGrant, VoiceGrant} = AccessToken


function accessToken(env)
{
  const client = twilio(env.twilioAccountSid, env.authToken)
  const router = express.Router()

  router.post('/tokenChat', (req, res) => {
    console.log("REQ CHAT TOKEN:")
    console.log(req.body)

    const {deviceId, identity} = req.body
    const endpointId = `${env.appName}:${identity}:${deviceId}`

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(env.twilioAccountSid, env.twilioApiKey,
                                  env.twilioApiSecret)

    // Create a "grant" which enables a client to use Chat as a given user, on a
    // given device
    token.addGrant(new ChatGrant({serviceSid: env.serviceChatSid, endpointId}))
    token.identity = identity

    // Serialize the token to a JWT string and include it in a JSON response
    // res.send({
    //     identity: identity,
    //     token: token.toJwt(),
    // });
    res.send(token.toJwt())
  })

  router.post('/tokenVoice', (req, res) => {
    console.log("REQ VOICE TOKEN:")
    console.log(req.body)

    // Used specifically for creating Voice tokens
    const outgoingApplicationSid = env.serviceVoiceSid
    const identity = req.body.identity

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(env.twilioAccountSid, env.twilioApiKey,
                                  env.twilioApiSecret)

    // Create a "grant" which enables a client to use Voice as a given user
    token.addGrant(new VoiceGrant({outgoingApplicationSid}))
    token.identity = identity

    // Serialize the token to a JWT string
    console.log(token)

    //res.send(token.toJwt());
    res.send({identity, token: token.toJwt()})
  })

  router.post('/tokenVoiceMultiCap', (req, res) => {
    const capability = new ClientCapability({
      accountSid: env.twilioAccountSid,
      authToken: env.authToken,
    })
    capability.addScope(
      new ClientCapability.OutgoingClientScope({applicationSid: env.serviceVoiceSid})
    )
    capability.addScope(
      new ClientCapability.IncomingClientScope(req.body.deviceID)
    )
    const token = capability.toJwt()

    console.log("------------------------------")
    console.log("TOKEN: " + token)
    console.log("------------------------------")

    //res.send(token.toJwt());
    res.set('Content-Type', 'application/jwt')
    res.send(token)
  });

  router.post('/validation', (req, res) => {
    client.validationRequests
      .create({
        friendlyName: req.body.friendlyName,
        phoneNumber: req.body.phoneNumber,
      })
      .then(data => {
        console.log(data);
        res.send("Validation DONE")
      })
      .catch(err=> {
        res.send("Error: " , err.message);
      })
  })


  return router
}


module.exports = accessToken

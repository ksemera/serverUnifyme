/**
 * Created by aitor on 26/9/17.
 */
const express = require('express')
const Twilio = require('twilio').Twilio


function channels(env)
{
  const client = new Twilio(env.twilioAccountSid, env.authToken)
  const router = express.Router()
  const service = client.chat.services(env.serviceChatSid)

  router.get('/list', (req, res) => {
    service.channels
      .list()
      .then(response => {
        console.log(response)
        res.send(JSON.stringify(response))
      })
      .catch(error => console.log(error))
  })


  return router
}


module.exports = channels

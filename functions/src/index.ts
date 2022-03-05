import * as functions from "firebase-functions"
import c = require("cors")

const cors = c({ origin: true })

export const sayHello = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let receivedValue = "John Doe"
    if (request.body && request.body.data) {
      receivedValue = request.body.data.name
    }

    if (process.env.IS_FIREBASE_CLI &&
      process.env.FIREBASE_DEBUG_MODE) {
      const delay = Number(process.env.DEBUG_RESPONSE_DELAY) || 1000
      setTimeout((() => {
        response.status(200).send({
          "status": "success",
          "data": {
            "title": `Function says hi! Got: ${receivedValue}, (running in emulator/debug mode)!`,
          },
        })
      }), delay)
    } else {
      response.status(200).send({
        "status": "success",
        "data": {
          "title": `Function says hi! Got: ${receivedValue}, (running in prod mode)!`,
        },
      })
    }
  })
})

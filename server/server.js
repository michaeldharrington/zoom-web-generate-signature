// require .env secrets through dotenv module
require('dotenv/config')

// import and run express server
const express = require('express');
const bodyParser = require('body-parser')

// require js-base64 and crypto-js for signature
const base64JS = require('js-base64')
const hmacSha256 = require('crypto-js/hmac-sha256')
const encBase64 = require('crypto-js/enc-base64')

const app = express();
app.use(express.json());

// add cors headers to access multiple port domains
const cors = require('cors')
app.use(cors());

// create a function to create a base64 signature 
function generateSignature(secrets, meetingData) {
    const ts = new Date().getTime();
    const msg = base64JS.Base64.encode(secrets.API_KEY + meetingData.meetingNumber + ts + meetingData.role);
    const hash = hmacSha256(msg, secrets.API_SECRET);
    return signature = base64JS.Base64.encodeURI(`${secrets.API_KEY}.${meetingData.meetingNumber}.${ts}.${meetingData.role}.${encBase64.stringify(hash)}`);
}

// setup endpoint to receive requests for signatures
app.post('/getSignature', (req, res) => {
    res.send(generateSignature(process.env, req.body.meetingData))
})

// server PORT logging
app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT: ${process.env.PORT}`)
})
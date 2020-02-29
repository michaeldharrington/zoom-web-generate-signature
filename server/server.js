// require .env secrets through dotenv module
require('dotenv/config')

// import and run express server
const express = require('express');

const app = express();
app.use(express.json());

// add cors headers to access multiple port domains
const cors = require('cors')
app.use(cors());

// create a function to create a base64 signature 
function generateSignature(secrets, meetingData) {
    const timestamp = new Date().getTime()
    const msg = Buffer.from(secrets.API_KEY + meetingData.meetingNumber + timestamp + meetingData.role).toString('base64')
    const hash = crypto.createHmac('sha256', secrets.API_SECRET).update(msg).digest('base64')
    const signature = Buffer.from(`${secrets.API_KEY}.${meetingData.meetingNumber}.${timestamp}.${meetingData.role}.${hash}`).toString('base64')

    return signature
}

// setup endpoint to receive requests for signatures
app.post('/getSignature', (req, res) => {
    res.send(generateSignature(process.env, req.body.meetingData))
})

// server PORT logging
app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT: ${process.env.PORT}`)
})
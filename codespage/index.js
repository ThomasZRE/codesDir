require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const Code = require('./models/code')

const app = express()

app.use(cors())

const requestLogger = (request,response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('----')
    next()
}

app.use(express.json())
//app.use(express.static('dist'))
app.use(requestLogger)

// Sender secret to authorize request
const SENDER_SECRET = process.env.SECRET_HEADER_KEY

app.get('/', (request, response) => {
    response.send('<h1>Backend page for codes</h1>')
})

app.get('/api/codes', (request, response) => {
    Code.find({}).then(codes => {
        response.json(codes)
    })
})

// Get latest entries
app.get('/api/codes/latest', (request, response) => {
    Code.find({
        $or: [
            { subject: { $regex: "Your authentication code", $options: "i" } },
            { subject: { $regex: "Your ChatGPT code is", $options: "i" } }
        ]
    }).sort({ date: -1 }).limit(4).then(codes => {
        response.json(codes)
    })
})

app.post('/api/codes', (request, response) => {
    // Sender secret header key
    const receivedSecret = request.headers['x-make-secret'];

    if (receivedSecret !== SENDER_SECRET) {
        console.warn("Unauthorized request received")
        return response.status(401).send('Unauthorized')
    }

    console.log('Authorized POST request received...')

    // Post request
    const body = request.body

    if (!body.date) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    const codeMsg = new Code({...body})

    codeMsg.save().then(savedCode => {
        response.json(savedCode)
    })
})

// Deletes entries in database every sunday
cron.schedule('0 0 * * sun', async () => {
    console.log('Executing weekly database cleanup')
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    try {
        const result = await Code.deleteMany({
            date: { $lt: threeDaysAgo }
        })
        console.log(`Cleanup completed. ${result.deletedCount} old entries were deleted.`)
    } catch (error) {
        console.error('Error while cleaning up:', error)
    } 
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

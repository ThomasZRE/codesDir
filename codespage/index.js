require('dotenv').config()
const express = require('express')
const cors = require('cors')
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
app.use(express.static('dist'))
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Backend page for codes</h1>')
})

app.get('/api/codes', (request, response) => {
    Code.find({}).sort({}).then(codes => {
        response.json(codes)
    })
})

// Get latest entries
app.get('/api/codes/latest', (request, response) => {
    Code.find({}).sort({ date: -1 }).limit(4).then(codes => {
        response.json(codes)
    })
})

app.post('/api/codes', (request, response) => {
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
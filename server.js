const express = require('express')
const logger = require('morgan')
const cors = require('cors')
// const redis = require('redis')
const { config } = require('./ussdModules/config')
const port = process.env.PORT || 3031

const app = express()
// const client = redis.createClient()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.get('*', (req, res) => {
  res.send('This is SpectrumMFB USSD application')
})

// client.on('error', function (error) {
//   console.error(error)
// })

config(app)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

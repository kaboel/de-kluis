const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const App = express()
const port = 5100 || process.env.PORT

App.use(morgan('combined'))
App.use(cors())

App.listen(port, () => {
    console.log(`[deKluis] server started on port: ${port}...`)
})



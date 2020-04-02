const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const gqlHTTP = require('express-graphql')
const config = require('./_config/config')
const SCHEMA = require('./_gql/schema')

const App = express()
const port = config.port || process.env.PORT

App.use(morgan('combined'))
App.use(cors())

App.use('/v0', gqlHTTP({ schema: SCHEMA, graphiql: true }))

mongoose.connect(config.dbUriString, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log(`\n[${config.name}] connected to deKluis@kluster-0...\n.\n.`)
		try {
			App.listen(port, () => {
					console.log(`[${config.name}] server started on port:${port}...`)
			})
		} catch(err) {
			console.log(`[${config.name}] server failed to start - ${err.message}`)
		}
	}).catch(err => {
		console.log(`[${config.name}] database failed to connect - ${err.message}`)
	})



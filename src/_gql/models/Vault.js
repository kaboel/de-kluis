const mongoose = require('mongoose')

const SCHEMA = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	}
})

SCHEMA.path('amount').get(num => {
	return (num / 100).toFixed(2);
})

SCHEMA.path('amount').set(num => {
	return num * 100
})

const Vault = mongoose.model('Vault', SCHEMA, 'Vaults')

module.exports = Vault
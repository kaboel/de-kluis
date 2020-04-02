const mongoose = require('mongoose')

const SCHEMA = mongoose.Schema({
	vaultId: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	category: {
		type: String,
		enum: ['Withdrawal', 'Deposit'],
		required: true
	},
	description: {
		type: String
	},
})

SCHEMA.path('amount').get((num) => {
	return (num / 100).toFixed(2);
})

SCHEMA.path('amount').set((num) => {
	return num * 100
})

const Transaction = mongoose.model('Transaction', SCHEMA, 'Transactions')

module.exports = Transaction
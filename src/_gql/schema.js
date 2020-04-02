const Vault = require('../_gql/models/Vault')
const Transaction = require('../_gql/models/Transaction')
const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLID, 
	GraphQLInt, 
	GraphQLList, 
	GraphQLSchema, 
	GraphQLNonNull 
} = require('graphql')

const VaultType = new GraphQLObjectType({
	name: 'Vault',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		amount: { type: GraphQLInt },
		transactions: {
			type: new GraphQLList(TransactionType),
			async resolve(parent, args) {
				return await Transaction.find({ vaultId: parent.id })
			}
		}
	})
})

const TransactionType = new GraphQLObjectType({
	name: 'Transaction',
	fields: () => ({
		id: { type: GraphQLID },
		date: { type: GraphQLString },
		amount: { type: GraphQLInt },
		description: {type: GraphQLString},
		vault: {
			type: VaultType,
			async resolve(parent, args) {
				return await Vault.findById(parent.vaultId)
			}
		}
	})
})

const Queries = new GraphQLObjectType({
	name: 'Queries',
	fields: {
		// Vault Queries
		vault: {
			type: VaultType,
			args: {id: { type: GraphQLID }},
			async resolve(parent, args) {
				return await Vault.findById(args.id)
			}
		},
		vaults: {
			type: new GraphQLList(VaultType),
			async resolve(parent, args) {
				return await Vault.find({})
			}
		},

		// Transaction Queries
		transaction: {
			type: TransactionType,
			args: {id: { type: GraphQLID }},
			async resolve(parent, args) {
				return await Transaction.findById(args.id)
			}
		},
		transactions: {
			type: new GraphQLList(TransactionType),
			async resolve(parent, args) {
				return await Transaction.find({})
			}
		}
	}
})

const Mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		// Vault Mutations
		addVault: {
			type: VaultType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				amount: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args) {
				let vault = new Vault({
					name: args.name,
					amount: args.amount
				});
				
				try {
					return vault.save()
				} catch(err) {
					console.log(err.message)
					return "An Error has occurred while creating Vault.";
				}
			}
		},
		editVault: {
			type: VaultType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				let vault = Vault.findById(args.id)
				if (!vault) {
					return "An Error has occurred. Cannot find Vault."
				} else {
					transaction.name = args.name
					try {
						transaction.save()
					} catch(err) {
						console.log(err)
						return "An Error has occured while updating Vault."
					}
				}
			}
		},
		deleteVault: {
			type: VaultType,
			args: {id: { type: new GraphQLNonNull(GraphQLID) }},
			resolve(parent, args) {
				Vault.deleteOne({_id: args.id}, (err, res) => {
						if (err) {
							return "An Error has occurred while deleting Vault";
						}
						return res;
				})
			}	
		},

		// Transaction Mutations
		addTransaction: {
			type: TransactionType,
			args: {
				vaultId: { type: GraphQLNonNull(GraphQLID) },
				date: { type: GraphQLNonNull(GraphQLString) },
				amount: { type: GraphQLNonNull(GraphQLInt) },
				category: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLString }
			},
			resolve(parent, args) {
				let transaction = new Transaction({
					vaultId: args.vaultId,
					date: args.date,
					amount: args.amount,
					category: args.category,
					description: args.description
				})
				try {
					return transaction.save()
				} catch(err) {
					console.log(err)
					return "An Error has occurred while saving Transaction."
				}
			}
		},
		editTransaction: {
			type: TransactionType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				date: { type: new GraphQLNonNull(GraphQLString) },
				amount: { type: new GraphQLNonNull(GraphQLInt) },
				description: { type: GraphQLString }
			},
			resolve(parent, args) {
				let transaction = Transaction.findById(args.id)
				if (!transaction) {
					return "An Error has occurred. Cannot find Transaction."
				} else {
					transaction.date = (args.date) ? args.date : transaction.date
					transaction.amount = (args.amount) ? args.amount : transaction.amount
					transaction.description = (args.description) ? args.description : transaction.description
					try {
						return transaction.save()
					} catch(err) {
						console.log(err)
						return "An Error has occurred while updating Transaction."
					}
				}
			}
		},
		deleteTransaction: {
			type: VaultType,
			args: {id: { type: new GraphQLNonNull(GraphQLID) }},
			resolve(parent, args) {
				Transaction.deleteOne({_id: args.id}, (err, res) => {
						if (err) {
							return "An Error has occurred while deleting Transaction";
						}
						return res;
				})
			}
		},
	}
})

const SCHEMA = new GraphQLSchema({
	query: Queries,
	mutation: Mutations
})

module.exports = SCHEMA
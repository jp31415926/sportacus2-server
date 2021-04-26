const validator = require('validator');

const POC = require('../../models/poc');
const catErrors = require('../../utils/catErrors');

const validatePOCInput = pocInput => {
	const errors = [];
	//console.log(pocInput);
	if (pocInput.name &&
		!validator.isLength(pocInput.name, { min: 2 })) {
		errors.push({ message: 'POC name too short!' });
	}
	// TODO: check email address and phone numbers
	if (errors.length > 0) {
		console.log(errors);
		const error = new Error(catErrors('Invalid input', errors));
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	Mutation: {
		createPOC: async (_, { pocInput }) => {
			validatePOCInput(pocInput);

			const errors = [];

			if (errors.length === 0) {
				const existingPOCName = await POC.findOne({ name: pocInput.name });
				if (existingPOCName) {
					errors.push({ message: 'POC name already used' });
				}
			}
			if (errors.length > 0) {
				//console.log(errors);
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			const poc = new POC({
				name: pocInput.name,
				email: pocInput.email,
				phone: pocInput.phone,
			});

			return poc.save()
				.then(() => {
					const result = {
						...poc._doc,
					};
					//console.log(result);
					return result;
				})
				.catch(err => {
					const error = new Error(catErrors('Database error updating POC; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				});
		},

		updatePOC: async (_, { _id, pocInput }) => {
			const errors = [];

			const pocOld = await POC.findById(_id);
			if (pocOld === null) {
				errors.push({ message: 'POC not found' });
			} else {
				validatePOCInput(pocInput);
				//console.log(pocInput);

				if (errors.length === 0) {
					const existingPOCName = await POC.findOne({ name: pocInput.name });
					if (existingPOCName && existingPOCName._id.toString() !== _id) {
						errors.push({ message: 'POC name already used' });
					}
				}
			}
			if (errors.length > 0) {
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}

			// update old poc with new info
			pocOld.name = pocInput.name;
			pocOld.email = pocInput.email;
			pocOld.phone = pocInput.phone;

			return pocOld.save()
				.catch(err => {
					const error = new Error(catErrors('Database error updating POC; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return POC.findById(_id);
				})
				.then(poc => {
					const result = {
						...poc._doc,
					};
					return result;
				});
		},

		deletePOC: (_, { _id }) => {
			const errors = [];
			return POC.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error(catErrors('Database error deleting POC; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					}
					const error = new Error('POC not found');
					error.code = 401;
					throw error;
				});
		},
	},

	Query: {
		getPOC: async (_, { _id }) => {
			const poc = await POC.findById(_id);
			if (!poc) {
				const error = new Error('POC not found.');
				error.code = 401;
				throw error;
			}
			return {
				...poc._doc,
			};
		},

		getPOCs: async (_, { perPage = 20, page = 1 }) => {
			// TODO: does this need to be the number of total documents, or only the count that match the search???
			const total = await POC.countDocuments();
			// TODO: add filtering to query
			const items = await POC.find()
				.sort('createdAt')
				.skip((page - 1) * perPage)
				.limit(perPage);
			if (!items) {
				const error = new Error('No items that match criteria.');
				error.code = 401;
				throw error;
			}

			return {
				items: items.map(i => {
					return {
						...i._doc,
					}
				}),
				total: total,
			};
		},
	},
};

module.exports = resolvers;

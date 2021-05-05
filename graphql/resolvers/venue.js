const validator = require('validator');

const Venue = require('../../models/venue');
const catErrors = require('../../utils/catErrors');

const validateVenueInput = venueInput => {
	const errors = [];
	//console.log(venueInput);
	if (venueInput.name &&
		!validator.isLength(venueInput.name, { min: 2 })) {
		errors.push({ message: 'Venue name too short!' });
	}
	if (venueInput.longName &&
		!validator.isLength(venueInput.longName, { min: 5 })) {
		errors.push({ message: 'Venue longName too short!' });
	}
	// TODO: check lat and long
	// TODO: check street address, poc, parent ref
	if (errors.length > 0) {
		console.log(errors);
		const error = new Error(catErrors('Invalid input', errors));
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	Mutation: {
		createVenue: async (_, { venueInput }) => {
			validateVenueInput(venueInput);

			const errors = [];

			if (errors.length === 0) {
				const existingVenueName = await Venue.findOne({ name: venueInput.name });
				if (existingVenueName) {
					errors.push({ message: 'Venue name already used' });
				}
			}
			if (errors.length > 0) {
				console.log(errors);
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			const venue = new Venue({
				...venueInput,
			});

			return venue.save()
				.then(() => {
					const result = {
						...venue._doc,
					};
					return result;
				})
				.catch(err => {
					const error = new Error(catErrors('Database error creating Venue; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				});
		},

		updateVenue: async (_, { _id, venueInput }) => {
			const errors = [];

			const venueOld = await Venue.findById(_id);
			if (venueOld === null) {
				errors.push({ message: 'Venue not found' });
			} else {
				validateVenueInput(venueInput);

				if (errors.length === 0) {
					if (venueInput.ver === null) {
						errors.push({ message: 'ver is a required field for updates!' });
					}
				}
				if (errors.length === 0) {
					const existingVenueName = await Venue.findOne({ name: venueInput.name });
					if (existingVenueName && existingVenueName._id.toString() !== _id) {
						errors.push({ message: 'Venue name already used' });
					}
				}
			}
			if (errors.length > 0) {
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}

			// update old venue with new info
			Object.assign(venueOld, { ...venueOld._doc, ...venueInput });

			return venueOld.save()
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return Venue.findById(_id);
				})
				.then(venue => {
					return {
						...venue._doc,
					};
				})
				.catch(err => {
					console.log(err);
					const error = new Error(catErrors('Database error updating item; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				});
		},

		deleteVenue: (_, { _id }) => {
			const errors = [];
			return Venue.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error(catErrors('Database error deleting item; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					}
					const error = new Error('Item not found');
					error.code = 401;
					throw error;
				});
		},
	},

	Query: {
		getVenue: async (_, { _id }) => {
			const venue = await Venue.findById(_id)
				.populate('poc');
			if (!venue) {
				const error = new Error('Venue not found.');
				error.code = 401;
				throw error;
			}
			return {
				...venue._doc,
			};
		},

		getVenues: async (_, { perPage = 20, page = 1 }) => {
			// TODO: does this need to be the number of total documents, or only the count that match the search???
			const total = await Venue.countDocuments();
			// TODO: add filtering to query
			const items = await Venue.find()
				.populate('poc')
				.sort('createdAt')
				.skip((page - 1) * perPage)
				.limit(perPage);
			if (!items) {
				const error = new Error('No items found that match criteria.');
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

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
				//console.log(errors);
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			const venue = new Venue({
				name: venueInput.name,
				longName: venueInput.longName,
				street1: venueInput.street1,
				street2: venueInput.street2,
				city: venueInput.city,
				state: venueInput.state,
				zipcode: venueInput.zipcode,
				country: venueInput.country,
				latitude: venueInput.latitude,
				longitude: venueInput.longitude,
				url: venueInput.url,
				poc: venueInput.poc,
				parent: venueInput.parent,
			});

			return venue.save()
				.then(() => {
					const result = {
						...venue._doc,
					};
					//console.log(result);
					return result;
				})
				.catch(err => {
					errors.push({ message: err.toString() });
					const error = new Error(catErrors('Database error creating Venue', errors));
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
				//console.log(venueInput);

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
			venueOld.name = venueInput.name;
			venueOld.longName = venueInput.longName;
			venueOld.street1 = venueInput.street1;
			venueOld.street2 = venueInput.street2;
			venueOld.city = venueInput.city;
			venueOld.state = venueInput.state;
			venueOld.zipcode = venueInput.zipcode;
			venueOld.country = venueInput.country;
			venueOld.latitude = venueInput.latitude;
			venueOld.longitude = venueInput.longitude;
			venueOld.url = venueInput.url;
			venueOld.poc = venueInput.poc;
			venueOld.parent = venueInput.parent;

			return venueOld.save()
				.catch(err => {
					const error = new Error(catErrors('Database error updating Venue; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return Venue.findById(_id);
				})
				.then(venue => {
					const result = {
						...venue._doc,
					};
					return result;
				});
		},

		deleteVenue: (_, { _id }) => {
			const errors = [];
			return Venue.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error(catErrors('Database error updating Venue; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					}
					const error = new Error('Venue not found');
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
				const error = new Error('No venues found that match criteria.');
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

const appConfig = require('../config');
const validator = require('validator');

const bcrypt = require('bcryptjs'); // user only
const jwt = require('jsonwebtoken'); // user only

const { composeResolvers } = require('@graphql-tools/resolvers-composition'); // common

const User = require('../models/user');
const Venue = require('../models/venue');


function validateUserInput(userInput) {
	const errors = [];
	//console.log(userInput);
	if (!validator.isEmail(userInput.email)) {
		errors.push({ message: 'Email is invalid.' });
	}
	if (!validator.isLength(userInput.username, { min: 2 })) {
		errors.push({ message: 'Username too short!' });
	}
	if (!validator.isLength(userInput.password, { min: 5 })) {
		errors.push({ message: 'Password too short!' });
	}
	if (validator.isEmpty(userInput.firstName)) {
		errors.push({ message: 'First name is required!' });
	}
	if (validator.isEmpty(userInput.lastName)) {
		errors.push({ message: 'Last name is required!' });
	}
	if (errors.length > 0) {
		console.log(errors);
		const error = new Error('Invalid input');
		error.data = errors;
		error.code = 422;
		throw error;
	}
}

function validateVenueInput(venueInput) {
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
	// TODO: check streetAddress, poc, children
	if (errors.length > 0) {
		console.log(errors);
		const error = new Error('Invalid input');
		error.data = errors;
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	RootMutation: {
		/********************************* USER ****************************/
		createUser: async (_, { userInput }, req) => {
			validateUserInput(userInput);

			const errors = [];

			if (errors.length === 0) {
				const existingUserEmail = await User.findOne({ email: userInput.email });
				if (existingUserEmail) {
					errors.push({ message: 'User email already used' });
				}
			}
			if (errors.length === 0) {
				const existingUsername = await User.findOne({ username: userInput.username });
				if (existingUsername) {
					errors.push({ message: 'Username exists already' });
				}
			}
			if (errors.length > 0) {
				console.log(errors);
				const error = new Error('Invalid input');
				error.data = errors;
				error.code = 422;
				throw error;
			}
			const hashedPw = await bcrypt.hash(userInput.password, 12);
			const user = new User({
				username: userInput.username,
				email: userInput.email,
				firstName: userInput.firstName,
				lastName: userInput.lastName,
				password: hashedPw,
			});

			return user.save()
				.then(res => {
					const result = {
						...user._doc,
						_id: user._id.toString(),
						createdAt: user.createdAt.toISOString(),
						updatedAt: user.updatedAt.toISOString(),
					};
					//console.log(result);
					return result;
				})
				.catch(err => {
					const error = new Error('Database error creating user');
					error.data = errors;
					error.code = 422;
					throw error;
				});
		},

		updateUser: async (_, { _id, userInput }, req) => {
			const errors = [];
			var hashPassword = false;

			var userOld = await User.findById(_id);
			if (!userOld) {
				errors.push({ message: 'User not found' });
			} else {
				// if password is null or empty then set it to the old password, otherwise, validate and hash
				if (!userInput.password) {
					userInput.password = userOld.password;
					hashPassword = false;
				} else {
					hashPassword = true;
				}

				validateUserInput(userInput);
				//console.log(userInput);

				if (errors.length === 0) {
					const existingUserEmail = await User.findOne({ email: userInput.email });
					if (existingUserEmail && existingUserEmail._id.toString() !== _id) {
						errors.push({ message: 'Email already registered.' });
					}
				}
				if (errors.length === 0) {
					const existingUsername = await User.findOne({ username: userInput.username });
					if (existingUsername && existingUsername._id.toString() !== _id) {
						errors.push({ message: 'Username already registered' });
					}
				}
			}
			if (errors.length > 0) {
				const error = new Error('Invalid input');
				error.data = errors;
				error.code = 422;
				throw error;
			}
			var hashedPw = '';
			if (hashPassword) {
				hashedPw = await bcrypt.hash(userInput.password, 12);
			} else {
				hashedPw = userInput.password;
			}

			// update old user with new info
			userOld.username = userInput.username;
			userOld.email = userInput.email;
			userOld.firstName = userInput.firstName;
			userOld.lastName = userInput.lastName;
			userOld.password = hashedPw;

			return userOld.save()
				.catch(err => {
					const error = new Error('Database error updating user');
					error.data = errors;
					error.code = 422;
					throw error;
				})
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return User.findById(_id);
				})
				.then(user => {
					const result = {
						...user._doc,
						_id: user._id.toString(),
						createdAt: user.createdAt.toISOString(),
						updatedAt: user.updatedAt.toISOString(),
					};
					return result;
				});
		},

		deleteUser: async (_, { _id }, req) => {
			return User.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error('Database error');
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					} else {
						const error = new Error('User not found');
						error.code = 401;
						throw error;
					}
				})
				;
		},


		/********************************* VENUE ****************************/
		createVenue: async (_, { venueInput }, req) => {
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
				const error = new Error('Invalid input');
				error.data = errors;
				error.code = 422;
				throw error;
			}
			const venue = new Venue({
				name: venueInput.name,
				longName: venueInput.longName,
				streetAddress: venueInput.streetAddress,
				latitude: venueInput.latitude,
				longitude: venueInput.longitude,
				url: venueInput.url,
				poc: venueInput.poc,
				children: venueInput.children,
			});

			return venue.save()
				.then(res => {
					const result = {
						...venue._doc,
						_id: venue._id.toString(),
						createdAt: venue.createdAt.toISOString(),
						updatedAt: venue.updatedAt.toISOString(),
					};
					//console.log(result);
					return result;
				})
				.catch(err => {
					const error = new Error('Database error creating venue');
					error.data = errors;
					error.code = 422;
					throw error;
				});
		},

		updateVenue: async (_, { _id, venueInput }, req) => {
			const errors = [];

			var venueOld = await Venue.findById(_id);
			if (!venueOld) {
				errors.push({ message: 'Venue not found' });
			} else {
				validateVenueInput(venueInput);
				//console.log(venueInput);

				if (errors.length === 0) {
					const existingVenueName = await Venue.findOne({ name: venueInput.name });
					if (existingVenueName) {
						errors.push({ message: 'Venue name already used' });
					}
				}
			}
			if (errors.length > 0) {
				const error = new Error('Invalid input');
				error.data = errors;
				error.code = 422;
				throw error;
			}

			// update old venue with new info
			venueOld.name = venueInput.name;
			venueOld.longName = venueInput.longName;
			venueOld.streetAddress = venueInput.streetAddress;
			venueOld.latitude = venueInput.latitude;
			venueOld.longitude = venueInput.longitude;
			venueOld.url = venueInput.url;
			venueOld.poc = venueInput.poc;
			venueOld.children = venueInput.children;

			return venueOld.save()
				.catch(err => {
					const error = new Error('Database error updating venue');
					error.data = errors;
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
						_id: venue._id.toString(),
						createdAt: venue.createdAt.toISOString(),
						updatedAt: venue.updatedAt.toISOString(),
					};
					return result;
				});
		},

		deleteVenue: async (_, { _id }, req) => {
			return Venue.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error('Database error');
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					} else {
						const error = new Error('Venue not found');
						error.code = 401;
						throw error;
					}
				})
				;
		},
	},

	RootQuery: {
		/********************************* USER ****************************/
		login: async (_, { emailOrUsername, password }) => {
			let user = await User.findOne({ username: emailOrUsername });
			if (!user) {
				user = await User.findOne({ email: emailOrUsername });
				if (!user) {
					const error = new Error('User not found.');
					error.code = 401;
					throw error;
				}
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				const error = new Error('Password is incorrect.');
				error.code = 401;
				throw error;
			}
			const token = jwt.sign(
				{
					userId: user._id.toString(),
					email: user.email
				},
				appConfig.app.secret,
				{ expiresIn: '1h' }
			);
			return { token: token, userId: user._id.toString() };
		},

		getUser: async (_, { _id }, req) => {
			const user = await User.findById(_id);
			if (!user) {
				const error = new Error('User not found.');
				error.code = 401;
				throw error;
			}
			return {
				...user._doc,
				_id: user._id.toString(),
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			};
		},

		getUsers: async (_, { perPage = 20, page = 1 }, req) => {
			// TODO: does this need to be the number of total documents, or only the count that match the search???
			const total = await User.countDocuments();
			// TODO: add filtering to query
			const items = await User.find()
				.sort('createdAt')
				.skip((page - 1) * perPage)
				.limit(perPage);
			if (!items) {
				const error = new Error('No users found that match criteria.');
				error.code = 401;
				throw error;
			}

			return {
				items: items.map(i => {
					return {
						...i._doc,
						_id: i._id.toString(),
						createdAt: i.createdAt.toISOString(),
						updatedAt: i.updatedAt.toISOString(),
					}
				}),
				total: total,
			};
		},

		/********************************* VENUE ****************************/
		getVenue: async (_, { _id }, req) => {
			const venue = await Venue.findById(_id);
			if (!venue) {
				const error = new Error('Venue not found.');
				error.code = 401;
				throw error;
			}
			return {
				...venue._doc,
				_id: venue._id.toString(),
				createdAt: venue.createdAt.toISOString(),
				updatedAt: venue.updatedAt.toISOString(),
			};
		},

		getVenues: async (_, { perPage = 20, page = 1 }, req) => {
			// TODO: does this need to be the number of total documents, or only the count that match the search???
			const total = await Venue.countDocuments();
			// TODO: add filtering to query
			const items = await Venue.find()
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
						_id: i._id.toString(),
						createdAt: i.createdAt.toISOString(),
						updatedAt: i.updatedAt.toISOString(),
					}
				}),
				total: total,
			};
		},
	},
};

const isAuthenticated = () => next => async (_, args, req, info) => {
	// check if the current user is authenticated
	// commented out for testing
	// if (!req.isAuth) {
	// 	const error = new Error('Not authenticated!');
	// 	error.code = 401;
	// 	throw error;
	// }
	req.userId = 123; // FAKE IT FOR NOW
	return next(_, args, req, info);
};

const hasPermission = (resource, permission) => next => async (_, args, req, info) => {
	// check if current user has the provided role
	console.log('check if user ' + req.userId + ' has ' + permission + ' permission for ' + resource + ' resource')
	//if (!context.currentUser.roles || context.currentUser.roles.includes(role)) {
	//	throw new Error('You are not authorized!');
	//}

	return next(_, args, req, info);
};

const resolversComposition = {
	'RootQuery.getUser': [isAuthenticated(), hasPermission('user', 'view')],
	'RootQuery.getUsers': [isAuthenticated(), hasPermission('user', 'view')],
	'RootMutation.createUser': [isAuthenticated(), hasPermission('user', 'create')],
	'RootMutation.deleteUser': [isAuthenticated(), hasPermission('user', 'delete')],
	'RootMutation.updateUser': [isAuthenticated(), hasPermission('user', 'update')],
};

module.exports = composeResolvers(resolvers, resolversComposition);

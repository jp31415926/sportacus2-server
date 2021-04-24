const appConfig = require('../../config');
const validator = require('validator');

const bcrypt = require('bcryptjs'); // user only
const jwt = require('jsonwebtoken'); // user only

const User = require('../../models/user');

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
		//const error = new Error('Invalid input');
		const error = new Error(catErrors('Invalid input', errors));
		//error.data = errors;
		error.code = 422;
		throw error;
	}
}

function catErrors(error, errors) {
	errors.forEach(e => {
		error += '; ' + e.message;
	});
	return error
}

const resolvers = {
	RootMutation: {
		createUser: async (_, { userInput }) => {
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
				const error = new Error(catErrors('Invalid input', errors));
				//error.data = errors;
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
				.then(() => {
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
					errors.push({ message: err.toString() });
					//const error = new Error('Database error creating user');
					const error = new Error(catErrors('Database error creating user', errors));
					//error.data = errors;
					error.code = 422;
					throw error;
				});
		},

		updateUser: async (_, { _id, userInput }) => {
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
				//const error = new Error('Invalid input');
				const error = new Error(catErrors('Invalid input', errors));
				//error.data = errors;
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
					errors.push({ message: err.toString() });
					//const error = new Error('Database error creating user');
					const error = new Error(catErrors('Database error creating user', errors));
					//error.data = errors;
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

		deleteUser: async (_, { _id }) => {
			const errors = [];
			return User.findByIdAndDelete(_id)
				.catch(err => {
					errors.push({ message: err.toString() });
					const error = new Error(catErrors('Database error', errors));
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
	},

	RootQuery: {
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

		getUser: async (_, { _id }) => {
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

		getUsers: async (_, { perPage = 20, page = 1 }) => {
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
	},
};

module.exports = resolvers;

const appConfig = require('../../config');
const validator = require('validator');

const bcrypt = require('bcryptjs'); // user only
const jwt = require('jsonwebtoken'); // user only

const User = require('../../models/user');
const catErrors = require('../../utils/catErrors');

const validateUserInput = userInput => {
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
		const error = new Error(catErrors('Invalid input', errors));
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	Mutation: {
		createUser: async (_, { userInput }) => {
			validateUserInput(userInput);

			const errors = [];

			if (errors.length === 0) {
				const existingUserEmail = await User.findOne({ email: userInput.email });
				if (existingUserEmail) {
					errors.push({ message: 'Email already used' });
				}
			}
			if (errors.length === 0) {
				const existingUsername = await User.findOne({ username: userInput.username });
				if (existingUsername) {
					errors.push({ message: 'Username not available' });
				}
			}
			if (errors.length > 0) {
				console.log(errors);
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			const hashedPw = await bcrypt.hash(userInput.password, 12);
			const user = new User({
				...userInput,
				password: hashedPw,
			});

			return user.save()
				.then(() => {
					const result = {
						...user._doc,
					};
					return result;
				})
				.catch(err => {
					const error = new Error(catErrors('Database error creating User; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				});
		},

		updateUser: async (_, { _id, userInput }) => {
			const errors = [];
			let hashPassword = false;

			const userOld = await User.findById(_id);
			if (userOld === null) {
				errors.push({ message: 'User not found' });
			} else {
				// if password is null or empty then set it to the old password, otherwise, validate and hash
				if (userInput.password === null) {
					userInput.password = userOld.password;
					hashPassword = false;
				} else {
					hashPassword = true;
				}

				validateUserInput(userInput);

				if (errors.length === 0) {
					if (userInput.ver === null) {
						errors.push({ message: 'ver is a required field for updates!' });
					}
				}
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
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			let hashedPw = '';
			if (hashPassword) {
				hashedPw = await bcrypt.hash(userInput.password, 12);
			} else {
				hashedPw = userInput.password;
			}

			Object.assign(userOld, { ...userOld._doc, ...userInput, password: hashedPw });

			return userOld.save()
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return User.findById(_id);
				})
				.then(user => {
					return {
						...user._doc,
					};
				})
				.catch(err => {
					console.log(err);
					const error = new Error(catErrors('Database error updating item; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				});
		},

		deleteUser: (_, { _id }) => {
			const errors = [];
			return User.findByIdAndDelete(_id)
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
		login: async (_, { emailOrUsername, password }) => {
			const user = await User.findOne({ $or: [
				{ username: emailOrUsername },
				{ email: emailOrUsername }
			] });
			if (!user) {
				const error = new Error('User not found.');
				error.code = 401;
				throw error;
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				user.lastUnsuccessfulLogin = Date();
				await user.save();
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
			user.lastSuccessfulLogin = Date();
			await user.save();
			return { token: token, userId: user._id };
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

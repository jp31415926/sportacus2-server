const appConfig = require('../config');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');

const User = require('../models/user');


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
		const error = new Error('Invalid input');
		error.data = errors;
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	RootMutation: {
		createUser: async (_, { userInput }, req) => {
			validateUserInput(userInput);
			// .catch(err => {
			// 	throw err;
			// });

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

		deleteUser: async function (_, { _id }, req) {
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

	},

	RootQuery: {
		login: async function (_, { emailOrUsername, password }) {
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

		getUser: async function (_, { _id }, req) {
			const user = await User.findById(_id);
			if (!user) {
				const error = new Error('User not found.');
				error.code = 401;
				throw error;
			}
			return {
				_id: user._id.toString(),
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
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

	return next(_, args, req, info);
};

const hasPermission = (resource, permission) => next => async (_, args, req, info) => {
	// check if current user has the provided role
	console.log('check if user has ' + permission + ' permission for ' + resource + ' resource')
	//if (!context.currentUser.roles || context.currentUser.roles.includes(role)) {
	//	throw new Error('You are not authorized!');
	//}

	return next(_, args, req, info);
};

const resolversComposition = {
	'RootQuery.getUser': [isAuthenticated(), hasPermission('user', 'view')],
	'RootMutation.createUser': [isAuthenticated(), hasPermission('user', 'create')],
	'RootMutation.deleteUser': [isAuthenticated(), hasPermission('user', 'delete')],
	'RootMutation.updateUser': [isAuthenticated(), hasPermission('user', 'update')],
};

module.exports = composeResolvers(resolvers, resolversComposition);

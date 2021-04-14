const appConfig = require('../config');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');

const User = require('../models/user');
//const Post = require('../models/post');




async function createUser({ userInput }) {
	const errors = [];

	if (!validator.isEmail(userInput.email)) {
		errors.push({ message: 'Email is invalid.' });
	}
	if (!validator.isLength(userInput.password, { min: 5 })) {
		errors.push({ message: 'Password too short!' });
	}
	if (!validator.isLength(userInput.username, { min: 2 })) {
		errors.push({ message: 'Username too short!' });
	}
	if (validator.isEmpty(userInput.firstName)) {
		errors.push({ message: 'First name is required!' });
	}
	if (validator.isEmpty(userInput.lastName)) {
		errors.push({ message: 'Last name is required!' });
	}
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
		password: hashedPw
	});

	return user.save()
		.then(res => {
			return createdUser;
		})
		.catch(err => {
			const error = new Error('Database error creating user');
			error.data = errors;
			error.code = 422;
			throw error;
		});
}


const resolvers = {
	RootMutation: {
		signup: async function (_, { userInput }, req) {
			const createdUser = createUser({ userInput });
			return { ...createdUser._doc, _id: createdUser._id.toString() };
		},

		createUser: async function (_, { userInput }, req) {
			// this is the same as signup, which doesn't need permissions... this function is redundant.
			const createdUser = createUser({ userInput });
			return { ...createdUser._doc, _id: createdUser._id.toString() };
		},

		deleteUser: async function (_, { _id }, req) {
			const user = await User.findById(_id);
			if (!user) {
				const error = new Error('User not found.');
				error.code = 401;
				throw error;
			}
			return { success: true };
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
				email: user.email
			};
		},
	},

	// createPost: async function({ postInput }, req) {
	//   if (!req.isAuth) {
	//     const error = new Error('Not authenticated!');
	//     error.code = 401;
	//     throw error;
	//   }
	//   const errors = [];
	//   if (
	//     validator.isEmpty(postInput.title) ||
	//     !validator.isLength(postInput.title, { min: 5 })
	//   ) {
	//     errors.push({ message: 'Title is invalid.' });
	//   }
	//   if (
	//     validator.isEmpty(postInput.content) ||
	//     !validator.isLength(postInput.content, { min: 5 })
	//   ) {
	//     errors.push({ message: 'Content is invalid.' });
	//   }
	//   if (errors.length > 0) {
	//     const error = new Error('Invalid input.');
	//     error.data = errors;
	//     error.code = 422;
	//     throw error;
	//   }
	//   const user = await User.findById(req.userId);
	//   if (!user) {
	//     const error = new Error('Invalid user.');
	//     error.code = 401;
	//     throw error;
	//   }
	//   const post = new Post({
	//     title: postInput.title,
	//     content: postInput.content,
	//     imageUrl: postInput.imageUrl,
	//     creator: user
	//   });
	//   const createdPost = await post.save();
	//   user.posts.push(createdPost);
	//   return {
	//     ...createdPost._doc,
	//     _id: createdPost._id.toString(),
	//     createdAt: createdPost.createdAt.toISOString(),
	//     updatedAt: createdPost.updatedAt.toISOString()
	//   };
	//}
};

const isAuthenticated = () => next => async (_, args, req, info) => {
	// check if the current user is authenticated
	if (!req.isAuth) {
		const error = new Error('Not authenticated!');
		error.code = 401;
		throw error;
	}

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
	'RootMutation.deleteUser': [isAuthenticated(), hasPermission('user', 'delete')],
	'RootQuery.getUser': [isAuthenticated(), hasPermission('user', 'view')],
};

module.exports = composeResolvers(resolvers, resolversComposition);

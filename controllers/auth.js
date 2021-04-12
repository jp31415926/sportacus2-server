const appConfig = require('../config');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
Example query to create a new user:

mutation {
	createUser(userInput:
		{
			firstName: "Brainy",
			lastName: "Smurf",
			email: "brainy@smurf.com",
			password: "password"
		})
	{
		_id
		email
	}
}

Example response:
{
	"data": {
		"createUser": {
			"_id": "60748b151cff292c99e7ad95",
			"email": "brainy@smurf.com"
		}
	}
}

Or ERROR:
{
	"errors": [
		{
			"message": "User exists already!",
			"status": 500
		}
	],
	"data": null
}
*/

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	try {
		const hashedPw = await bcrypt.hash(req.body.password, 12);

		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPw,
		});
		const result = await user.save();
		res.status(201).json({ message: 'User created!', userId: result._id });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

/*
Example login query:

{
	login(email: "brainy@smurf.com", password: "password") {
		token
		userId
	}
}

Example result:
{
	"data": {
		"login": {
			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDc0ODY1ZGE4NWQ4YzJjNzRjNDRhMjgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MTgyNTA0MTAsImV4cCI6MTYxODI1NDAxMH0.TRTtPcSO5rYSNSONRVK3cvTYnK7i_bPkL0zRrIa2hp8",
			"userId": "6074865da85d8c2c74c44a28"
		}
	}
}

OR error:

{
	"errors": [
		{
			"message": "Password is incorrect.",
			"status": 401
		}
	],
	"data": null
}

*/


exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('A user with this email could not be found.');
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error('Wrong password!');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString()
			},
			config.secret,
			{ expiresIn: '1h' }
		);
		res.status(200).json({ token: token, userId: loadedUser._id.toString() });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getUserStatus = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error('User not found.');
			error.statusCode = 404;
			throw error;
		}
		res.status(200).json({ status: user.status });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.updateUserStatus = async (req, res, next) => {
	const newStatus = req.body.status;
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error('User not found.');
			error.statusCode = 404;
			throw error;
		}
		user.status = newStatus;
		await user.save();
		res.status(200).json({ message: 'User updated.' });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

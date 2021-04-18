const appConfig = require('../config');
const { doesNotMatch } = require('assert');
const { expect } = require('chai');
const fs = require('fs');
const mongoose = require("mongoose");

const graphqlResolver = require('../graphql/resolvers');

const User = require('../models/user');

const testUserInfo = {
	_id: '',
	email: 'rubber@ducky.com',
	username: 'rubberducky',
	password: 'password',
	firstName: 'Rubber',
	lastName: 'Ducky',
	createdAt: '',
	updatedAt: '',
};

describe('User functions', () => {
	before(async () => {
		await mongoose.connect('mongodb://' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
			{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
	});

	after(async () => {
		await mongoose.disconnect();
	});

	it('createUser should create a new user', async () => {
		var _, req = {};
		const userInput = {
			email: 'createUser_' + testUserInfo.email,
			username: 'createUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		result = await graphqlResolver.RootMutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();
		// cleanup
		await User.deleteOne({ _id: testUserId });

		expect(result.email).to.equal(userInput.email);
		expect(result.username).to.equal(userInput.username);
		expect(result.firstName).to.equal(userInput.firstName);
		expect(result.lastName).to.equal(userInput.lastName);
		expect(result.password).to.not.equal(userInput.password);

	});

	it('getUser should get a user by id', async () => {
		// create the test user
		const user = new User({
			email: 'getUser_' + testUserInfo.email,
			username: 'getUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		});
		await user.save();
		const dbuser = await User.findOne({ email: 'getUser_' + testUserInfo.email });
		const testUserId = dbuser._id.toString();

		var _, req = {};
		result = await graphqlResolver.RootQuery.getUser(_, { _id: testUserId }, req);
		// cleanup
		await User.deleteOne({ _id: testUserId });

		expect(result.email).to.equal('getUser_' + testUserInfo.email);
		expect(result.username).to.equal('getUser_' + testUserInfo.username);
		expect(result.firstName).to.equal(testUserInfo.firstName);
		expect(result.lastName).to.equal(testUserInfo.lastName);
	});

});

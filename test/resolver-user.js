const appConfig = require('../config');
//const { doesNotMatch } = require('assert');
const { expect } = require('chai');
//const fs = require('fs');
const mongoose = require("mongoose");

const graphqlResolver = require('../graphql/resolvers/user');

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

/*global describe, before, after, it */

describe('User functions', () => {
	before(async () => {
		await mongoose.connect('mongodb://' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
			{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
		await User.deleteMany();
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

		var result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// Don't assume that what is returned is what was stored in the database
		result = await User.findById(testUserId);

		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testUserId);
		if (!testUserId) {

			// cleanup
			await User.deleteOne({ _id: testUserId });

			expect(result.email).to.equal(userInput.email);
			expect(result.username).to.equal(userInput.username);
			expect(result.firstName).to.equal(userInput.firstName);
			expect(result.lastName).to.equal(userInput.lastName);
			expect(result.password).to.not.equal(userInput.password);
		}
	});

	it('updateUser should update an existing user', async () => {
		var _, req = {};
		var userInput = {
			email: 'updateUser_' + testUserInfo.email,
			username: 'updateUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};
		const user = await User.create(userInput);
		const testUserId = user._id.toString();

		userInput.email = 'updateUser2_' + testUserInfo.email;
		userInput.username = 'updateUser_' + testUserInfo.username + '2';
		userInput.password = testUserInfo.password + '2';
		userInput.firstName = testUserInfo.firstName + '2';
		userInput.lastName = testUserInfo.lastName + '2';

		var result = await graphqlResolver.Mutation.updateUser(_, { _id: testUserId, userInput }, req);

		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testUserId);
		if (!testUserId) {
			// cleanup
			await User.deleteOne({ _id: testUserId });

			expect(result.email).to.equal(userInput.email);
			expect(result.username).to.equal(userInput.username);
			expect(result.firstName).to.equal(userInput.firstName);
			expect(result.lastName).to.equal(userInput.lastName);
			expect(result.password).to.not.equal(userInput.password);
		}
	});

	it('getUser should get a user by id', async () => {
		// create the test user
		const user = await User.create({
			email: 'getUser_' + testUserInfo.email,
			username: 'getUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		});
		const testUserId = user._id.toString();

		var _, req = {};
		var result = await graphqlResolver.Query.getUser(_, { _id: testUserId }, req);
		// cleanup
		await User.deleteOne({ _id: testUserId });

		expect(result.email).to.equal('getUser_' + testUserInfo.email);
		expect(result.username).to.equal('getUser_' + testUserInfo.username);
		expect(result.firstName).to.equal(testUserInfo.firstName);
		expect(result.lastName).to.equal(testUserInfo.lastName);
	});

	it('deleteUser should delete a user by id', async () => {
		// create the test user
		const user = await User.create({
			email: 'deleteUser_' + testUserInfo.email,
			username: 'deleteUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		});
		const testUserId = user._id.toString();

		var _, req = {};
		var result = await graphqlResolver.Mutation.deleteUser(_, { _id: testUserId }, req);
		result = await User.findById(testUserId);
		expect(result).to.be.null;
		result = await User.findOne({ email: 'deleteUser_' + testUserInfo.email });
		expect(result).to.be.null;
	});

});

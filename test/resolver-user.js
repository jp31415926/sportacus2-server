/* eslint-disable max-lines */
//const appConfig = require('../config');
//const { doesNotMatch } = require('assert');
const { expect } = require('chai');

const graphqlResolver = require('../graphql/resolvers/user');

const User = require('../models/user');

const testUserInfo = {
	_id: '',
	email: 'rubber@ducky.com',
	username: 'rubberducky',
	password: 'password',
	firstName: 'Rubber',
	lastName: 'Ducky',
	lastSuccessfulLogin: new Date(0),
	lastUnsuccessfulLogin: new Date(0),
	createdAt: '',
	updatedAt: '',
};

// eslint-disable-next-line max-lines-per-function
describe('User functions', () => {
	before(async () => {
		await User.deleteMany();
	});

	// after(async () => {
	// });

	it('createUser should create a new user', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'createUser_' + testUserInfo.email,
			username: 'createUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		let result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// Don't assume that what is returned is what was stored in the database
		result = await User.findById(testUserId);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testUserId);
		expect(result.email).to.equal(userInput.email);
		expect(result.username).to.equal(userInput.username);
		expect(result.firstName).to.equal(userInput.firstName);
		expect(result.lastName).to.equal(userInput.lastName);
		expect(result.lastSuccessfulLogin.getTime()).to.equal(testUserInfo.lastSuccessfulLogin.getTime());
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(testUserInfo.lastUnsuccessfulLogin.getTime());
		expect(result.password).to.not.equal(userInput.password);
		expect(result.ver).to.equal(0);
	});

	it('login with username should provide a login token and update successful login datetime', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'login1_' + testUserInfo.email,
			username: 'login1_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		// use createUser here to hash the password so login will work as it should
		let result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// login with username
		result = await graphqlResolver.Query.login(_, {
			emailOrUsername: userInput.username,
			password: userInput.password
		}, req);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result.userId.toString()).to.equal(testUserId);
		// eslint-disable-next-line no-unused-expressions
		expect(result.token).not.empty;
		expect(result.token.length).to.equal(221);

		// get user record and make sure dates were updated (or not)
		result = await User.findById(testUserId);
		expect(result.lastSuccessfulLogin.getTime()).to.not.equal(testUserInfo.lastSuccessfulLogin.getTime());
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(testUserInfo.lastUnsuccessfulLogin.getTime());

	});

	it('login with email should provide a login token and update successful login datetime', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'login2_' + testUserInfo.email,
			username: 'login2_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		// use createUser here to hash the password so login will work as it should
		let result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// login with email
		result = await graphqlResolver.Query.login(_, {
			emailOrUsername: userInput.email,
			password: userInput.password
		}, req);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result.userId.toString()).to.equal(testUserId);
		// eslint-disable-next-line no-unused-expressions
		expect(result.token).not.empty;
		expect(result.token.length).to.equal(221);

		// get user record and make sure dates were updated (or not)
		result = await User.findById(testUserId);
		expect(result.lastSuccessfulLogin.getTime()).to.not.equal(testUserInfo.lastSuccessfulLogin.getTime());
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(testUserInfo.lastUnsuccessfulLogin.getTime());

	});

	it('login with invalid email should fail and not update login datetimes', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'login3_' + testUserInfo.email,
			username: 'login3_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		// use createUser here to hash the password so login will work as it should
		let result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// failed login attempt - invalid email
		result = null;
		try {
			result = await graphqlResolver.Query.login(_, {
				emailOrUsername: 'fail_' + userInput.email,
				password: userInput.password
			}, req);
			// eslint-disable-next-line no-unused-expressions
			expect(result).to.be.null;
		} catch (err) {
			// eslint-disable-next-line no-unused-expressions
			expect(result).to.be.null;
		}

		// get updated user record
		result = await User.findById(testUserId);
		// test that lastUnsuccessfulLogin changed and lastSuccessfulLogin did not
		expect(result.lastSuccessfulLogin.getTime()).to.equal(testUserInfo.lastSuccessfulLogin.getTime());
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(testUserInfo.lastUnsuccessfulLogin.getTime());
	});

	it('login with invalid password should fail and update unsuccessful login datetime', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'login4_' + testUserInfo.email,
			username: 'login4_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
		};

		// use createUser here to hash the password so login will work as it should
		let result = await graphqlResolver.Mutation.createUser(_, { userInput }, req);
		const testUserId = result._id.toString();

		// failed login attempt - invalid email
		result = null;
		try {
			result = await graphqlResolver.Query.login(_, {
				emailOrUsername: userInput.email,
				password: 'fail_' + userInput.password
			}, req);
			// eslint-disable-next-line no-unused-expressions
			expect(result).to.be.null;
		} catch (err) {
			// eslint-disable-next-line no-unused-expressions
			expect(result).to.be.null;
		}

		// get updated user record
		result = await User.findById(testUserId);
		// test that lastUnsuccessfulLogin changed and lastSuccessfulLogin did not
		expect(result.lastSuccessfulLogin.getTime()).to.equal(testUserInfo.lastSuccessfulLogin.getTime());
		expect(result.lastUnsuccessfulLogin.getTime()).to.not.equal(testUserInfo.lastUnsuccessfulLogin.getTime());
	});

	it('updateUser should update an existing user', async () => {
		const _ = null;
		const	req = {};
		const userInput = {
			email: 'updateUser_' + testUserInfo.email,
			username: 'updateUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
			lastSuccessfulLogin: testUserInfo.lastSuccessfulLogin,
			lastUnsuccessfulLogin: testUserInfo.lastUnsuccessfulLogin,
		};
		let user = await User.create(userInput);
		const testUserId = user._id.toString();
		user = await User.findById(testUserId);

		userInput.email = 'updateUser2_' + testUserInfo.email;
		userInput.username = 'updateUser_' + testUserInfo.username + '2';
		userInput.password = testUserInfo.password + '2';
		userInput.firstName = testUserInfo.firstName + '2';
		userInput.lastName = testUserInfo.lastName + '2';
		userInput.lastSuccessfulLogin = new Date(12345);
		userInput.lastUnsuccessfulLogin = new Date(67890);
		userInput.ver = user.ver;

		const result = await graphqlResolver.Mutation.updateUser(_, { _id: testUserId, userInput }, req);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testUserId);
		expect(result.email).to.equal(userInput.email);
		expect(result.username).to.equal(userInput.username);
		expect(result.firstName).to.equal(userInput.firstName);
		expect(result.lastName).to.equal(userInput.lastName);
		expect(result.lastSuccessfulLogin.getTime()).to.equal(0); // not allowed to update this from the API
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(0); // not allowed to update this from the API
		expect(result.password).to.not.equal(userInput.password);
		expect(result.ver).to.equal(1);
	});

	it('getUser should get a user by id', async () => {
		// create the test user
		const user = await User.create({
			email: 'getUser_' + testUserInfo.email,
			username: 'getUser_' + testUserInfo.username,
			password: testUserInfo.password,
			firstName: testUserInfo.firstName,
			lastName: testUserInfo.lastName,
			lastSuccessfulLogin: new Date(12345),
			lastUnsuccessfulLogin: new Date(67890),
		});
		const testUserId = user._id.toString();

		const _ = null;
		const	req = {};
		const result = await graphqlResolver.Query.getUser(_, { _id: testUserId }, req);
		// cleanup
		// await User.deleteOne({ _id: testUserId });

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result.email).to.equal('getUser_' + testUserInfo.email);
		expect(result.username).to.equal('getUser_' + testUserInfo.username);
		expect(result.firstName).to.equal(testUserInfo.firstName);
		expect(result.lastName).to.equal(testUserInfo.lastName);
		expect(result.lastSuccessfulLogin.getTime()).to.equal(12345);
		expect(result.lastUnsuccessfulLogin.getTime()).to.equal(67890);
		expect(result.ver).to.equal(0);
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

		const _ = null;
		const	req = {};
		let result = await graphqlResolver.Mutation.deleteUser(_, { _id: testUserId }, req);
		result = await User.findById(testUserId);
		// eslint-disable-next-line no-unused-expressions
		expect(result).to.be.null;
		result = await User.findOne({ email: 'deleteUser_' + testUserInfo.email });
		// eslint-disable-next-line no-unused-expressions
		expect(result).to.be.null;
	});

});

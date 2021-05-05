/* eslint-disable max-lines */
//const appConfig = require('../config');
//const { doesNotMatch } = require('assert');
const { expect } = require('chai');

const graphqlResolver = require('../graphql/resolvers/venue');

const Venue = require('../models/venue');
const POC = require('../models/poc');

const testVenueInfo = {
	_id: '',
	name: 'park',
	longName: 'Soccer Park',
	latitude: 12.34,
	longitude: 23.45,
	url: 'https://park.com',
	//poc: [],
	street1: '1 main st',
	street2: '',
	city: 'city',
	state: 'state',
	zipcode: '34567',
	country: 'US',
	subField: false,
	//parent: '',
	createdAt: '',
	updatedAt: '',
	ver: 0,
};

// eslint-disable-next-line max-lines-per-function
describe('Venue functions', () => {
	// before(async () => {
	// });

	// after(async () => {
	// });

	it('createVenue should create a new venue', async () => {
		const _ = null;
		const	req = {};
		const venueInput = {
			name: 'createVenue_' + testVenueInfo.name,
			longName: testVenueInfo.longName,
			latitude: testVenueInfo.latitude,
			longitude: testVenueInfo.longitude,
			url: testVenueInfo.url,
			//poc: testVenueInfo.poc,
			street1: testVenueInfo.street1,
			street2: testVenueInfo.street2,
			city: testVenueInfo.city,
			state: testVenueInfo.state,
			zipcode: testVenueInfo.zipcode,
			country: testVenueInfo.country,
			subField: testVenueInfo.subField,
			//parent: testVenueInfo.parent,
		};

		let result = await graphqlResolver.Mutation.createVenue(_, { venueInput }, req);
		const testVenueId = result._id.toString();

		// Don't assume that what is returned is what was stored in the database
		result = await Venue.findById(testVenueId);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testVenueId);
		expect(result.name).to.equal(venueInput.name);
		expect(result.longName).to.equal(venueInput.longName);
		expect(result.latitude).to.equal(venueInput.latitude);
		expect(result.longitude).to.equal(venueInput.longitude);
		expect(result.url).to.equal(venueInput.url);
		//expect(result.poc).to.equal(venueInput.poc);
		expect(result.street1).to.equal(venueInput.street1);
		expect(result.street2).to.equal(venueInput.street2);
		expect(result.city).to.equal(venueInput.city);
		expect(result.state).to.equal(venueInput.state);
		expect(result.zipcode).to.equal(venueInput.zipcode);
		expect(result.country).to.equal(venueInput.country);
		expect(result.subField).to.equal(venueInput.subField);
		//expect(result.parent).to.equal(venueInput.parent);
		expect(result.ver).to.equal(0);
	});

	it('updateVenue should update an existing venue', async () => {
		const _ = null;
		const	req = {};
		const venueInput = {
			name: 'updateVenue_' + testVenueInfo.name,
			longName: testVenueInfo.longName,
			latitude: testVenueInfo.latitude,
			longitude: testVenueInfo.longitude,
			url: testVenueInfo.url,
			//poc: testVenueInfo.poc,
			street1: testVenueInfo.street1,
			street2: testVenueInfo.street2,
			city: testVenueInfo.city,
			state: testVenueInfo.state,
			zipcode: testVenueInfo.zipcode,
			country: testVenueInfo.country,
			subField: testVenueInfo.subField,
			//parent: testVenueInfo.parent,
		};
		let venue = await Venue.create(venueInput);
		const testVenueId = venue._id.toString();
		venue = await Venue.findById(testVenueId);

		venueInput.name = 'updateVenue2_' + testVenueInfo.name;
		venueInput.longName = 'updateVenue2_' + testVenueInfo.longName;
		venueInput.latitude = testVenueInfo.latitude + 2;
		venueInput.longitude = testVenueInfo.longitude + 2;
		venueInput.url = testVenueInfo.url + '2';
		venueInput.street1 = testVenueInfo.street1 + '2';
		venueInput.street2 = testVenueInfo.street2 + '2';
		venueInput.city = testVenueInfo.city + '2';
		venueInput.state = testVenueInfo.state + '2';
		venueInput.zipcode = testVenueInfo.zipcode + '2';
		venueInput.country = testVenueInfo.country + '2';
		venueInput.subField = true;
		venueInput.ver = venue.ver;

		const result = await graphqlResolver.Mutation.updateVenue(_, { _id: testVenueId, venueInput }, req);

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result._id.toString()).to.equal(testVenueId);
		expect(result.name).to.equal(venueInput.name);
		expect(result.longName).to.equal(venueInput.longName);
		expect(result.latitude).to.equal(venueInput.latitude);
		expect(result.longitude).to.equal(venueInput.longitude);
		expect(result.url).to.equal(venueInput.url);
		expect(result.street1).to.equal(venueInput.street1);
		expect(result.street2).to.equal(venueInput.street2);
		expect(result.city).to.equal(venueInput.city);
		expect(result.state).to.equal(venueInput.state);
		expect(result.zipcode).to.equal(venueInput.zipcode);
		expect(result.country).to.equal(venueInput.country);
		expect(result.subField).to.equal(venueInput.subField);
		expect(result.ver).to.equal(1);
	});

	it('getVenue should get a venue by id', async () => {
		// create the test venue
		const venue = await Venue.create({
			name: 'getVenue_' + testVenueInfo.name,
			longName: testVenueInfo.longName,
			latitude: testVenueInfo.latitude,
			longitude: testVenueInfo.longitude,
			url: testVenueInfo.url,
			poc: [new POC()],
			street1: testVenueInfo.street1,
			street2: testVenueInfo.street2,
			city: testVenueInfo.city,
			state: testVenueInfo.state,
			zipcode: testVenueInfo.zipcode,
			country: testVenueInfo.country,
			subField: testVenueInfo.subField,
			//parent: testVenueInfo.parent,
		});
		const testVenueId = venue._id.toString();

		const _ = null;
		const	req = {};
		const result = await graphqlResolver.Query.getVenue(_, { _id: testVenueId }, req);
		// cleanup
		// await Venue.deleteOne({ _id: testVenueId });

		// eslint-disable-next-line no-unused-expressions
		expect(result).not.to.be.null;
		expect(result.name).to.equal('getVenue_' + testVenueInfo.name);
		expect(result.longName).to.equal(testVenueInfo.longName);
		expect(result.latitude).to.equal(testVenueInfo.latitude);
		expect(result.longitude).to.equal(testVenueInfo.longitude);
		expect(result.url).to.equal(testVenueInfo.url);
		expect(result.street1).to.equal(testVenueInfo.street1);
		expect(result.street2).to.equal(testVenueInfo.street2);
		expect(result.city).to.equal(testVenueInfo.city);
		expect(result.state).to.equal(testVenueInfo.state);
		expect(result.zipcode).to.equal(testVenueInfo.zipcode);
		expect(result.country).to.equal(testVenueInfo.country);
		expect(result.subField).to.equal(testVenueInfo.subField);
		expect(result.ver).to.equal(0);
	});

	it('deleteVenue should delete a venue by id', async () => {
		// create the test venue
		const venue = await Venue.create({
			name: 'deleteVenue_' + testVenueInfo.name,
			longName: testVenueInfo.longName,
			latitude: testVenueInfo.latitude,
			longitude: testVenueInfo.longitude,
			url: testVenueInfo.url,
			poc: [new POC()],
			street1: testVenueInfo.street1,
			street2: testVenueInfo.street2,
			city: testVenueInfo.city,
			state: testVenueInfo.state,
			zipcode: testVenueInfo.zipcode,
			country: testVenueInfo.country,
			subField: testVenueInfo.subField,
		});
		const testVenueId = venue._id.toString();

		const _ = null;
		const	req = {};
		let result = await graphqlResolver.Mutation.deleteVenue(_, { _id: testVenueId }, req);
		result = await Venue.findById(testVenueId);
		// eslint-disable-next-line no-unused-expressions
		expect(result).to.be.null;
		result = await Venue.findOne({ name: 'deleteVenue_' + testVenueInfo.name });
		// eslint-disable-next-line no-unused-expressions
		expect(result).to.be.null;
	});

});

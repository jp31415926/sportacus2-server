const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	longName: {
		type: String,
	},
	latitude: {
		type: Number,
	},
	longitude: {
		type: Number,
	},
	url: {
		type: String,
	},
	poc: [{
		type: Schema.Types.ObjectId,
		ref: 'POC',
	}],
	street1: {
		type: String,
	},
	street2: {
		type: String,
	},
	city: {
		type: String,
	},
	state: {
		type: String,
	},
	zipcode: {
		type: String,
	},
	country: {
		type: String,
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Venue',
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'Venue',
	}],
	region: [{
		type: Schema.Types.ObjectId,
		ref: 'Region',
	}],
	organization: [{
		type: Schema.Types.ObjectId,
		ref: 'Organization',
	}],
},
	{ timestamps: true }
);

module.exports = mongoose.model('Venue', schema);

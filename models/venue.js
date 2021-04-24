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
	subField: {
		type: Boolean,
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Venue',
	},
	group: [{
		type: Schema.Types.ObjectId,
		ref: 'Group',
	}],
},
	{ timestamps: true }
);

module.exports = mongoose.model('Venue', schema);

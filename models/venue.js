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
		trim: true,
	},
	latitude: {
		type: Number,
	},
	longitude: {
		type: Number,
	},
	url: {
		type: String,
		trim: true,
	},
	poc: [
		{
			type: Schema.Types.ObjectId,
			ref: 'POC',
		}
	],
	street1: {
		type: String,
		trim: true,
	},
	street2: {
		type: String,
		trim: true,
	},
	city: {
		type: String,
		trim: true,
	},
	state: {
		type: String,
		trim: true,
	},
	zipcode: {
		type: String,
		trim: true,
	},
	country: {
		type: String,
		trim: true,
	},
	subField: {
		type: Boolean,
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Venue',
	},
	group: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Group',
		}
	],
},
{
	timestamps: true,
	optimisticConcurrency: true,
	versionKey: 'ver'
}
);

module.exports = mongoose.model('Venue', schema);

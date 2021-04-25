const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	number: {
		type: Number,
		required: true,
	},
	status: {
		type: String, // enum?
		required: true,
	},
	dateTime: {
		type: Date,
		required: true,
	},
	venue: {
		type: Schema.Types.ObjectId,
		ref: 'Venue',
	},
	/// Length of each half, times 2, in minutes.
	length: {
		type: Number,
		required: true,
	},
	/// Amount of time to reserve on the field for this game. Used for conflict resolution.
	timeSlotLength: {
		type: Number,
		required: true,
	},
	shortNote: {
		type: String,
	},

	homeJerseyColor: {
		type: String,
	},
	awayJerseyColor: {
		type: String,
	},

	homeTeam: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
	},
	awayTeam: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
	},

	group: {
		type: Schema.Types.ObjectId,
		ref: 'Group',
	},
	updateCount: {
		type: Number,
	},
},
	{ timestamps: true }
);

module.exports = mongoose.model('Game', schema);

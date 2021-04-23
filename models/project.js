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
		required: true,
	},
	startDate: {
		type: String, // TODO: use Date scalar
		required: true,
	},
	endDate: {
		type: String, // TODO: use Date scalar
		required: true,
	},
	archived: {
		type: Boolean,
	},
},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', schema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	longName: {
		type: String,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	archived: {
		type: Boolean,
	},
},
{ timestamps: true }
);

module.exports = mongoose.model('Project', schema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minLength: [
			2,
			'Must be at least 2 characters long'
		],
		maxLength: [
			32,
			'Must be no more than 32 characters long'
		],
	},
	longName: {
		type: String,
		required: true,
		trim: true,
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

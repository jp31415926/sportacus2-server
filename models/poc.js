const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	phone: [{
		type: String,
	}],
	email: [{
		type: String,
	}],
},
	{ timestamps: true }
);

//schema.set('timestamps', true); // this will add createdAt and updatedAt timestamps

module.exports = mongoose.model('POC', schema);
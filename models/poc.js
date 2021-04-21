const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	email: [{
		type: String,
	}],
	phone: [{
		type: String,
	}],
},
	{ timestamps: true }
);

//schema.set('timestamps', true); // this will add createdAt and updatedAt timestamps

module.exports = mongoose.model('POC', schema);

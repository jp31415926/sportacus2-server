const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
	street1: {
		type: String,
		required: true,
	},
	street2: {
		type: String,
	},
	city: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	zipcode: {
		type: String,
		required: true,
	},
	country: {
		type: String,
	},
},
	{ timestamps: true }
);

//schema.set('timestamps', true); // this will add createdAt and updatedAt timestamps

module.exports = mongoose.model("StreetAddress", schema);

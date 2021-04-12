const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		match: /[a-z0-9_]+/
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		// unique only optimizes access by assuming there is only one. It does not enforce uniqueness.
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true
	},
});

module.exports = mongoose.model("User", schema);

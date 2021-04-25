const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		match: /[a-zA-Z0-9_]+/
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
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true
	},
	roles: [{
		type: Schema.Types.ObjectId,
		ref: 'Role',
	}],
	lastSuccessfulLogin: {
		type: Date,
	},
	lastUnsuccessfulLogin: {
		type: Date,
	},
},
	{ timestamps: true }
);

module.exports = mongoose.model('User', schema);

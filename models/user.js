const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		minLength: [
			2,
			'Must be at least 2 characters long'
		],
		maxLength: [
			32,
			'Must be no more than 32 characters long'
		],
		match: /[a-zA-Z_][a-zA-Z0-9_]+/u
	},
	firstName: {
		type: String,
		trim: true,
		minLength: [
			2,
			'Must be at least 2 characters long'
		],
		maxLength: [
			128,
			'Must be no more than 128 characters long'
		],
		required: true
	},
	lastName: {
		type: String,
		trim: true,
		minLength: [
			2,
			'Must be at least 2 characters long'
		],
		maxLength: [
			128,
			'Must be no more than 128 characters long'
		],
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/u
	},
	password: {
		type: String,
		minLength: [
			5,
			'Must be at least 5 characters long'
		],
		maxLength: [
			128,
			'Must be no more than 128 characters long'
		],
		required: true
	},
	roles: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Role',
		}
	],
	lastSuccessfulLogin: {
		type: Date,
		default: new Date(0),
	},
	lastUnsuccessfulLogin: {
		type: Date,
		default: new Date(0),
	},
},
{
	timestamps: true,
	optimisticConcurrency: true,
	versionKey: 'ver'
}
);

module.exports = mongoose.model('User', schema);

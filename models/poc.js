const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	title: {
		type: String,
	},
	email: [
		{
			type: String,
		}
	],
	phone: [
		{
			type: String,
		}
	],
	// optional user associated with this POC
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
},
{ timestamps: true }
);

module.exports = mongoose.model('POC', schema);

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
	},
	coaches: [
		{
			type: Schema.Types.ObjectId,
			ref: 'POC',
		}
	],
	homeJerseyColor: {
		type: String,
	},
	awayJerseyColor: {
		type: String,
	},
	group: {
		type: Schema.Types.ObjectId,
		ref: 'Group',
	},
},
{ timestamps: true }
);

module.exports = mongoose.model('Team', schema);

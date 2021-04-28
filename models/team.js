const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	longName: {
		type: String,
		trim: true,
	},
	coaches: [
		{
			type: Schema.Types.ObjectId,
			ref: 'POC',
		}
	],
	homeJerseyColor: {
		type: String,
		trim: true,
	},
	awayJerseyColor: {
		type: String,
		trim: true,
	},
	group: {
		type: Schema.Types.ObjectId,
		ref: 'Group',
	},
},
{ timestamps: true }
);

module.exports = mongoose.model('Team', schema);

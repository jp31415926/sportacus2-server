const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	project: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		required: true,
	},
},
	{ timestamps: true }
);

module.exports = mongoose.model('Role', schema);

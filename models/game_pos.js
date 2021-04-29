const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
	// name of function (i.e. CR, AR1, Snacks)
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},

},
{
	timestamps: true,
	optimisticConcurrency: true,
	versionKey: 'ver'
}
);

module.exports = mongoose.model('Function', schema);

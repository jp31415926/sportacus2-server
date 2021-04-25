const mongoose = require('mongoose');
const { Schema } = mongoose;

// A group is the hierarchical parent of team(s) or other group(s). Teams and Group point to this group.

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	// used for searching. example: agegroup, region, area, section, etc.
	searchKey: {
		type: String,
	},
	adminPOCs: [{
		type: Schema.Types.ObjectId,
		ref: 'POC',
	}],
	refereePOCs: [{
		type: Schema.Types.ObjectId,
		ref: 'POC',
	}],
	coachPOCs: [{
		type: Schema.Types.ObjectId,
		ref: 'POC',
	}],
	project: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		required: true,

	},
	// points to a hierarchical parent group
	parentGroup: {
		type: Schema.Types.ObjectId,
		ref: 'Group',
	},
},
	{ timestamps: true }
);

module.exports = mongoose.model('Group', schema);

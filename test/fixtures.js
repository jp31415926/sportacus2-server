const mongoose = require("mongoose");
const appConfig = require('../config');

const User = require('../models/user');
const Venue = require('../models/venue');
const POC = require('../models/poc');

exports.mochaGlobalSetup = async () => {
	await mongoose.connect('mongodb://' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			poolSize: 5, // increase pool size which allows more syncronous connections, and thus operations
		});
	await User.deleteMany();
	await Venue.deleteMany();
	await POC.deleteMany();
//	console.log('MongoDB server running on port ' + appConfig.db.port);
};

exports.mochaGlobalTeardown = async () => {
	await mongoose.disconnect();
	//console.log('MongoDB server stopped');
};

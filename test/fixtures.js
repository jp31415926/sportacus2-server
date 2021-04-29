const mongoose = require("mongoose");
const appConfig = require('../config');

exports.mochaGlobalSetup = async () => {
	await mongoose.connect('mongodb://' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			poolSize: 5, // increase pool size which allows more syncronous connections, and thus operations
		});
//	console.log('MongoDB server running on port ' + appConfig.db.port);
};

exports.mochaGlobalTeardown = async () => {
	await mongoose.disconnect();
	//console.log('MongoDB server stopped');
};

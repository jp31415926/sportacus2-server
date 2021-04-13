// NODE_ENV can be 'development', 'test' or 'production'. Default is development.
// Run server like this to set the environment correctly.
//
// NODE_ENV=production node server.js
//
// This config derived from code on https://codingsans.com/blog/node-config-best-practices

const env = process.env.NODE_ENV === 'production' ? 'production' :
	(process.env.NODE_ENV === 'test' ? 'test' : 'development');

const development = {
	env: env,

	app: {
		port: 8080,
		secret: 'somesupersecretsecret',
	},

	// database details
	db: {
		user: 's2db',
		pass: 'db password',
		hostname: 'localhost',
		port: 27017,
		name: 'sportacus2-dev',
	},
};

const production = {
	env: env,

	app: {
		port: 8080,
		secret: 'somesupersecretsecret',
	},

	// database details
	db: {
		user: 's2db',
		pass: 'db password',
		hostname: 'localhost',
		port: 27017,
		name: 'sportacus2',
	},
};

const test = {
	env: env,

	app: {
		port: 8080,
		secret: 'somesupersecretsecret',
	},

	// database details
	db: {
		user: 's2db',
		pass: 'db password',
		hostname: 'localhost',
		port: 27017,
		name: 'sportacus2-test',
	},
};

const config = {
	development,
	production,
	test,
};

module.exports = config[env];

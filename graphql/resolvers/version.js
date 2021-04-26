const packageJson = require("../../package.json");

const resolvers = {
	Query: {
		version: () => {
			return {
				versionServer: packageJson.version,
				versionAPI: packageJson.versionAPI,
			};
		}
	},
};

module.exports = resolvers;

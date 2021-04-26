const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeResolvers } = require('@graphql-tools/merge');
//const { addResolversToSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const path = require('path');

//const { GraphQLDate } = require('graphql-scalars');
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');
const { mergeTypeDefs } = require('@graphql-tools/merge');

//const { modifyObjectFields } = require("@graphql-tools/utils");

// TODO: Put this into a separate module?
const isAuthenticated = () => next => /*async*/ (_, args, req, info) => {
	// check if the current user is authenticated
	// commented out for testing
	// if (!req.isAuth) {
	// 	const error = new Error('Not authenticated!');
	// 	error.code = 401;
	// 	throw error;
	// }
	req.userId = 123; // FAKE IT FOR NOW
	return next(_, args, req, info);
};

const hasPermission = (resource, permission) => next => /*async*/ (_, args, req, info) => {
	// check if current user has the provided role
	console.log('check if user ' + req.userId + ' has ' + permission + ' permission for ' + resource + ' resource')
	//if (!context.currentUser.roles || context.currentUser.roles.includes(role)) {
	//	throw new Error('You are not authorized!');
	//}

	// here we want to check that the user has the permission for any of the levels of action:
	// if permission = 'view', we will check for the following:
	// does the role allow:
	// view:any (user can view any of a particular resource)
	// view:agegroup (user can view resources associated with a particular agegroup)
	// view:region (user can view resources associated with a particular region)
	// view:org (user can view resources associated with a particular org)
	// this pattern continues for all actions (view,create,delete,update)

	return next(_, args, req, info);
};

const resolversComposition = {
	'Query.login': [],
	'Query.getUser': [
		isAuthenticated(),
		hasPermission('user', 'view')
	],
	'Query.getUsers': [
		isAuthenticated(),
		hasPermission('user', 'list')
	],
	'Mutation.createUser': [
		isAuthenticated(),
		hasPermission('user', 'create')
	],
	'Mutation.deleteUser': [
		isAuthenticated(),
		hasPermission('user', 'delete')
	],
	'Mutation.updateUser': [
		isAuthenticated(),
		hasPermission('user', 'update')
	],
};

const graphqlSchemas = loadFilesSync(path.join(__dirname, 'schemas', '*.graphql'));

const resolversArray = loadFilesSync(path.join(__dirname, 'resolvers', '*.js'));
const mergedResolvers = mergeResolvers(resolversArray);
const graphqlResolvers = composeResolvers(mergedResolvers, resolversComposition);

const schemaWithResolvers = makeExecutableSchema({
	typeDefs: mergeTypeDefs(
		[
			...scalarTypeDefs,
			...graphqlSchemas
		]),
	resolvers: graphqlResolvers,
})

module.exports = schemaWithResolvers;

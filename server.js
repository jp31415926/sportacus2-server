const appConfig = require("./config");

const express = require("express");
const path = require('path');
//const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
//const graphqlTools = require('graphql-tools');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeResolvers } = require('@graphql-tools/merge');
//const { addResolversToSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');

//const graphqlSchema = require('./graphql/schema');
//const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/check-auth');
//FIXME: const acl = require('./middleware/acl');

const app = express();

// app.use(morgan("dev"));

// upload files to the uploads directory
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		// FIXME WARNING: toISOString() produces characters that are illegal for a Windows platform filename!
		cb(null, new Date().toISOString() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};


//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	// 'image' here is the field name in the HTML form
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
// '/uploads' is the route to access uploaded files
// 'uploads' is the actual directory name, which should exist
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// add headers that we want for all responses
// avoid CORS errors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, PATCH, DELETE, GET');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(auth);

const isAuthenticated = () => next => async (_, args, req, info) => {
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

const hasPermission = (resource, permission) => next => async (_, args, req, info) => {
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
	'RootQuery.getUser': [isAuthenticated(), hasPermission('user', 'view')],
	'RootQuery.getUsers': [isAuthenticated(), hasPermission('user', 'list')],
	'RootMutation.createUser': [isAuthenticated(), hasPermission('user', 'create')],
	'RootMutation.deleteUser': [isAuthenticated(), hasPermission('user', 'delete')],
	'RootMutation.updateUser': [isAuthenticated(), hasPermission('user', 'update')],
};

const graphqlSchemas = loadFilesSync(path.join(__dirname, 'graphql', 'schemas', '*.graphql'));

const resolversArray = loadFilesSync(path.join(__dirname, 'graphql', 'resolvers', '*.js'));
const mergedResolvers = mergeResolvers(resolversArray);
const graphqlResolvers = composeResolvers(mergedResolvers, resolversComposition);

const schemaWithResolvers = makeExecutableSchema({
	typeDefs: graphqlSchemas,
	resolvers: graphqlResolvers,
})

app.use(
	'/graphql', graphqlHTTP({
		schema: schemaWithResolvers,
		//schema: graphqlSchema,
		//rootValue: graphqlResolver,
		graphiql: appConfig.env === 'development', // only enable graphiql in development environment
		formatError(err) {
			if (!err.originalError) {
				return err;
			}
			const data = err.originalError.data;
			const message = err.message || 'An error occurred.';
			const code = err.originalError.code || 500;
			return { message: message, status: code, data: data };
		}
	})
);





// default route - 404 error
app.use((req, res, next) => {
	const error = new Error("Not found.");
	error.status = 404;
	next(error);
});

// Error route (when we throw errors it comes here)
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

// connect to database, and if successful, start server
console.log('Connecting to DB');
//mongoose.connect('mongodb://' + appConfig.db.user + ':' + appConfig.db.pass + '@' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
mongoose.connect('mongodb://' + appConfig.db.hostname + ':' + appConfig.db.port + '/' + appConfig.db.name,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(result => {
		console.log('Starting mongodbBackend');
		acl = new require('acl2').mongodbBackend({ db: mongoose.connection.db, useSingle: true });

		console.log('Listening on port ' + appConfig.app.port);
		app.listen(appConfig.app.port);
	})
	.catch(err => {
		console.log(err);
		console.log('landed in bottom catch block')
	});


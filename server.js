const appConfig = require("./config");

const express = require("express");
const path = require('path');
//const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const graphqlTools = require('graphql-tools');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');

//const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
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

const graphqlSchema = loadFilesSync(path.join(__dirname, 'graphql', '*.graphql'), { extensions: ['graphql'] });
//console.log(graphqlSchema[0]);
// Add resolvers to the schema
// const schemaWithResolvers = addResolversToSchema({
// 	graphqlSchema,
// 	graphqlResolver,
// });
const schemaWithResolvers = makeExecutableSchema({
	typeDefs: graphqlSchema,
	resolvers: graphqlResolver,
});

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
mongoose.connect("mongodb://" + appConfig.db.hostname + ":" + appConfig.db.port + "/" + appConfig.db.name,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(result => {
		// Or Using the MongoDB backend
		app.listen(appConfig.app.port);
	})
	.catch(err => console.log(err));


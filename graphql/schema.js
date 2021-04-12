const { buildSchema } = require('graphql');

module.exports = buildSchema(`
	type User {
		_id: ID!
		firstName: String!
		lastName: String!
		email: String!
		password: String
	}

	type AuthData {
		token: String!
		userId: String!
	}

	input UserInputData {
		firstName: String!
		lastName: String!
		email: String!
		password: String!
	}

	type RootQuery {
		login(email: String!, password: String!): AuthData!
	}

	type RootMutation {
		createUser(userInput: UserInputData): User!
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`);

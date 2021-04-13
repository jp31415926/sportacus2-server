const { buildSchema } = require('graphql');

module.exports = buildSchema(`
	type User {
		_id: ID!
		username: String!
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
		username: String!
		firstName: String!
		lastName: String!
		email: String!
		password: String!
	}

	type RootQuery {
		login(emailOrUsername: String!, password: String!): AuthData!
	}

	type RootMutation {
		signup(userInput: UserInputData): User!
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`);

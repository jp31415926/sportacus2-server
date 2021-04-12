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


/*
Example query to create a new user:

mutation {
	signup(userInput:
		{
			username: "brainy",
			firstName: "Brainy",
			lastName: "Smurf",
			email: "brainy@smurf.com",
			password: "password"
		})
	{
		_id
		email
	}
}

Example response:
{
	"data": {
		"signup": {
			"_id": "607496f93704fd3149b1c1c3",
			"email": "brainy@smurf.com"
		}
	}
}

Or ERROR:
{
	"errors": [
		{
			"message": "User exists already!",
			"status": 500
		}
	],
	"data": null
}
*/

/*
Example login query:

{
	login(email: "brainy@smurf.com", password: "password") {
		token
		userId
	}
}

Example result:
{
	"data": {
		"login": {
			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDc0ODY1ZGE4NWQ4YzJjNzRjNDRhMjgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MTgyNTA0MTAsImV4cCI6MTYxODI1NDAxMH0.TRTtPcSO5rYSNSONRVK3cvTYnK7i_bPkL0zRrIa2hp8",
			"userId": "6074865da85d8c2c74c44a28"
		}
	}
}

OR error:

{
	"errors": [
		{
			"message": "Password is incorrect.",
			"status": 401
		}
	],
	"data": null
}

*/

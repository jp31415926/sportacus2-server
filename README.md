# Sportacus2 server
NodeJS/Express/GraphQL API server for Sportacus version 2.

## How to setup and run the server on your computer
This server is designed to run on a Linux-like OS. It will probably work on Windows too. The best way to use it on Windows is to install Windows Subsystem for Linux and then install it under Ubuntu.

1. Install mongodb for database. Default setup doesn't require a username/password for local connections.
  .
	Install locally on Linux:
`apt install mongodb`
	.
	Install locally on Windows:
https://www.mongodb.com/try/download/community
	.
	Use free cloud solution MondoDB Atlas:
https://www.mongodb.com/cloud/atlas

2. Install NodeJS
	Linux:
`apt install node`
	.
	Windows (make sure to check the box to add node tools to your path so you can run npm):
https://nodejs.org/en/

3. Use npm to install dependences
From a terminal on Windows or Linux:
	.
	For development environment:
`npm install`
	.
	For production environment:
`npm install --production`

4. Edit configuration as needed
Copy config-dist.js to config.js and edit it as needed. Make sure it's legal Javascript (as the .js extention implies).

5. Run the server
For development environment:
`nodemon start`
	.
	For production environment:
`NODE_ENV=production npm start-server`

## Using GraphiQL in development environment
Once the server is running, you can visit http://localhost:27017 (or the hostname and port as specified in your configuration) to access GraphiQL and testing various queries.

Some examples to start with:

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
`{
	"errors": [
		{
			"message": "User exists already!",
			"status": 500
		}
	],
	"data": null
}`

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


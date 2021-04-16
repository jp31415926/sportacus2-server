<p align="center">
  <a href="https://github.com/jp31415926/sportacus2-server/actions" target="_blank">
      <img src="https://github.com/jp31415926/sportacus2-server/actions/workflows/node.js.yml/badge.svg" alt="Tests" />
  </a>
  <img src="https://img.shields.io/github/release/jp31415926/sportacus2-server/all.svg" alt="Latest release" />

  <a href="https://opensource.org/licenses/GPL-3.0" target="_blank">
      <img src="https://img.shields.io/github/license/jp31415926/sportacus2-server" alt="GNU General Public License version 3" />
  </a>
    <a href="https://github.com/jp31415926/sportacus2-server/graphs/contributors" target="_blank">
        <img src="https://img.shields.io/github/contributors/jp31415926/sportacus2-server?label=code+contributors" alt="Contributors" />
    </a>
</p>

# Sportacus2 server
NodeJS/Express/GraphQL API server for Sportacus version 2.

## How to setup and run the server on your computer
This server is designed to run on a Linux-like OS. It will probably work on Windows too. The best way to use it on Windows is to install Windows Subsystem for Linux and then install it under Ubuntu.

1. Install mongodb for database. Default setup doesn't require a username/password for local connections.
  
    Install locally on Linux:
    `apt install mongodb`
  
    Install locally on Windows:
    https://www.mongodb.com/try/download/community
	
    Helpful database client (download "Robo 3T Only"):
    https://robomongo.org/download

    Maybe this creates a database user?

    db.createUser({
      user: "s2db",
      pwd: "sportacus2-db-password",
      roles: [ "dbAdmin", "readWrite" ]
    });

	  Use free cloud solution MondoDB Atlas:
    https://www.mongodb.com/cloud/atlas

2. Install NodeJS
  
    Linux:
    
    `apt install node`
	
	  Windows (make sure to check the box to add node tools to your path so you can run npm):

3. Use npm to install dependences
    
    From a terminal on Windows or Linux:
	
    For development environment:
    
    `npm install`
	
    For production environment:
    
    `npm install --production`

4. Edit configuration as needed
    
    Copy config-dist.js to config.js and edit it as needed. Make sure it's legal Javascript (as the .js extention implies).

5. Run the server
    
    For development environment:
    
    `nodemon start`

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
    {
      "errors": [
        {
          "message": "User exists already!",
          "status": 500
        }
      ],
      "data": null
    }
  
Example login query:

    {
      login(emailOrUsername: "brainy@smurf.com", password: "password") {
        token
        userId
      }
    }

Example result:

    {
      "data": {
        "login": {
          "token": "eyJhbGciO...<long string truncated>...rIa2hp8",
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


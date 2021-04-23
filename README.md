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
Refer to the [INSTALL.md](INSTALL.md) file for installation instructions.

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

Example response (note that the `_id` will not match your `_id`; they are generated randomly):

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
          "userId": "607496f93704fd3149b1c1c3"
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


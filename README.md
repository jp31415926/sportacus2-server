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

Example get a list of venues:

    query {
      getVenues {
        items {
          _id
          name
          longName
          latitude
          longitude
          url
          poc {
            _id
            name
            email
            phone
          }
          street1
          street2
          city
          state
          zipcode
          country
          parent
          children
          createdAt
          updatedAt
        }
        total
      }
    }

Example response:

    {
      "data": {
        "getVenues": {
          "items": [
            {
              "_id": "607cd91c0af32205fa79ed5c",
              "name": "Dublin Park",
              "longName": "Dublin Park",
              "latitude": null,
              "longitude": null,
              "url": null,
              "poc": [],
              "street1": null,
              "street2": null,
              "city": null,
              "state": null,
              "zipcode": null,
              "country": null,
              "parent": null,
              "children": [],
              "createdAt": "2021-04-19T01:13:00.853Z",
              "updatedAt": "2021-04-21T03:46:06.966Z"
            },
            {
              "_id": "608322c009689146caf6d1cf",
              "name": "Dublin 1",
              "longName": "Dublin Park 1",
              "latitude": "34.707771",
              "longitude": "-86.735505",
              "url": null,
              "poc": [],
              "street1": "8324 Madison Pike",
              "street2": null,
              "city": "Madison",
              "state": "AL",
              "zipcode": "35758",
              "country": null,
              "parent": "607cd91c0af32205fa79ed5c",
              "children": [],
              "createdAt": "2021-04-23T19:40:48.743Z",
              "updatedAt": "2021-04-23T19:40:48.743Z"
            }
          ],
          "total": 2
        }
      }
    }
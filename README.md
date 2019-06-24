# sportacus2-server

Sportacus 2 backend server

=== Setup For Development ===
things that we installed:

- install nodejs package (should include npm)
- npm init - create initial packages.json

Express

- npm install --save express
- run http server: node server.js

nodemon - restart server when files change (for development setup only)

- to have server restarted when files in project are changed:
- npm install --save-dev nodemon
- to start server with nodemon:
- npm start

morgan - logging to terminal

- to have logging info go to terminal:
- npm install --save morgan

Body Parser (parses get/post vars, etc)

- npm install --save body-parser

mongodb
On Windows development setup:

- download from https://www.mongodb.com/download-center/community

* create c:\data\db
* from command line, run "c:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"

mongoose - ODM for mongodb in javascript

- npm install --save mongoose

Multer

- More about Multer: https://github.com/expressjs/multer
- lets you part multi-encoded form data (fields and binary)
- npm install --save multer

bcrypt - hashing functions

- https://github.com/kelektiv/node.bcrypt.js
- npm install --save bcrypt

jsonwebtoken JWT

- More about JWT: https://jwt.io
- npm install --save jsonwebtoken

express-generator
npm install express-generator -g


# Install Sportacus 2 Server

## How to setup and run the server on your computer
This server is designed to run on a Linux-like OS. It will probably work on Windows too. The best way to use it on Windows is to install Windows Subsystem for Linux and then install it under Ubuntu.

1. Install mongodb for database. Default setup doesn't require a username/password for local connections. You'll want to change this on a production setup. I leave this as an exercise to the reader. :)

    - **On Linux**
    Install locally on Ubuntu 20.04. Note that this is not what MongoDB tells you to do. Their method gets you the latest version, but we don't need the latest at this time and this method is simplier. You can see their [instructions here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).

	    `apt install mongodb`
	    `sudo service mongodb start`
  
    - **On Windows**
    Download [installer](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) and install it. You can make it run as a service (so it runs all the time) or not. You can run it manually by creating a shortcut to `C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe` (at the time this was written). By default the database will be stored in `C:\data\db`. To change this, add the `--dbpath <path-to-db>`.
	
    - **On the Cloud**
    Use free cloud solution [MondoDB Atlas](https://www.mongodb.com/cloud/atlas)

1. Helpful [database client for Windows only](https://robomongo.org/download) (download "Robo 3T Only").

1. Install NodeJS
  
   - **On Linux**
   `apt install node`
	
   - **On Windows**
   Download [Windows installer](https://nodejs.org/en/download/) (make sure to check the box to add node tools to your path so you can run npm from the command line):

1. Use npm to install dependencies:
    
    From Powershell or the Command Prompt in Windows or a terminal in Linux:
	
    For development environment (recommended unless you are really running a public, production server):
    `npm install`
	
    For production environment:
    `npm install --production`

1. Edit configuration as needed
    Copy `config-dist.js` to `config.js` and edit `config.js` as needed. When you update from Github later, `config-dist.js` will be updated, but `config.js` will not be touched. This is what you want. Make sure it's legal Javascript (as the .js extension implies).

1. Run the server
    
    **For development environment**
    `nodemon start`

    **For production environment**
    `NODE_ENV=production npm start-server`

## Visual Studio Code Setup (optional)
1. Install Visual Studio Code (VScode).
2. Install the "REST Client" extension.
3. Load any of the files in the rest-files directory. Make sure the first line is pointing to your server configuration (in config.js). Then press the "Send Request" that should appear above the first line by the REST Client extension. Press that and the request will be sent to the server and a reply will appear in a split window on the right.


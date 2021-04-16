const ACL = require('acl2');


function init(client) {
	acl = new ACL.mongodbBackend({ client, useSingle: true });
}


// TODO: initialize some default permissions?


modules.export = acl;

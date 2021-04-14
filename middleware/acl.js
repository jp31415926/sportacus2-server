const ACL = require("acl2");

acl = new ACL(new ACL.mongodbBackend({ client: mongoClient }));

// TODO: initialize some default permissions?


modules.export = acl;

const appConfig = require('../config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	// default to no auth
	req.isAuth = false;
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		return next();
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, appConfig.app.secret);
	} catch (err) {
		return next();
	}
	if (!decodedToken) {
		return next();
	}
	req.userId = decodedToken.userId;
	req.isAuth = true;
	next();
};

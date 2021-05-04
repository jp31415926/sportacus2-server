
module.exports = (error, errors) => {
	let err = error;
	errors.forEach(e => {
		err += '; ' + e.message;
	});
	return err
}


module.exports = (error, errors) => {
	let err = '';
	errors.forEach(e => {
		err += '; ' + e.message;
	});
	return err
}

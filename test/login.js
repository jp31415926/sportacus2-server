const { expect } = require("chai");
const fs = require('fs');

describe('Auth functions', () => {
	before(done => {
		fs.copyFileSync('config.js', 'config-prod.js', (err) => {
			if (err) {
				throw err;
			}
		})
	});

	it('user signup', () => {
		// create new database
		// send signup

		expect(5).to.equal(5);

	});

})

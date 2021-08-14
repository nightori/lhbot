// https://github.com/PragunSaini/vndb-api
const VNDB = require('vndb-api');
const dayjs = require('dayjs');

// global objects
let vndb;

module.exports = {
	name: 'vndb',
	init() {
		// initialize the VNDB client with default settings
		vndb = new VNDB('lhbot-interaction');
	},
	destroy() {
		vndb.destroy();
	},

	// VNDB INTERACTION

	vnSearch(title, onSuccess, onError) {
		vndb
			.query(`get vn basic,details,staff (search ~ "${title}") {"sort":"popularity", "reverse":true}`)
			.then(onSuccess)
			.catch(onError)
	},

	getFullReleases(vnID, onSuccess, onError) {
		const today = dayjs().format('YYYY-MM-DD');
		vndb
			.query(`get release basic (vn = ${vnID} and type = "complete" and (languages = "en" or languages = "ru") and released <= "${today}") {"results":25}`)
			.then(onSuccess)
			.catch(onError)
	},
	
	getCharInfo(name, onSuccess, onError) {
		// default filter expression
		let filter = `search ~ "${name}"`;

		// if the reversed name is not the same as the original, add it to the filter
		const reversed = name.split(' ').reverse().join(' ');
		if (name != reversed) filter += ` or search ~ "${reversed}"`;

		vndb
			.query(`get character basic,details,vns,voiced (${filter}) {"sort":"id", "results":1}`)
			.then(onSuccess)
			.catch(onError)
	},

	getVnInfo(ids, onSuccess, onError) {
		vndb
			.query(`get vn basic (id = [${ids}]) {"sort":"id", "results":25}`)
			.then(onSuccess)
			.catch(onError)
	},

	getStaffInfo(ids, onSuccess, onError) {
		vndb
			.query(`get staff basic (id = [${ids}]) {"sort":"id", "results":25}`)
			.then(onSuccess)
			.catch(onError)
	},

	getRandomQuote(onSuccess, onError) {
		vndb
			.query('get quote basic (id >= 1) {"results":1}')
			.then(onSuccess)
			.catch(onError)
	},

	getQuotes(vnID, onSuccess, onError) {
		vndb
			.query(`get quote basic (id = ${vnID}) {"sort":"id", "results":25}`)
			.then(onSuccess)
			.catch(onError)
	},

	// UTILITY

	formatDescription(description) {
		if (!description) return null;
	
		// full description with garbage removed
		const descFull = description
			.replace(/\[url=\/c\d+\]/g, '')
			.replace(/\[.*\]/g, '')
			.trim();

		// second check for emptiness
		if (!descFull) return null;
	
		// description split into paragraphs
		const descArray = descFull.split('\n\n');
	
		// the default desc is the first paragraph
		let desc = descArray[0], cut = false;
	
		// from second paragraph forward
		for (var i = 1; i < descArray.length; i++) {
			// ignore this garbage
			if (descArray[i].trim() == 'From') break;

			// add new paragraph to the desc
			const newDesc = desc + '\n\n' + descArray[i];
	
			// if the result is too long, cut it
			if (newDesc.length > 500) {
				cut = true;
				break;
			}
	
			// else save the desc
			else desc = newDesc;
		}
	
		// if we cut anything, add this text
		if (cut) desc += '\n\n*[visit the VNDB page to read the full description]*';
	
		return desc;
	}
};
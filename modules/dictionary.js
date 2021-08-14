const dict = require('./../static/dictionary.json');
const words = require('./../static/words.json');

module.exports = {
	name: 'dictionary',

	// PUBLIC API

	getRandomWord() {
		const wordlist = words['words'];
		return wordlist[Math.floor(Math.random()*wordlist.length)];
	},

	getDefinition(word) {
		const def = dict[word];
		return def ? def.definition : null;
	}
};
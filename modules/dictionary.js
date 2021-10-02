import dict from './../static/dictionary.js';
import words from './../static/words.js';

export const name = 'dictionary';

export function getRandomWord() {
	const wordlist = words['words'];
	return wordlist[Math.floor(Math.random() * wordlist.length)];
}

export function getDefinition(word) {
	const def = dict[word];
	return def ? def.definition : null;
}

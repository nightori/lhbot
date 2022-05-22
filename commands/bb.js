import { MessageAttachment } from 'discord.js';
import sharp from 'sharp';
import fs from 'fs';

export const names = ['bb', 'elems', 'chem'];
export const description = 'Сделать картинку в стиле Breaking Bad';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

// list of all elements
let elems;

const SIZE = 118, PADDING = 5, MAXLEN = 30;

export function execute(msg) {
	// load element list if necessary
	const elemDir = `${msg.client.appDir}/static/bb/`;
	init(elemDir);

	// get and validate the string
	const str = msg.argsline
		.toLowerCase()
		.replace(/ /g, '-');
	
	if (!/^[a-z\-]+$/.test(str)) {
		msg.reply('Указана некорректная строка.');
		return;
	}

	// split the string into elements
	const arr = split([], str);

	// check the result
	if (!arr) {
		msg.reply('Невозможно составить из элементов.');
		return;
	}
	if (arr.length > MAXLEN) {
		msg.reply('Указана слишком длинная строка.');
		return;
	}

	// construct initial image
	const image = sharp(`${elemDir}${arr[0]}.png`).resize(
		(SIZE + PADDING) * arr.length - PADDING, SIZE,
		{ fit: 'contain', position: 'left', background: { r: 0, g: 0, b: 0, alpha: 0 } }
	);

	// add each element
	const elemPics = [];
	for (let i = 1; i < arr.length; i++) {
		elemPics.push({
			input: `${elemDir}${arr[i]}.png`,
			left: i * (SIZE + PADDING),
			top: 0
		});
	}

	// finalize the image and send it
	image
		.composite(elemPics)
		.toBuffer()
		.then(data => {
			const image = new MessageAttachment(data, `${str}.png`);
			msg.channel.send({ files: [image] });
		})
		.catch(msg.errorHandler);
}

// load element list if necessary
function init(dir) {
	if (!elems) {
		elems = fs.readdirSync(dir)
			.filter(s => s.endsWith('.png'))
			.map(s => s.slice(0, -4));
	}
}

// element splitting algorithm

function split(arr, str) {
	if (!str) return arr;
	return splitBy(2, arr, str) || splitBy(1, arr, str) || null;
}

function splitBy(n, arr, str) {
	const el = str.slice(0, n);
	str = str.slice(n);
	
	if (elems.includes(el)) {
		arr = arr.concat([el]);
		return split(arr, str);
	}
	
	return null;
}

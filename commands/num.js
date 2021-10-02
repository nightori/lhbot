import { MessageAttachment } from 'discord.js';
import sharp from 'sharp';

export const names = ['num', 'number'];
export const description = 'Сделать аниме-картинку с числом';
export const args = ['[number]'];
export const restricted = false;
export const serverOnly = false;
export const hidden = false;

const WIDTH = 68, HEIGHT = 150, MAXLEN = 100;

export function execute(msg) {
	// get and validate the number
	const n = msg.argsline;
	if (!/^[\d ]+$/.test(n)) {
		msg.reply('Указано некорректное число.');
		return;
	}
	if (n.length > MAXLEN) {
		msg.reply('Указано слишком большое число.');
		return;
	}

	// initial image
	const image = sharp(`${msg.client.appDir}/static/num/${n[0]}.gif`).resize(
		WIDTH * n.length, HEIGHT,
		{ fit: 'contain', position: 'left', background: { r: 0, g: 0, b: 0, alpha: 0 } }
	);

	// add each digit
	const digits = [];
	for (let i = 1; i < n.length; i++) {
		if (n[i] == ' ')
			continue;
		digits.push({
			input: `${msg.client.appDir}/static/num/${n[i]}.gif`,
			left: i * WIDTH + 1,
			top: 1
		});
	}

	image
		.composite(digits)
		.toBuffer()
		.then(data => {
			const image = new MessageAttachment(data, `${n}.png`);
			msg.channel.send({ files: [image] });
		})
		.catch(msg.errorHandler);
}

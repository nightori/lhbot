const Discord = require('discord.js');
const sharp = require('sharp');
const appDir = require('path').dirname(require.main.filename);

const WIDTH = 68, HEIGHT = 150, MAXLEN = 100;

module.exports = {
	names: ['num', 'number'],
	description: 'Сделать аниме-картинку с числом',
	args: ['[number]'],
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		// get and validate the number
		const n = msg.argsline;
		if (!/^[\d ]+$/.test(n)) {
			msg.respond(`Указано некорректное число.`);
			return;
		}
		if (n.length > MAXLEN) {
			msg.respond(`Указано слишком большое число.`);
			return;
		}

		// initial image
		var image = sharp(`${appDir}/static/num/${n[0]}.gif`).resize(
			WIDTH * n.length, HEIGHT,
			{fit: 'contain', position: 'left', background: {r:0, g:0, b:0, alpha:0}}
		);

		// add each digit
		var digits = [];
		for (var i = 1; i < n.length; i++) {
			if (n[i] == ' ') continue;
			digits.push({
				input: `${appDir}/static/num/${n[i]}.gif`,
				left: i * WIDTH + 1,
				top: 1
			});
		}

		image
			.composite(digits)
			.toBuffer()
			.then(data => {
				const image = new Discord.MessageAttachment(data, `${n}.png`);
				msg.channel.send(image);
			})
			.catch(msg.errorHandler)
	}
};
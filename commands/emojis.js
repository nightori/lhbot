const Discord = require('discord.js');
const request = require('request');
const ZipStream = require('zip-stream');
const streamBuffers = require('stream-buffers');

module.exports = {
	names: ['emojis'],
	description: 'Получить все эмодзи сервера',
	args: null,
	restricted: false,
	serverOnly: true,
	hidden: true,
	execute(msg) {
		msg.channel.send('Начата загрузка и упаковка, подождите...');

		// map all emojis to a collection
		const emojis = msg.guild.emojis.cache.map(e => {
			const ext = e.animated ? "gif" : "png";
			return {'name': `${e.name}.${ext}`, 'url': e.url};
		});

		// initialize the archive and its output buffer
		const zip = new ZipStream();
		const streamBuffer = new streamBuffers.WritableStreamBuffer({
			initialSize: (100 * 1024),
			incrementAmount: (50 * 1024)
		});
		zip.pipe(streamBuffer);

		function addNextFile() {
			// get the emoji and fetch it
			const emoji = emojis.shift();
			const stream = request(emoji.url);

			// add it to the archive
			zip.entry(stream, {name: emoji.name}, err => {
				if (err) msg.errorHandler(err);
				if (emojis.length > 0) addNextFile();
				else {
					// we're done, send the buffer
					zip.finalize();
					const file = new Discord.MessageAttachment(streamBuffer.getContents(), 'emojis.zip');
					msg.channel.send('Готово!', file);
				}
			});
		}

		// start the process
		addNextFile();
	}
};
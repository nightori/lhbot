import { MessageAttachment } from 'discord.js';
import dayjs from 'dayjs';
import request from 'request';
import ZipStream from 'zip-stream';
import { WritableStreamBuffer } from 'stream-buffers';

export const names = ['emojis', 'эмодзи', 'эмошки'];
export const description = 'Получить все эмодзи сервера';
export const args = null;
export const restricted = false;
export const serverOnly = true;
export const botChannelOnly = true;
export const hidden = true;

export function execute(msg) {
	msg.channel.send('Начата загрузка и упаковка, подождите...');

	// map all emojis to a collection
	const emojis = msg.guild.emojis.cache.map(e => {
		const ext = e.animated ? "gif" : "png";
		return { 'name': `${e.name}.${ext}`, 'url': e.url };
	});

	// initialize the archive and its output buffer
	const zip = new ZipStream();
	const streamBuffer = new WritableStreamBuffer({
		initialSize: (100 * 1024),
		incrementAmount: (50 * 1024)
	});
	zip.pipe(streamBuffer);

	function addNextFile() {
		// get the emoji and fetch it
		const emoji = emojis.shift();
		const stream = request(emoji.url);

		// add it to the archive
		zip.entry(stream, { name: emoji.name }, err => {
			if (err) msg.errorHandler(err);

			// check if there's no emojis left
			if (emojis.length == 0) {
				// we're done, send the buffer
				zip.finalize();
				const filename = `emojis_${dayjs().format('DD.MM.YYYY')}.zip`;
				const file = new MessageAttachment(streamBuffer.getContents(), filename);
				msg.channel.send({ content: 'Готово!', files: [file] });
			}
			else addNextFile();
		});
	}

	// start the process
	addNextFile();
}

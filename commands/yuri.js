import { MessageAttachment } from 'discord.js';
import request from 'request';

export const names = ['yuri'];
export const description = 'Показать случайную юри-картинку';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const hidden = false;

export function execute(msg) {
	// constant URL of Yuri RFS endpoint
	const url = 'https://nightori.ru/yuri.jpg';

	// download the picture and send it
	request({url, encoding: null}, (err, resp, buffer) => {
		const file = new MessageAttachment(buffer, `yuri.jpg`);
		msg.channel.send({ files: [file] });
	});
}

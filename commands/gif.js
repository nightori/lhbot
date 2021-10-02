import { MessageAttachment } from 'discord.js';
import request from 'request';

export const names = ['gif'];
export const description = 'Сконвертировать картинку в gif';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const hidden = false;

// global references
let message, utils;

export function execute(msg) {
	// save the message object
	message = msg;

	// get the referenced message and call the callback
	utils = msg.client.modules.get('utils');
	utils.getRefMessageAndCall(msg, refCallback);
}

function refCallback(refMessage) {
	// get the direct picture URL from the message/refMessage
	const url = utils.getPictureFromMessage(message) || utils.getPictureFromMessage(refMessage);
		
	// if a URL was found
	if (url) {
		// download and resend with "gif" extension
		// dunno why this works but I'm not complaining
		request({url, encoding: null}, (err, resp, buffer) => {
			const file = new MessageAttachment(buffer, `converted.gif`);
			message.channel.send({ files: [file] });
		});
	}
	// if it wasn't
	else {
		message.reply('Нужно загрузить картинку, указать сообщение с ней или ссылку на неё.');
	}
}
